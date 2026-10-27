# 매일코딩

매일 짧은 문제로 데이터 분석 실력을 쌓는 모바일 우선 학습 앱입니다. [제품·개발 설계](docs/PROJECT_PLAN.md)에 따라 Python 데이터 분석과 SQL을 분리한 트랙을 개발하고 있습니다.

## 설계와 진행 계획

현재 기준선과 다음 작업은 [설계 안내](docs/PROJECT_PLAN.md)와 [프로젝트 현황판](docs/planning/STATUS.md)에서 확인합니다. [WBS와 현황](docs/planning/WBS.md)에서 작업별 선행 조건·담당·산출물·완료 근거를 확인합니다. [변경 통제](docs/planning/CHANGE_CONTROL.md)에 따라 기존 기준선은 보존하고 새 버전으로 변경합니다. 작업 지침은 [AGENTS.md](AGENTS.md), 관리 원본과 명령은 [관리 문서 사용법](docs/planning/README.md)에 있습니다.

문제 추가·출시에는 [공통 설계 기준](docs/CURRICULUM_DESIGN.md)과 [운영 학습 경로·수준 판단 v2](docs/ADAPTIVE_LEARNING.md)를 적용합니다. 목표 문항의 선수 경로·설계 카드가 빠지면 게시를 차단합니다. 설계와 알고리즘의 수정 근거는 [누적 기록](docs/CURRICULUM_LOG.md)에 남깁니다.

## 실제 사이트와 저장소

- 사용 중인 앱: **[매일코딩 열기](https://domino721.github.io/learning_coding_daily/)**
- GitHub 저장소: [domino721/learning_coding_daily](https://github.com/domino721/learning_coding_daily)
- 배포는 `.github/workflows/pages.yml`이 담당하며 main에 push하면 GitHub Pages를 갱신합니다. 저장소 코드 수정만으로 현재 사이트가 바뀌지는 않습니다.

개발·운영 소스와 기능 선택은 [통합 기준](docs/INTEGRATION.md)을 따릅니다. 기존 사이트가 최신 학습 채널이며 별도 HTML 테스트 파일은 독립 배포하지 않습니다. 웹 모드 개발 미리보기는 `npm run dev -- --mode web`로 같은 소스에서 실행합니다.

## 휴대폰에서 사용하려면

현재 [GitHub Pages 사이트](https://domino721.github.io/learning_coding_daily/)에서 사용할 수 있습니다. 설치·재게시 방법은 **[휴대폰 사용·게시 안내](docs/PHONE_SETUP.md)**를 참고하세요. 클라우드 환경의 Publish는 이 앱을 게시하는 버튼이 아닙니다.

웹 버전은 학습 기록을 해당 기기의 브라우저에 저장합니다. 서버 요금은 없고, 기본적으로 다른 기기와 동기화되지 않습니다. 사용자가 별도 계정 서버를 연결하면 동기화를 선택할 수 있습니다. Python/SQLite 개발 버전도 유지합니다. 저장 항목·정답률 해석·데이터 삭제 영향은 [학습 기록 저장 안내](docs/LEARNING_RECORDS.md)에서 확인합니다.

## 현재 사용할 수 있는 기능

- 독립 트랙: Python 데이터 분석 158문제, SQL 48문제. 코딩테스트는 준비 중
- 보관 원본 211문제(서술형 5개는 추천 보류): pandas 56개, NumPy 48개, SQL 49개, 통계 22개, scikit-learn 36개. 코드 읽기·짧은 빈칸·평가 절차·조건 변화 판단
- SQL은 전체 입력 테이블·열·행을 풀이 전에 표시하며, 표시된 입력과 참조 데이터·정답의 일치 여부를 웹 내보내기 전에 검사한다. [10월 18일 입력 보완·새 문제 검수](docs/content_batches/2026-10-18.md)
- 10월 19일: 기존 18개 개념에 적용 9·전이 9문항을 추가. [문항별 설계·검수](docs/content_batches/2026-10-19-expansion.md)에 따라 기존 문항·추천 규칙·기록을 보존
- 10월 20일 별도 보강: 기존 12개 개념에 적용 5·전이 7문항을 추가. [개별 설계·경계 검수](docs/content_batches/2026-10-20-expansion.md)와 기존 142문항·선수 경로 보존 검사를 포함
- 오늘 학습 시작 한 경로: 문항마다 정한 객관식·단답형을 선택한 트랙의 개념·난이도에 맞춰 추천
- 10월 23일 별도 API 보강: Python12·SQL2의 기초4·적용5·전이5문항을 추가. [개별 설계·검수](docs/content_batches/2026-10-23-expansion.md)에 따라 기존187문항·선수 경로·기록을 보존
- 18개 개념과 전 문항의 기초→적용→전이 경로·유형/날짜/지연 복습 기반 수준 판단·추천 이유 기록·1/3/7/14일 복습 규칙. 서술형은 안정화 전 추천 제외, 이전 답안은 미채점으로 보관
- 하루 기본 목표 5문제, 같은 날 같은 기본 구성, 새로고침·서버 재시작 후 이어하기
- 완료 후 최대 5문제씩 추가 추천: 미학습·예정 복습만 제공하고 같은 날 제시한 문제는 중복 제외. 추가 학습도 저장·이어하기 지원
- 풀이 전에는 개념명과 풀이 설명을 숨김. 요청한 2단계 힌트, 객관식·단답형 모두 최대 2회 제출 후 최종 오답·해설 공개, 해설 학습
- 라이트/다크 테마 선택·저장, Python/SQL 구문 색상, 정답·오답·해설 효과
- 예상 시간과 구분되는 활성 풀이 타이머. 숨긴 탭·요청 처리·완료 후 정지하고 제출/해설 확인 시 저장
- 오늘/전체 누적/서로 다른 문제 수 구분, 날짜별 전체 풀이·활동 로그·임시 답안 보존
- 기존 저장 키 유지·localStorage/IndexedDB 복구본·검증 파일 백업 내보내기/가져오기
- 오늘 학습 돌아보기: 기본·추가 전체 합산, 문제·코드·보기·마지막 답·정답·해설 표시. 과거 기록도 원래 문제와 함께 복습
- 도움을 받은 문제는 다음날, 독립 정답은 3일 뒤, 다른 날 독립 복습은 7일·14일 뒤 후보. 같은 날 반복은 승급/간격 확대 근거로 쓰지 않음
- 2026-10-26부터 일일 작업은 새 문항 추가 대신 기존 문항의 형식 전환·오답 보기 검수로 전환. 새 ID·버전 증가분은 품질 게이트를 통과해야 게시. [일일 계약](docs/CONTENT_AUTOMATION.md)·[감사와 정비 순서](docs/CONTENT_QUALITY_REVIEW.md)
- 앱 상단에 배포본 식별자(날짜·commit)를 표시하고, 해설 화면의 ‘이 문제 신고 내용 복사’로 문항 ID·버전을 운영자에게 보낼 수 있음
- 독립 정답 뒤 7일 안의 복습은 같은 문제 대신 같은 개념의 아직 풀지 않은 문제를 ‘다시 연습’으로 제시. 도움 받은 문제의 다음날 복습과 7일 이후 복습은 원래 문제 유지. [운영 규칙 2.1](docs/ADAPTIVE_LEARNING.md)
- 객관식·단답형에 더해 세 가지 조작 형식: 틀린 원인 줄을 누르는 ‘줄 고르기’, 코드 조각을 쌓는 ‘순서 맞추기’, 조건에 맞는 보기를 모두 고르는 ‘모두 고르기’. 답은 번호로 저장해 코드를 실행하지 않고 채점. 첫 15문항(Python 10·SQL 5) 추가. [작성 기준](docs/CONTENT_GUIDELINES.md)
- 추천 learning-paths-2.2: 단계 3에서 막히면 기초가 아니라 한 단계 아래 적용 문제로 보충하고, 보충 우선권은 회복에 필요한 2문항까지만 주며, 같은 조건이면 이번 묶음에 덜 나온 과제 형식을 고름. [운영 규칙 2.2](docs/ADAPTIVE_LEARNING.md)

선행 조건·개념별 추천 단계에 맞는 후보 중 기본 복습을 최대 3개 넣고 나머지를 새 문제로 채웁니다. 후보가 5개 미만이면 실제 개수로 시작하고, 0개이면 소진 안내를 제공합니다. 이미 제시한 문제나 복습 기한 전 문제로 억지로 채우지 않습니다. 난이도는 초기 편집 기준이고 추천은 설명 가능한 간단 규칙입니다. 실제 학습 효과와 난이도 보정은 사용 자료로 확인해야 합니다. 예상 시간은 아직 실측하지 않은 콘텐츠 추정값입니다.

Python/SQLite 모드는 **개인용 로컬 개발 버전**입니다. 같은 서버에 접속하면 같은 기록을 공유합니다. 로그인·사용자 분리·기기 동기화·자유 코드 실행은 아직 없습니다. 모바일 설치 메타데이터는 있지만 오프라인·푸시·앱스토어 배포와 실제 iOS/Android 기기 검증은 후속 작업입니다.

## PC에서 한 명령으로 실행

Node.js 22.12 이상과 uv를 설치한 PC에서 이 프로젝트 폴더를 연 뒤 실행합니다.

```bash
npm start
```

첫 실행은 Node와 Python 의존성을 설치하고 앱을 빌드합니다. 준비되면 로컬 브라우저를 열며, 터미널을 닫거나 Ctrl+C를 누르면 종료합니다. Python 3.12가 없으면 uv가 호환 버전을 준비합니다. 이 명령은 PC용이며 휴대폰 접속 주소를 발급하지 않습니다. Windows와 Mac의 실제 실행 검증은 아직 하지 않았습니다.

## 개발 환경

Node.js 22.12 이상(이 환경에서 24.19 검증), npm, Python 3.12, uv가 필요합니다. 의존성은 `package-lock.json`과 `uv.lock`으로 고정합니다. 외부 서비스·비밀키 없이 실행할 수 있습니다.

```bash
cd /workspace/learning_coding_daily
bash scripts/setup.sh
bash scripts/check.sh
```

다른 로컬 경로에서도 스크립트는 저장소 루트를 찾습니다. `/workspace/.cache` 캐시 경로는 로컬 환경에 맞게 변경할 수 있습니다.

서로 다른 터미널에서 실행합니다.

```bash
cd /workspace/learning_coding_daily
UV_CACHE_DIR=/workspace/.cache/uv uv run --frozen uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

```bash
cd /workspace/learning_coding_daily
npm run dev
```

Vite의 5173 포트는 `/api` 요청을 8000 포트로 전달합니다. `API_PROXY_TARGET`으로 개발용 API 대상을 변경할 수 있습니다. `npm run build`는 정적 산출물을 `dist/`에 만듭니다. `npm start`는 빌드와 API를 8000 포트의 한 서버로 제공합니다. `Dockerfile`도 같은 구성을 사용합니다. 외부 서비스 배포는 별도 호스팅이 필요합니다.

## 진도와 날짜

- SQLite 파일은 기본적으로 저장소의 `.data/learning.sqlite3`에 만들어집니다. 소스 관리에서 제외되며 setup/check 명령은 기존 진도를 지우지 않습니다.
- `APP_DB_PATH`로 DB 경로를 변경할 수 있습니다. 백업은 서버를 멈춘 후 이 파일을 복사합니다.
- `APP_TIMEZONE`은 기본 `Asia/Seoul`입니다. 하루는 서버에 설정된 학습 시간대로 나뉩니다. 학습 기록을 쌓은 뒤 시간대를 바꾸는 UI는 아직 없습니다.
- 자정 이후 이전 날짜의 제출은 거절하고 오늘 학습으로 돌아가도록 안내합니다. 이전 학습 기록은 읽을 수 있습니다.
- DB 스키마 v4는 `PRAGMA user_version`으로 관리합니다. v1/v2/v3 기록은 이전 파일을 백업하고 세션 ID·답안·진도·문항 snapshot을 보존하며 자동 이전합니다. 알 수 없는 버전은 덮어쓰지 않고 오류를 냅니다.

## 검증

```bash
bash scripts/check.sh  # 콘텐츠 일치·프런트 포맷·타입·빌드 + 앱/콘텐츠/추천/기록 및 관리 Python 테스트
npm run test:e2e       # 서버·기기 저장 모드의 모바일 Chromium 검증
```

브라우저 테스트는 `/usr/bin/chromium`이 있으면 사용하며, `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`로 경로를 지정할 수 있습니다. 시스템 Chromium이 없는 로컬 환경은 `npx playwright install chromium`으로 Playwright 브라우저를 설치하세요. 테스트용 서버는 8001·5174·5175 포트를 사용하고 매 실행 별도의 임시 DB를 생성하므로 개인 진도를 변경하지 않습니다.

서버 테스트는 재시작 후 복구, 한국 시간 자정 전환, 복습 수 제한, 동시 요청·중복 제출 방지, 입력 검증 및 전체 문제의 NumPy·pandas·SQL·scikit-learn 참조 결과를 확인합니다. 브라우저 테스트는 기존 기록 호환·풀이 전 개념/힌트 미노출·문제 풀이·힌트·해설·빈칸 입력·새로고침 후 이어하기·기록·320px 너비·통신 실패 복구를 확인합니다. Starlette의 httpx 사용 중단 예정 경고 1개가 발생하지만 테스트는 통과합니다.

```bash
curl --fail http://127.0.0.1:5173/api/health
curl --fail http://127.0.0.1:5173/api/tracks
curl --fail http://127.0.0.1:5173/api/dashboard
```

`POST /api/sessions/today` (`{"track_id":"python"}` 또는 `{"track_id":"sql"}`)로 시작/복구합니다. 답안 제출은 `/api/sessions/{id}/answers`에 `exercise_id`, `answer`, UUID `attempt_id`, `active_seconds`를 보냅니다. 같은 제출 ID 재시도는 중복 기록되지 않습니다. 상세 API 계약은 실행 중인 FastAPI의 `/docs`에서 확인합니다.

## 구조

- `src/`: 모바일 React 화면과 API 타입
- `backend/content.py`, `backend/extra_content.py`, `backend/content_batches/`: 전체 문제의 정답·힌트·해설·참조 코드 원본
- `backend/difficulty.json`, `backend/curriculum.py`: 문항별 상세 난이도·형식·개념 맵·추천 규칙
- `src/records.ts`, `backend/records.py`: 버전 검증·복구본·파일 백업 병합·학습 로그
- `backend/main.py`: 일일 학습·제출·복습·기록 API
- `backend/storage.py`: SQLite 스키마와 트랜잭션
- `tests/`: 서버·콘텐츠 검증, `tests/e2e/`: 브라우저 검증
- `scripts/`: 설치·검증·테스트 서버
- `docs/PROJECT_PLAN.md`: 학습 설계, 구현 단계와 남은 작업

정답은 문제를 마치기 전까지 API 응답에 포함하지 않습니다. 단답형은 공백·따옴표 스타일·동일 숫자 표기를 정규화해 비교하며 Python 코드로 실행하지 않습니다. 이 구조는 개인 연습용이며 외부 사용자 대상 출시는 별도 인증·권한·실행 격리 설계가 필요합니다.

## 컨테이너 패키지

`docker build -t learning-coding-daily .`로 Python/SQLite 모드의 배포용 이미지를 만들 수 있습니다. 8000 포트와 `/app/.data` 저장 경로를 사용합니다. 프록시가 자체 CA를 사용하는 빌드 환경은 `--secret id=build_ca,src=/etc/ssl/certs/ca-certificates.crt`로 신뢰된 CA 묶음을 빌드 시에만 전달할 수 있습니다. TLS와 잠금 파일 체크섬 검증은 유지합니다. 무료 GitHub Pages 모드에서는 이 컨테이너가 필요하지 않습니다.

문제 작성 원칙은 [콘텐츠 기준](docs/CONTENT_GUIDELINES.md)을 따릅니다. 이미 마친 오늘의 기록은 유지하며, 새 분야 문제는 완료 화면 또는 홈의 **추천 문제 더 풀기**로 오늘 바로 풀 수 있습니다. 기존 일일 묶음과 별도로 저장됩니다. 신규 트랙 ID는 `python`/`sql`이며 기존 `pandas` 통합 세션 ID·문제·답안·로그는 그대로 보존합니다. 이전 통합 묶음의 비서술형은 별도 이어하기로 제공하고 서술형은 보류·미채점으로 기록에서 열람합니다.

`POST /api/sessions/extra` (`{"track_id":"python"}` 또는 `{"track_id":"sql"}`)는 기본 학습 완료 후 추가 묶음을 시작하거나 미완료 묶음을 복구합니다. 같은 날 기본 학습은 `batch=0`, 추가 학습은 `batch=1,2,…`로 보존합니다. `/api/dashboard?track_id=python` 또는 `sql`은 `today`, 최신 `extra`, 당일 전체 완료 수 `today_completed_count`, 묶음 순서의 `today_sessions`를 구분해 반환합니다. 오늘 총합과 전체 누적은 모든 트랙·이전 통합 기록을 포함합니다. 오늘 기본/추가 상태는 선택한 트랙 기준이고, 오늘 전체 세션은 `today_sessions`, 추가 후보 수는 `available_count`입니다. 소진 시 빈 세션을 만들지 않고 422 안내를 반환합니다. 같은 날 중복 없이 미학습·기한 도래 복습을 제공합니다.

## 계획 관리 명령

`npm run plan:render`로 WBS·현재 설계 안내를 생성하고 `npm run plan:check`로 기준선 해시·진행 상태·의존성·완료 근거·변경/작업 기록을 검사합니다. 관리 정의는 버전 고정 계획 JSON, 실제 진행은 별도 상태 JSON이 원본입니다. 일반 진행 갱신은 Git 이력으로, 범위·일정 구조 변경은 CR과 새 계획 버전으로 남깁니다. 새 요청은 합의한 목적에 대조해 처리하고, 이미 명시된 사용자 요청을 중복 확인하는 절차로 사용하지 않습니다.

기존 풀이 모드 API는 이전 클라이언트 호환을 위해 유지하지만 현재 화면은 문항별 형식을 사용합니다. 이미 시작한 묶음은 보존합니다. `POST /api/sessions/{id}/mode`에 `exercise_id`, `response_mode`(`choice`/`short`; `essay` 신규 지정은 422로 거절)를 보내면 해당 묶음의 미완료 문제에 적용됩니다. 새 기본/추가 학습 생성에도 `response_mode`를 지정할 수 있으며, 이어하기 요청은 기존 모드를 보존합니다. 서술형 신규 지정/제출은 보류하며, 이미 저장된 최대 2,000자 답안은 미채점으로 열람·백업합니다.

상세 입력과 규칙은 [커리큘럼](docs/CURRICULUM.md), 업데이트 후 기록 보존·파일 백업·계정 서버의 후속 구조는 [기록 안정성 설계](docs/RECORD_RELIABILITY.md)를 참고합니다. 현재 Pages는 계정/기기 간 자동 동기화 서버를 제공하지 않습니다.

## Codex 문제 생성·검수·게시

매일 한국 시간 오전 9시에 Codex가 최신 원격 커리큘럼에 맞는 새 문제 5개를 작성하고 직접 검수·참조 계산·모바일/기록 회귀를 수행한다. 통과한 변경만 기존 main/Pages로 게시한다. 별도 OpenAI/Gemini API 키가 필요하지 않으며 Gemini 검수는 현재 생략한다. 하루 생성 분량은 앱의 학습 상한이 아니다. [운영 안내](docs/CONTENT_AUTOMATION.md)와 [2026-10-17 배치 검수](docs/content_batches/2026-10-17.md)를 참고한다. 실제 게시 성공은 실행별 배포 근거로 확인한다.

## 출시 신뢰성과 작동 원리

[인터랙티브 설계 설명](design.html)은 실제 카탈로그·추천 모듈로 커리큘럼·난이도·선수 경로·가상 이력을 탐색합니다. [기술 안내](docs/TECHNICAL_DESIGN.md), [서비스 범위와 서버 실행](docs/SERVICE_ADR.md), [실제7일 관찰](docs/OBSERVATION_PROTOCOL.md)을 함께 확인하세요. 나의 기록에서 학습 품질 지표·7일 후기·선택적 계정 동기화를 사용할 수 있습니다. 계정 서버는 로컬/컨테이너까지 구현하며 공개 API 호스팅은 아직 없습니다.

게시 워크플로는 전체 품질 검사 성공 후 배포합니다. GitHub 브랜치 보호는 관리자 인증 환경에서 `bash scripts/protect-main.sh`로 별도 적용합니다. 새로운 유료 서비스나 외부 추적을 기본 사용하지 않습니다. 기존60문항의 추가 항목별 검토는 `curriculum/reviews/2026-10-18.json`에 기록했고 실제 학습 효과와 구분합니다.
