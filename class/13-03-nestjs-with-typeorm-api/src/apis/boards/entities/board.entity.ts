import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity() // typeorm이 이걸 보고 테이블을 만들어줌.
@ObjectType() // GraphQL
export class Board {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  number: number;

  @Column() // typerom 용
  @Field(() => String) // graphql 용, 위에거와 상하 순서 중요하지 않음
  writer: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  contents: string;
}
