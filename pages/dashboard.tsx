import { useRef, useState } from "react";

export default function DashBoard() {
    const [loading, setLoading] = useState(false);
    const [bio, setBio] = useState("");
    const [generatedBios, setGeneratedBios] = useState<String>("");

    const bioRef = useRef<null | HTMLDivElement>(null);

    const scrollToBios = () => {
        if (bioRef.current !== null) {
            bioRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const prompt = `Generate 2 twitter biographies with no hashtags and clearly labeled "1." and "2.".
    Make sure each generated biography is less than 160 characters, has short sentences that are found in Twitter bios, and base them on this context: ${bio}${bio.slice(-1) === "." ? "" : "."
        }`;

    const generateBio = async (e: any) => {
        e.preventDefault();
        setGeneratedBios("");
        setLoading(true);
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt,
            }),
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        // This data is a ReadableStream
        const data = response.body;
        if (!data) {
            return;
        }

        const reader = data.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            setGeneratedBios((prev) => prev + chunkValue);
        }
        scrollToBios();
        setLoading(false);
    };
    return (
        <section className="bg-black">
            <div className="bg-gray-800 rounded-lg border border-gray-300 max-w-md mx-auto p-4">
                <div className="relative">
                    <div className="space-y-10 my-10">
                        {generatedBios && (
                            <>
                                <div>
                                    <h2
                                        className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                                        ref={bioRef}
                                    >
                                        Your generated bios
                                    </h2>
                                </div>
                                <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                                    {generatedBios
                                        .substring(generatedBios.indexOf("1") + 3)
                                        .split("2.")
                                        .map((generatedBio) => {
                                            return (
                                                <div
                                                    className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(generatedBio);

                                                    }}
                                                    key={generatedBio}
                                                >
                                                    <p>{generatedBio}</p>
                                                </div>
                                            );
                                        })}
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </div>

            <div className="bg-gray-800 rounded-lg border border-gray-300 max-w-md mx-auto p-4">
                <div className="relative">
                    <input
                        type="text"
                        className="bg-gray-700 rounded-full py-2 px-4 text-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="Make a eworkout plan for 4 days.."
                    />

                    {!loading && (
                        <button
                        onClick={(e) => generateBio(e)}
                        className="absolute right-0 top-0 h-full px-4 bg-gray-500 text-gray-100 rounded-r-full focus:outline-none hover:bg-gray-600">
                        Button
                        </button>)}
                    {loading && (
                        <button
                            className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                            disabled
                        >
                        </button>
                    )}

                </div>
            </div>
        </section>
    )
}



