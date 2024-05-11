import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quizzes } from './quizzes.entity';
import { Species } from '../species/species.entity';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Quizzes, Species])],
  controllers: [QuizzesController],
  providers: [QuizzesService],
})
export class QuizzesModule {}
