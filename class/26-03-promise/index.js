console.log(111);

// .then()으로 받기
const onClickPromiseThen = () => {
  new Promise((resolve, reject) => {
    // 시간이 걸리는 작업 API 보내기 등
    // ...
    // ...
    setTimeout(() => {
      const result = "철수"; // 2초가 걸려서 백엔드에서 "철수"라는 데이터 받아옴
      resolve(result); // resolve()안에 데이터 넣으면 .then() 안에 response로 넘겨줌. 또는 await 앞에 변수에 response로 담을수있음
      // reject("에러가 발생했어요"); // try catch로 실패시 이거 실행
    }, 2000);
  })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err); // 에러가 발생했어요!
    });
};
onClickPromiseThen();
console.log(222);

// await로 받기
const onClickPromiseAwait = async () => {
  const qqq = await new Promise((resolve, reject) => {
    // 시간이 걸리는 작업 API 보내기 등
    // ...
    // ...
    setTimeout(() => {
      const result = "철수"; // 2초가 걸려서 백엔드에서 "철수"라는 데이터 받아옴
      resolve(result); // resolve()안에 데이터 넣으면 .then() 안에 response로 넘겨줌. 또는 await 앞에 변수에 response로 담을수있음
      // reject("에러가 발생했어요"); // try catch로 실패시 이거 실행
    }, 2000);
  });

  console.log(qqq); // 철수
};

onClickPromiseAwait();
console.log(333);
