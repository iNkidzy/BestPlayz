import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaderboardRoutingModule } from './leaderboard-routing.module';
import { LeaderboardComponent } from './leaderboard.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';


@NgModule({
  declarations: [
    LeaderboardComponent
  ],
  imports: [
    CommonModule,
    LeaderboardRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class LeaderboardModule { }
