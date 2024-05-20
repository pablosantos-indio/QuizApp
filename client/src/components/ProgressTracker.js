import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, LinearProgress } from '@mui/material';

export default function ProgressTracker({ totalQuestions, correctAnswers, incorrectAnswers }) {
  const [totalProgress, setTotalProgress] = useState(0);

  useEffect(() => {
    const total = correctAnswers + incorrectAnswers;
    const progress = (total / totalQuestions) * 100;
    setTotalProgress(progress);
  }, [totalQuestions, correctAnswers, incorrectAnswers]);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Total Progress: {totalProgress}%
      </Typography>
      <LinearProgress variant="determinate" value={totalProgress} />
      <Typography variant="h6" gutterBottom>
        Correct Answers: {correctAnswers} / {totalQuestions}
      </Typography>
      <LinearProgress color="success" variant="determinate" value={(correctAnswers / totalQuestions) * 100} />
      <Typography variant="h6" gutterBottom>
        Incorrect Answers: {incorrectAnswers} / {totalQuestions}
      </Typography>
      <LinearProgress color="error" variant="determinate" value={(incorrectAnswers / totalQuestions) * 100} />
    </Box>
  );
}
