import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import CreateQuiz from './CreateQuiz';
import QuizConfiguration from './QuizConfiguration';

const steps = ['Create Token and FileUpload', 'Quiz Configuration'];

export default function StepperCreateQuiz() {
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


  const handleNext = async () => {
    if (activeStep === 0) {
      if (token && file) {
        // const formData = new FormData();
        // formData.append('file', file);
        // formData.append('token', token);

        // try {
        //   const response = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData, {
        //     headers: {
        //       'Content-Type': 'multipart/form-data'
        //     }
        //   });
        //   if (response.data.success) {
        //     setActiveStep((prevActiveStep) => prevActiveStep + 1);
        //   } else {
        //     setErrorMessage(response.data.message || 'An error occurred while uploading the file.');
        //   }
        // } catch (error) {
        //   setErrorMessage(error.response.data.message || 'An error occurred while uploading the file.');
        // }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setErrorMessage('');
      } else if(!file && !token) {
        setErrorMessageFileUpload('Need to upload the file');
        setErrorMessageCreateToken('I need to provide a token')
        setErrorCreateToken(true)
        setErrorFileUpload(true)
      } else if (!file) {
        setErrorFileUpload(true)
        setErrorCreateToken(false)
        setErrorMessageCreateToken('')
        setErrorMessageFileUpload('Need to upload the file')
      } else if (!token) {
        setErrorCreateToken(true)
        setErrorFileUpload(false)
        setErrorMessageCreateToken('I need to provide a token')
        setErrorMessageFileUpload('')
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

  
  const handleCreate = () => {
    if (typesAnswers && numberQuestions) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (!numberQuestions && !typesAnswers ) {
      setErrorMessageNumberQuestions('Please provide a number.');
      setErrorMessageTypesAnswers('Please select an option.')
      setErrorNumberQuestions(true)
      setErrorTypesAnswers(true)

    } else if (!numberQuestions ) {
      setErrorNumberQuestions(true)
      setErrorTypesAnswers(false)
      setErrorMessageTypesAnswers('')
      setErrorMessageNumberQuestions('Please provide a number.');
    } else if (!typesAnswers) {
      setErrorTypesAnswers(true)
      setErrorNumberQuestions(false)
      setErrorMessageTypesAnswers('Please select an option.')
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
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p:"80px" }}>
            <Box sx={{ backgroundColor: 'green', borderRadius: '10px', padding: '20px' }}>
              <Typography variant="h4" sx={{ textAlign: 'center', color:"white" }}>Quiz created successfully</Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset} variant="contained" color="primary">Reset</Button>
            </Box>
          </Box>
        </React.Fragment>

      ) : (
        <React.Fragment>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            {activeStep === 0 ? (
              <CreateQuiz
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
              />
            ) : activeStep === 1 ? (
                  <QuizConfiguration
                    numberQuestions={numberQuestions}
                    typesAnswers={typesAnswers}
                    setNumberQuestions={setNumberQuestions}
                    setTypesAnswers={setTypesAnswers}
                    errorNumberQuestions={errorNumberQuestions}
                    errorTypesAnswers={errorTypesAnswers}
                    errorMessageNumberQuestions={errorMessageNumberQuestions}
                    errorMessageTypesAnswers={errorMessageTypesAnswers}
                  />
            ) : null}
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              {activeStep !== 0 && (
                <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>
              )}
              <Box sx={{ flex: '1 1 auto' }} />
              {activeStep === steps.length - 1 ? (
                <Button onClick={handleCreate}>Create</Button>
              ) : (
                <Button onClick={handleNext}>Next</Button>
              )}
            </Box>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
