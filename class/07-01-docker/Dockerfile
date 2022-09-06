# 컴퓨터 만드는 설명서

# 1. 운영체제 설치 - node 16버전과 npm, yarn이 모두 설치되있는 리눅스
FROM node:16

# 2. nodejs의 yarn 설치
# RUN apt install nodejs
# RUN npm install -g yarn

# 3. 내 컴퓨터에 있는 폴더나 파일을 도커 컴퓨터 안으로 복사하기
# COPY 내컴퓨터폴더위치 도커컴퓨터폴더위치
COPY ./index.js /codecamp/

WORKDIR /codecamp/

CMD node index.js