import { Injectable } from '@nestjs/common';
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
      return {
        success: false,
        message: 'Invalid file type. Upload XLSX, XLS, or CSV files only.',
      };
    }

    // Leitura do arquivo e extração dos dados
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Verificação das colunas necessárias
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

    // Mapeamento dos índices das colunas para extração dos dados
    const columnIndex = headers.reduce((acc, col, index) => {
      acc[col] = index;
      return acc;
    }, {});

    // Remoção do cabeçalho
    jsonData.shift();

    // Criação do quiz
    const quiz = this.quizRepository.create({
      token: token,
      question_type: 'both', // Definir de acordo com a lógica necessária
    });
    const savedQuiz = await this.quizRepository.save(quiz);

    // Inserção dos dados de espécies
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
