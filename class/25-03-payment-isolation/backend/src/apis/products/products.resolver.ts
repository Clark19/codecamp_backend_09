import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProductInput } from './dto/createProduct.input';
import { UpdateProductInput } from './dto/updateProduct.input';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Resolver()
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService, //
  ) {}

  @Query(() => [Product]) // import 주의! @nestjs/graphql 임포트해야함.
  fetchProducts() {
    return this.productsService.findAll();
  }

  @Query(() => Product)
  fetchProduct(
    @Args('productId') productId: string, //
  ) {
    return this.productsService.findOne({ productId });
  }

  @Mutation(() => Product)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput, // 이렇게 하면 아래처럼 하나하나 입력하지 않아도 됨._
  ) {
    return this.productsService.create({ createProductInput });
  }

  // 수정과, 삭제시는 민감하게 주의 해야 함.
  // 예를 들어 판매 완료후 가격 수정, 경매 완료후 가격 수정 등등
  // 따라서 이게 삭제,수정이 되는지 확인/검증 후 막야 함.
  @Mutation(() => Product)
  async updateProduct(
    @Args('productId') productId: string,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    // 인자값에 다 객체로 안묶고 따로 id만 빼서
    // 전달하는 이유는 어떤 필드를 골라서 어떤 내용을 수정할지 명확하게 하기 위해서 임.

    // 판매 완료가 되었는지 확인 로직
    await this.productsService.checkSoldout({ productId });

    // 수정하기: 수정 전 판매 가능 상태인지 판매 완료 검증 후 실행
    return this.productsService.update({ productId, updateProductInput });
  }

  @Mutation(() => Boolean)
  deleteProduct(
    @Args('productId') productId: string, //
  ) {
    return this.productsService.delete({ productId });
  }
}
