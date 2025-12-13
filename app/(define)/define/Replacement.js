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
                        className='bg-pink-200 border-b-2 border-pink-400 px-3 py-0.5 rounded cursor-pointer hover:bg-pink-300 transition-colors whitespace-nowrap'
                        style={{
                            fontFamily: 'caveat',
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
                        className='bg-pink-200 px-3 py-0.5 rounded cursor-pointer hover:bg-pink-300 transition-colors whitespace-nowrap'
                        style={{
                            fontFamily: 'caveat',
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

