<!-- markdownlint-disable MD030 -->

# OneCityChains Embed

Javascript library to display OneCityChains chatbot on your website

Install:

```bash
yarn install
```

Dev:

```bash
yarn dev
```

Build:

```bash
yarn build
```

## Embed in your HTML

### PopUp

```html
<script type="module">
  import Chatbot from 'https://192.168.100.85:3009/api/v1/fileJavascript/cdn/ChatEmbed/latest/web.js';
  Chatbot.init({
    chatflowid: '<chatflowid>',
    apiHost: 'http://localhost:3000',
    category: 'database', //可选
  });
</script>
```

### FullPage

```html
<script type="module">
  import Chatbot from './web.js';
  Chatbot.initFull({
    chatflowid: '<chatflowid>',
    apiHost: 'http://localhost:3000',
    category: 'database', //可选
  });
</script>
<onecitychains-fullchatbot></onecitychains-fullchatbot>
```

To enable full screen, add `margin: 0` to <code>body</code> style, and confirm you don't set height and width

```html
<body style="margin: 0">
  <script type="module">
    import Chatbot from './web.js';
    Chatbot.initFull({
      chatflowid: '<chatflowid>',
      apiHost: 'http://localhost:3000',
      category: 'DATABASE' //可选，值为应用类型
      theme: {
        chatWindow: {
          // height: 700, don't set height
          // width: 400, don't set width
        },
      },
    });
  </script>
</body>
```

## Configuration

You can also customize chatbot with different configuration

```html
<script type="module">
  import Chatbot from 'https://192.168.100.85:3009/api/v1/fileJavascript/cdn/ChatEmbed/latest/web.js';
  Chatbot.init({
    chatflowid: '91e9c803-5169-4db9-8207-3c0915d71c5f',
    apiHost: 'http://localhost:3000',
    category: 'DATABASE' //可选，值为应用类型
    chatflowConfig: {
      // topK: 2
    },
    theme: {
      button: {
        backgroundColor: '#3B81F6',
        right: 20,
        bottom: 20,
        size: 'medium',
        iconColor: 'white',
        customIconSrc: 'https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg',
      },
      chatWindow: {
        title: 'Chat Bot',
        titleAvatarSrc: 'https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg',
        welcomeMessage: 'Hello! This is custom welcome message',
        backgroundColor: '#ffffff',
        height: 700,
        width: 400,
        fontSize: 16,
        poweredByTextColor: '#303235',
        botMessage: {
          backgroundColor: '#f7f8ff',
          textColor: '#303235',
          showAvatar: true,
          avatarSrc: 'https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/parroticon.png',
        },
        userMessage: {
          backgroundColor: '#3B81F6',
          textColor: '#ffffff',
          showAvatar: true,
          avatarSrc: 'https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png',
        },
        textInput: {
          placeholder: 'Type your question',
          backgroundColor: '#ffffff',
          textColor: '#303235',
          sendButtonColor: '#3B81F6',
        },
      },
    },
  });
</script>
```

## License

Source code in this repository is made available under the [MIT License]

## 版本

- 1.0.3 增加图表可视化的功能
- 1.0.4 增加图片分析功能，支持在线图片和上传图片
- 1.0.7 增加poweredByUrl参数
- 1.0.8 增加对BI分析、数字人，图片分析应用的支持
