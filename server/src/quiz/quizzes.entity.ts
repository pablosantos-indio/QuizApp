import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Species } from '../species/species.entity';
import { QuestionTypeEnum } from './enum/question-type-enum';

@Entity()
export class Quizzes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  token: string;

  @Column({
    type: 'enum',
    enum: [
      QuestionTypeEnum.SCIENTIFIC,
      QuestionTypeEnum.COMMON,
      QuestionTypeEnum.BOTH,
    ],
    default: QuestionTypeEnum.SCIENTIFIC,
    name: 'question_type',
  })
  questionType: number;

  @Column({ name: 'quantity_question', nullable: true })
  quantityQuestion: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => Species, (species) => species.quizzes)
  species: Species[];
}
