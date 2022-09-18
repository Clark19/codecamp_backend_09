import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity() // typeorm이 이걸 보고 테이블을 만들어줌.
@ObjectType() // GraphQL
export class Starbucks {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  number: number;

  @Column() // typerom 용
  @Field(() => String) // graphql 용, 위에거와 상하 순서 중요하지 않음
  menu: string; // typescript 용 타입

  @Column()
  @Field(() => Int)
  price: number;

  @Column()
  @Field(() => Int)
  kcal: number;

  @Column()
  @Field(() => Int)
  saturated_fat: number;

  @Column()
  @Field(() => Int)
  protein: number;

  @Column()
  @Field(() => Int)
  salt: number;

  @Column()
  @Field(() => Int)
  sugar: number;

  @Column()
  @Field(() => Int)
  caffeine: number;
}
