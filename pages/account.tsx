import { useState, ReactNode, FC, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import {
  createServerSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';

import LoadingDots from '@/components/ui/LoadingDots';
import Button from '@/components/ui/Button';
import { useUser } from '@/utils/useUser';
import { postData } from '@/utils/helpers';
//import { get } from 'node:http';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
  completed: boolean;
}

interface Plan {
  [key: string]: Array<{
    Meal: string;
    Item: string;
    Calories: number;
  }>;
}

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
  const { isLoading, mealplans, subscription, userDetails } = useUser();
  const [activeSection, setActiveSection] = useState(1);
  const [responseData, setResponseData] = useState('');
  const [queryText, setQueryText] = useState('');
  const [messageList, setMessages] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const aiSectionRef = useRef<HTMLDivElement>(null);

  const fetchAIData = async () => {
    try {
      const response = await fetch(`/api/generate?AIquery=${queryText}&user=${userDetails?.id}`);
      const data = await response.json();
      setResponseData(data);
      //console.log('here');
      const handleMessage = () => {
        setMessages((prevList) => [...prevList, data]);
      };
      handleMessage();

    }
    catch (error) {
      console.log(error);
    }
  }

  const handleButtonClick = () => {
    // scroll into view
    if (inputRef.current != null) {
      inputRef.current.value = '';
    }
    if (aiSectionRef.current) {
      (aiSectionRef.current as HTMLElement).scrollIntoView({ behavior: "smooth" });
    }
    setMessages([...messageList?.concat(queryText) ?? [queryText]]);
    fetchAIData();
    //populateChat();
  };

  const messageBoxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messageList]);

  function PlanCard({ title, footer, children, completed }: Props) {
    const bgColor = completed ? "green-gradient-bg" : "bg-zinc-700";
    return (
      <div className={`h-full w-l w-full p-px rounded-md ${bgColor}`}>
        <div className="bg-black h-full	w-l w-full p rounded-md m-auto">
          <div className="px-2 py-1">
            <h1 className="text-l mb-1 font-medium">{title}</h1>
            <div className="text-m mt-8 mb-4 font-semibold">
              {isLoading ? (
                <div className="h-12 mb-6">
                  <LoadingDots />
                </div>
              ) : children ? (
                <Link href="/">
                  {children}
                </Link>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="border-t border-zinc-700 bg-zinc-900 p-2 text-zinc-500 rounded-b-md">
            <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
              {footer}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const PlanCardSection = () => {
    if (!mealplans) return null;
    let count = mealplans.length;
    //const planCards = [];
    // iterate throught all the plans belonging to user
    // for now, we will just display the first plan and first week
    for (let i = 0; i < count; i++) {
      //get the current plan object based on the index
      const plan = mealplans[i % mealplans.length];
      const planinJson = plan.plan as Plan;
      let day1Card = null;
      let day2Card = null;
      let day3Card = null;
      let day4Card = null;
      let day5Card = null;
      let day6Card = null;
      let day7Card = null;
      if (planinJson !== null) {
        if ("Day 1" in planinJson) {
          const day1: Array<Record<string, any>> = planinJson['Day 1'];
          //const day2: Array<Record<string, any>> = planinJson['Day 2'];
          //planCards.push(day1);
          for (let j = 0; j < day1.length; j++) {
            day1[j]["Meal"];
            day1[j]["Item"];
            day1[j]["Calories"];

            day1Card = PlanCard({ title: "Day 1", footer: day1[j][""], children: "", completed: false });
          }
        }
        if ("Day 2" in planinJson) {
          const day2: Array<Record<string, any>> = planinJson['Day 2'];
          //const day2: Array<Record<string, any>> = planinJson['Day 2'];
          //planCards.push(day1);
          for (let j = 0; j < day2.length; j++) {
            day2[j]["Meal"];
            day2[j]["Item"];
            day2[j]["Calories"];

            day2Card = PlanCard({ title: "Day 2", footer: day2[j][""], children: "", completed: false });
          }

          if ("Day 3" in planinJson) {
            const day3: Array<Record<string, any>> = planinJson['Day 3'];
            //const day2: Array<Record<string, any>> = planinJson['Day 2'];
            //planCards.push(day1);
            for (let j = 0; j < day3.length; j++) {
              day3[j]["Meal"];
              day3[j]["Item"];
              day3[j]["Calories"];

              day3Card = PlanCard({ title: "Day 3", footer: day3[j][""], children: "", completed: true });
            }
          }

          if ("Day 4" in planinJson) {
            const day4: Array<Record<string, any>> = planinJson['Day 4'];
          }
          if ("Day 5" in planinJson) {
            const day5: Array<Record<string, any>> = planinJson['Day 5'];
          }
          if ("Day 6" in planinJson) {
            const day6: Array<Record<string, any>> = planinJson['Day 6'];
          }
          if ("Day 7" in planinJson) {
            const day7: Array<Record<string, any>> = planinJson['Day 7'];
          }
        }
      }
      return (
        <>{day1Card}{day2Card}{day3Card}</>
      );
    };
  }

  const AISection = () => {
    return (
      <div className="flex-1 overflow-y-scroll w-full break-words" ref={messageBoxRef}>
        {messageList && messageList.map((message, index) => (
          <div className={`${index % 2 === 0 ? 'bg-black' : 'bg'}`}>
            <p className={'mx-5 py-5'}>
              {index % 2 === 0 ? "S   " : "B   "}
              {message}
            </p>
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
    <section className="bg-black flex-auto h-screen" ref={aiSectionRef}>
      <div className="sm:flex px-4 sm:flex-col sm:align-center">
        <div className="border border-zinc-700	max-w-3xl w-full rounded-md m-auto">
          <div className="px-3">
            <h3 className="text-xl my-1 blue-gradient-text font-medium"

            >Hello Samuel</h3>
          </div>
        </div>
      </div>

      <div className="sm:flex px-4 sm:flex-col sm:align-center">
        <div className="border border-zinc-700	max-w-3xl w-full rounded-md m-auto mt-3">
          <div className="px-3 py-3 h-56">
            <div className="flex h-full overflow-x-scroll space-x-3">
            </div>
          </div>

          <div className="border-t h-96 overflow-hidden border-zinc-700 bg-zinc-900 text-zinc-500 rounded-b-md">
            <div >
              <div className="h-80 text-gray-200">
                <div className="flex flex-col">
                  <div className="flex">
                    <div className="pb-2 mx-auto">
                      <div
                        className={`pt-2  cursor-pointer ${activeSection === 1 ? "border-b-2 border-black" : ""
                          }`}
                        onClick={() => setActiveSection(1)}
                      >
                        <h2 className="text-xl font-bold text-zinc-300">FITPAL AI</h2>
                      </div>

                    </div>
                    <div className=" mx-auto">
                      <div
                        className={`pt-2 cursor-pointer ${activeSection === 2 ? "border-b-2 border-black" : ""
                          }`}
                        onClick={() => setActiveSection(2)}
                      >
                        <h2 className="text-xl font-bold text-zinc-300">SAVED PLANS</h2>
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
                  ref={inputRef}
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
      </div>

    </section >
  )
}
