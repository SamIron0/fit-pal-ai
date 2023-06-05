import { NextApiHandler } from 'next'
import { Configuration, OpenAIApi } from "openai";
import { useState } from 'react';
import {
  //createorRetrieveMealPlan
} from '@/utils/supabase-admin';
import { Json } from '@/types_db';
import { Meal, MealPlan } from '@/types';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
// Create a new configuration object
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
// method to add two numbers


type Intention = {
  response: string,
}

//const [intentionData, setIntentionData] = useState<Intention>({ response: '' });
const testMeal: Meal = {
  meal: "Breakfast",
  item: "Oatmeal with banana and almond milk",
  calories: 350
}

const testPlan: MealPlan =
{
  day1: [
    testMeal,
    testMeal,
    testMeal,
    testMeal,
  ],
  day2: [
    testMeal,
    testMeal,
    testMeal,
    testMeal,
  ],
  day3: [
    testMeal,
    testMeal,
    testMeal,
    testMeal,
  ],
 day4: [
    testMeal,
    testMeal,
    testMeal,
    testMeal,
  ],
  day5: [
    testMeal,
    testMeal,
    testMeal,
    testMeal,
  ],
}

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    const { AIquery, user } = req.query;
    const chatResponseQuery = "You are a helpful fitness AI bot called myfitpal that resides on a backend server, servicing a website's users looking to make meal plans. Reply only in json format and remove all newline characters(backslash n) that may exist in the json. If the following statement is asking to make a meal plan,then response: make, message:some response saying youre working on it.else, if the statement is asking to edit a meal plan, then response: edit, message:some response saying youre working on it. else if the statement is asking to delete a meal plan, then response:delete, message:some response saying youre working on it. else,response: invalid, message: A sentence or 2 about not being able to complete user's request asking user to try a different request. statement: " + AIquery?.toString?.() ?? '';
    // evaluate if intention of text is to make or edit a meal plan or if its out of context.
    const chatResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: chatResponseQuery?.toString?.() ?? '', name: "Samuel" }], // Use queryText input in messages array
    });

    const text = chatResponse.data.choices[0].message?.content;

    if (typeof text === 'string') {
      let aiJson = JSON.parse(text);
      const intent = aiJson.response;
      const message = aiJson.message;
      const response ={
        chat: message,
        mealPlan: testPlan,
      }
      if (intent === "edit") {
        res.status(200).json(message);
      }

      else if (intent === "make" && user) {
        /*
        // call gpt to generate a mealplan.
        const mkEditDelQuery = "You are a helpful fitness AI bot called myfitpal that resides on a backend server, servicing a website's users looking to make meal plans. Reply only in json format and remove all newline characters(backslash n) that may exist in the json. If the following statement is asking to make a meal plan,then response: make, message:some response saying youre working on it.else, if the statement is asking to edit a meal plan, then response: edit, message:some response saying youre working on it. else if the statement is asking to delete a meal plan, then response:delete, message:some response saying youre working on it. else,response: invalid, message: A sentence or 2 about not being able to complete user's request asking user to try a different request. statement: " + AIquery?.toString?.() ?? '';
        const mkEditDelResponse = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: mkEditDelQuery?.toString?.() ?? '', name: "Samuel" }], // Use queryText input in messages array
        });
        const mkEditDelText = mkEditDelResponse.data.choices[0].message?.content;
        if (typeof mkEditDelText === 'string') {
          let mkEditDelJson = JSON.parse(mkEditDelText);
          const mkEditDelIntent = mkEditDelJson.response;
          const mkEditDelMessage = mkEditDelJson.message;
*/
        res.status(200).json(response);
        //await createorRetrieveMealPlan(newMealPlan);
        //res.status(200).json(testPlan);
        // Handle "make" response
      } else if (intent === "delete") {
        res.status(200).json(message);
        // Handle "delete" response
      } else {
        res.status(200).json(message);
      }
    }    //    
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
