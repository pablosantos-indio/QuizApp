import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Quiz } from '../quiz/quiz.entity';

@Entity()
export class Species {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  scientific_name: string;

  @Column()
  common_name: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ nullable: true })
  url: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.species)
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;
}
