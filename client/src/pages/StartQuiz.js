import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, TextField, Stack, CircularProgress } from '@mui/material';
import StepperQuiz from '../components/StepperQuiz';
import { QuizService } from '../services/quiz.service';
import { green } from '@mui/material/colors';

export default function StartQuiz() {
  const [token, setToken] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errorToken, setErrorToken] = useState(false);
  const [errorMessageToken, setErrorMessageToken] = useState('');
  const [errorFirstName, setErrorFirstName] = useState(false);
  const [errorLastName, setErrorLastName] = useState(false);
  const [errorMessageFirstName, setErrorMessageFirstName] = useState('');
  const [errorMessageLastName, setErrorMessageLastName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(true);
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
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleTokenChange = (event) => {
    const newToken = event.target.value;
    setToken(newToken);

    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;
    const isValidToken = regex.test(newToken) && newToken !== '';

    if (!isValidToken) {
      setErrorToken(true);
      setErrorMessageToken('Token must include at least one letter and one number and cannot be empty.');
    } else {
      setErrorToken(false);
      setErrorMessageToken('');
    }

    if (newToken === '') {
      setErrorToken(false);
      setErrorMessageToken('');
    }
  };

  const handleStartQuiz = async () => {
    const isFirstNameValid = firstName !== '';
    const isLastNameValid = lastName !== '';

    if (token && !errorToken && isFirstNameValid && isLastNameValid) {
      setSuccess(false);
      setLoading(true);
        try {
          const response = await QuizService.start(token);
          if (response.success) {
            setQuestions(response.questions);
            setShowForm(false);
          }
        } catch (error) {
          setSuccess(false);
          setErrorToken(true);
          setErrorMessageToken(error.response.data.message);
        } finally {
          setLoading(false);
        }
    } else {
      if (!token) {
        setErrorToken(true);
        setErrorMessageToken("Please provide a valid token.");
      }
      if (!isFirstNameValid) {
        setErrorFirstName(true);
        setErrorMessageFirstName('First Name cannot be empty.');
      }
      if (!isLastNameValid) {
        setErrorLastName(true);
        setErrorMessageLastName('Last Name cannot be empty.');
      }
    }
  };

  const handleFirstNameChange = (event) => {
    const newFirstName = event.target.value;
    setFirstName(newFirstName);

    if (!newFirstName) {
      setErrorFirstName(true);
      setErrorMessageFirstName('First Name cannot be empty.');
    } else {
      setErrorFirstName(false);
      setErrorMessageFirstName('');
    }
  };

  const handleLastNameChange = (event) => {
    const newLastName = event.target.value;
    setLastName(newLastName);

    if (!newLastName) {
      setErrorLastName(true);
      setErrorMessageLastName('Last Name cannot be empty.');
    } else {
      setErrorLastName(false);
      setErrorMessageLastName('');
    }
  };

  const resetQuiz = () => {
    setToken('');
    setFirstName('');
    setLastName('');
    setErrorToken(false);
    setErrorFirstName(false);
    setErrorLastName(false);
    setErrorMessageToken('');
    setErrorMessageFirstName('');
    setErrorMessageLastName('');
    setQuestions([]);
    setShowForm(true);
  };

  return (
    <Stack spacing={{ xs: 3, sm: 6 }} useFlexGap>
      {showForm ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            padding: '0 20px',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              gap: 4,
              p: 3,
              borderRadius: '20px',
              border: '1px solid ',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)',
              width: { xs: '100%', sm: '50%' },
            }}
          >
            <Box>
              <TextField
                id="first-name"
                label="First Name"
                value={firstName}
                onChange={handleFirstNameChange}
                error={errorFirstName}
                helperText={errorFirstName ? errorMessageFirstName : ''}
                disabled={loading}
                required
                sx={{
                  width: '100%',
                }}
              />
            </Box>
            <Box>
              <TextField
                id="last-name"
                label="Last Name"
                value={lastName}
                onChange={handleLastNameChange}
                error={errorLastName}
                helperText={errorLastName ? errorMessageLastName : ''}
                disabled={loading}
                required
                sx={{
                  width: '100%',
                }}
              />
            </Box>
            <Box>
              <TextField
                id="token-create"
                label="Enter Token"
                value={token}
                onChange={handleTokenChange}
                error={errorToken}
                disabled={loading}
                helperText={errorToken ? errorMessageToken : ''}
                required
                sx={{
                  width: '100%', 
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ position: 'relative' }}>
                <Button
                  variant="contained"
                  sx={buttonSx}
                  disabled={loading}
                  onClick={handleStartQuiz}
                >
                  Start Quiz
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
            </Box>

          </Box>
        </Box>
      ) : (
          <StepperQuiz
            questions={questions}
            resetQuiz={resetQuiz}
            firstName={firstName}
            lastName={lastName}
          />
      )}
    </Stack>
  );
}
