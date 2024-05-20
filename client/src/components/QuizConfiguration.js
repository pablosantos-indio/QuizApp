import React from 'react';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import TextField from '@mui/material/TextField';
import { FormHelperText, FormControl } from '@mui/material';

export default function QuizConfiguration({ maxNumberQuestions, quantityQuestion, questionType, setQuantityQuestion, setQuestionType, errorQuestionType, errorNumberQuestions, errorMessageNumberQuestions, errorMessageQuestionType, loading }) {

  const handleNumberQuestionsChange = (event) => {
    let value = event.target.value.replace(/\D/g, '');
    const maxDigits = maxNumberQuestions.toString().length;
    value = value.slice(0, maxDigits);

    if (parseInt(value) <= 0) {
      value = '';
    } else if (parseInt(value) > maxNumberQuestions) {
      value = maxNumberQuestions.toString();
    }

    setQuantityQuestion(value);
  };

  const handleQuestionTypeChange = (event) => {
    setQuestionType(parseInt(event.target.value));
  };

  return (
    <Stack spacing={{ xs: 3, sm: 6 }} useFlexGap>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            gap: 4,
            p: 3,
            width: '100%',
            borderRadius: '20px',
            border: '1px solid ',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormControl sx={{ gap:1}} error={errorQuestionType} variant="standard">
              <FormLabel htmlFor="number-questions" sx={{ display: 'inline',  fontWeight: 'normal' }} required>
                The maximum number of allowed questions is {maxNumberQuestions}.
              </FormLabel>

                <TextField
                  id="number-questions"
                  name='number-questions'
                  error={errorNumberQuestions}
                  required
                  label="Number of Questions"
                  max={maxNumberQuestions}
                  value={quantityQuestion}
                  onChange={handleNumberQuestionsChange}
                  helperText={errorMessageNumberQuestions}
                  sx={{ mb: "30px" }}
                  disabled={loading}
                />
              

                <FormLabel htmlFor="types-answers" required>
                    Types of Answers
                </FormLabel>
                <RadioGroup
                  aria-labelledby="types-answers-label"
                  name="types-answers"
                  value={questionType}
                  onChange={handleQuestionTypeChange}
                  required
                >
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label="Scientific Name"
                  disabled={loading}

                />
                <FormControlLabel
                  value="2"
                  control={<Radio />}
                  label="Common Name"
                  disabled={loading}

                />
                <FormControlLabel
                  value="3"
                  control={<Radio />}
                  label="Both"
                  disabled={loading}

                />
              </RadioGroup>

              <FormHelperText>{errorMessageQuestionType}</FormHelperText>
            </FormControl>
          </Box>
        </Box>
      </Box>
    </Stack>
  );
}
