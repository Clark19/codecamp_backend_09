import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PAYMENT_STATUS_ENUM {
  PAYMENT = 'PAYMENT',
  CANCEL = 'CANCEL',
}

// enum타입을 graphql에 등록
registerEnumType(PAYMENT_STATUS_ENUM, {
  name: 'PAYMENT_STATUS_ENUM',
});

@Entity()
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // @Column()
  // @Field(() => Boolean)
  // isPayed: boolean;

  @Column() // unique 하지만 안되는 이유는 PointTransaction 테이블을 업데이트하지 않고, 인서트 온리로 사용하여 모든 히스토리 기록하기 때문 uuid가 여러 row에 중복해서 나타날수 있기 때문에ㅣㄴ.
  @Field(() => String)
  impUid: string;

  @Column()
  @Field(() => Int)
  amount: number;

  // typform에서 enum 사용하는 법
  @Column({ type: 'enum', enum: PAYMENT_STATUS_ENUM }) // 일단 PAYMENT, CANCEL로 Enum 으로만 구분
  @Field(() => PAYMENT_STATUS_ENUM)
  status: string; // 가상 계좌일 경우 'ready', 'paid', 'cancelled' 이런 상태 필요

  @ManyToOne(() => User, (user) => user.payments)
  @Field(() => User)
  user: User;

  @CreateDateColumn()
  @Field(() => String)
  createdAt: Date;
}
