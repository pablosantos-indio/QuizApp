import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quizzes } from './quizzes.entity';
import { Species } from '../species/species.entity';
import { QuestionTypeEnum } from './enum/question-type-enum';
import { StartQuizDto } from './dto/start-quiz-dto';
import { QuestionDto } from '../utils/dto/quesiton-dto';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quizzes)
    private quizRepository: Repository<Quizzes>,
    @InjectRepository(Species)
    private speciesRepository: Repository<Species>,
  ) {}

  async start(dto: StartQuizDto): Promise<any> {
    const quiz = await this.quizRepository
      .createQueryBuilder('quizzes')
      .innerJoinAndSelect('quizzes.species', 'species')
      .where('quizzes.token = :token', { token: dto.token })
      .getOne();

    if (!quiz) {
      console.error('Quiz not found.');
      throw new NotFoundException('Quiz not found.');
    }

    const questions: QuestionDto[] = [];
    let answers: string[] = [];
    let answer: string;
    let correctAnswerIndex = true;

    let selectedIndices = [];
    let randomNumber;
    let correctAnswer;

    for (let i = 0; i < quiz.quantityQuestion - 1; i++) {
      for (let j = 0; j < 5; j++) {
        if (correctAnswerIndex) {
          answer = this.getAnswerDescription(
            quiz.questionType,
            quiz.species[i],
          );

          correctAnswer = answer;
          correctAnswerIndex = false;
          selectedIndices.push(i);
        } else {
          do {
            randomNumber = Math.floor(Math.random() * quiz.species.length);
          } while (selectedIndices.includes(randomNumber));

          selectedIndices.push(randomNumber);

          answer = this.getAnswerDescription(
            quiz.questionType,
            quiz.species[randomNumber],
          );
        }

        answers.push(answer);
      }

      correctAnswerIndex = true;

      questions.push({
        description: this.getQuestionDescription(quiz.questionType),
        answers,
        imageUrl: quiz.species[i].imageUrl,
        url: quiz.species[i].url,
        userLogin: quiz.species[i].userLogin,
        correctAnswer,
      });

      answers = [];
      selectedIndices = [];
    }

    return {
      success: true,
      message: 'File processed and data inserted successfully.',
      questions,
    };
  }

  private getQuestionDescription(questionType: number) {
    switch (questionType) {
      case QuestionTypeEnum.SCIENTIFIC:
        return 'What is the correct scientific name?';
      case QuestionTypeEnum.COMMON:
        return 'What is the correct common name?';
      case QuestionTypeEnum.BOTH:
        return 'What is the correct scientific and common name?';
      default:
        throw new NotFoundException('Question type not found.');
    }
  }

  private getAnswerDescription(questionType: number, specie: Species) {
    switch (questionType) {
      case QuestionTypeEnum.SCIENTIFIC:
        return specie.scientificName;
      case QuestionTypeEnum.COMMON:
        return specie.commonName;
      case QuestionTypeEnum.BOTH:
        return `${specie.scientificName} / ${specie.commonName}`;
      default:
        throw new NotFoundException('Question type not found.');
    }
  }
}
