import { Inject, Injectable } from '@nestjs/common';
import { ClientModel } from '../models/client.model';
import { CommentModel } from '../models/comment.model';
import { ICommentService, ICommentServiceProvider } from "../primary-ports/comment.service.interface";
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '../../infrastructure/data-source/entities/comment.entity';
import { Repository } from 'typeorm';
import { ClientEntity } from '../../infrastructure/data-source/entities/client.entity';
import { SharedService } from '../services/shared.service';
import { ISharedService, ISharedServiceProvider } from "../primary-ports/shared.service.interface";
import { HighscoreModel } from '../models/highscore.model';

@Injectable()
export class CommentService implements ICommentService {
  currentHighscore: HighscoreModel = null;

  constructor(
    @Inject(ISharedServiceProvider) private sharedService: ISharedService,
    @InjectRepository(CommentEntity) private commentRepository: Repository<CommentEntity>,
    @InjectRepository(ClientEntity) private clientRepository: Repository<ClientEntity>,
  ) {}

  async addComment(newComment: CommentModel): Promise<CommentModel> {
    const sentAt = this.sharedService.generateDateTimeNowString();
    const clientDB = await this.clientRepository.findOne({ nickname: newComment.sender});
    if (!clientDB) {
      console.log('added comment client NOT FOUND !!');
    } else {
      console.log( 'added comment client found - id:' + clientDB.id + '  nickname: ' + clientDB.nickname);
      console.log( 'ADD commentthis.currentHighscore.id= ', this.currentHighscore.id);

      let comment = this.commentRepository.create();
      comment.highscoreId = newComment.highscoreId; // FIXED PROB!!
      comment.text = newComment.text;
      comment.sender = clientDB.nickname;
      comment.posted = sentAt;
      comment = await this.commentRepository.save(comment);
      const addedComment = JSON.parse(JSON.stringify(comment));
      return addedComment;
    }
  }

  async getComments(highscore: HighscoreModel): Promise<CommentModel[]> {
    this.currentHighscore = highscore; // NEW!!!
    console.log('this.currentHighscore= ', this.currentHighscore);
    if (highscore != undefined || null) {
      const commentsDB = await this.commentRepository.find({
        where: { highscoreId: highscore.id },
      });
        const highscoreComments: CommentModel[] = JSON.parse(JSON.stringify(commentsDB));
        console.log('modelComments = ', highscoreComments);
        return highscoreComments;
      } else {
      try {
        const emptyComments: CommentModel[] = [];
        const warningComment: CommentModel = {
          id: 'c4badc0b-f47f-45a8-a217-1443ce4c6103',
          highscoreId: 'No highscore selected',
          text: 'Please select a Highscore to view its comments',
          sender: 'Admin',
          posted: '',
        };
        emptyComments.push(warningComment);
        return emptyComments;
      } catch (e) {
        Error(e.message);
      }
    }
  }

  async addClient(commentClient: ClientModel): Promise<ClientModel> {
    const clientFoundById = await this.clientRepository.findOne({ id: commentClient.id});
    if (clientFoundById) {
      return JSON.parse(JSON.stringify(clientFoundById));
    }
    const clientFoundByNickname = await this.clientRepository.findOne({ nickname: commentClient.nickname});
    if (clientFoundByNickname) {
      throw new Error(' Nickname already used');
    }
    let client = this.clientRepository.create();
    client.nickname = commentClient.nickname;
    client = await this.clientRepository.save(client);
    const newClient = JSON.parse(JSON.stringify(client));
    return newClient; // maybe
  }

  async getClients(): Promise<ClientModel[]> {
    const clients = await this.clientRepository.find();
    const allClients: ClientModel[] = JSON.parse(JSON.stringify(clients));
    return allClients;
  }

  async deleteClient(id: string): Promise<void> {
    await this.clientRepository.delete({ id: id });
  }

  getCurrentHighscore(): HighscoreModel {
    console.log('currentHighscore = ', this.currentHighscore);
    return this.currentHighscore;
  }
}
