import React from 'react';
import { motion } from 'framer-motion';
import './MoodSelector.css';

const MoodSelector = ({ onMoodSelected }) => {
  const moods = ['Happy', 'Chill', 'Focus', 'Workout', 'Sad'];

  // Animation variants for the container to orchestrate the children's animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1 // Each card animates 0.1s after the previous one
      }
    }
  };

  // Animation variants for each individual card
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      className="mood-selector-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {moods.map((mood) => (
        <motion.button
          key={mood}
          className="mood-card"
          onClick={() => onMoodSelected(mood.toLowerCase())}
          variants={cardVariants}
        >
          {mood}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default MoodSelector;
