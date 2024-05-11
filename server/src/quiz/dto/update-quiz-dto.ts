import { IsEnum, IsNumber } from 'class-validator';
import { QuestionTypeEnum } from '../enum/question-type-enum';

export class UpdateQuizDto {
  @IsNumber()
  quantityQuestion: number;

  @IsEnum(QuestionTypeEnum)
  questionType: number;
}
