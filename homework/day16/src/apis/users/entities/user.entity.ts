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

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  accountName: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', length: 200 })
  profileImageUrl: string;

  @Column()
  phone: string;

  @JoinColumn()
  @OneToOne(() => Payment)
  payment: Payment;

  @ManyToMany(() => YoutubeInfo, (youtubeInfos) => youtubeInfos.users)
  youtubeInfos: YoutubeInfo[];
}
