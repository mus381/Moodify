import React from 'react';
import { motion } from 'framer-motion';
import './MoodSelector.css';

const MoodSelector = React.memo(({ onMoodSelected }) => {
  const moods = ['Happy', 'Chill', 'Focus', 'Workout', 'Sad'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

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
});

export default MoodSelector;



