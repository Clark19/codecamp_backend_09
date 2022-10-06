import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Payment, PAYMENT_STATUS_ENUM } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>, //

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly dataSource: DataSource, // 예전 버전은 Connection 이었음
  ) {}

  async create({ impUid, amount, user: _user, status }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    // =========== transaction 시작 ===========
    await queryRunner.startTransaction('SERIALIZABLE');
    // ========================================
    try {
      // 1. Payment 테이블에 거래기록 1줄 생성
      // 빈객체 만드는 거라 디비랑 상관없어서 await 안해도 됨
      const payment = this.paymentsRepository.create({
        impUid,
        amount,
        user: _user,
        status,
      });

      // await this.paymentsRepository.save(payment);
      await queryRunner.manager.save(payment);

      // // 2. 유저의 돈(point) 찾아오기
      // const user = await this.usersRepository.findOne({
      //   where: { id: _user.id },
      // });
      const user = await queryRunner.manager.findOne(User, {
        where: { id: _user.id },
        lock: { mode: 'pessimistic_write' },
      });

      // // 3. 유저의 돈 업데이트
      // this.usersRepository.update(
      //   { id: user.id }, // {조건}
      //   { point: user.point + amount }, // {업데이트할 내용}
      // );
      const updateUser = this.usersRepository.create({
        ...user,
        point: user.point + amount,
      });
      await queryRunner.manager.save(updateUser);

      // =========== transaction commit 성공 확정!!! ===========
      await queryRunner.commitTransaction();
      // ======================================================

      // 4. 최종결과 프론트엔드에 돌려주기
      return payment;
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
