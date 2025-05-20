import React, { useState, useEffect } from "react";

const greetings = [
  "Hello! (English)",
  "Hola! (Spanish)",
  "Bonjour! (French)",
  "Hallo! (German)",
  "Ciao! (Italian)",
  "नमस्ते! (Hindi)",
  "你好! (Chinese)",
  "こんにちは! (Japanese)",
  "안녕하세요! (Korean)",
  "مرحبا! (Arabic)"
];

const LoadingScreen = ({ onFinish }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % greetings.length);
    }, 1000); // Change every 1s

    const timeout = setTimeout(() => {
      onFinish(); // Hide loading screen after 3 seconds
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onFinish]);

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white text-3xl font-bold">
      <span className="opacity-0 animate-fade-in">{greetings[index]}</span>
    </div>
  );
};

export default LoadingScreen;
