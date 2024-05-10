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
        'Only XLSX, XLS, or CSV files are accepted.',
      );
    }

    // Read the file and parse it as JSON
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

    const quiz = this.quizRepository.create({ token, question_type: 'both' });
    await this.quizRepository.save(quiz);

    const speciesData = jsonData.slice(1).map((row) => {
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
    });

    await this.speciesRepository.save(speciesData);
    return {
      success: true,
      message: 'File processed and data inserted successfully.',
    };
  }
}
