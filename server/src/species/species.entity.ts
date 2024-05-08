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

  @Column()
  user_login: string;

  @Column()
  license: string;

  @Column({ nullable: true })
  taxon_class_name: string;

  @Column({ nullable: true })
  taxon_order_name: string;

  @Column({ nullable: true })
  taxon_family_name: string;

  @Column({ nullable: true })
  taxon_genus_name: string;

  @Column({ nullable: true })
  taxon_species_name: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.species)
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;
}
