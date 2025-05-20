


## 🔖 목차
1. [👤 소개  ](https://github.com/six-ju/msa?tab=readme-ov-file#-%EC%86%8C%EA%B0%9C)   
2. [🏛️ 아키텍처 ](https://github.com/six-ju/msa?tab=readme-ov-file#%EF%B8%8F-%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98)
3. [📁 디렉터리 구조  ](https://github.com/six-ju/msa?tab=readme-ov-file#-%EB%94%94%EB%A0%89%ED%84%B0%EB%A6%AC-%EA%B5%AC%EC%A1%B0)
4. [⚙️ 설치·실행 ](https://github.com/six-ju/msa?tab=readme-ov-file#%EF%B8%8F-%EC%84%A4%EC%B9%98%EC%8B%A4%ED%96%89)
5. [🔒 환경 변수 ](https://github.com/six-ju/msa?tab=readme-ov-file#-%ED%99%98%EA%B2%BD-%EB%B3%80%EC%88%98)   
6. [🎁 회원가입 설계](https://github.com/six-ju/msa?tab=readme-ov-file#-%ED%9A%8C%EC%9B%90%EA%B0%80%EC%9E%85-%EC%84%A4%EA%B3%84)
7. [🎁 보상 설계](https://github.com/six-ju/msa?tab=readme-ov-file#-%EB%B3%B4%EC%83%81)
8. [🧩 이벤트 설계 ](https://github.com/six-ju/msa?tab=readme-ov-file#-%EB%AF%B8%EC%85%98)
9. [📡 API 명세  ](https://github.com/six-ju/msa?tab=readme-ov-file#-api-%EB%AA%85%EC%84%B8)
10. [💡 구현 중 겪은 고민 및 해결](https://github.com/six-ju/msa?tab=readme-ov-file#%EA%B5%AC%ED%98%84-%EC%A4%91-%EA%B2%AA%EC%9D%80-%EA%B3%A0%EB%AF%BC-%EB%B0%8F-%ED%95%B4%EA%B2%B0)
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
│  ├─ .env (추가 필수)
│  └─ Dockerfile
├─ event-server/
│  ├─ src/
│  ├─ .env (추가 필수)
│  └─ Dockerfile
├─ README.md
└─ docker-compose.yml
```
## ⚙️ 설치·실행
1.  레포지토리 클론 
2. .env 파일 생성(auth & event 서버) & 환경 변수 설정
3. `docker-compose up -d --build` 빌드 및 실행
4. Postman

## 🔒 환경 변수
- auth-sever
```
JWT_SECRET_KEY=iwantgonexon

MONGODB_URL= 당사 URL 작성
```

- event-sever
```
MONGODB_URL= 당사 URL 작성
```


## 🎁 회원가입 설계
> 1. 추천인은 ID 입력하면 됩니다.  
> 2. 권한은 대문자로 입력하시면 됩니다.

```json
{
  "ID": “user1”,
  "PW": “1234”,
  "role": "USER"
  "recommend": ""
}
```
```json
{
  "ID": “admin”,
  "PW": “1234”,
  "role": "ADMIN"
  "recommend": "user1"
}
```
```json
{
  "ID": “auditor”,
  "PW": “1234”,
  "role": "AUDITOR"
  "recommend": "user1"
}
```
```json
{
  "ID": “operator”,
  "PW": “1234”,
  "role": "OPERATOR"
  "recommend": "user1"
}
```

## 🎁 보상 설계

```json
{
  "name": “돈뭉치”,
  "amount": “33333”,
  "info": "추천인 3명 받았을시 지급"
}
```
```json
{
  "name": “데일리보상 1일차”,
  "amount": “1000”,
  "info": "데일리보상 1일차"
}
```
```json
{
  "name": “데일리보상 7일차”,
  "amount": “7000”,
  "info": "데일리보상 7일차"
}
```
```json
{
  "name": “데일리보상 30일차”,
  "amount": “30000”,
  "info": "데일리보상 30일차"
}
```
```json
{
  "name": “티끌모아태산”,
  "amount": “77777”,
  "info": "추천인 3명 받았을시 지급"
}
```
```json
{
  "name": “운영자 손길”,
  "amount": “100000”,
  "info": "운영자의 선물"
}
```
## 🧩 이벤트 설계
1. **이벤트 존재 여부**  
   - DB에 eventNum이 있는지 확인

2. **이벤트 활성 상태**  
   - `status === true` 인지 확인

3. **이벤트 기간 체크**  
   - `today < startAt || today > endAt` 인지 확인

4. **중복 요청 방지**  
   - 이미 보상을 요청했는지(`History` 모델) 확인

5. **이벤트 유형별 충족 요건**  
   - **Recommend**: 추천인 수가 `n`명 이상이어야 지급  
   - **Daily**: 첫 로그인시 지급 가능
   - **Weekly**: 7번 로그인시 지급 가능
   - **Monthly**: 30번 로그인시 지급 가능
   - **Money**: 특정 금액만큼 돈이 모였으면 지급

- 추천인 3명 받기 (1번)(eventType : Recommend)
```json
{
  "name": "추천인 3명 받기",
  "reward": "1",
  "status": "true",
  "eventType": "Recommend",
  "startAt": "2025-05-15",
  "endAt": "2025-05-25"
}
```
- 첫 로그인 기념 (2번)(eventType : Daily)
```json
{
  "name": "1일차 출석",
  "reward": "2",
  "status": "true",
  "eventType": "Daily",
  "startAt": "2025-05-15",
  "endAt": "2025-05-25"
}
```
- 일주일 출석 완료 (3번)(eventType : Weekly)
```json
{
  "name": "일주일 출석",
  "reward": "3",
  "status": "true",
  "eventType": "Weekly",
  "startAt": "2025-05-15",
  "endAt": "2025-05-25"
}
```
- 한달 출석 완료 (4번)(eventType : Monthly)
```json
{
  "name": "한달 출석 완료",
  "reward": "4",
  "status": "true",
  "eventType": "Monthly",
  "startAt": "2025-05-15",
  "endAt": "2025-05-25"
}
```
- 티끌 모아 태산 (5번)(eventType : Money)
```json
{
  "name": "티끌 모아 태산",
  "reward": "5",
  "status": "true",
  "eventType": "Money",
  "startAt": "2025-05-15",
  "endAt": "2025-05-25"
}
```
## 📡 API 명세

> **POST / PATCH 요청 시**  
> `Content-Type: application/x-www-form-urlencoded`  

>  1. 이벤트 생성은 가능하나 전략 클래스가 존재하지 않으므로 보상지급 불가

| method | URL | func | Req | Res |
| --- | --- | --- | --- | --- |
| POST | /signup | 회원가입 | { <br>ID: “test”, <br> PW: “1234”, <br> role: 'USER',  <br>recommend:'test1' <br>} | {"message": "회원가입을 성공적으로 완료했습니다."} |
| POST | /login | 로그인| { <br>ID: “test”,  <br>PW: “1234” <br>} | { message: '로그인 성공' } |
| POST | /admin/event | 이벤트 생성| { <br>name: “1일차 출석”,  <br>reward: “5”,  <br>status: 'true',  <br>eventType:'Daily',  <br>startAt:'2025-05-15',  <br>endAt:'2025-05-25' <br>} | {message:'이벤트 생성 완료'} |
| POST | /admin/reward | 보상 생성| { <br>name: “데일리보상 1일차”,  <br>amount: “1000”,  <br>info: '첫날 로그인시 요청가능' <br>} | {message:'보상 생성 완료'} |
| GET | /admin/event | 이벤트 조회(ADMIN)| - | { <br> "_id": "6827289c6361da5b4203c5b6",<br> "number": 1, <br>"name":"추천인 3명 받기",<br> "reward": ["1"], <br>"startAt": "2025-05-15T00:00:00.000Z", <br>"endAt": "2025-05-25T00:00:00.000Z",<br>"status": true,<br>"eventType": "Recommend",<br>"createdBy": "test",<br>"updatedBy": "test",<br>"createdAt": "2025-05-16T11:59:24.613Z",<br>"updatedAt": "2025-05-16T11:59:24.613Z",<br>"__v": 0<br>}|
| GET | /event | 이벤트 조회(USER)| - | {<br>"number": 1,<br>"name": "추천인 3명 받기",<br>"reward": ["1"],<br> "startAt": "2025-05-15",<br>"endAt": "2025-05-25"<br>}|
| GET | /admin/reward | 보상 조회(ADMIN)| - | {<br>"number": 1,<br>"name": "돈뭉치",<br>"amount": 333333,<br>"info": "추천인 3명 받았을때 나가는 보상",<br>"createdAt": "2025-05-16T07:52:54.052Z",<br>"updatedAt": "2025-05-16T07:52:54.052Z",<br>"eventsName": ["추천인 3명 받기"] <br>}|
| GET | /reward | 보상 조회(USER)| - |{<br>"number": 1,<br>"name": "돈뭉치",<br>"amount": 333333,<br>"eventPath": ["추천인 3명 받기"]<br>}|
| PATCH | /admin/event | 이벤트 보상 추가| { <br>eventNum: “5”,  <br>reward: “6” <br>} |{message:'보상 추가 완료'}|
| POST  | /request | 보상 요청| { <br>eventNum: “2” <br>} | {message:'보상 지급 완료'} |
| GET | /request/history | 내 요청 이력 가져오기| - |{<br>"userId": "test",<br>"eventNum": "2",<br>"status": "SUCCESS",<br>"remark": "보상 지급이 완료되었습니다.",<br>"createdAt": "2025-05-16T12:31:08.697Z"<br>}|
| GET | /admin/request/history | 운영자 요청 이력 가져오기| - | {<br>"userId": "test",<br>"eventNum": "2",<br>"status": "SUCCESS",<br>"remark": "보상 지급이 완료되었습니다.",<br>"createdAt": "2025-05-16T12:31:08.697Z"<br>},<br>{<br>"userId": "test",<br>"eventNum": "2",<br> "status": "FAILED",<br>"remark": "이미 보상을 받으셨습니다.",<br>"createdAt": "2025-05-16T12:31:52.114Z"<br> }|



## 💡구현 중 겪은 고민 및 해결

1. **전역 Guard 등록 이슈**  
   - **문제**  
      권한 부여 기능을 하면서 처음에는 각각의 라우터에 수동으로 적용하고 `app.module`에 전역으로 `JwtAuthGuard`와 `RolesGuard`를 부여하여 인증 또는 롤이 필요하지 않은 라우터에서 해당 라우터를 지나가지 못하는 이슈
  <br><br>
   - **해결**  
  불필요한 전역 Guard 등록을 제거 후 각각 필요 라우터에 `JwtAuthGuard`와 `RolesGuard`를 적용하여 이슈를 개선
 <br><br>


2. **Axios data 누락으로 인한 인증 실패**  
   - **문제**  
     `gateway`에서 `axios.post` 호출 시 `data` 파라미터를 생략하고 `header`만 추가하니 `auth`에서 header를 받을수 없는 이슈
   <br><br>
   - **해결**  
     ```
     await axios.post(url, data, { headers });
     ```
      위와 같은 형태로 변경후 이슈를 해결
 <br><br>
    - **느낀점**   
   익숙한 라이브러리 `axios`라 안일하게 다뤘던점이 문제 였고, 이 경험을 통해서 아는 것을 보다 중요하게 생각해야 한다는 교훈을 얻었습니다. 
 <br><br>


3. **미션 swich case 에서 strategy로 변경**  
   - **문제**  
    `switch-case` 문으로 미션별 로직을 분기 처리하였으나, 미션이 추가될 때마다 코드가 늘어나고 유지보수부분이 어려워 추후 확장성에 문제가 생기는 이슈
 <br><br>
   - **해결**  
     `strategy` 전략 패턴을 사용함으로써 서비스 단에 코드가 단순해지며, 새로운 미션 추가시 전략 클래스만 작성하면 되므로 확장성과 유지보수 부분 해결



---
