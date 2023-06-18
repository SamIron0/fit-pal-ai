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
import robotImage from '../robot-icon.jpg';
import userImage from '../ai-icon.jpg';
import ChatWindow from './ChatWindow';

interface Props {
    title: string;
    footer?: ReactNode;
    children: ReactNode;
    completed: boolean;
}
function PlanCard({ title, footer, children, completed }: Props) {
    const bgColor = completed ? "blue-gradient-bg" : "bg-zinc-700";
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
export default function HomePage() {
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
    return (<ChatWindow/>)
}