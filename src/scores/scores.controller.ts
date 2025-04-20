/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Param, Body, Patch, Delete, } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { Score } from './scores.entity';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Post()
  create(@Body() score: Score) {
    return this.scoresService.create(score);
  }

  @Get()
  findAll() {
    return this.scoresService.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.scoresService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scoresService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() score: Partial<Score>) {
    return this.scoresService.update(id, score);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scoresService.remove(id);
  }
}
