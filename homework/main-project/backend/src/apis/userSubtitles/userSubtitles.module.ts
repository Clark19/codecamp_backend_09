import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSubtitlesImage } from '../userSubtitlesImages/entities/userSubtitlesImage.entity';
import { YoutubeInfo } from '../youtubeInfo/entities/youtubeInfo.entity';
import { UserSubtitles } from './entities/userSubtitles.entity';
import { UserSubtitlesResolver } from './userSubtitles.resolver';
import { UserSubtitlesService } from './userSubtitles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserSubtitles, //
      YoutubeInfo,
      UserSubtitlesImage,
    ]),
  ],
  providers: [
    UserSubtitlesResolver, //
    UserSubtitlesService,
  ],
})
export class UserSubtitlesModule {}
