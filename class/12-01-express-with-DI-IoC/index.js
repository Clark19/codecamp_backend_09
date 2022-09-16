// const express = require('express')
import express from "express";
import { ProductController } from "./mvc/controllers/product.controller.js";
import { CouponController } from "./mvc/controllers/coupon.controller.js";
import { CashService } from "./mvc/controllers/services/cash.js";
import { ProductService } from "./mvc/controllers/services/product.js";
import { PointService } from "./mvc/controllers/services/point.js";

const app = express();

// 이 아래 코드들은 처음 서버 실행시 한번만 실행되는 것들.
const productService = new ProductService();
const cashService = new CashService(); // 1. new 한번으로 모든 곳에서 재사용 가능(싱글톤 패턴)
const pointService = new PointService(); // 2. 쿠폰 구매 방식이 포인트 결제로 변경됨(의존성 주입)

// 상품 API
const productController = new ProductController(cashService, productService);
// productController.buyProduct() 는 요청시마다 실행 됨.
app.post("/products/buy", productController.buyProduct); // 상품 구매하기 API
app.post("/products/refund", productController.refundProduct); // 상품 환불하기 API

// 쿠폰(상품권) API
const couponController = new CouponController(pointService);
app.post("/coupons/buy", couponController.buyCoupon); // 쿠폰 구매하기 API

app.listen(3000, "0.0.0.0", () => console.log("server running"));

//
// 1. ProductController가 CashService에 의존하고 있음.(CashService에 의존성)
//    이 상황을 "강하게 결합되어있다" 라고 표현함. => tight-coupling

// 2. 개선하기 위해서 "느슨한 결합"으로 변경할 필요가 있음 => loose-coupling
//    변경을 하기위해 밖에서 "의존성주입" 해줌 => Dependency Injection(DI)
//    이 역할을 대신 해주는 Nestjs 도구 => IoC 컨테이너 => Inversion-of-Control(IoC)
//    자바 쪽의 스프링 프레임워크에서도 설정파일을 통해 DI를 적용할 수 있음.

// 3. "의존성주입" 으로 new를 2번 이상 할 필요가 없어짐. 또한, 하나의 의존성을 여러곳에서 재사용
//    대상 class의 소스코드를 직접 수정하지 않고 변경 가능(CacheService => PointService ) 핵심

// 4. 단, "의존성주입"이면 "싱글톤패턴"인가? => 아님! (단지, 디폴트가 "싱글톤"일 뿐!)
// nestjs에서 디폴트는 "싱글톤"이지만, 옵션을 주면 "요청마다 새로운 인스턴스"로 변경 가능함.
