import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";
import { NextApiHandler } from 'next';

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,  
});
const openai = new OpenAIApi(configuration);


const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    const meal_plan = openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: "Make me a meal plan"}],
    });
    res.status(200).json(meal_plan.data.choices[0].message);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default handler;
