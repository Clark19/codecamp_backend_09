import { Field, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { Category } from 'src/apis/categories/entities/category.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class YoutubeInfo {
  // 샤딩시(동일 테이블을 물리적으로 나눌 때) 숫자값으로 pk 안하고 스트링 타입의 uuid로 pk를 만드는게 좋다고 함.
  // Why? 숫자값으로 pk를 만들면 샤딩시 pk값이 겹치는 경우가 생길 수 있음.
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  url: string;

  @Column({ type: 'text' })
  @Field(() => String, { nullable: true })
  subtitlesEn: string;

  @Column({ type: 'text' })
  @Field(() => String, { nullable: true })
  subtitlesKo: string;

  @Column({ type: 'json' })
  @Field((type) => GraphQLJSON, { nullable: true })
  // subtitlesWithTime?: JSON;
  subtitlesWithTime: JSON;

  // mysql에서 OneToMany 는 없는데 typeorm에서는 OneToMany를 지원함.
  // 하지만 @OneToMany 사용하면 안되고 상대 클래스 Entity(테이블) 컬럼에 @ManyToOne을 해야 함.
  // ManyToOne은 원래 mysql에 있으므로 ManyToOne 단독 사용 가능.
  // , ManyToOne 한 후 필요할 때 OneToMany를 상대 엔티티 컬럼에 넣을수는 있으나 퍼포먼스 측면에선 나쁠수 있다고 함.
  @ManyToOne(() => Category)
  @Field(() => Category, { nullable: true })
  category: Category;

  @JoinTable() // 타입 orm이 중간 테이블을 만들어줌. 중간 테이블에 추가 컬럼을 넣어야 할 땐 직접 중간 테이블을 만들어야 함.
  @ManyToMany(() => User, (users) => users.youtubeInfos)
  // @ManyToMany하면 이 테이블에 속한 컬럼으로 만들어지지 않음
  @Field((type) => [User], { nullable: true })
  users: User[];

  @Column({ default: true })
  @Field(() => Boolean, { nullable: true })
  isEditable: boolean;

  // @CreateDateColumn() // where: { isDeleted: false }, 이런식으로 쿼리를 날려야 하는데 이걸 자동으로 해줌.
  // createdAt: Date;

  // @UpdateDateColumn()
  // updatedAt: Date;

  @DeleteDateColumn()
  @Field(() => Date, { nullable: true })
  DeleteDate: Date;
}
