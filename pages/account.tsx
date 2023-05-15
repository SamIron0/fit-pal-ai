import { useState, ReactNode } from 'react';
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

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

type Response = {
  data: string;
}

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

function PlanCard({ title, description, footer, children }: Props) {
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
  const [responseData, setResponseData] = useState('');

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

  const getResult = async () => {
    try {
      const response = await fetch('/api/generate');
      //const data = await response.json();
      //setResponseData(data);
      //console.log(data);
      //setMealData(data);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
  }

  return (
    <section className="bg-black mb-32">
      <div className="sm:flex px-4 sm:flex-col sm:align-center">
        <div className="border border-zinc-700	max-w-3xl w-full p rounded-md m-auto">
          <div className="px-5">
            <h3 className="text-xl my-1 font-medium">Hello Samuel</h3>
          </div>
        </div>
      </div>

      <div className="sm:flex px-4 sm:flex-col sm:align-center">
        <div className="border border-zinc-700	max-w-3xl w-full rounded-md m-auto my-4">
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

          <div className="border-t border-zinc-700 bg-zinc-900 p-4 text-zinc-500 rounded-b-md">

            <div>
              <div className="p-20">
                <p>{responseData}</p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  className="bg-black rounded-full py-2 px-4 text-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Make a workout plan for 4 days.."
                />
                <button
                  className="absolute right-0 top-0 h-full px-4 bg-gray-500 text-gray-100 rounded-r-full focus:outline-none hover:bg-gray-600"
                  onClick={getResult}>
                  Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Card
          title="Your Plan"
          description={
            subscription
              ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
              : ''
          }
          footer={
            <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">
                Manage your subscription on Stripe.
              </p>
              <Button
                variant="slim"
                loading={loading}
                disabled={loading || !subscription}
                onClick={redirectToCustomerPortal}
              >
                Open customer portal
              </Button>
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
              <Link href="/">Choose your plan</Link>
            )}
          </div>
        </Card>
        <Card
          title="Your Name"
          description="Please enter your full name, or a display name you are comfortable with."
          footer={<p>Please use 64 characters at maximum.</p>}
        >
          <div className="text-xl mt-8 mb-4 font-semibold">
            {userDetails ? (
              `${userDetails.full_name ??
              `${userDetails.first_name} ${userDetails.last_name}`
              }`
            ) : (
              <div className="h-8 mb-6">
                <LoadingDots />
              </div>
            )}
          </div>
        </Card>
        <Card
          title="Your Email"
          description="Please enter the email address you want to use to login."
          footer={<p>We will email you to verify the change.</p>}
        >
          <p className="text-xl mt-8 mb-4 font-semibold">
            {user ? user.email : undefined}
          </p>
        </Card>
      </div>
    </section>
  );
}
