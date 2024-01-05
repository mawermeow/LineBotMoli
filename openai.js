import dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: '.env.local' });
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;
