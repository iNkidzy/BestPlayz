import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientEntity } from '../entities/client.entity';
import { CommentEntity } from '../entities/comment.entity';
import { HighscoreEntity } from '../entities/highscore.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [ClientEntity, CommentEntity, HighscoreEntity],
        synchronize: true, //true for DEV, but deletes data if DB is shutdown, // false for PRODUCTION
        /*ssl: true, // New from Lars
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        }, // */
      }),
    }),
  ],
})
export class DatabaseModule {}
