'use client'

import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

// Brain cutout is drawn inside the canvas with this much empty margin, so dents and smears never clip
const PAD = 0.1
const HAND_RATIO = 884 / 560
const TIP = { x: 0.52, y: 0.06 } // fingertip position inside the hand image

// p = where each line lands on the brain image (0..1, from top-left)
const LEFT = [
    { href: '/questions', title: 'Questions', description: 'Explore through inquiry', p: [0.361, 0.142] },
    { href: '/explain', title: 'Explain', description: 'Understand through conversation', p: [0.156, 0.32] },
    { href: '/vibe', title: 'Vibe', description: 'Start from a feeling', p: [0.229, 0.589] },
]
const RIGHT = [
    { href: '/interdisciplinary', title: 'Interdisciplinary', description: 'Merge disciplines, find connections', p: [0.698, 0.113] },
    { href: '/inkblot', title: 'Inkblot', description: 'You are what you see', p: [0.865, 0.382] },
    { href: '/define', title: 'Define', description: 'Clarify through reflection', p: [0.752, 0.565] },
]
const SKETCHES = [
    { href: '/deck', title: 'Deck' },
    { href: '/receipt', title: 'Receipt' },
]
const ALL = [...LEFT.map(r => ({ ...r, side: 'left' })), ...RIGHT.map(r => ({ ...r, side: 'right' }))]

// leaves the label horizontally, then bends into its spot on the brain
const curve = (x1, y1, x2, y2) => `M${x1} ${y1} Q${x1 + (x2 - x1) * 0.7} ${y1} ${x2} ${y2}`

const vert = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
}`

const frag = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform float u_time;
uniform float u_pad;
uniform float u_wobble;
uniform vec2 u_aspect;
uniform vec3 u_p0;   // user hand: uv + press
uniform vec2 u_smear;
uniform vec2 u_jello; // whole-body shear and squash

float falloff(vec2 uv, vec2 p, float r) {
    vec2 d = (uv - p) * u_aspect;
    return exp(-dot(d, d) / (r * r));
}

void main() {
    // the whole brain sways like a jelly on a plate: sheared sideways, squashed down, anchored at its base
    vec2 base = vec2(0.5, 0.18);
    vec2 q = v_uv - base;
    float h = max(q.y, 0.0);
    q.x -= u_jello.x * h;
    q.y /= 1.0 + u_jello.y;
    q.x /= 1.0 - u_jello.y * 0.5;
    vec2 uv = base + q;

    float f0 = falloff(uv, u_p0.xy, 0.13);
    // a firm press dents it a little
    uv += (uv - u_p0.xy) * f0 * u_p0.z * 0.22;
    // dragging drags the surface a little
    uv -= u_smear * f0 * 1.2;
    // barely breathing
    uv += 0.001 * vec2(sin(v_uv.y * 5.0 + u_time * 1.3), cos(v_uv.x * 4.0 + u_time * 1.1));

    vec2 b = (uv - u_pad) / (1.0 - 2.0 * u_pad);
    vec4 c = vec4(0.0);
    if (b.x > 0.0 && b.y > 0.0 && b.x < 1.0 && b.y < 1.0) c = texture2D(u_tex, vec2(b.x, 1.0 - b.y));

    // shadow inside the dents
    c.rgb *= 1.0 - 0.22 * f0 * u_p0.z;

    gl_FragColor = c;
}`

function setupGL(canvas) {
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: true })
    if (!gl) return null
    const compile = (type, src) => {
        const s = gl.createShader(type)
        gl.shaderSource(s, src)
        gl.compileShader(s)
        return s
    }
    const prog = gl.createProgram()
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'a_position')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    const u = name => gl.getUniformLocation(prog, name)
    return {
        gl, tex,
        u: {
            time: u('u_time'), pad: u('u_pad'), wobble: u('u_wobble'),
            aspect: u('u_aspect'), p0: u('u_p0'), smear: u('u_smear'), jello: u('u_jello'),
        },
    }
}

export default function BrainChart() {
    const mainRef = useRef(null)
    const wrapRef = useRef(null)
    const stageRef = useRef(null)
    const canvasRef = useRef(null)
    const userHandRef = useRef(null)
    const labelRefs = useRef([])
    const anchorRefs = useRef([])
    const lineRefs = useRef([])
    const linesRef = useRef([])
    const [hovered, setHovered] = useState(null)
    const [lines, setLines] = useState([])
    const [glFailed, setGlFailed] = useState(false)
    linesRef.current = lines

    // leader lines from each label to its region
    useLayoutEffect(() => {
        const compute = () => {
            const wrap = wrapRef.current.getBoundingClientRect()
            const stage = stageRef.current.getBoundingClientRect()
            setLines(ALL.map((r, i) => {
                const a = anchorRefs.current[i].getBoundingClientRect()
                return {
                    x1: (r.side === 'left' ? a.right + 10 : a.left - 10) - wrap.left,
                    y1: a.top + a.height * 0.55 - wrap.top,
                    x2: stage.left + (PAD + r.p[0] * (1 - 2 * PAD)) * stage.width - wrap.left,
                    y2: stage.top + (PAD + r.p[1] * (1 - 2 * PAD)) * stage.height - wrap.top,
                }
            }))
        }
        compute()
        const ro = new ResizeObserver(compute)
        ro.observe(wrapRef.current)
        document.fonts?.ready.then(compute)
        return () => ro.disconnect()
    }, [])

    // the brain, the hands, the kneading
    useEffect(() => {
        const canvas = canvasRef.current
        const glState = setupGL(canvas)
        if (!glState) setGlFailed(true)
        const { gl, tex, u } = glState || {}

        let ready = false
        if (gl) {
            const img = new Image()
            img.onload = () => {
                gl.bindTexture(gl.TEXTURE_2D, tex)
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
                ready = true
            }
            img.src = '/cutouts/brain.webp'
        }

        const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
        const fine = matchMedia('(pointer: fine)').matches

        let handW = 200
        const resize = () => {
            if (!userHandRef.current) return
            const r = canvas.getBoundingClientRect()
            const dpr = Math.min(2, window.devicePixelRatio || 1)
            canvas.width = Math.max(1, r.width * dpr)
            canvas.height = Math.max(1, r.height * dpr)
            gl?.viewport(0, 0, canvas.width, canvas.height)
            handW = Math.max(120, r.width * 0.27)
            // the arm runs from the fingertips to past the bottom of the screen
            const handH = handW * HAND_RATIO
            const el = userHandRef.current
            el.style.width = `${handW}px`
            el.style.height = `${Math.max(handH, handH * TIP.y + window.innerHeight + 100)}px`
            el.style.transformOrigin = `${handW * TIP.x}px ${handH * TIP.y}px`
            el.children[2].style.top = `${handH - 1}px`
        }
        resize()
        const ro = new ResizeObserver(resize)
        ro.observe(canvas)

        const s = {
            px: -9999, py: -9999, seen: false, down: false,
            hx: 0, hy: 0, rot: -14, lastPx: 0,
            press: 0, pressV: 0,
            lastUv: null, smearX: 0, smearY: 0,
            wobble: 0, shear: 0, shearV: 0, squash: 0, squashV: 0,
            kneaded: -1,
        }

        const insideStage = (x, y) => {
            const r = canvas.getBoundingClientRect()
            return x > r.left && x < r.right && y > r.top && y < r.bottom
        }
        const onMove = e => {
            s.px = e.clientX; s.py = e.clientY
            if (!s.seen) { s.seen = true; s.hx = s.px; s.hy = s.py }
        }
        const onDown = e => {
            onMove(e)
            if (insideStage(e.clientX, e.clientY)) s.down = true
        }
        const onUp = () => { s.down = false; s.lastUv = null }
        window.addEventListener('pointermove', onMove)
        window.addEventListener('pointerdown', onDown)
        window.addEventListener('pointerup', onUp)
        window.addEventListener('pointercancel', onUp)

        const toUv = (x, y, rect) => ({ x: (x - rect.left) / rect.width, y: 1 - (y - rect.top) / rect.height })

        const placeHand = (el, x, y, rot, scale, pressed, opacity) => {
            el.style.transform = `translate(${x - handW * TIP.x}px, ${y - handW * HAND_RATIO * TIP.y}px) rotate(${rot}deg) scale(${scale})`
            el.style.opacity = opacity
            el.children[0].style.opacity = pressed ? 0 : 1
            el.children[1].style.opacity = pressed ? 1 : 0
        }

        let raf
        const frame = (now) => {
            if (!mainRef.current || !userHandRef.current) return
            const t = now / 1000
            const rect = canvas.getBoundingClientRect()

            // ---- your hand
            const target = s.down ? 1 : 0
            s.pressV += (target - s.press) * 0.32
            s.pressV *= 0.62
            s.press += s.pressV

            const uv = toUv(s.px, s.py, rect)
            let speed = 0
            if (s.down && s.lastUv) {
                const dx = uv.x - s.lastUv.x, dy = uv.y - s.lastUv.y
                speed = Math.hypot(dx, dy)
                s.smearX = s.smearX * 0.82 + dx * 0.9
                s.smearY = s.smearY * 0.82 + dy * 0.9
            } else {
                s.smearX *= 0.85
                s.smearY *= 0.85
            }
            if (s.down) s.lastUv = uv
            s.wobble = Math.min(1, s.wobble * 0.93 + speed * 6)

            // jello springs: stiff, lightly damped, so the shape rings back after each push
            // dragging sets a soft-limited target (tanh, so it eases toward the max instead of slamming into it); the spring overshoots and rings
            const shearTarget = s.down ? 0.1 * Math.tanh(s.smearX * 4) : 0
            s.shearV += (shearTarget - s.shear) * 0.07
            s.shearV *= 0.93
            s.shear += s.shearV
            s.squashV += (-0.05 * Math.max(0, s.press) - s.squash) * 0.12
            s.squashV *= 0.86
            s.squash += s.squashV

            s.hx += (s.px - s.hx) * 0.45
            s.hy += (s.py - s.hy) * 0.45
            const vx = s.px - s.lastPx
            s.lastPx = s.px
            s.rot += ((-14 + Math.max(-22, Math.min(22, vx * 0.9))) - s.rot) * 0.15

            // which region is under your fingers
            let near = -1
            if (s.press > 0.3) {
                const bx = (uv.x - PAD) / (1 - 2 * PAD), by = 1 - (uv.y - PAD) / (1 - 2 * PAD)
                let best = 0.22
                ALL.forEach((r, i) => {
                    const d = Math.hypot(r.p[0] - bx, (r.p[1] - by) * 0.8)
                    if (d < best) { best = d; near = i }
                })
            }
            if (near !== s.kneaded) {
                labelRefs.current.forEach((el, i) => el && (el.dataset.kneaded = i === near ? '1' : '0'))
                s.kneaded = near
            }

            // ---- draw
            if (ready) {
                gl.clearColor(0, 0, 0, 0)
                gl.clear(gl.COLOR_BUFFER_BIT)
                gl.uniform1f(u.time, t)
                gl.uniform1f(u.pad, PAD)
                gl.uniform1f(u.wobble, reduced ? 0 : s.wobble)
                gl.uniform2f(u.aspect, rect.width / rect.height, 1)
                gl.uniform3f(u.p0, uv.x, uv.y, Math.max(0, s.press))
                gl.uniform2f(u.smear, s.smearX, s.smearY)
                gl.uniform2f(u.jello, reduced ? 0 : s.shear, reduced ? 0 : s.squash)
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
            }

            // each line's far end rides its fold: invert the shader's warp so it lands where that spot is drawn now
            if (ready) {
                const wrapRect = wrapRef.current.getBoundingClientRect()
                const jx = reduced ? 0 : s.shear, jy = reduced ? 0 : s.squash
                const asp = rect.width / rect.height
                const press = Math.max(0, s.press)
                const warp = (vx, vy) => {
                    let qx = vx - 0.5, qy = vy - 0.18
                    qx -= jx * Math.max(qy, 0)
                    qy /= 1 + jy
                    qx /= 1 - jy * 0.5
                    let ux = 0.5 + qx, uy = 0.18 + qy
                    const dx = (ux - uv.x) * asp, dy = uy - uv.y
                    const f = Math.exp(-(dx * dx + dy * dy) / (0.13 * 0.13))
                    ux += (ux - uv.x) * f * press * 0.22 - s.smearX * f * 1.2 + 0.001 * Math.sin(vy * 5 + t * 1.3)
                    uy += (uy - uv.y) * f * press * 0.22 - s.smearY * f * 1.2 + 0.001 * Math.cos(vx * 4 + t * 1.1)
                    return [ux, uy]
                }
                ALL.forEach((r, i) => {
                    const el = lineRefs.current[i]
                    if (!el) return
                    const tx = PAD + r.p[0] * (1 - 2 * PAD), ty = 1 - (PAD + r.p[1] * (1 - 2 * PAD))
                    let vx = tx, vy = ty
                    for (let k = 0; k < 6; k++) {
                        const [wx, wy] = warp(vx, vy)
                        vx -= wx - tx; vy -= wy - ty
                    }
                    const l = linesRef.current[i]
                    if (l) el.setAttribute('d', curve(l.x1, l.y1, rect.left + vx * rect.width - wrapRect.left, rect.top + (1 - vy) * rect.height - wrapRect.top))
                })
            }

            placeHand(userHandRef.current, s.hx, s.hy, s.rot, 1 - s.press * 0.06, s.press > 0.4,
                fine ? (s.seen ? 1 : 0) : (s.press > 0.05 ? 1 : 0))

            raf = requestAnimationFrame(frame)
        }
        raf = requestAnimationFrame(frame)

        return () => {
            cancelAnimationFrame(raf)
            ro.disconnect()
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener('pointerdown', onDown)
            window.removeEventListener('pointerup', onUp)
            window.removeEventListener('pointercancel', onUp)
        }
    }, [])

    const label = (r, i) => (
        <li key={r.href} ref={el => (labelRefs.current[i] = el)} data-kneaded="0" className="group/label">
            <Link
                href={r.href}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                className={`block -mx-4 px-4 py-2.5 rounded-xl max-md:pointer-events-none max-md:opacity-40 transition-colors duration-200 hover:bg-paper/85 focus-visible:bg-paper/85 ${r.side === 'left' ? 'md:text-right' : ''}`}
            >
                <span
                        ref={el => (anchorRefs.current[i] = el)}
                        className="display inline-block text-[clamp(1.3rem,2.2vw,2.4rem)] group-hover/label:italic group-data-[kneaded=1]/label:animate-twitch"
                    >
                        {r.title}
                </span>
                <p className="hidden sm:block text-sm text-ink-soft leading-snug">{r.description}</p>
            </Link>
        </li>
    )

    return (
        <main
            ref={mainRef}
            className="h-dvh overflow-hidden flex flex-col select-none pointer-fine:cursor-none pointer-fine:[&_*]:cursor-none"
        >
            <header className="flex items-baseline justify-between gap-4 px-5 md:px-8 pt-4 md:pt-5">
                <h1 className="display text-2xl md:text-4xl">The Serendipity <em className="text-pink">Engine</em></h1>
                <p className="hidden sm:block display italic text-lg text-ink-soft">Small experiments to foster exploration and curiosity.</p>
            </header>

            <p className="md:hidden px-5 pt-2 text-sm text-ink-soft">The experiments are for desktop only.</p>

            <div ref={wrapRef} className="relative flex-1 min-h-0 grid grid-cols-2 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] content-center md:items-center gap-x-4 px-5 md:px-8 pb-4">
                <ul className="col-start-1 row-start-2 md:row-start-1 flex flex-col justify-around gap-2 md:gap-0 md:h-[80%]">
                    {LEFT.map((r, i) => label({ ...r, side: 'left' }, i))}
                </ul>

                <div
                    ref={stageRef}
                    className="relative col-span-2 md:col-span-1 md:col-start-2 row-start-1 w-[130%] justify-self-center md:w-[min(58vw,calc((100dvh-5rem)*1.244))] aspect-[1131/909] mx-auto touch-none"
                >
                    <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full drop-shadow-[16px_14px_0_#FF2D87] ${glFailed ? 'invisible' : ''}`} />
                    {glFailed && <img src="/cutouts/brain.webp" alt="" className="absolute inset-[10%] w-[80%] h-[80%] object-contain drop-shadow-[16px_14px_0_#FF2D87]" />}
                </div>

                <ul className="col-start-2 md:col-start-3 row-start-2 md:row-start-1 flex flex-col justify-around gap-2 md:gap-0 md:h-[80%]">
                    {RIGHT.map((r, i) => label({ ...r, side: 'right' }, i + LEFT.length))}
                </ul>

                <svg className="hidden md:block absolute inset-0 w-full h-full pointer-events-none overflow-visible" aria-hidden="true">
                    {lines.map((l, i) => (
                        <g key={i} className="transition-opacity" opacity={hovered === null || hovered === i ? 1 : 0.35}>
                            <path ref={el => (lineRefs.current[i] = el)} d={curve(l.x1, l.y1, l.x2, l.y2)} fill="none" stroke="#24201E" strokeWidth={hovered === i ? 2 : 1} />
                            <circle cx={l.x1} cy={l.y1} r="2" fill="#24201E" />
                        </g>
                    ))}
                </svg>
            </div>

            <footer className="flex justify-center gap-4 pb-2 text-base text-ink-soft/60">
                {SKETCHES.map(r => (
                    <Link key={r.href} href={r.href} className="px-8 py-4 rounded-xl max-md:pointer-events-none max-md:opacity-40 hover:bg-paper/85 hover:text-ink hover:italic transition-colors">{r.title}</Link>
                ))}
            </footer>

            <Hand ref={userHandRef} />
        </main>
    )
}

function Hand({ ref }) {
    return (
        <div
            ref={ref}
            aria-hidden="true"
            className="fixed top-0 left-0 z-50 pointer-events-none opacity-0 will-change-transform drop-shadow-[0_18px_22px_rgb(36_32_30/0.35)]"
        >
            <img src="/cutouts/hand.webp" alt="" draggable="false" className="absolute top-0 left-0 w-full" />
            <img src="/cutouts/hand-press.webp" alt="" draggable="false" className="absolute top-0 left-0 w-full opacity-0" />
            <div className="absolute left-0 w-full bottom-0 bg-[url(/cutouts/arm.webp)] bg-repeat-y bg-[length:100%_auto]" />
        </div>
    )
}
