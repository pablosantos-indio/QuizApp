import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from '../quiz/quiz.entity';
import { Species } from '../species/species.entity';
import * as XLSX from 'xlsx';
import { FileDataDto } from './dto/file-data.dto';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(Species)
    private speciesRepository: Repository<Species>,
  ) {}

  async handleFile(file: Express.Multer.File, token: string): Promise<any> {
    this.validateFile(file, token);

    const quizExists = await this.quizRepository.findOneBy({ token });

    if (quizExists) {
      console.error("There's already a quiz with this token.");
      throw new BadRequestException("There's already a quiz with this token.");
    }

    const { indexMap, jsonData } = await this.getFileData(file);

    //TODO remove questionType
    const quiz = this.quizRepository.create({
      token: token,
      question_type: 'both',
    });

    await this.quizRepository.save(quiz);

    let license = null;

    const speciesData = jsonData
      .slice(1)
      .map((row) => {
        license = row[indexMap['license']];

        if (license && license.trim()) {
          return this.speciesRepository.create({
            quiz,
            user_login: row[indexMap['user_login']],
            license: row[indexMap['license']],
            url: row[indexMap['url']],
            image_url: row[indexMap['image_url']],
            scientific_name: row[indexMap['scientific_name']],
            common_name: row[indexMap['common_name']],
            taxon_class_name: row[indexMap['taxon_class_name']],
            taxon_order_name: row[indexMap['taxon_order_name']],
            taxon_family_name: row[indexMap['taxon_family_name']],
            taxon_genus_name: row[indexMap['taxon_genus_name']],
            taxon_species_name: row[indexMap['taxon_species_name']],
          });
        }
      })
      .filter(Boolean);

    await this.speciesRepository.save(speciesData);

    return {
      success: true,
      message: 'File processed and data inserted successfully.',
    };
  }

  private validateFile(file: Express.Multer.File, token: string) {
    // Verify if a file was sent
    if (!file) {
      console.error('No file provided');
      throw new BadRequestException('No file provided');
    }

    if (!file.originalname.match(/\.xlsx$|\.xls$|\.csv$/)) {
      throw new BadRequestException(
        'Only XLSX, XLS, or CSV files are accepted.',
      );
    }

    if (!token) {
      console.error('No token provided');
      throw new BadRequestException('No token provided');
    }

    // Verify if the token is valid
    if (!token.match(/[A-Za-z].[0-9]|[0-9].[A-Za-z]/)) {
      console.error('Invalid token format');
      throw new BadRequestException(
        'Token must include at least one letter and one number and cannot contain special characters or spaces.',
      );
    }
  }

  private async getFileData(file: Express.Multer.File): Promise<FileDataDto> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const headers: string[] = jsonData[0] as string[];
    const requiredColumns = [
      'user_login',
      'license',
      'url',
      'image_url',
      'scientific_name',
      'common_name',
      'taxon_class_name',
      'taxon_order_name',
      'taxon_family_name',
      'taxon_genus_name',
      'taxon_species_name',
    ];

    const indexMap = headers.reduce(
      (acc, header, index) => ({ ...acc, [header]: index }),
      {},
    );

    const missingColumns = requiredColumns.filter(
      (col) => indexMap[col] === undefined,
    );

    if (missingColumns.length > 0) {
      throw new BadRequestException(
        `Missing required columns: ${missingColumns.join(', ')}`,
      );
    }

    return { indexMap, jsonData };
  }
}
