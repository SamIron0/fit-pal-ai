export default function HomePage() {

    return (
        <section className="bg-black">
            <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className=" sm:align-center ">
                    <p className="text-5xl font-extrabold text-white sm:text-center sm:text-8xl max-w-4xl m-auto">
                        Create.Track.Achieve.
                    </p>
                    <h3 className=" text-5xl mt-9 mb-14  text-zinc-200 sm:text-center sm:text-3xl max-w-4xl m-auto">
                        Create.Track.Achieve.
                    </h3>
                </div>
                <div>
                    <p className="mt-9 mb-14 text-xxl text-zinc-200 sm:text-center sm:text-xl max-w-4xl m-auto">
                        Your AI-powered health and fitness companion. Personalized exercises and meal plans, real-time feedback, and support. Achieve your goals with ease.
                    </p>
                </div>
            </div>

            <div className="bg-black px-8">
            <div className="rounded-full border h-18.5 border-gray-600 max-w-md mx-auto sm:max-w-lg">                    
                    <div className="relative">
                        <input
                            type="text"
                            className=" rounded-full py-2 px-4 text-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            placeholder="Email address"
                        />
                        <button className="absolute right-0 top-0 h-full px-4 bg-gray-500 text-gray-100 rounded-r-full focus:outline-none hover:bg-gray-600">
                            Button
                        </button>
                    </div>
                </div>
            </div>

            <div>
            </div>

        </section>
    )
}
