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
    <div>
      <Header />
      <CopilotChat
        UserMessage={CustomUserMessage}
        AssistantMessage={CustomAssistantMessage}
        labels={{
          initial:
            "Hi! I'm a fully customized CopilotKit assistant. How can I help you today? \n\nTry asking me to collect your contact information.",
        }}
      />
    </div>
  );
}
