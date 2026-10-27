# 추천 알고리즘·서비스 구성 모형 및 커리큘럼 병목 분석 보고서 (내부 참조용)

> **열람 범위 안내**: 이 문서는 프로젝트 오너(사용자)와 작업 에이전트(AI)가 알고리즘·커리큘럼 현황과 병목, 후속 고도화 방향을 참조하기 위해 작성한 **내부 기술 문서**입니다. 사용자가 명시적으로 요청하기 전까지 `README.md`나 공개 웹 화면(`index.html`, `design.html`)의 외부 안내 링크에 노출하지 않습니다.

- 작성·갱신일: 2026-10-18 (`Asia/Seoul`)
- 기준 버전: 설계 `1.7.0` / 계획 `1.7.0` / 추천 알고리즘 `learning-paths-2.0` / 문제 은행 `v0.3` (총 119문항: 활성 Python 88 · 활성 SQL 26 · 보류 서술형 5)
- 관련 문서: [커리큘럼 운영 기준](CURRICULUM.md), [적응형 학습 규칙](ADAPTIVE_LEARNING.md), [커리큘럼 설계·개선 기록](CURRICULUM_LOG.md)

---

## 1. 실력 측정 및 문제 추천 알고리즘의 수리적 성격

### 1.1 통계·회귀·ML 모형 여부
현재 운영 중인 `learning-paths-2.0` 알고리즘([src/recommendation.ts](../src/recommendation.ts), [backend/curriculum.py](../backend/curriculum.py))은 **사용자의 풀이 데이터가 쌓일수록 파라미터가 학습(fitting)되는 회귀식·통계 모형·머신러닝 모형이 아닙니다.**

- **미사용 모형**: 문항반응이론(IRT, 1PL/2PL/3PL Rasch 모형), 베이지안 지식 추적(BKT), Elo/Glicko 레이팅, 로지스틱 회귀(Logistic Regression), 딥러닝 지식 추적(DKT) 등 연속형 잠재 능력 파라미터 $\theta$나 문항 난이도 파라미터 $\beta$를 추정·갱신하는 확률 모형을 사용하지 않습니다.
- **현재 채택 모형**: [backend/learning_paths.json](../backend/learning_paths.json)의 고정 규칙(`rules`)을 기반으로 동작하는 **100% 결정론적 이산 상태 기계(Deterministic Discrete State Machine) + 사전식 4-튜플 그리디 정렬(Lexicographical Tuple Sort)** 산식입니다.
- **설계 의도**: 초기 베타 단계에서 표본 수가 부족할 때 불투명한 확률 추정치로 문항을 건너뛰거나 오판하는 것을 막고, 모든 추천 결과를 `"도움이 필요했던 개념의 기초를 먼저 확인해요"`처럼 **원인 추적이 가능한 명시적 규칙**으로 설명하기 위함입니다.

---

### 1.2 추천·숙련도 알고리즘의 5대 핵심 산식

#### (1) 독립 해결 판정식 (`isIndependent` / `independent_record`)
단일 문항 풀이 기록 $r$이 사용자의 ‘독립적인 실력 근거’로 인정받기 위한 불리언 조건식입니다.
$$\text{independent}(r) \iff (r.\text{status} == \text{"correct"}) \land (r.\text{hints\_used} == 0) \land (r.\text{attempts\_count} == 1) \land (r.\text{response\_mode} \neq \text{"essay"})$$

- 힌트를 1개라도 열었거나(`hints_used > 0`), 첫 시도에 틀린 뒤 두 번째 시도에 맞혔거나(`attempts_count > 1`), 정답/해설을 먼저 확인한 경우(`revealed`), 혹은 두 번 틀려 오답 처리된 경우(`incorrect`)는 모두 $\text{independent}(r) = \text{false}$가 됩니다.
- 현재 카탈로그 버전과 다른 구버전 문항 풀이(`r.version != current_exercise.version`), 미완료(`pending`), 미래 날짜 기록(`r.local_day > today`)은 관찰 대상에서 제외합니다.

#### (2) 보충 필요(`needs_support`) 상태와 회복 카운터
개념 $c$에 속한 시간순 완료 기록 열 $R_c = (r_1, r_2, \dots, r_m)$에서 마지막 비독립 풀이($\neg\text{independent}(r_k)$)의 인덱스를 $k^*$라 할 때:
$$\text{needs\_support}(c) \iff \exists k^* \text{ s.t. } \neg\text{independent}(r_{k^*}) \;\land\; \left|\{ r_j.\text{id} \mid j > k^* \land \text{independent}(r_j) \}\right| < \text{recovery\_items}\;(=2)$$

- 즉, 힌트 사용이나 오답이 발생하면 그 시점 이후 **같은 개념 안에서 서로 다른 문항 2개를 힌트·재시도 없이 독립 해결**하기 전까지 `needs_support(c) = true`가 유지됩니다.

#### (3) 개념별 숙련 단계 계단 함수 (`conceptStates` / `concept_states`)
개념 $c$에 대해 독립 해결한 고유 문항 집합 $I_c$, 고유 학습 일자 집합 $D_c$, 고유 과제 유형군 집합 $F_c$, 난이도 2 이상($\text{level} \ge 2$) 문항을 독립 해결한 고유 일자 집합 $D_{c,\ge 2}$, 그리고 동일 문항을 첫 독립 해결일 이후 다른 날에 다시 독립 해결한 지연 복습 성공 여부 $\text{retained}_c \in \{\text{true}, \text{false}\}$를 집계합니다.

$$L(c) = \begin{cases}
3 \text{ (조건 변화·전이)} & \text{if } |I_c| \ge 3 \land |D_c| \ge 3 \land |D_{c,\ge 2}| \ge 2 \land |F_c| \ge 3 \land \text{retained}_c \land \neg\text{needs\_support}(c) \\
2 \text{ (적용)} & \text{else if } |I_c| \ge 2 \land |D_c| \ge 2 \land |F_c| \ge 2 \\
1 \text{ (기초 확인)} & \text{otherwise}
\end{cases}$$

- **핵심 제약**: 같은 날 여러 문제를 몰아서 풀어도 날짜 집합 크기 $|D_c|$는 하루에 최대 $+1$만 증가하므로, **하루 만의 몰아 풀기로는 절대 단계 2나 단계 3으로 승급할 수 없습니다.**

#### (4) 간격 반복 복습 스케줄러 (`reviewDue` / `review_due`)
문항 $q$를 날짜 $d_{\text{today}}$에 완료했을 때 다음 복습 예정일 $\text{due}$와 연속 독립 성공 횟수 $\text{streak}$를 정하는 고정 간격(Leitner 변형) 산식입니다.

$$\text{streak}_t = \begin{cases}
0 & \text{if } \neg\text{independent} \\
\text{streak}_{t-1} & \text{if } \text{independent} \land (d_{\text{last}} == d_{\text{today}}) \\
\text{streak}_{t-1} + 1 & \text{if } \text{independent} \land (d_{\text{last}} \neq d_{\text{today}})
\end{cases}$$

$$\Delta d = \begin{cases}
1\text{일} & \text{if } \neg\text{independent} \\
3\text{일} & \text{if } \text{independent} \land \text{streak}_t \le 1 \\
7\text{일} & \text{if } \text{independent} \land \text{streak}_t = 2 \\
14\text{일} & \text{if } \text{independent} \land \text{streak}_t \ge 3
\end{cases}, \qquad \text{due} = d_{\text{today}} + \Delta d$$

#### (5) 적격 후보 게이트(`eligible`)와 일일 묶음 선택 정렬 산식 (`selectExercises` / `select_exercises`)
문항 $q$ (개념 $c$, 난이도 $l = q.\text{level}$)가 오늘 추천 후보가 되려면 다음 3가지 하드 제약(Hard Constraints)을 모두 통과해야 합니다.

1. **선수 개념 게이트**: $\forall p \in \text{prerequisites}(c),\; |I_p| > 0$ (선수 개념에서 최소 1문항 이상 독립 해결).
2. **개념 내 난이도 상한(`limit`) 게이트**:
   $$\text{limit}(c) = \begin{cases}
   1 & \text{if } \text{needs\_support}(c) \\
   3 & \text{else if } L(c) \ge 2 \\
   2 & \text{else if } |I_c| > 0 \\
   1 & \text{otherwise}
   \end{cases}, \qquad q.\text{level} \le \text{limit}(c)$$
3. **문항별 선수(`requires`) 게이트**: $\forall r \in \text{requires}(q),\; \text{known}(r) = \text{true}$
   - 여기서 $\text{known}(r) \iff \text{independent}(\text{latest}(r)) \lor \big(L(\text{concept}(r)) \ge 2 \land \neg\text{needs\_support}(\text{concept}(r))\big)$.

적격 후보 집합 $E_{\text{eligible}}$ 중에서:
- **기본 세션(`extra = false`, 목표 5문항)**:
  1. 기한이 도래한 복습 문항($\text{due}(q) \le d_{\text{today}}$)을 $(\text{due}(q),\; \text{catalog\_index}(q))$ 오름차순으로 **최대 3개(`max_due_reviews = 3`)** 먼저 선택합니다.
  2. 남은 슬롯(최소 2개 ~ 최대 5개)은 아직 완료 기록이 없는 미학습 적격 문항 중 아래 **8-튜플 키가 가장 작은 문항**을 한 문제씩 그리디하게 추가합니다(단, 묶음 내 신규 $l=3$ 문항은 최대 1개로 제한):
     $$\text{SortKey}(q) = \Big(\; \mathbb{I}(\neg\text{needs\_support}(c_q)),\; \text{count}_{\text{batch}}(\text{domain}_q),\; \text{redundant\_L1}(q),\; \text{pick}_{\text{today}}(c_q),\; \text{probe\_ready}(q),\; \big|\text{target}(c_q) - q.\text{level}\big|,\; \text{new\_family}(q),\; \text{catalog\_index}(q) \;\Big)$$
     - $\text{redundant\_L1}(q) \in \{0, 1\}$: 이미 기초를 독립 통과했고($|I_{c_q}| > 0 \land \neg\text{needs\_support}(c_q)$) 미학습 상위 문항의 필수 선수(`requires`)도 아닌 **예비·보충용 단계 1 문항을 후순위로 유예(`1`)**합니다.
     - $\text{pick}_{\text{today}}(c_q) \in \mathbb{N}_0$: 오늘 이미 독립 관찰되었거나 현 배치에 담긴 개념 횟수로, 하루에 개념당 최대 $+1$만 증가하는 `evidence_days` 특성을 고려해 **당일 묶음 내 개념을 분산**합니다.
     - $\text{probe\_ready}(q) \in \{0, 1\}$: 기초 1문항을 통과해 단계 2 탐색(`limit = 2`)이 열린 개념($|I_{c_q}| > 0 \land L(c_q) = 1$)에서 **새로운 과제 유형군(`new_family = 0`)의 단계 2(`application`) 문항을 최우선(`0`) 배치**합니다.
     - $|\text{target}(c_q) - q.\text{level}|$: 개념의 현재 목표 단계($\text{target}(c) = 1$ if 미시작/보충, $2$ if $L(c)=1$, $3$ if $L(c)\ge 2$)와 문항 난이도의 거리입니다.
     - $\text{new\_family}(q) \in \{0, 1\}$: 해당 개념에서 아직 독립 해결하지 않은 과제 유형군(`family`)이면 `0`, 이미 해결한 유형군이면 `1`을 부여해 `families >= 2, 3` 승급 조건과 보충 다양성을 가속합니다.
- **추가 학습 세션(`extra = true`, 목표 5문항)**:
  - 오늘 이미 제시된 문항(`exclude_ids`)을 제외하고, 미학습 적격 문항을 위 `SortKey` 순서로 먼저 채운 뒤 슬롯이 남으면 기한 도래 복습 문항을 채웁니다.

---

## 2. 서비스를 구성하는 그 밖의 모형 및 하위 알고리즘

| 구분 | 구현 파일 | 알고리즘 / 모형 구조 | 역할 및 보안·무결성 경계 |
| :--- | :--- | :--- | :--- |
| **편집 난이도 4축 모형** | [backend/difficulty.json](../backend/difficulty.json) | 문항별 `level`(1~3) 외에 `reasoning_steps`(1~4), `code_load`(1~3), `transfer`(1~3), `distractor_strength`(0~3) 기록 | 현재는 제작자 추정치(`editorial-v1`/`learning-path-v2`)로서 UI/설계 탐색에 표시되며, 자동 가중합 점수로 변환하지 않음 |
| **비실행 답안 정규화기** | [src/records.ts](../src/records.ts), [backend/content.py](../backend/content.py) | 문자열 리터럴 내부/외부 상태 전이 토크나이저 (`normalizeAnswer` / `normalize_answer`) | 사용자 입력을 `eval`/`exec`하지 않고 따옴표 종류, 연산자 공백, `1.0 == 1` 표현 차이를 정규화해 안전하게 채점 |
| **출시 게이트 & SQL 검증기** | [backend/curriculum.py](../backend/curriculum.py), [scripts/validate_sql_content.py](../scripts/validate_sql_content.py) | 선수 그래프 DFS 순환 검출 + 단계 간 선수 연결 검증 + 인메모리 SQLite 주석 파싱 대조 | 미검수 카드, 순환 참조, 기초 없는 응용/전이, 화면 입력과 다른 SQL 정답의 배포를 빌드 단계에서 차단 |
| **이중 저장소 & 단조 병합기** | [src/records.ts](../src/records.ts), [src/recordContract.ts](../src/recordContract.ts) | `localStorage` + `IndexedDB` 리비전(`revision`) 비교 복구 + SHA-256 체크섬 백업 + 제출 UUID(`attempt_id`) 기반 멱등 병합 | 한쪽 저장소 손상/용량 초과 시 복구하며, 백업·동기화 병합 시 이미 완료된 문항을 미완료로 되돌리지 않음 |
| **활성 풀이 시간 타이머** | [src/useActiveTime.ts](../src/useActiveTime.ts), [src/ExerciseCard.tsx](../src/ExerciseCard.tsx) | `document.visibilityState === "visible"` 및 미완료·비통신 조건부 초 단위 카운터 | 백그라운드 방치 시간을 제외한 실제 화면 집중 시간을 기록하되, 풀이 속도로 숙련도를 감점하지 않음 |
| **학습 품질 기술통계기** | [src/learningMetrics.ts](../src/learningMetrics.ts), [src/LearningQuality.tsx](../src/LearningQuality.tsx) | 문항별 독립 정답률·힌트 후 성공률·지연 복습률·유형 전이율·활성 시간 중앙값/IQR·D1/D7 재방문율 계산 | 외부 분석 서버로 개인 로그를 자동 전송하지 않고 기기 내에서 학습 품질과 7일 관찰 지표를 산출 |
| **선택적 계정·동기화 모형** | [backend/accounts.py](../backend/accounts.py), [src/sync.ts](../src/sync.ts) | PBKDF2-HMAC-SHA256 비밀번호 해싱 + SHA-256 세션 토큰 + 사용자별 격리 SQLite 파일(`users/<id>.sqlite3`) | 사용자가 명시적으로 계정을 연결한 경우에만 기기 기록과 서버 DB를 양방향 멱등 병합 |

---

## 3. 베타테스터 피드백 원인 분석: 1일차·2일차 문항 동일성 현상

### 3.1 "1일차에 매번 같은 문제 순서대로 뜨는데 커리큘럼이 적용된 건지?"
이 현상은 버그가 아니라 현재 추천 알고리즘의 **결정론적 초기 조건**과 **로컬 저장소 구조**가 결합되어 나타나는 현상입니다.

1. **초기 이력 부재 시 결정론적 Tie-Breaking**:
   - 신규 사용자의 첫 진입 시 `sessions = []`이므로 모든 개념이 `needs_support = false`, `limit = 1`입니다.
   - 따라서 선수 개념(`prerequisites = []`)과 선수 문항(`requires = []`)이 없는 루트 개념의 단계 1 문항들만 후보가 되며, 난수(Random Shuffle)나 사전 수준 진단(Placement Quiz)이 없으므로 `SortKey`의 마지막 요소인 `catalog_index` 순서대로 항상 고정 선택됩니다.
   - **Python 트랙 1일차 고정 5문항**: `pandas-select-01` $\rightarrow$ `numpy-shape-01` $\rightarrow$ `stats-median-01` $\rightarrow$ `ml-split-01` $\rightarrow$ `numpy-axis-01`
   - **SQL 트랙 1일차 고정 5문항**: `sql-where-01` $\rightarrow$ `sql-rows-foundation-01` $\rightarrow$ `sql-rows-foundation-02` $\rightarrow$ `sql-rows-foundation-03` $\rightarrow$ `sql-rows-foundation-04`
2. **당일 세션 고정 복원 및 브라우저별 저장소 분리**:
   - 같은 날(`Asia/Seoul` 기준) 같은 브라우저에서 재접속하면 새 문제를 뽑지 않고 오늘 생성된 세션을 그대로 복구합니다.
   - 반대로 시크릿 모드, 카카오톡/인스타그램 인앱 브라우저, PC/모바일 등 **서로 다른 브라우저/기기**에서 접속하면 로컬 저장소(`learning-coding-daily:v1`)가 비어 있으므로 매번 다시 ‘1일차 첫 세션’으로 인식되어 동일한 5문제가 순서대로 뜹니다.

### 3.2 "1일차, 2일차마다 사용자마다 동일한 문제가 나오는가?"
- **1일차**: 모든 사용자에게 **100% 동일한 문제와 순서**가 제시됩니다.
- **2일차**: **1일차 풀이 결과에 따라 즉시 분기됩니다.**
  - **1일차에 힌트를 사용했거나 오답/해설 확인이 있었던 사용자**:
    - 해당 문항의 복습 기한이 `+1일(2일차)`로 설정되어 2일차 세션 앞자리에 `복습(review)`으로 배치되고, 해당 개념의 `needs_support = true`가 켜져 같은 개념의 **다른 과제 유형군(`new_family = 0`) 단계 1 기초 문항**이 최우선 보충 추천됩니다.
  - **1일차 5문항을 모두 한 번에 독립 해결한 사용자 (수식 병목 해결 후)**:
    - 1일차에 통과한 4개 루트 개념(`pandas-select`, `numpy-structure`, `stats-summaries`, `ml-evaluation`)의 `limit = 2`가 열리면서, **2일차에 곧바로 4개 루트 개념의 단계 2(`application`) 적용 탐색 문항 4개**(`stats-std-01`, `ml-split-02`, `pandas-alignment-20261017`, `numpy-shape-application-01`)와 새로 해금된 하위 개념 기초 1개(`pandas-filter-01`)가 추천되어 **2일차 종료 즉시 4개 루트 개념이 모두 숙련도 `level = 2`로 승급**합니다.

---

## 4. 병목 해결 현황 및 숙련도 모형 유지·고도화 판단

### 4.1 완전히 해결된 콘텐츠·경로 병목 3종 + 추천 정렬 수식 병목 1종

| 병목 항목 | 기존 상태 | 해결 내용 | 검증 결과 |
| :--- | :--- | :--- | :--- |
| **① 단계 1 보충 회복 데드락 (`recovery_items = 2` 불능)** | 18개 중 **10개 개념**에 단계 1(`foundation`) 문항이 **1개뿐**이어서, 오답/힌트 발생 시 `limit = 1`에 갇힌 채 서로 다른 기초 2문항 독립 해결 조건을 영구히 채울 수 없었음 | 10개 개념 전체에 새로운 과제 유형군(`family`)의 단계 1 문항 13개를 추가해 **18개 전 개념 `L1 >= 2`, `basic_families >= 2` 달성** | 모든 개념에서 오답 후 기초 2문항 독립 해결로 자력 회복 가능 확인 |
| **② SQL 1일차 단일 문항 병목** | SQL 루트 개념(`sql-rows`)의 선수 없는 단계 1 문항이 `sql-where-01` **1개뿐**이어서 SQL 1일차 기본 세션에 1문제만 출제됨 | `sql-rows`에 선수 없는 단계 1 기초 문항 4개(`sql-rows-foundation-01~04`)를 추가해 **SQL 1일차 5문항 정상 출제** | SQL 1일차(기초 5) $\rightarrow$ 2일차(적용 2 + 집계·조인 기초 3) $\rightarrow$ 3일차(적용 4 + 전이 1) 진행 확인 |
| **③ 활성 단계 3(`transfer`) 공백 및 복합 추론 부족** | `numpy-memory`와 `ml-evaluation`의 활성 단계 3 문항이 **0개**(서술형 보류 때문)였고, `ml-evaluation`은 활성 문항이 총 2개뿐이라 단계 3 승급 자체가 불가능했음 | `numpy-memory-transfer-01~02`, `ml-eval-transfer-01~02` 등 다단계 적용·전이 15문항 추가 | 60일 시뮬레이션에서 **Python 15개·SQL 3개 전 개념이 실제로 숙련도 `level = 3`에 도달**함을 검증 |
| **④ 전역 단계 1 수평 스윕(`ex.level` 오름차순) 수식 병목** | `(!needs_support, domain_count, ex.level, idx)` 정렬 때문에 1일차 기초를 100% 통과해도 예비 보충용 L1 문항 35개가 모두 소진될 때(Python 1~6일차 내내)까지 L2·L3 문항이 차단되고 8일차에도 15개 중 14개 개념이 `level = 1`에 머묾 | `SortKey`를 8-튜플로 고도화해 **불필요한 예비 L1 유예(`redundant_L1`) + 당일 개념 분산(`pick_today`) + 해금된 L2 탐색 우선(`probe_ready`) + 목표 단계 거리(`|target - level|`) + 미경험 유형군 우선(`new_family`)** 적용 | Python 2일차 즉시 L2 적용 4문항 진입, 3일차 L3 전이 진입, **8일차 기준 L3 3개·L2 6개 달성**(기존 L3 0개·L2 1개 대비 대폭 개선) |

### 4.2 숙련도 판정 모형(이산 상태 기계) 자체를 현재 단계에서 유지하는 엔지니어링 판단 근거

후보 선택·정렬 수식(`selectExercises`)은 위와 같이 즉시 고도화하되, **개념별 숙련 단계(1~3단계) 판정 규칙(`level2_items=2, level2_days=2, level3_items=3, level3_days=3, recovery_items=2`)과 고정 복습 간격(`1/3/7/14일`) 모형 자체는 현행(`learning-paths-2.0`)을 그대로 유지**하고 다음 우선순위 작업(`WBS-520` 실제 기기 7일 관찰)을 먼저 진행하는 것이 타당합니다.

1. **표본 확보 전 확률/회귀 모형(IRT·BKT) 도입의 과적합·불투명성 위험**:
   - 문항반응이론(IRT)이나 베이지안 지식 추적(BKT)은 문항별 실측 정답률·변별도·추측 파라미터를 추정할 최소 수십~수백 건의 실제 풀이 로그가 필요합니다.
   - `WBS-520`(7일 실기기 관찰) 데이터가 쌓이기 전에 임의의 회귀 계수나 확률 임계값을 넣으면, 오판 시 왜 특정 문항이 추천되었는지 추적(`recommendation_trace`)하기 어려워집니다.
2. **7일 관찰(`WBS-520` / `WBS-530`) 비교 기준선 보존**:
   - 현재 프로젝트의 핵심 다음 단계는 `WBS-520`(7일 기기 관찰)을 통해 문항별 독립 해결률, 힌트 후 성공률, 14일 지연 복습 유지율을 수집하고 `WBS-530`에서 임계값을 보정하는 것입니다.
   - 이번에 수식 병목(④)을 해결함으로써 7일 관찰 기간 동안 사용자가 실제로 단계 1(기초) $\rightarrow$ 단계 2(적용) $\rightarrow$ 단계 3(전이)을 모두 경험할 수 있게 되었으므로, **지금은 숙련도 상태 기계를 고정한 채 `WBS-520` 실사용 데이터를 수집하는 것이 가장 높은 가치를 만듭니다.**

---

## 5. learning-paths-2.2 변경 요약 (2026-10-27, CR-015)

1.2의 판정식(독립 해결·보충·단계·복습 간격)과 `rules` 임계값은 그대로다. 바뀐 것은 후보 게이트와 정렬 키 세 곳이다.

- 개념 상태에 막힌 문항의 단계 `support_level`을 둔다. 보충 중 상한은 $\max(1, \text{support\_level} - 1)$이고, 보충 정렬의 다섯째 값은 `ex.level` 대신 $|\max(1, \text{support\_level}-1) - \text{ex.level}|$이다. 단계 1·2 실패에서는 2.1과 같은 순서다.
- 보충 우선 키(첫 값 0)는 한 묶음에서 개념당 `recovery_items`(2)개까지만 준다. 그 뒤 같은 개념 문항은 일반 정렬 키로 경쟁한다.
- 세 정렬 키 모두 마지막 `catalog_index` 직전에 ‘이번 묶음의 같은 과제 형식 수’를 넣는다. ‘다시 연습’ 대체 키는 (보충 문항 여부, 같은 형식 여부, 단계 차이, catalog_index)다.

규칙과 가상 비교 결과는 [적응형 학습 규칙](ADAPTIVE_LEARNING.md)과 [비교 결과](experiments/learning-paths-v2.2.json)에 있다.
