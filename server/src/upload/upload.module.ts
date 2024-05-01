import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from '../quiz/quiz.entity';
import { Species } from '../species/species.entity';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, Species])],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
