import { useState, ReactNode, FC, useEffect, useRef } from 'react';
import Link from 'next/link';
import React from 'react';

import ChatWindow from './ChatWindow';

export default function HomePage() {

    return (
        <div>
            <div className='sm:h-screen'>
                <div className="mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className=" mt-8 sm:align-center ">
                        <p className="text-7xl font-extrabold text-white sm:text-center sm:text-8xl  m-auto">
                            Create. <span className='text-blue'>Track</span> Achieve.
                        </p>
                    </div>
                    <div>
                        <p className="mt-9 mb-14 text-xl text-zinc-200 sm:text-center sm:text-2xl max-w-4xl m-auto">
                            Your AI-powered health and fitness companion. Personalized exercises and meal plans, real-time feedback, and support. Achieve your goals with ease.
                        </p>
                    </div>
                </div>

                <div className="bg-black pb-24 px-8">
                    <div className="rounded-full border h-20 border-gray-600 max-w-md mx-auto sm:max-w-lg">
                        <div className="relative h-full ">
                            <input
                                type="text"
                                className=" rounded-full py-2 h-full px-4 text-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                placeholder="Email address"
                            />
                            <button className="absolute right-0 top-0 h-full px-4 bg-gray-500 text-gray-100 rounded-r-full focus:outline-none hover:bg-gray-600">
                                Button
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ChatWindow />
        </div>
    )
}