import { Injectable } from '@angular/core';
import {CommentDto} from '../../comment/shared/comment.dto';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {CommentModel} from '../../comment/shared/comment.model';
import {HighscoreModel} from './highscore.model';
import {HighscoreDto} from './highscore.dto';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  constructor(private socket: Socket, private router: Router) { }

  postHighScore(highscoreDto: HighscoreDto): void {
    console.log('highscore posted = ', highscoreDto);
    this.socket.emit('postHighscore', highscoreDto);
  }

  listenForNewHighscore(): Observable<HighscoreModel> {
    return this.socket
      .fromEvent<HighscoreModel>('newHighscore');
  }

  requestGameHighscores(gameId: number): void {
    console.log('requestGameHighScore called');
    this.socket.emit('requestGameHighscores', gameId);
  }

  listenForGameHighscores(): Observable<HighscoreModel[]> {  // Dto??
    return this.socket
      .fromEvent<HighscoreModel[]>('gameHighscores');
  }

  sendSelectedHighscore(selectedHighscore: HighscoreDto): void {
    console.log('requestGameHighScore called');
    console.log('DTO: ', selectedHighscore.id, selectedHighscore.nickname, selectedHighscore.gameId, selectedHighscore.score, selectedHighscore.date, selectedHighscore.time);

    this.socket.emit('highscoreDtoFromLeaderboard', selectedHighscore); // obsolete?
    // CHANGE ROUTE TO COMMENT HERE ???
    console.log('Navigate to Comment url');
    this.router.navigate(['/comment'], {state: {data: selectedHighscore}}); // {data: {selectedHighscore}}});
  }

  listenForErrors(): Observable<string> {
    return this.socket
      .fromEvent<string>('error');
  }

  disconnect(): void{
    this.socket.disconnect();
  }

  connect(): void{
    this.socket.connect();
  }
}
