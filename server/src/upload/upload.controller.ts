import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('token') token: string,
  ) {
    if (!token.match(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/)) {
      return {
        success: false,
        message: 'Token must contain at least one letter and one number.',
      };
    }
    return this.uploadService.handleFile(file, token);
  }
}
