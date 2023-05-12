import { useRef, useState } from "react";
const { Configuration, OpenAIApi } = require("openai");
let generated="";

const generate = async (e: any) => {
    e.preventDefault();
    //setGeneratedBios(""); 
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const prompt = `How do i make make toast`;

    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        temperature: 0,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ["\n"],
    });
    generated = response;

}

export default function DashBoard() {
    return (
        <section className="bg-black">
            <div>
                <h2
                    className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                >
                    Your generated bios
                </h2>
            </div>

            <div className="bg-gray-800 rounded-lg border border-gray-300 max-w-md mx-auto p-4">
                <div className="relative">
                    <input
                        type="text"
                        className="bg-gray-700 rounded-full py-2 px-4 text-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="Make a workout plan for 4 days.."
                    />

                    <button
                        onClick={(e) => generate(e)}
                        className="absolute right-0 top-0 h-full px-4 bg-gray-500 text-gray-100 rounded-r-full focus:outline-none hover:bg-gray-600">
                        Button
                    </button>

                    <button
                        className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                        disabled
                    >
                    </button>

                </div>
            </div>
        </section>
    )
}



