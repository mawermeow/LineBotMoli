import fetch from "node-fetch";

export const appendMoli=(appendData)=>{
  fetch(`${process.env.FIREBASE_URL}moli.json`, {
        method: 'POST',
        body: JSON.stringify(appendData),
        headers: { 'Content-Type': 'application/json' }
      }).then(response => {
        console.log(response)
        return response.json();
      })
}

  // fetchOpenAi(event.message.text).then(el => {
  //   event.reply(el).then(function(data) {
  //     appendMoli({
  //       input: event.message.text,
  //       output: el
  //     })
  //   })
  // })