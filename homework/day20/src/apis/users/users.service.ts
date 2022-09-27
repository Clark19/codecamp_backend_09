import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/createUser.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    const result = await this.userRepository.find({
      relations: ['payment'],
    });

    return result;
  }

  async findAllWithDeleted() {
    const result = await this.userRepository.find({
      relations: ['payment'],
      withDeleted: true,
    });

    return result;
  }

  async findOne(userId: string) {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['payment'],
    });
  }

  async create(createUserInput: CreateUserInput) {
    const user = await this.userRepository.findOne({
      where: { email: createUserInput.email },
    });
    if (user) throw new ConflictException('이미 등록된 이메일입니다.');
    // throw new HttpException('이미 등록된 이메일입니다.', HttpStatus.CONFLICT);

    return this.userRepository.save(createUserInput);
  }

  async update({ userId, updateUserInput }) {
    // save()는 insert, update 둘다 가능하고, 만든 엔티티 결과를 받음
    // this.productsRepository.create(); // 등록을 위한 빈 객체 만들기이므로 주의. .save() 랑 착각 금지
    // this.productsRepository.insert(); //결과는 못 받는 등록 방법
    // this.productsRepository.update(); // 결과 못 받는 수정 방법

    // 수정 후 수정되지 않은 다른 결과 값까지 모두 받고 싶을 때 사용
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    // .save({ ... })시 id가 있으면 update, 없으면 create
    // 기존에 있던 내용 추가 안해주면 업데이트 된 필드만 updateYoutubeInfoInput 담겨 리턴받고 프론트엔드도 그것만 받게된다. 따라서 프론트엔드에서 정보가 더 필요하면 fetchProduct를 다시 호출해야 한다. 그렇게 안하게 하려면 백엔드에서 알아서 조회해서 모든 정보 다 채워서 넣는 방법이 있다. 프론트엔드와 협의 하기 나름 또는  회사/팀 정책에 따라 어찌 구현할지 달라진다.
    const result = this.userRepository.save({
      ...user, // 기존 정보 추가 해주기
      // id: userId,
      ...updateUserInput,
    });

    return result;
  }

  async delete(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException(
        '해당 유저 정보를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.userRepository.softDelete({
      id: userId,
    });
    return result.affected ? true : false;
  }

  async restore(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      withDeleted: true,
    });

    if (!user) {
      throw new HttpException(
        '해당 유저 정보를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.userRepository.restore({
      id: userId,
    });
    return result.affected ? true : false;
  }
}
