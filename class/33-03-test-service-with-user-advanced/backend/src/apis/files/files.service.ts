import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  async upload({ files }) {
    console.log(files);

    // 파일을 클라우드 스토리지에 저장하는 로직
    // 1. 저장할 폴더를 만들기
    // 2. 저장기능 설치하기

    const waitedFiles = await Promise.all(files);
    console.log(waitedFiles); // 결과: [file, file]

    // 스토리지 세팅하기
    const bucket = 'park9-storage';
    const storage = new Storage({
      projectId: 'backend-364006', // GCP접속 후 > 좌상단 프로젝트 이름 나온 선택박스 클릭 > 프로젝트 이름 옆 ID 복붙
      keyFilename: 'gcp-file-storage.json', // secrec Key 파일 같은 역할, 다운로드 받은 파일 이름변경후 프로젝트에 삽입
    }).bucket(bucket);

    // 세팅된 스토리지에 파일 올리기
    const results = await Promise.all(
      waitedFiles.map((file) => {
        return new Promise((resolve, reject) => {
          file
            .createReadStream()
            .pipe(storage.file(file.filename).createWriteStream())
            .on('finish', () => resolve(`${bucket}/${file.filename}`))
            .on('error', () => reject('실패')); // pipe 안에 파일이 들어온다고 함
        }); // end of return new Promise()
      }), // end of map()
    );

    // 다운로드 URL 브라우저에 돌려주기
    return results;
  }
}
