import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import {
  PointTransaction,
  POINT_TRANSACTION_STATUS_ENUM,
} from './entities/pointTransaction.entity';

@Injectable()
export class PointsTransactionsService {
  constructor(
    @InjectRepository(PointTransaction)
    private readonly pointsTransactionsRepository: Repository<PointTransaction>, //

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create({ impUid, amount, user: _user }) {
    // 1. PointTransaction 테이블에 거래기록 1줄 생성
    // 빈객체 만드는 거라 디비랑 상관없어서 await 안해도 됨
    const pointTransaction = this.pointsTransactionsRepository.create({
      impUid,
      amount,
      user: _user,
      status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
    });

    await this.pointsTransactionsRepository.save(pointTransaction);

    // 2. 유저의 돈(point) 찾아오기
    const user = await this.usersRepository.findOne({
      where: { id: _user.id },
    });

    // 3. 유저의 돈 업데이트
    this.usersRepository.update(
      { id: user.id }, // {조건}
      { point: user.point + amount }, // {업데이트할 내용}
    );
    // 4. 최종결과 프론트엔드에 돌려주기
    return pointTransaction;
  }
}
