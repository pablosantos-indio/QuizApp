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

export default function StepperQuiz({ quizzes, resetQuiz }) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState(null);
  const [correctAnswer, setCorrectAnswer] = React.useState(null);
  const [incorrectAnswer, setIncorrectAnswer] = React.useState(null);
  const [showLearnMore, setShowLearnMore] = React.useState(false);
  const [learnMoreUrl, setLearnMoreUrl] = React.useState([]);
  const [selectedAnswersList, setSelectedAnswersList] = React.useState([]);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [showResult, setShowResult] = React.useState(false); 

  const quizArray = quizzes;

  const steps = quizArray.map((quiz) => ({
    imageUrl: quiz.image_url,
    question: quiz.question,
    userLogin: quiz.user_login,
    url: quiz.url,
    correctAnswer: quiz.correct_answer,
    alternatives: quiz.alternatives
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
      if (activeStep +2 === maxSteps) {
        setIsCompleted(true); // Define como concluído quando chega à última etapa
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
      return <Typography sx={{ color: "green" }} variant="h6">Congratulations! You got more answers right. Keep it up!</Typography>;
    } else {
      return <Typography sx={{ color: "yellow" }} variant="h6">Keep studying. You can improve!</Typography>;
    }
  };
  
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      {showResult ? (
        <Card sx={{ maxWidth: 400, margin: 'auto', bgcolor:"gray"}}>
          <CardContent>
            <Typography sx={{ color: "white" }} variant="h5" gutterBottom>
              Quiz Result
            </Typography>
            <Typography sx={{ color: "white" }}  variant="body1" gutterBottom>
              Correct Answers Count: {calculateScore().correct}
            </Typography>
            <Typography sx={{ color: "white" }}  variant="body1" gutterBottom>
              Incorrect Answers Count: {calculateScore().incorrect}
            </Typography>

            {renderResultMessage()}

            <Button variant="contained" onClick={resetQuiz} sx={{ marginTop: 2 }}>
              Back to Start
            </Button>
          </CardContent>
        </Card>

      ):(
      
        <Card sx={{ maxWidth: 345 }}>
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
              {steps[activeStep].question}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: 400 }}>
              <FormControl>
                <RadioGroup
                  aria-labelledby={`alternative-radio-group-label-${activeStep}`}
                  name={`alternative-radio-group-label-${activeStep}`}
                  value={selectedAnswer}
                  onChange={handleAnswerSelect}
                >
                  {Object.entries(steps[activeStep].alternatives).map(([key, value]) => {
                    const isSelected = selectedAnswersList.some(
                      (selection) => selection.step === activeStep && selection.answer === value
                    );
                    const isCorrectSelection = value === correctAnswer;
                    const isIncorrectSelection = isSelected && !isCorrectSelection;

                    return (
                      <FormControlLabel
                        key={key}
                        value={value}
                        control={<Radio />}
                        label={value}
                        sx={{
                          color:
                            isCorrectSelection ? "green" :
                              isIncorrectSelection ? "red" :
                                isSelected ? "orange" : 
                                  undefined,
                        }}
                      />
                    );
                  })}
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
              isCompleted ? (
                <Button
                  size="small"
                  onClick={() => {
                    calculateScore()
                    setShowResult(true); 
                  }}
                >
                  Concluir
                </Button>
              ) : (
                <Button
                  size="small"
                  onClick={handleNext}
                  disabled={selectedAnswer === null || activeStep === maxSteps - 1}
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
      )}
    </Box>
  );
}
