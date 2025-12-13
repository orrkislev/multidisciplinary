import { tw } from '@/utils/tw';
import Link from 'next/link';

const linkStyles = `
  flex-1 bg-primary-50
  flex flex-col items-center justify-center p-8
  text-primary-900 font-heavy text-xl uppercase font-sans text-wrap break-all
  transition-all duration-300 
  hover:text-primary-800 hover:text-2xl hover:bg-primary-300 `

const Description = tw`text-sm font-normal text-primary-900/80`

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
      href: "/",
      title: "The Serendipity Engine",
      description: "Playful AI experiments by Orr Kislev"
    },
    {
      href: "/questions",
      title: "Questions",
      description: "explore topics through questions"
    },
    {
      href: "/define",
      title: "Define",
      description: "define your project"
    },
    {
      href: "/receipt",
      title: "Receipt",
      description: "create a receipt for your project"
    },{
      href: "/board",
      title: "Board",
      description: "superpowered list"
    }
  ]

  return (
    <div className="w-screen h-screen bg-primary-900 grid grid-cols-3 gap-4 p-4">
            {sections.map((section) => (
                <Link href={section.href} key={section.href} className={linkStyles}>
                    {section.title}
                    <Description>{section.description}</Description>
                </Link>
            ))}
        </div>
    )
}
