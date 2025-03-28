import "@copilotkit/react-ui/styles.css";
import { AssistantMessageProps, Markdown } from "@copilotkit/react-ui";
import { useCopilotChat } from "@copilotkit/react-core";

export const CustomAssistantMessage = (props: AssistantMessageProps) => {
  const { message, isLoading, isGenerating, subComponent, rawData } = props;
  console.log(props);
  //{!isGenerating && !isLoading && <ResponseButtons id={id} />}
  const id = rawData?.id;
  return (
    <div>
      <div>
        {!subComponent && <div />}
        {subComponent ? (
          subComponent
        ) : (
          <>
            {message && <Markdown content={message || ""} />}
            {isLoading && (
              <div>
                <p>Loading...</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const ResponseButtons = ({ id }: { id: string }) => {
  const { reloadMessages, visibleMessages } = useCopilotChat();
  const isLastMessage = visibleMessages[visibleMessages.length - 1]?.id === id;
  /*
      <p>How was this response?</p>
      <Button onClick={() => alert("Thumbs up sent")}></Button>
      <Button onClick={() => alert("Thumbs down sent")}></Button>
      <Button onClick={() => reloadMessages()}></Button>
*/

  return <div>{isLastMessage && <div></div>}</div>;
};
