import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import { YoutubeInfo } from 'src/apis/youtubeInfo/entities/youtubeInfo.entity';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

/** User와 YoutubeInfo의 ManyToMany 관계를 커스텀 컬럼(프라퍼티) 추가로인해 수동으로 만듦. */
@Entity()
@ObjectType()
export class UserYtSubtitle {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  userId!: string;

  @Column()
  @Field(() => String)
  youtubeInfoId!: string;

  @ManyToOne(() => User, (user) => user.userYtSubtitles)
  @Field(() => User)
  user!: User;

  @ManyToOne(() => YoutubeInfo, (youtubeInfo) => youtubeInfo.userYtSubtitles)
  @Field(() => YoutubeInfo)
  youtubeInfo!: YoutubeInfo;

  // @Column({ type: 'text' })
  // @Field(() => String, { nullable: true })
  // subtitlesEn: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  @Field(() => [String])
  imageUrl: string[];
}
