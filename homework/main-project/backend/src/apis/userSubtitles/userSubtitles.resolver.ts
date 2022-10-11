import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserSubtitlesInput } from './dto/createUserSubtitles.input';
import { UpdateUserSubtitlesInput } from './dto/updateUserSubtitles.input';
import { UserSubtitles } from './entities/userSubtitles.entity';
import { UserSubtitlesService } from './userSubtitles.service';

@Resolver()
export class UserSubtitlesResolver {
  constructor(private readonly userSubtitlesService: UserSubtitlesService) {}

  @Query(() => [UserSubtitles])
  fetchUserSubtitles() {
    console.log('fetchUserSubtitles');
    // return 'pjh fetchUserSubtitles';
    return this.userSubtitlesService.findAll();
  }

  // @Query(() => [UserSubtitle])
  // fetchUserSubtitlesWithDeleted() {return this.userSubtitlesService.findAllWithDeleted();}

  @Query(() => UserSubtitles)
  fetchUserSubtitle(
    @Args('userSubtitleId') userSubtitleId: string, //
  ) {
    return this.userSubtitlesService.findOne({ userSubtitleId });
  }

  @Mutation(() => UserSubtitles)
  createUserSubtitles(
    @Args('createUserSubtitleInput')
    createUserSubtitleInput: CreateUserSubtitlesInput, //
  ) {
    return this.userSubtitlesService.create(createUserSubtitleInput);
  }

  // 수정과, 삭제시는 민감하게 주의 해야 함.
  // 예를 들어 판매 완료후 가격 수정, 경매 완료후 가격 수정 등등
  // 따라서 이게 삭제,수정이 되는지 확인/검증 후 막야 함.
  @Mutation(() => UserSubtitles)
  async updateUserSubtitles(
    @Args('userSubtitlesId') userSubtitlesId: string,
    @Args('updateUserSubtitlesInput')
    updateUserSubtitlesInput: UpdateUserSubtitlesInput,
  ) {
    // 인자값에 다 객체로 안묶고 따로 id만 빼서
    // 전달하는 이유는 어떤 필드를 골라서 어떤 내용을 수정할지 명확하게 하기 위해서 임.

    // 수정 가능 확인 로직

    // 수정하기: 수정 전 수정 가능 상태인지 검증 후 실행
    return this.userSubtitlesService.update(
      userSubtitlesId,
      updateUserSubtitlesInput,
    );
  }
}
