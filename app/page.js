import Link from 'next/link';

const linkClassName = `
  flex items-center justify-center p-8
  text-white font-bold text-4xl uppercase font-sans text-wrap break-all
  transition-all duration-300 
  hover:text-5xl `

export default function Home() {

  // grid of 2 by 2, each a link to a different page
  return (
    <div className="min-h-screen grid grid-cols-2 grid-rows-2">
      <Link href="/interdisciplinary" className={linkClassName + ' bg-teal-500 hover:bg-teal-700'}>
        Interdisciplinary
      </Link>
      <Link href="/vibe" className={linkClassName + " bg-orange-500 hover:bg-orange-700"}>
        Vibe
      </Link>
      <Link href="/explain" className={linkClassName + " bg-pink-500 hover:bg-pink-700"}>
        Explain
      </Link>
      <div className="flex items-center justify-center bg-stone-500 text-white font-bold text-4xl">
        ...
      </div>
    </div>
  );
}
