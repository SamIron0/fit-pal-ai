export default function DashBoard() {
 
    return (
        <section className="bg-black">
                <div className="bg-gray-800 rounded-lg border border-gray-300 max-w-md mx-auto p-4">
                    <div className="relative">
                        
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg border border-gray-300 max-w-md mx-auto p-4">
                    <div className="relative">
                        <input
                        type="text"
                        className="bg-gray-700 rounded-full py-2 px-4 text-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="Make a eworkout plan for 4 days.."
                        />
                        <button className="absolute right-0 top-0 h-full px-4 bg-gray-500 text-gray-100 rounded-r-full focus:outline-none hover:bg-gray-600">
                        Button
                        </button>
                    </div>
                </div>
        </section>
    )
    }
