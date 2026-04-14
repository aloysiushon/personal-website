import { PortfolioPage } from "@/components/PortfolioPage";
import { ChatBot } from "@/components/ChatBot";

export default function Home() {
  // Read the API key server-side — never exposed to the client bundle.
  // The ChatBot widget only renders when the key is present.
  const hasApiKey = Boolean(process.env.OPENROUTER_API_KEY);

  return (
    <>
      <PortfolioPage />
      <ChatBot enabled={hasApiKey} />
    </>
  );
}
