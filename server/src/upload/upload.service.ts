import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from '../quiz/quiz.entity';
import { Species } from '../species/species.entity';
import * as XLSX from 'xlsx';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(Species)
    private speciesRepository: Repository<Species>,
  ) {}

  async handleFile(file: Express.Multer.File, token: string): Promise<any> {
    if (!file.originalname.match(/\.xlsx$|\.xls$|\.csv$/)) {
      throw new BadRequestException(
        'Invalid file type. Upload XLSX, XLS, or CSV files only.',
      );
    }

    // File reading and data extraction
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Verification of the necessary columns
    const requiredColumns = [
      'user_login',
      'user_name',
      'url',
      'image_url',
      'scientific_name',
      'common_name',
    ];
    const headers: string[] = jsonData[0] as string[];
    const missingColumns = requiredColumns.filter(
      (col) => !headers.includes(col),
    );

    if (missingColumns.length > 0) {
      return {
        success: false,
        message: `Missing required columns: ${missingColumns.join(', ')}.`,
      };
    }

    // Mapping of column indexes for data extraction
    const columnIndex = headers.reduce((acc, col, index) => {
      acc[col] = index;
      return acc;
    }, {});

    // Remove the header
    jsonData.shift();

    // Creation of the quiz
    const quiz = this.quizRepository.create({
      token: token,
      question_type: 'both', // Define according to the necessary logic
    });
    const savedQuiz = await this.quizRepository.save(quiz);

    // Species data insertion
    const speciesData = jsonData.map((row) => ({
      quiz: savedQuiz,
      scientific_name: row[columnIndex['scientific_name']],
      common_name: row[columnIndex['common_name']],
      image_url: row[columnIndex['image_url']],
      url: row[columnIndex['url']],
      user_login: row[columnIndex['user_login']],
      user_name: row[columnIndex['user_name']],
    }));

    await this.speciesRepository.save(speciesData);
    return {
      success: true,
      message: 'File processed and data inserted successfully.',
    };
  }
}
