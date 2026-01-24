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

void main() {
    vec2 uv = v_uv;
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

    return { gl, uTime, uRes, uScale, uStrength };
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

            drawCtx.strokeStyle = drawCanvas.dataset.color || 'black';
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

        for (let i = 0; i < 25; i++) {
            ctx.beginPath();
            ctx.arc(random(width * .25, width * .75),
                random(height * .25, height * .75),
                random(width * .01,width * .1), 0, Math.PI * 2);
            ctx.fill();
        }

        // set up WebGL canvas
        const glCanvas = canvasRef.current;
        glCanvas.width = width;
        glCanvas.height = height;

        const state = initGL(glCanvas, offscreen);
        if (!state) return;

        const { gl, uTime, uRes, uScale, uStrength } = state;
        gl.viewport(0, 0, width, height);
        gl.uniform2f(uRes, width, height);
        gl.uniform1f(uScale, random() < .2 ? 100 : random(2));
        gl.uniform1f(uStrength, random(0.04,0.1));

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
            <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-5">
                <div className="flex gap-3 flex-wrap justify-center">
                    {labels.map((label, i) => (
                        <span key={i} className="bg-gray-100 rounded-2xl px-4 py-1.5 text-sm">
                            {label}
                        </span>
                    ))}
                </div>

                {loading && (
                    <div className="w-10 h-10 rounded-full bg-black animate-pulse" />
                )}

                {roles && (
                    <>
                        <div className="flex gap-4 flex-wrap justify-center max-w-[700px]">
                            {roles.map((role, i) => (
                                <div key={i} className="bg-gray-50 rounded-xl p-5 flex-[1_1_200px] min-w-[180px] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:bg-white cursor-default">
                                    <div className="font-bold text-lg">{role.title}</div>
                                    <div className="text-lg text-gray-500 leading-tight">{role.question}</div>
                                    <div className="text-sm text-gray-500 mt-2">{role.description}</div>
                                    <div className="text-xs text-gray-500 mt-4">
                                        <strong>Constraint:</strong> {role.constraint}
                                    </div>
                                    <div className="text-[11px] text-gray-400 mt-6">
                                        <strong>Obsession:</strong> {role.obsession}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => { setLabels([]); setRoles(null); triggered.current = false; }}
                            className="text-sm px-5 py-2 border border-gray-300 rounded-md bg-white cursor-pointer transition-all duration-150 hover:border-gray-400 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
                        >
                            Try Again
                        </button>
                    </>
                )}
                <HomeButton />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-5">
            <h1 className="text-2xl font-light tracking-widest">tell me what you see</h1>

            <div className="flex gap-2.5 items-center">
                <input
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addLabel()}
                    placeholder="what do you see?"
                    className="text-sm px-3 py-1.5 border border-gray-300 rounded-md w-[200px] transition-all duration-150 focus:outline-none focus:border-gray-500 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.05)]"
                />
                <button
                    onClick={addLabel}
                    disabled={!inputValue.trim()}
                    className="text-sm px-3 py-1.5 border border-gray-300 rounded-md cursor-pointer bg-white transition-all duration-150 hover:border-gray-400 hover:bg-gray-50 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:cursor-default disabled:hover:translate-y-0 disabled:hover:bg-white"
                >
                    Add
                </button>
            </div>

            {labels.length > 0 && (
                <div className="flex gap-2 flex-wrap justify-center">
                    {labels.map((label, i) => (
                        <span key={i} className="bg-gray-100 rounded-xl px-3 py-1 text-xs flex items-center gap-1 transition-all duration-150 hover:bg-gray-200">
                            {label}
                            <button
                                onClick={() => setLabels(prev => prev.filter((_, j) => j !== i))}
                                className="bg-transparent border-none cursor-pointer text-xs text-gray-400 transition-all duration-150 hover:text-red-400 hover:scale-125"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <div className="relative w-[70vmin] h-[70vmin]">
                <canvas ref={canvasRef} className="w-full h-full" />
                <canvas ref={drawRef} className="absolute top-0 left-0 w-full h-full cursor-crosshair" />
                <div className="absolute top-2.5 right-2.5 flex gap-1.5">
                    <button
                        onClick={() => setColor('black')}
                        className={`w-7 h-7 rounded-full bg-black cursor-pointer transition-all duration-150 hover:scale-110 ${color === 'black' ? 'border-[3px] border-gray-500 scale-110' : 'border-2 border-gray-300'}`}
                    />
                    <button
                        onClick={() => setColor('white')}
                        className={`w-7 h-7 rounded-full bg-white cursor-pointer transition-all duration-150 hover:scale-110 ${color === 'white' ? 'border-[3px] border-gray-500 scale-110' : 'border-2 border-gray-300'}`}
                    />
                </div>
            </div>

            <button
                onClick={() => setCanvasKey(k => k + 1)}
                className="text-sm px-4 py-2 border border-gray-300 rounded-md cursor-pointer bg-white transition-all duration-150 hover:border-gray-400 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
            >
                New Drawing
            </button>
            <HomeButton />
        </div>
    )
}