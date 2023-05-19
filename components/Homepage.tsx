export default function HomePage() {

    return (
        <section className="bg-black">
            <div className="max-w-6xl mx-auto py-8 sm:py-24 px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:flex-col sm:align-center">
                    <h1 className="text-6xl font-extrabold text-white sm:text-center sm:text-6xl">
                        Your AI Fitness Coach.
                    </h1>
                </div>
                <div>
                    <p className="mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl max-w-2xl m-auto">
                        Ask it to make meal plans/workout plans
                    </p>
                </div>
            </div>

            <div className="bg-black">
                <div className="bg-gray-800 rounded-lg border border-gray-300 max-w-md mx-auto p-4">
                    <div className="relative">
                        <input
                            type="text"
                            className="bg-gray-700 rounded-full py-2 px-4 text-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            placeholder="Make a workout plan for 4 days.."
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
