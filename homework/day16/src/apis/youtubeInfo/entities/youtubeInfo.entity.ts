import { Category } from 'src/apis/categories/entities/category.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class YoutubeInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({ type: 'text' })
  subtitlesEn: string;

  @Column({ type: 'text' })
  subtitlesKo: string;

  @Column({ type: 'json' })
  subtitlesWithTime: string;

  @ManyToOne(() => Category)
  category: Category;

  @JoinTable()
  @ManyToMany(() => User, (users) => users.youtubeInfos)
  users: User[];
}
