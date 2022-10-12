// {
//   "name": "sample-cloud-storage",
//   "version": "0.0.1",
//   "dependencies": {
//     "@google-cloud/storage": "^5.18.1",
//     "sharp": "^0.30.1"
//   }
// }

const { Storage } = require('@google-cloud/storage');
const sharp = require('sharp');

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

  if (event.name.includes('thumb/')) return;
  // 이미지 사이즈 옵션 주기
  const option = [
    [320, 's'],
    [640, 'm'],
    [1280, 'l'],
  ];
  const name = event.name;

  // 버킷 생성
  const storage = new Storage().bucket(event.bucket);
  console.log('sotrage', storage);
  // 파일을 thumb 디렉토리 사이즈 별로 저장
  await Promise.all(
    option.map(([size, dir]) => {
      return new Promise((resolve, reject) => {
        storage
          .file(name)
          .createReadStream() // 파일 읽기
          .pipe(sharp().resize({ width: size })) // 리사이즈
          .pipe(storage.file(`thumb/${dir}/${name}`).createWriteStream()) //  // 파일을 thumb 디렉토리 사이즈 별로 저장

          .on('finish', () => resolve())
          .on('error', () => reject());
      });
    }),
  );
};
