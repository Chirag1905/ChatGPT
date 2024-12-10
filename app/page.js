"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResponse(""); // Clear previous response

    try {
      const reader = await axios
        .post("http://localhost:3000/api/chat", { prompt })
        .then((res) => res.data.getReader());

      const decoder = new TextDecoder();
      let done = false;
      let text = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        text += decoder.decode(value, { stream: true });
        setResponse((prev) => prev + text); // Update response incrementally
      }

      setIsLoading(false); // Finish loading
    } catch (error) {
      setResponse("Error: Unable to fetch response.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Application</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-32 border border-gray-300 p-2 rounded mb-4"
          placeholder="Type your question..."
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Send"}
        </button>
      </form>
      {response && (
        <div className="mt-6 p-4 w-full max-w-md bg-white border border-gray-300 rounded">
          <h2 className="font-bold text-lg mb-2">Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
