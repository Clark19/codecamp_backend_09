import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserYtSubtitle } from './entities/userYtSubtitle.entity';
import { UserYtSubtitlesService } from './userYtSubtitles.service';

@Resolver()
export class UserYtSubtitlesResolver {
  constructor(
    private readonly userYtSubtitlesService: UserYtSubtitlesService,
  ) {}

  @Mutation(() => UserYtSubtitle)
  createUserYtSubtitle(
    @Args('url') url: string, //
  ) {
    return this.userYtSubtitlesService.create({ url });
  }
}
