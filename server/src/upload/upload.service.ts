import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Quizzes } from '../quiz/quizzes.entity';
import { Species } from '../species/species.entity';
import { UpdateQuizDto } from '../quiz/dto/update-quiz-dto';
import { getFileData, validateFile } from '../utils/file.utils';

@Injectable()
export class UploadService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    @InjectRepository(Quizzes)
    private quizRepository: Repository<Quizzes>,
    @InjectRepository(Species)
    private speciesRepository: Repository<Species>,
  ) {}

  async handleFile(file: Express.Multer.File, token: string): Promise<any> {
    validateFile(file, token);

    const quizExists = await this.quizRepository.findOneBy({ token });

    if (quizExists) {
      console.error("There's already a quiz with this token.");
      throw new BadRequestException("There's already a quiz with this token.");
    }

    const { indexMap, jsonData } = await getFileData(file);

    let quiz;

    await this.entityManager.transaction(async (transactionManager) => {
      quiz = await transactionManager.getRepository(Quizzes).save({
        token: token,
      });

      const speciesData = jsonData
        .slice(1)
        .map((row) => {
          const userLogin = row[indexMap['user_login']];
          const license = row[indexMap['license']];
          const url = row[indexMap['url']];
          const imageUrl = row[indexMap['image_url']];
          const scientificName = row[indexMap['scientific_name']];
          const commonName = row[indexMap['common_name']];
          const taxonClassName = row[indexMap['taxon_class_name']];
          const taxonOrderName = row[indexMap['taxon_order_name']];
          const taxonFamilyName = row[indexMap['taxon_family_name']];
          const taxonGenusName = row[indexMap['taxon_genus_name']];
          const taxonSpeciesName = row[indexMap['taxon_species_name']];

          if (
            userLogin &&
            userLogin.trim() &&
            license &&
            license.trim() &&
            url &&
            url.trim() &&
            imageUrl &&
            imageUrl.trim() &&
            scientificName &&
            scientificName.trim() &&
            commonName &&
            commonName.trim() &&
            taxonClassName &&
            taxonClassName.trim() &&
            taxonOrderName &&
            taxonOrderName.trim() &&
            taxonFamilyName &&
            taxonFamilyName.trim() &&
            taxonGenusName &&
            taxonGenusName.trim() &&
            taxonSpeciesName &&
            taxonSpeciesName.trim()
          ) {
            return {
              userLogin,
              license,
              url,
              imageUrl,
              scientificName,
              commonName,
              taxonClassName,
              taxonOrderName,
              taxonFamilyName,
              taxonGenusName,
              taxonSpeciesName,
            };
          }
        })
        .filter(Boolean);

      await transactionManager.getRepository(Species).save(speciesData);
    });

    //TODO create a logic to set maxQuestion
    const maxQuestion = 10;

    return {
      success: true,
      message: 'File processed and data inserted successfully.',
      maxQuestion,
      idQuiz: quiz.id,
    };
  }

  async update(idQuiz: number, data: UpdateQuizDto) {
    await this.quizRepository.update(idQuiz, {
      quantityQuestion: data.quantityQuestion,
      questionType: data.questionType,
    });

    return {
      success: true,
      message: 'Data updated successfully.',
    };
  }
}
