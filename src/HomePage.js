// HomePage.js
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { TextGenerateEffect } from './components/ui/TextGenerateEffect';
import QuizValidator from './QuizValidator';

const HomePage = ({ onQuizDataReady }) => {
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
    <>
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
          <QuizValidator onQuizDataReady={onQuizDataReady} />
        </section>
      </main>
    </>
  );
};

export default HomePage;