# 예: service-auth/Dockerfile
FROM node:18-alpine

# 1) 작업 디렉토리 설정
WORKDIR /app

# 도커 환경임을 나타내는 ENV
ENV IS_DOCKER=true

# builder 스테이지
COPY package*.json ./
RUN npm ci         # dev+prod 설치

# 2) 의존성만 먼저 복사해 설치 (빌드 캐시 활용)
COPY package*.json ./
RUN npm ci --production

# 3) 소스 복사 & 빌드 (TypeScript면 build 명령어 추가)
COPY . .
RUN npm run build               # nestjs: "build": "nest build"

# 4) 컨테이너 시작 커맨드
CMD ["node", "dist/main.js"]

# 5) (선택) 내부 포트 노출
EXPOSE 8000
