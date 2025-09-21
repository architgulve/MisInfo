"use client";
import { useState } from "react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DebateArgumentCard from "./components/DebateArgumentCard";
const clamp = (v) => Math.max(0, Math.min(100, Number(v) || 0));
// import {poppins} from './components/fonts/Poppins-Regular.ttf';

export default function Home() {
  const [submittedClaim, setSubmittedClaim] = useState("");
  const [claim, setClaim] = useState("");

  // ProBot states
  const [proStage, setProStage] = useState("waiting"); // waiting | generating | result
  const [proArguments, setProArguments] = useState([]);

  // ConBot states
  const [conStage, setConStage] = useState("waiting"); // waiting | generating | result
  const [conArguments, setConArguments] = useState([]);

  const [juryData, setJuryData] = useState(null);
  
  
  const handleSubmit = async () => {
    if (!claim) return;
    setSubmittedClaim(claim);
    setClaim("");

    setProStage("generating");
    setConStage("generating");
    setJuryStage("generating");

    try {
      const response = await fetch("http://localhost:8000/debate/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim, rounds: 3 }), // rounds can be adjusted
      });

      const data = await response.json();
      if (data.jury) {
        setJuryData(data.jury);
      } else {
        setJuryData(null);
      }
      
      if (data.error) {
        // Handle error like no evidence found
        setProArguments([]);
        setConArguments([]);
        setProStage("waiting");
        setConStage("waiting");
        setJuryStage("waiting");
        // Optionally show error message
        return;
      }

      // Extract last 3 pro and con messages
      const proArgs = [];
      const conArgs = [];
      for (let i = data.transcript.length - 1; i >= 0; i--) {
        if (proArgs.length >= 3 && conArgs.length >= 3) break;
        const msg = data.transcript[i];
        if (msg.role === "pro" && proArgs.length < 3) {
          proArgs.unshift({
            argument: msg.content,
            source: "",
            reliability: "",
          });
        } else if (msg.role === "con" && conArgs.length < 3) {
          conArgs.unshift({
            argument: msg.content,
            source: "",
            reliability: "",
          });
        }
      }

      setProArguments(proArgs);
      setConArguments(conArgs);

      // Update jury metrics based on data.jury if available
      if (data.jury) {
        const proScore = data.jury.pro_score || 78;
        const conScore = data.jury.con_score || 78;
        // Map these scores or set reliability, accuracy, verdict accordingly
        setReliability(proScore * 1); // example mapping
        setAccuracy(84); 
        setVerdict(proScore * 100 / (proScore + conScore));
        setSslValid(true); // or based on analysis
      }

      setProStage("result");
      setConStage("result");
      setJuryStage("result");
    } catch (error) {
      // Handle fetch error
      setProStage("waiting");
      setConStage("waiting");
      setJuryStage("waiting");
    }
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
    setVerdict(0);
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
    <div className="min-h-screen bg-[#181818] flex flex-col text-gray-800 font-poppins">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 shadow bg-[#212121]">
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
            className="bg-gray-200 text-black text-bold px-4 py-2 rounded-lg hover:bg-[#181818] hover:text-white"
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
              className=" shadow-xl bg-[#212121] rounded-lg p-6 max-w-7xl w-full text-center"
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
              className="bg-[#212121] rounded-lg shadow-md p-8 w-full max-w-7xl text-center"
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
                className="mt-6 px-4 py-1 bg-[#212121] text-gray-200 border-2  rounded-lg hover:bg-blue-400 hover:text-black transition"
              >
                Reset
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Jury Analysis */}

        <AnimatePresence mode="wait">
          {/* Waiting */}
          {juryStage === "waiting" && (
            <motion.p
              key="jury-waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-400 bg-[#212121] text-center mt-6"
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
          {juryStage === "result" && juryData && (
  <motion.div className="bg-[#212121] rounded-lg shadow-md p-6 w-full max-w-6xl mt-8">
    <h2 className="text-2xl font-bold mb-4 text-blue-200">Jury Analysis</h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* SSL */}
      <div className="border-2 border-blue-600 rounded-lg p-4 text-center">
        <p className="text-gray-200 mb-2">SSL Score</p>
        <p className="text-lg text-blue-400">5 (Pro) / 3 (Con)</p>
      </div>
      
      {/* Sentiment */}
      <div className="border-2 border-blue-600 rounded-lg p-4 text-center">
        <p className="text-gray-200 mb-2">Sentiment</p>
        <p className="text-lg text-blue-400">{juryData.pro_eval.sentiment.toFixed(2)} / {juryData.con_eval.sentiment.toFixed(2)}</p>
      </div>
      {/* Bias */}
      <div className="border-2 border-blue-600 rounded-lg p-4 text-center">
        <p className="text-gray-200 mb-2">Bias</p>
        <p className="text-lg text-blue-400">{juryData.pro_eval.bias} / {juryData.con_eval.bias}</p>
      </div>
      
    </div>

    <div className="text-center mt-6">
  <h2 className="text-4xl md:text-2xl font-extrabold text-blue-400">
    {juryData.final_verdict}
  </h2>
</div>
  </motion.div>
)}

        </AnimatePresence>
        {/* {verdict>0 && (
          <motion.div
            key="jury"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-4">

              <div className="p-3 rounded-xl bg-purple-100 text-purple-800 font-bold text-center">
                {verdict >= 50 ? "✅ Likely True" : "❌ Likely False"}
              </div>
            </div>
          </motion.div>
        )} */}

        {/* Debate Agents */}
        <div className="flex gap-6 mt-6 w-full max-w-7xl">
          {/* ProBot */}
          <div className="flex-1 bg-[#1f1f1f] rounded-lg shadow-lg overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-800 px-6 py-5 flex flex-col items-center">
              <h3 className="text-white font-bold text-2xl text-center">
                ProBot
              </h3>
              <p className="text-red-200 text-md mt-1 text-center">
                Supporting Arguments
              </p>
            </div>

            {/* Body */}
            <div className="p-5 flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {/* Waiting */}
                {!submittedClaim && proStage === "waiting" && (
                  <motion.p
                    key="waiting-con"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-gray-400 text-center bg-[#2a2a2a] p-4 rounded-md shadow-sm"
                  >
                    Waiting for debate topic...
                  </motion.p>
                )}

                {/* Generating */}
                {proStage === "generating" && (
                  <motion.div
                    key="generating-con"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-gray-200 bg-[#2a2a2a] p-4 rounded-md shadow-sm"
                  >
                    <p>Generating opposing arguments for:</p>
                    <p className="font-medium mt-1">"{submittedClaim}"</p>

                    {/* Loading dots animation */}
                    <motion.div
                      className="flex justify-center gap-2 mt-3"
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
                  </motion.div>
                )}

                {/* Result */}
                {proStage === "result" && (
                  <motion.div
                    key="result-con"
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
          <div className="flex-1 bg-[#1f1f1f] rounded-lg shadow-lg overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-800 px-6 py-5 flex flex-col items-center">
              <h3 className="text-white font-bold text-2xl text-center">
                ConBot
              </h3>
              <p className="text-red-200 text-md mt-1 text-center">
                Opposing Arguments
              </p>
            </div>

            {/* Body */}
            <div className="p-5 flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {/* Waiting */}
                {!submittedClaim && conStage === "waiting" && (
                  <motion.p
                    key="waiting-con"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-gray-400 text-center bg-[#2a2a2a] p-4 rounded-md shadow-sm"
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
                    className="text-center text-gray-200 bg-[#2a2a2a] p-4 rounded-md shadow-sm"
                  >
                    <p>Generating opposing arguments for:</p>
                    <p className="font-medium mt-1">"{submittedClaim}"</p>

                    {/* Loading dots animation */}
                    <motion.div
                      className="flex justify-center gap-2 mt-3"
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

        {/* Input Section */}
        <div className="mt-10 bg-[#212121] border-1 border-gray-200 p-6 shadow-md rounded-lg max-w-6xl w-full text-center mb-10">
          <h2 className="text-2xl text-gray-200 font-semibold">
            Choose Next Debate Topic
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <button className="px-4 py-2 bg-[#181818] text-blue-700 font-bold text-xl  rounded-lg hover:bg-blue-700 hover:text-white">
              Cryptocurrency is the future of finance
            </button>
            <button className="px-4 py-2 bg-[#181818] text-green-700 font-bold text-xl rounded-lg hover:bg-green-700 hover:text-white ">
              Social media has a net negative impact
            </button>
            <button className="px-4 py-2 bg-[#181818] text-red-700 font-bold text-xl rounded-lg hover:bg-red-700 hover:text-white">
              Remote work should be the standard
            </button>
            <button className="px-4 py-2 bg-[#181818] text-yellow-400 font-bold text-xl rounded-lg hover:bg-yellow-400 hover:text-white">
              Gene editing should be strictly regulated
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}