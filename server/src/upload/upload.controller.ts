import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ApiConsumes } from '@nestjs/swagger';
import { UpdateQuizDto } from '../quiz/dto/update-quiz-dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 30 * 1024 * 1024 }, // 30MB of file size limit
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('token') token: string,
  ) {
    const result = await this.uploadService.handleFile(file, token);
    return result;
  }

  @Put(':idQuiz')
  async update(@Param('idQuiz') idQuiz: number, @Body() data: UpdateQuizDto) {
    const result = await this.uploadService.update(idQuiz, data);
    return result;
  }
}
