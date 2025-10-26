import { tw } from '@/utils/tw';
import Link from 'next/link';

const linkStyles = `
  flex-1 bg-primary-50
  flex flex-col items-center justify-center p-8
  text-primary-600 font-heavy text-xl uppercase font-sans text-wrap break-all
  transition-all duration-300 
  hover:text-primary-800 hover:text-2xl hover:bg-primary-300 `

const Description = tw`text-sm font-normal opacity-50 text-primary-700`

export default function Home() {
  
  const sections = [
    {
      href: "/interdisciplinary",
      title: "Interdisciplinary",
      description: "merge disciplines"
    },
    {
      href: "/vibe",
      title: "Vibe",
      description: "how to you want to feel?"
    },
    {
      href: "/explain",
      title: "Explain",
      description: "tell me about stuff"
    },
    {
      href: "/deck",
      title: "Deck",
      description: "refine your project"
    },
    {
      href: "/questions",
      title: "Questions",
      description: "explore topics through questions"
    }
  ]

  return (
    <div className="w-screen h-screen flex bg-primary-100">
        {sections.map((section) => (
          <Link href={section.href} key={section.href} className={linkStyles}>
            {section.title}
            <Description>{section.description}</Description>
          </Link>
        ))}
    </div>
  );
}
