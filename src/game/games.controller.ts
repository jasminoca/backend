/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('submit')
  async submitGameScore(@Body() body: any) {
    return this.gamesService.submitGameScore(body);
  }
}
