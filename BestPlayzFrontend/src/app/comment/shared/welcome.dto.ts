import { ClientModel} from './client.model';
import { CommentModel} from './comment.model';

export interface WelcomeDto {
  clients: ClientModel[];
  client: ClientModel;
  comments: CommentModel[];
}
