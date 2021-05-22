import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class HighscoreEntity {
  @PrimaryGeneratedColumn("uuid") //
  public id: string;

  @Column()
  public nickname: string;

  @Column()
  public gameId: string;

  @Column()
  public score: number;  // no double... has decimals??


  @Column()
  public date: string;


  @Column()
  public time: number;
}
