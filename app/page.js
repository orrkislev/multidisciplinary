import { tw } from '@/utils/tw';
import Link from 'next/link';

const linkClassName = `
  flex-1 bg-red-200
  flex flex-col items-center justify-center p-8
  text-red-800 font-heavy text-xl uppercase font-sans text-wrap break-all
  transition-all duration-300 
  hover:text-2xl hover:bg-red-300 `

const Description = tw`text-sm font-normal opacity-50`

export default function Home() {

  // grid of 2 by 2, each a link to a different page
  return (
    <div className="min-h-screen flex">
      <Link href="/interdisciplinary" className={linkClassName}>
        Interdisciplinary
        <Description>merge disciplines</Description>
      </Link>
      <Link href="/vibe" className={linkClassName}>
        Vibe
        <Description>how to you want to feel?</Description>
      </Link>
      <Link href="/explain" className={linkClassName}>
        Explain
        <Description>tell me about stuff</Description>
      </Link>
      <Link href="/deck" className={linkClassName}>
        Deck
        <Description>refine your project</Description>
      </Link>
    </div>
  );
}
