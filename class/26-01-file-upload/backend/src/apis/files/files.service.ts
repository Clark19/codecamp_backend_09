import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  upload({ file }) {
    console.log(file);
    // 파일을 클라우드 스토리지에 저장하는 로직
    // 1. 저장할 폴더를 만들기
    // 2. 저장기능 설치하기

    // 스토리지 세팅하기
    const storage = new Storage({
      projectId: 'backend-364006', // GCP접속 후 > 좌상단 프로젝트 이름 나온 선택박스 클릭 > 프로젝트 이름 옆 ID 복붙
      keyFilename: 'gcp-file-storage.json', // secrec Key 파일 같은 역할, 다운로드 받은 파일 이름변경후 프로젝트에 삽입
    }).bucket('park9-storage');

    // 세팅된 스토리지에 파일 올리기
    file
      .createReadStream()
      .pipe(storage.file(file.filename).createWriteStream())
      .on('finish', () => console.log('성공'))
      .on('error', () => console.log('실패')); // pipe 안에 파일이 들어온다고 함

    // 다운로드 URL 브라우저에 돌려주기
    return file.filename;
  }
}
