import React from 'react';
import { useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import StepperCreateQuiz from './StepperCreateQuiz';
import StepperCreateQuizMobile from './StepperCreateQuizMobile'

export default function ResponsiveStepper() {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto' }}>
      {isMobile ? <StepperCreateQuizMobile /> : <StepperCreateQuiz />}
    </Box>
  );
}

