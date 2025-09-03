"use client";
import { useState } from "react";

function App() {
  const [input, setInput] = useState("");

  const handleDebate = () => {
    alert(`Starting debate on: ${input}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#282828]">
      <h1 className="text-2xl font-bold mb-6">Enter a Claim</h1>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your claim here..."
        className="w-80 p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={handleDebate}
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600"
      >
        Start Debate
      </button>
    </div>
  );
}

export default App;
