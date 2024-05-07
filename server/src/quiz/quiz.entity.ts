import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Species } from '../species/species.entity';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  token: string;

  @Column({
    type: 'enum',
    enum: ['scientific', 'common', 'both'],
    default: 'scientific',
  })
  question_type: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => Species, (species) => species.quiz)
  species: Species[];
}
