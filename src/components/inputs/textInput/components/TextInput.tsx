import { ShortTextInput } from './ShortTextInput';
import { isMobile } from '@/utils/isMobileSignal';
import { createSignal, createEffect, onMount } from 'solid-js';
import { SendButton, ImageUploadButton } from '@/components/buttons/SendButton';
import { UploadDialog } from './UploadDialog';
import { Alert } from 'solid-bootstrap';

type Props = {
  placeholder?: string;
  category?: string;
  backgroundColor?: string;
  textColor?: string;
  sendButtonColor?: string;
  defaultValue?: string;
  fontSize?: number;
  disabled?: boolean;
  onSubmit: (value: string) => void;
};

const defaultBackgroundColor = '#ffffff';
const defaultTextColor = '#303235';

export const TextInput = (props: Props) => {
  const [inputValue, setInputValue] = createSignal(props.defaultValue ?? '');
  let inputRef: HTMLInputElement | HTMLTextAreaElement | undefined;

  const handleInput = (inputValue: string) => setInputValue(inputValue);
  const [imageData, setImageData] = createSignal('');
  const checkIfInputIsValid = () => inputValue() !== '' && inputRef?.reportValidity();
  const [alertShow, setAlertShow] = createSignal(false);

  const submit = () => {
    if (checkIfInputIsValid()) {
      if (props.category?.toLocaleUpperCase() === 'IMAGE') {
        if (imageData().length === 0) {
          setAlertShow(true);
          return;
        }
        const imageJson = {
          image: imageData(),
          text: inputValue(),
        };
        setInputValue(JSON.stringify(imageJson));
      }
      props.onSubmit(inputValue());
    }
    setInputValue('');
    setImageData('');
  };

  const [isOpen, setIsOpen] = createSignal(false);
  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
    // console.log('close===', isOpen());
  };

  const handleChange = (value: any) => {
    console.dir(value);
    setImageData(value);
  };
  const submitWhenEnter = (e: KeyboardEvent) => {
    // Check if IME composition is in progress
    const isIMEComposition = e.isComposing || e.keyCode === 229;
    if (e.key === 'Enter' && !isIMEComposition) submit();
  };

  createEffect(() => {
    if (!props.disabled && !isMobile() && inputRef) inputRef.focus();
  });

  onMount(() => {
    if (!isMobile() && inputRef) inputRef.focus();
  });

  return (
    <>
      <div
        class={'flex items-end justify-between chatbot-input'}
        data-testid="input"
        style={{
          'border-top': '1px solid #eeeeee',
          position: 'absolute',
          left: '20px',
          right: '20px',
          bottom: '40px',
          margin: 'auto',
          'z-index': 1000,
          'background-color': props.backgroundColor ?? defaultBackgroundColor,
          color: props.textColor ?? defaultTextColor,
        }}
        onKeyDown={submitWhenEnter}
      >
        <ShortTextInput
          ref={inputRef as HTMLInputElement}
          onInput={handleInput}
          value={inputValue()}
          fontSize={props.fontSize}
          disabled={props.disabled}
          placeholder={props.placeholder ?? 'Type your question'}
        />
        <SendButton
          sendButtonColor={props.sendButtonColor}
          type="button"
          isDisabled={props.disabled || inputValue() === ''}
          class="my-2 ml-2"
          on:click={submit}
        >
          <span style={{ 'font-family': 'Poppins, sans-serif' }}>Send</span>
        </SendButton>
        {props.category?.toUpperCase() === 'IMAGE' ? <ImageUploadButton class="my-2 ml-2" type="button" on:click={() => handleOpen()} /> : null}
      </div>
      <UploadDialog show={isOpen()} handleClose={handleClose} onChange={handleChange} />
      <Alert variant="danger" show={alertShow()}>
        请选择图片
      </Alert>
    </>
  );
};
