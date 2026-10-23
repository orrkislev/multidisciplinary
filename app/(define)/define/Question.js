export default function Question({ intervention }) {
    return (
        <div className='absolute bottom-full left-1/2 pointer-events-none'>
            <div className='absolute top-full left-0 -translate-x-[50%] text-center translate-y-[130px] w-max max-w-[22vw] bg-stone-deep text-base leading-snug rounded-[1.25rem] px-4 py-3 shadow-[0_10px_24px_-12px_rgb(36_32_30/0.5)] -translate-x-2 border-b-4 border-[#d9ae45]'>
                {intervention.options[0]}
            </div>
            <div className='absolute top-12 left-0 border-l-3 border-dotted border-stone-deep h-[100px]' />
        </div >
    )
}