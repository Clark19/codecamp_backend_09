import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateYoutubeInfoInput } from './dto/createYoutubeInfo.input';
import { UpdateYoutubeInfoInput } from './dto/updateYoutubeInfo.input';
import { YoutubeInfo } from './entities/youtubeInfo.entity';
import { YoutubeInfosService } from './youtubeInfos.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Cache, CachingConfig } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';

interface IYoutubeInfoES {
  '@timestamp': string;
  '@version': string;

  id: string;
  title: string;
  url: string;
  subtitlesen: string;
  subtitlesko: string;
  subtitleswithtime: string;
  categoryid: string;
  iseditable: number;
  updatedat: number;
}

@Resolver()
export class YoutubeInfosResolver {
  constructor(
    private readonly youtubeInfosService: YoutubeInfosService, //
    private readonly elasticsearchService: ElasticsearchService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Query(() => [YoutubeInfo]) // import 주의! @nestjs/graphql 임포트해야함.
  async fetchYoutubeInfos(
    @Args({
      name: 'search',
      type: () => String,
      nullable: true,
      defaultValue: '',
    })
    search: string,
  ) {
    if (!search) {
      // 데이터가 많을때 모든 데이터를 리턴하는건  말이 안될수 있으므로,
      // 추후 페이징 처리나 limit 처리를 해야함.
      return this.youtubeInfosService.findAll();
    }

    // get Redis data
    const searchResultInCache: string = await this.cacheManager.get(
      `${search}`,
    );
    if (searchResultInCache) {
      console.log('레디스에서 조회 완료!!');
      // console.log('searchResult In 레디스:', JSON.parse(searchResultInCache));
      return JSON.parse(searchResultInCache);
    }

    const searchResultInES = await this.searchInES(search);
    if (searchResultInES) {
      // set Redis data
      const isSavedInRedis = await this.cacheManager.set(
        `${search}`,
        JSON.stringify(searchResultInES),
        { ttl: 62 },
      );
      console.log('레디스에 저장 완료:', isSavedInRedis);

      return searchResultInES;
    }

    return this.youtubeInfosService.findAllByWord(search);
  }

  /** 엘라스틱서치에서 조회 */
  async searchInES(search: string) {
    /* 
        GET _search
        {
          "query": {
            "match_all": {}
          }
        }
    */

    let esResults = null;
    esResults = await this.elasticsearchService.search({
      index: 'myyoutubeinfo', // ES에서 index란 데이터베이스==테이블(Type) == 컬렉션 명
      sort: ['_score', 'updatedat'],
      query: {
        multi_match: {
          query: search,
          fields: ['title^3', 'subtitlesen', 'subtitlesko'],
        },
      },
    });

    esResults = esResults?.hits?.hits?.map((el) => {
      const {
        id,
        title,
        url,
        subtitlesen: subtitlesEn,
        subtitlesko: subtitlesKo,
        subtitleswithtime: subtitlesWithTime,
        categoryid: categoryId,
        iseditable: isEditable,
        updatedat: updatedAt,
        ..._
      } = el._source as IYoutubeInfoES;

      return {
        id,
        title,
        url,
        subtitlesEn,
        subtitlesKo,
        subtitlesWithTime,
        category: { id: categoryId, name: '' },
        isEditable,
        updatedAt,
      };
    });
    // console.log('ES: searchResultInES:', esResults);
    console.log('엘라스틱서치에서 조회 완료!!');
    return esResults;
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
  async createYoutubeInfo(
    @Args('createYoutubeInfoInput')
    createYoutubeInfoInput: CreateYoutubeInfoInput, // 이렇게 하면 아래처럼 하나하나 입력하지 않아도 됨.
  ) {
    const youtubeInfoSavedInDB = await this.youtubeInfosService.create({
      createYoutubeInfoInput,
    });

    // 엘라스틱서치에 데이터 등록하는 예제
    // => 실제로 백엔드에서 ES에 저장하는 경우는 거의 없고(크롤링을 할때 사용하나?),
    // DBMS에 저장하고 Logstash로 polling방식으로 ES에 저장하는 경우가 많음.
    // this.elasticsearchService.create({
    //   // 최초 인덱스, 매핑 생성용
    //   id: 'myid',
    //   index: 'myyoutubeinfo',
    //   document: {
    //     title: '동영상 네스트 nestjs',
    //     url: 'https://www.youtube.com/watch?v=ZmfDlUAokYc',
    //     subtitlesEn: 'eng nestjs caption',
    //     subtitlesKo: '한국어 네스트 자막',
    //     ...createYoutubeInfoInput,
    //   },
    // });

    return youtubeInfoSavedInDB;
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

    await this.deleteEsObj(youtubeInfoId, updateYoutubeInfoInput);

    // 수정하기: 수정 전 수정 가능 상태인지 검증 후 실행
    return this.youtubeInfosService.update({
      youtubeInfoId,
      updateYoutubeInfoInput,
    });
  }

  /** logstash에서 DB 데이터 row 변경되면 기존 데이터 있더라도 중복으로
   * 데이터 쌓기때문에 nestjs단에서 삭제해줘야 이전 데이터 남지 않음.
   * es내 데이터 업데이트 해봐야, logstash에서 업데이터 시간 기준으로 동일 데이터가 또 가져다 쌓을 뿐이므로 삭제해야 함.
   *
   * es내 데이터 업데이트하고 결과 리턴전에 중복을 제거후 이전 데이터를 삭제할까?
   */
  private async deleteEsObj(
    youtubeInfoId: string,
    updateYoutubeInfoInput: UpdateYoutubeInfoInput,
  ) {
    const foundES = await this.elasticsearchService.search({
      index: 'myyoutubeinfo',
      query: {
        match: {
          id: youtubeInfoId,
        },
      },
    });
    // console.log('foundES:', foundES);
    const esYoutubeInfo = foundES.hits.hits[0];

    await this.elasticsearchService.delete({
      index: 'myyoutubeinfo',
      id: esYoutubeInfo._id,
    });

    // await this.elasticsearchService.update({
    //   index: 'myyoutubeinfo',
    //   id: esYoutubeInfo._id,
    //   body: {
    //     doc: {
    //       ...(esYoutubeInfo._source as IYoutubeInfoES),
    //       ...updateYoutubeInfoInput,
    //     },
    //   },
    // });
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
