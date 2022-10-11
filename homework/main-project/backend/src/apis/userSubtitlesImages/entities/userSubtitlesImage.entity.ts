import { Field, ObjectType } from '@nestjs/graphql';
import { UserSubtitles } from 'src/apis/userSubtitles/entities/userSubtitles.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class UserSubtitlesImage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // @ManyToOne(() => UserSubtitle, (userSubtitle) => userSubtitle.userSubtitleImages)
  @ManyToOne(() => UserSubtitles)
  @Field(() => UserSubtitles)
  userSubtitle: UserSubtitles;

  @Column({ type: 'varchar', length: 200 })
  @Field(() => String)
  imgUrl: string;

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean)
  isMain: boolean;
}
