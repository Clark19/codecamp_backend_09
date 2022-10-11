import { Field, ObjectType } from '@nestjs/graphql';
import { UserSubtitlesImage } from 'src/apis/userSubtitlesImages/entities/userSubtitlesImage.entity';
import { YoutubeInfo } from 'src/apis/youtubeInfo/entities/youtubeInfo.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

/** User와 YoutubeInfo의 ManyToMany 관계를 커스텀 컬럼(프라퍼티) 추가로인해 수동으로 만듦. */
@Entity()
@ObjectType()
export class UserSubtitles {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // @ManyToOne(() => YoutubeInfo, (youtubeInfo) => youtubeInfo.userSubtitles)
  @ManyToOne(() => YoutubeInfo)
  @Field(() => YoutubeInfo)
  youtubeInfo: YoutubeInfo;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  subtitlesEn: string;

  // @OneToMany(
  //   () => UserSubtitleImage,
  //   (userSubtitleImages) => userSubtitleImages.userSubtitle,
  // )
  // @Field(() => [UserSubtitleImage], { nullable: true })
  // userSubtitleImages: UserSubtitleImage[];
}
