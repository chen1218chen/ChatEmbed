import { Show, onMount, createSignal } from 'solid-js';
import { Avatar } from '../avatars/Avatar';
// import { Marked } from '@ts-stack/markdown';
import { sendFileDownloadQuery } from '@/queries/sendMessageQuery';
import { ChartJsonComponent } from './ChartJsonComponent';
// marked渲染markdown
import { marked } from "marked";
import CustomRenderer from './Render';
import _ from 'lodash'

type Props = {
  message: string;
  apiHost?: string;
  category?: string;
  fileAnnotations?: any;
  showAvatar?: boolean;
  avatarSrc?: string;
  backgroundColor?: string;
  textColor?: string;
};

const defaultBackgroundColor = '#f7f8ff';
const defaultTextColor = '#303235';

// Marked.setOptions({ isNoP: true });

marked.use({
  // async: true,
  // pedantic: false,
  // gfm: true,
  gfm: true,
  breaks: true,
  pedantic: false,
  silent: false,
  renderer: new CustomRenderer(),
});
marked.setOptions({
  // async: true,
  // pedantic: false,
  gfm: true,
  renderer: new CustomRenderer(),
});
export const BotBubble = (props: Props) => {
  let botMessageEl: HTMLDivElement | undefined;

  const [isCharts, setIsCharts] = createSignal(false);
  const downloadFile = async (fileAnnotation: any) => {
    try {
      const response = await sendFileDownloadQuery({
        apiHost: props.apiHost,
        body: { question: '', history: [], fileName: fileAnnotation.fileName },
      });
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileAnnotation.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  interface ImageComponentProps {
    src: string;
    alt: string;
  }
  
  // 定义 Image 组件
  const ImageComponent = (props: ImageComponentProps) => {
    return <img src={props.src} alt={props.alt} style={{ "max-width": '100%' }} />;
  };
  
  interface VideoComponentProps {
    src: string;
  }
  
  // 定义 Video 组件
  const VideoComponent = (props: VideoComponentProps) => {
    return <video controls src={props.src} style={{ "max-width": '100%' }} />;
  };
  const parseMarkdown = (markdownText: string): ChildNode[] => {
    const html = marked(markdownText);
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return Array.from(template.content.childNodes);
  };
  
  interface MarkdownComponentProps {
    content: string;
    props:any
  }
  const MarkdownComponent = () => {
    // console.log('props', props);
    const parsedNodes = parseMarkdown(formatStr(props.message));
    const elements = parsedNodes.map((node, index) => {
      // TODO:后期优化各类组件渲染
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        // console.log('element', element);
        if (element.dataset.code) {
          return <ChartJsonComponent  data={element.dataset.code} />;
        } else if (element.dataset.video) {
          return <VideoComponent  src={element.dataset.video} />;
        } else if (element.tagName === 'IMG') {
          return <ImageComponent  src={(element as HTMLImageElement).src} alt={(element as HTMLImageElement).alt} />;
        }
      }
      // console.log('node', element);
      return <div  innerHTML={node.innerHTML}  
      class="px-4 py-2 ml-2 whitespace-pre-wrap max-w-full chatbot-host-bubble"
      data-testid="host-bubble"
      ref={botMessageEl}
      style={{
        'background-color': props.backgroundColor ?? defaultBackgroundColor,
        color: props.textColor ?? defaultTextColor,
        'border-radius': '6px',
      }} />
    });
  
    return <>{elements}</>;
  };
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
  // onMount(() => {
  //   if (props.category?.toUpperCase() === 'DATABASE' || props.category?.toUpperCase() === 'KNOWLEDGE-DATABASE' && props.message.indexOf('series') > 0) {
  //     setIsCharts(true);
  //   } else {
  //     setIsCharts(false);
  //     if (botMessageEl) {
  //       // 判断如果是图标option的数据，展示echarts图表
  //       botMessageEl.innerHTML = marked.parse(props.message) as string;
  //       if (props.fileAnnotations && props.fileAnnotations.length) {
  //         for (const annotations of props.fileAnnotations) {
  //           const button = document.createElement('button');
  //           button.textContent = annotations.fileName;
  //           button.className =
  //             'py-2 px-4 mb-2 justify-center font-semibold text-white focus:outline-none flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:brightness-100 transition-all filter hover:brightness-90 active:brightness-75 file-annotation-button';
  //           button.addEventListener('click', function () {
  //             downloadFile(annotations);
  //           });
  //           const svgContainer = document.createElement('div');
  //           svgContainer.className = 'ml-2';
  //           svgContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-download" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M7 11l5 5l5 -5" /><path d="M12 4l0 12" /></svg>`;

  //           button.appendChild(svgContainer);
  //           botMessageEl.appendChild(button);
  //         }
  //       }
  //     }
  //   }
  // });
  onMount(() => {
    if (botMessageEl) {
      // 判断如果是图标option的数据，展示echarts图表
      botMessageEl.innerHTML = marked.parse(formatStr(props.message)) as string;
      if (props.fileAnnotations && props.fileAnnotations.length) {
        for (const annotations of props.fileAnnotations) {
          const button = document.createElement('button');
          button.textContent = annotations.fileName;
          button.className =
            'py-2 px-4 mb-2 justify-center font-semibold text-white focus:outline-none flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:brightness-100 transition-all filter hover:brightness-90 active:brightness-75 file-annotation-button';
          button.addEventListener('click', function () {
            downloadFile(annotations);
          });
          const svgContainer = document.createElement('div');
          svgContainer.className = 'ml-2';
          svgContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-download" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M7 11l5 5l5 -5" /><path d="M12 4l0 12" /></svg>`;

          button.appendChild(svgContainer);
          botMessageEl.appendChild(button);
        }
      }
    }
  });
  return (
    <div class="flex justify-start mb-2 items-start host-container" style={{ 'margin-right': '50px' }}>
      <Show when={props.showAvatar}>
        <Avatar initialAvatarSrc={props.avatarSrc} />
      </Show>
      <MarkdownComponent/>
    </div>
  );
};
