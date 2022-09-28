import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create({ email, hashedPassword: password, name, age }) {
    // 구조분해할당 받을 때 이름 바꾸는 방법
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) throw new ConflictException('이미 등록된 이메일입니다.');
    // throw new HttpException('이미 등록된 이메일입니다.', HttpStatus.CONFLICT);

    return this.userRepository.save({ email, password, name, age }); // short hand property
  }
}

const profile = {
  name: '철수',
  age: 20,
  school: '다람쥐초등학교',
};
// 구조분해할당 받을 때 이름 바꾸는 방법
const { age: qqq } = profile;
console.log(qqq);
