# 문장 사이 — 개인 독서 기록장

책을 읽고 기록을 남긴 뒤, AI 질문에 답하며 생각을 쌓아가는 개인용 독서 웹사이트입니다.

## 실행

Node.js 22.13 이상과 pnpm을 사용합니다.

```sh
pnpm install --frozen-lockfile
pnpm preview:build
pnpm preview:local
```

서버를 실행한 컴퓨터에서 http://127.0.0.1:5173/ 에 접속합니다. 서버가 종료되면 접속할 수 없습니다. 이 주소는 외부에 공개된 웹사이트 주소가 아닙니다. 이 저장소에 소스를 업로드하는 것만으로 사이트가 배포되지는 않습니다.

일반 프레임워크 개발 환경에서는 `pnpm dev`, Cloudflare Worker 빌드는 `pnpm build`를 사용합니다. 제한된 Windows 환경에서는 위의 로컬 실행 방식을 사용하세요.

## 기능

- 책 추가·수정·삭제, 선택적 표지 이미지
- 날짜와 페이지별 독서 기록, 진행률 자동 계산
- 원문 보존과 정리 결과 직접 편집
- 서버 API를 통한 AI 정리 및 심화 질문 생성
- 같은 책의 이전 기록과 Q&A를 고려한 질문
- 질문별 답변 저장, 질문 삭제와 추가 생성
- 작성 중인 기록과 답변 임시 저장
- 삭제 확인, 브라우저 저장, JSON 백업 다운로드
- 모바일 반응형 화면

첫 실행 시 예시 도서와 예시 기록이 표시됩니다. 예시 질문은 실제 AI 호출 결과가 아닌 샘플입니다.

## AI 연결

`.env.example`을 `.env`로 복사하고 서버에서만 키를 설정합니다.

```dotenv
OPENAI_API_KEY=your_server_side_key
OPENAI_MODEL=gpt-4.1-mini
```

설정 후 로컬 서버를 다시 시작하세요. 배포 환경에서는 동일한 이름의 서버 비밀 환경변수를 사용합니다. 키를 프론트엔드 코드나 Git에 넣지 마세요.

키가 없어도 책·독서 기록·답변 저장은 작동합니다. AI가 실패하면 원문을 유지하고 재시도 안내를 표시합니다. AI를 사용할 때 현재 원문과 같은 책의 이전 기록 최대 12개 및 관련 Q&A가 OpenAI API로 전송됩니다. 실 API 응답은 키 설정 후 검증해야 합니다.

## 저장 방식

현재 데이터는 해당 브라우저의 localStorage에 저장됩니다. 다른 브라우저·기기와 자동 동기화되지 않으며, 사이트 주소가 달라지면 별도의 저장 공간을 사용합니다. 브라우저 데이터를 삭제하면 기록도 삭제되므로 백업 다운로드를 활용하세요. 다운로드한 JSON은 보관용이며 UI 가져오기 기능은 아직 없습니다.

개인 기록과 API 키는 이 저장소에 포함하지 않습니다.

## 코드 구조

- `app/components/`: 책장, 작성 창, 날짜별 기록과 답변 UI
- `app/lib/types.ts`: Book, ReadingEntry, Question 모델
- `app/lib/storage.ts`: 저장소 접근과 진행률 계산 연결
- `app/lib/ai.ts`: 서버 호출 및 이전 기록 구성
- `app/lib/server-coach.ts`: AI 지침, 서버 호출, 응답 검증
- `app/api/coach/route.ts`: Cloudflare 환경의 API 진입점
- `scripts/portable-preview.mjs`: 제한된 환경용 로컬 번들 생성
- `scripts/local-server.mjs`: 로컬 웹 및 AI API 서버

## 확인

```sh
pnpm typecheck
pnpm preview:build
```

Cloudflare 기반 정식 배포와 실제 AI 호출 검증은 아직 완료되지 않았습니다.
