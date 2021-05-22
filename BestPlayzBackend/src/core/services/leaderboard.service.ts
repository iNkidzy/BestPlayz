import { Inject, Injectable } from '@nestjs/common';
import { HighscoreModel } from '../models/highscore.model';
import { ILeaderboardService } from '../primary-ports/leaderboard.service.interface';
import { SharedService } from '../services/shared.service';
import { ISharedService, ISharedServiceProvider } from "../primary-ports/shared.service.interface";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HighscoreEntity } from '../../infrastructure/data-source/entities/highscore.entity';

@Injectable()
export class LeaderboardService implements ILeaderboardService {

  constructor(
    @Inject(ISharedServiceProvider) private sharedService: ISharedService,
    @InjectRepository(HighscoreEntity) private highscoreRepository: Repository<HighscoreEntity>,  // new
  ) {}

  async addHighscore(newHighscore: HighscoreModel): Promise<HighscoreModel> {
    const posted = this.sharedService.generateDateTimeNowString();
    console.log( 'HS model: ', newHighscore.nickname, newHighscore.score, posted);
    let highscore = this.highscoreRepository.create();
    highscore.nickname = newHighscore.nickname; // MUST SUPPLY NICKNAME FROM GAME!!
    highscore.gameId = newHighscore.gameId;
    highscore.score = newHighscore.score;
    highscore.date = posted;
    highscore.time = newHighscore.time;
    highscore = await this.highscoreRepository.save(highscore);
    const addedHighscore = JSON.parse(JSON.stringify(highscore));
    return addedHighscore;
  }

  async getHighScores(): Promise<HighscoreModel[]> {
    const highscoresDB = await this.highscoreRepository.find(); // later find by GameId
    const modelHighscores: HighscoreModel[] = JSON.parse(JSON.stringify(highscoresDB));
    return modelHighscores;
  }
}
