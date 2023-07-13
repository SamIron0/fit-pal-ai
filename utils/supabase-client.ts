import {
  createBrowserSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';

import { MealPlan, ProductWithPrice, UserDetails } from 'types';
import type { Database } from 'types_db';

export const supabase = createBrowserSupabaseClient<Database>();

export const getActiveProductsWithPrices = async (): Promise<
  ProductWithPrice[]
> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    console.log(error.message);
  }
  // TODO: improve the typing here.
  return (data as any) || [];
};

export const getMealPlan = async (user: UserDetails): Promise<Record<string, any>[] | undefined> => {
  const mealPlanIds = user.mealplans || [];
  const mealPlanData: Record<string, any>[] = [];

  for (const id of mealPlanIds) {
    const { data, error } = await supabase
    .from('mealplans')
    .select('plan')
    .eq('id', id)
    .single();
 
    if (error) {
      console.error(`Failed to retrieve meal plan with ID ${id}: ${error.message}`);
      continue;
    }

    if (data?.plan) {
      mealPlanData.push(data.plan as Record<string, any>);
    } 
  }

  if (mealPlanData.length > 0) {
    return mealPlanData;
  }

  return undefined;
};






export const updateUserName = async (user: User, name: string) => {
  await supabase
    .from('users')
    .update({
      full_name: name
    })
    .eq('id', user.id);
};
