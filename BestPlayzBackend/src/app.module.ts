import { Module } from '@nestjs/common';
import { CommentModule } from './api/comment.module';
import { CommentService } from './core/services/comment.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/data-source/postgres/database.module';
import { LeaderboardModule } from './api/leaderboard.module';
import { LeaderboardService } from './core/services/leaderboard.service';
import * as Joi from '@hapi/joi';
import { SharedService } from './core/services/shared.service';

@Module({
  imports: [
    LeaderboardModule,
    CommentModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    DatabaseModule,
  ],
  controllers: [],
  providers: [
    // CommentService,  // NOT needed - kills DI!
    // LeaderboardService,  // NOT needed - kills DI!
    SharedService, // needed??
  ],
})
export class AppModule {}
