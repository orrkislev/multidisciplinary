import DeckPage from "@/app/(deck)/components/DeckPage";
import HomeButton from "@/app/(__components)/HomeButton";

export const metadata = {
  title: "Deck - Serendipity Engine",
  description: "Deck is a serendipity engine that helps you define your project."
}

export default function Page() {
  return (
    <>
      <DeckPage />
      <HomeButton />
    </>
  );
}
