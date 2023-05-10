import HomePage from '@/components/Homepage';
import { GetStaticPropsResult } from 'next';
import Pricing from '@/components/Pricing';
import { getActiveProductsWithPrices } from '@/utils/supabase-client';
import { Product } from 'types';

interface Props {
  products: Product[];
}

export default function PricingPage() {
  //return <Pricing products={products} />;
  return <HomePage/>;
}
/*
export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  const products = await getActiveProductsWithPrices();

  return {
    
    props: {
      products 
    },
    revalidate: 60
  };
}
*/