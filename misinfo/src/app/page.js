"use client";
import { useState } from "react";

export default function Home() {
  const [claim, setClaim] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const startDebate = async () => {
    if (!claim) return;
    setLoading(true);
    setChat([{ role: "claim", content: claim }]);

    let currentInput = claim;

    try {
      for (let i = 0; i < 3; i++) {
        // Supportive argument
        const supportRes = await fetch("http://localhost:8000/support-claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ claim: currentInput }),
        });
        const supportData = await supportRes.json();
        const supportArg = supportData.supportive_arguments;
        setChat((prev) => [...prev, { role: "support", content: supportArg }]);

        currentInput = claim + " " + supportArg;

        // Opposing argument
        const opposeRes = await fetch("http://localhost:8000/oppose-claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ claim: currentInput }),
        });
        const opposeData = await opposeRes.json();
        const opposeArg = opposeData.opposing_arguements;

        setChat((prev) => [...prev, { role: "oppose", content: opposeArg }]);

        currentInput = claim + " " + opposeArg;
      }
    } catch (error) {
      setChat((prev) => [
        ...prev,
        { role: "error", content: "Error: Backend failed." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#272727] p-6">
      <h1 className="text-2xl font-bold mb-6">AI Debate Assistant</h1>

      {/* Input */}
      <input
        type="text"
        value={claim}
        onChange={(e) => setClaim(e.target.value)}
        placeholder="Enter your claim..."
        className="w-96 p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Check Claim button */}
      <button
        onClick={startDebate}
        
        disabled={!claim || loading}
        className={`px-6 py-3 rounded-lg shadow font-semibold mb-6 ${
          loading
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-green-500 text-white hover:bg-green-600"
        }`}
      >
        {loading ? "Debating..." : "Check Claim"}
      </button>

      {/* Chat window */}
      <div className="w-full max-w-3xl h-[500px] overflow-y-auto bg-white p-4 rounded-lg shadow">
        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={`my-2 p-3 rounded-lg max-w-[80%] ${
              msg.role === "claim"
                ? "bg-gray-200 self-center text-center"
                : msg.role === "support"
                ? "bg-blue-100 text-blue-800 self-start"
                : msg.role === "oppose"
                ? "bg-red-100 text-red-800 self-end ml-auto"
                : "bg-gray-300"
            }`}
          >
            <span className="block font-semibold">
              {msg.role === "support"
                ? "Support"
                : msg.role === "oppose"
                ? "Oppose"
                : msg.role === "claim"
                ? "Claim"
                : "System"}
            </span>
            <span>{msg.content}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
