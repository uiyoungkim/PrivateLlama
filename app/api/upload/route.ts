import { NextResponse, NextRequest } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { OllamaEmbeddings } from "@langchain/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

import { createClient } from "@supabase/supabase-js";

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  // const blob = new Blob([buffer], { type: "application/pdf" });
  const pdfBlob = new Blob([buffer], { type: "application/pdf" });

  const embeddings = new OllamaEmbeddings({
    requestOptions: {
      useMmap: true, // use_mmap 1
      numThread: 6, // num_thread 6
      numGpu: 1, // num_gpu 1
    },
  });

  const singleVector = await embeddings.embedQuery("test");

  const loader = new WebPDFLoader(pdfBlob);
  const docs = await loader.load();
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splitDocs = await textSplitter.splitDocuments(docs);

  const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const vectorStore = new SupabaseVectorStore(embeddings, {
    client: supabaseClient,
    tableName: "documents",
    queryName: "match_documents",
  });

  await vectorStore.addDocuments(splitDocs);

  return NextResponse.json({
    message: "File uploaded successfully",
    path: `/uploads/${file.name}`,
  });
};
