import { Field, ObjectType } from '@nestjs/graphql';
import { UserYtSubtitle } from 'src/apis/userYtSubtitles/entities/userYtSubtitle.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class UserYtSubtitleImage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 200 })
  @Field(() => String)
  url: string;

  @ManyToOne(() => UserYtSubtitle)
  @Field(() => UserYtSubtitle)
  userYtSubtitle: UserYtSubtitle;
}
