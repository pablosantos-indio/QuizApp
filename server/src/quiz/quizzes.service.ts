import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quizzes } from './quizzes.entity';
import { Species } from '../species/species.entity';
import { QuestionTypeEnum } from './enum/question-type-enum';
import { StartQuizDto } from './dto/start-quiz-dto';
import { QuestionDto } from '../utils/dto/quesiton-dto';
import { AnswerDto } from '../utils/dto/answer-dto';
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
    let answers: AnswerDto[] = [];
    let answer: AnswerDto;
    let correctAnswerIndex = true;

    let selectedIndices = [];
    let randomNumber;

    for (let i = 0; i < quiz.quantityQuestion - 1; i++) {
      for (let j = 0; j < 4; j++) {
        if (correctAnswerIndex) {
          answer = {
            description: this.getAnswerDescription(
              quiz.questionType,
              quiz.species[i],
            ),
            isCorrect: true,
          };

          correctAnswerIndex = false;
        } else {
          do {
            randomNumber = Math.floor(Math.random() * quiz.species.length);
          } while (selectedIndices.includes(randomNumber));

          selectedIndices.push(randomNumber);

          answer = {
            description: this.getAnswerDescription(
              quiz.questionType,
              quiz.species[randomNumber],
            ),
            isCorrect: false,
          };
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
        return 'What is the scientific name of this animal?';
      case QuestionTypeEnum.COMMON:
        return 'What is the common name of this animal?';
      case QuestionTypeEnum.BOTH:
        return 'What is the scientific and common name of this animal?';
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