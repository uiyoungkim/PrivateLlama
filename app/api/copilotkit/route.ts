import {
    CopilotRuntime,
    LangChainAdapter,
    copilotRuntimeNextJSAppRouterEndpoint,
  } from '@copilotkit/runtime';

  import { ChatGoogleGenerativeAI  } from "@langchain/google-genai";
  import { ChatOpenAI  } from "@langchain/openai";
  import { ChatOllama } from "@langchain/ollama";
  import { NextRequest } from 'next/server';
   
  const model = new ChatOllama({ model: "llama3.2:1b", temperature: 0 });
  const serviceAdapter = new LangChainAdapter({
      chainFn: async ({ messages, tools }) => {
        console.log(messages);
      return model.bindTools(tools).stream(messages);
      // or optionally enable strict mode
      // return model.bindTools(tools, { strict: true }).stream(messages);
    }
  });
  const runtime = new CopilotRuntime();
   
  export const POST = async (req: NextRequest) => {
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime,
      serviceAdapter,
      endpoint: '/api/copilotkit',
    });
   
    return handleRequest(req);
  };