import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserYtSubtitle } from './entities/userYtSubtitle.entity';
import { UserYtSubtitlesResolver } from './userYtSubtitles.resolver';
import { UserYtSubtitlesService } from './userYtSubtitles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserYtSubtitle, //
    ]),
  ],
  providers: [
    UserYtSubtitlesResolver, //
    UserYtSubtitlesService,
  ],
})
export class UserYtSubtitlesModule {}
