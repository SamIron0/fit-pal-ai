import { NextApiHandler } from 'next';

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
// method to add two numbers

async function getAIResponse() {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: "Hello world"}],
  });
  //console.log(completion.data.choices[0].message);
}


const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    const bot = {
      name: 'genie',
      price: 0
    };
    res.status(200).json(bot);
    getAIResponse();
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};


export default handler;



