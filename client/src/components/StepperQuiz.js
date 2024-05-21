import React, { useState, useEffect } from 'react';
import { Box, MobileStepper, Typography, Button, Radio, RadioGroup, FormControlLabel, FormControl, Link, Card, CardActions, CardContent, CardMedia, CardActionArea, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import ProgressTracker from './ProgressTracker';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function StepperQuiz({ questions, resetQuiz, firstName, lastName }) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [incorrectAnswer, setIncorrectAnswer] = useState(null);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [learnMoreUrl, setLearnMoreUrl] = useState([]);
  const [selectedAnswersList, setSelectedAnswersList] = useState([]);
  const [lastStepConfirmed, setLastStepConfirmed] = useState(false);
  const [stepNumber, setStepNumber] = useState('');
  const [isStepNumberValid, setIsStepNumberValid] = useState(false);

  
  
  const steps = questions.map((quiz) => ({
    imageUrl: quiz.imageUrl,
    description: quiz.description,
    userLogin: quiz.userLogin,
    url: quiz.url,
    correctAnswer: quiz.correctAnswer,
    answers: quiz.answers,
    license: quiz.license
  }));
  
  const maxSteps = steps.length;
  


  useEffect(() => {
    const selectedAnswerForStep = selectedAnswersList.find((selection) => selection.step === activeStep);
    if (selectedAnswerForStep) {
      setSelectedAnswer(selectedAnswerForStep.answer);
      setCorrectAnswer(selectedAnswerForStep.correctAnswer);
    } else {
      setSelectedAnswer(null);
      setCorrectAnswer(null);
    }
  }, [activeStep, selectedAnswersList]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleConfirm = () => {
    if (selectedAnswer !== null) {
      const existingSelection = selectedAnswersList.find(
        (selection) => selection.step === activeStep
      );
      if (!existingSelection) {
        const selection = {
          step: activeStep,
          answer: selectedAnswer,
          correctAnswer: steps[activeStep].correctAnswer
        };
        setSelectedAnswersList((prevList) => [...prevList, selection]);
      }
      const nextUrl = steps[activeStep].url;
      if (!learnMoreUrl.includes(nextUrl)) {
        setLearnMoreUrl((prevUrls) => [...prevUrls, nextUrl]);
      }


      if (selectedAnswer === steps[activeStep].correctAnswer) {
        setShowLearnMore(true);
      } else {
        setIncorrectAnswer(selectedAnswer);
        setCorrectAnswer(steps[activeStep].correctAnswer);
        setShowLearnMore(true);
      }

      if (activeStep === maxSteps - 1) {
        setLastStepConfirmed(true);
      }
    } else {
      console.error("error");
    }
  };



  const validateStepNumber = (value) => {
    const isValid = value.trim() !== '' && parseInt(value) > 0 && parseInt(value) <= maxSteps;
    setIsStepNumberValid(isValid);
  };


  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAnswerSelect = (event) => {
    setSelectedAnswer(event.target.value); 
  };


  const calculateScore = () => {
    const correctAnswers = selectedAnswersList.filter((selection) =>  steps[selection.step].answers[parseInt(selection.answer)].toString() === selection.correctAnswer);
    const incorrectAnswers = selectedAnswersList.filter((selection) => steps[selection.step].answers[parseInt(selection.answer)].toString() !== selection.correctAnswer);
    return { correct: correctAnswers.length, incorrect: incorrectAnswers.length };
  };

  const renderResultMessage = () => {
    const { correct, incorrect } = calculateScore();
    if (correct > incorrect) {
      return (
        <Typography sx={{ fontWeight: "bold"}} variant="h6">
          Congratulations {firstName} {lastName}!
        </Typography>
      );
    } else {
      return (
        <Typography sx={{ fontWeight: "bold" }} variant="h6">
          Keep studying, {firstName} {lastName}!
        </Typography>
      );
    }
  };

  const { correct, incorrect } = calculateScore(); 


  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    calculateScore();
    setShowLearnMore(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleStepNumberChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value) || value === '') { 
      validateStepNumber(value);
      setStepNumber(value);
    }
  };

  const handleJumpToStep = () => {
    const stepNum = parseInt(stepNumber, 10);
    if (!isNaN(stepNum) && stepNum > 0 && stepNum <= maxSteps) {
      const stepIndex = steps.findIndex((step, index) => index + 1 === stepNum);
      if (stepIndex !== -1) {
        setActiveStep(stepIndex);
        setStepNumber('');
      } else {
        console.error('Step not found');
      }
    } else {
      console.error('Invalid step number');
    }
  };



  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 2, md: 4 },
          maxWidth: "90%",
          margin: "auto",
        }}
      >
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
          sx={{
            '& .MuiDialog-paper': { 
              width: '90%', 
              maxHeight: '90vh', 
            },
          }}
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Quiz Result
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            <Box display={'flex'} justifyContent={'center'} alignContent={'center'} marginBottom={'30px'}>
              {renderResultMessage()}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
              <Box sx={{ bgcolor: '#4caf50', color: '#fff', padding: '3px', borderRadius: '4px', marginRight: '5px' }}>
                Correct Answers: {calculateScore().correct}
              </Box>
              <Box sx={{ bgcolor: '#f44336', color: '#fff', padding: '3px', borderRadius: '4px' }}>
                Incorrect Answers: {calculateScore().incorrect}
              </Box>
            </Box>

           
            {incorrectAnswer && (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '6px', mt:"20px" }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#f44336', gridColumn: '1 / -1' }}>
                  Incorrect Answers:
                </Typography>
                {selectedAnswersList
                  .sort((a, b) => a.step - b.step) 
                  .map((selection, index) => {
                    const step = steps[selection.step];
                    if (steps[selection.step].answers[parseInt(selection.answer)].toString() !== selection.correctAnswer) {
                      return (
                        <Box key={selection.step}>
                          <Link
                            href={step.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ mt: '8px', display: 'block' }}
                          >
                            Question {parseInt(selection.step) + 1}
                          </Link>
                        </Box>
                      );
                    }
                    return null;
                  })}
              </Box>
            )}
          </DialogContent>


          <DialogActions>
            <Button autoFocus onClick={() => { resetQuiz(); handleClose(); }}>
              Back to Start
            </Button>
          </DialogActions>
        </BootstrapDialog>
        
        <Card
          sx={{
            maxWidth: { xs: 300, sm: 400 },
            margin: "auto",
          }}
        >
          <Box sx={{ width: '100%', mb: 2 }}>
            <ProgressTracker
              totalQuestions={maxSteps}
              correctAnswers={correct}
              incorrectAnswers={incorrect}
            />
          </Box>
          <CardActionArea>
            <Link href={steps[activeStep].imageUrl} target="_blank" rel="noopener noreferrer">
              <CardMedia
                component="img"
                sx={{
                  height: 375,
                  width: 500,
                  objectFit:"cover",
                }}
                image={steps[activeStep].imageUrl}
              >
              </CardMedia>
                <Typography
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    padding: '4px 8px',
                  }}
                >
                  Photo by {steps[activeStep].userLogin}
                </Typography>
            </Link>
          </CardActionArea>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 16px',
              bgcolor: 'rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography>
                Font:
              </Typography>
              <Link
                href="https://www.inaturalist.org/"
                color="inherit"
                underline="always"
                target="_blank"
                rel="noopener noreferrer"
              >
                inaturalist
              </Link>
            </Box>
            <Typography>
              License {steps[activeStep].license}
            </Typography>
          </Box>

          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {steps[activeStep].description}
            </Typography>
            <Box sx={{ width: 400 }}>
              <FormControl sx={{ width: "100%" }}>
                <RadioGroup
                  aria-labelledby={`alternative-radio-group-label-${activeStep}`}
                  name={`alternative-radio-group-label-${activeStep}`}
                  value={selectedAnswer}
                  onChange={handleAnswerSelect}
                  sx={{ display: 'flex', justifyContent: 'flex-start' }}
                >
                  {steps[activeStep]?.answers?.length > 0 ? (
                    steps[activeStep].answers.map((answer, index) => {
                      const isSelected = selectedAnswersList.some((selection) => {
                        return selection.step === activeStep && selection.answer === index.toString();
                      });
                      const isCorrectSelection = answer === correctAnswer;
                      const isIncorrectSelection = isSelected && !isCorrectSelection;

                      const bgcolor = isCorrectSelection
                        ? "#90EE90"
                        : isIncorrectSelection
                          ? "#FF7F7F"
                          : isSelected
                            ? "#FFD700"
                            : "transparent";
                      const color = "black" ;

                      return (
                        <FormControlLabel
                          key={`${index}-${answer}`}
                          value={index.toString()}
                          control={<Radio />}
                          label={
                            <Box
                              sx={{
                                position: 'relative',
                                display: 'inline-block',
                                bgcolor: bgcolor,
                                borderRadius: 1,
                                px: 1,
                                color: color,
                              }}
                            >
                              <Typography sx={{ position: 'relative', zIndex: 1 }}>
                                {answer}
                              </Typography>
                            </Box>
                          }
                        />
                      );
                    })
                  ) : (
                    <Typography>No answers available</Typography>
                  )}
                </RadioGroup>




                <Box mt={2} sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    onClick={handleConfirm}
                    disabled={selectedAnswer === null || (lastStepConfirmed && activeStep === maxSteps - 1)}
                  >
                    Confirm
                  </Button>
                </Box>
              </FormControl>
            </Box>
          </CardContent>
          <CardActions>
            {showLearnMore && learnMoreUrl.includes(steps[activeStep].url) && (
              <Link
                href={steps[activeStep].url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more
              </Link>
            )}
          </CardActions>
          <MobileStepper
            variant="text"
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            nextButton={
              activeStep === maxSteps - 1 ? (
                <Button
                  variant="outlined"
                  onClick={handleClickOpen}
                  disabled={!lastStepConfirmed} 
                >
                  Finish
                </Button>
              ) : (
                <Button
                  size="small"
                  onClick={handleNext}
                >
                  Next
                  {theme.direction === 'rtl' ? (
                    <KeyboardArrowLeft />
                  ) : (
                    <KeyboardArrowRight />
                  )}
                </Button>
              )
            }
            backButton={
              <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                Back
              </Button>
            }
          />
        </Card>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button
          variant="contained"
          onClick={handleJumpToStep}
          sx={{ ml: 2 }}
          disabled={!isStepNumberValid}
        >
          Go to Question
        </Button>
        <TextField
          label="Question"
          value={stepNumber}
          onChange={handleStepNumberChange}
          variant="outlined"
          size="small"
          type="number"
          inputProps={{ min: 1, max: maxSteps}}
        />
      </Box>
    </Box>
  );
}
