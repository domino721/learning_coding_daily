# 구현을 읽는 순서

인터랙티브 설명은 같은 배포의 [design.html](../design.html)에서 제공한다. 앱의 추천 모듈을 직접 호출하는 가상 이력 실험, 개념·문항별 선수 경로, 편집 난이도와 사용자 단계의 차이, 저장·동기화·검증 workflow를 포함한다.

1. `backend/content.py`·추가/배치/기초 자원의 문항 원본 → `backend/difficulty.json`의 편집 난이도를 읽는다. 난이도축은 자동 합산 공식이 아니다.
2. `backend/learning_paths.json`의 requires·family·rules와 `curriculum/problem_bank.json`의 설계 카드를 대조한다. 기존60개 검토 근거는 `curriculum/reviews/2026-10-18.json`이다.
3. `src/recommendation.ts`와 `backend/curriculum.py`가 현재 버전의 독립 관찰→개념별 상태→적격 후보→정렬→묶음→복습일을 계산한다. 공통 가상 이력으로 결과를 대조한다.
4. `src/ExerciseCard.tsx`는 풀이와 타이머, `src/Activity.tsx`는 주간/총수, `src/App.tsx`는 화면 전환과 학습 동작을 담당한다.
5. `src/records.ts`는 검증·이전·복구·파일 병합, `src/recordContract.ts`와 `backend/record_contract.py`는 의미가 같은 제출을 합치는 공통 계약이다. 필드 순서는 의미가 없으며 실제 답안 충돌은 거절한다.
6. `src/learningMetrics.ts`는 관찰 지표 정의, `LearningQuality.tsx`는 개인별 사용 기록과7일 관찰을 제공한다. 정의와 실제 사용 절차는 [관찰 문서](OBSERVATION_PROTOCOL.md)에 있다.
7. `backend/accounts.py`·main의 계정 경계와 `src/sync.ts`·`SyncPanel.tsx`가 선택한 서버와의 동기화를 담당한다. 호스팅·책임·복구는 [서비스 ADR](SERVICE_ADR.md)에 있다.

## 장기 기록 측정

`npm run benchmark:records -- docs/experiments/records-performance-2026-10-18.json`은 하루5문항의90/365일 가상 기록을 만든다. Node에서 직렬화·파싱검증·병합·지표 비용과 파일 크기를 기록한다. 실제 휴대폰 저장 I/O·배터리·지연과 구분한다.

최초 측정:90일 약1.25MB,365일 약5.07MB UTF-8.365일 JSON의UTF-16 추정은약7.97MB여서 localStorage 용량을 넘어설 수 있다. 기존 IndexedDB 단독 저장·복구와 읽기 전용 파일 내보내기를 유지한다. 기록을 용량 때문에 자동 삭제하지 않는다. 서버 대시보드는 이력 조회를 요청당 한 번으로 줄이고 이벤트 조회 인덱스를 추가했다. 이후 실기기 지연이 커지면 세션/이벤트 단위의 증분 저장으로 이전하며 기존 키와 복구본 호환을 검증한다.

## 검증 경계

공통 제출 계약·추천 가상 이력은 두 구현의 의미 차이를 검출한다. 학습 효과는 실제 관찰이 필요하다. 게시 검사는 전체 Python/Node/모바일 검사를 선행하며, 최종 공개 자산 검사는 실제 배포 파일을 대조한다. 원격 브랜치 보호는 별도 관리자 설정이다.
