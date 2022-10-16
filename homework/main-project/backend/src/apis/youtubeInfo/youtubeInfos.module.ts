import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { User } from '../users/entities/user.entity';
import { YoutubeInfo } from './entities/youtubeInfo.entity';
import { YoutubeInfosResolver } from './youtubeInfos.resolver';
import { YoutubeInfosService } from './youtubeInfos.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      YoutubeInfo, //
      Category,
      User,
    ]),
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
  ],
  providers: [
    YoutubeInfosResolver, //
    YoutubeInfosService,
  ],
})
export class YoutubeInfosModule {}
