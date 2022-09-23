import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YoutubeInfo } from './entities/youtubeInfo.entity';
import { YoutubeInfosResolver } from './youtubeInfos.resolver';
import { YoutubeInfosService } from './youtubeInfos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      YoutubeInfo, //
    ]),
  ],
  providers: [
    YoutubeInfosResolver, //
    YoutubeInfosService,
  ],
})
export class YoutubeInfosModule {}
