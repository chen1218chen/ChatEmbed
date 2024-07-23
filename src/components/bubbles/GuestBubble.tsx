import { Show, onMount } from 'solid-js';
import { Avatar } from '../avatars/Avatar';
import { Marked } from '@ts-stack/markdown';
import _ from 'lodash'

type Props = {
  message: string;
  showAvatar?: boolean;
  avatarSrc?: string;
  backgroundColor?: string;
  textColor?: string;
  category?: string;
};

const defaultBackgroundColor = '#3B81F6';
const defaultTextColor = '#ffffff';

Marked.setOptions({ isNoP: true });
const hasHTML = (str: string) => {
  return /<[a-z][\s\S]*>/i.test(str)
}
const formatStr = (message:any) => {
  try {
      if (hasHTML(message) && _.includes(message, '<html>') && !_.includes(message, '```html')) {
          return '```html' + message + '```'
          // } else if ((message.indexOf('image') > 0 && message.indexOf('text') > 0) || message.indexOf('data:image/jpeg;base64,') > 0) {
          //     const obj = JSON.parse(message)
          //     const text = obj.text
          //     const image = obj.image
          //     console.log(image)
          //     const result = '![](' + image + ')'
          //     return result + '<br />' + text
      } else if (message.indexOf('<img>') !== -1) {
          // 匹配字符串<img>标签之间的内容
          const match = message.match(/<img[^>]*>(.*?)<\/img>/)
          let image = ''
          let text = ''
          if (match) {
              image = match[1]
              image = '![](' + image + ')'
          }
          // 匹配字符串<img>标签后面的内容
          const match2 = message.match(/<\/img>(.*?)$/)
          if (match2) {
              text = match2[1]
          }
          const result = image + '<br />' + text
          return result
      } else if (message.endsWith('.mp4')) {
          // return <iframe src={message}></iframe>
          return `![Video](${message})`
      } else {
          // console.log('no fomat', message)
          return message
      }
  } catch (error) {
      console.error(error)
  }
}
export const GuestBubble = (props: Props) => {
  let userMessageEl: HTMLDivElement | undefined;

  onMount(() => {
    if (userMessageEl) {
      if (props.category?.toUpperCase() === 'IMAGE') {
        const obj = formatStr(props.message);
        // const text = obj.text;
        // const image = obj.image;
        // const imageMD = '![](' + image + ')';
        // const result = imageMD + '<br />' + text;     
        userMessageEl.innerHTML = Marked.parse(obj);
      } else {
        userMessageEl.innerHTML = Marked.parse(props.message);
      }
    }
  });

  return (
    <div class="flex justify-end mb-2 items-end guest-container" style={{ 'margin-left': '50px' }}>
      <span
        ref={userMessageEl}
        class="px-4 py-2 mr-2 whitespace-pre-wrap max-w-full chatbot-guest-bubble"
        data-testid="guest-bubble"
        style={{
          'background-color': props.backgroundColor ?? defaultBackgroundColor,
          color: props.textColor ?? defaultTextColor,
          'border-radius': '6px',
        }}
      />
      <Show when={props.showAvatar}>
        <Avatar initialAvatarSrc={props.avatarSrc} />
      </Show>
    </div>
  );
};
