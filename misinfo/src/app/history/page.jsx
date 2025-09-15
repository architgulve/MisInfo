"use client";
import React from "react";

const debates = [
  {
    id: 1,
    title: "AI will replace most human jobs by 2030",
    duration: "45 minutes",
    participants: 156,
    arguments: 24,
    date: "Jan 15, 2024",
    result: "Pro Won",
    resultColor: "bg-green-500",
  },
  {
    id: 2,
    title: "Social media should be regulated like traditional media",
    duration: "38 minutes",
    participants: 89,
    arguments: 18,
    date: "Jan 14, 2024",
    result: "Con Won",
    resultColor: "bg-red-500",
  },
  {
    id: 3,
    title: "AI will replace most human jobs by 2030",
    duration: "45 minutes",
    participants: 156,
    arguments: 24,
    date: "Jan 15, 2024",
    result: "Pro Won",
    resultColor: "bg-green-500",
  },
  {
    id: 4,
    title: "Social media should be regulated like traditional media",
    duration: "38 minutes",
    participants: 89,
    arguments: 18,
    date: "Jan 14, 2024",
    result: "Con Won",
    resultColor: "bg-red-500",
  },
  {
    id: 5,
    title: "AI will replace most human jobs by 2030",
    duration: "45 minutes",
    participants: 156,
    arguments: 24,
    date: "Jan 15, 2024",
    result: "Pro Won",
    resultColor: "bg-green-500",
  },
  {
    id: 6,
    title: "Social media should be regulated like traditional media",
    duration: "38 minutes",
    participants: 89,
    arguments: 18,
    date: "Jan 14, 2024",
    result: "Con Won",
    resultColor: "bg-red-500",
  },
];

export default function DebateHistory() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 shadow bg-white">
        <div className="flex items-center gap-2 text-black ">
          <div className="w-6 h-6 bg-[#4285f4] rounded"></div>
          <h1 className="font-bold text-2xl ">AI Debate Arena</h1>
        </div>
        <nav className="flex gap-6">
          <button
            className="text-gray-600 hover:text-black text-xl"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Home
          </button>
          <button className="text-gray-600 hover:text-black text-xl"
          onClick={() => {window.location.href = '/trending_topics';}}>
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
          <button className="bg-[#347ff7] text-white px-4 py-3 rounded-lg hover:bg-blue-700"
            onClick={() => {window.location.href = '/';}}>
            New Debate
          </button>
        </nav>
      </header>

      {/* Debate History Section */}
      <main className="max-w-full mx-auto px-6 py-8 ml-10 mr-10 space-x-3">
        <h2 className="text-black text-5xl font-bold mb-2">Debate History</h2>
        <p className="text-gray-800 text-xl mb-6">
          Explore past debates and their outcomes
        </p>

        <div className="space-y-6">
          {debates.map((debate) => (
            <div
              key={debate.id}
              className="bg-white p-4 rounded-lg shadow-sm hover:bg-gray-50 transition duration-200 ease-in-out space-y-6"
            >
              {/* Title + Result */}
              <div className="flex justify-between items-start">
                <h3 className="text-2xl text-gray-800 font-semibold">
                  {debate.title}
                </h3>
                <span
                  className={`px-2 py-0.5 text-white rounded-md text-md ${debate.resultColor}`}
                >
                  {debate.result}
                </span>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-4 gap-3 text-lg text-gray-600 my-3">
                <span>⏱ {debate.duration}</span>
                <span>👥 {debate.participants} participants</span>
                <span>💬 {debate.arguments} arguments</span>
                <span>🏆 {debate.date}</span>
              </div>

              {/* Agents + Button */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded-md text-lg">
                    Pro Agent
                  </span>
                  <span className="text-gray-400 text-sm">vs</span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-md text-lg">
                    Con Agent
                  </span>
                </div>
                <button className="border px-3 py-1 rounded-md text-lg text-gray-600 hover:bg-gray-100">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
