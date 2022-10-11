import { Injectable } from '@nestjs/common';
import { Mutation } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSubtitlesImage } from '../userSubtitlesImages/entities/userSubtitlesImage.entity';
import { YoutubeInfo } from '../youtubeInfo/entities/youtubeInfo.entity';
import { CreateUserSubtitlesInput } from './dto/createUserSubtitles.input';
import { UpdateUserSubtitlesInput } from './dto/updateUserSubtitles.input';
import { UserSubtitles } from './entities/userSubtitles.entity';

@Injectable()
export class UserSubtitlesService {
  constructor(
    @InjectRepository(UserSubtitles)
    private readonly userSubtitlesRepository: Repository<UserSubtitles>,

    @InjectRepository(YoutubeInfo)
    private readonly youtubeInofosRepository: Repository<YoutubeInfo>,

    @InjectRepository(UserSubtitlesImage)
    private readonly userSubtitlesImagesRepository: Repository<UserSubtitlesImage>,
  ) {}

  async findAll() {
    const result = await this.userSubtitlesRepository.find({
      relations: ['youtubeInfo'],
    });

    return result;
  }

  // async findAllWithDeleted() {
  //   const result = await this.userSubtitlesRepository.find({
  //     relations: ['youtubeInfo'],
  //     withDeleted: true,
  //   });
  //   return result;
  // }

  findOne({ userSubtitleId }) {
    return this.userSubtitlesRepository.findOne({
      where: { id: userSubtitleId },
      relations: ['youtubeInfo'],
    });
  }

  async create(createUserSubtitleInput: CreateUserSubtitlesInput) {
    const { imgUrls, ...userSubtitleInput } = createUserSubtitleInput;

    const youtubeInfo = await this.youtubeInofosRepository.findOne({
      where: { id: createUserSubtitleInput.youtubeInfoId },
    });

    const userSubtitles = await this.userSubtitlesRepository.save({
      youtubeInfo: youtubeInfo, //{ id: createUserSubtitleInput.youtubeInfoId },
    });

    console.log('userSubtitles:', userSubtitles.id);
    const r = await Promise.all(
      imgUrls.map(async (imgUrl) => {
        await this.userSubtitlesImagesRepository.save({
          userSubtitle: { id: userSubtitles.id },
          imgUrl,
        });
      }),
    );

    return userSubtitles;
  }

  async update(
    userSubtitlesId: string,
    updateUserSubtitlesInput: UpdateUserSubtitlesInput,
  ) {
    console.log('userSubtitlesId:', userSubtitlesId, updateUserSubtitlesInput);
    const { imgUrls, ...userSubtitleInput } = updateUserSubtitlesInput;

    const preUserSubtitles = await this.userSubtitlesRepository.findOne({
      where: { id: userSubtitlesId },
    });

    // const imgs = await this.userSubtitlesImagesRepository.find({
    //   where: { userSubtitle: { id: userSubtitlesId } },
    // });
    const deleteResult = await this.userSubtitlesImagesRepository.delete({
      userSubtitle: { id: userSubtitlesId }, // 이렇게 하면 안됨
    });
    console.log('deleteResult:', deleteResult);
    // 이미지 테이블에서 데이터를 삭제할 때, 스토리지에 있는 실제 이미지 파일도 삭제하는 로직을 추가해보세요

    const result = await Promise.all(
      imgUrls.map(async (imgUrl) => {
        await this.userSubtitlesImagesRepository.save({
          userSubtitle: { id: userSubtitlesId },
          imgUrl,
        });
      }),
    );
    console.log('userSubtitlesImagesRepository result:', result);

    const newUserSubtitles = await this.userSubtitlesRepository.save({
      ...preUserSubtitles,
      id: userSubtitlesId,
      ...userSubtitleInput,
    });

    return newUserSubtitles;
  }
}
