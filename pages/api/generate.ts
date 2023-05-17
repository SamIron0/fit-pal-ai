import { NextApiHandler } from 'next';

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
// method to add two numbers

async function getAIResponse() {
  
  //console.log(completion.data.choices[0].message);
}

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    
    const response = {
      role: "",
      content: "here",
    };
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: "Hello world"}],
    });
    //response.content = JSON.stringify({completion});
    //response.role = JSON.stringify("Assistant");
    res.status(200).json(response);
    //getAIResponse();
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};


export default handler;



