import { NextApiHandler } from 'next';

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
// method to add two numbers

async function getAIResponse() {

  //console.log(cmessage);
}

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {

    const { AIquery } = req.query; // Get queryText input from client request

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: AIquery?.toString?.() ?? ''}], // Use queryText input in messages array
    });res.status(200).json(completion.data.choices[0].message);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};


export default handler;



