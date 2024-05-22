import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Stepper, Step, StepLabel,Typography,CircularProgress } from '@mui/material';
import { green } from '@mui/material/colors';
import CreateQuiz from './CreateQuiz';
import QuizConfiguration from './QuizConfiguration';
import { QuizService } from "../services/quiz.service";

const steps = ['Create token and file upload', 'Quiz configuration'];

export default function StepperCreateQuiz() {
  const [errorNumberQuestions, setErrorNumberQuestions] = useState(false);
  const [errorQuestionType, setErrorQuestionType] = useState(false);
  const [errorMessageNumberQuestions, setErrorMessageNumberQuestions] = useState('');
  const [errorMessageQuestionType, setErrorMessageQuestionType] = useState('');
  const [errorMessageCreateToken, setErrorMessageCreateToken] = useState('');
  const [errorCreateToken, setErrorCreateToken] = useState(false);
  const [errorFileUpload, setErrorFileUpload] = useState(false);
  const [errorMessageFileUpload, setErrorMessageFileUpload] = useState('');
  
  const [errorResponseMessage, setErrorResponseMessage] = useState('');

  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState(null);
  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [quantityQuestion, setQuantityQuestion] = useState('');
  const [maxNumberQuestions, setMaxNumberQuestions] = useState('');
  const [idQuiz, setIdQuiz] = useState('');
  const [questionType, setQuestionType] = useState(3);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const timer = useRef();
  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      },
    }),
  };

  useEffect(() => {
    const currentTimer = timer.current;
    return () => {
      clearTimeout(currentTimer);
    };
  }, []);

  const handleSend = async () => {
    if (activeStep === 0) {
      if (token && file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('token', token);

        setSuccess(false);
        setLoading(true);
        
        try {
          const response = await QuizService.create(formData);
          if (response.success) {
            
            setMaxNumberQuestions(response.maxQuestion);
            setIdQuiz(response.idQuiz);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setErrorCreateToken(false)
            setErrorMessageCreateToken('');
            setErrorResponseMessage('')
          }
        } catch (error) {

          if (error.response.data.message) {
            setErrorResponseMessage(error.response?.data?.message || 'An error occurred while processing your request.');
          }
          setSuccess(false);

        } finally {
          setLoading(false); 
        }
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
    }
  };

  const handleReset = () => {
    setErrorMessageNumberQuestions('');
    setErrorMessageQuestionType('');
    setErrorNumberQuestions(false);
    setErrorQuestionType(false);
    setToken('');
    setFile(null);
    setErrorMessageFileUpload('');
    setErrorFileUpload(false);
    setQuantityQuestion('');
    setQuestionType(3);
    setActiveStep(0);
  };

  const handleCreate = async () => {
    if (questionType && quantityQuestion) {
      const quantityQuestionNumber = parseInt(quantityQuestion, 10);
      setSuccess(false);
      setLoading(true);

      try {
        const response = await QuizService.update(idQuiz, quantityQuestionNumber, questionType);
        if (response.success) {
          setSuccessMessage(response.message)
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } 
      } catch (error) {
        setSuccess(false);

      } finally {
        setLoading(false);
      }

    } else if (!quantityQuestion && !questionType) {
      setErrorMessageNumberQuestions('Please provide a number.');
      setErrorMessageQuestionType('Please select an option.');
      setErrorNumberQuestions(true);
      setErrorQuestionType(true);
    } else if (!quantityQuestion) {
      setErrorNumberQuestions(true);
      setErrorQuestionType(false);
      setErrorMessageQuestionType('');
      setErrorMessageNumberQuestions('Please provide a number.');
    } else if (!questionType) {
      setErrorQuestionType(true);
      setErrorNumberQuestions(false);
      setErrorMessageQuestionType('Please select an option.');
      setErrorMessageNumberQuestions('');
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',paddingTop:"50px" }}>
            <Box
              sx={{
                backgroundColor: 'green',
                borderRadius: '10px',
                padding: '20px',
                textAlign: 'center',
                color: 'white',
                margin: '20px 0',
              }}
            >
              <Typography variant="h4" sx={{ marginBottom: '10px' }}>
                {successMessage && `${successMessage}.`}
              </Typography>
              <Typography variant="h4">
                Token{' '}
                {token && (
                  <span style={{ color: 'white', textDecoration: 'underline' }}>
                    {token}
                  </span>
                )}{' '}
                created!
              </Typography>

            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset} variant="contained" color="primary">Home</Button>
            </Box>
          </Box>
        </React.Fragment>

      ) : (
        <React.Fragment>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            {activeStep === 0 ? (
                <CreateQuiz
                loading={loading}
                token={token}
                file={file}
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
                errorResponseMessage={errorResponseMessage}
              />
            ) : activeStep === 1 ? (
                <QuizConfiguration
                loading={loading}
                maxNumberQuestions={maxNumberQuestions}
                quantityQuestion={quantityQuestion}
                questionType={questionType}
                setQuantityQuestion={setQuantityQuestion}
                setQuestionType={setQuestionType}
                errorNumberQuestions={errorNumberQuestions}
                errorQuestionType={errorQuestionType}
                errorMessageNumberQuestions={errorMessageNumberQuestions}
                errorMessageQuestionType={errorMessageQuestionType}
                errorResponseMessage={errorResponseMessage}

              />
            ) : null}
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>

              <Box sx={{ flex: '1 1 auto' }} />
                {activeStep === steps.length - 1 ? (
                  <Box sx={{ m: 1, position: 'relative' }}>
                  <Button
                    variant="contained"
                    sx={buttonSx}
                    disabled={loading}
                    onClick={handleCreate}
                  >
                    Generate Quiz
                  </Button>
                  {loading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: green[500],
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                      }}
                    />
                  )}
                </Box>
              ) : (
                <Box sx={{ m: 1, position: 'relative' }}>
                  <Button
                    variant="contained"
                    sx={buttonSx}
                    disabled={loading}
                    onClick={handleSend}
                  >
                    Send
                  </Button>
                  {loading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: green[500],
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                      }}
                    />
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
