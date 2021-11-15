// 引用
import 'dotenv/config'
import linebot from 'linebot'
import axios from 'axios'
import cheerio from 'cheerio'

// 設定機器人
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.on('message', async (event) => {
  // 如果傳入的是文字或是課程兩字
  if (event.message.type === 'text' && event.message.text === '課程') {
    try {
      // 等抓取網址後賦予data變數
      const { data } = await axios.get('https://wdaweb.github.io/')
      // 可以用jQ的語法寫
      const $ = cheerio.load(data)
      const replies = []
      for (let i = 0; i < $('#go .col-lg-3.col-md-6').length; i++) {
        replies.push(`課程名稱:\n${$('#go .col-lg-3.col-md-6').eq(i).find('h4').text()}\n
        報名資訊:\n${$('#go .col-lg-3.col-md-6').eq(3).find('.card-description').text().trim().replace(/\t/g, '')}
        `)
      }
      event.reply(replies)
    } catch (error) {
      // 如果錯誤顯示錯誤，catch下方要自己寫console.log，才會顯示錯誤訊息
      console.log(error)
      event.reply('錯誤')
    }
  }
})

// 偵測機器人路徑
bot.listen('/', process.env.PORT || 3000, () => {
  console.log('機器人啟動')
})
