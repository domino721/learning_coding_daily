"""Versioned, hand-authored learning content. Answers are never sent before completion."""
from dataclasses import dataclass


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
    version: int = 1

    def matches(self, answer: str) -> bool:
        return answer.strip() in (self.answer, *self.accepted)


EXERCISES = [
    Exercise(
        "pandas-select-01", "열 선택", "choice", "필요한 열만 꺼내기",
        "매출표에서 amount 열만 선택하려고 해요. 어떤 코드를 쓰면 될까요?",
        'import pandas as pd\ndf = pd.DataFrame({\n    "item": ["커피", "차"],\n    "amount": [4000, 3000]\n})',
        'df["amount"]', 'df["amount"]는 amount 열을 Series로 선택합니다. 행을 걸러내는 조건식과 구분해 주세요.',
        ('대괄호 안에 필요한 열의 이름을 넣어요.', '열 이름은 문자열입니다. amount를 따옴표로 감싸 보세요.'),
        ('df["amount"]', 'df.amount()', 'df[4000]', 'df.row("amount")'),
    ),
    Exercise(
        "pandas-filter-01", "행 필터링", "choice", "조건에 맞는 행 찾기",
        "80점 이상인 행은 몇 개일까요?",
        'import pandas as pd\ndf = pd.DataFrame({"score": [72, 85, 93]})\nprint(len(df[df["score"] >= 80]))',
        '2', '85점과 93점 두 행이 조건을 만족합니다. df[조건]은 True인 행만 남깁니다.',
        ('먼저 각 점수가 80 이상인지 생각해 보세요.', '72는 제외되고 85와 93은 남습니다.'),
        ('1', '2', '3', '오류가 발생한다'),
    ),
    Exercise(
        "pandas-null-01", "결측치", "choice", "빠진 값 세어 보기",
        "누락된 주문 금액이 몇 개인지 확인해요. 출력값은 무엇일까요?",
        'import pandas as pd\ndf = pd.DataFrame({"amount": [4000, None, 2000]})\nprint(df["amount"].isna().sum())',
        '1', 'isna()는 결측치인 위치를 True로 표시합니다. sum()은 True의 개수를 합산하므로 1입니다.',
        ('None은 pandas에서 결측치로 취급합니다.', 'isna()의 결과는 [False, True, False]입니다.'),
        ('0', '1', '2', '3'),
    ),
    Exercise(
        "pandas-sort-01", "정렬", "choice", "가장 큰 주문 먼저",
        "내림차순으로 정렬한 뒤 첫 번째 금액은 무엇일까요?",
        'import pandas as pd\ndf = pd.DataFrame({"amount": [3000, 9000, 5000]})\nordered = df.sort_values("amount", ascending=False)\nprint(ordered["amount"].iloc[0])',
        '9000', 'ascending=False는 큰 값부터 정렬합니다. iloc[0]은 정렬 후 첫 위치를 선택합니다.',
        ('ascending=False는 내림차순을 뜻해요.', '정렬하면 금액의 순서는 9000, 5000, 3000입니다.'),
        ('3000', '5000', '9000', '0'),
    ),
    Exercise(
        "pandas-group-01", "그룹 집계", "blank", "매출 합계 구하기",
        "빈칸에 합계를 계산하는 메서드 이름만 적어 주세요. 괄호는 이미 있어요.",
        'import pandas as pd\ndf = pd.DataFrame({"amount": [3000, 4000, 5000]})\ntotal = df["amount"].____()\n# 기대 결과: 12000',
        'sum', 'sum()은 값을 더합니다. 주문 건수 count(), 평균 mean()과 목적이 달라요.',
        ('합계는 영어로 sum이라고 해요.', '괄호 없이 sum만 입력하면 됩니다.'),
    ),
    Exercise(
        "pandas-select-02", "열 선택", "choice", "여러 열 선택하기",
        "선택한 결과에는 열이 몇 개 있을까요?",
        'import pandas as pd\ndf = pd.DataFrame({\n    "item": ["커피"], "amount": [4000], "qty": [2]\n})\nprint(df[["item", "qty"]].shape[1])',
        '2', '열 이름의 리스트를 전달하면 여러 열을 DataFrame으로 선택합니다. shape[1]은 열의 개수입니다.',
        ('바깥 대괄호는 선택, 안쪽 대괄호는 열 이름의 리스트입니다.', 'item과 qty 두 열을 선택했습니다.'),
        ('1', '2', '3', '오류가 발생한다'),
    ),
    Exercise(
        "pandas-filter-02", "행 필터링", "blank", "조건의 경계 살펴보기",
        "1만 원 이상 주문만 남기려면 빈칸에 어떤 비교 연산자를 넣어야 할까요?",
        'import pandas as pd\ndf = pd.DataFrame({"amount": [9000, 10000, 15000]})\nselected = df[df["amount"] ____ 10000]\n# 기대 결과: 10000, 15000인 두 행',
        '>=', '이상은 기준값 자체를 포함합니다. >를 쓰면 10000원 주문이 빠집니다.',
        ('10000원도 포함해야 해요.', '크거나 같다를 뜻하는 >=를 사용합니다.'),
    ),
    Exercise(
        "pandas-null-02", "결측치", "blank", "빈 금액 채우기",
        "누락된 금액을 0으로 채우려 해요. 빈칸에 메서드 이름만 적어 주세요.",
        'import pandas as pd\ndf = pd.DataFrame({"amount": [4000, None, 2000]})\nclean = df["amount"].____(0)\n# 기대 결과: [4000.0, 0.0, 2000.0]',
        'fillna', 'fillna(0)은 결측치만 0으로 채웁니다. 실무에서는 결측을 0으로 바꿔도 되는지 먼저 판단해야 해요.',
        ('결측치를 확인하는 isna()와 채우는 메서드는 달라요.', 'fill과 na를 붙인 fillna입니다.'),
    ),
    Exercise(
        "pandas-sort-02", "정렬", "blank", "값을 바꾸지 않고 정렬하기",
        "작은 금액부터 정렬하려고 해요. 빈칸에 메서드 이름만 적어 주세요.",
        'import pandas as pd\ndf = pd.DataFrame({"amount": [9000, 3000, 5000]})\nordered = df.____("amount")\n# 기대 순서: 3000, 5000, 9000',
        'sort_values', 'sort_values("amount")의 기본값은 오름차순입니다. 반환값을 새 변수에 담으면 원본 df는 유지됩니다.',
        ('인덱스가 아니라 열의 값으로 정렬합니다.', '값(value)의 복수형을 써서 sort_values입니다.'),
    ),
    Exercise(
        "pandas-group-02", "그룹 집계", "choice", "팀별 매출 합치기",
        "A팀의 총매출은 얼마일까요?",
        'import pandas as pd\ndf = pd.DataFrame({\n    "team": ["A", "B", "A"],\n    "amount": [3000, 4000, 5000]\n})\nprint(df.groupby("team")["amount"].sum()["A"])',
        '8000', 'groupby("team")은 같은 팀의 행을 묶습니다. A팀의 3000과 5000을 더하면 8000입니다.',
        ('B팀의 4000은 A팀 합계에 포함하지 않습니다.', 'A팀 두 행의 금액은 3000과 5000입니다.'),
        ('3000', '4000', '8000', '12000'),
    ),
]
BY_ID = {exercise.id: exercise for exercise in EXERCISES}
TRACKS = [
    {"id": "pandas", "name": "pandas · 실무 분석", "description": "작은 데이터로 시작하는 분석 습관", "available": True, "exercise_count": len(EXERCISES)},
    {"id": "algorithms", "name": "코딩테스트", "description": "문자열부터 탐색까지, 한 단계씩", "available": False, "exercise_count": 0},
    {"id": "statistics", "name": "통계 분석", "description": "숫자를 읽고 근거로 판단하는 연습", "available": False, "exercise_count": 0},
]
