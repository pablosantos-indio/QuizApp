import { AnswerDto } from './answer-dto';

export class QuestionDto {
  description: string;
  answers: AnswerDto[];
  imageUrl: string;
  url: string;
  userLogin: string;
}
