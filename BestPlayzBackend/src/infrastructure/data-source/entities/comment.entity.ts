import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CommentEntity {
  @PrimaryGeneratedColumn("uuid") //
  public id: string;

  @Column()
  public highscoreId: string;

  @Column()
  public text: string;

  @Column()
  public sender: string; // Was a Client entity in CommentModel. BAD

  @Column()
  public posted: string;
}
