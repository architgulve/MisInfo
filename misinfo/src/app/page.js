"use client";
import { useState } from "react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DebateArgumentCard from "./components/DebateArgumentCard";
const clamp = (v) => Math.max(0, Math.min(100, Number(v) || 0));

export default function Home() {
  const [submittedClaim, setSubmittedClaim] = useState("");
  const [claim, setClaim] = useState("");

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
    setJuryStage("waiting"); // 👈 reset jury
    setProArguments([]);
    setConArguments([]);

    // Optionally reset jury metrics if you want them blank on reset
    setSslValid(true);
    setReliability(78);
    setAccuracy(84);
    setVerdict(65);
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

  return (
    <div className="min-h-screen bg-[#020817] flex flex-col text-gray-800">
      {/* Header */}
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
          >
            Topics
          </button>
          <button
            onClick={() => (window.location.href = "/history")}
            className="text-white text-xl hover:text-black  hover:bg-gray-200 rounded-lg px-4 py-1"
          >
            History
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-gray-200 text-black text-bold px-4 py-2 rounded-lg hover:bg-[#020817] hover:text-white"
          >
            New Debate
          </button>
        </nav>
      </header>

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
            >
              <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
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

        {/* Debate Agents */}
        <div className="flex gap-6 mt-6 w-full max-w-7xl">
          {/* ProBot */}
          <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-800 px-4 py-4">
              <h3 className="text-white font-semibold text-lg">ProBot</h3>
              <p className="text-green-100 text-sm">Supporting Arguments</p>
            </div>

            {/* Body */}
            <div className="p-4 flex-1 overflow-y-auto bg-[#010E30]">
              <AnimatePresence mode="wait">
                {/* Waiting */}
                {!submittedClaim && proStage === "waiting" && (
                  <motion.p
                    key="waiting-pro"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-gray-400 text-center"
                  >
                    Waiting for debate topic...
                  </motion.p>
                )}

                {/* Generating */}
                {proStage === "generating" && (
                  <motion.div
                    key="generating-pro"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-gray-200"
                  >
                    <p>Generating supporting arguments for:</p>
                    <p className="font-medium mt-1">"{submittedClaim}"</p>
                    {/* Loading dots animation */}
                    <motion.div
                      className="flex justify-center gap-1 mt-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-2 h-2 bg-green-600 rounded-full"
                          animate={{ y: [0, -6, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                )}

                {/* Result */}
                {proStage === "result" && (
                  <motion.div
                    key="result-pro"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-3"
                  >
                    {proArguments.map((arg, i) => (
                      <DebateArgumentCard
                        key={i}
                        argument={arg.argument}
                        source={arg.source}
                        reliability={arg.reliability}
                        index={i}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ConBot */}
          <div className="flex-1 bg-[#010E30] rounded-lg shadow-md overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-700 px-4 py-4">
              <h3 className="text-white font-semibold text-lg">ConBot</h3>
              <p className="text-red-100 text-sm">Opposing Arguments</p>
            </div>

            {/* Body */}
            <div className="p-4 flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {/* Waiting */}
                {!submittedClaim && conStage === "waiting" && (
                  <motion.p
                    key="waiting-con"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-gray-400 text-center"
                  >
                    Waiting for debate topic...
                  </motion.p>
                )}

                {/* Generating */}
                {conStage === "generating" && (
                  <motion.div
                    key="generating-con"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-gray-200"
                  >
                    <p>Generating opposing arguments for:</p>
                    <p className="font-medium mt-1">"{submittedClaim}"</p>

                    {/* Loading dots animation */}
                    <motion.div
                      className="flex justify-center gap-1 mt-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-2 h-2 bg-red-600 rounded-full"
                          animate={{ y: [0, -6, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                )}

                {/* Result */}
                {conStage === "result" && (
                  <motion.div
                    key="result-con"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-3"
                  >
                    {conArguments.map((arg, i) => (
                      <DebateArgumentCard
                        key={i}
                        argument={arg.argument}
                        source={arg.source}
                        reliability={arg.reliability}
                        index={i}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Jury Analysis */}
        <AnimatePresence mode="wait">
          {/* Waiting */}
          {juryStage === "waiting" && (
            <motion.p
              key="jury-waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-400 bg-[#010E30] text-center mt-6"
            ></motion.p>
          )}

          {/* Generating */}
          {juryStage === "generating" && (
            <motion.div
              key="jury-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center mt-6"
            >
              <p>Analyzing claim with Jury...</p>
              {/* Loading dots animation */}
              <motion.div className="flex justify-center gap-1  mt-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 bg-blue-600 rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Result */}
          {juryStage === "result" && (
            <motion.div
              key="jury-result"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-[#010E30] rounded-lg shadow-md p-6 w-full max-w-6xl mt-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-blue-200">
                Jury Analysis
              </h2>

              {/* SSL */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="border-2 border-blue-600 rounded-lg p-4 text-center">
                  <p className="text-gray-200 mb-2">SSL Certificate</p>
                  <motion.p
                    className={` text-lg ${
                      sslValid ? "text-green-600" : "text-red-600"
                    }`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {sslValid ? "Valid" : "Invalid"}
                  </motion.p>
                </div>

                {/* Reliability */}
                <div className="border-2 border-blue-600 rounded-lg p-4">
                  <p className="text-gray-200 mb-2 text-center">
                    Source Reliability
                  </p>
                  <div className="w-full bg-[#010E30] border-1 border-gray-200 rounded-full h-3">
                    <motion.div
                      className="bg-blue-600 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${reliability}%` }}
                      transition={{ delay: 0.6, duration: 1 }}
                    />
                  </div>
                  <p className="text-blue-600 font-semibold text-sm mt-2 text-center">
                    {reliability}% Avg
                  </p>
                </div>

                {/* Accuracy */}
                <div className="border-2 border-purple-600 rounded-lg p-4">
                  <p className="text-gray-200 mb-2 text-center">
                    Fact Accuracy
                  </p>
                  <div className="w-full bg-[#010E30] border-1 border-gray-200 rounded-full h-3">
                    <motion.div
                      className="bg-purple-600 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${accuracy}%` }}
                      transition={{ delay: 0.9, duration: 1 }}
                    />
                  </div>
                  <p className="text-purple-600 font-semibold text-sm mt-2 text-center">
                    {accuracy}% Verified
                  </p>
                </div>
              </div>

              {/* Verdict */}
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-200">
                  Audience Verdict
                </h3>
                <div className="w-full bg-[#010E30] border-1 border-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="bg-yellow-400 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${verdict}%` }} // Corrected usage of the spread operator
                    transition={{ delay: 1.2, duration: 1.2 }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">{verdict}% ProBot</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Section */}
        <div className="mt-10 bg-[#010E30] border-1 border-gray-200 p-6 shadow-md rounded-lg max-w-6xl w-full text-center mb-10">
          <h2 className="text-xl text-gray-200 font-semibold">
            Choose Next Debate Topic
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <button className="px-4 py-2 bg-blue-400 text-[#010E30] rounded-lg hover:bg-blue-700">
              Cryptocurrency is the future of finance
            </button>
            <button className="px-4 py-2 bg-green-400 text-grren-900 rounded-lg hover:bg-green-700">
              Social media has a net negative impact
            </button>
            <button className="px-4 py-2 bg-red-400 text-red-800 rounded-lg hover:bg-red-700">
              Remote work should be the standard
            </button>
            <button className="px-4 py-2 bg-yellow-400 text-yellow-900 rounded-lg hover:bg-yellow-700">
              Gene editing should be strictly regulated
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
