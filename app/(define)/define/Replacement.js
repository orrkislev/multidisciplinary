export default function Replacement({ intervention, onOptionClick = () => { } }) {
    const topOptions = intervention.options.slice(0, Math.ceil(intervention.options.length / 2))
    const bottomOptions = intervention.options.slice(Math.ceil(intervention.options.length / 2))

    return (
        <>
            {/* Options above the word */}
            <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-1 flex flex-col items-center gap-0.5'>
                {topOptions.map((opt, oi) => (
                    <div
                        key={oi}
                        className='bg-pink-pale border-b-2 border-primary-500 px-3 py-0.5 rounded-full text-2xl leading-tight cursor-pointer hover:bg-primary-300 transition-colors whitespace-nowrap'
                        style={{
                            fontFamily: 'var(--font-caveat)',
                            transform: `rotate(${Math.random() * 3 - 1.5}deg)`
                        }}
                        onClick={() => onOptionClick(opt)}
                    >
                        {opt}
                    </div>
                ))}
            </div>

            {/* Options below the word */}
            <div className='absolute top-full left-1/2 -translate-x-1/2 mt-1 flex flex-col items-center gap-0.5'>
                {bottomOptions.map((opt, oi) => (
                    <div
                        key={oi}
                        className='bg-pink-pale border-b-2 border-primary-500 px-3 py-0.5 rounded-full text-2xl leading-tight cursor-pointer hover:bg-primary-300 transition-colors whitespace-nowrap'
                        style={{
                            fontFamily: 'var(--font-caveat)',
                            transform: `rotate(${Math.random() * 3 - 1.5}deg)`
                        }}
                        onClick={() => onOptionClick(opt)}
                    >
                        {opt}
                    </div>
                ))}
            </div>
        </>
    )
}

