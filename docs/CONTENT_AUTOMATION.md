# Codex의 일자별 콘텐츠 정비·검수·게시 (2026-10-26 계약)

기본 운영은 Codex 예약 실행이다. 매일 **한국 시간 오전 9시**에 실행하며 모델 API 키·별도 호스팅을 필수로 두지 않는다. 2026-10-26(CR-014)부터 일일 작업의 목적은 **문항 수 증가가 아니라 기존 문항의 수준·형식·오답 보기 품질 정비**다. 206문항은 하루 5문제 기준 약 40일 분량으로 베타 운영에 충분하며, 양을 늘리는 배치는 중단한다. Gemini/Argon 교차 검수는 사용자의 지시에 따라 생략하고 Codex 직접 검수와 실제 참조 계산으로 표시한다.

## 하루 작업 단위

하루에 아래 **두 가지를 합쳐 다섯 건** 처리한다. 새 문항 작성은 비어 있는 유형군이나 형식 전환 대상에만 허용한다.

1. **형식 전환 2건**: 출력 예측 형식인 단계 3(조건 변화·전이) 문항을 `condition-change`, `bug-line`, `equivalent-code`, `purpose-choice`, `result-interpretation`, `step-order` 중 하나로 다시 쓴다. 2026-10-27(CR-015)부터 `kind`를 `line`(줄 고르기)·`order`(순서 맞추기)·`multi`(모두 고르기)로 바꿀 수 있으며, 작성 규칙과 검수 기록 항목은 `docs/CONTENT_GUIDELINES.md`를 따른다. 같은 ID의 `version`을 1 올리고 이전 버전 기록은 보존한다. 이때 `backend/learning_paths.json`의 경로 항목에도 같은 `task_form`을 적는다(추천 learning-paths-2.2가 이 값으로 형식을 섞는다). 단계 3 코드는 5줄 이상, 데이터는 5행 이상의 합성 업무 데이터(월별 거래·고객·상품 등 가상의 값)로 한다. 그 문항의 첫 version을 위해 쓴 날짜별 경계 테스트는 `tests/preserved.py` 규칙에 따라 자동으로 건너뛰므로 고치거나 지우지 않는다.
2. **오답 보기 검수 3건**: 객관식 문항의 오답 보기마다 겨냥한 오개념을 설계 카드 `distractor_targets`에 적고 `app_difficulty.distractor_strength`를 2 이상으로 올린다. 겨냥 오개념이 없는 보기는 교체한다. 보기 교체는 `version` 증가, 카드 필드만 보강하는 경우는 버전을 유지한다. 같은 version에서 바꿀 수 있는 것은 학습자가 보지 않는 편집 필드뿐이다: 설계 카드의 `distractor_targets`·`choice_diagnostics`·`misconception`·`diagnostic_question`·`app_difficulty`·`review_record`·`task_form`, `backend/difficulty.json`의 프로필, 경로의 `task_form`(`backend/quality_gate.py`의 `EDITORIAL_FIELDS`). 지문·코드·보기·정답·해설·힌트·단계가 바뀌면 version을 올린다. 같은 version의 검수도 `distractor_targets`가 모든 오답 보기를 덮고 강도 2 이상이어야 게이트를 통과한다.

유형군 재분류(개념별 3~5개 family)는 기계 게이트가 아니라 별도 콘텐츠 작업이며 `docs/CONTENT_QUALITY_REVIEW.md`의 순서를 따른다.

CR-017(2026-10-28)로 추가된 66문항과 CR-018의 Python 기초 21문항은 원본이 `backend/basics_content.json`(Python 기초)과 `backend/extension_content.json`(SQL 함수·윈도·데이터 변경, NumPy·pandas의 @)에 있다. CR-019(2026-10-29)·CR-020(2026-10-30)의 터미널·Git 76문항은 `backend/terminal_content.json`에 있고, CR-021(2026-10-31)부터 그 가운데 17문항은 Windows(domain `Windows`) 문항이고 CR-022부터 보류 중이다(추천하지 않음). Windows 문항을 고치면 수동 워크플로 `.github/workflows/windows.yml`(`scripts/validate_windows_content.py`)을 실행해 통과를 확인한다. 이 문항들은 게시 전에 게이트(단계 3 비출력 형식·오답 보기 강도 2 이상)를 통과했으므로 정비 우선순위 목록의 대상이 아니다. 고칠 때는 같은 원본 파일에서 version을 올린다.

## 절차

1. 최신 main·AGENTS.md·커리큘럼·WBS를 확인한다. 오래된 미커밋 초안은 백업하고 최신 배포본 위에 덮어쓰지 않는다.
2. `docs/CONTENT_QUALITY_REVIEW.md`의 대상 목록에서 오늘 처리할 다섯 건을 고른다. 우선순위는 단계 3 출력 예측 문항 → `distractor_strength` 0인 객관식 → 나머지.
3. 새로 쓰거나 고친 문항은 `curriculum/problem_bank.json`의 설계 카드에 `task_form`, `distractor_targets`, 검수 상태를 적고 `backend/learning_paths.json`·`backend/difficulty.json`·콘텐츠 원본을 함께 갱신한다. 날짜별 검수 기록은 `curriculum/reviews/YYYY-MM-DD.json` **한 파일**로 남긴다. 날짜별 Markdown·날짜별 테스트 파일·날짜별 fixture는 더 만들지 않는다.
4. 직접 다시 풀고 실제 pandas/NumPy/SQLite/scikit-learn 참조 출력, 경계 사례, 정답 유일성·편집 품질을 확인한다. SQL은 모든 테이블의 열·전체 행을 코드 주석에 제시하고 `scripts/validate_sql_content.py`로 표시 입력과 참조 출력의 일치를 확인한다.
5. 다음을 통과해야 게시한다. 모두 `bash scripts/check.sh`에 포함된다.
   - 품질 게이트 `backend/quality_gate.py`: 2026-10-26 기준선(`curriculum/quality_baseline.json`) 이후의 새 ID·버전 증가분은 `task_form` 필수, 단계 3은 출력 예측 금지·코드 5줄 이상, 객관식은 `distractor_strength` 2 이상과 오답별 `distractor_targets` 필수, 같은 검수 기록 안의 출력 예측 비율 50% 이하.
   - 보존 스냅샷 `python3 scripts/freeze-catalog.py`: 학습자가 보는 내용(`published_view`)을 version별로 고정한다. 같은 ID·버전의 그 내용 변경과 version 감소를 거부하고 새 항목·새 version만 추가한다. 게시 전 한 번 실행해 `tests/fixtures/catalog-published.json`을 갱신한다.
   - `python3 scripts/export-content.py`로 웹 내보내기를 갱신하고 기존 문항 ID/버전·snapshot·origin·저장 키·사용자 기록·트랙·추천 규칙을 보존한다.
6. 통과한 변경만 최신 main에 하나의 일관된 커밋으로 반영한다. 동시 변경은 비강제 갱신/expected SHA로 보존한다. 기존 Pages 작업과 실제 사이트의 해당 빌드를 확인한 뒤 성공을 알린다. 실패하면 정확한 단계를 보고한다.

## 기록

- 검수 근거: `curriculum/reviews/YYYY-MM-DD.json` (대상 ID·이전/새 버전·형식·오답 보기 근거·참조 출력·경계 사례).
- 작업 기록: `docs/planning/worklog.json`에 WBS-370 유지보수 LOG 1건. 원격 게시 확인은 같은 LOG 또는 후속 LOG에 Pages 실행 번호로 남긴다. 매일 새 EV 문서와 기준선 버전 증가는 만들지 않는다.
- 주 1회: 베타 테스터가 보내 준 백업 파일을 `python3 -I scripts/analyze-backups.py`로 집계해 검토 후보(너무 쉬움·너무 어려움·힌트 개선)를 다음 주 대상 목록에 반영한다. 파일은 저장소에 넣지 않는다.

## 예약 작업 본문에 넣을 지시

Codex 예약 "매일코딩 문제 생성·검수·배포"의 본문이 "새 문제 5개"로 돼 있으면 아래로 바꾼다.

> 저장소 domino721/learning_coding_daily의 `docs/CONTENT_AUTOMATION.md`(2026-10-26 계약)에 따라 오늘의 정비 다섯 건(형식 전환 2·오답 보기 검수 3)을 수행하고 `bash scripts/check.sh` 통과 후 main에 커밋·Pages 게시를 확인한다. 새 문항 추가는 계약이 허용한 경우에만 한다.

현재 원격 main에는 모델 API 생성 cron이 없으며 기존 `.github/workflows/pages.yml`과 관리 검사만 유지한다. 이전 계약(2026-10-17~10-24, 새 5문제/일)의 배치와 검수 기록은 `docs/content_batches/`와 `backend/content_batches/`에 그대로 보존한다.
