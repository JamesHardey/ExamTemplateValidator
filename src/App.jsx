// App.js
import React, { useState } from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import { BackgroundBeams } from "./components/ui/BackgroundBeams";
import { SparklesCore } from "./components/ui/Sparkles";
import HomePage from "./HomePage";
import QuizPage from "./QuizPage";

const App = () => {
  const [quizData, setQuizData] = useState(null);
  const navigate = useNavigate();

  const handleOnGoHome = () => {
    setQuizData(null);
    navigate("/"); // Navigate back to home when quiz ends
  };

  const handleQuizData = (data) => {
    setQuizData(data); // Set the quiz data
    navigate("/quiz"); // Navigate to the quiz page after setting the data
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-600 text-white relative overflow-hidden font-sans">
      <BackgroundBeams />

      <Routes>
        <Route
          path="/"
          element={<HomePage onQuizDataReady={handleQuizData} />}
        />
        <Route
          path="/quiz"
          element={
            quizData ? (
              <QuizPage quizData={quizData} onGoHome={handleOnGoHome} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>

      <footer className="relative z-10 h-[60px] bg-gray-800 p-4 text-center">
        <p>&copy; 2024 Quiz Platform. All rights reserved.</p>
      </footer>

      <SparklesCore
        id="tsparticlesfullpage"
        background="transparent"
        minSize={0.6}
        maxSize={1.4}
        particleDensity={100}
        className="w-full h-full absolute top-0 left-0 z-0"
      />
    </div>
  );
};

export default App;
