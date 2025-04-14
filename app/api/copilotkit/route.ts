import {
  CopilotRuntime,
  LangChainAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";

import { ChatOllama } from "@langchain/ollama";
import { NextRequest } from "next/server";

import { OllamaEmbeddings } from "@langchain/ollama";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";

const model = new ChatOllama({ model: "llama3.2:1b", temperature: 0 });
const serviceAdapter = new LangChainAdapter({
  chainFn: async ({ messages, tools }) => {
    console.log(messages);
    return model.bindTools(tools).stream(messages);
    // or optionally enable strict mode
    // return model.bindTools(tools, { strict: true }).stream(messages);
  },
});

const runtime = new CopilotRuntime({
  actions: () => [
    {
      name: "FetchKnowledgebaseArticles",
      description:
        "Fetch relevant knowledge base articles based on a user query",
      parameters: [
        {
          name: "query",
          type: "string",
          description:
            "The user query for the knowledge base index search to perform",
          required: true,
        },
      ],
      handler: async ({ query }: { query: string }) => {
        try {
          const embeddings = new OllamaEmbeddings({
            requestOptions: {
              useMmap: true, // use_mmap 1
              numThread: 6, // num_thread 6
              numGpu: 2, // num_gpu 1
            },
          });

          const supabaseClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          );

          const vectorStore = new SupabaseVectorStore(embeddings, {
            client: supabaseClient,
            tableName: "documents",
            queryName: "match_documents",
          });

          const similaritySearchResults =
            await vectorStore.similaritySearch(query);

          return { similaritySearchResults };
        } catch (error) {
          console.error("Error fetching knowledge base articles:", error);
          throw new Error("Failed to fetch knowledge base articles.");
        }
      },
    },
  ],
});

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
