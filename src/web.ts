import { registerWebComponents } from './register';
import { parseChatbot, injectChatbotInWindow } from './window';
import './bootstrap.min.css';
registerWebComponents();

const chatbot = parseChatbot();

injectChatbotInWindow(chatbot);

export default chatbot;
