import React from 'react';
import { useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import StepperCreateQuiz from './StepperCreateQuiz';
import StepperCreateQuizMobile from './StepperCreateQuizMobile';
import StartQuiz from './StartQuiz';

export default function ResponsiveStepper({ selectedItem }) {
  const isMobile = useMediaQuery('(max-width:600px)');
  const maxWidth = selectedItem === 'Professor' ? 600 : '100%';

  return (
    <Box sx={{ maxWidth, margin: 'auto' }}>
      {selectedItem === "Professor" ? (
        isMobile ? <StepperCreateQuizMobile /> : <StepperCreateQuiz />
      ) : selectedItem === "Student" ? (
          <StartQuiz />
      ) : null}
    </Box>
  );
}
