import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator'; // class-validator , class-transformer 라이브러리 설치하여 입력값 검증. 범위도 설정 가능?
// import { ProductSaleslocation } from 'src/apis/productsSaleslocations/entities/productSaleslocation.entity';
import { ProductSaleslocationInput } from 'src/apis/productsSaleslocations/dto/productSaleslocation.input';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Min(0)
  @Field(() => Int)
  price: number;

  @Field(() => ProductSaleslocationInput) // 여기에 들어가려면 schema.gql 파일에 input 타입으로 있어야 가능
  productSaleslocation: ProductSaleslocationInput;
}
