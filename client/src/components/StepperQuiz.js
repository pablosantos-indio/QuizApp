import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function StepperQuiz({ quizzes, resetQuiz }) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState(null);
  const [correctAnswer, setCorrectAnswer] = React.useState(null);
  const [incorrectAnswer, setIncorrectAnswer] = React.useState(null);
  const [showLearnMore, setShowLearnMore] = React.useState(false);
  const [learnMoreUrl, setLearnMoreUrl] = React.useState([]);
  const [selectedAnswersList, setSelectedAnswersList] = React.useState([]);

  const quizArray = quizzes;

  const steps = quizArray.map((quiz) => ({
    imageUrl: quiz.imageUrl,
    description: quiz.description,
    userLogin: quiz.userLogin,
    url: quiz.url,
    correctAnswer: quiz.correctAnswer,
    answers: quiz.answers
  }));

  const maxSteps = steps.length;

  React.useEffect(() => {
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

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      console.error("error");
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAnswerSelect = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const calculateScore = () => {
    const correctAnswers = selectedAnswersList.filter((selection) => selection.answer === selection.correctAnswer);
    const incorrectAnswers = selectedAnswersList.filter((selection) => selection.answer !== selection.correctAnswer);
    return { correct: correctAnswers.length, incorrect: incorrectAnswers.length };
  };

  const renderResultMessage = () => {
    const { correct, incorrect } = calculateScore();
    if (correct > incorrect) {
      return <Typography sx={{ color: "green" }} variant="h6">Congratulations!</Typography>;
    } else {
      return <Typography sx={{ color: "yellow" }} variant="h6">Keep studying!</Typography>;
    }
  };
  
  

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    calculateScore()
    const nextUrl = steps[activeStep].url;
    if (!learnMoreUrl.includes(nextUrl)) {
      setLearnMoreUrl((prevUrls) => [...prevUrls, nextUrl]);
    }
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
    setShowLearnMore(true);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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
            <Box >
              Correct: {calculateScore().correct}
            </Box>
            <Box >
              Incorrect: {calculateScore().incorrect}
            </Box>
            <Box >
              {renderResultMessage()}
            </Box>
          </DialogContent>

        <DialogActions>
          <Button autoFocus onClick={() => {resetQuiz(); handleClose();}}>
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
          <CardMedia
          sx={{ position: 'relative', height: 240 }}
          image={steps[activeStep].imageUrl}
        >
          <Typography
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '4px 8px',
            }}
          >
            Photo by {steps[activeStep].userLogin}
          </Typography>
        </CardMedia>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {steps[activeStep].description}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: 400 }}>
            <FormControl>
                <RadioGroup
                  aria-labelledby={`alternative-radio-group-label-${activeStep}`}
                  name={`alternative-radio-group-label-${activeStep}`}
                  value={selectedAnswer}
                  onChange={handleAnswerSelect}
                >
                  {steps[activeStep]?.answers?.length > 0 ? (
                    steps[activeStep].answers.map((answer, index) => {
                      const isSelected = selectedAnswersList.some(
                        (selection) => selection.step === activeStep && selection.answer === answer
                      );
                      const isCorrectSelection = answer === correctAnswer;
                      const isIncorrectSelection = isSelected && !isCorrectSelection;

                      return (
                        <FormControlLabel
                          key={index}
                          value={answer}
                          control={<Radio />}
                          label={answer}
                          sx={{
                            color:
                              isCorrectSelection ? "green" :
                                isIncorrectSelection ? "red" :
                                  isSelected ? "orange" :
                                    undefined,
                          }}
                        />
                      );
                    })
                  ) : (
                    <Typography>No answers available</Typography>
                  )}
                </RadioGroup>

            </FormControl>
          </Box>
        </CardContent>
        <CardActions>
          {showLearnMore && learnMoreUrl === steps[activeStep].url && (
            <Link href={steps[activeStep].url}>Learn more</Link>
          )}
          {showLearnMore &&
            learnMoreUrl.map((url) => {
              if (url === steps[activeStep].url) {
                return <Link key={url} href={url}>Learn more</Link>;
              }
              return null; 
            })
          }
        </CardActions>
        <MobileStepper
          variant="text"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
            nextButton={
              (activeStep === maxSteps -1 ) ? ( 
                <Button
                  variant="outlined"
                  onClick={handleClickOpen}
                  disabled={selectedAnswer === null }
                >
                  Finish
                </Button>
              ) : (
                <Button
                  size="small"
                  onClick={handleNext}
                  disabled={selectedAnswer === null || activeStep === maxSteps - 1}
                >
                  Send
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
      </Box>
  );
}
