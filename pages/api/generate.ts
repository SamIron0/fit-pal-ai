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
const testPlan = {
  "response": "make",
  "mealPlan": {
    "day1":
    {
      "meal": "Breakfast",
      "item": "Oatmeal with banana and almond milk",
      "calories": 350
    },
    "day2":
    {
      "meal": "Lunch",
      "item": "Grilled Chicken Salad",
      "calories": 400
    },
    "day3":
    {
      "meal": "Dinner",
      "item": "Salmon with roasted vegetables",
      "calories": 450
    }
  },
  "message": "I have created your meal plan for the next 3 days."
}
const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    const { AIquery, userPlan } = req.query;
    const chatResponseQuery = "You are a helpful fitness AI bot that resides on a backend server, servicing a website's users and your job is to make and edit meal plans. Reply only in json format and remove all newline characters(backslash n) that may exist in the json. If the user's input query listed at the end is asking to make a meal plan,then response: 'make', mealPlan: input the json meal plan you make here using the users input request here , message:a response to be displayed to user saying you've created it. else, if the statement is asking to edit a meal plan, then response: edit, mealPlan: the edited mealPlan created using the given mealplan and users instructions, message:some response saying youre done editing it. else if the statement is asking to delete a meal plan, then response:delete, mealPlan:null, message:some response saying you've done it. else if it is just a chat message that is within the context of your job, then response:chat, mealPlan:null, message: A response to the user's chat message. else,response:invalid, mealPlan:null, message: A sentence or 2 about not being able to complete user's request asking user to try a different message. User's input query: " + AIquery?.toString?.() ?? '' + " ,User's exisiting mealPlan(empty or a json): " + userPlan?.toString?.() ?? '' + ". each day in the mealplan  should have: meal: Breakfast or lunch or dinner, item: for example, Oatmeal with banana and almond mil, calories: e.g 350";
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
      const mealplan = aiJson.mealPlan;
      let response = {
        "chat": message,
        "plan": mealplan,
      }
      if (intent === "edit") {
        res.status(200).json(response);
      }
      else if (intent === "make") {
        res.status(200).json(response);
      } else if (intent === "delete") {
        response = {
          "chat": message,
          "plan": undefined,
        }
        res.status(200).json(message);
        // Handle "delete" response
      } else {
        response = {
          "chat": message,
          "plan": undefined,
        }
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
