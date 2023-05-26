import { NextApiHandler } from 'next'
import { Configuration, OpenAIApi } from "openai";
import { useState } from 'react';
import {
  upsertMealPlanRecord,
} from '@/utils/supabase-admin';
import { Json } from '@/types_db';
import { MealPlan } from '@/types';

// Create a new configuration object
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
const testPlan =
{
  "Day 1": [
    {
      "Meal": "Breakfast",
      "Item": "Oatmeal with banana and almond milk",
      "Calories": 350
    },
    {
      "Meal": "Lunch",
      "Item": "Turkey and cheese sandwich on whole wheat bread with a side of carrots and hummus",
      "Calories": 500
    },
    {
      "Meal": "Dinner",
      "Item": "Grilled salmon with roasted Brussels sprouts and quinoa",
      "Calories": 700
    },
    {
      "Meal": "Snack",
      "Item": "Apple with peanut butter",
      "Calories": 150
    }
  ],
  "Day 2": [
    {
      "Meal": "Breakfast",
      "Item": "Greek yogurt with mixed berries and granola",
      "Calories": 350
    },
    {
      "Meal": "Lunch",
      "Item": "Chicken and vegetable stir-fry with brown rice",
      "Calories": 500
    },
    {
      "Meal": "Dinner",
      "Item": "Whole wheat pasta with homemade marinara sauce and a side salad",
      "Calories": 700
    },
    {
      "Meal": "Snack",
      "Item": "Air-popped popcorn",
      "Calories": 150
    }
  ],
  "Day 3": [
    {
      "Meal": "Breakfast",
      "Item": "Smoothie bowl with spinach, banana, berries, and almond milk",
      "Calories": 350
    },
    {
      "Meal": "Lunch",
      "Item": "Black bean and sweet potato tacos with avocado and salsa",
      "Calories": 500
    },
    {
      "Meal": "Dinner",
      "Item": "Grilled chicken with roasted vegetables and quinoa",
      "Calories": 700
    },
    {
      "Meal": "Snack",
      "Item": "Carrots and cucumbers with tzatziki dip",
      "Calories": 150
    }
  ],
  "Total Calories": 6000

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
        const newMealPlan: MealPlan = {
          id: "test",
          name: "test",
          description: "test",
          weeks: 1,
          plan: testPlan as Json,
          owner: user.toString(), /* foreign key to users.id */
        };
        await upsertMealPlanRecord(newMealPlan);
        res.status(200).json(message);

        // Handle "make" response
      } else if (intent === "delete") {
        res.status(200).json(message);
        // Handle "delete" response
      } else {
        res.status(200).json(message);
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



