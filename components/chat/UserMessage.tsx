import { Markdown, UserMessageProps } from "@copilotkit/react-ui";

export const CustomUserMessage = (props: UserMessageProps) => {
  return (
    <div>
      <Markdown content={props.message || ""} />
    </div>
  );
};
