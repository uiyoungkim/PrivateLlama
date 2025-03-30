import { Markdown, UserMessageProps } from "@copilotkit/react-ui";
import { UserIcon } from "lucide-react";

export const CustomUserMessage = (props: UserMessageProps) => {
  return (
    <div className="flex justify-end mb-2">
      <div className="flex items-end gap-2 max-w-[75%]">
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
          <Markdown content={props.message || ""} />
        </div>
        <UserIcon className="text-blue-600" size={16} />
      </div>
    </div>
  );
};
