<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# DevPulse Project Guide

## What this is
개인 개발자 포트폴리오 + AI 자동 개발 대시보드.
23개 프로젝트의 git/Claude 활동을 매일 수집해 Firebase에 저장, Next.js로 시각화.

## Quick Commands
```
npm run dev              # 로컬 서버 (기본 3000)
npm run build            # 프로덕션 빌드
npx tsx pipeline/index.ts          # 파이프라인 일일 실행
npx tsx pipeline/index.ts --dry-run # 테스트 (업로드 안 함)
npx tsx pipeline/sync-meta.ts      # config → Firestore 메타 동기화
```

## Architecture
```
src/app/
  page.tsx           → Overview (히어로 + 프로젝트 목록 + 스펙)
  layout.tsx         → 글로벌 레이아웃 (glassmorphism 헤더)
  projects/[slug]/   → 프로젝트 상세 (아키텍처 + 타임라인)
  projects/[slug]/[date]/ → 데일리 포스트 (AI 요약 + 커밋)

src/components/
  ScrollProgress.tsx → 스크롤 프로그레스바 (client)
  CountUp.tsx        → 숫자 카운트업 애니메이션 (client)
  AnimateOnScroll.tsx → IntersectionObserver fade-in (client)
  Breadcrumb.tsx     → 경로 네비게이션 (client)
  ArchDiagram.tsx    → 아키텍처 구조도 (server)

src/lib/
  data.ts            → Firebase 데이터 레이어 (server only)
  firebase.ts        → Firebase 초기화
  types.ts           → 타입 정의

pipeline/
  index.ts           → 파이프라인 엔트리 (extract → summarize → upload)
  extract.ts         → git log + Claude 세션 추출
  summarize.ts       → Claude API로 일일 요약 생성
  upload.ts          → Firestore 업로드
  sync-meta.ts       → config 메타데이터 일괄 동기화

devpulse.config.ts   → 프로젝트 목록, 아키텍처, devSpec 정의
```

## Tech Stack (변경 금지)
- Next.js 16 (App Router, Turbopack)
- React 19 (Server Components 기본)
- Tailwind CSS v4 (CSS-based config, `@theme inline`)
- Firebase (Client SDK for reads, Admin SDK for pipeline writes)
- Pretendard Variable (CDN, 한글 폰트)
- Geist Mono (코드/데이터 표시용)

## Design Tokens
강제 다크 모드. 라이트 모드 없음. globals.css의 CSS 변수 참조:
- `--bg-primary` #0c0c0f, `--bg-surface` #13131a, `--bg-elevated` #1c1c28
- `--accent-primary` #7c6cfc (보라, 브랜드), `--accent-secondary` #2dd4bf (청록, 상태)
- `--accent` #10b981 (에메랄드, 펄스)

## Rules
- `revalidate = 3600` — 모든 페이지에 ISR 1시간 캐시 적용 중
- 날짜 처리는 KST 기준 (UTC+9). `new Date().toISOString()` 직접 쓰지 말 것
- `devpulse.config.ts` 수정 후 Firestore 반영 필요 시 `npx tsx pipeline/sync-meta.ts` 실행
- 클라이언트 컴포넌트 최소화 — 현재 4개만 client (`ScrollProgress`, `CountUp`, `AnimateOnScroll`, `Breadcrumb`)
- AnimateOnScroll은 뷰포트 밖 요소에만 애니메이션 적용 (이미 보이는 요소는 즉시 표시)
- `params`는 Next.js 16에서 `Promise` — `const { slug } = await params` 패턴 사용

## DO NOT
- 라이트 모드 추가하지 말 것
- `tailwind.config.ts` 파일 생성하지 말 것 (v4는 CSS 기반)
- Firebase Admin을 프론트엔드에서 import하지 말 것
- pipeline/ 코드에서 `process.env.NEXT_PUBLIC_*` 사용하지 말 것
- 코드 탐색 없이 파일 구조를 추측하지 말 것 — 위 Architecture 참조

## Deploy
- Vercel 자동 배포 (push to main)
- 파이프라인: macOS LaunchAgent, 매일 05:00 KST
- 프로덕션: https://devpulse-ebon.vercel.app
- GitHub: https://github.com/nohdaeyoung/devpulse
