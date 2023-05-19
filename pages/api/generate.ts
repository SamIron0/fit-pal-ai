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

    const response = {
      role: '',
      content: '',
    };
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello world" }],
    });
    //response.content = JSON.stringify({completion});
    //response.role = JSON.stringify(completion.data.choices[0].message);
    res.status(200).json(completion.data.choices[0].message);
    //getAIResponse();
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};


export default handler;



