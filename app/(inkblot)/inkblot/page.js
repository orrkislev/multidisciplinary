'use client'

import { useRef, useEffect, useState } from 'react';
import { generateRoles } from './actions';
import HomeButton from '../../(__components)/HomeButton';

const vertSrc = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const fragSrc = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_texture;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_strength;
uniform float u_sym; // 0: none, 2: mirror, 3/4: kaleidoscope

// simplex-style noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec2 mod289v2(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289v2(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                             + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                             dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

vec2 fold(vec2 uv) {
    if (u_sym < 1.0) return uv;
    if (u_sym < 2.5) return vec2(0.5 + abs(uv.x - 0.5), uv.y);
    vec2 p = uv - 0.5;
    float r = length(p);
    float sector = 6.2831853 / u_sym;
    float a = mod(atan(p.y, p.x), sector);
    if (a > sector * 0.5) a = sector - a;
    return 0.5 + r * vec2(cos(a), sin(a));
}

void main() {
    vec2 uv = fold(v_uv);
    float aspect = u_resolution.x / u_resolution.y;

    // domain warping: displace UV with layered noise
    vec2 coords = uv * u_scale;
    coords.x *= aspect;

    // first layer
    float n1 = snoise(coords + u_time * 0.1);
    float n2 = snoise(coords + vec2(5.2, 1.3) + u_time * 0.1);

    // second layer (warp the warp)
    float n3 = snoise(coords + vec2(n1, n2) * 2.0 + vec2(1.7, 9.2));
    float n4 = snoise(coords + vec2(n1, n2) * 2.0 + vec2(8.3, 2.8));

    vec2 displaced = uv + vec2(n3, n4) * u_strength;

    gl_FragColor = texture2D(u_texture, displaced);
}`;

function initGL(canvas, sourceCanvas) {
    const gl = canvas.getContext('webgl');
    if (!gl) return null;

    function compile(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vertSrc));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragSrc));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // fullscreen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // texture from source canvas
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uScale = gl.getUniformLocation(prog, 'u_scale');
    const uStrength = gl.getUniformLocation(prog, 'u_strength');
    const uSym = gl.getUniformLocation(prog, 'u_sym');

    return { gl, uTime, uRes, uScale, uStrength, uSym };
}

export default function Page() {
    const canvasRef = useRef(null);
    const drawRef = useRef(null);
    const [color, setColor] = useState('black');
    const [labels, setLabels] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [roles, setRoles] = useState(null);
    const [loading, setLoading] = useState(false);
    const [canvasKey, setCanvasKey] = useState(0);

    function addLabel() {
        const val = inputValue.trim();
        if (val && labels.length < 3) {
            setLabels(prev => [...prev, val]);
            setInputValue('');
        }
    }

    async function handleDone() {
        setLoading(true);
        const result = await generateRoles(labels);
        setRoles(result);
        setLoading(false);
    }

    const triggered = useRef(false);
    useEffect(() => {
        if (labels.length >= 3 && !triggered.current) {
            triggered.current = true;
            handleDone();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [labels]);

    useEffect(() => {
        const drawCanvas = drawRef.current;
        if (!drawCanvas) return;

        const dpr = window.devicePixelRatio || 1;
        const cssSize = Math.min(window.innerWidth, window.innerHeight) * 0.7;
        drawCanvas.width = cssSize * dpr;
        drawCanvas.height = cssSize * dpr;
        const drawCtx = drawCanvas.getContext('2d');
        drawCtx.scale(dpr, dpr);
        drawCtx.lineCap = 'round';
        drawCtx.lineJoin = 'round';

        let drawing = false;
        let lastX, lastY;
        let dist = 0;
        let velocity = 0;

        function getPos(e) {
            const rect = drawCanvas.getBoundingClientRect();
            return [e.clientX - rect.left, e.clientY - rect.top];
        }

        function onDown(e) {
            drawing = true;
            [lastX, lastY] = getPos(e);
            dist = Math.random() * 100;
            velocity = 0;
        }
        function onMove(e) {
            if (!drawing) return;
            const [x, y] = getPos(e);
            const dx = x - lastX;
            const dy = y - lastY;
            const seg = Math.sqrt(dx * dx + dy * dy);
            dist += seg;
            velocity = velocity * 0.7 + seg * 0.3;

            const base = 5;
            const speedThin = Math.max(0.4, 1 - velocity * 0.04);
            const wave = Math.sin(dist * 0.08) * 0.4 + Math.sin(dist * 0.03) * 0.3;
            drawCtx.lineWidth = base * speedThin + wave;

            drawCtx.strokeStyle = drawCanvas.dataset.color === 'white' ? '#FAF9F7' : '#24201E';
            drawCtx.beginPath();
            drawCtx.moveTo(lastX, lastY);
            drawCtx.lineTo(x, y);
            drawCtx.stroke();
            lastX = x;
            lastY = y;
        }
        function onUp() {
            drawing = false;
        }

        drawCanvas.addEventListener('pointerdown', onDown);
        drawCanvas.addEventListener('pointermove', onMove);
        drawCanvas.addEventListener('pointerup', onUp);
        drawCanvas.addEventListener('pointerleave', onUp);

        return () => {
            drawCanvas.removeEventListener('pointerdown', onDown);
            drawCanvas.removeEventListener('pointermove', onMove);
            drawCanvas.removeEventListener('pointerup', onUp);
            drawCanvas.removeEventListener('pointerleave', onUp);
        };
    }, []);

    useEffect(() => {
        if (drawRef.current) drawRef.current.dataset.color = color;
    }, [color]);

    useEffect(() => {
        if (!canvasRef.current) return;

        const dpr = window.devicePixelRatio || 1;
        const size = Math.min(window.innerWidth, window.innerHeight) * 0.7 * dpr;
        const width = size;
        const height = size;

        // offscreen canvas for 2D drawing
        const offscreen = document.createElement('canvas');
        offscreen.width = width;
        offscreen.height = height;
        const ctx = offscreen.getContext('2d');

        const random = (a = 1, b = 0) => Math.random() * (b - a) + a;

        ctx.fillStyle = '#24201E';
        // blobs scattered inside a central disc, so folded blots come out round rather than boxy
        for (let i = 0; i < 12; i++) {
            const angle = random(0, Math.PI * 2), dist = Math.sqrt(random(0, 1)) * width * .3;
            ctx.beginPath();
            ctx.arc(width / 2 + Math.cos(angle) * dist, height / 2 + Math.sin(angle) * dist,
                random(width * .03, width * .1), 0, Math.PI * 2);
            ctx.fill();
        }

        // set up WebGL canvas
        const glCanvas = canvasRef.current;
        glCanvas.width = width;
        glCanvas.height = height;

        const state = initGL(glCanvas, offscreen);
        if (!state) return;

        const { gl, uTime, uRes, uScale, uStrength, uSym } = state;
        gl.viewport(0, 0, width, height);
        gl.uniform2f(uRes, width, height);
        gl.uniform1f(uScale, random(1, 2.5));
        gl.uniform1f(uStrength, random(0.015, 0.04));
        // most blots are symmetric, like the real cards
        gl.uniform1f(uSym, random() < 0.15 ? 0 : [2, 2, 3, 4][Math.floor(random(0, 4))]);

        // a new blot starts with a clean drawing layer
        const draw = drawRef.current;
        if (draw) draw.getContext('2d').clearRect(0, 0, draw.width, draw.height);

        let frame;
        const start = performance.now();
        function render() {
            const t = (performance.now() - start) / 1000;
            gl.uniform1f(uTime, t);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
        render();

        return () => cancelAnimationFrame(frame);
    }, [canvasKey]);

    if (labels.length >= 3) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-5 bg-stone">
                <div className="flex gap-3 flex-wrap justify-center">
                    {labels.map((label, i) => (
                        <span key={i} className="bg-paper rounded-full px-4 py-1.5 text-sm">
                            {label}
                        </span>
                    ))}
                </div>

                {loading && (
                    <div className="w-14 h-14 bg-ink rounded-[46%_54%_50%_50%/55%_50%_50%_45%] animate-breathe" />
                )}

                {roles && (
                    <>
                        <div className="flex gap-4 flex-wrap justify-center max-w-[700px]">
                            {roles.map((role, i) => (
                                <div key={i} className="paper knead p-6 flex-[1_1_200px] min-w-[180px] cursor-default animate-fade-in">
                                    <div className="display text-xl mb-2">{role.title}</div>
                                    <div className="text-lg leading-snug font-medium">{role.question}</div>
                                    <div className="text-sm text-ink-soft mt-2 leading-relaxed">{role.description}</div>
                                    <div className="text-xs mt-4 bg-stone rounded-2xl px-3 py-2">
                                        <strong>Constraint:</strong> {role.constraint}
                                    </div>
                                    <div className="text-xs text-ink-soft mt-3">
                                        <strong>Obsession:</strong> {role.obsession}
                                    </div>
                                    <div className="text-xs text-ink-soft mt-3">
                                        <strong>Read first:</strong> {role.readFirst}
                                    </div>
                                    <div className="text-xs text-ink-soft mt-3">
                                        <strong>Dig into:</strong> {role.digInto}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => { setLabels([]); setRoles(null); triggered.current = false; }}
                            className="pebble-btn"
                        >
                            Try again
                        </button>
                    </>
                )}
                <HomeButton />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-5 bg-stone">
            <h1 className="display text-4xl md:text-5xl text-center">Tell me what you see</h1>

            <div className="flex gap-2.5 items-center">
                <input
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addLabel()}
                    placeholder="what do you see?"
                    className="field text-sm w-56"
                />
                <button
                    onClick={addLabel}
                    disabled={!inputValue.trim()}
                    className="pebble-btn text-sm"
                >
                    Add
                </button>
            </div>

            {labels.length > 0 && (
                <div className="flex gap-2 flex-wrap justify-center">
                    {labels.map((label, i) => (
                        <span key={i} className="bg-paper rounded-full pl-3 pr-2 py-1 text-sm flex items-center gap-1.5 animate-fade-in">
                            {label}
                            <button
                                onClick={() => setLabels(prev => prev.filter((_, j) => j !== i))}
                                aria-label="Remove" className="bg-transparent border-none cursor-pointer text-ink-soft transition-all duration-150 hover:text-pink hover:scale-125"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <div className="relative w-[70vmin] h-[70vmin] paper overflow-hidden">
                <canvas ref={canvasRef} className="w-full h-full" />
                <canvas ref={drawRef} className="absolute top-0 left-0 w-full h-full cursor-crosshair" />
                <div className="absolute top-3 right-3 flex gap-2">
                    <button
                        onClick={() => setColor('black')}
                        aria-label="Ink" className={`w-8 h-8 rounded-full bg-ink cursor-pointer transition-transform duration-300 ease-squish hover:scale-110 ${color === 'black' ? 'ring-4 ring-stone scale-110' : ''}`}
                    />
                    <button
                        onClick={() => setColor('white')}
                        aria-label="Eraser" className={`w-8 h-8 rounded-full bg-paper shadow-[inset_0_0_0_2px_rgb(36_32_30/0.15)] cursor-pointer transition-transform duration-300 ease-squish hover:scale-110 ${color === 'white' ? 'ring-4 ring-stone scale-110' : ''}`}
                    />
                </div>
            </div>

            <button
                onClick={() => setCanvasKey(k => k + 1)}
                className="pebble-btn-soft"
            >
                New blot
            </button>
            <HomeButton />
        </div>
    )
}