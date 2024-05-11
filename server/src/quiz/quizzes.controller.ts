import { Body, Controller, Get } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { StartQuizDto } from './dto/start-quiz-dto';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get()
  async start(@Body() dto: StartQuizDto) {
    const result = await this.quizzesService.start(dto);
    return result;
  }
}
