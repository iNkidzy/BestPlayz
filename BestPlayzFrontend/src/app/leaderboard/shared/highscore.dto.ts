export interface HighscoreDto {
  id?: string;
  nickname?: string;
  gameId: string;
  score: number;  // no double... has decimals??
  date?: string;
  time: number;
}

