import { Payment } from 'src/apis/payments/entities/payment.entity';
import { YoutubeInfo } from 'src/apis/youtubeInfo/entities/youtubeInfo.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  nickName: string;

  @Column()
  // @Field(() => String) // 프론트엔드로 리턴하지 않기 위해 @Field()를 제거.
  password: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  @Field(() => String)
  profileImageUrl: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  phone: string;

  // @JoinColumn()
  @OneToMany(() => Payment, (payments) => payments.user)
  @Field(() => [Payment], { nullable: true })
  payments: Payment[];

  @ManyToMany(() => YoutubeInfo, (youtubeInfos) => youtubeInfos.users)
  @Field(() => [YoutubeInfo], { nullable: true })
  youtubeInfos: YoutubeInfo[];

  @DeleteDateColumn()
  @Field(() => Date, { nullable: true })
  DeleteDate: Date;

  @Column({ default: 0, nullable: true })
  @Field(() => Int, { nullable: true })
  point: number;
}
