import VibePage from "@/app/(vibe)/components/VibePage";
import HomeButton from "@/app/(components)/HomeButton";

export const metadata = {
  title: "Vibe - Serendipity Engine",
  description: "Vibe is a serendipity engine that helps you find new ideas and connections."
}

export default function Page() {
  return (
    <>
      <VibePage />
      <HomeButton />
    </>
  );
}
