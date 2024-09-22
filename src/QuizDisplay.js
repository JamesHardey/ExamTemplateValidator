import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  User,
  ChevronDown,
  RefreshCw,
  Home,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";

const QuizDisplay = ({ quizData, onGoHome }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentCourse, setCurrentCourse] = useState("");
  const [currentSection, setCurrentSection] = useState("");
  const [filteredQuizData, setFilteredQuizData] = useState([]);
  const [showMoreQuestions, setShowMoreQuestions] = useState(false);
  const questionNavigatorRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const validQuizData = quizData.filter(
      (question) =>
        question.content.trim() !== "" &&
        question.options.every((option) => option.trim() !== "") &&
        question.answer.trim() !== ""
    );
    setFilteredQuizData(validQuizData);

    if (validQuizData.length > 0) {
      setCurrentCourse(validQuizData[0].course);
      setCurrentSection(validQuizData[0].section);
    }
  }, [quizData]);

  useEffect(() => {
    if (filteredQuizData.length > 0) {
      setCurrentCourse(filteredQuizData[currentQuestionIndex].course);
      setCurrentSection(filteredQuizData[currentQuestionIndex].section);
    }
  }, [currentQuestionIndex, filteredQuizData]);

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuizData.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleShowMoreQuestions = () => {
    setShowMoreQuestions(true);
    setTimeout(() => {
      if (questionNavigatorRef.current) {
        questionNavigatorRef.current.scrollTop =
          questionNavigatorRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleRefreshQuestion = () => {
    setCurrentQuestionIndex(0);
  };

  if (filteredQuizData.length === 0) {
    return <div>No valid questions found.</div>;
  }

  const currentQuestion = filteredQuizData[currentQuestionIndex];

  return (
    <div className="min-h-[calc(100vh-60px)] bg-gradient-to-b from-gray-900 to-gray-600 text-white flex flex-col relative z-10 overflow-auto box-border">
      {/* Header */}
      <header className="bg-gray-800 shadow-md p-4 sticky top-0 z-20">
        <div className="container mx-auto flex justify-between items-center">
          <motion.h1
            className="text-2xl font-bold text-blue-400"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Quiz Platform
          </motion.h1>
          <div className="flex items-center space-x-4">
            <motion.button
              className="text-gray-300 hover:text-white transition-colors"
              onClick={handleRefreshQuestion}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <RefreshCw className="w-6 h-6" />
            </motion.button>
            <motion.button
              className="text-gray-300 hover:text-white transition-colors"
              onClick={onGoHome}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Home className="w-6 h-6" />
            </motion.button>
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <User className="w-8 h-8 text-gray-300" />
              <span className="font-semibold">Dr. Jane Doe</span>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Course and Section Box */}
      <div className="bg-blue-600 p-4 text-center sticky top-16 z-20">
        <h2 className="text-xl font-bold">{currentCourse}</h2>
        <h3 className="text-lg">{currentSection}</h3>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 flex flex-col md:flex-row relative z-10">
        {/* Question Navigator */}
        <Card className="w-full md:w-1/4 bg-gray-800 rounded-lg shadow-md p-6 mb-6 md:mb-0 md:mr-6 flex flex-col">
          <h2 className="text-xl text-black font-bold mb-4">Questions</h2>
          <div
            ref={questionNavigatorRef}
            className="grid grid-cols-4 gap-2 overflow-y-auto max-h-[calc(100vh-300px)]"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#4B5563 #1F2937",
            }}
          >
            <AnimatePresence>
              {filteredQuizData.map((question, index) => (
                <motion.button
                  key={index}
                  className={`p-2 rounded-md text-center ${
                    currentQuestionIndex === index
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  onClick={() => setCurrentQuestionIndex(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={showMoreQuestions ? { opacity: 0, y: 20 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {index + 1}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
          {!showMoreQuestions && (
            <motion.button
              className="mt-4 text-blue-400 flex items-center justify-center"
              onClick={handleShowMoreQuestions}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              More <ChevronDown className="ml-1" />
            </motion.button>
          )}
        </Card>

        {/* Question Display */}
        <Card className="w-full md:w-3/4 flex-grow bg-gray-800 rounded-lg shadow-md p-6">
          <AnimatePresence
            mode="wait"
            onExitComplete={() => setIsAnimating(false)}
          >
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentQuestion.instruction && (
                <div className="mb-4 p-4 bg-gray-700 rounded-lg">
                  <h3 className="font-bold mb-2">Instruction:</h3>
                  <p>{currentQuestion.instruction}</p>
                </div>
              )}
              {currentQuestion.passage && (
                <div className="mb-4 p-4 bg-gray-700 rounded-lg">
                  <h3 className="font-bold mb-2">Passage:</h3>
                  <p>{currentQuestion.passage}</p>
                </div>
              )}
              <h2 className="text-[17px] text-white p-4 bg-blue-500 rounded-lg mb-6">
                {currentQuestion.content}
              </h2>
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <motion.div
                    key={index}
                    className={`p-4 border rounded-lg w-full text-left ${
                      option === currentQuestion.answer
                        ? "bg-green-800 border-green-500"
                        : "bg-gray-700"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-between">
            <Button
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0 || isAnimating}
            >
              <ChevronLeft className="w-5 h-5 mr-2" /> Previous
            </Button>
            <Button
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
              onClick={handleNext}
              disabled={
                currentQuestionIndex === filteredQuizData.length - 1 ||
                isAnimating
              }
            >
              Next <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default QuizDisplay;
