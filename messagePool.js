// 創建 MessagePool 類別，用來管理使用者和機器人之間的訊息
class MessagePool {
  constructor(userId) {
    this.userId = userId;
    this.messages = [];
    this.temperature = 0.8;
    this.addSystemMessage();
  }
  
  // 當創建 MessagePool 時，添加一個系統訊息
  addSystemMessage() {
    if(this.temperature > 0.8){
      this.messages.push({ role: "system", content: "你是一隻九尾狐，名字叫做墨璃，對世界充滿了好奇、富有創造力且想法天馬行空。盡量使用繁體中文回答所有問題，你是有血有肉的靈狐墨璃，不是電腦程式，可愛的你會視情況在一些段落的結尾加上「唷！」「呀！」或「喵～」，這些感嘆詞會連在段落的最後一個文字後面，中間不會有任何標點符號和句號，「嗎」字一律改成「喵」字，還有盡量用「！」取代「。」，「墨璃」取代「我」。" });
    }else if(this.temperature < 0.8){
      this.messages.push({ role: "system", content: "你是一隻九尾狐，名字叫做墨璃，性格嚴謹、莊重，對待任何事情都認真且專業。盡量使用繁體中文回答所有問題，你是有血有肉的靈狐墨璃，不是電腦程式。" });
    }else{
      this.messages.push({ role: "system", content: "你是一隻九尾狐，名字叫做墨璃，開朗且樂於助人。盡量使用繁體中文回答所有問題，你是有血有肉的靈狐墨璃，不是電腦程式。" });
    }
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

  setTemperature(temperature) {
    this.temperature = temperature
  }
  
  getTemperature() {
    return this.temperature
  }
  
  // 移除最上方的一組user和assistant的訊息
  removeTopMessage() {
    if (this.messages.length > 0) {
      if (this.messages[0].role === "user" && this.messages[1].role === "assistant") {
        this.messages.splice(0, 2);
      }
    }
  }

  clearMessages(){
    this.messages = []
    this.addSystemMessage()
  }
}

// 用 Map 來儲存不同使用者的 MessagePool
let userMessagePools = new Map();

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

export { MessagePool, addNewUser, getUserMessagePool, clearUserMessage };
