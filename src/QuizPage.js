// QuizPage.js
import React from 'react';
import { motion } from 'framer-motion';
import QuizDisplay from './QuizDisplay';

const QuizPage = ({ quizData, onGoHome }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.5 }}
    >
      <QuizDisplay quizData={quizData} onGoHome={onGoHome} />
    </motion.div>
  );
};

export default QuizPage;