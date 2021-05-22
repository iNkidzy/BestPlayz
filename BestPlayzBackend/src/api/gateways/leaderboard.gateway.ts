import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { LeaderboardService } from '../../core/services/leaderboard.service';
import {
  ILeaderboardService,
  ILeaderboardServiceProvider,
} from '../../core/primary-ports/leaderboard.service.interface';
import { HighscoreDto } from '../dtos/highscore.dto';
import { HighscoreModel } from '../../core/models/highscore.model';

@WebSocketGateway()
export class LeaderboardGateway {
  constructor(
    @Inject(ILeaderboardServiceProvider)
    private leaderboardService: ILeaderboardService,
  ) {}
  @WebSocketServer() server;

  @SubscribeMessage('postHighscore')
  async handlePostHighscoreEvent(
    @MessageBody() highscoreDto: HighscoreDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const highscore: HighscoreModel = JSON.parse(
        JSON.stringify(highscoreDto),
      );
      console.log('HighscoreDto  = ' + highscoreDto);
      console.log('HighscoreModel  = ' + highscore);
      const newHighscore = await this.leaderboardService.addHighscore(
        highscore,
      );
      this.server.emit('newHighscore', newHighscore);
    } catch (e) {
      client.error(e.message);
    }
  }

  @SubscribeMessage('requestGameHighscores')
  async handleGetGameHighscoresEvent(
    @MessageBody() gameId: number,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    console.log('handleGetGameHighscoresEvent called');
    try {
      const gameHighscores: HighscoreModel[] = await this.leaderboardService.getHighScores(); // put gameId in here
      console.log(gameHighscores.length, ' gameHighscores found ');
      this.server.emit('gameHighscores', gameHighscores);
    } catch (e) {
      client.error(e.message);
    }
  }

  handleConnect(client: Socket, ...args: any[]): any { // Promise<any> { // DELETABLE METHOD ??
    console.log('Leaderboard Client Connect', client.id);
    client.emit('gameHighscores', this.leaderboardService.getHighScores());
    // this.server.emit('clients', await this.commentService.getClients());
  }

  async handleDisconnect(client: Socket): Promise<any> { // DELETABLE METHOD ??
    console.log('Leaderboard Client Disconnect', client.id);
    //  await this.commentService.deleteClient(client.id);
    // this.server.emit('clients', await this.commentService.getClients());
  }
}
