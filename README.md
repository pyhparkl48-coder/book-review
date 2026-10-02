# 문장 사이 — 개인 독서 기록장

기존 독서 UI와 기능을 사용하는 표준 Next.js App Router 프로젝트입니다.

## 로컬 실행

Node.js 22 LTS와 pnpm 11을 사용합니다.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

http://localhost:3000 에 접속합니다. 첫 실행 시 예시 도서와 독서 기록이 표시됩니다.

프로덕션 실행:

```sh
pnpm build
pnpm start
```

## Vercel 배포 설정

| 항목 | 설정 |
| --- | --- |
| Framework Preset | Next.js (자동 감지) |
| Root Directory | 이 README와 package.json이 있는 폴더 |
| Install Command | pnpm install --frozen-lockfile |
| Build Command | pnpm build |
| Output Directory | 기본값 유지 — 직접 지정하지 않음 |
| Node.js Version | 22.x |

ZIP 안의 `book-review` 폴더 **내용**을 저장소 최상위에 올렸다면 Root Directory는 저장소 루트(`.`)입니다. 폴더째 올렸다면 `book-review`를 지정하세요. 기존 Vite 설정의 `dist`, `dist/client`, `out` 같은 Output Directory 재정의와 옛 Build Command를 해제하고 재배포하세요.

별도 vercel.json, 정적 export, Cloudflare Worker, Sites 설정은 필요하지 않습니다. `/`는 `app/page.tsx`, `/api/coach`는 `app/api/coach/route.ts`가 처리합니다.

## AI 환경변수

로컬에서는 `.env.example`을 `.env.local`로 복사하고 값을 설정합니다. Vercel에서는 Project Settings → Environment Variables에 다음을 추가한 뒤 재배포합니다.

- `OPENAI_API_KEY`: 서버용 OpenAI API 키
- `OPENAI_MODEL`: 선택, 기본값 `gpt-4.1-mini`

키에 `NEXT_PUBLIC_` 접두사를 사용하지 마세요. API는 Node.js 런타임에서만 환경변수를 읽습니다. API 함수의 최대 실행 시간은 60초이며 외부 호출은 55초 후 중단합니다.

키가 없어도 책·독서 기록·답변 저장은 작동합니다. AI가 실패하면 원문을 유지하고 안내를 표시합니다. AI를 사용할 때 현재 원문과 같은 책의 이전 기록 최대 12개 및 관련 Q&A가 OpenAI API로 전송됩니다. 실제 AI 응답 검증에는 유효한 API 키가 필요합니다.

## 유지된 기능

- 책 추가·수정·삭제, 선택적 표지 이미지
- 날짜와 페이지별 독서 기록, 진행률 자동 계산
- 원문 보존과 정리 결과 직접 편집
- AI 정리 및 이전 기록을 참고한 심화 질문
- 질문별 답변 저장, 질문 삭제와 추가 생성
- 작성 중인 기록과 답변 임시 저장
- 삭제 확인, JSON 백업 다운로드, 모바일 반응형 화면

## 저장 방식

데이터는 해당 브라우저의 localStorage에 저장됩니다. 다른 브라우저·기기·사이트 주소와 자동 동기화되지 않습니다. localhost에서 Vercel 주소로 옮겨도 기존 기록은 자동 이전되지 않습니다. 브라우저 데이터 삭제 시 기록도 삭제되므로 백업 다운로드를 활용하세요. JSON 가져오기 기능은 아직 없습니다.

## 구조

- `app/page.tsx`, `app/layout.tsx`: App Router 홈과 루트 레이아웃
- `app/components/`: 기존 책장·작성 창·기록·답변 UI
- `app/globals.css`: 기존 디자인
- `app/lib/`: 데이터 모델·저장소·AI 요청과 서버 처리
- `app/api/coach/route.ts`: Next.js 서버 API
- `components/`, `hooks/`, `lib/utils.ts`: 재사용 UI와 유틸리티
- `pnpm-lock.yaml`: 단일 의존성 잠금 파일

검증 명령은 `pnpm typecheck`, `pnpm build`입니다. GitHub 업로드나 실제 Vercel 배포는 로컬 코드 변경과 별도 작업입니다.

## 이번 전환 검증

- `pnpm install --frozen-lockfile --offline`: 통과
- `pnpm typecheck`: 통과
- `pnpm build`: 통과, `/` 정적 페이지와 `/api/coach` 서버 API 생성
- `pnpm start --port 3000`: 프로덕션 서버 실행 확인
- `/`: HTTP 200, JS/CSS 자산 8개 모두 HTTP 200
- 실제 브라우저: 책장 렌더링 및 책 상세 페이지 이동 확인
- API 키 미설정: `/api/coach`가 JSON 503 안내를 반환하는 것 확인

Windows의 제한된 실행 환경에서는 `next.config.ts`가 Next.js 내장 worker threads와 TypeScript API 검사를 사용합니다. 타입 검사를 생략하지 않으며 Vercel의 Linux 환경은 기본 빌드 설정을 사용합니다. 실제 Vercel 배포와 API 키를 사용한 AI 호출은 이 검증에 포함되지 않습니다.
