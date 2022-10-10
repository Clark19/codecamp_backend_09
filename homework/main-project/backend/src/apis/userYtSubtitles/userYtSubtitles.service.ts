import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserYtSubtitle } from './entities/userYtSubtitle.entity';

@Injectable()
export class UserYtSubtitlesService {
  constructor(
    @InjectRepository(UserYtSubtitle)
    private readonly userYtSubtitlesRepository: Repository<UserYtSubtitle>,
  ) {}

  create({ url }) {
    // DB에 x 등록
    const result = this.userYtSubtitlesRepository.save({ url });
    console.log(result); // { id: qkljafsiouq-120983jklasdk, url: 가전제품 }
    return result;
  }
}
