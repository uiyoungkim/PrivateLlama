"use client";

import { useEffect } from "react";
import { CopilotChat } from "@copilotkit/react-ui";
import { Header } from "@/components/chat/Header";
import { CustomUserMessage } from "@/components/chat/UserMessage";
import { CustomAssistantMessage } from "@/components/chat/AssistantMessage";
import FileUploader from "@/components/fileUploader/pdfUploader";
import {
  useCopilotAction,
  useCopilotMessagesContext,
} from "@copilotkit/react-core";
import {
  TextMessage,
  ActionExecutionMessage,
  ResultMessage,
} from "@copilotkit/runtime-client-gql";
import { Button } from "@/components/ui/button";

export function Chat({ className }: { className?: string }) {
  const { messages, setMessages } = useCopilotMessagesContext();

  // 🧠 Register CopilotTol
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

  // 💾 Save History in LocalStorage
  // Documentation: https://docs.copilotkit.ai/guides/messages-localstorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("copilotkit-messages", JSON.stringify(messages));
    }
  }, [JSON.stringify(messages)]);

  // ♻️ Load History from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("copilotkit-messages");
    if (stored) {
      try {
        const parsedMessages = JSON.parse(stored).map((message: any) => {
          if (message.type === "TextMessage") {
            return new TextMessage({
              id: message.id,
              role: message.role,
              content: message.content,
              createdAt: message.createdAt,
            });
          } else if (message.type === "ActionExecutionMessage") {
            return new ActionExecutionMessage({
              id: message.id,
              name: message.name,
              scope: message.scope,
              arguments: message.arguments,
              createdAt: message.createdAt,
            });
          } else if (message.type === "ResultMessage") {
            return new ResultMessage({
              id: message.id,
              actionExecutionId: message.actionExecutionId,
              actionName: message.actionName,
              result: message.result,
              createdAt: message.createdAt,
            });
          } else {
            throw new Error(`Unbekannter Nachrichtentyp: ${message.type}`);
          }
        });

        setMessages(parsedMessages);
      } catch (err) {
        console.error("Fehler beim Wiederherstellen der Nachrichten:", err);
      }
    }
  }, []);

  return (
    <div
      className={`flex flex-col bg-background border rounded-xl shadow-md max-w-6xl w-full mx-auto h-[85vh] mt-2 ${className}`}
    >
      <Header />
      {/* 🧼 Delete History */}
      <div className="px-4 pb-4 pt-3 flex justify-between items-center">
        <FileUploader />
        <Button
          onClick={() => {
            localStorage.removeItem("copilotkit-messages");
            setMessages([]);
          }}
          variant="destructive"
          size="sm"
        >
          Verlauf löschen
        </Button>
      </div>
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
