import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Quizzes } from '../quiz/quizzes.entity';

@Entity()
export class Species {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'scientific_name' })
  scientificName: string;

  @Column({ name: 'common_name' })
  commonName: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  url: string;

  @Column({ name: 'user_login' })
  userLogin: string;

  @Column()
  license: string;

  @Column({ name: 'taxon_class_name', nullable: true })
  taxonClassName: string;

  @Column({ name: 'taxon_order_name', nullable: true })
  taxonOrderName: string;

  @Column({ name: 'taxon_family_name', nullable: true })
  taxonFamilyName: string;

  @Column({ name: 'taxon_genus_name', nullable: true })
  taxonGenusName: string;

  @Column({ name: 'taxon_species_name', nullable: true })
  taxonSpeciesName: string;

  @ManyToOne(() => Quizzes, (quizzes) => quizzes.species)
  @JoinColumn({ name: 'quiz_id' })
  quizzes: Quizzes;
}
