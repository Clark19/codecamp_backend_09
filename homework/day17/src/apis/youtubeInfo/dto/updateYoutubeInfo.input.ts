// import { Field, InputType, Int } from '@nestjs/graphql';
// import { Min } from 'class-validator';

import {
  Field,
  InputType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
// ctrl + shift + k
import { CreateYoutubeInfoInput } from './createYoutubeInfo.input';

// @InputType()
// export class UpdateProductInput {
//   @Field(() => String)
//   name: string;

//   @Field(() => String)
//   description: string;

//   @Min(0)
//   @Field(() => Int)
//   price: number;
// }

/** 위처럼 타클래스(CreateProductInput) 동일해서 복붙해서 클래스 이름만 수정하면
 * 원본이 바뀌면 또 일일 수동으로 수정해야 함.
 * 그래서 더 좋은 방식인 클래스 상속을 사용.
 */
@InputType()
export class UpdateYoutubeInfoInput extends PartialType(
  CreateYoutubeInfoInput,
) {
  //
  /** 이렇게 하면 추가로 만들어 줌 */
  // @Field(() => String)
  // extraField: string;
}

// // 고르기
// PickType(CreateProductInput, ['name', 'price']); // 이렇게 하면 name, price만 가지는 클래스가 만들어짐
// // 빼기
// OmitType(CreateProductInput, ['description']); // 이렇게 하면 description를 제외한 나머지 필드만 가지는 클래스가 만들어짐
// // 있어도 되고 없어도 되는 필드(nullable)
// PartialType(CreateProductInput); // 이렇게 하면 모든 필드를 optional로 만들어줌. nullable: true 가 된다고 함
