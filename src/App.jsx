import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { TextGenerateEffect } from './components/ui/TextGenerateEffect';
import { BackgroundBeams } from './components/ui/BackgroundBeams';
import QuizValidator from './QuizValidator';
import QuizDisplay from './QuizDisplay';
import { SparklesCore } from './components/ui/Sparkles';

const App = () => {
  const [quizData, setQuizData] = useState(null);

  const handleOnGoHome = () => {
    setQuizData(null);
  }

  const handleQuizData = (data) => {
    console.log(data);
    setQuizData(data);
  };

  const features = [
    {
      title: "Interactive Quizzes",
      description: "Engage with dynamic and interactive quizzes that challenge your knowledge.",
      image: "/path-to-quiz-image.jpg"
    },
    {
      title: "Real-time Feedback",
      description: "Get instant feedback on your answers and track your progress.",
      image: "/path-to-feedback-image.jpg"
    },
    {
      title: "Customizable Experience",
      description: "Tailor your learning journey with customizable quiz options.",
      image: "/path-to-customize-image.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-600 text-white relative overflow-hidden font-sans">
      <BackgroundBeams />
      
      <header className="relative z-10 p-8 text-center">
        <motion.h1 
          className="text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Quiz Platform
        </motion.h1>
        <TextGenerateEffect words="Elevate your learning experience with interactive quizzes" />
      </header>

      <main className="container mx-auto p-6 relative z-10">
        <AnimatePresence mode="wait">
          {!quizData ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <section className="mb-16">
                <h2 className="text-3xl font-semibold mb-8 text-center">Our Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors duration-300">
                        <CardHeader>
                          <CardTitle>{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <img src={feature.image} alt={feature.title} className="w-full h-40 object-cover rounded-md mb-4" />
                          <CardDescription>{feature.description}</CardDescription>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </section>
              
              <section className="text-center mb-16">
                <h2 className="text-3xl font-semibold mb-8">Start Your Quiz Journey</h2>
                <QuizValidator onQuizDataReady={handleQuizData} />
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.5 }}
            >
              <QuizDisplay quizData={quizData} onGoHome={handleOnGoHome} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 bg-gray-800 p-4 text-center">
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