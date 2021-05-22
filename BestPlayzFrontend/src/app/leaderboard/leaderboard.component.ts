import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {LeaderboardService} from './shared/leaderboard.service';
import {CommentModel} from '../comment/shared/comment.model';
import {take, takeUntil} from 'rxjs/operators';
import {Observable, Subject, Subscription} from 'rxjs';
import {HighscoreModel} from './shared/highscore.model';
import {CommentDto} from '../comment/shared/comment.dto';
import {StorageService} from '../shared/storage.service';
import {HighscoreDto} from './shared/highscore.dto';
import {ClientModel} from '../comment/shared/client.model';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit, OnDestroy {
  highscoreFC = new FormControl('');
  highscores: HighscoreModel[] = [];
  unsubscribe$ = new Subject();
  gameId = 1;  // MOCK
  error$: Observable<string> | undefined; // move to app.component for global errors
  socketId: string | undefined;
  isLoggedIn = localStorage.length;
  userNickname: string | undefined;
  highscoreSelected = '';
  chosenHighscore: HighscoreModel | undefined;
  selectedGame = 'Super Ninja Dude'; // MOCK

  constructor(private leaderboardService: LeaderboardService,
              private storageService: StorageService) { }

  ngOnInit(): void {
    console.log('Leaderboard Component Initialised');
    this.userNickname = this.storageService.loadClient()?.nickname;

    this.leaderboardService.requestGameHighscores(this.gameId) // MOCK gameId
    this.error$ = this.leaderboardService.listenForErrors(); // move to app.component for global errors
    this.leaderboardService.listenForNewHighscore()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(highscore => {
        console.log('highscore received');
        this.highscores.push(highscore);
      });
    this.leaderboardService.listenForGameHighscores() // MOCK gameId
      .pipe(
        take(1)
      )
      .subscribe(highscores => {
        console.log(highscores.length, ' highscores received');
        this.highscores = highscores;
      });
    this.leaderboardService.connect(); // MUY IMPORTANTE!!
  }

  postHighscore(): void {
    console.log('dto nickname: ', this.storageService.loadClient()?.nickname);
    // loggedInUser = this.storageService.loadCommentClient();
    if (this.storageService.loadClient()?.nickname) {
      if (this.highscoreFC.value) {
        const highscoreDto: HighscoreDto = {
          nickname: this.storageService.loadClient()?.nickname,
          gameId: 'c817554b-6a1c-4408-a749-a5650fe92798',  // MOCK in uuid format !!!
          score: this.highscoreFC.value,
          time: 123, // MOCK
        };
        this.leaderboardService.postHighScore(highscoreDto);
        this.highscoreFC.patchValue('');
      }
    }
  }

  ngOnDestroy(): void {
    console.log('Leaderboard Component Destroyed');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.leaderboardService.disconnect();
  }

  onNgModelChange($event: any): any {
    if (this.highscoreSelected.length !== 0)
    {
      const highscoreId = this.highscoreSelected[0].toString();
      this.chosenHighscore = this.highscores.find(uh => uh.id === highscoreId);
      if (this.chosenHighscore) {
        console.log('onNgModelChange = ', this.chosenHighscore.id, this.chosenHighscore.score, this.chosenHighscore.nickname);
        // GO TO COMMENT ROUTE HERE and pass chosenHighscore.id into  @SubscribeMessage('requestHighscoreComments') in backend
        const selectedHighscore: HighscoreModel = {
          id: this.chosenHighscore.id,
          nickname: this.chosenHighscore.nickname,
          gameId: this.chosenHighscore.gameId,
          score: this.chosenHighscore.score,  // no double... has decimals??
          date: this.chosenHighscore.date,
          time: this.chosenHighscore.time,
        };
        this.leaderboardService.sendSelectedHighscore(selectedHighscore);
      } else {
        console.log('error - no highscore with that name found');
      }
    }
  }
}
