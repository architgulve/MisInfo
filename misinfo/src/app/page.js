"use client";
import { useState } from "react";
<<<<<<< HEAD
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DebateArgumentCard from "../app/components/DebateArgumentCard";
const clamp = (v) => Math.max(0, Math.min(100, Number(v) || 0));
=======
import ReactMarkdown from "react-markdown";
>>>>>>> efd25549628321836580d6eb2f0b13b3594fbb45

export default function Home() {
  const [submittedClaim, setSubmittedClaim] = useState("");
  const [claim, setClaim] = useState("");
<<<<<<< HEAD

  // ProBot states
  const [proStage, setProStage] = useState("waiting"); // waiting | generating | result
  const [proArguments, setProArguments] = useState([]);

  // ConBot states
  const [conStage, setConStage] = useState("waiting"); // waiting | generating | result
  const [conArguments, setConArguments] = useState([]);

  const handleSubmit = () => {
    if (!claim) return;
    setSubmittedClaim(claim);
    setClaim("");

    // Step 1: Move both bots to "generating"
    setProStage("generating");
    setConStage("generating");

    // Step 2: Fake async call (replace with real API call)
    setTimeout(() => {
      setProArguments([
        {
          argument:
            "The advent of AI will create more jobs than it displaces, similar to how the industrial revolution led to new types of employment.",
          source: "MIT Technology Review",
          reliability: "94%",
        },
        {
          argument:
            "Historical data shows that technological revolutions have always led to net job growth, with AI already creating new roles in data science and machine learning.",
          source: "World Economic Forum",
          reliability: "91%",
        },
      ]);
      setProStage("result");
    }, 2000);

    setJuryStage("generating");

    setTimeout(() => {
      setConArguments([
        {
          argument:
            "AI automation is already displacing workers in manufacturing and customer service, with predictions of millions of jobs lost.",
          source: "Oxford Economics",
          reliability: "89%",
        },
        {
          argument:
            "The rate of job destruction is outpacing AI job creation, and many displaced workers lack access to retraining.",
          source: "Bureau of Labor Statistics",
          reliability: "86%",
        },
      ]);
      setConStage("result");
      setJuryStage("result");
    }, 2500);
  };
  useEffect(() => {
    if (submittedClaim) {
      // reset first
      setProStage("generating");
      setConStage("generating");

      // simulate async "argument generation"
      setTimeout(() => setProStage("result"), 2000); // 2s later
      setTimeout(() => setConStage("result"), 2500); // 2.5s later
    } else {
      setProStage("waiting");
      setConStage("waiting");
    }
  }, [submittedClaim]);

  const handleReset = () => {
    setSubmittedClaim("");
    setClaim("");
    setProStage("waiting");
    setConStage("waiting");
    setJuryStage("waiting"); // 👈 hides Jury section
    setProArguments([]);
    setConArguments([]);
  };

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

  const [juryStage, setJuryStage] = useState("waiting"); // waiting | generating | result
  const [sslValid, setSslValid] = useState(true);
  const [reliability, setReliability] = useState(78);
  const [accuracy, setAccuracy] = useState(84);
  const [verdict, setVerdict] = useState(65);
  const rel = clamp(reliability);
  const acc = clamp(accuracy);
  const ver = clamp(verdict);
=======
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
>>>>>>> efd25549628321836580d6eb2f0b13b3594fbb45

  return (
    <div className="min-h-screen bg-[#020817] flex flex-col text-gray-800">
      {/* Header */}
<<<<<<< HEAD
      <header className="flex justify-between items-center px-6 py-4 shadow bg-[#010E30]">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          DebateBot Arena
        </h1>
        <nav className="flex gap-10">
          <button className="text-white text-xl hover:text-black  hover:bg-gray-200 rounded-lg px-4 py-1">
            Home
          </button>
          <button
            onClick={() => (window.location.href = "/trending_topics")}
            className="text-white text-xl hover:text-black hover:bg-gray-200 rounded-lg px-4 py-1"
=======
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
>>>>>>> efd25549628321836580d6eb2f0b13b3594fbb45
          >
            Topics
          </button>
          <button
<<<<<<< HEAD
            onClick={() => (window.location.href = "/history")}
            className="text-white text-xl hover:text-black  hover:bg-gray-200 rounded-lg px-4 py-1"
=======
            className="text-gray-600 hover:text-black text-xl"
            onClick={() => {
              window.location.href = "/history";
            }}
>>>>>>> efd25549628321836580d6eb2f0b13b3594fbb45
          >
            History
          </button>
          <button
<<<<<<< HEAD
            onClick={() => (window.location.href = "/")}
            className="bg-gray-200 text-black text-bold px-4 py-2 rounded-lg hover:bg-[#020817] hover:text-white"
=======
            className="bg-[#347ff7] text-white px-4 py-3 rounded-lg hover:bg-blue-700"
            onClick={() => {
              window.location.href = "/";
            }}
>>>>>>> efd25549628321836580d6eb2f0b13b3594fbb45
          >
            New Debate
          </button>
        </nav>
      </header>

<<<<<<< HEAD
      {/* Current Debate */}
      <main className="flex-1 flex flex-col items-center mt-6 px-6 ">
        <AnimatePresence mode="wait">
          {!submittedClaim ? (
            // Input Area
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className=" shadow-xl bg-[#010E30] rounded-lg p-6 max-w-7xl w-full text-center"
=======
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
>>>>>>> efd25549628321836580d6eb2f0b13b3594fbb45
            >
              <h2 className="text-6xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                What's on trial today?
              </h2>
              <p className="text-white mb-6 mt-4 text-lg">
                Enter a claim or statement to start the debate.
              </p>
              <div className="flex gap-2 justify-center">
                <input
                  type="text"
                  className="flex-1 border max-w-xl border-gray-300 rounded-lg px-4 py-2 focus:outline-none text-gray-300"
                  value={claim}
                  onChange={(e) => setClaim(e.target.value)}
                  placeholder="e.g., AI will replace jobs"
                />
                <button
                  onClick={handleSubmit}
                  className="bg-blue-200 text-blue-700 px-5 rounded-lg hover:bg-blue-400"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          ) : (
            // Current Debate Card
            <motion.div
              key="debate"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-[#010E30] rounded-lg shadow-md p-8 w-full max-w-7xl text-center"
            >
              <h2 className="text-xl font-bold text-gray-200">
                Current Debate:
              </h2>
              <motion.p
                className="text-4xl font-semibold text-blue-200 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                "{submittedClaim}"
              </motion.p>
              <div className="flex gap-3 mt-3 justify-center text-sm text-gray-500">
                <span className="px-3 py-1 text-blue-200 bg-blue-700 rounded-lg">
                  Technology
                </span>
                <span className="px-3 py-1 text-green-200 bg-green-700 rounded-lg">
                  Economics
                </span>
                <span className="px-3 py-1 text-red-200 bg-red-700 rounded-lg">
                  Society
                </span>
              </div>
              <button
                onClick={handleReset}
                className="mt-6 px-4 py-1 bg-[#010E30] text-gray-200 border-2  rounded-lg hover:bg-blue-400 hover:text-black transition"
              >
                Reset
              </button>
            </motion.div>
          )}
        </AnimatePresence>

<<<<<<< HEAD
        {/* Debate Agents */}
        <div className="flex gap-6 mt-6 w-full max-w-7xl">
          {/* ProBot */}
          {/* ProBot */}
          <motion.div
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-full max-w-2xl bg-gradient-to-b from-green-600 to-green-800 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-400 to-green-700 px-6 py-5 text-center">
                <h3 className="text-white font-extrabold text-2xl tracking-wide">
                  ProBot
                </h3>
                <p className="text-green-100 text-sm italic">
                  Supporting Arguments
                </p>
              </div>

              {/* Body */}
              <div className="p-6 bg-[#010E30] space-y-4">
                {proStage === "waiting" && (
                  <p className="text-gray-400 text-center">
                    Waiting for debate topic...
                  </p>
                )}

                {proStage === "generating" && (
                  <div className="text-center text-gray-200">
                    <p>Generating supporting arguments for:</p>
                    <p className="font-semibold mt-1 text-green-300">
                      "{submittedClaim}"
                    </p>
                    <motion.div
                      className="flex justify-center gap-2 mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-3 h-3 bg-green-500 rounded-full"
                          animate={{ y: [0, -6, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </motion.div>
                  </div>
                )}

                {proStage === "result" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    {proArguments.map((arg, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.03 }}
                        className="bg-gradient-to-r from-green-900 to-green-700 text-green-100 border border-green-400 rounded-lg p-4 shadow-lg"
                      >
                        <p className="text-lg leading-relaxed">
                          {arg.argument}
                        </p>
                        <p className="text-xs mt-2 text-green-300 italic">
                          (Reliability: {arg.reliability})
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* ConBot */}
          <motion.div
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-full max-w-2xl bg-gradient-to-b from-red-600 to-red-800 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-400 to-red-700 px-6 py-5 text-center">
                <h3 className="text-white font-extrabold text-2xl tracking-wide">
                  ConBot
                </h3>
                <p className="text-green-100 text-sm italic">
                  Supporting Arguments
                </p>
              </div>

              {/* Body */}
              <div className="p-6 bg-[#010E30] space-y-4">
                {proStage === "waiting" && (
                  <p className="text-gray-400 text-center">
                    Waiting for debate topic...
                  </p>
                )}

                {proStage === "generating" && (
                  <div className="text-center text-gray-200">
                    <p>Generating supporting arguments for:</p>
                    <p className="font-semibold mt-1 text-red-300">
                      "{submittedClaim}"
                    </p>
                    <motion.div
                      className="flex justify-center gap-2 mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-3 h-3 bg-red-500 rounded-full"
                          animate={{ y: [0, -6, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </motion.div>
                  </div>
                )}

                {proStage === "result" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    {proArguments.map((arg, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.03 }}
                        className="bg-gradient-to-r from-red-900 to-red-700 text-red-100 border border-red-400 rounded-lg p-4 shadow-lg"
                      >
                        <p className="text-lg leading-relaxed">
                          {arg.argument}
                        </p>
                        <p className="text-xs mt-2 text-red-300 italic">
                          (Reliability: {arg.reliability})
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
=======
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
>>>>>>> efd25549628321836580d6eb2f0b13b3594fbb45
        </div>

        {/* Jury Analysis */}
        {/* Jury Analysis + Verdict */}
        <AnimatePresence mode="wait">
          {juryStage === "result" && (
            <motion.div
              key="jury-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-[#010E30] rounded-lg shadow-md p-6 w-full max-w-6xl mt-8"
            >
              <h2 className="text-3xl font-bold mb-4 text-gray-200">
                Jury Analysis
              </h2>

              {/* Top Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* SSL */}
                <div className="border  border-b-green-700 rounded-lg p-4 text-xl font-bold text-center">
                  <p className="text-gray-300 mb-2">SSL Certificate</p>
                  <p
                    className={`font-semibold text-xl ${
                      sslValid ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {sslValid ? "Valid" : "Invalid"}
                  </p>
                </div>

                {/* Reliability */}
                <div className="border-3 border-b-blue-900 rounded-lg p-4">
                  <p className="text-gray-300 mb-2 text-xl font-bold text-center">
                    Source Reliability
                  </p>
                  <div className="w-full bg-[#010E30] border-1 rounded-full h-3">
                    <motion.div
                      className="bg-blue-600 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${reliability}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <p className="text-blue-700 font-semibold text-md mt-2 text-center">
                    {reliability}% Avg
                  </p>
                </div>

                {/* Accuracy */}
                <div className="border-3 border-b-fuchsia-900 rounded-lg p-4">
                  <p className="text-gray-300 mb-2 text-xl font-bold text-center">
                    Fact Accuracy
                  </p>
                  <div className="w-full bg-[#010E30] border-1 rounded-full h-3">
                    <motion.div
                      className="bg-purple-600 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${accuracy}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <p className="text-purple-600 font-semibold text-md mt-2 text-center">
                    {accuracy}% Verified
                  </p>
                </div>
              </div>

              {/* Audience Verdict */}
              <div>
                <h3 className="text-2xl font-bold mb-2 text-gray-200">
                  Audience Verdict
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="bg-yellow-400 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${verdict}%` }}
                    transition={{ duration: 1.2 }}
                  />
                </div>
                <p className="text-md text-gray-200 mt-1">{verdict}% ProBot</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Section */}
        <div className="mt-10 bg-[#010E30] border-1 border-gray-200 p-6 shadow-md rounded-lg max-w-6xl w-full text-center mb-10">
          <h2 className="text-2xl text-gray-200 font-semibold">
            Choose Debate Topic
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <button className="px-4 py-2 bg-blue-400 text-[#010E30] font-bold  text-lg rounded-lg hover:bg-blue-700 hover:text-white">
              Cryptocurrency is the future of finance
            </button>
            <button className="px-4 py-2 bg-green-400 text-grren-900 font-bold  text-lg rounded-lg hover:bg-green-700 hover:text-white">
              Social media has a net negative impact
            </button>
            <button className="px-4 py-2 bg-red-400 text-red-800 font-bold text-lg rounded-lg hover:bg-red-700 hover:text-white">
              Remote work should be the standard
            </button>
            <button className="px-4 py-2 bg-yellow-400 text-yellow-900 font-bold text-lg rounded-lg hover:bg-yellow-600 hover:text-white">
              Gene editing should be strictly regulated
            </button>
<<<<<<< HEAD
=======
          </div>
          <div className="w-1/2 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(round / maxRounds) * 100}%` }}
            ></div>
>>>>>>> efd25549628321836580d6eb2f0b13b3594fbb45
          </div>
        </div>
      </main>
    </div>
  );
}
