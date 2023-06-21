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
import { postMealPlan } from '@/utils/helpers';
import { Meal, MealPlan } from '@/types';
import robotImage from '../robot-icon.jpg';
import userImage from '../ai-icon.jpg';

interface Props {
    title: string;
    footer?: ReactNode;
    children: ReactNode;
    completed: boolean;
}
function PlanCard({ title, footer, children, completed }: Props) {
    const bgColor = completed ? "bg-zinc-700" : "bg-zinc-700";
    return (
        <div className={`h-full w-48 p-px rounded-md flex-shrink-0 flex-grow-0 ${bgColor}`}>
            <div className="bg-black  h-full w-full  rounded-md m-auto">
                <div className='w-full h-full overflow-hidden flex flex-col rounded-md  '>
                    <div className="px-2 flex-1 overflow-y-scroll h-4/5 ">
                        <h1 className="text-l font-medium">{title}</h1>
                        <div className="" >
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
export default function ChatWindow() {
    const [loading, setLoading] = useState(false);
    const { isLoading, subscription, userDetails } = useUser();
    const [activeSection, setActiveSection] = useState(1);
    const [responseData, setResponseData] = useState('');
    const [mealPlan, setMealPlan] = useState<MealPlan>();
    const [meal, setMeal] = useState<Meal>();
    const [queryText, setQueryText] = useState('');
    const [messageList, setMessages] = useState<string[]>([]);
    const [mealPlanSaved, setMealPlanSaved] = useState(false);
    const planName = '';
    const planDescription = '';

    const fetchAIData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/generate?AIquery=${queryText}&userPlan=${mealPlan}`);

            const data = await response.json();
            if (data.chat != undefined) {
                setMessages((prevList) => [...prevList, "A" + data.chat]);
            }
            if (data.plan != undefined) {
                //setMeal(data);
                setMealPlan(data.plan);
            }
            setLoading(false);
        }
        catch (error) {
            console.log(error);
        }
    }
    const handleButtonClick = () => {
        setQueryText('')
        setMessages([...messageList?.concat("U" + queryText) ?? ["U" + queryText]]);
        fetchAIData();
        //populateChat();
    };

    const AiSection = () => {
        const messageListRef = useRef<HTMLDivElement>(null);
        useEffect(() => {
            if (messageListRef.current) {
                messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
            }
        }, [messageList]);

        return (
            <div className="flex-1 overflow-y-scroll w-full break-words" ref={messageListRef}>
                {messageList && messageList.map((message, index) => (
                    <div className={`flex ${index % 2 === 0 ? 'bg-zinc-700' : 'bg'} `}>
                        <div className="px-3 py-2 w-1/10">
                            {message.charAt(0) === "U" ?
                                <div className="circle-div overflow-hidden">
                                    <img src={userImage.src} alt="user Image" />
                                </div>
                                :
                                <div className="circle-div overflow-hidden">
                                    <img src={robotImage.src} alt="ai Image" />
                                </div>
                            }
                        </div>
                        <div className="py-3 pr-3 w-9/10">
                            <p>{message.slice(1)}</p>
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
    const saveMealPlan = async (mealplan: MealPlan) => {

        const url = '/api/savemealplan';
        const body = { mealplan, planName, planDescription };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };

        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.error?.message ?? 'An error occurred while saving meal plan.');
        }

        return data;
    };

    return (
        <section className="bg-black overflow-hidden flex-auto">

            <div className="sm:flex px-4 sm:flex-col sm:align-center">
                <div className="border border-zinc-700	max-w-3xl w-full rounded-md m-auto">
                    <div className="px-3">
                        <h3 className="text-xl my-1 blue-gradient-text font-medium">Hello User</h3>
                    </div>
                    <div>
                        {mealPlan ? (
                            <button
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => saveMealPlan(mealPlan).then(() => {
                                    // Execute logic after saveMealPlan Promise resolves
                                }).catch(error => {
                                    // Handle error here
                                })}>

                                Save
                            </button>
                        )
                            : <></>
                        }
                    </div>
                </div>
            </div>

            <div className="sm:flex px-4 sm:flex-col sm:align-center">
                <div className="border border-zinc-700	max-w-3xl w-full rounded-md m-auto my-3">
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
                                    {loading ? (
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
                                                    {"Calories: " + mealPlan.day2.totalCalories}
                                                </div>
                                                : <div> </div>
                                        }
                                    </div>
                                }
                                completed={true}
                            >
                                <div className="mt-1  w-full mb-1">
                                    {loading ? (
                                        <div className="h-12 mb-6">
                                            <LoadingDots />
                                        </div>
                                    ) : mealPlan ? (
                                        <div className="text-xs ">
                                            <div className="row">
                                                {"Breakfast: "} {mealPlan.day2.breakfast.item}
                                            </div>
                                            <hr />
                                            <div className="row">
                                                {"Lunch: "} {mealPlan.day2.lunch.item}
                                            </div>
                                            <hr />
                                            <div className="row">
                                                {"Dinner: "} {mealPlan.day2.dinner.item}
                                            </div>
                                            <hr />
                                            <div className="row">
                                                {"Snack: "} {mealPlan.day2.snack.item}
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
                                                    {"Calories: " + mealPlan.day3.totalCalories}
                                                </div>
                                                : <div> </div>
                                        }
                                    </div>
                                }
                                completed={true}
                            >
                                <div className="mt-1  w-full mb-1">
                                    {loading ? (
                                        <div className="h-12 mb-6">
                                            <LoadingDots />
                                        </div>
                                    ) : mealPlan ? (
                                        <div className="text-xs ">
                                            <div className="row">
                                                {"Breakfast: "} {mealPlan.day3.breakfast.item}
                                            </div>
                                            <hr />
                                            <div className="row">
                                                {"Lunch: "} {mealPlan.day3.lunch.item}
                                            </div>
                                            <hr />
                                            <div className="row">
                                                {"Dinner: "} {mealPlan.day3.dinner.item}
                                            </div>
                                            <hr />
                                            <div className="row">
                                                {"Snack: "} {mealPlan.day3.snack.item}
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
                                                    {"Calories: " + mealPlan.day4.totalCalories}
                                                </div>
                                                : <div> </div>
                                        }
                                    </div>
                                }
                                completed={true}
                            >
                                <div className="mt-1  w-full mb-1">
                                    {loading ? (
                                        <div className="h-12 mb-6">
                                            <LoadingDots />
                                        </div>
                                    ) : mealPlan ? (
                                        <div className="text-xs ">
                                            <div className="row">
                                                {"Breakfast: "} {mealPlan.day4.breakfast.item}
                                            </div>
                                            <hr />
                                            <div className="row">
                                                {"Lunch: "} {mealPlan.day4.lunch.item}
                                            </div>
                                            <hr />
                                            <div className="row">
                                                {"Dinner: "} {mealPlan.day4.dinner.item}
                                            </div>
                                            <hr />
                                            <div className="row">
                                                {"Snack: "} {mealPlan.day4.snack.item}
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
                                                    {"Calories: " + mealPlan.day5.totalCalories}
                                                </div>
                                                : <div> </div>
                                        }
                                    </div>
                                }
                                completed={true}
                            >
                                <div className="mt-1  w-full mb-1">
                                    {loading ? (
                                        <div className="h-12 mb-6">
                                            <LoadingDots />
                                        </div>
                                    ) : mealPlan ? (
                                        <div className="text-xs ">
                                            <div className="row">
                                                {"Breakfast: "} {mealPlan.day5.breakfast.item}
                                            </div>
                                            <hr />
                                            <div className="row">
                                                {"Lunch: "} {mealPlan.day5.lunch.item}
                                            </div>
                                            <hr />
                                            <div className="row">
                                                {"Dinner: "} {mealPlan.day5.dinner.item}
                                            </div>
                                            <hr />
                                            <div className="row">
                                                {"Snack: "} {mealPlan.day5.snack.item}
                                            </div>
                                        </div>
                                    ) : (
                                        <p></p>
                                    )}
                                </div>
                            </PlanCard>
                        </div>
                    </div>

                    <div className="border-t h-96 overflow-hidden border-zinc-700 bg-black text-zinc-500 rounded-b-md">
                        <div >
                            <div className="h-80 pb-9 text-gray-200">
                                <div className="flex flex-col">
                                    <div className="flex">
                                        <div className=" mx-auto">
                                            <div
                                                className={`py-2 cursor-pointer ${activeSection === 1 ? "underline" : ""
                                                    }`}
                                                onClick={() => setActiveSection(1)}
                                            >
                                                <h1 className="text-xl font-bold grey-gradient-text ">CHAT</h1>
                                            </div>

                                        </div>
                                        <div className=" mx-auto">
                                            <div
                                                className={`py-2 cursor-pointer ${activeSection === 2 ? "underline" : ""
                                                    }`}
                                                onClick={() => setActiveSection(2)}
                                            >
                                                <h1 className="text-xl grey-gradient-text font-bold ">SAVED</h1>
                                            </div>

                                        </div>
                                        <div className=" mx-auto">
                                            <div
                                                className={`py-2 cursor-pointer ${activeSection === 2 ? "underline" : ""
                                                    }`}
                                                onClick={() => setActiveSection(3)}
                                            >
                                                <h1 className="text-xl grey-gradient-text font-bold ">SETTINGS</h1>
                                            </div>

                                        </div>

                                    </div>
                                </div>

                                <div className=" h-full flex flex-col">
                                    {activeSection === 1 ? (
                                        <AiSection />
                                    ) : activeSection === 2 ? (
                                        <ManualSection />
                                    ) : null}
                                </div>

                            </div>

                            <div className="relative border-zinc-700 border-t bg-black">
                                <input
                                    type="text"
                                    id="userInput"
                                    value={queryText} onChange={(e) => setQueryText(e.target.value)}
                                    className=" pl-5 bg-transparent rounded-md h-16 text-gray-200 w-9/12 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    placeholder="Make a mealplan plan..."
                                />
                                <button
                                    className="absolute right-0 w-3/12 top-0 h-full px-2 bg-zinc-900 text-gray-100  focus:outline-none hover:bg-gray-600"
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