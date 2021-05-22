import { Module } from '@nestjs/common';
import { CommentGateway } from './gateways/comment.gateway';
import { CommentService } from '../core/services/comment.service';
import { ICommentServiceProvider } from '../core/primary-ports/comment.service.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from '../infrastructure/data-source/entities/comment.entity';
import { ClientEntity } from '../infrastructure/data-source/entities/client.entity';
import { ISharedServiceProvider } from '../core/primary-ports/shared.service.interface';
import { SharedService } from '../core/services/shared.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, ClientEntity]),
    SharedService,
  ],
  providers: [
    CommentGateway,
    {
      provide: ICommentServiceProvider,
      useClass: CommentService,
    },
    {
      // Is this needed??. Not used in GW
      provide: ISharedServiceProvider,
      useClass: SharedService,
    }, //
  ],
})
export class CommentModule {}
