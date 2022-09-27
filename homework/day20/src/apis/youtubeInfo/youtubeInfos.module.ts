import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { User } from '../users/entities/user.entity';
import { YoutubeInfo } from './entities/youtubeInfo.entity';
import { YoutubeInfosResolver } from './youtubeInfos.resolver';
import { YoutubeInfosService } from './youtubeInfos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      YoutubeInfo, //
      Category,
      User,
    ]),
  ],
  providers: [
    YoutubeInfosResolver, //
    YoutubeInfosService,
  ],
})
export class YoutubeInfosModule {}
