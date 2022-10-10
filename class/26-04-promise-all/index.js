// const fetchPromise = async () => {
//   console.time("=== 개별 Promise 각각 ===");
//   await new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve("성공1");
//     }, 2000);
//   });

//   await new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve("성공2");
//     }, 3000);
//   });

//   await new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve("성공3");
//     }, 1000);
//   });
//   console.timeEnd("=== 개별 Promise 각각 ===");
// };

// fetchPromise();

const fetchPromiseAll = async () => {
  console.time("=== 한방 Promise ===");
  const result = await Promise.all([
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("성공1");
      }, 2000);
    }),

    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("성공2");
      }, 3000);
    }),

    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("성공3");
      }, 1000);
    }),
  ]);
  console.timeEnd("=== 한방 Promise ===");
  console.log(result);
};

fetchPromiseAll();
