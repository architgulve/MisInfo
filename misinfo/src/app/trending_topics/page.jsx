"use client";
import React from "react";
import TopicCard from "../components/TopicCard";

function TrendingTopics() {
  const topics = [
    {
      category: "Technology",
      categoryColor: "bg-blue-600 text-blue-700",
      title: "AI Ethics and Regulation",
      description:
        "Should artificial intelligence development be heavily regulated?",
      debates: 12,
      timeAgo: "2 hours ago",
      trend: 89,
    },
    {
      category: "Environment",
      categoryColor: "bg-green-600 text-green-700",
      title: "Climate Change Solutions",
      description:
        "Are renewable energy sources sufficient to combat climate change?",
      debates: 8,
      timeAgo: "4 hours ago",
      trend: 76,
    },
    {
      category: "Economics",
      categoryColor: "bg-red-600 text-red-700",
      title: "Universal Basic Income",
      description: "Would UBI solve economic inequality or create dependency?",
      debates: 15,
      timeAgo: "1 hour ago",
      trend: 92,
    },
    {
      category: "Science",
      categoryColor: "bg-blue-400 text-purple-700",
      title: "Space Exploration Funding",
      description:
        "Should governments prioritize space exploration over Earth problems?",
      debates: 6,
      timeAgo: "6 hours ago",
      trend: 64,
    },
    {
      category: "Technology",
      categoryColor: "bg-blue-500 text-blue-700",
      title: "Social Media Privacy",
      description:
        "Do social media platforms have too much access to personal data?",
      debates: 11,
      timeAgo: "3 hours ago",
      trend: 85,
    },
    {
      category: "Education",
      categoryColor: "bg-yellow-500 text-yellow-700",
      title: "Education System Reform",
      description:
        "Should traditional education be replaced with personalized learning?",
      debates: 9,
      timeAgo: "5 hours ago",
      trend: 71,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 shadow bg-white">
        <div className="flex items-center gap-2 text-black">
          <div className="w-6 h-6 bg-[#4285f4] rounded"></div>
          <h1 className="font-bold text-2xl">AI Debate Arena</h1>
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
          <button className="text-gray-600 hover:text-black text-xl">
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
      <div className="max-w-full mx-15 px-4 py-10">
        <h2 className="text-5xl text-gray-800 font-bold mb-2">
          Trending Topics
        </h2>
        <p className="text-gray-600 mb-8 text-2xl">
          Discover popular debate topics and join the conversation
        </p>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, index) => (
            <TopicCard key={index} {...topic} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrendingTopics;
