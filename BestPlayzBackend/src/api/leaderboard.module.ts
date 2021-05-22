import { Module } from '@nestjs/common';
import { LeaderboardGateway } from './gateways/leaderboard.gateway';
import { LeaderboardService } from '../core/services/leaderboard.service';
import { ILeaderboardServiceProvider } from '../core/primary-ports/leaderboard.service.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedService } from '../core/services/shared.service';
import { ISharedServiceProvider } from '../core/primary-ports/shared.service.interface';
import { HighscoreEntity } from '../infrastructure/data-source/entities/highscore.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([HighscoreEntity]),
    SharedService,
  ],
  providers: [
    LeaderboardGateway,
    {
      provide: ILeaderboardServiceProvider,
      useClass: LeaderboardService,
    },
    { // Is this needed??. Not used in GW
      provide: ISharedServiceProvider,
      useClass: SharedService,
    },
  ],
})
export class LeaderboardModule {}
