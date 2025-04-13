import { Chat } from "@/components/Chat";
import { createClient } from "@/utils/supabase/server";
import { CopilotKit } from "@copilotkit/react-core";
import { redirect } from "next/navigation";
import FileUploader from "@/components/fileUploader/pdfUploader";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-4 p-2">
      <CopilotKit runtimeUrl="/api/copilotkit">
        <div className="w-full flex flex-col">
          {/* Controls section with Upload and Clear History buttons */}
          <div className="flex justify-between items-center mb-4 w-full">
            <FileUploader />
            <div id="chat-controls"></div>
          </div>
          
          {/* Chat container positioned at the bottom */}
          <Chat controlsContainerId="chat-controls" />
        </div>
      </CopilotKit>
    </div>
  );
}
