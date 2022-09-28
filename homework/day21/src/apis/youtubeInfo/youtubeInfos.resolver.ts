import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateYoutubeInfoInput } from './dto/createYoutubeInfo.input';
import { UpdateYoutubeInfoInput } from './dto/updateYoutubeInfo.input';
import { YoutubeInfo } from './entities/youtubeInfo.entity';
import { YoutubeInfosService } from './youtubeInfos.service';

@Resolver()
export class YoutubeInfosResolver {
  constructor(
    private readonly youtubeInfosService: YoutubeInfosService, //
  ) {}

  @Query(() => [YoutubeInfo]) // import 주의! @nestjs/graphql 임포트해야함.
  fetchYoutubeInfos() {
    return this.youtubeInfosService.findAll();
  }

  @Query(() => [YoutubeInfo])
  fetchYoutubeInfosWithDeleted() {
    return this.youtubeInfosService.findAllWithDeleted();
  }

  @Query(() => YoutubeInfo)
  fetchYoutubeInfo(
    @Args('youtubeInfoId') youtubeInfoId: string, //
  ) {
    return this.youtubeInfosService.findOne({ youtubeInfoId });
  }

  @Mutation(() => YoutubeInfo)
  createYoutubeInfo(
    @Args('createYoutubeInfoInput')
    createYoutubeInfoInput: CreateYoutubeInfoInput, // 이렇게 하면 아래처럼 하나하나 입력하지 않아도 됨._
  ) {
    return this.youtubeInfosService.create({ createYoutubeInfoInput });
  }

  // 수정과, 삭제시는 민감하게 주의 해야 함.
  // 예를 들어 판매 완료후 가격 수정, 경매 완료후 가격 수정 등등
  // 따라서 이게 삭제,수정이 되는지 확인/검증 후 막야 함.
  @Mutation(() => YoutubeInfo)
  async updateYoutubeInfo(
    @Args('youtubeInfoId') youtubeInfoId: string,
    @Args('updateYoutubeInfoInput')
    updateYoutubeInfoInput: UpdateYoutubeInfoInput,
  ) {
    // 인자값에 다 객체로 안묶고 따로 id만 빼서
    // 전달하는 이유는 어떤 필드를 골라서 어떤 내용을 수정할지 명확하게 하기 위해서 임.

    // 수정 가능 확인 로직
    await this.youtubeInfosService.checkEditable({ youtubeInfoId });

    // 수정하기: 수정 전 수정 가능 상태인지 검증 후 실행
    return this.youtubeInfosService.update({
      youtubeInfoId,
      updateYoutubeInfoInput,
    });
  }

  @Mutation(() => Boolean)
  deleteYoutubeInfo(
    @Args('youtubeInfoId') youtubeInfoId: string, //
  ) {
    return this.youtubeInfosService.delete({ youtubeInfoId });
  }

  @Mutation(() => Boolean)
  restoreYoutubeInfo(
    @Args('youtubeInfoId') youtubeInfoId: string, //
  ) {
    return this.youtubeInfosService.restore({ youtubeInfoId });
  }
}
