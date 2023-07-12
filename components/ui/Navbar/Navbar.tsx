import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

import Logo from '@/components/icons/Logo';
import { useUser } from '@/utils/useUser';

import s from './Navbar.module.css';
import Button from '../Button/Button';

const Navbar = () => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

  function handleButtonClick(): void {

  }

  return (
    <nav className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex justify-between align-center flex-row py-4 md:py-6 relative">
          <div className="flex flex-1 items-center">
            <Link href="/" className={s.logo} aria-label="Logo">
              <Logo />
            </Link>

          </div>

          <div className="flex flex-1 justify-end space-x-8">
            <button
              className="w-[90px] h-[32px] bg-transparent border-[1px] border-blue-500 rounded-md"
              >
              {user ? (
                  <span
                    className={s.link}
                    onClick={async () => {
                      await supabaseClient.auth.signOut();
                      router.push('/signin');
                    }}
                  >
                    Sign out
                  </span>
              ) : (
                <Link href="/signin" className={s.link}>
                  Sign in
                </Link>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
