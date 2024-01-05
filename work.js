const line = require('@line/bot-sdk');
const config = {
  channelAccessToken: 'YOUR_CHANNEL_ACCESS_TOKEN',
  channelSecret: 'YOUR_CHANNEL_SECRET'
};
const client = new line.Client(config);

// 創建 MessagePool 類別，用來管理使用者和機器人之間的訊息
class MessagePool {
  constructor(userId) {
    this.userId = userId;
    this.messages = [];
    this.addSystemMessage();
  }
  
  // 當創建 MessagePool 時，添加一個系統訊息
  addSystemMessage() {
    this.messages.push({ role: "system", content: "你好，我是一個有用的助手。" });
  }
  
  // 添加使用者的訊息到 MessagePool 裡面
  addUserMessage(message) {
    this.messages.push({ role: "user", content: message });
  }
  
  // 添加機器人的訊息到 MessagePool 裡面
  addAssistantMessage(message) {
    this.messages.push({ role: "assistant", content: message });
  }
  
  // 取得 MessagePool 裡面的所有訊息
  getMessage() {
    return this.messages;
  }
}

// 用 Map 來儲存不同使用者的 MessagePool
let userMessagePools = new Map();

// 處理 Linebot 收到訊息的事件
const handleEvent = async (event) => {
  // 取得使用者的 ID
  let userId = event.source.userId;
  
  // 如果這個使用者還沒有創建 MessagePool，就創建一個新的 MessagePool
  addNewUser(userId);
  
  // 取得這個使用者的 MessagePool
  let messages = getUserMessagePool(userId);
  
  // 把使用者傳來的訊息添加到 MessagePool 裡面
  messages.addUserMessage(event.message.text);

  // 跟 OpenAI 的 GPT-3 模型對話，取得回應
  const response = await openai.createChatCompletion({
    'model': "gpt-3.5-turbo",
    messages: messages.getMessage()
  });

  // 把 GPT-3 模型回應的訊息添加到 MessagePool 裡面
  messages.addAssistantMessage(response.data.choices[0].message.content);

  // 回應使用者
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: "GPTBot: " + response.data.choices[0].message.content
  });
};

// 如果這個使用者還沒有創建 MessagePool，就創建一個新的 MessagePool
const addNewUser = (userId) => {
  if (!userMessagePools.has(userId)) {
    userMessagePools.set(userId, new MessagePool(userId));
  }
};

// 取得這個使用者的 MessagePool
const getUserMessagePool = (userId) => {
  return userMessagePools.get(userId);
};

// 清空這個使用者的 MessagePool
const clearUserMessage = (userId) => {
  if (userMessagePools.has(userId)) userMessagePools.delete(userId);
}