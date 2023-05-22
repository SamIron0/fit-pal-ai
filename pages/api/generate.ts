import { NextApiHandler } from 'next';

import { Configuration, OpenAIApi } from "openai";
import { useState } from 'react';

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
// method to add two numbers

async function getAIResponse() {

  //console.log(cmessage);
}

type Intention = {
  response: string,
}

//const [intentionData, setIntentionData] = useState<Intention>({ response: '' });

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    const { APIquery } = req.query; // Get queryText input from client request
    const AIquery = "You are a helpful fitness AI bot called myfitpal that resides on a backend server, servicing a website's users looking to make meal plans. Reply only in json format. If the following statement is asking to make a meal plan,then response: make, message:some response saying youre working on it. if the statement is asking to edit a meal plan, then response: edit, message:some response saying youre working on it. if the statement is asking to delete a meal plan, then response:delete, message:some response saying youre working on it. else,response: invalid, message: A sentence or 2 about not being able to complete user's request asking user to try a different request. statement: " + APIquery?.toString?.() ?? '';
    // evaluate if intention of text is to make or edit a meal plan or if its out of context.
    const aiResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: AIquery?.toString?.() ?? '', name: "Samuel" }], // Use queryText input in messages array
    });

    const text = aiResponse.data.choices[0].message?.content;

    if (typeof text === 'string') {
      let aiJson = JSON.parse(text);
      const intent = aiJson.response;
      const message = aiJson.message;
      if (intent === "make") {
        res.status(200).json(message);
        // Handle "make" response
      } else if (intent === "edit") {
        res.status(200).json(message);
        // Handle "edit" response
      } else if (intent === "delete") {
        res.status(200).json(message);
        // Handle "delete" response
      } else {
        res.status(200).json(AIquery?.toString?.());
      }
    }
    


    //    
    /*
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: AIquery?.toString?.() ?? '',name:"Samuel"}], // Use queryText input in messages array
      });res.status(200).json(completion.data.choices[0].message);*/
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};


export default handler;



