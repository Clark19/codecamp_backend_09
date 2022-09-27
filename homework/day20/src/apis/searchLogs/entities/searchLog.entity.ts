import { User } from 'src/apis/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class SearchLog {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  keyword: string;

  @Column()
  @Field(() => Date) // "2021-01-01" 이렇게 입력하면 알아서 데이트 타입으로 되므로 거의 문자열이라 생각해도 될듯
  date: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
