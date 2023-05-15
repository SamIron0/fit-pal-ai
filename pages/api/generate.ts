import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";
import { NextApiHandler } from 'next';

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",  
});
const openai = new OpenAIApi(configuration);


const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
   try{
    const meal_plan = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: "Make me a meal plan"}],
    });
    res.status(200).json(meal_plan.data.choices[0].message);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }

} catch(){
  console.log()
}
};

export default handler;
