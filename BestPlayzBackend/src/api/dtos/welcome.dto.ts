import { ClientModel } from '../../core/models/client.model';
import { CommentModel } from '../../core/models/comment.model';

export interface WelcomeDto {
  clients: ClientModel[];
  client: ClientModel;
  comments: CommentModel[];
}
