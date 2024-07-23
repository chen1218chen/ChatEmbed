type Props = {
  index: number;
  pageContent: string;
  metadata: object;
  onSourceClick?: () => void;
};
export const SourceBubble = (props: Props) => (
  <>
    <div
      data-modal-target="defaultModal"
      data-modal-toggle="defaultModal"
      class="flex justify-start mb-2 items-start animate-fade-in host-container hover:brightness-90 active:brightness-75"
      onClick={() => props.onSourceClick?.()}
    >
      <span
        title={props.pageContent}
        class="px-2 py-1 ml-1 whitespace-pre-wrap max-w-full chatbot-host-bubble"
        data-testid="host-bubble"
        style={{
          width: 'max-content',
          'max-width': '600px',
          'font-size': '14px',
          'border-radius': '15px',
          cursor: 'pointer',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'white-space': 'nowrap',
        }}
      >
        <span>{props?.index + 1 + ' '}.</span>
        {props.pageContent}
      </span>
    </div>
  </>
);
