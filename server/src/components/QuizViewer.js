// client/src/components/QuizViewer.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function QuizViewer({ token }) {
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/quizzes/${token}`,
        );
        setQuizData(response.data);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchQuizData();
  }, [token]); // Depende do token para refazer a busca quando ele mudar

  return (
    <div>
      {quizData ? (
        <div>
          {/* Renderize seu quiz aqui usando quizData */}
          <h1>{quizData.title}</h1>
          {/* Mais lógica de apresentação aqui */}
        </div>
      ) : (
        <p>Loading quiz data...</p>
      )}
    </div>
  );
}

export default QuizViewer;
