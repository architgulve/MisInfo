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
  const [submittedClaim, setSubmittedClaim] = useState("");

  const handleSubmit = () => {
    setSubmittedClaim(claim);
    setClaim("");
  };

  const handleReset = () => {
    setSubmittedClaim("");
    setClaim("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 shadow bg-white">
        <div className="flex items-center gap-2 text-black ">
          <div className="w-6 h-6 bg-[#4285f4] rounded"></div>
          <h1 className="font-bold text-2xl ">AI Debate Arena</h1>
        </div>
        <nav className="flex gap-6">
          <button className="text-gray-600 hover:text-black text-xl">
            Home
          </button>
          <button className="text-gray-600 hover:text-black text-xl"
          onClick={() => {window.location.href = '/trending_topics';}}>
            Topics
          </button>
          <button className="text-gray-600 hover:text-black text-xl"
          onClick={() => {window.location.href = '/history';}}>
            History
          </button>
          <button className="bg-[#347ff7] text-white px-4 py-3 rounded-lg hover:bg-blue-700"
          onClick={() => {window.location.href = '/';}}>
            New Debate
          </button>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-start mt-12 px-6">
        {/* Claim Input */}
        <div className="bg-white shadow-xl rounded-lg p-10 max-w-6xl w-full text-center text-black">
          <h2 className="text-4xl font-bold mb-2">What's on trial today?</h2>
          <p className="text-gray-500 mb-6 text-xl">
            Let's uncover the truth behind the claim.
          </p>
          <div className="flex gap-2 align-middles justify-center">
            <input
              type="text"
              className="flex-1 border max-w-xl border-gray-300 rounded-lg px-4 py-2 focus:outline-none  text-gray-500"
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              placeholder="Enter a claim or statement (e.g., AI will replace jobs)"
            />
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-5 rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>

        {/* Debate Section */}
        <div className="flex gap-6 mt-10 w-full max-w-5xl">
          {/* Pro Agent */}
          <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-700 px-4 py-4 flex items-center gap-2">
              <div className="bg-white/20 rounded-full p-1 flex items-center justify-center"></div>
              <div>
                <h3 className="text-white font-semibold text-xl">Pro Agent</h3>
                <p className="text-green-100 text-md">Supporting Arguments</p>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col justify-center items-center h-60 text-gray-400">
              {claim ? (
                <p className="text-gray-600 text-center px-4">
                  Generating supporting arguments for: <br />
                  <span className="font-medium text-black">"{claim}"</span>
                </p>
              ) : (
                <p className="font-medium">Waiting for debate topic...</p>
              )}
            </div>
          </div>

          {/* Con Agent */}
          <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-700 px-4 py-4 flex items-center gap-2">
              <div className="bg-white/20 rounded-full p-1 flex items-center justify-center"></div>
              <div>
                <h3 className="text-white font-semibold text-xl">Con Agent</h3>
                <p className="text-green-100 text-md">Opposing Arguments</p>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col justify-center items-center h-60 text-gray-400">
              {claim ? (
                <p className="text-gray-600 text-center px-4">
                  Generating supporting arguments for: <br />
                  <span className="font-medium text-black">"{claim}"</span>
                </p>
              ) : (
                <p className="font-medium">Waiting for debate topic...</p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex justify-between items-center w-full max-w-5xl mt-10 bg-white p-4 shadow-md rounded-lg">
          <div className="flex gap-3">
            <button className="bg-[#fbc034] text-black px-4 py-1 rounded-lg hover:bg-yellow-500">
              Pause
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-200 px-4 py-1 rounded-lg hover:bg-gray-300"
            >
              Reset
            </button>
          </div>
          <div className="w-1/2 bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full w-1/5"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
