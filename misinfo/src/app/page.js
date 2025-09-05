"use client";
import { useState } from "react";

export default function Home() {
  const [claim, setClaim] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const startDebate = async () => {
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("http://localhost:8000/support-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim }),
      });
      const data = await res.json();
      setResult(data.supportive_arguments);
    } catch (error) {
      setResult("Error: Could not get response from backend.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#272727] p-6">
      <h1 className="text-2xl font-bold mb-6">AI Debate Assistant</h1>

      <input
        type="text"
        value={claim}
        onChange={(e) => setClaim(e.target.value)}
        placeholder="Enter your claim..."
        className="w-80 p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={startDebate}
        disabled={!claim || loading}
        className={`px-6 py-3 rounded-lg shadow font-semibold ${
          loading
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        {loading ? "Thinking..." : "Start Debate"}
      </button>

      {result && (
        <div className="mt-6 p-4 border rounded-lg max-w-xl bg-white shadow">
          <h2 className="font-bold mb-2">Supportive Arguments:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
