export default function Question({ intervention }) {
    return (
        <div className='absolute bottom-full left-1/2 pointer-events-none'>
            <div className='absolute top-full left-0 -translate-x-[50%] text-center translate-y-[130px] max-w-[20vw] bg-yellow-200 text-sm rounded-lg px-4 py-3 shadow-md -translate-x-2 border-b-4 border-yellow-400'>
                {intervention.options[0]}
            </div>
            <div className='absolute top-12 left-0 border-l-3 border-dotted border-yellow-200 h-[100px]' />
        </div >
    )
}