# 2026-10-23 API 경계와 입력 검증 보강

- 관련: WBS-360·540 / REQ-005·007·012·013·019·020. 사용자 추가·배포 요청의 기존 범위 유지보수.
- 기준: main ee9ee4b2180f94eb857c83b75ead128be067e520 / 설계·계획1.8.0 / learning-paths-2.0.
- 출발 근거: 요청한 API의 기본 경로는 10월21일 이미 게시됐다. 최신187문항을 비교해 아직 직접 다루지 않은 위치 반환, 인자 계산, 열별 후보, 행 유효성, 계산 결과 검사, NumPy 타입 계층과 변환 순서를 선정했다. 학습자가 실제로 틀린 이유나 숙련도는 관찰하지 않았다.
- 자원: Python12·SQL2, 기초4·적용5·전이5, 선택9·단답5. 예상90/120/180초는 편집 추정이다.
- 보존: 기존187문항 전체필드·선수경로·모든 설계카드/보류초안·개념/rules를 fixture의 해시로 확인한다. 기존 단원/18개개념·추천·승급·복습·기본5개·추가학습·2회제출·화면·origin/key를 바꾸지 않는다.

## 목표에서 거꾸로 연결한 경로

where의 위치 확인 → 2차원 좌표 해석. 기존 값 선택 적용 → 예외 설정을 바꾼 계산 시점 진단으로 연결한다. try/except와 errstate의 보조 문법은 지문에서 설명하며 정답 계산은 제공하지 않는다.

기존 Series 포함 검사 → 표의 셀별 마스크 → 사전의 열별 후보 → 행 전체 승인으로 연결한다. all의 기초는 먼저 별도 축 문제에서 확인하며 이를 유한성 행 선택에도 재사용한다.

유한성 기초 + 행별 all → 유효행 선택 → 입력 검사와 비율 산출 후 검사의 차이로 연결한다. 기존 타입 확인 + NumPy 스칼라 계층 → 혼합 정수 정책 → 배열 생성으로 원래 bool 정보가 사라지는 순서를 진단한다.

SQL은 기존 NULL/대체 적용에서 분모 처리로, 기존 포함·NOT EXISTS 적용에서 빈 제외 집합의 SQLite 진리표로 연결한다. 각 쿼리의 전체 CREATE/INSERT를 화면에 표시하며 빈 blocked는 행이 없다고 명시한다.

## 개별 문항

| ID | 단계 | 도달 행동 | 선수 |
| --- | --- | --- | --- |
| numpy-where-positions-20261023 | 1 | where의 한 인자 호출에서 반환된 위치와 원본 값을 구분한다. | numpy-index-foundation-01 |
| numpy-where-coordinates-20261023 | 2 | where의 축별 위치 배열을 짝지어 2차원 좌표를 복원한다. | numpy-where-positions-20261023, numpy-shape-01 |
| numpy-where-evaluation-20261023 | 3 | np.where의 조건 선택과 인자 식의 선계산을 구분해 0 나눗셈을 진단한다. | numpy-where-source-20261021, numpy-where-positions-20261023 |
| pandas-isin-cells-20261023 | 1 | DataFrame.isin의 원소별 마스크와 행 필터를 구분한다. | pandas-isin-values-20261021 |
| pandas-isin-column-rules-20261023 | 2 | DataFrame.isin에 사전을 주었을 때 열별 허용값으로 마스크를 만든다. | pandas-isin-cells-20261023 |
| pandas-isin-cross-columns-20261023 | 3 | 전역 포함 검사와 열별 업무 규칙을 행 단위로 축약한 결과를 비교한다. | pandas-isin-column-rules-20261023, numpy-row-all-20261023 |
| numpy-row-all-20261023 | 1 | 불리언 배열의 all(axis=1)에서 행별 전체 조건을 읽는다. | numpy-axis-01 |
| numpy-finite-rows-20261023 | 2 | 유한성 마스크를 행별로 축약해 표의 구조를 유지하며 유효 행을 선택한다. | numpy-finite-mask-20261021, numpy-row-all-20261023 |
| numpy-finite-ratios-20261023 | 3 | 유한한 입력과 비유한한 계산 결과를 구분해 산출값 검증 시점을 판단한다. | numpy-finite-rows-20261023, numpy-finite-average-20261021 |
| numpy-scalar-types-20261023 | 1 | NumPy 정수 스칼라와 Python 내장 int의 isinstance 결과를 구분한다. | numpy-index-foundation-01 |
| numpy-integer-inputs-20261023 | 2 | Python/NumPy 정수를 함께 허용하고 bool과 변환 가능한 문자열을 구분한다. | numpy-scalar-types-20261023, python-bool-type-20261021 |
| numpy-coercion-types-20261023 | 3 | 배열 생성의 타입 통일로 원래 bool 정보가 사라지는 검증 순서 문제를 진단한다. | numpy-integer-inputs-20261023, python-numeric-inputs-20261021 |
| sql-nullif-ratio-20261023 | 2 | NULLIF와 COALESCE를 연결해 0/결측 분모의 결과와 행 보존을 추적한다. | sql-rows-foundation-02, sql-null-02 |
| sql-empty-membership-20261023 | 3 | SQLite의 빈 제외 집합과 NULL을 포함한 제외 집합의 차이를 판단한다. | sql-exists-20261017, sql-where-02, sql-count-01 |

각 문항은 개별 오답 가설3개·진단 질문·힌트2개·보충 경로·다른 날 변형·경계 사례를 검토한 뒤 item_reviewed로 등록했다. 기초에서 과도한 새 문법을 쌓지 않고 확인한 동작을 재사용한다. 과제 family는 숫자만 다른 복제에 부여하지 않았다. 정답 위치는 보기 전반에 분산했고 의미가 겹치는 선택지는 제외했다. 새 카드 자동 승인이나 Gemini/API 호출은 없다.

## 검증과 미확인 사항

앱 밖 초안을 개별 재풀이한 실제 NumPy/pandas/SQLite 출력14개가 정답과 일치했다. 별도 테스트58개는 참조·단일 정답·허용표현·초보자/187개 보존, 빈 입력·비정방/축·누락 열 규칙·0/NaN/양음무한대/오버플로·예외·safe divide·정수 폭·bool/object dtype·빈 SQL 집합과 NULL 한 행을 검증한다.

전체 출시·모바일/기록 보존과 원격 Pages·공개 파일 일치는 EV-052와 후속 원격 증거에 구분해 기록한다. 실제 학습효과·다른날 변형/지연복습·난이도/시간 보정은 WBS-520/530의 관찰 대상이다.

## 최종 로컬 결과

Python904/Node20·독립58개, 관리/콘텐츠·SQL표시입력/선수·카드/포맷/타입/서버·웹빌드 통과. 모바일 전체43개 성공 후 로컬 GET 연결 리셋이 발생한 기존배치1개를 동일소스로 재실행해 고유44개 성공을 확인했다. 단일 전체성공으로 표현하지 않는다. 새14개 양모드 실제풀이·추가학습·백업/기존snapshot 보존과 초기실패/수정은 [EV-052](../planning/evidence/EV-052.md)에 구분했다. 원격 Pages/공개자산은 후속 기록한다.
