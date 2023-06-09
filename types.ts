import Stripe from 'stripe';
import { Json } from './types_db';
import { type Message } from 'ai'

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
    error: string
  }
>

export interface PageMeta {
  title: string;
  description: string;
  cardImage: string;
}

export interface Customer {
  id: string /* primary key */;
  stripe_customer_id?: string;
}

export interface Product {
  id: string /* primary key */;
  active?: boolean;
  name?: string;
  description?: string;
  image?: string;
  metadata?: Stripe.Metadata;
}
export interface Meal {
  meal: string | null,
  item: string | null,
  calories: number | null
}
export interface MealPlan {
  [day: string]: { // day1, day2, ...
    breakfast: {
      item: string;
      calories: string;
    };
    lunch: {
      item: string;
      calories: string;
    };
    dinner: {
      item: string;
      calories: string;
    };
    snack: {
      item: string;
      calories: string;
    };
    totalCalories: string;
  };
}

export interface MealPlans {
  day1: Meal[],
  day2: Meal[],
  day3: Meal[],
  day4: Meal[],
  day5: Meal[],
}

export interface ProductWithPrice extends Product {
  prices?: Price[];
}
export interface UserDetails {
  id: string /* primary key */;
  first_name: string;
  last_name: string;
  full_name?: string;
  avatar_url?: string;
  billing_address?: Stripe.Address;
  payment_method?: Stripe.PaymentMethod[Stripe.PaymentMethod.Type];
  mealplans?: MealPlans[];
}

export interface Price {
  id: string /* primary key */;
  product_id?: string /* foreign key to products.id */;
  active?: boolean;
  description?: string;
  unit_amount?: number;
  currency?: string;
  type?: Stripe.Price.Type;
  interval?: Stripe.Price.Recurring.Interval;
  interval_count?: number;
  trial_period_days?: number | null;
  metadata?: Stripe.Metadata;
  products?: Product;
}

export interface PriceWithProduct extends Price { }

export interface Subscription {
  id: string /* primary key */;
  user_id: string;
  status?: Stripe.Subscription.Status;
  metadata?: Stripe.Metadata;
  price_id?: string /* foreign key to prices.id */;
  quantity?: number;
  cancel_at_period_end?: boolean;
  created: string;
  current_period_start: string;
  current_period_end: string;
  ended_at?: string;
  cancel_at?: string;
  canceled_at?: string;
  trial_start?: string;
  trial_end?: string;
  prices?: Price;
}
