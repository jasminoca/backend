/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get } from '@nestjs/common';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('submit')
  async submitGameScore(@Body() body: any) {
    return this.gamesService.submitGameScore(body);
  }

  @Get()
  async getAllGameScores() {
    const snapshot = await this.gamesService.getAllGameScores();
    return snapshot;
  }

}
