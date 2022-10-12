/**
 * Triggered from a change to a Cloud Storage bucket.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.helloGCS = async (event, context) => {
  console.log('안녕 구글 클라우드 Function');
  const gcsEvent = event;
  console.log(`Processing file: ${gcsEvent.name}`);
  console.log(`event: ${JSON.stringify(event)}`);
  console.log(`context: ${JSON.stringify(context)}`);

  // event에는 stream였지만, 풀어져있는 객체의 형태로 속에 어떤 데이터들이 존재하고 있는지 확인을 할 수 있다.
  // 오늘 여기에 콘솔을 몇번을 찍었는지 다부셔졌겠다 진짜
  //
  if (event.name.includes('thumb/')) return;
  // if (event.name.includes("thumb/s")) return;
  // if (event.name.includes("thumb/m/")) return;
  // if (event.name.includes("thumb/l/")) return;
  // 여기 위에 3개의 조건문은 사진이 반복되서 생성되는 것을 방지해준다.
  //
  // 어떤 원리로 돌아가냐면, 아래 map을 반복하면서 파일이 생성되었을 때 그 파일의 이름이 폴더의 위치 또한 포함되어있다.
  // 그래서 이 코드같은 경우는 thumb/s/image.jpg <- 이런 형태라 thumb이 존재하면 멈춰! 여서 중복생성되는 것을 방지해준다.
  //
  // 일단 맨 위에 주석처리가 되어있지 않은 1개만 써도 상관없지만, 주석처리가 된 3개를 써줄 경우 코드의 실행이 더 짧다.
  const option = [
    [320, 's'],
    [640, 'm'],
    [1280, 'l'],
  ];
  //  width만 적으면 알아서 비율을 맞춰주는데 여러번 칠까 하다가 그냥.... 그냥 배열에 담아놨다.
  // s,m,l은 사이즈다 스몰 미디움 라지
  //
  const name = event.name;
  //
  // 여기 속에는 파일의 이름이 들어가있다, 맨 처음 파일 업로드를 image.jpg로 했다면
  // image.jpg 가 담겨져있는 형식
  //
  const storage = new Storage().bucket(event.bucket);
  //
  // 이것은 Stroage를 초기화해주는 형식인데, 아까 맨 위의 코드를 보면 이런식으로 storage의 정보를 넣는 것을 볼 수 있었다.
  // 또한 event.bucket에는 이미지를 업로드 할 때 올라간 bucket의 정보가 들어있다.
  //
  // 즉 이제부터 storage는 사진을 업로드했을 때 적어놨던 bucket 내부라고 보면 된다.
  //
  await Promise.all(
    option.map(([size, dir]) => {
      //
      // 이중배열이라 요소를 한번에 다루려면 이런식으로 써야한다.
      //
      return new Promise((resolve, reject) => {
        //
        // 아래는 일반 메소드를 쓰는 것처럼 1개씩 쌓여나간다고 생각하면 편하다.
        //
        storage
          //
          // 내가 업로드한 버켓의 저장소에서
          //
          .file(name)
          //
          // 올렸던 파일 이름을 ex image.jpg
          //
          .createReadStream()
          //
          // 읽어서 Stream형태로 만들어줘
          //
          .pipe(sharp().resize({ width: size }))
          //
          // 그것을 width 320,640,1280의 사이즈로 바꿔서
          //
          .pipe(storage.file(`thumb/${dir}/${name}`).createWriteStream())
          //
          // 업로드한 저장소에, thumb/s,m,l/의 폴더에
          // ${name} ex image.jpg 라는 이름으로
          // Stream을 저장해줘 (Write)
          //
          .on('finish', () => resolve())
          .on('error', () => reject());
      });
    }),
  );
};
