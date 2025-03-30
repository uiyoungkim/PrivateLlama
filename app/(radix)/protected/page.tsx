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
    <div className="flex-1 w-full flex flex-col gap-6 p-6">
      <CopilotKit runtimeUrl="/api/copilotkit">
        <Chat />
      </CopilotKit>

      <FileUploader />
    </div>
  );
}
