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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box  width="100%">
        <Typography variant="subtitle2" gutterBottom>
          Total Progress: {totalProgress}%
        </Typography>
        <LinearProgress variant="determinate" value={totalProgress} />

      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Correct Answers: {correctAnswers} / {totalQuestions}
          </Typography>
          <LinearProgress color="success" variant="determinate" value={(correctAnswers / totalQuestions) * 100} />
        </Box>
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Incorrect Answers: {incorrectAnswers} / {totalQuestions}
          </Typography>
          <LinearProgress color="error" variant="determinate" value={(incorrectAnswers / totalQuestions) * 100} />
        </Box>
      </Box>

    </Box>
  );
}
