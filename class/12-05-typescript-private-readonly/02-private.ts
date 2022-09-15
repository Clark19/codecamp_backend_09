// public, private, protected, readonly

// 2. private
// class Aaa1 {
//   constructor(private mypower) {}
//   ggg() {
//     console.log(this.mypower); // 안에서 접근 가능
//     this.mypower = 10; // 안에서 수정 가능
//   }
// }

// class Aaa2 extends Aaa1 {
//   ggg() {
//     console.log(this.mypower); // 자식이 접근 불가
//     this.mypower = 10; // 자식이 수정 불가
//   }
// }

// const aaaa = new Aaa2(50);
// console.log(aaaa.mypower); // 밖에서 접근 불가
// aaaa.mypower = 10; // 밖에서 수정 불가
