import { useState, ReactNode, FC, useEffect, useRef } from 'react';
import Link from 'next/link';
import React from 'react';

import { GetServerSidePropsContext } from 'next';
import {
  createServerSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';

import LoadingDots from '@/components/ui/LoadingDots';
import Button from '@/components/ui/Button';
import { useUser } from '@/utils/useUser';
import { postData } from '@/utils/helpers';
import { Meal, MealPlan } from '@/types';
import robotImage from '../robot-icon.avif';
import userImage from '../ai-icon.jpg';

interface Props {
  title: string;
  footer?: ReactNode;
  children: ReactNode;
  completed: boolean;
}
interface Messages {
  avatar: string;
  text: string;
  children: ReactNode;
}
type StockData = {
  name: string,
  price: number
};

type Response = {
  role: string,
  content: string,
}

type Chats = {
  messages: string[];
};

function PlanCard({ title, footer, children, completed }: Props) {
  const bgColor = completed ? "blue-gradient-bg" : "bg-zinc-700";
  return (
    <div className={`h-full w-48 p-px rounded-md flex-shrink-0 flex-grow-0 ${bgColor}`}>
      <div className="bg-black h-full w-full  rounded-md m-auto">
        <div className='w-full h-full flex flex-col rounded-md  '>
          <div className="px-2  h-4/5 ">
            <h1 className="text-l font-medium">{title}</h1>
            <div overflow-y-scroll >
              {children}
            </div>
          </div>
          <div className="h-1/5 border-zinc-700 bg-zinc-900 p-2 text-zinc-500 rounded-b-md">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
} // PlanCard

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: '/signin',
        permanent: false
      }
    };

  return {
    props: {
      initialSession: session,
      user: session.user
    }
  };
};


export default function Account({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const { isLoading, subscription, userDetails } = useUser();
  const [activeSection, setActiveSection] = useState(1);
  const [responseData, setResponseData] = useState('');
  const [mealPlan, setMealPlan] = useState<MealPlan>();
  const [meal, setMeal] = useState<Meal>();
  const [queryText, setQueryText] = useState('');
  const [messageList, setMessages] = useState<string[]>([]);

  const fetchAIData = async () => {
    try {
      const response = await fetch(`/api/generate?AIquery=${queryText}&userPlan=${mealPlan}`);
      const data = await response.json();
      if (data.chat != undefined) {
        setMessages((prevList) => [...prevList, data.chat]);
      }
      if (data.plan != undefined) {
        //setMeal(data);
        setMealPlan(data.plan);
      }
    }
    catch (error) {
      console.log(error);
    }
  }
  const handleButtonClick = () => {
    setQueryText('')
    setMessages([...messageList?.concat(queryText) ?? [queryText]]);
    fetchAIData();
    //populateChat();
  };

  const AISection = () => {
    const messageListRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (messageListRef.current) {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      }
    }, [messageList]);

    return (
      <div className="flex-1 overflow-y-scroll w-full break-words" ref={messageListRef}>
        {messageList && messageList.map((message, index) => (
          <div className={`flex ${index % 2 === 0 ? 'bg-black' : 'bg'} `}>
              <div className="w-1/10">
                {index % 2 === 0 ?
                  <div className="circle-div">
                    <img src={userImage.src} alt="user Image" />
                  </div>
                  :
                  <div className="circle-div">
                    <img src={robotImage.src} alt="ai Image" />
                  </div>
                }
              </div>
              <div className="w-9/10">
                {message}
              </div>
          </div>
        ))}
      </div>
    )
  }

  const ManualSection = () => {
    return (
      <div> <p>saved</p> </div>
    )
  }

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const { url, error } = await postData({
        url: '/api/create-portal-link'
      });
      window.location.assign(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
    setLoading(false);
  };

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  //const section1Class = activeSection === 1 ? "block" : "hidden";
  //const section2Class = activeSection === 2 ? "block" : "hidden";


  return (
    <section className="bg-black overflow-hidden flex-auto h-screen">
      <div className="sm:flex px-4 sm:flex-col sm:align-center">
        <div className="border border-zinc-700	max-w-3xl w-full rounded-md m-auto">
          <div className="px-3">
            <h3 className="text-xl my-1 blue-gradient-text font-medium">Hello Samuel</h3>
          </div>
        </div>
      </div>

      <div className="sm:flex px-4 sm:flex-col sm:align-center">
        <div className="border border-zinc-700	max-w-3xl w-full rounded-md m-auto mt-3">
          <div className="px-3 py-3 h-56">
            <div className="flex h-full overflow-x-scroll space-x-3">

              <PlanCard
                title="Monday"
                footer={
                  <div>
                    {
                      mealPlan ?
                        <div className="flex items-start justify-between flex-col ">
                          {"Calories: " + mealPlan.day1.totalCalories}
                        </div>
                        : <div> </div>
                    }
                  </div>
                }
                completed={true}
              >
                <div className="mt-1  w-full mb-1">
                  {isLoading ? (
                    <div className="h-12 mb-6">
                      <LoadingDots />
                    </div>
                  ) : mealPlan ? (
                    <div className="text-xs ">
                      <div className="row">
                        {"Breakfast: "} {mealPlan.day1.breakfast.item}
                      </div>
                      <hr />
                      <div className="row">
                        {"Lunch: "} {mealPlan.day1.lunch.item}
                      </div>
                      <hr />
                      <div className="row">
                        {"Dinner: "} {mealPlan.day1.dinner.item}
                      </div>
                      <hr />
                      <div className="row">
                        {"Snack: "} {mealPlan.day1.snack.item}
                      </div>
                    </div>
                  ) : (
                    <p></p>
                  )}
                </div>
              </PlanCard>
              <PlanCard
                title="Tuesday"
                footer={
                  <div>
                    {
                      mealPlan ?
                        <div className="flex items-start justify-between flex-col ">
                          {mealPlan.day2.totalCalories}
                        </div>
                        : <div> </div>
                    }
                  </div>
                }
                completed={true}
              >
                <div className="mt-2 w-full mb-1">
                  {isLoading ? (
                    <div className="h-12 mb-6">
                      <LoadingDots />
                    </div>
                  ) : mealPlan ? (
                    <div className="text-xs ">
                      <div className="row">
                        {"Breakfast: "} {mealPlan.day1.breakfast.item}
                      </div>
                      <hr />
                      <div className="row">
                        {"Lunch: "} {mealPlan.day1.lunch.item}
                      </div>
                      <hr />
                      <div className="row">
                        {"Dinner: "} {mealPlan.day1.dinner.item}
                      </div>
                      <hr />
                      <div className="row">
                        {"Snack: "} {mealPlan.day1.snack.item}
                      </div>
                    </div>
                  ) : (
                    <p></p>
                  )}
                </div>
              </PlanCard>

              <PlanCard
                title="Wednesday"
                footer={
                  <div>
                    {
                      mealPlan ?
                        <div className="flex items-start justify-between flex-col ">
                          {mealPlan.day1.totalCalories}
                        </div>
                        : <div> </div>
                    }
                  </div>
                }
                completed={true}
              >
                <div className="mt-2 w-full mb-1">
                  {isLoading ? (
                    <div className="h-12 mb-6">
                      <LoadingDots />
                    </div>
                  ) : mealPlan ? (
                    <div className="text-xs ">
                      <div className="row">
                        {"Breakfast: "} {mealPlan.day1.breakfast.item}
                      </div>
                      <hr />
                      <div className="row">
                        {"Lunch: "} {mealPlan.day1.lunch.item}
                      </div>
                      <hr />
                      <div className="row">
                        {"Dinner: "} {mealPlan.day1.dinner.item}
                      </div>
                      <hr />
                      <div className="row">
                        {"Snack: "} {mealPlan.day1.snack.item}
                      </div>
                    </div>
                  ) : (
                    <p></p>
                  )}
                </div>
              </PlanCard>

              <PlanCard
                title="Thursday"
                footer={
                  <div>
                    {
                      mealPlan ?
                        <div className="flex items-start justify-between flex-col ">
                          {mealPlan.day1.totalCalories}
                        </div>
                        : <div> </div>
                    }
                  </div>
                }
                completed={true}
              >
                <div className="mt-2 w-full mb-1">
                  {isLoading ? (
                    <div className="h-12 mb-6">
                      <LoadingDots />
                    </div>
                  ) : mealPlan ? (
                    <div className="text-xs ">
                      <div className="row">
                        {"Breakfast: "} {mealPlan.day1.breakfast.item}
                      </div>
                      <hr />
                      <div className="row">
                        {"Lunch: "} {mealPlan.day1.lunch.item}
                      </div>
                      <hr />
                      <div className="row">
                        {"Dinner: "} {mealPlan.day1.dinner.item}
                      </div>
                      <hr />
                      <div className="row">
                        {"Snack: "} {mealPlan.day1.snack.item}
                      </div>
                    </div>
                  ) : (
                    <p></p>
                  )}
                </div>
              </PlanCard>

              <PlanCard
                title="Friday"
                footer={
                  <div>
                    {
                      mealPlan ?
                        <div className="flex items-start justify-between flex-col ">
                          {mealPlan.day1.totalCalories}
                        </div>
                        : <div> </div>
                    }
                  </div>
                }
                completed={true}
              >
                <div className="mt-2 w-full mb-1">
                  {isLoading ? (
                    <div className="h-12 mb-6">
                      <LoadingDots />
                    </div>
                  ) : mealPlan ? (
                    <div className="text-xs ">
                      <div className="row">
                        {"Breakfast: "} {mealPlan.day1.breakfast.item}
                      </div>
                      <hr />
                      <div className="row">
                        {"Lunch: "} {mealPlan.day1.lunch.item}
                      </div>
                      <hr />
                      <div className="row">
                        {"Dinner: "} {mealPlan.day1.dinner.item}
                      </div>
                      <hr />
                      <div className="row">
                        {"Snack: "} {mealPlan.day1.snack.item}
                      </div>
                    </div>
                  ) : (
                    <p></p>
                  )}
                </div>
              </PlanCard>

              <PlanCard
                title="Saturday"
                footer={
                  <div>
                    {
                      mealPlan ?
                        <div className="flex items-start justify-between flex-col ">
                          {mealPlan.day1.totalCalories}
                        </div>
                        : <div> </div>
                    }
                  </div>
                }
                completed={true}
              >
                <div className="mt-2 w-full mb-1">
                  {isLoading ? (
                    <div className="h-12 mb-6">
                      <LoadingDots />
                    </div>
                  ) : mealPlan ? (
                    <div className="text-xs ">
                      <div className="row">
                        {"Breakfast: "} {mealPlan.day1.breakfast.item}
                      </div>
                      <hr />
                      <div className="row">
                        {"Lunch: "} {mealPlan.day1.lunch.item}
                      </div>
                      <hr />
                      <div className="row">
                        {"Dinner: "} {mealPlan.day1.dinner.item}
                      </div>
                      <hr />
                      <div className="row">
                        {"Snack: "} {mealPlan.day1.snack.item}
                      </div>
                    </div>
                  ) : (
                    <p></p>
                  )}
                </div>
              </PlanCard>

              <PlanCard
                title="Sunday"
                footer={
                  <div>
                    {
                      mealPlan ?
                        <div className="flex items-start justify-between flex-col ">
                          {mealPlan.day1.totalCalories}
                        </div>
                        : <div> </div>
                    }
                  </div>
                }
                completed={true}
              >
                <div className="mt-2 w-full mb-1">
                  {isLoading ? (
                    <div className="h-12 mb-6">
                      <LoadingDots />
                    </div>
                  ) : mealPlan ? (
                    <div className="text-xs ">
                      <div className="row">
                        {"Breakfast: "} {mealPlan.day1.breakfast.item}
                      </div>
                      <hr />
                      <div className="row">
                        {"Lunch: "} {mealPlan.day1.lunch.item}
                      </div>
                      <hr />
                      <div className="row">
                        {"Dinner: "} {mealPlan.day1.dinner.item}
                      </div>
                      <hr />
                      <div className="row">
                        {"Snack: "} {mealPlan.day1.snack.item}
                      </div>
                    </div>
                  ) : (
                    <p></p>
                  )}
                </div>
              </PlanCard>

            </div>
          </div>

          <div className="border-t h-96 overflow-hidden border-zinc-700 bg-zinc-900 text-zinc-500 rounded-b-md">
            <div >
              <div className="h-80 text-gray-200">
                <div className="flex flex-col">
                  <div className="flex">
                    <div className=" mx-auto">
                      <div
                        className={`py-2 cursor-pointer ${activeSection === 1 ? "underline" : ""
                          }`}
                        onClick={() => setActiveSection(1)}
                      >
                        <h2 className="text-xl font-bold grey-gradient-text ">FITPAL AI</h2>
                      </div>

                    </div>
                    <div className=" mx-auto">
                      <div
                        className={`py-2 cursor-pointer ${activeSection === 2 ? "underline" : ""
                          }`}
                        onClick={() => setActiveSection(2)}
                      >
                        <h2 className="text-xl grey-gradient-text font-bold ">SAVED PLANS</h2>
                      </div>

                    </div>
                  </div>
                </div>

                <div className="pb-14 h-full flex flex-col">
                  {activeSection === 1 ? (
                    <AISection />
                  ) : activeSection === 2 ? (
                    <ManualSection />
                  ) : null}
                </div>

              </div>

              <div className="relative bg-black">
                <input
                  type="text"
                  id="userInput"
                  value={queryText} onChange={(e) => setQueryText(e.target.value)}
                  className=" pl-5 bg-transparent rounded-md h-14 text-gray-200 w-9/12 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Make a workout plan for 4 days.."
                />
                <button
                  className="absolute right-0 w-3/12 top-0 h-full px-2 bg-zinc-900 text-gray-100 rounded-r-md focus:outline-none hover:bg-gray-600"
                  onClick={handleButtonClick}
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div >

    </section >
  )
}