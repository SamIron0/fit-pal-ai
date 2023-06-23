import { useState, ReactNode, FC, useEffect, useRef } from 'react';
import Link from 'next/link';
import React from 'react';
import mealIcon from '../meal-icon.png';

import ChatWindow from './ChatWindow';

export default function HomePage() {

    return (
        <div>
            <div className='sm:h-screen'>
                <div className="mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className=" mt-8 sm:align-center ">
                        <p className="text-7xl font-extrabold text-white sm:text-center sm:text-8xl  m-auto">
                            Create. <span className="text-blue-500">Track.</span> Achieve.
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
                        <div className="flex h-full p-4">
                            <div className="circle-div w-1/5 overflow-hidden">
                                <img src={mealIcon.src} alt="meal image" />
                            </div>
                            <div className="w-3/5">
                            <input
                                type="text"
                                className=" rounded-full w-py-2 h-full px-4 text-gray-200  focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                placeholder="Email address"
                            />
                            </div>
                            <div className="w-1/5">
                            <button className="absolute right-0 top-0 h-full px-4  text-gray-100 rounded-r-full focus:outline-none hover:bg-gray-600">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1" />
                                </svg>
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ChatWindow />
        </div>
    )
}