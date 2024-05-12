import React, { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import mockQuizzes from '../mock/mockQuizzes.json'; 
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import StepperQuiz from './StepperQuiz';

export default function StartQuiz() {
  const [token, setToken] = useState('');
  const [errorToken, setErrorToken] = useState(false);
  const [errorMessageToken, setErrorMessageToken] = useState('');
  const [errorFetchingQuizzes, setErrorFetchingQuizzes] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [showForm, setShowForm] = useState(true);


  const handleTokenChange = (event) => {
    const newToken = event.target.value;
    setToken(newToken);

    const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/;
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
    if (token && !errorToken) {
      try {
        const shuffledQuizzes = shuffle(mockQuizzes);
        const selectedQuizzes = shuffledQuizzes.slice(0, 10);
        setQuizzes(selectedQuizzes);
        setShowForm(false);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setErrorFetchingQuizzes('Error fetching quizzes. Please check your token.');
      }
    } else {
      if (!token) {
        setErrorToken(true);
        setErrorMessageToken("Please provide a valid token.");
      }
    }
  };
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const resetQuiz = () => {
    setToken('');
    setErrorToken(false);
    setErrorMessageToken('');
    setErrorFetchingQuizzes('');
    setQuizzes([]);
    setShowForm(true);
  };

  return (
    <Stack spacing={{ xs: 3, sm: 6 }} useFlexGap>
      {errorFetchingQuizzes && <Alert severity="error">{errorFetchingQuizzes}</Alert>}
      {showForm ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxWidth: "25%",
            margin: 'auto', 
            alignItems: 'center',
            justifyContent: 'center',
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
            }}
          >
            <Box > 
              <TextField
                id="token-create"
                label="Enter Token"
                value={token}
                onChange={handleTokenChange}
                error={errorToken}
                helperText={errorToken ? errorMessageToken : ''}
                
              />
            </Box>
            <Button
              variant="contained"
              onClick={handleStartQuiz}
            >
              Start Quiz
            </Button>
          </Box>
        </Box>


      ) : (
          <StepperQuiz quizzes={quizzes} resetQuiz={resetQuiz} />
      )}
    </Stack>
  );
}
