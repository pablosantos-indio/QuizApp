import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

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
    try {
      // Verify if a file was sent
      if (!file) {
        console.error('No file provided');
        throw new BadRequestException('No file provided');
      }

      // Verify if the token is valid
      if (!token.match(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/)) {
        console.error('Invalid token format');
        throw new BadRequestException(
          'Token must include at least one letter and one number and cannot contain special characters or spaces.',
        );
      }

      // Processar o arquivo
      const result = await this.uploadService.handleFile(file, token);
      return result;
    } catch (error) {
      console.error('Error during file upload:', error.message);
      throw new InternalServerErrorException(
        'An error occurred while uploading the file.',
      );
    }
  }
}
