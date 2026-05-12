# todo-backend

Express + Mongoose 기반의 간단한 Todo REST API 서버입니다. MongoDB Atlas (또는 로컬 MongoDB) 를 데이터 저장소로 사용합니다.

## 요구 사항

- Node.js **20** 이상
- 사용 가능한 MongoDB 인스턴스 (MongoDB Atlas 클러스터 또는 로컬 `mongod`)

## 빠르게 시작하기

```bash
git clone https://github.com/myting1004/vibe-todo-backend.git
cd vibe-todo-backend
npm install
cp .env.example .env   # .env 를 열어 MONGODB_URI 채우기
npm run dev
```

서버가 뜨면 `http://localhost:4000` 에서 응답합니다.

## 환경 변수

`.env` 에 다음 값을 채웁니다 (`/.env.example` 참고).

| 이름 | 필수 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `MONGODB_URI` | O | `mongodb://127.0.0.1:27017/todo` | MongoDB 연결 문자열. Atlas 사용 시 비밀번호의 특수문자는 URL 인코딩 (`@` → `%40`). |
| `PORT` | X | `4000` | HTTP 서버 포트. |

> `.env` 는 `.gitignore` 에 등록돼 있어 절대 커밋되지 않습니다. 실제 자격증명은 본인 로컬 `.env` 에만 두세요.

## 실행 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | `node --watch` 로 코드 변경 시 자동 재시작 (개발용) |
| `npm start` | 그냥 `node index.js` 로 실행 (프로덕션용) |

> `--watch` 는 `.env` 변경은 감지하지 않습니다. 환경변수를 바꾸면 프로세스를 직접 재시작하세요.

## API

베이스 경로: `/todos`

| Method | Path | 설명 |
| --- | --- | --- |
| `POST` | `/todos` | 할일 생성. body: `{ title, description?, priority?, dueDate? }` |
| `GET` | `/todos` | 목록 조회. query: `completed=true|false`, `priority=low|medium|high`, `sort=newest|oldest|due` |
| `GET` | `/todos/:id` | 단건 조회 |
| `PATCH` | `/todos/:id` | 부분 수정. body 에서 허용: `title`, `description`, `completed`, `priority`, `dueDate` |
| `DELETE` | `/todos/:id` | 삭제 (204) |

### 데이터 모델

```js
{
  title: String,           // 필수, 최대 200자
  description: String,     // 선택, 최대 2000자
  completed: Boolean,      // 기본 false
  priority: "low" | "medium" | "high",  // 기본 "medium"
  dueDate: Date | null,
  completedAt: Date | null,  // completed 토글 시 자동 갱신
  createdAt: Date,
  updatedAt: Date,
}
```

### 예시

```bash
# 생성
curl -X POST http://localhost:4000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"우유 사기","priority":"high"}'

# 목록 (완료된 것만, 마감 임박 순)
curl "http://localhost:4000/todos?completed=true&sort=due"

# 완료 처리
curl -X PATCH http://localhost:4000/todos/<id> \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# 삭제
curl -X DELETE http://localhost:4000/todos/<id>
```

## 프로젝트 구조

```
.
├── index.js          # 앱 진입점 (express, mongoose 연결)
├── models/Todo.js    # Todo Mongoose 스키마
├── routes/todos.js   # /todos REST 라우터
├── .env.example      # 필요한 환경변수 템플릿
└── .gitignore
```
