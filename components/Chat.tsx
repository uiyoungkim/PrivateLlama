"use client";

import { CopilotChat } from "@copilotkit/react-ui";
import { Header } from "@/components/chat/Header";
import { CustomUserMessage } from "@/components/chat/UserMessage";
import { CustomAssistantMessage } from "@/components/chat/AssistantMessage";
import { useCopilotAction } from "@copilotkit/react-core";

export function Chat({ className }: { className?: string }) {
  useCopilotAction({
    name: "FetchKnowledgebaseArticles",
    description: "Fetch relevant knowledge base articles based on a user query",
    parameters: [
      {
        name: "query",
        type: "string",
        description: "User query for the knowledge base",
        required: true,
      },
    ],
    render: "Getting relevant answers to your query...",
  });

  return (
    <div
      className={`flex flex-col bg-background border rounded-xl shadow-md max-w-4xl w-full mx-auto h-[80vh] ${className}`}
    >
      <Header />

      <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
        <CopilotChat
          UserMessage={CustomUserMessage}
          AssistantMessage={CustomAssistantMessage}
          labels={{
            initial:
              "Hi! 👋 Ich bin dein digitaler Assistent. Frag mich gerne zu deinen hochgeladenen Dokumenten oder anderen Themen! 📄🤖",
          }}
        />
      </div>
    </div>
  );
}
