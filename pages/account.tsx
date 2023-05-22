import { useState, ReactNode, FC, useEffect } from 'react';
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
import { stringify } from 'node:querystring';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
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

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="border border-zinc-700	max-w-3xl w-full p rounded-md m-auto my-8">
      <div className="px-5 py-4">
        <h3 className="text-2xl mb-1 font-medium">{title}</h3>
        <p className="text-zinc-300">{description}</p>
        {children}
      </div>
      <div className="border-t border-zinc-700 bg-zinc-900 p-4 text-zinc-500 rounded-b-md">
        {footer}
      </div>
    </div>
  );
}
function MessageBox({ avatar, text }: Messages) {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/4 p-4">
        {avatar}
      </div>
      <div className="w-full md:w-3/4 p-4">
        {text}
      </div>
    </div>
  )
}
function PlanCard({ title, description, footer, children }: Props) {
  return (
    <div className="border border-zinc-700	w-l w-full p rounded-md m-auto my-4">
      <div className="px-5 py-2">
        <h1 className="text-l mb-1 font-medium">{title}</h1>
        <p className="text-zinc-300">{description}</p>
        {children}
      </div>
      <div className="border-t border-zinc-700 bg-zinc-900 p-4 text-zinc-500 rounded-b-md">
        {footer}
      </div>
    </div>
  );
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
  const { isLoading, subscription, userDetails } = useUser();
  const [activeSection, setActiveSection] = useState(1);
  const [responseData, setResponseData] = useState<Response>({ role: '', content: '' });
  const [queryText, setQueryText] = useState('');
  const fetchAIData = async () => {
    try {

      const response = await fetch(`/api/generate?AIquery=${queryText}`, { timeout: 20000 } as RequestInit & { timeout: number });
      const data = await response.json();
      setResponseData(data);
    }
    catch (error) {
      console.log(error);
    }
  }
  const handleButtonClick = () => {
    fetchAIData();
    setMessages([...messageList?.concat(queryText) ?? [queryText]]);
    //populateChat();
  };
  const [messageList, setMessages] = useState<string[]>();

  const AISection = () => {
    return (
        <div className="flex-1 overflow-y-scroll w-full">
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
    <div className="h-screen ">
      <section className="bg-black h-full">
        <div className="sm:flex px-4 sm:flex-col sm:align-center">
          <div className="border border-zinc-700	max-w-3xl w-full rounded-md m-auto">
            <div className="px-5">
              <h3 className="text-xl my-1 font-medium">Hello Samuel</h3>
            </div>
          </div>
        </div>

        <div className="sm:flex px-4 sm:flex-col sm:align-center">
          <div className="border border-zinc-700	max-w-3xl w-full rounded-md m-auto mt-3">
            <div className="px-5">
              <div className="flex overflow-x-scroll space-x-4">

                <PlanCard
                  title="Monday"
                  description={
                    subscription
                      ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
                      : ''
                  }
                  footer={
                    <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">

                    </div>
                  }
                >
                  <div className="text-m mt-8 mb-4 font-semibold">
                    {isLoading ? (
                      <div className="h-12 mb-6">
                        <LoadingDots />
                      </div>
                    ) : subscription ? (
                      `${subscriptionPrice}/${subscription?.prices?.interval}`
                    ) : (
                      <Link href="/">Select something</Link>
                    )}
                  </div>
                </PlanCard>

                <PlanCard
                  title="Tuesday"
                  description={
                    subscription
                      ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
                      : ''
                  }
                  footer={
                    <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">

                    </div>
                  }
                >
                  <div className="text-m mt-8 mb-4 font-semibold">
                    {isLoading ? (
                      <div className="h-12 mb-6">
                        <LoadingDots />
                      </div>
                    ) : subscription ? (
                      `${subscriptionPrice}/${subscription?.prices?.interval}`
                    ) : (
                      <Link href="/">Select something</Link>
                    )}
                  </div>
                </PlanCard>

                <PlanCard
                  title="Wednesday"
                  description={
                    subscription
                      ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
                      : ''
                  }
                  footer={
                    <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">

                    </div>
                  }
                >
                  <div className="text-xl mt-8 mb-4 font-semibold">
                    {isLoading ? (
                      <div className="h-12 mb-6">
                        <LoadingDots />
                      </div>
                    ) : subscription ? (
                      `${subscriptionPrice}/${subscription?.prices?.interval}`
                    ) : (
                      <Link href="/">Select something</Link>
                    )}
                  </div>
                </PlanCard>
                <PlanCard
                  title="Thursday"
                  description={
                    subscription
                      ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
                      : ''
                  }
                  footer={
                    <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">

                    </div>
                  }
                >
                  <div className="text-xl mt-8 mb-4 font-semibold">
                    {isLoading ? (
                      <div className="h-12 mb-6">
                        <LoadingDots />
                      </div>
                    ) : subscription ? (
                      `${subscriptionPrice}/${subscription?.prices?.interval}`
                    ) : (
                      <Link href="/">Select something</Link>
                    )}
                  </div>
                </PlanCard>

                <PlanCard
                  title="Friday"
                  description={
                    subscription
                      ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
                      : ''
                  }
                  footer={
                    <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">

                    </div>
                  }
                >
                  <div className="text-xl mt-8 mb-4 font-semibold">
                    {isLoading ? (
                      <div className="h-12 mb-6">
                        <LoadingDots />
                      </div>
                    ) : subscription ? (
                      `${subscriptionPrice}/${subscription?.prices?.interval}`
                    ) : (
                      <Link href="/">Select something</Link>
                    )}
                  </div>
                </PlanCard>


                <PlanCard
                  title="Saturday"
                  description={
                    subscription
                      ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
                      : ''
                  }
                  footer={
                    <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">

                    </div>
                  }
                >
                  <div className="text-xl mt-8 mb-4 font-semibold">
                    {isLoading ? (
                      <div className="h-12 mb-6">
                        <LoadingDots />
                      </div>
                    ) : subscription ? (
                      `${subscriptionPrice}/${subscription?.prices?.interval}`
                    ) : (
                      <Link href="/">Select something</Link>
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
                          <h2 className="text-xl font-bold text-gray-800">FITPAL AI</h2>
                        </div>

                      </div>
                      <div className=" mx-auto">
                        <div
                          className={`py-2 cursor-pointer ${activeSection === 2 ? "underline" : ""
                            }`}
                          onClick={() => setActiveSection(2)}
                        >
                          <h2 className="text-xl font-bold text-gray-800">SAVED PLANS</h2>
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
        </div>
      </section >
    </div >
  )
}
