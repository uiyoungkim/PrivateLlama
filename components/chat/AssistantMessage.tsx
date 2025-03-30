"use client";

import "@copilotkit/react-ui/styles.css";
import { AssistantMessageProps, Markdown } from "@copilotkit/react-ui";
import { BotIcon } from "lucide-react";

export const CustomAssistantMessage = (props: AssistantMessageProps) => {
  const { message, isLoading, subComponent } = props;

  return (
    <div className="flex justify-start mb-2 px-4">
      <div className="flex items-start gap-2 max-w-[75%]">
        {/* fix icon big */}
        <BotIcon
          className="text-gray-400 mt-1 min-w-[20px] min-h-[20px]"
          size={20}
        />

        <div className="bg-gray-100 text-black px-4 py-2 rounded-lg text-sm whitespace-pre-wrap">
          {subComponent ? (
            subComponent
          ) : (
            <>
              {message && <Markdown content={message || ""} />}
              {isLoading && (
                <p className="text-sm text-gray-500 italic">
                  Your Answer is loading...
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
