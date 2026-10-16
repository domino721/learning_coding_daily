"""Authored data-analysis exercises. Goals belong in prompts; methods belong in hints."""
from dataclasses import dataclass, replace
import re


@dataclass(frozen=True)
class Exercise:
    id: str
    concept: str
    kind: str
    title: str
    prompt: str
    code: str
    answer: str
    explanation: str
    hints: tuple[str, str]
    choices: tuple[str, ...] = ()
    accepted: tuple[str, ...] = ()
    seconds: int = 120
    version: int = 2
    domain: str = "pandas"
    level: int = 1

    concept_id: str = ""
    response_mode: str = "short"
    difficulty: dict | None = None
    reference_setup: str = ""
    reference_output: str = ""

    def matches(self, answer: str) -> bool:
        if self.domain == "SQL" and self.kind == "blank":
            return answer.strip().upper() == self.answer.upper()
        return any(normalize_answer(answer) == normalize_answer(value)
                   for value in (self.answer, *self.accepted))


def normalize_answer(value: str) -> str:
    # Ignore layout and quote style, preserving spaces and escapes inside strings.
    result, quote, escaped, spacing = [], None, False, False
    for char in value.strip():
        if spacing and not quote:
            if result and (result[-1].isalnum() or result[-1] == '_') and (char.isalnum() or char == '_'):
                result.append(' ')
            spacing = False
        if escaped:
            result.append(char)
            escaped = False
        elif quote:
            if char == "\\":
                result.append(char)
                escaped = True
            elif char == quote:
                result.append('"')
                quote = None
            else:
                result.append(char)
        elif char in ("'", '"'):
            quote = char
            result.append('"')
        elif char.isspace():
            spacing = True
        else:
            result.append(char)
    if quote or escaped:
        return '<unclosed string>' + value
    normalized = ''.join(result)
    if re.fullmatch(r"[+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)", normalized):
        return str(float(normalized))
    return normalized


PANDAS = [
    Exercise(
        "pandas-select-01", "Series와 DataFrame 선택", "choice", "리포트 출력 점검",
        "빈칸에 들어갈 코드를 고르세요. 마지막 줄은 [4000, 3000]을 출력해야 합니다.",
        'import pandas as pd\ndf = pd.DataFrame({\n    "item": ["커피", "차"],\n    "amount": [4000, 3000]\n})\nresult = ____\nprint(result.tolist())',
        'df["amount"]', 'df["amount"]는 Series이므로 tolist()로 [4000, 3000]을 만듭니다. df[["amount"]]는 DataFrame이고 tolist()가 없습니다. df.iloc[0]은 첫 행을 꺼냅니다.',
        ('출력할 값과 result가 가져야 할 자료형을 함께 생각해 보세요.', 'Series에는 tolist()가 있지만 DataFrame에는 없습니다. 대괄호의 개수에 따라 반환형이 달라집니다.'),
        ('df["amount"]', 'df[["amount"]]', 'df.iloc[0]', 'df.loc["amount"]'),
    ),
    Exercise(
        "pandas-filter-01", "불리언 인덱싱과 경계값", "choice", "점수 코드 검토",
        "아래 코드의 출력값을 고르세요.",
        'import pandas as pd\ndf = pd.DataFrame({"score": [72, 85, 93]})\nprint(len(df[df["score"] >= 80]))',
        '2', '비교 결과가 [False, True, True]이므로 두 행이 남습니다. len은 남은 행 수인 2를 반환합니다.',
        ('대괄호 안쪽 표현식이 각 행에 대해 어떤 값을 만드는지 보세요.', 'True인 행만 바깥 대괄호에 남습니다. 기준값과 같은 값도 포함하는 연산자인지 확인해 보세요.'),
        ('1', '2', '3', '오류가 발생한다'),
    ),
    Exercise(
        "pandas-null-01", "결측치 마스크", "choice", "주문 데이터 확인",
        "아래 코드의 출력값을 고르세요.",
        'import pandas as pd\ndf = pd.DataFrame({"amount": [4000, None, 2000]})\nprint(df["amount"].isna().sum())',
        '1', 'isna()의 결과는 [False, True, False]입니다. 불리언 값을 더하면 True 개수인 1이 됩니다.',
        ('첫 번째 메서드가 금액 자체를 반환하는지, 불리언 값을 반환하는지 확인해 보세요.', '불리언 값을 더할 때 True는 1, False는 0으로 취급합니다.'),
        ('0', '1', '2', '3'),
    ),
    Exercise(
        "pandas-sort-01", "값 정렬과 위치 인덱싱", "choice", "주문 목록 출력",
        "아래 코드의 출력값을 고르세요.",
        'import pandas as pd\ndf = pd.DataFrame({"amount": [3000, 9000, 5000]})\nordered = df.sort_values("amount", ascending=False)\nprint(ordered["amount"].iloc[0])',
        '9000', 'ascending=False로 큰 값부터 정렬하고 iloc[0]으로 첫 위치를 읽으므로 9000입니다. 기존 행 라벨 0을 읽는 것과 다릅니다.',
        ('ordered에 들어 있는 순서가 원본과 같은지 살펴보세요.', 'iloc은 행 라벨이 아니라 현재 위치를 기준으로 접근합니다.'),
        ('3000', '5000', '9000', '0'),
    ),
    Exercise(
        "pandas-group-01", "단일 열 집계", "blank", "일일 지표 완성",
        "주석의 결과를 얻도록 빈칸에 메서드 이름만 입력하세요.",
        'import pandas as pd\ndf = pd.DataFrame({"amount": [3000, 4000, 5000]})\nvalue = df["amount"].____()\nprint(value)\n# 출력: 12000',
        'sum', '세 금액을 모두 더해야 12000이 됩니다. mean()은 4000, count()는 3이므로 결과가 다릅니다.',
        ('평균, 개수, 전체 금액 중 어떤 값을 만들어야 하는지 입력과 출력을 비교해 보세요.', '각 값이 결과에 한 번씩 기여해야 합니다. 평균을 내거나 개수를 세는 메서드는 맞지 않습니다.'),
    ),
    Exercise(
        "pandas-select-02", "행·열 차원", "choice", "출력 크기 확인",
        "아래 코드의 출력값을 고르세요.",
        'import pandas as pd\ndf = pd.DataFrame({\n    "item": ["커피"], "amount": [4000], "qty": [2]\n})\nprint(df[["item", "qty"]].shape[1])',
        '2', '두 열을 선택한 DataFrame의 shape은 (1, 2)입니다. shape[1]은 열 수인 2입니다.',
        ('shape의 첫 번째 값과 두 번째 값이 각각 무엇을 세는지 생각해 보세요.', 'shape는 (행 수, 열 수) 순서입니다. 원본이 아니라 선택 결과의 크기를 읽습니다.'),
        ('1', '2', '3', '오류가 발생한다'),
    ),
    Exercise(
        "pandas-filter-02", "경계 조건 구현", "blank", "대상 주문 추출",
        "주석의 두 금액이 남도록 빈칸에 연산자를 입력하세요.",
        'import pandas as pd\ndf = pd.DataFrame({"amount": [9000, 10000, 15000]})\nselected = df[df["amount"] ____ 10000]\n# 남아야 할 금액: [10000, 15000]',
        '>=', '기준값 10000도 남아야 하므로 >=가 필요합니다. >만 사용하면 15000만 남습니다.',
        ('기준값과 똑같은 금액의 행이 결과에 포함되어야 하는지 보세요.', '방향뿐 아니라 같은 값도 포함하는지 결정해야 합니다.'),
        level=2,
    ),
    Exercise(
        "pandas-null-02", "결측치 대체", "blank", "입력 데이터 준비",
        "주석의 결과를 얻도록 빈칸에 메서드 이름만 입력하세요.",
        'import pandas as pd\ndf = pd.DataFrame({"amount": [4000, None, 2000]})\nclean = df["amount"].____(0)\n# clean.tolist(): [4000.0, 0.0, 2000.0]',
        'fillna', 'fillna(0)은 결측 위치만 0으로 채웁니다. dropna()는 행을 제거합니다. 실제 분석에서는 결측을 0으로 해석해도 되는지 판단해야 합니다.',
        ('행 수를 줄이지 않고, 비어 있던 위치의 값만 달라져야 합니다.', '인수 0은 열 이름이나 위치가 아니라 비어 있던 곳에 넣을 값입니다.'),
        level=2,
    ),
    Exercise(
        "pandas-sort-02", "정렬 함수 적용", "blank", "리포트 순서 맞추기",
        "주석의 순서를 얻도록 빈칸에 메서드 이름만 입력하세요.",
        'import pandas as pd\ndf = pd.DataFrame({"amount": [9000, 3000, 5000]})\nordered = df.____("amount")\n# ordered["amount"].tolist(): [3000, 5000, 9000]',
        'sort_values', '열의 값으로 정렬하는 sort_values가 필요합니다. sort_index는 행 라벨을 정렬하므로 이 결과를 만들지 못합니다.',
        ('바뀌어야 하는 것은 행 라벨 자체인지, 금액의 순서인지 생각해 보세요.', '행 라벨을 정렬하는 메서드와 열 값을 정렬하는 메서드는 다릅니다.'),
        level=2,
    ),
    Exercise(
        "pandas-group-02", "그룹별 집계", "choice", "팀 리포트 검토",
        "아래 코드의 출력값을 고르세요.",
        'import pandas as pd\ndf = pd.DataFrame({\n    "team": ["A", "B", "A"],\n    "amount": [3000, 4000, 5000]\n})\nprint(df.groupby("team")["amount"].sum()["A"])',
        '8000', '같은 team 값끼리 묶어서 amount를 합산합니다. A팀은 3000 + 5000 = 8000입니다.',
        ('마지막 ["A"]가 원본 행을 읽는지, 중간 결과를 읽는지 보세요.', '중간 결과는 팀 이름을 인덱스로 가지며, 각 팀의 금액이 한 값으로 모입니다.'),
        ('3000', '4000', '8000', '12000'), level=2,
    ),
]
NUMPY = [
    Exercise(
        'numpy-shape-01', '축과 배열 크기', 'choice', '센서 배열 점검',
        '아래 코드의 출력값을 고르세요.',
        'import numpy as np\nx = np.array([[1, 2, 3], [4, 5, 6]])\nprint(x.shape)',
        '(2, 3)', '바깥에 두 행, 각 행에 세 값이 있으므로 shape은 (2, 3)입니다.',
        ('대괄호가 중첩된 구조를 바깥쪽부터 읽어 보세요.', 'shape는 원소 수 하나가 아니라 각 축의 길이를 순서대로 기록합니다.'),
        ('(3, 2)', '(6,)', '(2, 3)', '(2, 1, 3)'), domain='NumPy',
    ),
    Exercise(
        'numpy-axis-01', '축별 연산', 'choice', '집계 결과 점검',
        '아래 코드의 출력값을 고르세요.',
        'import numpy as np\nx = np.array([[1, 2], [3, 4]])\nprint(x.sum(axis=0).tolist())',
        '[4, 6]', 'axis=0인 축을 따라 행들이 합쳐지므로 각 열의 합인 [4, 6]이 남습니다. axis=1이면 [3, 7]입니다.',
        ('axis 인수에 따라 어떤 축이 사라지는지 생각해 보세요.', 'axis=0 연산 후에는 열마다 하나의 결과가 남습니다.'),
        ('[3, 7]', '[4, 6]', '[10]', '10'), domain='NumPy',
    ),
    Exercise(
        'numpy-broadcast-01', '브로드캐스팅', 'choice', '보정값 적용 결과',
        '아래 코드의 출력값을 고르세요.',
        'import numpy as np\nx = np.array([[1, 2], [3, 4]])\nbias = np.array([10, 20])\nprint((x + bias).tolist())',
        '[[11, 22], [13, 24]]', '길이 2인 bias는 마지막 축에 맞춰 각 행에 적용됩니다. 행마다 10 또는 20 하나를 더하는 방식이 아닙니다.',
        ('두 배열의 shape를 오른쪽 축부터 비교해 보세요.', 'bias의 첫 값은 첫 열에, 두 번째 값은 두 번째 열에 적용됩니다.'),
        ('[[11, 12], [23, 24]]', '[[11, 22], [13, 24]]', '[[11, 22]]', '크기가 달라 오류가 난다'), domain='NumPy', level=2,
    ),
    Exercise(
        'numpy-mask-01', '마스크 인덱싱', 'choice', '측정값 코드 검토',
        '아래 코드의 출력값을 고르세요.',
        'import numpy as np\nx = np.array([3, 7, 10, 12])\nprint(x[(x > 5) & (x < 12)].tolist())',
        '[7, 10]', '두 조건이 모두 참인 위치만 선택합니다. 12는 두 번째 조건이 엄격한 <이므로 빠집니다.',
        ('두 비교식의 결과를 같은 위치끼리 연결해 보세요.', '&는 두 조건을 동시에 만족해야 하는 원소별 연산입니다.'),
        ('[7, 10, 12]', '[3, 7, 10]', '[7, 10]', '[3, 12]'), domain='NumPy', level=2,
    ),
    Exercise(
        'numpy-view-01', '뷰와 복사', 'choice', '전처리 뒤 원본 확인',
        '아래 코드의 출력값을 고르세요.',
        'import numpy as np\nx = np.array([1, 2, 3])\ny = x[:2]\ny[0] = 99\nprint(x.tolist())',
        '[99, 2, 3]', '기본 슬라이싱으로 만든 y는 원본 메모리를 공유하는 뷰입니다. 원본 변경을 피하려면 x[:2].copy()를 사용합니다.',
        ('슬라이싱 결과가 별도 메모리를 갖는지 생각해 보세요.', '기본 슬라이싱은 원본과 메모리를 공유합니다. 명시적 copy()가 있는지 보세요.'),
        ('[1, 2, 3]', '[99, 2, 3]', '[99, 2]', '오류가 발생한다'), domain='NumPy', level=2,
    ),
]
SQL = [
    Exercise(
        'sql-where-01', 'SQL 필터 조건', 'blank', '주문 조회 완성',
        '2000원인 주문만 조회되도록 빈칸에 SQL 키워드를 입력하세요.',
        '-- orders\n-- id | amount\n--  1 | 1000\n--  2 | 2000\n--  3 | 2000\nSELECT id FROM orders\n____ amount = 2000\nORDER BY id;',
        'WHERE', 'WHERE는 개별 행에 조건을 적용합니다. HAVING은 그룹 집계 후의 조건에 사용합니다.',
        ('행을 가져오는 단계에서 각 행의 조건을 검사해야 합니다.', 'SELECT와 FROM 뒤에 오는 행 조건 절을 생각해 보세요. 그룹 결과를 검사하는 HAVING과는 다릅니다.'),
        accepted=('where', 'Where'), domain='SQL',
    ),
    Exercise(
        'sql-count-01', 'NULL과 COUNT', 'choice', '주문 건수 검토',
        '아래 SQL이 반환하는 두 값은 무엇일까요?',
        '-- orders(amount): 1000, NULL, 2000\nSELECT COUNT(*), COUNT(amount) FROM orders;',
        '(3, 2)', 'COUNT(*)는 모든 행을 세지만 COUNT(amount)는 해당 열이 NULL인 행을 제외합니다.',
        ('별표를 넘긴 경우와 열 이름을 넘긴 경우가 같은 대상을 세는지 보세요.', 'SQL의 NULL은 값이 없는 상태이며 열 값을 집계할 때 별도로 취급됩니다.'),
        ('(3, 3)', '(2, 2)', '(3, 2)', '(2, 3)'), domain='SQL',
    ),
    Exercise(
        'sql-having-01', '그룹 집계 후 조건', 'blank', '팀별 조회 완성',
        '총금액이 5000을 넘는 팀만 반환하도록 빈칸에 SQL 키워드를 입력하세요.',
        '-- sales(team, amount):\n-- (A, 3000), (A, 4000), (B, 2000)\nSELECT team, SUM(amount) AS total\nFROM sales\nGROUP BY team\n____ SUM(amount) > 5000;',
        'HAVING', '팀별 합계를 만든 후 검사해야 하므로 HAVING입니다. WHERE는 그룹을 만들기 전 개별 행에 적용합니다.',
        ('조건이 개별 거래에 관한 것인지, 한 팀의 여러 거래를 모은 결과에 관한 것인지 보세요.', 'GROUP BY 뒤의 조건은 그룹 집계가 끝난 결과를 검사합니다.'),
        accepted=('having', 'Having'), domain='SQL', level=2,
    ),
    Exercise(
        'sql-join-01', '조인 행 수', 'choice', '고객 리포트 행 수',
        '아래 SQL의 출력값을 고르세요.',
        '-- customers(id): 1, 2\n-- orders(id, customer_id): (10, 1), (11, 1)\nSELECT COUNT(*)\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id;',
        '3', '고객 1은 주문 두 건과 연결되어 두 행이 됩니다. 고객 2도 LEFT JOIN으로 한 행 남으므로 총 3행입니다.',
        ('왼쪽 한 행이 오른쪽 여러 행과 연결될 수 있습니다.', '주문이 없는 고객도 LEFT JOIN 결과에 남습니다.'),
        ('1', '2', '3', '4'), domain='SQL', level=2,
    ),
    Exercise(
        'sql-null-01', 'NULL 비교의 삼치 논리', 'choice', '조회 누락 조사',
        '아래 SQL이 반환하는 id를 고르세요.',
        '-- orders(id, refunded):\n-- (1, 0), (2, 1), (3, NULL)\nSELECT id FROM orders\nWHERE refunded <> 1\nORDER BY id;',
        '[1]', 'NULL <> 1은 True가 아니라 Unknown입니다. WHERE는 True인 행만 남기므로 id 3은 포함되지 않습니다. NULL도 포함하려면 OR refunded IS NULL이 필요합니다.',
        ('NULL은 0이나 False와 같은 값이 아닙니다.', 'WHERE는 조건이 True일 때만 행을 남깁니다. Unknown인 경우도 제외합니다.'),
        ('[1, 3]', '[1]', '[2]', '[3]'), domain='SQL', level=2,
    ),
]
STATISTICS = [
    Exercise(
        'stats-median-01', '중앙값과 이상치', 'choice', '대표값 계산 검토',
        '아래 코드의 출력값을 고르세요.',
        'from statistics import median\nvalues = [1, 2, 3, 4, 100]\nprint(median(values))',
        '3', 'median은 정렬했을 때 가운데 값을 반환하므로 3입니다. 평균 22와 달리 큰 값 100의 영향을 직접 받지 않습니다.',
        ('모든 값을 더해 나누는 함수인지 확인해 보세요.', '값을 크기 순으로 놓았을 때의 위치를 사용하는 대표값입니다.'),
        ('22', '3', '4', '100'), domain='통계',
    ),
    Exercise(
        'stats-weight-01', '가중 평균', 'choice', '전체 전환율 확인',
        '아래 코드의 출력값을 고르세요.',
        'visitors = [90, 10]\nrates = [0.2, 0.8]\nconverted = sum(n * r for n, r in zip(visitors, rates))\nprint(round(converted / sum(visitors), 2))',
        '0.26', '전환 인원은 18 + 8 = 26명이고 전체 방문자는 100명입니다. 두 전환율을 단순 평균 낸 0.5와 다릅니다.',
        ('각 비율의 분모가 같은지 확인해 보세요.', '비율을 바로 더하지 말고, 각 그룹에서 실제 전환한 인원을 먼저 구해야 합니다.'),
        ('0.5', '0.26', '0.8', '0.2'), domain='통계',
    ),
    Exercise(
        'stats-std-01', '표본 표준편차', 'choice', '변동성 수치 확인',
        '아래 코드의 출력값을 고르세요.',
        'import numpy as np\nx = np.array([1, 2, 3])\nprint(round(float(x.std(ddof=1)), 2))',
        '1.0', '평균 2에서 편차 제곱의 합은 2입니다. ddof=1이면 n-1=2로 나눈 후 제곱근을 취하므로 1.0입니다. 기본 ddof=0과 다릅니다.',
        ('ddof 인수가 분모에 어떤 영향을 주는지 살펴보세요.', '분산 계산의 분모는 n-ddof입니다. 표준편차는 분산의 제곱근입니다.'),
        ('0.82', '1.0', '2.0', '0.0'), domain='통계', level=2,
    ),
    Exercise(
        'stats-ab-01', '퍼센트와 퍼센트포인트', 'choice', '실험 리포트 단위 확인',
        '아래 코드의 출력값을 고르세요.',
        'control = 100 / 1000\ntreatment = 120 / 1000\nvalue = (treatment - control) * 100\nprint(round(value, 1))',
        '2.0', '전환율 10%와 12%의 차이는 2퍼센트포인트입니다. 상대 증가율 20%는 (treatment/control-1)*100으로 구합니다.',
        ('코드가 두 비율의 차를 구하는지, 두 비율을 나누는지 보세요.', '절대 차이를 백분율 단위로 바꾸는 계산과 상대 증가율은 다릅니다.'),
        ('20.0', '2.0', '0.02', '1.2'), domain='통계', level=2,
    ),
    Exercise(
        'stats-conditional-01', '조건부 비율의 분모', 'choice', '그룹 지표 확인',
        '아래 코드의 출력값을 고르세요.',
        'events = [("A", 1), ("A", 0), ("A", 0),\n          ("B", 1), ("B", 1)]\ngroup = [bought for team, bought in events if team == "A"]\nprint(round(sum(group) / len(group), 2))',
        '0.33', 'A그룹의 세 명 중 한 명이 구매했으므로 1/3을 반올림한 0.33입니다. 전체의 구매율 3/5=0.6과 구분해야 합니다.',
        ('마지막 분모가 전체 인원인지, 앞에서 만든 대상의 인원인지 확인해 보세요.', 'group에 포함된 값만 분자와 분모에 기여합니다.'),
        ('0.6', '0.33', '0.2', '1.0'), domain='통계', level=2,
    ),
]
MACHINE_LEARNING = [
    Exercise(
        'ml-split-01', '학습·평가 데이터 분리', 'choice', '평가 코드 점검',
        '아래 코드의 출력값을 고르세요.',
        'from sklearn.model_selection import train_test_split\nx = list(range(10))\ntrain, test = train_test_split(\n    x, test_size=0.2, random_state=42\n)\nprint((len(train), len(test)))',
        '(8, 2)', '전체 10개 중 test_size=0.2에 해당하는 2개가 평가용이고 나머지 8개가 학습용입니다. random_state는 분할의 재현성을 정합니다.',
        ('test_size는 학습 데이터와 평가 데이터 중 어느 쪽의 크기를 정하는지 보세요.', '크기 비율과 셔플 순서는 별개의 정보입니다.'),
        ('(2, 8)', '(8, 2)', '(10, 2)', '(8, 10)'), domain='scikit-learn',
    ),
    Exercise(
        'ml-scale-01', 'fit과 transform의 구분', 'choice', '새 입력 처리 결과',
        '아래 코드의 출력값을 고르세요.',
        'from sklearn.preprocessing import StandardScaler\nscaler = StandardScaler().fit([[10.0], [20.0]])\nvalue = scaler.transform([[30.0]])[0, 0]\nprint(round(float(value), 1))',
        '3.0', 'fit에 사용한 평균은 15, 표준편차는 5입니다. 새 입력에도 이 기준을 쓰므로 (30-15)/5=3.0입니다. 새 입력으로 다시 fit하지 않습니다.',
        ('새 입력을 볼 때도 학습 단계에서 구한 기준을 사용하는지 보세요.', 'StandardScaler는 (값-학습 평균)/학습 표준편차로 변환하며 표준편차에 ddof=0을 사용합니다.'),
        ('0.0', '1.0', '2.0', '3.0'), domain='scikit-learn', level=2,
    ),
    Exercise(
        'ml-metric-01', '불균형 데이터와 정확도', 'choice', '모델 점수 확인',
        '아래 코드의 출력값을 고르세요.',
        'from sklearn.metrics import accuracy_score\ny_true = [0] * 19 + [1]\ny_pred = [0] * 20\nprint(accuracy_score(y_true, y_pred))',
        '0.95', '20개 중 19개를 맞혀 정확도는 0.95입니다. 하지만 실제 양성은 하나도 찾지 못합니다. 높은 정확도만으로 유용한 모델이라고 판단하면 안 됩니다.',
        ('이 함수가 전체 정답 비율을 구하는지, 양성을 맞힌 비율을 구하는지 확인해 보세요.', '모든 예측이 0이어도 실제 값이 0인 경우에는 정답으로 셉니다.'),
        ('0.0', '0.05', '0.95', '1.0'), domain='scikit-learn',
    ),
    Exercise(
        'ml-neighbor-01', '최근접 이웃 예측', 'choice', '예측 한 건 확인',
        '아래 코드의 출력값을 고르세요.',
        'from sklearn.neighbors import KNeighborsClassifier\nmodel = KNeighborsClassifier(n_neighbors=1)\nmodel.fit([[0.0], [10.0]], [0, 1])\nprint(model.predict([[8.0]]).tolist())',
        '[1]', '8.0은 학습 입력 0.0보다 10.0에 가깝습니다. 이웃 하나의 레이블인 1을 예측합니다.',
        ('예측에 사용되는 이웃 수와 입력 간의 거리를 보세요.', '8과 두 학습 입력 사이 거리를 각각 비교한 후, 선택된 입력의 레이블을 확인해 보세요.'),
        ('[0]', '[1]', '[8.0]', '[10.0]'), domain='scikit-learn', level=2,
    ),
    Exercise(
        'ml-leakage-01', '전처리 데이터 누수', 'choice', '평가 절차 리뷰',
        '새 데이터에 대한 성능을 평가하려 합니다. 아래 절차의 문제를 바로잡는 수정은 무엇일까요?',
        'import numpy as np\nfrom sklearn.preprocessing import StandardScaler\nx = np.array([[0.0], [2.0], [100.0]])\nscaled = StandardScaler().fit_transform(x)\nx_train, x_test = scaled[:2], scaled[2:]',
        '분리한 학습 데이터에만 fit한 뒤 두 데이터에 transform한다',
        '평가 데이터의 값 100이 평균·표준편차 계산에 이미 사용되었습니다. 먼저 분리하고 학습 데이터로만 fit해야 합니다. random_state를 정하는 것만으로 누수는 해결되지 않습니다.',
        ('학습 기준을 만드는 단계에서 아직 보지 않아야 할 입력을 보았는지 확인해 보세요.', '평가 데이터는 transform에 사용할 수 있지만 전처리 기준을 계산하는 fit에는 사용할 수 없습니다.'),
        ('분리한 학습 데이터에만 fit한 뒤 두 데이터에 transform한다', '분리 후 평가 데이터에 다시 fit한다', '평가 데이터를 더 많이 복제한다', '현재 순서를 유지하고 난수 시드만 고정한다'), domain='scikit-learn', level=2,
    ),
]
# Introduce all five areas early. Stable IDs keep existing progress and completed sessions valid.
EXERCISES = [ex for row in zip(PANDAS[:5], NUMPY, SQL, STATISTICS, MACHINE_LEARNING) for ex in row] + PANDAS[5:]
BLANK_CHOICES = {
    'sql-where-01': ('HAVING', 'WHERE', 'ORDER BY', 'GROUP BY'),
    'sql-having-01': ('WHERE', 'ORDER BY', 'HAVING', 'LIMIT'),
    'pandas-group-01': ('count', 'mean', 'sum', 'max'),
    'pandas-filter-02': ('>', '<=', '==', '>='),
    'pandas-null-02': ('dropna', 'fillna', 'isna', 'notna'),
    'pandas-sort-02': ('sort_index', 'reset_index', 'sort_values', 'value_counts'),
}
EXERCISES = [replace(ex, choices=BLANK_CHOICES[ex.id]) if ex.id in BLANK_CHOICES else ex for ex in EXERCISES]
from backend.extra_content import authored_extras
EXERCISES += authored_extras(Exercise)
from backend.curriculum import attach_metadata
EXERCISES = attach_metadata(EXERCISES)
BY_ID = {exercise.id: exercise for exercise in EXERCISES}
TRACKS = [
    # This storage ID is retained for compatibility with existing personal learning records.
    {"id": "pandas", "name": "데이터 분석", "description": "NumPy · pandas · SQL · 통계 · 머신러닝", "available": True, "exercise_count": len(EXERCISES)},
    {"id": "algorithms", "name": "코딩테스트", "description": "문자열부터 탐색까지, 한 단계씩", "available": False, "exercise_count": 0},
]
