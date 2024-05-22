import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quizzes } from './quizzes.entity';
import { Species } from '../species/species.entity';
import { QuestionTypeEnum } from './enum/question-type-enum';
import { StartQuizDto } from './dto/start-quiz-dto';
import { QuestionDto } from '../utils/dto/quesiton-dto';
import { shuffle } from '../utils/quiz.utils';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quizzes)
    private quizRepository: Repository<Quizzes>,
    @InjectRepository(Species)
    private speciesRepository: Repository<Species>,
  ) {}

  async start(dto: StartQuizDto): Promise<any> {
    const quiz = await this.quizRepository
      .createQueryBuilder('quizzes')
      .innerJoinAndSelect('quizzes.species', 'species')
      .where('quizzes.token = :token', { token: dto.token })
      .getOne();

    if (!quiz) {
      console.error('Quiz not found.');
      throw new NotFoundException('Quiz not found.');
    }

    if (!quiz.quantityQuestion) {
      throw new NotFoundException(
        'This Token is flawed. Please re-upload and generate with a new token again.',
      );
    }

    const quizQuantity = quiz.quantityQuestion;
    const quizQuestions = this.generateQuiz(
      quiz.species,
      quizQuantity,
      quiz.questionType,
    );

    return {
      success: true,
      message: 'File processed and data inserted successfully.',
      questions: shuffle(quizQuestions),
    };
  }

  private generateQuiz(
    speciesList: Species[],
    quizQuantity: number,
    questionType: QuestionTypeEnum,
  ): QuestionDto[] {
    const generatedQuestions: Set<string> = new Set();
    const questions: QuestionDto[] = [];

    while (questions.length < quizQuantity) {
      const { correctAnswer, incorrectAnswers } =
        this.generateQuestion(speciesList);

      const questionKey = `${correctAnswer.id}-${incorrectAnswers.map((s) => s.id).join('-')}`;

      // Verifica se a pergunta já foi gerada
      if (!generatedQuestions.has(questionKey)) {
        const answers: string[] = [];
        const correctAnswerDescription = this.getAnswerDescription(
          questionType,
          correctAnswer,
        );

        answers.push(correctAnswerDescription);

        incorrectAnswers.forEach((answer) => {
          answers.push(this.getAnswerDescription(questionType, answer));
        });

        generatedQuestions.add(questionKey);
        questions.push({
          description: this.getQuestionDescription(questionType),
          answers: shuffle(answers),
          imageUrl: correctAnswer.imageUrl,
          url: correctAnswer.url,
          userLogin: correctAnswer.userLogin,
          correctAnswer: correctAnswerDescription,
          license: correctAnswer.license,
        });
      }
    }

    return questions;
  }

  private getQuestionDescription(questionType: number) {
    switch (questionType) {
      case QuestionTypeEnum.SCIENTIFIC:
        return 'What is the correct scientific name?';
      case QuestionTypeEnum.COMMON:
        return 'What is the correct common name?';
      case QuestionTypeEnum.BOTH:
        return 'What is the correct scientific and common name?';
      default:
        throw new NotFoundException('Question type not found.');
    }
  }

  private getAnswerDescription(questionType: number, specie: Species) {
    switch (questionType) {
      case QuestionTypeEnum.SCIENTIFIC:
        return specie.scientificName;
      case QuestionTypeEnum.COMMON:
        return specie.commonName;
      case QuestionTypeEnum.BOTH:
        return `${specie.commonName} (${specie.scientificName})`;
      default:
        throw new NotFoundException('Question type not found.');
    }
  }

  // Função para gerar uma única pergunta
  private generateQuestion(speciesList: Species[]): {
    correctAnswer: Species;
    incorrectAnswers: Species[];
  } {
    // Seleciona uma resposta correta aleatoriamente
    const correctAnswer =
      speciesList[Math.floor(Math.random() * speciesList.length)];

    const incorrectAnswers: Species[] = [];

    // Função auxiliar para adicionar espécies ao incorrectAnswers sem duplicatas
    function addSpecies(attribute: keyof Species, requiredCount: number) {
      const filteredSpecies = speciesList.filter(
        (s) =>
          s !== correctAnswer &&
          s[attribute] === correctAnswer[attribute] &&
          !incorrectAnswers.includes(s),
      );
      const toAdd = filteredSpecies.slice(0, requiredCount);
      incorrectAnswers.push(...toAdd);
    }

    // Passo 1: Adicionar um registro com taxonGenusName
    addSpecies('taxonGenusName', 1);

    // Passo 2: Adicionar registros com taxonFamilyName
    addSpecies('taxonFamilyName', Math.min(2, 2 - incorrectAnswers.length));

    // Passo 3: Adicionar registros com taxonOrderName
    addSpecies('taxonOrderName', Math.min(3, 3 - incorrectAnswers.length));

    // Passo 4: Adicionar registros com taxonClassName
    addSpecies('taxonClassName', Math.min(4, 4 - incorrectAnswers.length));

    // Passo 5: Completar com registros aleatórios se necessário
    if (incorrectAnswers.length < 4) {
      const remainingSpecies = speciesList.filter(
        (s) => s !== correctAnswer && !incorrectAnswers.includes(s),
      );
      const randomSpecies = remainingSpecies
        .sort(() => 0.5 - Math.random())
        .slice(0, 4 - incorrectAnswers.length);
      incorrectAnswers.push(...randomSpecies);
    }

    return { correctAnswer, incorrectAnswers };
  }

  //TODO feature improvement: Generate hard questions (possible future improvements)
  // private generateQuestion(speciesList: Species[]): {
  //   correctAnswer: Species;
  //   incorrectAnswers: Species[];
  // } {
  //   // Seleciona uma resposta correta aleatoriamente
  //   const correctAnswer =
  //     speciesList[Math.floor(Math.random() * speciesList.length)];
  //
  //   const attributeOrder: (keyof Species)[] = [
  //     'taxonGenusName',
  //     'taxonFamilyName',
  //     'taxonOrderName',
  //     'taxonClassName',
  //   ];
  //
  //   const incorrectAnswers: Species[] = [];
  //
  //   for (const attribute of attributeOrder) {
  //     // Filtra as espécies que têm o mesmo valor que a resposta correta para o atributo atual,
  //     // e que ainda não foram adicionadas às respostas erradas
  //     const filteredSpecies = speciesList.filter(
  //       (s) =>
  //         s !== correctAnswer &&
  //         s[attribute] === correctAnswer[attribute] &&
  //         !incorrectAnswers.includes(s),
  //     );
  //
  //     // Adiciona as espécies filtradas às respostas erradas, limitando a 4
  //     incorrectAnswers.push(
  //       ...filteredSpecies.slice(0, 4 - incorrectAnswers.length),
  //     );
  //
  //     // Se já encontramos pelo menos 4 respostas erradas, pare de procurar
  //     if (incorrectAnswers.length >= 4) {
  //       break;
  //     }
  //   }
  //
  //   // Se ainda não temos 4 respostas erradas, adiciona mais qualquer uma
  //   if (incorrectAnswers.length < 4) {
  //     const remainingSpecies = speciesList.filter(
  //       (s) => s !== correctAnswer && !incorrectAnswers.includes(s),
  //     );
  //     incorrectAnswers.push(
  //       ...remainingSpecies.slice(0, 4 - incorrectAnswers.length),
  //     );
  //   }
  //
  //   return { correctAnswer, incorrectAnswers };
  // }
}
