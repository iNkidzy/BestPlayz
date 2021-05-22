import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'comment', loadChildren: () => import('./comment/comment.module').then(m => m.CommentModule) },
  { path: 'leaderboard', loadChildren: () => import('./leaderboard/leaderboard.module').then(m => m.LeaderboardModule) }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
