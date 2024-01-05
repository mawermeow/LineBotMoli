import dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: '.env.local' });
import fs from "fs";
import linebot from "linebot";
import { MessagePool, addNewUser, getUserMessagePool, clearUserMessage } from "./messagePool.js";
import openai from "./openai.js"

var bot = linebot({
  channelId: process.env.LINEBOT_CHANNEL_ID,
  channelSecret: process.env.LINEBOT_SECRET,
  channelAccessToken: process.env.LINEBOT_TOKEN
});

// 處理 Linebot 收到訊息的事件
const handleEvent = async (event) => {
  // 取得使用者的 ID
  let userId = event.source.userId;

  // 如果這個使用者還沒有創建 MessagePool，就創建一個新的 MessagePool
  addNewUser(userId);

  const filePath = `md/${userId}.md`;
  const writeText = (role, text) => {
    fs.appendFileSync(filePath, `### ${role}\n${text}\n\n---\n`)
  }

  const userContent = event.message.text
  writeText("用戶", userContent)

  let messages = getUserMessagePool(userId);
  messages.addUserMessage(event.message.text);

  const fetchGPT=async()=>{
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      messages: messages.getMessage(),
      temperature: messages.getTemperature(),
    });

    const tokenCount = response.data.usage.total_tokens
    writeText("系統", `已使用token：${JSON.stringify(response.data.usage)}`)

    if (tokenCount > 3600) {
      messages.removeTopMessage()
      writeText("系統", "遺忘了部分聊天紀錄")
    }

    const resText = response.data.choices[0].message.content

    // 把 GPT-3 模型回應的訊息添加到 MessagePool 裡面
    messages.addAssistantMessage(resText);
    event.reply(resText);
    writeText("墨璃", resText)
  }

  // 跟 OpenAI 的 GPT-3 模型對話，取得回應
  try {
    console.log('發送用戶訊息')
    fetchGPT()
  } catch (error) {
    console.error("發生錯誤:", error);
    // 在這裡可以根據實際情況進行錯誤處理，例如重新嘗試請求或回覆使用者錯誤訊息
    setTimeout(() => {
      console.log('重複發送用戶訊息')
      fetchGPT()
    }, 5000);
    // event.reply('抱歉，發生了一些問題，請稍後再試或聯絡我們的幫助中心。')
  }
};

function checkClear(str) {
  const regex = /clear/i
  const matches = str.match(regex)
  return matches !== null
}

bot.on('message', function(event) {
  const userInput = event.message.text
  let userId = event.source.userId
  addNewUser(userId)
  let messages = getUserMessagePool(userId)

  if (userInput.length === 5 && checkClear(userInput)) {
    messages.clearMessages()
    event.reply('金魚只有七秒！')
  } else if (userInput === '墨璃認真點') {
    messages.setTemperature(0.2)
    messages.clearMessages()
    event.reply('您好，我是專業的墨璃！')
  } else if (userInput === '墨璃煉蕭威') {
    messages.setTemperature(1.2)
    messages.clearMessages()
    event.reply('你好你好呀！我是瘋癲的墨璃！')
  } else if (userInput === '墨璃正常點') {
    messages.setTemperature(0.8)
    messages.clearMessages()
    event.reply('好好好，我回來了')
  } else {
    handleEvent(event)
  }
});

bot.listen('/linewebhook', 3000, function() {
  console.log('[BOT已準備就緒]');
});