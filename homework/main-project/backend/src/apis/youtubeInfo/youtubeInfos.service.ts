import {
  HttpException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { YoutubeInfo } from './entities/youtubeInfo.entity';
import { Category } from '../categories/entities/category.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class YoutubeInfosService {
  constructor(
    @InjectRepository(YoutubeInfo)
    private readonly youtubeInfosRepository: Repository<YoutubeInfo>,

    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll() {
    // const result = await this.youtubeInfosRepository.find();
    const result = await this.youtubeInfosRepository.find({
      relations: ['category', 'users'],
    });

    // 추가 작업 2 코딩 할땐 위처럼 async, await 써야 함.
    // 그냥 아래처럼 리턴 할거면 async, await 안써도 됨. 알아서 기달렸다가 resolver 쪽에서 리턴 한다는 식으로 말하셨음.
    // return await this.productsRepository.find();

    return result;
  }

  async findAllByWord(word) {
    // 멀티 컬럼에서 검색 쿼리로 변경 해야 함
    const result = await this.youtubeInfosRepository.find({
      where: { title: word },
      relations: ['category', 'users'],
    });

    return result;
  }

  async findAllWithDeleted() {
    const result = await this.youtubeInfosRepository.find({
      relations: ['category', 'users'],
      withDeleted: true,
    });

    return result;
  }

  findOne({ youtubeInfoId }) {
    return this.youtubeInfosRepository.findOne({
      where: { id: youtubeInfoId },
      relations: ['category', 'users'],
    });
  }

  subtitlesWithTimeJson = `
  [
    {
      start: '0.399',
      dur: '3.441',
      text: 'hello guys and welcome my name is vlad'
    },
    { start: '2.879', dur: '3.681', text: 'in this tutorial' },
    {
      start: '3.84',
      dur: '3.2',
      text: 'we are going to learn how to use locking'
    },
    { start: '6.56', dur: '3.6', text: 'in' },
    {
      start: '7.04',
      dur: '6',
      text: 'sgs so you might want to use logging'
    },
    {
      start: '10.16',
      dur: '3.76',
      text: 'at two different levels one is inside'
    },
    { start: '13.04', dur: '2.719', text: 'your app' },
    {
      start: '13.92',
      dur: '3.439',
      text: 'inside your services inside your'
    },
    { start: '15.759', dur: '4.641', text: 'business logic' },
    {
      start: '17.359',
      dur: '4.161',
      text: 'for instance to log any arbitrary value'
    }
  ]
  `;

  async create({ createYoutubeInfoInput }) {
    // const result = this.youtubeInfosRepository.save({
    //   ...createYoutubeInfoInput,
    //   subtitlesWithTime: JSON.stringify(this.subtitlesWithTimeJson),
    // });

    const { categoryId, userId, ...youtubeInfoInput } = createYoutubeInfoInput;

    const youtubeInfo = await this.youtubeInfosRepository.findOne({
      where: { url: youtubeInfoInput.url },
      relations: ['category', 'users'],
    });

    const categoryResult = await this.categoriesRepository.findOne({
      where: { id: categoryId },
    });

    // const userResult = await this.usersRepository.findOne({
    //   where: { id: userId },
    // });
    const usersResult = await this.usersRepository.find({
      where: { id: userId },
    });
    console.log(4, 'userResult', usersResult);

    let result = null;
    if (youtubeInfo) {
      console.log('유튜 정보 있을때', youtubeInfo);
      // delete in elasticsearchService

      // update
      // 1. user 연결 정보 있을때
      //   1.1 category, 자막등 들어와서 업데이트
      //   1.2 없을때
      if (userId) {
        // 유저 아이디가 클라이언트로 부터 전달됐을때
        result = await this.youtubeInfosRepository.save({
          ...youtubeInfo,
          id: youtubeInfo.id, // id 프라퍼티 있어야 업데이트임, 없으면 create
          ...youtubeInfoInput,
          category: categoryResult,
          users: usersResult,
        });
      } else {
        result = await this.youtubeInfosRepository.save({
          ...youtubeInfo,
          id: youtubeInfo.id, // id 프라퍼티 있어야 업데이트임, 없으면 create
          ...youtubeInfoInput,
          category: categoryResult,
        });
      }
    } else {
      console.log('유튜 정보 없을때', youtubeInfo);
      result = await this.youtubeInfosRepository.save({
        ...youtubeInfoInput,
        subtitlesWithTime: JSON.stringify(this.subtitlesWithTimeJson),
        category: categoryId ? { id: categoryId } : null,
        users: userId ? usersResult : null,
      });
    }
    console.log(5);

    // return { ...result, category: categoryResult, users: [userResult] }; // {id: uuid, name: '마우스', description: '좋은 마우스', price: 3000}
    return result;
  }

  async update({ youtubeInfoId, updateYoutubeInfoInput }) {
    // save()는 insert, update 둘다 가능하고, 만든 엔티티 결과를 받음
    // this.productsRepository.create(); // 등록을 위한 빈 객체 만들기이므로 주의. .save() 랑 착각 금지
    // this.productsRepository.insert(); //결과는 못 받는 등록 방법
    // this.productsRepository.update(); // 결과 못 받는 수정 방법

    // 수정 후 수정되지 않은 다른 결과 값까지 fe에서 모두 받고 싶을 때 사용
    const myyoutubeInfo = await this.youtubeInfosRepository.findOne({
      where: { id: youtubeInfoId },
    });

    // .save({ ... })시 id가 있으면 update, 없으면 create
    // 기존에 있던 내용 추가 안해주면 업데이트 된 필드만 담겨 리턴받고 프론트엔드도 그것만 받게된다. 따라서 프론트엔드에서 정보가 더 필요하면 fetchProduct를 다시 호출해야 한다. 그렇게 안하게 하려면 백엔드에서 알아서 조회해서 모든 정보 다 채워서 넣는 방법이 있다. 프론트엔드와 협의 하기 나름 또는  회사/팀 정책에 따라 어찌 구현할지 달라진다.
    const result = this.youtubeInfosRepository.save({
      ...myyoutubeInfo, // 기존 정보 추가 해주기
      id: youtubeInfoId,
      ...updateYoutubeInfoInput,
      // name: '키보드',
      // description: '좋은 키보드',
      // price: 2000,
    });

    return result;
  }

  async checkEditable({ youtubeInfoId }) {
    // 모든 통신, 디비 호출에 try catch 지저분하게 하기 힘드니
    // nestjs에서 HttpExceptionFilter 로 한번에 처리하게 가능.
    const youtubeInfo = await this.youtubeInfosRepository.findOne({
      where: { id: youtubeInfoId },
    });

    /*
  에러란: const qqq: string = 3;
  버그란: 잘실행 작동되는듯하지만 의도하지 않은 결과나 실행하는 것
  예외란: 이미 상품이 프론트에서 백엔드 요청 했는데 서버가 꺼 있다든가 하면 예외.
   */
    if (!youtubeInfo) {
      throw new HttpException(
        '해당 유트브 정보를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    console.log('isEditable: ', youtubeInfo?.isEditable);

    if (!youtubeInfo?.isEditable) {
      throw new UnprocessableEntityException(
        '현재 수정 불가능한 유튜브 정보입니다.',
      );
      // 409: 중복 이메일로 가입 시도 등의 예
      // 해킹 방지를 위해 일부러 500등으로 통일해서 리턴하는 등 조작하는 경우도 있음
      // throw new HttpException('이미 판매 완료된 상품입니다.', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async delete({ youtubeInfoId }) {
    const youtubeInfo = await this.youtubeInfosRepository.findOne({
      where: { id: youtubeInfoId },
    });

    if (!youtubeInfo) {
      throw new HttpException(
        '해당 유트브 정보를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.youtubeInfosRepository.softDelete({
      id: youtubeInfoId,
    });
    return result.affected ? true : false;
  }

  async restore({ youtubeInfoId }) {
    const youtubeInfo = await this.youtubeInfosRepository.findOne({
      where: { id: youtubeInfoId },
      withDeleted: true,
    });

    if (!youtubeInfo) {
      throw new HttpException(
        '해당 유트브 정보를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.youtubeInfosRepository.restore({
      id: youtubeInfoId,
    });
    return result.affected ? true : false;
  }
}
