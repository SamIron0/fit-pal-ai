/*
import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";
import { NextApiHandler } from 'next';

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
// method to add two numbers

const handler: NextApiHandler = async (req, res) => {
  const bot = {
    name: 'genie',
    price: 0
  };
  if (req.method === 'GET') {
    try {
      const meal_plan = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Make me a meal plan" }],
      });
      //window.alert(meal_plan.data.choices[0].message.stringify)
      //res.status(200).json(meal_plan.data.choices[0].message);
      res.status(200).json(bot);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};
*/

import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    const bot = {
      name: 'genie',
      price: 0
    };
    res.status(200).json(bot);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};


export default handler;



