import { Payment } from 'src/apis/payments/entities/payment.entity';
import { YoutubeInfo } from 'src/apis/youtubeInfo/entities/youtubeInfo.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
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
  accountName: string;

  @Column()
  @Field(() => String)
  password: string;

  @Column({ type: 'varchar', length: 200 })
  @Field(() => String)
  profileImageUrl: string;

  @Column()
  @Field(() => String)
  phone: string;

  @JoinColumn()
  @OneToOne(() => Payment)
  @Field(() => Payment)
  payment: Payment;

  @ManyToMany(() => YoutubeInfo, (youtubeInfos) => youtubeInfos.users)
  @Field(() => [YoutubeInfo])
  youtubeInfos: YoutubeInfo[];
}
