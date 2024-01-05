import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: "org-UKa7knyIgwZQkKFqqW36DwHp",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
// const response = await openai.listEngines();


const getImage = async (inputText) => {
  const response = await openai.createImage({
    prompt: inputText.slice(9),
    engine: "text-davinci-003",
    n: 1,
    size: "512x512",
  });
  const image_url = response.data.data[0].url;
  return {
    "type": "image",
    "originalContentUrl": image_url,
    "previewImageUrl": image_url
  }
}


const getText = async (inputText) => {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    //model: "gpt-3.5-turbo",
    "max_tokens": 2048,
    prompt: inputText,
    temperature: 0,
    "stream": false,
    "logprobs": null,
  });
  return completion.data.choices[0].text.trim()
}


const fetchOpenAi = async (inputText) => {

  try {

    if (inputText.length > 9 && inputText.slice(0, 9) === "/imagine ") {
      return getImage(inputText)
    } else {
      return getText(inputText)
    }

  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      return error.response.data
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      return error.message
    }
  }

}

export default fetchOpenAi