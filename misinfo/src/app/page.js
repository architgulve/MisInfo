"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [claim, setClaim] = useState("");
  const [submittedClaim, setSubmittedClaim] = useState("");

  const [proResult, setProResult] = useState([]);
  const [conResult, setConResult] = useState([]);

  const [activeAgent, setActiveAgent] = useState(null); // "pro" | "con"
  const [round, setRound] = useState(0);
  const [maxRounds] = useState(3);

  const fetchArguments = async (type, claim) => {
    const url =
      type === "pro"
        ? "http://localhost:8000/support-claim"
        : "http://localhost:8000/oppose-claim";

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claim }),
    });
    const data = await res.json();

    return type === "pro"
      ? data.supportive_arguments
      : data.opposing_arguements;
  };

  const startDebate = async () => {
    if (!claim.trim()) return;

    setSubmittedClaim(claim);
    setClaim("");
    setProResult([]);
    setConResult([]);
    setRound(0);

    // Run 3 alternating rounds
    for (let i = 0; i < maxRounds * 2; i++) {
      const agent = i % 2 === 0 ? "pro" : "con";
      setActiveAgent(agent);

      const response = await fetchArguments(agent, submittedClaim || claim);

      await new Promise((resolve) =>
        setTimeout(resolve, 1500) // simulate thinking delay
      );

      if (agent === "pro") {
        setProResult((prev) => [...prev, response]);
      } else {
        setConResult((prev) => [...prev, response]);
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 1500) // little gap between turns
      );

      setRound((r) => r + 0.5);
    }

    setActiveAgent(null); // debate finished
  };

  const handleReset = () => {
    setSubmittedClaim("");
    setClaim("");
    setProResult([]);
    setConResult([]);
    setRound(0);
    setActiveAgent(null);
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
          <button className="text-gray-600 hover:text-black text-xl">Home</button>
          <button
            className="text-gray-600 hover:text-black text-xl"
            onClick={() => {
              window.location.href = "/trending_topics";
            }}
          >
            Topics
          </button>
          <button
            className="text-gray-600 hover:text-black text-xl"
            onClick={() => {
              window.location.href = "/history";
            }}
          >
            History
          </button>
          <button
            className="bg-[#347ff7] text-white px-4 py-3 rounded-lg hover:bg-blue-700"
            onClick={() => {
              window.location.href = "/";
            }}
          >
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
              className="flex-1 border max-w-xl border-gray-300 rounded-lg px-4 py-2 focus:outline-none text-gray-500"
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              placeholder='Enter a claim or statement (e.g., "AI will replace jobs")'
              onKeyDown={(e) => {
                if (e.key === "Enter") startDebate();
              }}
            />
            <button
              onClick={startDebate}
              className="bg-blue-600 text-white px-5 rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>

        {/* Debate Section */}
        <div className="flex gap-6 mt-10 w-full max-w-5xl">
          {/* Pro Agent */}
          <div
            className={`flex-1 rounded-lg shadow-md overflow-hidden transition ${
              activeAgent === "pro"
                ? "bg-white ring-2 ring-green-500"
                : "bg-gray-100 opacity-70"
            }`}
          >
            <div className="bg-gradient-to-r from-green-500 to-green-700 px-4 py-4">
              <h3 className="text-white font-semibold text-xl">Pro Agent</h3>
              <p className="text-green-100 text-md">Supporting Arguments</p>
            </div>
            <div className="flex flex-col justify-start items-start h-60 px-4 py-2 text-gray-600 overflow-y-auto">
              {activeAgent === "pro" && !proResult.length ? (
                <div className="animate-bounce text-gray-400 mt-4">🤔 Thinking...</div>
              ) : proResult.length ? (
                proResult.map((r, idx) => (
                  <div
                    key={idx}
                    className="mb-4 p-2 border-b border-gray-200 text-left"
                  >
                    <ReactMarkdown>{r}</ReactMarkdown>
                  </div>
                ))
              ) : (
                <p className="font-medium text-gray-400">
                  Waiting for debate topic...
                </p>
              )}
            </div>
          </div>

          {/* Con Agent */}
          <div
            className={`flex-1 rounded-lg shadow-md overflow-hidden transition ${
              activeAgent === "con"
                ? "bg-white ring-2 ring-red-500"
                : "bg-gray-100 opacity-70"
            }`}
          >
            <div className="bg-gradient-to-r from-red-500 to-red-700 px-4 py-4">
              <h3 className="text-white font-semibold text-xl">Con Agent</h3>
              <p className="text-red-100 text-md">Opposing Arguments</p>
            </div>
            <div className="flex flex-col justify-start items-start h-60 px-4 py-2 text-gray-600 overflow-y-auto">
              {activeAgent === "con" && !conResult.length ? (
                <div className="animate-bounce text-gray-400 mt-4">🤔 Thinking...</div>
              ) : conResult.length ? (
                conResult.map((r, idx) => (
                  <div
                    key={idx}
                    className="mb-4 p-2 border-b border-gray-200 text-left"
                  >
                    <ReactMarkdown>{r}</ReactMarkdown>
                  </div>
                ))
              ) : (
                <p className="font-medium text-gray-400">
                  Waiting for debate topic...
                </p>
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
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(round / maxRounds) * 100}%` }}
            ></div>
          </div>
        </div>
      </main>
    </div>
  );
}
