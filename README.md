
## 구현 중 겪은 고민 및 해결

1. **전역 Guard 등록 이슈**  
   - **문제**  
      권한 부여 기능을 하면서 처음에는 각각의 라우터에 수동으로 적용하고 `app.module`에 전역으로 `JwtAuthGuard`와 `RolesGuard`를 부여하여 인증 또는     
     롤이 필요하지 않은 라우터에서 해당 라우터를 지나가지 못하는 이슈가 있었습니다.
  <br><br>
   - **해결**  
  불필요한 전역 Guard 등록을 제거 후 각각 필요 라우터에 `JwtAuthGuard`와 `RolesGuard`를 적용하여 이슈를 개선했습니다.
 <br><br>


2. **Axios data 누락으로 인한 인증 실패**  
   - **문제**  
     `gateway`에서 `axios.post` 호출 시 `data` 파라미터를 생략하고 `header`만 추가하니 `auth`에서 header를 받을수 없는 이슈가 있었습니다.
   <br><br>
   - **해결**  
     ```
     await axios.post(url, data, { headers });
     ```
      위와 같은 형태로 변경후 이슈를 해결했습니다. 
 <br><br>
    - **느낀점**   
   익숙한 라이브러리 `axios`라 안일하게 다뤘던점이 문제 였고, 이 경험을 통해서 아는 것을 보다 중요하게 생각해야 한다는 교훈을 얻었습니다. 
 <br><br>


3. **미션 swich case 에서 strategy로 변경**  
   - **문제**  
    `switch-case` 문으로 미션별 로직을 분기 처리하였으나, 미션이 추가될 때마다 코드가 늘어나고 유지보수부분이 어려워졌습니다.
 <br><br>
   - **해결**  
     `strategy` 전략 패턴을 사용함으로써 서비스 단에 코드가 단순해지며, 새로운 미션 추가시 전략 클래스만 작성하면 되므로 확장성과 유지보수가 좋아졌습니다.


![Nexon 과제](https://img.shields.io/badge/Assignment-Nexon-blue) ![NestJS](https://img.shields.io/badge/Tech-NestJS-orange) ![Docker](https://img.shields.io/badge/DevOps-Docker-lightgrey)

---

## 🔖 목차
1. 👤 소개  
2. 🚀 개요  
3. 🛠️ 기술 스택  
4. 🏛️ 아키텍처  
5. 📁 디렉터리 구조  
6. ⚙️ 설치·실행  
7. 📡 API 명세  
8. 🔒 환경 변수  
---

## 👤 소개
- **이름**: 육준호  
- **직무**: 백엔드 개발자  
- **연락처**: 010-9390-1479
- **이메일**: yuk1479@naver.com


## 🚀 개요
- NestJS 기반 마이크로서비스 3종(gateway, auth, event)  
- 이벤트 생성, 보상 정의, 유저 보상 요청, 관리자 및 감사자 확인 기능 포함

## 🛠️ 기술 스택
- **언어/프레임워크**: TypeScript, NestJS  
- **DB**: MongoDB (Mongoose)  
- **인증**: JWT  
- **배포·운영**: Docker Compose  
- **유틸**: dayjs, Axios

## 🏛️ 아키텍처
1. Gateway: 공통 인증·라우팅  
2. Auth: 로그인·토큰 발급  
3. Event: 이벤트 및 보상 CRUD / 전략 패턴 

## 📁 디렉터리 구조
```plaintext
/
├─ gateway-server/
│  ├─ src/
│  └─ Dockerfile
├─ auth-server/
│  ├─ src/
│  └─ Dockerfile
├─ event-server/
│  ├─ src/
│  └─ Dockerfile
└─ docker-compose.yml
```
## 📡 API 명세

## 🔒 환경 변수

