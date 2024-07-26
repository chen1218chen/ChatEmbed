import { marked, Renderer } from 'marked';
import { ChartJsonComponent } from './ChartJsonComponent';
import { createRoot } from 'solid-js';
interface Image {
  href: string;
  title: string | null;
  text: string;
}
interface Code {
  type: "code";
  raw: string;
  codeBlockStyle?: "indented" | undefined;
  lang?: string | undefined;
  text: string;
  escaped?:boolean
}
// interface HTML {
//   type: "html";
//   raw: string;
//   pre: boolean;
//   text: string;
//   block: boolean;
// }
class CustomRenderer extends Renderer {
  constructor() {
    console.log("CustomRenderer");
    super()
  }
  // 重写图片渲染方法
  image({ href, title, text }: Image): string {
    // console.log(href, title, text);
    if (text == 'Video') {
      return `<video
        width='640'
        height='360'
        controls
        crossOrigin='anonymous'
    >
        <source src="${href}" type='video/mp4' />
        Your browser does not support the video tag.
    </video>`;
    }
    return `<img src="${href}" alt="${text}" title="${title}" style="max-width: 100%;" />`;
    
  }

  // // 重写链接渲染方法
  // link(href: string, title: string | null, text: string): string {
  //   return `<a href="${href}" title="${title || ''}" class="custom-link">${text}</a>`;
  // }

  // 重写代码块渲染方法
  // { text, lang, escaped }
  code({text, lang , escaped}: Code): string {
    // console.log(text);
    // console.log(lang);
    // console.log(escaped);
    if (lang === 'json') {
      // const json = JSON.parse(text);
      // return `<pre>${JSON.stringify(json, null, 2)}</pre>`;

      // return `<ChartJsonComponent data={${text}}></ChartJsonComponent>`

      // 使用 `createRoot` 创建一个根组件
      // const component = createRoot(() => (
      //   <ChartJsonComponent data={text} />
      // ));
       // 渲染成字符串（这部分需要集成 SolidJS 的渲染机制，通常需要特殊的处理）
      // return `${component}`;
      return `<div data-code='${text}'></div>`;
    } else if (lang === 'js') {
      return `<pre><code class="language-js">${text}</code></pre>`;
    }
    return `<pre><code>${text}</code></pre>`;
  }

  // // 支持视频嵌入
  // html({html):HTML}): string {

  //   if (html.includes('<video')) {
  //     return html;
  //   }
  //   return `<div>${html}</div>`;
  // }
}

export default CustomRenderer;

