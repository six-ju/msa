


## 🔖 목차
1. [👤 소개  ](https://github.com/six-ju/msa?tab=readme-ov-file#-%EC%86%8C%EA%B0%9C)   
3. [🏛️ 아키텍처 ](https://github.com/six-ju/msa?tab=readme-ov-file#%EF%B8%8F-%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98)
4. [📁 디렉터리 구조  ](https://github.com/six-ju/msa?tab=readme-ov-file#-%EB%94%94%EB%A0%89%ED%84%B0%EB%A6%AC-%EA%B5%AC%EC%A1%B0)
5. [⚙️ 설치·실행 ](https://github.com/six-ju/msa?tab=readme-ov-file#%EF%B8%8F-%EC%84%A4%EC%B9%98%EC%8B%A4%ED%96%89)
6. [🧩 미션 ](https://github.com/six-ju/msa?tab=readme-ov-file#-%EB%AF%B8%EC%85%98)
7. [📡 API 명세  ](https://github.com/six-ju/msa?tab=readme-ov-file#-api-%EB%AA%85%EC%84%B8)
8. [🔒 환경 변수 ](https://github.com/six-ju/msa?tab=readme-ov-file#-%ED%99%98%EA%B2%BD-%EB%B3%80%EC%88%98)   
9. [💡 구현 중 겪은 고민 및 해결](https://github.com/six-ju/msa?tab=readme-ov-file#%EA%B5%AC%ED%98%84-%EC%A4%91-%EA%B2%AA%EC%9D%80-%EA%B3%A0%EB%AF%BC-%EB%B0%8F-%ED%95%B4%EA%B2%B0)
---

## 👤 소개
- **이름**: 육준호  
- **직무**: 백엔드 개발자  
- **이메일**: yuk1479@naver.com

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
## ⚙️ 설치·실행
1.  레포지토리 클론 
2. .env 파일 생성 & 환경 변수 설정
3. `docker-compose up -d --build` 빌드 및 실행
4. Postman

## 🧩 미션
- 추천인 3명 받기 (1번)(eventType : Recommend)
- 첫 로그인 기념 (2번)(eventType : Daily)
- 일주일 출석 완료 (3번)(eventType : Weekly)
- 한달 출석 완료 (4번)(eventType : Monthly)
- 티끌 모아 태산 (5번)(eventType : Money)

## 📡 API 명세

> **POST / PATCH 요청 시**  
> `Content-Type: application/x-www-form-urlencoded`

| method | URL | func | Req | Res |
| --- | --- | --- | --- | --- |
| POST | /signup | 회원가입 | { <br>ID: “test”, <br> PW: “1234”, <br> role: 'USER',  <br>recommend:'test1' <br>} | {"message": "회원가입을 성공적으로 완료했습니다."} |
| POST | /login | 로그인| { <br>ID: “test”,  <br>PW: “1234” <br>} | { message: '로그인 성공' } |
| POST | /admin/event | 이벤트 생성| { <br>name: “1일차 출석”,  <br>reward: “5”,  <br>status: 'true',  <br>eventType:'Daily',  <br>startAt:'2025-05-15',  <br>endAt:'2025-05-25' <br>} | {message:'이벤트 생성 완료'} |
| POST | /admin/reward | 보상 생성| { <br>name: “데일리보상 1일차”,  <br>amount: “1000”,  <br>role: 'USER', <br> recommend:'test1' <br>} | {message:'보상 생성 완료'} |
| GET | /admin/event | 이벤트 조회(ADMIN)| - | { <br> "_id": "6827289c6361da5b4203c5b6",<br> "number": 1, <br>"name":"추천인 3명 받기",<br> "reward": ["1"], <br>"startAt": "2025-05-15T00:00:00.000Z", <br>"endAt": "2025-05-25T00:00:00.000Z",<br>"status": true,<br>"eventType": "Recommend",<br>"createdBy": "test",<br>"updatedBy": "test",<br>"createdAt": "2025-05-16T11:59:24.613Z",<br>"updatedAt": "2025-05-16T11:59:24.613Z",<br>"__v": 0<br>}|
| GET | /event | 이벤트 조회(USER)| - | {<br>"number": 1,<br>"name": "추천인 3명 받기",<br>"reward": ["1"],<br> "startAt": "2025-05-15",<br>"endAt": "2025-05-25"<br>}|
| GET | /admin/reward | 보상 조회(ADMIN)| - | {<br>"number": 1,<br>"name": "돈뭉치",<br>"amount": 333333,<br>"info": "추천인 3명 받았을때 나가는 보상",<br>"createdAt": "2025-05-16T07:52:54.052Z",<br>"updatedAt": "2025-05-16T07:52:54.052Z",<br>"eventsName": ["추천인 3명 받기"] <br>}|
| GET | /reward | 보상 조회(USER)| - |{<br>"number": 1,<br>"name": "돈뭉치",<br>"amount": 333333,<br>"eventPath": ["추천인 3명 받기"]<br>}|
| PATCH | /admin/event | 이벤트 보상 추가| { <br>eventNum: “5”,  <br>reward: “6” <br>} |{message:'보상 추가 완료'}|
| POST  | /request | 보상 요청| { <br>eventNum: “2” <br>} | {message:'보상 지급 완료'} |
| GET | /request/history | 내 요청 이력 가져오기| - |{<br>"userId": "test",<br>"eventNum": "2",<br>"status": "SUCCESS",<br>"remark": "보상 지급이 완료되었습니다.",<br>"createdAt": "2025-05-16T12:31:08.697Z"<br>}|
| GET | /admin/request/history | 운영자 요청 이력 가져오기| - | {<br>"userId": "test",<br>"eventNum": "2",<br>"status": "SUCCESS",<br>"remark": "보상 지급이 완료되었습니다.",<br>"createdAt": "2025-05-16T12:31:08.697Z"<br>},<br>{<br>"userId": "test",<br>"eventNum": "2",<br> "status": "FAILED",<br>"remark": "이미 보상을 받으셨습니다.",<br>"createdAt": "2025-05-16T12:31:52.114Z"<br> }|




## 🔒 환경 변수
- auth-sever
```
JWT_SECRET_KEY=iwantgonexon

MONGODB_URL=mongodb+srv://yuk1479:ODQMU5ICjVAtDxlT@cluster0.m52xeps.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

```

- event-sever
```
MONGODB_URL=mongodb+srv://yuk1479:ODQMU5ICjVAtDxlT@cluster0.m52xeps.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

```

## 💡구현 중 겪은 고민 및 해결

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



---
