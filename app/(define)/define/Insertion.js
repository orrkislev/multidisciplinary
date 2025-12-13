'use client';

export default function Insersion({ intervention, onClick }) {

    return (
        <div className="relative mx-2 w-2">
            <svg width="60" height="80" className='absolute z-30 bottom-full left-0 translate-y-[12px] -translate-x-[8px]'>
                <path
                    d="M30 15 C 15 15, 12 50, 12 70"
                    stroke="black"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                />
                <path
                    d="M12 70 L8 64 L16 64 Z"
                    fill="black"
                    stroke="black"
                    strokeWidth="1"
                    strokeLinejoin="round"
                />
            </svg>
            <div className="absolute bottom-full left-0 -translate-y-[35px] translate-x-[20px]">
                {intervention.options.map((opt, oi) => (
                    // Outer: defines layout box, not rotated, can grow to full width
                    <div
                        key={oi}
                        className="relative block w-max max-w-none cursor-pointer group"
                        onClick={() => onClick(opt)}
                        style={{ fontFamily: 'caveat', transform: `rotate(${Math.random() * 4 - 2}deg)` }}
                    >
                        {/* Rotated content: rotation moved here so the box keeps full natural width */}
                        <div
                            className="relative z-20 inline-block align-top text-md px-1 py-0.5 whitespace-nowrap break-keep"
                        >
                            {opt}
                        </div>

                        {/* Decorative lines layer: absolutely positioned under text, not affecting layout */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
                            {Array.from({ length: 100 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-yellow-300 h-[4px] opacity-0 group-hover:opacity-100 transition-opacity "
                                    style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        width: '100%',
                                        transform: `rotate(${Math.random() * 4 - 2}deg) translateX(${Math.random() * 60 - 30}px) translateY(-${Math.random() * 30}px)`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}