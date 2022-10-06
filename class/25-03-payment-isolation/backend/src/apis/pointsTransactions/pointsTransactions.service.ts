import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
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

    private readonly dataSource: DataSource, // 예전 버전은 DataConnection이었음
  ) {}

  async create({ impUid, amount, user: _user }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    // =========== transaction 시작 ===========
    await queryRunner.startTransaction();
    // ========================================

    try {
      // 1. PointTransaction 테이블에 거래기록 1줄 생성
      // 빈객체 만드는 거라 디비랑 상관없어서 await 안해도 됨
      const pointTransaction = this.pointsTransactionsRepository.create({
        impUid,
        amount,
        user: _user,
        status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
      });
      // await this.pointsTransactionsRepository.save(pointTransaction);
      await queryRunner.manager.save(pointTransaction);
      // .save() 생성하고 생성한 객체 리턴함
      // insert(), update(), delete()는 생성한 객체 리턴 안함으로
      // 좋아요 기능 같은거는 프론트에 굳이 리턴안해되니 그때 사용하면 좋음.

      // throw new Error('강제로 에러 발생!!!');

      // 2. 유저의 돈(point) 찾아오기
      // const user = await this.usersRepository.findOne({
      //   where: { id: _user.id },
      // });
      const user = await queryRunner.manager.findOne(User, {
        where: { id: _user.id },
      });

      // 3. 유저의 돈 업데이트
      // this.usersRepository.update(
      //   { id: user.id }, // {조건}
      //   { point: user.point + amount }, // {업데이트할 내용}
      // );
      const updateUser = this.usersRepository.create({
        ...user, // user 안에 id가 있으므로 수정으로 작동됨.
        point: user.point + amount,
      }); // 객체만 만드는거니 DB 수정/생성은 안하는 코드
      await queryRunner.manager.save(updateUser);

      // =========== transaction commit 성공 확정!!! ===========
      await queryRunner.commitTransaction();
      // ========================================

      // 4. 최종결과 프론트엔드에 돌려주기
      return pointTransaction;
    } catch (error) {
      // =========== transaction rollback = 되돌리기!!! ===========
      await queryRunner.rollbackTransaction();
      // ========================================
    } finally {
      // =========== 연결 해제!!! ===========
      await queryRunner.release();
      // ========================================
    }
  }
}
