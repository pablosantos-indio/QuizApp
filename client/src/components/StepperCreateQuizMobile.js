import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import CreateQuiz from './CreateQuiz';
import QuizConfiguration from './QuizConfiguration';

export default function StepperCreateQuizMobile() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const [file, setFile] = useState(null);
  const [token, setToken] = useState('');
  const [errorNumberQuestions, setErrorNumberQuestions] = useState(false);
  const [errorTypesAnswers, setErrorTypesAnswers] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessageNumberQuestions, setErrorMessageNumberQuestions] = useState('');
  const [errorMessageTypesAnswers, setErrorMessageTypesAnswers] = useState('');
  const [errorMessageCreateToken, setErrorMessageCreateToken] = useState('');
  const [errorCreateToken, setErrorCreateToken] = useState(false);
  const [errorFileUpload, setErrorFileUpload] = useState(false);
  const [errorMessageFileUpload, setErrorMessageFileUpload] = useState('');

  const [numberQuestions, setNumberQuestions] = useState('');
  const [typesAnswers, setTypesAnswers] = useState('both');

  const steps = [
    {
      label: 'Create Token and FileUpload',
      component: <CreateQuiz
        token={token}
        setFile={setFile}
        setToken={setToken}
        errorMessageCreateToken={errorMessageCreateToken}
        setErrorMessageCreateToken={setErrorMessageCreateToken}
        errorCreateToken={errorCreateToken}
        setErrorCreateToken={setErrorCreateToken}
        errorFileUpload={errorFileUpload}
        setErrorFileUpload={setErrorFileUpload}
        errorMessageFileUpload={errorMessageFileUpload}
        setErrorMessageFileUpload={setErrorMessageFileUpload}
      />,
      actionButtonLabel: 'Next'
    },
    {
      label: 'Quiz Configuration',
      component: <QuizConfiguration
        numberQuestions={numberQuestions}
        typesAnswers={typesAnswers}
        setNumberQuestions={setNumberQuestions}
        setTypesAnswers={setTypesAnswers}
        errorNumberQuestions={errorNumberQuestions}
        errorTypesAnswers={errorTypesAnswers}
        errorMessageNumberQuestions={errorMessageNumberQuestions}
        errorMessageTypesAnswers={errorMessageTypesAnswers}
      />,
      actionButtonLabel: 'Create'
    },
    {
      label: 'Quiz created successfully',
      actionButtonLabel: 'Reset'
    },
  ];
  const maxSteps = steps.length;

  const handleNext = () => {
    if (activeStep === maxSteps - 1) {
      handleReset();
    } else {
      if (activeStep === 0) {
        if (token && file) {
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
          setErrorMessage('');
        } else if (!file && !token) {
          setErrorMessageFileUpload('Need to upload the file');
          setErrorMessageCreateToken('I need to provide a token');
          setErrorCreateToken(true);
          setErrorFileUpload(true);
        } else if (!file) {
          setErrorFileUpload(true);
          setErrorCreateToken(false);
          setErrorMessageCreateToken('');
          setErrorMessageFileUpload('Need to upload the file');
        } else if (!token) {
          setErrorCreateToken(true);
          setErrorFileUpload(false);
          setErrorMessageCreateToken('I need to provide a token');
          setErrorMessageFileUpload('');
        }
      } else if (activeStep === 1) {
        if (typesAnswers && numberQuestions) {
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else if (!numberQuestions && !typesAnswers) {
          setErrorMessageNumberQuestions('Please provide a number.');
          setErrorMessageTypesAnswers('Please select an option.');
          setErrorNumberQuestions(true);
          setErrorTypesAnswers(true);
        } else if (!numberQuestions) {
          setErrorNumberQuestions(true);
          setErrorTypesAnswers(false);
          setErrorMessageTypesAnswers('');
          setErrorMessageNumberQuestions('Please provide a number.');
        } else if (!typesAnswers) {
          setErrorTypesAnswers(true);
          setErrorNumberQuestions(false);
          setErrorMessageTypesAnswers('Please select an option.');
          setErrorMessageNumberQuestions('');
        }
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setErrorMessageNumberQuestions('');
    setErrorMessageTypesAnswers('');
    setErrorNumberQuestions(false)
    setErrorTypesAnswers(false)
    setToken('');
    setFile(null);
    setErrorMessageFileUpload('');
    setErrorFileUpload(false)
    setNumberQuestions('');
    setTypesAnswers('both');
    setActiveStep(0);
  };

  return (
    <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
      <Paper
        square
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 50,
          pl: 2,
          color: theme.palette.primary,
        }}
      >
        {steps[activeStep].label === 'Quiz created successfully' ? (
          <Box sx={{ backgroundColor: 'green', borderRadius: '10px', }}>
            <Typography variant="h4" sx={{ textAlign: 'center', color: "white" }}>{steps[activeStep].label}
            </Typography>
          </Box>

        ) : (
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {steps[activeStep].label}
          </Typography>
        )}
      </Paper>

      <Box sx={{ maxWidth: 400, width: '100%', p: 2 }}>
        {steps[activeStep].component}
      </Box>
      <MobileStepper
        variant="text"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={(activeStep === maxSteps - 1 && !file) || activeStep === maxSteps}
            style={{ visibility: activeStep === maxSteps - 1 ? 'hidden' : 'visible' }}
          >
            {steps[activeStep].actionButtonLabel}
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          activeStep === maxSteps - 1 ? (
            <Button size="small" onClick={handleReset}>
              <KeyboardArrowLeft />
              Reset
            </Button>
          ) : (
            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
              {theme.direction === 'rtl' ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          )
        }
      />
    </Box>
  );
}
