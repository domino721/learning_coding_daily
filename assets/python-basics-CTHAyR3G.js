var e={schema_version:1,track_id:`python-basics`,lang:`python`,lessons:[{id:`theory-py-values`,version:2,concept_id:`py-values`,title:`값과 연산자`,minutes:10,steps:[{type:`explain`,id:`names`,title:`값에 이름 붙이기`,body:"`=`는 '같다'가 아니라 오른쪽 값을 왼쪽 이름에 담는다는 뜻이에요. 담은 뒤에는 이름으로 그 값을 꺼내 써요. 두 값이 같은지 물을 때는 `==`를 쓰고, 결과는 `True`(참)나 `False`(거짓)예요. `print()`에 값을 쉼표로 여러 개 주면 한 칸씩 띄워 한 줄로 보여 줘요.",code:`price = 3000
count = 2
print(price, count)
print(price * count)
print(price == 3000)`,trace:["`price = 3000` → price라는 이름에 3000을 담아요","`count = 2` → count에 2를 담아요","`print(price, count)` → 두 값을 한 칸 띄워 **3000 2**","`print(price * count)` → 3000 × 2를 계산해 **6000**","`print(price == 3000)` → 같은지 물어서 **True**"],output:`3000 2
6000
True
`,mistake:"`=`와 `==`를 헷갈리기. `price = 3000`은 담기이고, 같은지 비교는 `price == 3000`이에요.",in_code:'`print("합계:", total)`처럼 설명 글자와 값을 함께 출력하는 줄을 자주 봐요. 두 값 사이에 한 칸이 띄워져 `합계: 6000`처럼 나와요.'},{type:`explain`,id:`division`,title:`나눗셈은 세 가지예요`,body:"Python의 나눗셈 연산자는 세 개예요. `/`는 보통 나눗셈이라 소수까지 계산해요. `//`는 나눈 값을 더 작은 쪽 정수로 내린 몫이라, 양수에서는 소수점 아래를 버린 것과 같고 음수에서는 `-23 // 4`가 -6이에요. `%`는 나누고 남은 나머지예요. 23을 4로 나누면 4가 다섯 번 들어가고 3이 남아요(23 = 4 × 5 + 3).",code:`print(23 / 4)
print(23 // 4)
print(23 % 4)
print(12 / 3)`,trace:["`23 / 4` → 소수까지 나눠서 **5.75**","`23 // 4` → 몫만 남겨서 **5**","`23 % 4` → 23에서 4 × 5를 빼고 남은 **3**","`12 / 3` → 나누어떨어져도 `/`는 소수라서 **4.0**"],output:`5.75
5
3
4.0
`,mistake:"`12 / 3`을 4로 읽기. `/`의 결과는 항상 소수라서 4.0이에요. 정수 몫이 필요하면 `//`를 써요.",in_code:"`n % 2 == 0`은 짝수인지 확인하는 흔한 코드예요. 2로 나눈 나머지가 0이면 짝수예요."},{type:`example`,id:`theory-py-values-ex1`,kind:`choice`,title:`시간과 분으로 나누기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`minutes = 135
print(minutes // 60, minutes % 60)`,output:`2 15
`,choices:[`2 15`,`2.25 15`,`2 0.25`,`2.25 0.25`],answer:`2 15`,feedback:{"2.25 15":`//를 소수까지 나누는 /와 같은 나눗셈으로 생각했나요?`,"2 0.25":`%를 나눈 값의 소수 부분으로 생각했나요?`,"2.25 0.25":`//는 /처럼 소수까지 나누고, %는 나눈 값의 소수 부분이라고 생각했나요?`},explanation:`135 // 60은 60이 두 번 들어가니 몫 2이고, 135 % 60은 135에서 60 × 2를 빼고 남은 15예요. 그래서 2 15가 출력돼요.`,card:`division`},{type:`example`,id:`theory-py-values-ex2`,kind:`choice`,title:`나누어떨어질 때`,prompt:`아래 코드의 출력값을 고르세요.`,code:`total = 12000
people = 4
print(total / people)`,output:`3000.0
`,choices:[`3000`,`3000.0`,`3000.00`,`3,000`],answer:`3000.0`,feedback:{3e3:`나누어떨어지면 /의 결과가 정수로 나온다고 생각했나요?`,"3000.00":`소수점 아래를 두 자리로 맞춰 보여 준다고 생각했나요?`,"3,000":`print가 큰 숫자에 천 단위 쉼표를 넣는다고 생각했나요?`},explanation:`/는 나누어떨어져도 결과가 소수(float)예요. 12000 / 4는 3000.0이고, print는 소수점 아래를 필요한 만큼만 보여 주니 3000.0으로 나와요.`,card:`division`},{type:`explain`,id:`truthy`,title:`참·거짓으로 보는 값`,body:'조건을 따질 때 Python은 모든 값을 참이나 거짓으로 봐요. `0`과 `0.0`, 빈 문자열 `""`, 빈 리스트 `[]`(3강에서 배우는 값 묶음)처럼 0이거나 비어 있는 값과 `None`(값이 없음)은 거짓이고, 그 밖의 값은 참이에요. `bool()`에 값을 넣으면 Python이 그 값을 어떻게 보는지 확인할 수 있어요.',code:`print(bool(0), bool(25))
print(bool(""), bool("메모"))
print(bool(None), bool([]))`,trace:["`bool(0)` → 0은 거짓 → **False**. `bool(25)` → 0이 아닌 수는 참 → **True**",'`bool("")` → 빈 문자열은 거짓 → **False**. `bool("메모")` → 글자가 있으면 참 → **True**',"`bool(None)`, `bool([])` → 값이 없거나 비어 있으면 거짓 → **False False**"],output:`False True
False True
False False
`,mistake:'따옴표 안의 `"0"`도 거짓이라고 생각하기. `"0"`은 글자가 하나 있는 문자열이라 참이에요.',in_code:"AI가 쓴 코드에서 `if name:`은 'name이 비어 있지 않으면'이라는 뜻이에요. 빈 문자열이 거짓이라서 이렇게 짧게 쓸 수 있어요."},{type:`explain`,id:`or-and`,title:`and·or는 값을 돌려줘요`,body:"`and`와 `or`는 왼쪽 값부터 차례로 참·거짓을 확인해요. `or`는 참인 값을 만나면 그 값을 바로 돌려주고, 끝까지 없으면 마지막 값을 돌려줘요. `and`는 거짓인 값을 만나면 그 값을 바로 돌려주고, 끝까지 없으면 마지막 값을 돌려줘요. 그래서 결과는 True·False가 아니라 원래 값 중 하나예요.",code:`print("" or "기본값")
print("민아" or "기본값")
print(0 and 99)
print(7 and 99)`,trace:['`"" or …` → `""`는 거짓 → 오른쪽으로 → **기본값**','`"민아" or …` → `"민아"`는 참 → 여기서 멈춤 → **민아**',"`0 and …` → `0`은 거짓 → 여기서 멈춤 → **0**","`7 and …` → `7`은 참 → 오른쪽으로 → **99**"],output:`기본값
민아
0
99
`,mistake:"결과가 True나 False일 거라고 생각하기. `print(0 and 99)`는 False가 아니라 0을 출력해요.",in_code:"`city = user_city or \"서울\"`은 'user_city가 비어 있으면 서울을 쓴다'는 뜻이에요. 0도 비어 있다고 보기 때문에, 0이 의미 있는 값이면 이렇게 쓸 때 0이 사라져요. `discount = 0`일 때 `discount or 500`은 500이에요."},{type:`example`,id:`theory-py-values-ex3`,kind:`choice`,title:`빈 값 건너뛰기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`memo = ""
title = None
label = memo or title or "제목 없음"
print(label)`,output:`제목 없음
`,choices:[`제목 없음`,`None`,`False`,`True`],answer:`제목 없음`,feedback:{None:`or가 None에서 멈춘다고 생각했나요?`,False:`or가 True나 False를 돌려준다고 생각했나요?`,True:`셋 중 하나라도 참이면 True가 나온다고 생각했나요?`},explanation:`memo는 빈 문자열이라 거짓, title은 None이라 거짓이에요. or는 참인 값을 찾을 때까지 오른쪽으로 가서 "제목 없음"을 돌려줘요.`,card:`or-and`},{type:`example`,id:`theory-py-values-ex4`,kind:`line`,title:`'판매 중'이 나오는 줄`,prompt:`아래 코드에서 판매 중을 출력하는 줄을 고르세요.`,code:`print(0 and "판매 중")
print("" or "판매 중")
print(None and "판매 중")
print("판매 중" and "")`,output:`0
판매 중
None

`,choices:[`1`,`2`,`3`,`4`],answer:`2`,check:{type:`prints`,target:`판매 중`},feedback:{1:`0이 참이라서 and가 오른쪽 값까지 간다고 생각했나요?`,3:`None이 참이라서 and가 오른쪽 값까지 간다고 생각했나요?`,4:`and가 앞의 참인 값을 돌려준다고 생각했나요?`},explanation:`1번은 0이 거짓이라 and가 0에서 멈추고, 3번은 None이 거짓이라 None에서 멈춰요. 4번은 "판매 중"이 참이라 and가 오른쪽의 빈 문자열까지 가서 빈 줄이 나와요. 판매 중이 출력되는 줄은 앞의 빈 문자열을 건너뛴 2번이에요.`,card:`or-and`},{type:`explain`,id:`float`,title:`소수 계산에는 작은 오차가 있어요`,body:"컴퓨터는 1.1 같은 소수를 2진수로 바꿔 저장하는데, 이때 아주 작은 오차가 생겨요. 그래서 `1.1 + 2.2`는 3.3이 아니라 3.3000000000000003이 돼요. 소수끼리는 `==`로 바로 비교하지 말고, `round(값, 자릿수)`로 자릿수를 맞추거나 두 값의 차이가 아주 작은지 확인해요. `abs()`는 절댓값을 구하고 `1e-9`는 0.000000001이에요. `round()`는 딱 중간(.5)이면 짝수 쪽으로 반올림해요.",code:`price = 1.1 + 2.2
print(price)
print(price == 3.3)
print(round(price, 1) == 3.3)
print(abs(price - 3.3) < 1e-9)
print(round(0.5), round(1.5))`,trace:["`price = 1.1 + 2.2` → 작은 오차가 섞여 3.3000000000000003을 담아요","`print(price)` → 담긴 값을 그대로 보여 줘서 **3.3000000000000003**","`price == 3.3` → 오차 때문에 정확히 같지 않아 **False**","`round(price, 1)` → 소수 첫째 자리까지 맞추면 3.3 → 비교하면 **True**","`abs(price - 3.3) < 1e-9` → 차이가 아주 작으니 **True**","`round(0.5), round(1.5)` → 중간이면 짝수 쪽 → **0 2**"],output:`3.3000000000000003
False
True
True
0 2
`,mistake:"`round(1.5)`는 2이니 `round(0.5)`도 1일 거라고 생각하기. 딱 중간이면 짝수 쪽으로 가서 `round(0.5)`는 0이에요.",in_code:"금액을 다루는 코드에서 `round(합계, 2)`로 소수 둘째 자리까지 맞춘 뒤 비교하거나 출력하는 줄을 자주 봐요. 다만 2.675처럼 딱 중간으로 보이는 값도 2진수로는 조금 작게 저장돼서 `round(2.675, 2)`는 2.68이 아니라 2.67이 돼요."},{type:`example`,id:`theory-py-values-ex5`,kind:`choice`,title:`소수 비교와 반올림`,prompt:`아래 코드의 출력값을 고르세요.`,code:`a = 0.7 + 0.1
print(a == 0.8, round(a, 1) == 0.8, round(4.5))`,output:`False True 4
`,choices:[`True True 5`,`False True 4`,`False True 5`,`False False 4`],answer:`False True 4`,feedback:{"True True 5":`0.7 + 0.1이 정확히 0.8이 되고 round(4.5)는 5가 된다고 생각했나요?`,"False True 5":`round(4.5)가 위로 올라가 5가 된다고 생각했나요?`,"False False 4":`round로 자릿수를 맞춰도 오차가 남아 비교가 틀린다고 생각했나요?`},explanation:`0.7 + 0.1은 오차 때문에 0.7999999999999999가 되어 0.8과 정확히 같지 않아 False예요. round(a, 1)은 0.8이라 비교하면 True이고, round(4.5)는 딱 중간이라 짝수 쪽인 4예요.`,card:`float`},{type:`summary`,points:["`=`는 오른쪽 값을 왼쪽 이름에 담고, 같은지는 `==`로 비교해요.","`/`는 항상 소수, `//`는 몫, `%`는 나머지예요.",'`0`, `""`, `None`, `[]`은 거짓이고, `"0"`처럼 글자가 있으면 참이에요.',"`a or b`는 a가 참이면 a, 아니면 b예요. `a and b`는 a가 거짓이면 a, 아니면 b예요.","소수는 `==`로 바로 비교하지 말고 `round`나 차이로 비교해요. `round()`는 딱 중간이면 짝수 쪽으로 가요."]}],covers:{"py-values-01":[`names`,`division`],"py-values-02":[`truthy`,`or-and`],"py-values-03":[`names`,`float`],"py-values-04":[`or-and`]}},{id:`theory-py-str`,version:2,concept_id:`py-str`,title:`문자열`,minutes:12,steps:[{type:`explain`,id:`index-slice`,title:`번호로 꺼내고 잘라요`,body:"따옴표로 감싼 글자들을 문자열이라고 해요. 글자마다 왼쪽부터 0, 1, 2… 번호가 붙고, `s[번호]`로 한 글자를 꺼내요. 음수 번호는 끝에서부터 세서 `-1`이 마지막 글자예요. `s[시작:끝]`은 시작 번호부터 끝 번호 바로 앞까지 잘라 내고, 시작이나 끝을 비우면 처음부터, 끝까지라는 뜻이에요. `len(s)`는 공백과 기호까지 모두 센 글자 수예요.",code:`city = "서울특별시"
print(city[0], city[-1])
print(city[1:3])
print(city[:2], city[3:])
print(city[-3:])
print(len(city))`,trace:['`city = "서울특별시"` → 서(0) 울(1) 특(2) 별(3) 시(4), 글자마다 번호가 붙어요',"`city[0], city[-1]` → 맨 앞 0번과 맨 끝 -1번 → **서 시**","`city[1:3]` → 1번부터 3번 바로 앞(2번)까지 → **울특**","`city[:2], city[3:]` → 처음부터 2번 앞까지, 3번부터 끝까지 → **서울 별시**","`city[-3:]` → 끝에서 세 번째 글자(특)부터 끝까지 → **특별시**","`len(city)` → 다섯 글자라 **5**. 마지막 번호 4보다 1 커요"],output:`서 시
울특
서울 별시
특별시
5
`,mistake:"`city[1:3]`에 3번 글자까지 들어간다고 생각하기. 끝 번호의 글자는 빠져서 1번과 2번, 두 글자만 나와요. 잘라 낸 글자 수는 끝 번호에서 시작 번호를 뺀 만큼이에요.",in_code:"`text[:20]`처럼 긴 글의 앞부분만 잘라 미리보기로 보여 주는 줄을 자주 봐요. 글이 20글자보다 짧으면 있는 만큼만 나오고 오류는 나지 않아요."},{type:`example`,id:`theory-py-str-ex1`,kind:`line`,title:`'아이스'가 나오는 줄`,prompt:`아래 코드에서 아이스를 출력하는 줄을 고르세요.`,code:`food = "아이스크림"
print(food[1:4])
print(food[0:3])
print(food[0:2])
print(food[-3:])`,output:`이스크
아이스
아이
스크림
`,choices:[`2`,`3`,`4`,`5`],answer:`3`,check:{type:`prints`,target:`아이스`},feedback:{2:`번호가 1부터 시작한다고 생각했나요?`,4:`끝 번호 2의 글자까지 포함된다고 생각했나요?`,5:`음수 번호 -3부터 자르면 앞의 세 글자가 나온다고 생각했나요?`},explanation:`번호는 0부터라 아(0) 이(1) 스(2) 크(3) 림(4)이에요. food[0:3]은 0번부터 3번 바로 앞까지라 아이스이고, food[1:4]는 이스크, food[0:2]는 아이, food[-3:]은 끝의 세 글자 스크림이에요.`,card:`index-slice`},{type:`explain`,id:`plus-times`,title:`문자열의 +와 *`,body:"따옴표 안의 숫자는 수가 아니라 글자예요. 문자열끼리 `+`를 하면 이어 붙이고, 문자열에 정수를 `*`하면 그 횟수만큼 반복해요. 글자로 된 숫자로 계산하려면 `int()`로 정수로 바꾸고, 수를 글자에 이어 붙이려면 `str()`로 문자열로 바꿔요. 글자와 수를 바로 `+`하면 오류가 나요.",code:`page = "12"
print(page + "5")
print(page * 3)
print(int(page) + 5)
print("짝" * 3)
print("총 " + str(4) + "장")`,trace:['`page = "12"` → 따옴표가 있으니 수 12가 아니라 글자 "12"를 담아요','`page + "5"` → 글자끼리 이어 붙여 **125**','`page * 3` → 글자 "12"를 세 번 반복해 **121212**',"`int(page) + 5` → 정수 12로 바꾼 뒤 더해서 **17**",'`"짝" * 3` → 세 번 반복해 **짝짝짝**','`"총 " + str(4) + "장"` → 4를 글자 "4"로 바꿔 이어 붙여 **총 4장**'],output:`125
121212
17
짝짝짝
총 4장
`,mistake:'`"12" + 3`처럼 글자와 수를 바로 더하기. 이어 붙일지 더할지 정할 수 없어서 오류(TypeError, 자료형이 맞지 않는다는 뜻)가 나요. `int()`나 `str()`로 한쪽에 맞춰요.',in_code:"`input()`(화면에서 입력을 받는 기능)으로 받은 값이나 파일에서 읽은 값은 숫자처럼 보여도 문자열이에요. 그래서 계산하기 전에 `int(input())`처럼 먼저 정수로 바꾸는 줄을 자주 봐요."},{type:`example`,id:`theory-py-str-ex2`,kind:`choice`,title:`층과 호수 붙이기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`floor = 3
room = "07"
print(str(floor) + room)`,output:`307
`,choices:[`307`,`10`,`37`,`3 07`],answer:`307`,feedback:{10:`str(floor)로 글자가 된 뒤에도 +가 수를 더한다고 생각했나요?`,37:`따옴표 안의 "07"도 수처럼 앞의 0이 사라진다고 생각했나요?`,"3 07":`+가 print의 쉼표처럼 두 값 사이를 한 칸 띄운다고 생각했나요?`},explanation:`str(floor)는 수 3을 글자 "3"으로 바꿔요. 글자끼리 +는 그대로 이어 붙이고, 따옴표 안의 0도 글자라 사라지지 않아서 307이에요.`,card:`plus-times`},{type:`explain`,id:`methods`,title:`메서드는 새 문자열을 돌려줘요`,body:"문자열 뒤에 점(`.`)을 찍고 부르는 기능을 메서드라고 해요. `strip()`은 앞뒤 공백만 지우고, `lower()`·`upper()`는 소문자·대문자로, `replace(a, b)`는 a를 모두 b로 바꿔요. 이 메서드들은 원래 문자열을 고치지 않고, 바뀐 새 문자열을 돌려줘요. 그래서 결과를 쓰려면 `s = s.strip()`처럼 이름에 다시 담아야 해요. `s.strip().lower()`처럼 이어 쓰면 왼쪽부터 차례로 적용돼요.",code:`item = "  Green Tea Latte "
item.strip()
print(len(item))
item = item.strip().lower()
print(item.replace(" ", "_"))
print(item == "Green Tea Latte")`,trace:['`item = "  Green Tea Latte "` → 앞에 공백 두 칸, 뒤에 한 칸이 붙은 18글자를 담아요',"`item.strip()` → 공백을 지운 새 문자열을 만들지만, 아무 데도 담지 않아 그대로 사라져요","`len(item)` → item은 처음 그대로라 공백까지 세어 **18**","`item = item.strip().lower()` → 앞뒤 공백을 지우고, 이어서 소문자로 바꾼 결과를 item에 다시 담아요",'`item.replace(" ", "_")` → 가운데 공백을 모두 _로 바꿔 **green_tea_latte**','`item == "Green Tea Latte"` → `==`는 글자 하나하나를 비교해서, 대문자 G·T·L이 다르니 **False**'],output:`18
green_tea_latte
False
`,mistake:"`item.strip()`만 쓰고 item이 바뀌었다고 생각하기. 문자열은 고칠 수 없는 값이라 메서드는 새 문자열을 돌려줄 뿐이에요. 돌려받은 값을 담지 않으면 그대로 사라져요.",in_code:"`email = email.strip().lower()`처럼 같은 이름에 결과를 다시 담는 줄을 자주 봐요. 사람이 입력한 값의 공백과 대소문자를 맞춰서 비교하기 쉽게 만드는 흔한 정리 방법이에요."},{type:`example`,id:`theory-py-str-ex3`,kind:`choice`,title:`할인 문구 다듬기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`title = " sale "
title.strip()
title = title.upper()
print("[" + title + "]")`,output:`[ SALE ]
`,choices:[`[ SALE ]`,`[SALE]`,`[ sale ]`,`[sale]`],answer:`[ SALE ]`,feedback:{"[SALE]":`다시 담지 않은 title.strip()도 title의 공백을 지운다고 생각했나요?`,"[ sale ]":`title = title.upper()처럼 다시 담아도 title이 바뀌지 않는다고 생각했나요?`,"[sale]":`strip()은 title을 직접 고치고, 다시 담은 upper()는 적용되지 않는다고 생각했나요?`},explanation:`2번 줄의 title.strip()은 공백을 지운 새 문자열을 만들지만 담지 않아 사라져요. 3번 줄은 upper()의 결과를 title에 다시 담았으니 대문자만 적용돼, 앞뒤 공백이 남은 [ SALE ]이 출력돼요.`,card:`methods`},{type:`explain`,id:`split-join`,title:`나누고 다시 잇기`,body:"`s.split(\"/\")`는 `/`가 나올 때마다 문자열을 잘라, 조각들을 리스트로 돌려줘요. 리스트는 `['a', 'b']`처럼 대괄호 안에 값을 쉼표로 늘어놓은 묶음이고, 다음 강의에서 자세히 배워요. 구분 글자가 연달아 있으면 그 사이의 빈 문자열 `''`도 한 조각이 돼요. 괄호를 비운 `split()`은 공백 덩어리를 기준으로 자르고, 빈 조각을 만들지 않아요. 거꾸로 `\"-\".join(리스트)`는 조각과 조각 사이에 `-`를 넣어 하나의 문자열로 이어요.",code:`tags = "운동/독서//요리"
print(tags.split("/"))
print("운동  독서 요리".split())
print(", ".join(["운동", "독서"]))`,trace:['`tags = "운동/독서//요리"` → 독서와 요리 사이에는 `/`가 두 번 있어요',"`tags.split(\"/\")` → `/`마다 잘라 리스트로 돌려줘요. `//` 사이의 빈 문자열도 조각이라 → **['운동', '독서', '', '요리']**",`\`"운동  독서 요리".split()\` → 공백이 몇 칸이든 한 덩어리로 보고 잘라 → **['운동', '독서', '요리']**`,'`", ".join(["운동", "독서"])` → 두 조각 사이에 쉼표와 공백을 넣어 → **운동, 독서**'],output:`['운동', '독서', '', '요리']
['운동', '독서', '요리']
운동, 독서
`,mistake:'구분 글자를 대충 맞춰도 된다고 생각하기. `split(", ")`는 쉼표 바로 뒤에 공백까지 있는 곳에서만 잘라서, `"a,b"`는 나뉘지 않고 `[\'a,b\']`가 돼요.',in_code:"CSV 파일(쉼표로 칸을 나눈 표 파일)의 한 줄을 `line.split(\",\")`로 칸마다 나누는 코드를 자주 봐요. 빈칸이 있는 줄에서는 `''` 조각이 생겨서, 숫자로 바꾸기 전에 비어 있는지 확인하는 줄이 함께 나와요."},{type:`example`,id:`theory-py-str-ex4`,kind:`choice`,title:`구분 기호 바꾸기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`data = "7;;3;9"
print("+".join(data.split(";")))`,output:`7++3+9
`,choices:[`7++3+9`,`7+3+9`,`19`,`+7++3+9+`],answer:`7++3+9`,feedback:{"7+3+9":`연달아 있는 ; 사이의 빈 조각은 split이 버린다고 생각했나요?`,19:`join이 숫자처럼 보이는 조각들을 더해 준다고 생각했나요?`,"+7++3+9+":`join이 맨 앞과 맨 뒤에도 +를 붙인다고 생각했나요?`},explanation:`data.split(";")는 ['7', '', '3', '9']예요. 연달아 있는 ; 사이의 빈 문자열도 조각이에요. join은 조각과 조각 사이에만 +를 넣으니, 빈 조각 양쪽의 +가 붙어 7++3+9가 돼요.`,card:`split-join`},{type:`explain`,id:`fstring`,title:`f-문자열로 값 넣고 모양 정하기`,body:"따옴표 앞에 `f`를 붙인 f-문자열은 `{}` 안에 쓴 이름이나 계산의 값을 그 자리에 넣어 줘요. `{값:서식}`처럼 콜론 뒤에 보여 줄 모양(서식)을 적을 수 있어요. `,`는 천 단위 쉼표, `.2f`는 소수 둘째 자리까지 반올림(점 뒤의 숫자가 소수 자릿수예요), `.0f`는 소수점 없이 반올림, `.1%`는 100을 곱해 소수 첫째 자리까지 보이고 %를 붙여요. `,.2f`처럼 서식을 함께 쓸 수 있고, 서식은 보여 주는 모양만 바꿀 뿐 담긴 값은 그대로예요.",code:`dist = 12345.678
goal = 0.4567
print(f"총 {dist / 1000}km")
print(f"{dist:,} {dist:,.2f}")
print(f"{dist:.0f} {goal:.1%}")`,trace:["`dist = 12345.678` → 걸은 거리(m)를 담아요","`goal = 0.4567` → 목표를 얼마나 채웠는지 비율을 담아요",'`f"총 {dist / 1000}km"` → `{}` 안의 계산 결과가 그 자리에 들어가 **총 12.345678km**',"`{dist:,}`는 쉼표만 넣고 소수는 그대로, `{dist:,.2f}`는 쉼표를 넣고 소수 둘째 자리까지 반올림 → **12,345.678 12,345.68**","`{dist:.0f}`는 쉼표 없이 소수점 아래를 반올림하고, `{goal:.1%}`는 0.4567에 100을 곱해 소수 첫째 자리까지 → **12346 45.7%**"],output:`총 12.345678km
12,345.678 12,345.68
12346 45.7%
`,mistake:"`{dist:,}`처럼 쉼표만 쓰면 소수점 아래도 정리될 거라고 생각하기. `,`는 쉼표만 넣어요. 자릿수를 줄이려면 `{dist:,.0f}`처럼 함께 적어요.",in_code:'f-문자열보다 먼저 나온 `"{:,}명".format(n)` 같은 줄도 자주 봐요. 앞의 `{}` 자리에 `format()` 괄호 안의 값이 차례로 들어가고, 콜론 뒤 서식 규칙은 f-문자열과 같아요.'},{type:`example`,id:`theory-py-str-ex5`,kind:`choice`,title:`파일 크기 표시`,prompt:`아래 코드의 출력값을 고르세요.`,code:`size = 2048.256
print(f"{size:,.1f}KB")`,output:`2,048.3KB
`,choices:[`2,048.3KB`,`2048.3KB`,`2,048.2KB`,`2,048.256KB`],answer:`2,048.3KB`,feedback:{"2048.3KB":`서식의 ,가 천 단위 쉼표를 넣지 않는다고 생각했나요?`,"2,048.2KB":`.1f가 반올림하지 않고 둘째 자리부터 버린다고 생각했나요?`,"2,048.256KB":`.1f가 소수 자릿수를 바꾸지 않는다고 생각했나요?`},explanation:`,는 천 단위 쉼표를 넣고 .1f는 소수 첫째 자리까지 반올림해요. 2048.256은 2048.2보다 2048.3에 더 가까워서 2,048.3이 되고, 뒤에 KB가 그대로 붙어요.`,card:`fstring`},{type:`example`,id:`theory-py-str-ex6`,kind:`choice`,title:`진행률 표시`,prompt:`아래 코드의 출력값을 고르세요.`,code:`done = 2
tasks = 3
print(f"{done / tasks:.0%}")`,output:`67%
`,choices:[`67%`,`66%`,`1%`,`66.7%`],answer:`67%`,feedback:{"66%":`소수점 아래를 반올림하지 않고 버린다고 생각했나요?`,"1%":`%가 100을 곱하지 않고 끝에 % 기호만 붙인다고 생각했나요?`,"66.7%":`.0%가 소수 첫째 자리까지 보여 준다고 생각했나요?`},explanation:`{} 안의 done / tasks가 먼저 계산돼 0.666…이 돼요. .0%는 100을 곱한 66.666…을 소수점 없이 반올림하고 %를 붙이니 67%예요.`,card:`fstring`},{type:`summary`,points:["글자 번호는 0부터, 음수 번호는 끝에서부터 세요. `s[a:b]`는 b번 바로 앞까지 자르고, `len(s)`는 공백까지 센 글자 수예요.","문자열끼리 `+`는 이어 붙이기, 문자열 `*` 정수는 반복이에요. 계산하려면 `int()`, 이어 붙이려면 `str()`로 바꿔요.","`strip()`·`lower()`·`replace()` 같은 메서드는 새 문자열을 돌려줄 뿐이라 `s = s.strip()`처럼 다시 담아야 해요.","`split(\"/\")`는 연달아 있는 구분 글자 사이에 빈 조각 `''`을 남기고, `split()`은 공백 덩어리로 잘라 빈 조각이 없어요. `join`은 조각 사이에만 글자를 넣어요.","f-문자열 `{값:서식}`에서 `,`는 천 단위 쉼표, `.1f`는 소수 첫째 자리 반올림, `.1%`는 100을 곱해 %를 붙여요."]}],covers:{"py-str-01":[`index-slice`],"py-str-02":[`plus-times`],"py-str-03":[`methods`,`split-join`],"py-str-04":[`fstring`],"py-str-05":[`methods`]}},{id:`theory-py-list`,version:1,concept_id:`py-list`,title:`리스트`,minutes:10,steps:[{type:`explain`,id:`list-basics`,title:`여러 값을 한 이름에 담는 리스트`,body:"리스트는 대괄호 `[]` 안에 값을 쉼표로 늘어놓아 한 이름에 담아요. 안에 든 값 하나하나를 원소라고 하고, 문자열처럼 0부터 번호가 붙어요. `len()`은 원소의 개수예요. 문자열과 달리 리스트는 고칠 수 있어서 `a[1] = 값`으로 그 자리의 원소를 바꿔요. 리스트 안에 든 리스트는 통째로 원소 하나로 세고, `a[1][0]`처럼 번호를 두 번 써서 안쪽 원소를 꺼내요.",code:`menu = ["라면", "김밥", "만두"]
print(menu[0], menu[-1])
menu[1] = "우동"
print(menu, len(menu))
combo = ["밥", ["국", "김"]]
print(len(combo), combo[1][0])`,trace:['`menu = ["라면", "김밥", "만두"]` → 원소 세 개, 번호는 0, 1, 2예요',"`menu[0], menu[-1]` → 문자열처럼 맨 앞과 맨 끝 → **라면 만두**",'`menu[1] = "우동"` → 1번 자리의 김밥을 우동으로 바꿔요',"`print(menu, len(menu))` → 리스트는 대괄호와 따옴표째 보여요 → **['라면', '우동', '만두'] 3**",'`combo = ["밥", ["국", "김"]]` → 0번은 "밥", 1번은 안쪽 리스트 통째로 하나예요',"`len(combo), combo[1][0]` → 원소는 두 개, 1번 리스트의 0번은 국 → **2 국**"],output:`라면 만두
['라면', '우동', '만두'] 3
2 국
`,mistake:"안쪽 리스트의 원소까지 세어 `len(combo)`를 3으로 생각하기. `len()`은 바깥 리스트에 바로 든 원소만 세서, 안쪽 리스트는 몇 개가 들었든 하나예요.",in_code:"`rows[0][2]`처럼 번호를 두 번 쓴 줄은 표 모양 리스트에서 0번 줄의 2번 칸을 꺼낸다는 뜻이에요. 엑셀의 행과 열처럼 앞 번호가 줄, 뒤 번호가 칸이에요."},{type:`example`,id:`theory-py-list-ex1`,kind:`choice`,title:`층별 방 번호`,prompt:`아래 코드의 출력값을 고르세요.`,code:`rooms = [[101], [201, 202], [301]]
print(len(rooms), rooms[1][-1])`,output:`3 202
`,choices:[`3 202`,`4 202`,`2 202`,`3 [301]`],answer:`3 202`,feedback:{"4 202":`안쪽 리스트에 든 방 번호까지 모두 세어 len이 4라고 생각했나요?`,"2 202":`len이 원소 개수가 아니라 마지막 번호를 돌려준다고 생각했나요?`,"3 [301]":`rooms[1][-1]의 -1이 바깥 리스트의 마지막 원소를 가리킨다고 생각했나요?`},explanation:`rooms에는 안쪽 리스트 세 개가 원소로 들어 있어 len은 3이에요. rooms[1]은 [201, 202]이고, 거기서 [-1]은 마지막 원소 202예요.`,card:`list-basics`},{type:`explain`,id:`append-extend`,title:`append와 extend`,body:"`append(값)`은 받은 값을 통째로 리스트 맨 끝에 원소 하나로 넣어요. 리스트를 넘겨도 그 리스트가 원소 하나로 들어가요. `extend(리스트)`는 받은 리스트에서 원소를 하나씩 꺼내 끝에 이어 붙여요. 문자열 메서드와 달리 두 메서드는 리스트 자체를 바로 고쳐요. `a + b`는 원래 리스트를 그대로 두고 둘을 이은 새 리스트를 만들어요.",code:`todo = ["빨래"]
todo.append("청소")
todo.append(["책", "편지"])
print(todo, len(todo))
todo.extend(["산책", "요리"])
print(len(todo), todo[-1])`,trace:['`todo = ["빨래"]` → 원소 하나짜리 리스트예요','`todo.append("청소")` → 끝에 "청소" 하나를 넣어 원소 2개','`todo.append(["책", "편지"])` → 리스트를 통째로 원소 하나로 넣어 원소 3개',"`print(todo, len(todo))` → **['빨래', '청소', ['책', '편지']] 3**",'`todo.extend(["산책", "요리"])` → 두 값을 하나씩 꺼내 붙여 원소 5개',"`len(todo), todo[-1]` → **5 요리**"],output:`['빨래', '청소', ['책', '편지']] 3
5 요리
`,mistake:"`append`에 리스트를 넘기면 값이 하나씩 들어간다고 생각하기. `append`는 무엇을 넘기든 통째로 원소 하나로 넣어요. 하나씩 넣으려면 `extend`를 써요.",in_code:"반복문 안에서 `result.append(값)`으로 결과를 하나씩 모으는 줄을 아주 자주 봐요(반복문은 4강에서 배워요). 다른 리스트를 이어 붙일 때는 `extend`를 쓰거나, 원래 리스트를 지켜야 하면 `+`로 새 리스트를 만들어요."},{type:`example`,id:`theory-py-list-ex2`,kind:`choice`,title:`읽은 쪽수 기록`,prompt:`아래 코드의 출력값을 고르세요.`,code:`pages = [12, 15]
pages.append([20])
pages.extend([8, 9])
print(len(pages), pages[2])`,output:`5 [20]
`,choices:[`5 [20]`,`5 20`,`4 [20]`,`4 20`],answer:`5 [20]`,feedback:{"5 20":`append가 [20]을 풀어서 20 하나를 넣는다고 생각했나요?`,"4 [20]":`extend도 [8, 9]를 통째로 원소 하나로 넣는다고 생각했나요?`,"4 20":`append와 extend의 동작을 서로 바꿔 생각했나요?`},explanation:`append([20])은 리스트 [20]을 통째로 원소 하나로 넣고, extend([8, 9])는 8과 9를 따로 붙여요. 그래서 pages는 [12, 15, [20], 8, 9]로 원소 5개이고, 2번 원소는 [20]이에요.`,card:`append-extend`},{type:`explain`,id:`sort`,title:`sort()와 sorted()`,body:"`리스트.sort()`는 그 리스트를 제자리에서 작은 값부터 정렬해요. 리스트 자체를 바꾸는 대신 돌려주는 값이 없어서, 결과를 이름에 담으면 `None`(값 없음)이 담겨요. `sorted(리스트)`는 원래 리스트를 그대로 두고 정렬된 새 리스트를 돌려줘요. 둘 다 괄호 안에 `reverse=True`를 넣으면 큰 값부터 정렬해요.",code:`laps = [42, 15, 37]
fast = sorted(laps)
print(laps, fast)
got = laps.sort(reverse=True)
print(got, laps)`,trace:["`laps = [42, 15, 37]` → 한 바퀴 기록(초) 세 개를 담아요","`fast = sorted(laps)` → 정렬된 새 리스트를 fast에 담고, laps는 그대로 둬요","`print(laps, fast)` → **[42, 15, 37] [15, 37, 42]**","`got = laps.sort(reverse=True)` → laps를 제자리에서 큰 값부터 정렬하고, 돌려주는 값이 없어 got에는 None이 담겨요","`print(got, laps)` → **None [42, 37, 15]**"],output:`[42, 15, 37] [15, 37, 42]
None [42, 37, 15]
`,mistake:"`laps = laps.sort()`처럼 정렬 결과를 다시 담기. `sort()`는 None을 돌려주니 laps가 None이 되어 기록이 사라져요. `laps.sort()`만 쓰거나 `laps = sorted(laps)`를 써요.",in_code:"원래 순서를 남겨야 할 때는 `top = sorted(data, reverse=True)`처럼 새 리스트를 받고, 바꿔도 될 때는 `data.sort()` 한 줄만 쓰는 코드를 자주 봐요. `sort()`를 쓴 줄 뒤에 그 리스트를 다시 쓰면 이미 정렬된 상태예요."},{type:`example`,id:`theory-py-list-ex3`,kind:`line`,title:`'[40, 31, 25]'가 나오는 줄`,prompt:`아래 코드에서 [40, 31, 25]를 출력하는 줄을 고르세요.`,code:`ages = [31, 25, 40]
print(ages.sort(reverse=True))
print(sorted(ages))
print(ages)`,output:`None
[25, 31, 40]
[40, 31, 25]
`,choices:[`2`,`3`,`4`],answer:`4`,check:{type:`prints`,target:`[40, 31, 25]`},feedback:{2:`sort()가 정렬된 리스트를 돌려줘서 print에 그대로 나온다고 생각했나요?`,3:`sorted()가 바로 앞에서 정한 큰 값부터의 순서를 이어받는다고 생각했나요?`},explanation:`2번 줄의 sort(reverse=True)는 ages를 큰 값부터 바꿔 놓고 None을 돌려줘서 None이 출력돼요. 3번 줄의 sorted(ages)는 작은 값부터 정렬한 새 리스트이고, 4번 줄은 이미 바뀐 ages를 출력해 [40, 31, 25]가 나와요.`,card:`sort`},{type:`explain`,id:`alias`,title:`이름이 둘이어도 리스트는 하나`,body:"`b = a`는 리스트를 복사하지 않고, 같은 리스트에 이름표를 하나 더 붙여요. 그래서 `b`로 고치면 `a`로 봐도 바뀌어 있어요. 따로 쓸 복사본이 필요하면 `a[:]`(처음부터 끝까지 자르기)나 `a.copy()`로 새 리스트를 만들어요. `==`는 원소와 순서가 같은지, `is`는 두 이름이 같은 리스트 하나를 가리키는지 물어요.",code:`plan = ["월", "수"]
note = plan
backup = plan[:]
note[0] = "화"
print(plan, backup)
print(note is plan, backup is plan)`,trace:['`plan = ["월", "수"]` → 리스트를 만들고 plan 이름표를 붙여요',"`note = plan` → 같은 리스트에 note 이름표를 하나 더 붙여요(복사 아님)","`backup = plan[:]` → 처음부터 끝까지 잘라 내용이 같은 새 리스트를 만들어요",'`note[0] = "화"` → note가 가리키는 리스트, 곧 plan의 리스트를 고쳐요',"`print(plan, backup)` → plan은 바뀌고 backup은 그대로 → **['화', '수'] ['월', '수']**","`note is plan, backup is plan` → 같은 리스트면 True, 새로 만든 리스트면 False → **True False**"],output:`['화', '수'] ['월', '수']
True False
`,mistake:"`note = plan`으로 복사본이 생겼다고 생각하기. 이름표만 하나 늘어서, note를 고치면 plan도 바뀌어요.",in_code:"`if result is None:`처럼 `is`는 주로 None인지 확인할 때 써요. 내용이 같은지는 `==`로 봐요. 리스트를 다른 이름에 담거나 다른 리스트에 넣어도 복사되지 않으니, 원본을 지켜야 하면 `data.copy()`로 복사본을 만들어 써요."},{type:`example`,id:`theory-py-list-ex4`,kind:`choice`,title:`내용이 같은 두 리스트`,prompt:`아래 코드의 출력값을 고르세요.`,code:`x = [7, 8]
y = [7, 8]
z = x
print(x == y, x is y, z is x)`,output:`True False True
`,choices:[`True False True`,`True True True`,`True False False`,`False False True`],answer:`True False True`,feedback:{"True True True":`내용이 같으면 is도 True라고 생각했나요?`,"True False False":`z = x가 x를 복사한 새 리스트를 만든다고 생각했나요?`,"False False True":`따로 만든 리스트는 내용이 같아도 ==가 False라고 생각했나요?`},explanation:`x와 y는 따로 만든 두 리스트라 내용은 같지만(==는 True) 같은 리스트는 아니에요(is는 False). z = x는 복사 없이 같은 리스트에 이름을 하나 더 붙이니 z is x는 True예요.`,card:`alias`},{type:`explain`,id:`repeat`,title:`곱하기로 만든 리스트`,body:'`["-"] * 4`처럼 리스트에 정수를 곱하면 원소를 그 횟수만큼 반복한 리스트가 돼요. 이때 원소를 복사하지 않고 같은 값을 여러 자리에 넣어요. 숫자나 문자열은 고칠 수 없는 값이라 문제가 없고, `seats[0] = "X"`처럼 한 자리에 새 값을 넣으면 그 자리만 바뀌어요. 하지만 안쪽이 리스트면 같은 리스트 하나가 모든 자리에 들어가서, `grid[0][0] = "X"`로 고친 내용이 모든 줄에 함께 보여요.',code:`seats = ["-"] * 4
seats[0] = "X"
print(seats)
grid = [["-"] * 2] * 2
grid[0][0] = "X"
print(grid)`,trace:[`\`seats = ["-"] * 4\` → "-"를 네 번 반복해 \`['-', '-', '-', '-']\``,'`seats[0] = "X"` → 0번 자리에만 새 값을 넣어요',"`print(seats)` → 다른 자리는 그대로 → **['X', '-', '-', '-']**","`grid = [[\"-\"] * 2] * 2` → 안쪽 리스트 `['-', '-']` 하나를 만들고, 그 리스트를 두 자리에 똑같이 넣어요",'`grid[0][0] = "X"` → 0번 줄의 0번 칸을 고치면, 두 줄이 같은 리스트라 함께 바뀌어요',"`print(grid)` → **[['X', '-'], ['X', '-']]**"],output:`['X', '-', '-', '-']
[['X', '-'], ['X', '-']]
`,mistake:"`[줄] * 2`가 줄을 두 번 복사한다고 생각하기. 같은 리스트 하나를 두 자리에 넣을 뿐이라, 한 줄을 고치면 다른 줄도 같이 바뀌어요.",in_code:"표나 좌석 배치를 처음 만드는 코드에서 이 함정을 자주 만나요. 줄마다 새 리스트가 필요하면 4강에서 배울 반복문으로 `[[0] * 5 for _ in range(4)]`처럼 줄을 하나씩 새로 만들어요(`_`는 쓰지 않는 반복 이름이에요)."},{type:`example`,id:`theory-py-list-ex5`,kind:`choice`,title:`선반 두 칸`,prompt:`아래 코드의 출력값을 고르세요.`,code:`shelf = [[]] * 2
shelf[0].append("책")
print(shelf)`,output:`[['책'], ['책']]
`,choices:[`[['책'], ['책']]`,`[['책'], []]`,`[[], []]`,`['책', []]`],answer:`[['책'], ['책']]`,feedback:{"[['책'], []]":`[[]] * 2가 빈 리스트를 두 개 따로 만든다고 생각했나요?`,"[[], []]":`shelf[0]으로 넣은 책이 shelf에는 보이지 않는다고 생각했나요?`,"['책', []]":`shelf[0].append가 바깥 리스트의 0번 자리를 책으로 바꾼다고 생각했나요?`},explanation:`[[]] * 2는 빈 리스트 하나를 두 자리에 똑같이 넣어요. shelf[0].append("책")는 그 리스트 자체에 책을 넣으니, 같은 리스트인 두 자리에 모두 보여 [['책'], ['책']]이 돼요.`,card:`repeat`},{type:`summary`,points:["리스트는 `[]` 안에 값을 늘어놓고, 문자열처럼 0부터 번호가 붙어요. 안쪽 리스트는 통째로 원소 하나로 세요.","`append`는 받은 값을 통째로 하나, `extend`는 원소를 하나씩 끝에 넣어요.","`sort()`는 리스트 자체를 바꾸고 None을 돌려주고, `sorted()`는 정렬된 새 리스트를 돌려줘요.","`b = a`는 같은 리스트에 이름만 하나 더 붙여요. 복사본은 `a[:]`나 `a.copy()`로 만들고, `is`는 같은 리스트인지, `==`는 내용이 같은지 물어요.","`[x] * 3`은 같은 x를 세 번 넣어요. x가 리스트면 모든 자리가 같은 리스트라 함께 바뀌어요."]}],covers:{"py-list-01":[`list-basics`,`append-extend`],"py-list-02":[`list-basics`,`sort`],"py-list-03":[`append-extend`,`alias`],"py-list-04":[`list-basics`,`repeat`]}},{id:`theory-py-control`,version:2,concept_id:`py-control`,title:`조건과 반복`,minutes:12,steps:[{type:`explain`,id:`if-basic`,title:`조건이 참일 때만 실행해요`,body:"`if 조건:` 아래에 들여 쓴(보통 공백 네 칸) 줄은 조건이 참일 때만 실행되고, 들여쓰기가 끝난 줄은 항상 실행돼요. 비교는 `>`(크다), `>=`(크거나 같다), `<`(작다), `<=`(작거나 같다), `==`(같다), `!=`(다르다)로 하고, 결과는 True나 False예요. `>=`의 반대는 `<`, `>`의 반대는 `<=`예요. `if`를 여러 번 쓰면 각각 따로 검사해서, 참인 것은 모두 실행돼요.",code:`cups = 3
print(cups >= 3, cups != 3)
if cups >= 2:
    print("두 잔 이상")
if cups > 3:
    print("세 잔 초과")`,trace:["`cups = 3` → 오늘 마신 커피 잔 수 3을 담아요","`cups >= 3, cups != 3` → 3은 3 이상이라 True, 3과 다르지 않아 False → **True False**","`if cups >= 2:` → 3 >= 2는 참이라 들여 쓴 다음 줄을 실행해요",'`print("두 잔 이상")` → **두 잔 이상**',"`if cups > 3:` → 새 if라 따로 검사해요. 3 > 3은 거짓이라 아래 줄을 건너뛰어요",'`print("세 잔 초과")` → 실행되지 않아요'],output:`True False
두 잔 이상
`,mistake:"`>`와 `>=`를 같은 뜻으로 읽기. `3 > 3`은 False이고 `3 >= 3`은 True예요. 기준값과 딱 같은 수가 들어가는지가 달라요.",in_code:"`if` 줄 끝에는 꼭 콜론(`:`)이 붙고, 그 아래 같은 깊이로 들여 쓴 줄까지가 한 덩어리예요. 들여쓰기가 어긋나면 IndentationError(들여쓰기 오류)가 나거나 엉뚱한 덩어리로 읽혀요."},{type:`example`,id:`theory-py-control-ex1`,kind:`choice`,title:`걸음 수 배지`,prompt:`아래 코드의 출력값을 고르세요.`,code:`steps = 8000
badge = 0
if steps >= 5000:
    badge = badge + 1
if steps >= 7000:
    badge = badge + 1
if steps > 8000:
    badge = badge + 1
print(badge)`,output:`2
`,choices:[`1`,`2`,`3`],answer:`2`,feedback:{1:`앞의 if가 참이면 뒤의 if는 검사하지 않는다고 생각했나요?`,3:`> 8000이 8000과 같은 수도 포함한다고 생각했나요?`},explanation:`세 if는 각각 따로 검사해요. 8000은 5000 이상, 7000 이상이라 두 번 1씩 더해지고, 8000 > 8000은 거짓이라 세 번째는 건너뛰어서 2예요.`,card:`if-basic`},{type:`explain`,id:`elif-chain`,title:`elif 묶음은 한 칸만 실행해요`,body:"`elif`(아니면 만약)와 `else`(그 밖에 모두)는 바로 위의 `if`와 이어져 한 묶음이 돼요. 묶음은 위에서부터 조건을 검사해 처음으로 참인 칸 하나만 실행하고, 그 아래 칸은 조건이 참이어도 검사하지 않아요. `else`는 위의 조건이 모두 거짓일 때만 실행돼요. 그래서 범위를 나눌 때는 좁은 조건을 먼저 써요. 묶음이 끝난 뒤 새로 쓴 `if`는 앞 묶음의 결과와 상관없이 다시 검사해요.",code:`temp = 31
if temp >= 25:
    print("더움")
elif temp >= 30:
    print("폭염")
print(temp >= 30)`,trace:["`temp = 31` → 기온 31을 담아요","`if temp >= 25:` → 31 >= 25는 참이라 이 칸을 실행해요",'`print("더움")` → **더움**. 묶음에서 한 칸이 실행됐으니 여기서 끝나요',"`elif temp >= 30:` → 앞 칸이 이미 실행돼 검사하지 않고 건너뛰어요",'`print("폭염")` → 실행되지 않아요',"`print(temp >= 30)` → 묶음 밖의 줄이에요. 조건만 따로 보면 **True**인데도 폭염은 나오지 않았어요"],output:`더움
True
`,mistake:"더 꼭 맞는 칸이 실행될 거라고 생각하기. 31은 30 이상이지만 `temp >= 25`가 먼저 참이라 더움에서 끝나요. 폭염을 먼저 걸러 내려면 `temp >= 30`을 위에 써요.",in_code:"배송비나 할인율을 금액 구간으로 나누는 코드에서 `if … elif … else` 묶음을 자주 봐요. 조건이 좁은 것(큰 기준)부터 차례로 쓰였는지 먼저 확인하면 구간이 어긋나는 실수를 찾기 쉬워요."},{type:`example`,id:`theory-py-control-ex2`,kind:`choice`,title:`나이별 요금`,prompt:`아래 코드의 출력값을 고르세요.`,code:`age = 70
if age >= 65:
    price = 5000
elif age >= 20:
    price = 9000
else:
    price = 6000
print(price)`,output:`5000
`,choices:[`5000`,`9000`,`6000`],answer:`5000`,feedback:{9e3:`참인 칸이 모두 차례로 실행돼 마지막에 담은 값이 남는다고 생각했나요?`,6e3:`참인 조건이 둘 이상이면 else로 넘어간다고 생각했나요?`},explanation:`70은 65 이상이라 첫 칸이 참이고, 묶음은 그 칸 하나만 실행해요. age >= 20도 참이지만 검사하지 않고 else도 건너뛰어 price는 5000이에요.`,card:`elif-chain`},{type:`explain`,id:`for-range`,title:`for와 range로 반복해요`,body:"`for k in range(4):`는 range가 만드는 수를 하나씩 k에 담으면서, 들여 쓴 줄을 매번 실행해요. `range(4)`는 0, 1, 2, 3이고 `range(3, 7)`은 3부터 6까지처럼, 끝 값은 들어가지 않아요. 세 번째 값은 간격이라 `range(0, 20, 5)`는 0, 5, 10, 15예요. `points += k`는 `points = points + k`를 줄여 쓴 것으로, 반복하며 합계를 쌓을 때 써요. 반복이 끝나도 k에는 마지막으로 받은 값이 남아요.",code:`print(list(range(3, 7)))
print(list(range(0, 20, 5)))
points = 0
for k in range(4):
    points += k
print(points, k)`,trace:["`list(range(3, 7))` → range가 만드는 수를 리스트로 바꿔 보면 3부터 7 바로 앞까지 → **[3, 4, 5, 6]**","`list(range(0, 20, 5))` → 0에서 시작해 5씩 늘며 20 전까지 → **[0, 5, 10, 15]**","`points = 0` → 합계를 쌓을 이름을 0으로 시작해요","`for k in range(4):` → k에 0, 1, 2, 3을 차례로 담아 아래 줄을 네 번 실행해요","`points += k` → 0, 1, 3, 6 순서로 쌓여요","`print(points, k)` → 들여 쓰지 않아 반복이 끝난 뒤 한 번만 실행되고, k에는 마지막 값 3이 남아 **6 3**"],output:`[3, 4, 5, 6]
[0, 5, 10, 15]
6 3
`,mistake:"반복이 끝나면 k가 끝 값 4가 된다고 생각하기. `range(4)`는 4를 만들지 않아서 k는 3까지만 받고, 반복이 끝난 뒤에도 3이 남아요.",in_code:"`for i in range(len(names)):`처럼 리스트의 번호로 반복하는 줄을 자주 봐요. range가 0부터 개수 바로 앞까지 만들어서, 리스트의 모든 번호를 한 번씩 돌아요."},{type:`example`,id:`theory-py-control-ex3`,kind:`choice`,title:`간격을 두고 모으기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`picked = []
for i in range(3, 15, 4):
    picked.append(i)
print(picked)`,output:`[3, 7, 11]
`,choices:[`[3, 7, 11]`,`[3, 7, 11, 15]`,`[3, 4, 5, 6]`,`[0, 4, 8, 12]`],answer:`[3, 7, 11]`,feedback:{"[3, 7, 11, 15]":`range의 끝 값 15도 들어간다고 생각했나요?`,"[3, 4, 5, 6]":`세 번째 값 4가 간격이 아니라 만들 수의 개수라고 생각했나요?`,"[0, 4, 8, 12]":`range가 첫 번째 값과 상관없이 0부터 시작한다고 생각했나요?`},explanation:`range(3, 15, 4)는 3에서 시작해 4씩 늘며 15 바로 앞까지라 3, 7, 11이에요. 다음 수 15는 끝 값이라 들어가지 않고, 반복마다 append로 하나씩 넣어 [3, 7, 11]이 돼요.`,card:`for-range`},{type:`explain`,id:`break-continue`,title:`break는 멈추고 continue는 건너뛰어요`,body:"`for x in 리스트:`처럼 range 자리에 리스트를 두면 원소를 앞에서부터 하나씩 x에 담아 반복해요. 반복 안에서 `break`를 만나면 반복 전체를 그 자리에서 끝내고, 남은 원소는 보지 않아요. `continue`를 만나면 이번 차례의 아래 줄만 건너뛰고 다음 원소로 넘어가요. 둘 다 보통 `if` 안에 두어, 특정 원소를 만났을 때만 동작하게 해요.",code:`for x in [4, 9, 6, 2, 8]:
    if x == 9:
        continue
    if x == 2:
        break
    print(x)`,trace:["`for x in [4, 9, 6, 2, 8]:` → 원소를 4부터 하나씩 x에 담아요","`if x == 9:` → x가 9인 차례에만 아래 줄을 실행해요","`continue` → 9는 남은 줄(print)을 건너뛰고 다음 원소 6으로 넘어가요","`if x == 2:` → x가 2인 차례에만 아래 줄을 실행해요","`break` → 2를 만나면 반복을 통째로 끝내서 8은 보지도 않아요","`print(x)` → 건너뛰거나 멈추지 않은 4와 6만 한 줄씩 → **4**, **6**"],output:`4
6
`,mistake:"`continue`도 반복을 멈춘다고 생각하기. `continue`는 이번 차례만 건너뛰고 다음 원소부터 계속 돌아요. 반복을 끝내는 것은 `break`예요.",in_code:"파일의 줄을 하나씩 읽는 `for line in lines:` 안에서 빈 줄이면 `continue`로 넘기고, 끝 표시를 만나면 `break`로 멈추는 코드를 자주 봐요. 요구사항이 '하나만 건너뛰기'인지 '그 뒤는 모두 멈추기'인지 읽고 둘 중 하나를 골라요."},{type:`example`,id:`theory-py-control-ex4`,kind:`choice`,title:`코드 목록 읽기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`codes = ["A1", "B2", "STOP", "C3"]
out = []
for c in codes:
    if c == "STOP":
        break
    out.append(c)
print(out)`,output:`['A1', 'B2']
`,choices:[`['A1', 'B2']`,`['A1', 'B2', 'C3']`,`['A1', 'B2', 'STOP']`,`[]`],answer:`['A1', 'B2']`,feedback:{"['A1', 'B2', 'C3']":`break가 STOP 하나만 건너뛰고 반복을 이어 간다고 생각했나요?`,"['A1', 'B2', 'STOP']":`break를 만난 차례에도 아래 줄의 append가 실행된다고 생각했나요?`,"[]":`break를 만나면 그동안 모은 원소까지 사라진다고 생각했나요?`},explanation:`A1과 B2는 조건이 거짓이라 append로 모여요. STOP 차례에는 break가 반복을 바로 끝내서 STOP은 넣지 않고 C3는 보지도 않아, ['A1', 'B2']예요.`,card:`break-continue`},{type:`explain`,id:`one-line`,title:`한 줄로 고르고 거르기`,body:"`A if 조건 else B`는 조건이 참이면 A, 거짓이면 B를 고르는 식이에요. `[식 for t in 리스트]`는 원소를 하나씩 t에 담아 식을 계산한 결과로 새 리스트를 만들어요(리스트 컴프리헨션이라고 불러요). `for` 뒤에 `if 조건`을 붙이면 참인 원소만 남기는 거르개라 개수가 줄 수 있어요. `for` 앞에 `A if 조건 else B`를 쓰면 원소마다 값을 골라 개수가 그대로예요. 거르개 자리에는 `else`를 붙일 수 없어서, `for` 뒤에 `else`를 쓰면 문법 오류가 나요.",code:`now = 27
print("덥다" if now > 25 else "보통")
temps = [12, 27, 31]
print([t for t in temps if t > 25])
print(["덥다" if t > 25 else "보통"
       for t in temps])`,trace:["`now = 27` → 지금 기온 27을 담아요",'`"덥다" if now > 25 else "보통"` → 27 > 25가 참이라 앞의 값 → **덥다**',"`temps = [12, 27, 31]` → 기온 세 개를 담아요","`[t for t in temps if t > 25]` → for 뒤의 if가 25보다 큰 원소만 남겨 → **[27, 31]**",`\`["덥다" if t > 25 else "보통" for t in temps]\` → 대괄호가 아직 닫히지 않아 5~6번 줄이 한 식으로 이어지고, 원소마다 둘 중 하나를 골라 세 개 그대로 → **['보통', '덥다', '덥다']**`],output:`덥다
[27, 31]
['보통', '덥다', '덥다']
`,mistake:"`for` 뒤의 `if`와 앞의 `if … else`를 같은 것으로 보기. 뒤의 `if`는 원소를 빼는 거르개이고, 앞의 `if … else`는 원소마다 값을 고를 뿐 빼지 않아요.",in_code:"옛 코드에서는 `조건 and A or B`로 같은 일을 하기도 해요. 1강의 and·or 규칙대로 조건이 참이면 A, 거짓이면 B가 나오지만, A가 0이나 빈 문자열처럼 거짓인 값이면 B가 나와 버려서 요즘은 `A if 조건 else B`를 써요."},{type:`example`,id:`theory-py-control-ex5`,kind:`choice`,title:`기준 넘는지 표시하기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`vals = [2, 9, 6]
marks = ["O" if v > 5 else "X"
         for v in vals]
print(marks)`,output:`['X', 'O', 'O']
`,choices:[`['X', 'O', 'O']`,`['O', 'O']`,`[9, 6]`,`['O', 'X', 'X']`],answer:`['X', 'O', 'O']`,feedback:{"['O', 'O']":`for 앞의 if·else도 조건에 맞는 원소만 남긴다고 생각했나요?`,"[9, 6]":`조건에 맞는 원소의 원래 값이 남는다고 생각했나요?`,"['O', 'X', 'X']":`v > 5를 'v가 5보다 작다'로 생각했나요?`},explanation:`for 앞의 "O" if v > 5 else "X"는 원소마다 둘 중 하나를 골라요. 2는 5보다 크지 않아 X, 9와 6은 O라서 개수가 그대로인 ['X', 'O', 'O']예요.`,card:`one-line`},{type:`example`,id:`theory-py-control-ex6`,kind:`choice`,title:`오래 기다린 손님`,prompt:`아래 코드의 출력값을 고르세요.`,code:`waits = [14, 4, 23, 6]
slow = [w for w in waits if w >= 10]
print(slow)`,output:`[14, 23]
`,choices:[`[14, 23]`,`[True, False, True, False]`,`[14, 4, 23, 6]`,`[4, 6]`],answer:`[14, 23]`,feedback:{"[True, False, True, False]":`for 뒤의 if가 원소마다 참·거짓을 남긴다고 생각했나요?`,"[14, 4, 23, 6]":`for 뒤의 if가 원소를 거르지 않고 모두 남긴다고 생각했나요?`,"[4, 6]":`조건에 맞는 원소를 빼고 나머지를 남긴다고 생각했나요?`},explanation:`for 뒤의 if w >= 10은 조건이 참인 원소만 남기는 거르개예요. 10분 이상 기다린 14와 23만 원래 값 그대로 남아 [14, 23]이에요.`,card:`one-line`},{type:`summary`,points:["`if` 아래 들여 쓴 줄은 조건이 참일 때만 실행되고, `if`를 여러 번 쓰면 각각 따로 검사해요.","`if`·`elif`·`else` 묶음은 위에서부터 처음 참인 칸 하나만 실행해요. 범위는 좁은 조건부터 써요.","`range(시작, 끝, 간격)`은 끝 값을 넣지 않고, 반복이 끝난 뒤 반복 이름에는 마지막 값이 남아요.","`break`는 반복 전체를 끝내고, `continue`는 이번 차례만 건너뛰고 계속 돌아요.","`for` 앞의 `A if 조건 else B`는 원소마다 값을 골라 개수가 그대로이고, `for` 뒤의 `if`는 원소를 걸러 개수가 줄 수 있어요."]}],covers:{"py-control-01":[`if-basic`,`elif-chain`],"py-control-02":[`for-range`],"py-control-03":[`for-range`,`break-continue`],"py-control-04":[`if-basic`,`one-line`],"py-control-05":[`for-range`,`break-continue`]}},{id:`theory-py-tuple`,version:2,concept_id:`py-tuple`,title:`튜플과 언패킹`,minutes:12,steps:[{type:`explain`,id:`tuple-comma`,title:`쉼표가 튜플을 만들어요`,body:'튜플은 리스트처럼 값을 순서대로 묶지만, 한 번 만들면 고칠 수 없는 묶음이에요. 튜플을 만드는 것은 괄호가 아니라 쉼표라서, `"S", "M"`처럼 괄호 없이 써도 튜플이 되고 `(8)`은 계산 괄호일 뿐인 정수 8이에요. 그래서 원소가 하나인 튜플은 `("XL",)`처럼 끝에 쉼표를 꼭 붙여요. `isinstance(값, 자료형)`은 값이 그 자료형인지 물어 True나 False를 돌려주고, 자료형 이름은 정수 `int`, 문자열 `str`, 리스트 `list`, 튜플 `tuple`이에요.',code:`size = "S", "M", "L"
print(size, size[0])
one = ("XL",)
num = (8)
print(one, len(one), num)
print(isinstance(num, tuple))`,trace:['`size = "S", "M", "L"` → 괄호가 없어도 쉼표로 이어 쓴 값은 튜플 하나로 묶여요',"`print(size, size[0])` → 튜플은 둥근 괄호로 보이고, 번호는 리스트처럼 0부터예요 → **('S', 'M', 'L') S**",'`one = ("XL",)` → 원소가 하나여도 쉼표가 있으니 튜플이에요',"`num = (8)` → 쉼표가 없으니 계산 괄호일 뿐이라 그냥 정수 8이에요","`print(one, len(one), num)` → 원소 하나짜리 튜플은 끝에 쉼표를 붙여 보여 줘요 → **('XL',) 1 8**","`isinstance(num, tuple)` → num은 정수라서 튜플이냐는 물음에 **False**"],output:`('S', 'M', 'L') S
('XL',) 1 8
False
`,mistake:'원소 하나짜리 튜플을 `("XL")`로 쓰기. 쉼표가 없으면 괄호는 계산 순서만 정해서, 그냥 문자열 "XL"이에요. 튜플로 만들려면 `("XL",)`처럼 쉼표를 붙여요.',in_code:"`isinstance(x, (int, float))`처럼 자료형 여러 개를 튜플로 묶어 '이 중 하나인지' 묻는 줄을 자주 봐요. 함수가 `return total, count`처럼 쉼표로 여러 값을 돌려주는 것도 사실 튜플 하나를 돌려주는 거예요(함수는 8강에서 배워요)."},{type:`example`,id:`theory-py-tuple-ex1`,kind:`choice`,title:`괄호와 쉼표`,prompt:`아래 코드의 출력값을 고르세요.`,code:`code = ("A7")
pair = ("A7",)
print(len(code), len(pair))`,output:`2 1
`,choices:[`2 1`,`1 1`,`2 2`,`1 2`],answer:`2 1`,feedback:{"1 1":`괄호로 감싸기만 해도 튜플이 되어 원소 하나로 센다고 생각했나요?`,"2 2":`쉼표를 붙인 튜플도 len이 안쪽 문자열의 글자 수를 센다고 생각했나요?`,"1 2":`괄호만 있는 쪽이 튜플이고, 쉼표를 붙인 쪽이 문자열이라고 거꾸로 생각했나요?`},explanation:`("A7")은 쉼표가 없어 계산 괄호일 뿐이라 문자열 "A7"이고, len은 글자 수 2예요. ("A7",)은 쉼표가 있어 원소 하나짜리 튜플이라 len이 1이에요.`,card:`tuple-comma`},{type:`explain`,id:`unpack`,title:`한 번에 나눠 담기`,body:"`a, b = 값1, 값2`처럼 왼쪽에 이름을 쉼표로 늘어놓으면, 오른쪽 묶음의 값을 순서대로 하나씩 나눠 담아요. 이것을 언패킹(묶음 풀기)이라고 해요. 이때 Python은 오른쪽을 먼저 끝까지 계산해 튜플을 만든 다음에 왼쪽 이름에 담아요. 그래서 `x, y = y, x`는 임시 이름 없이 두 값을 맞바꿔요. 이름의 개수와 값의 개수가 다르면 ValueError(값이 맞지 않는다는 오류)가 나요.",code:`size, price = "M", 9000
print(size, price)
x, y = 1, 1
x, y = y, x + y
x, y = y, x + y
print(x, y)`,trace:['`size, price = "M", 9000` → 오른쪽 튜플의 두 값이 왼쪽 두 이름에 순서대로 담겨요',"`print(size, price)` → **M 9000**","`x, y = 1, 1` → x와 y에 1을 하나씩 담아요","`x, y = y, x + y` → 오른쪽을 먼저 다 계산해 (1, 2)를 만든 뒤 나눠 담아요. x는 1, y는 2","`x, y = y, x + y` → 다시 바뀌기 전 값으로 오른쪽 (2, 3)을 먼저 만들고 나눠 담아요","`print(x, y)` → **2 3**"],output:`M 9000
2 3
`,mistake:"왼쪽부터 한 이름씩 차례로 담는다고 생각하기. `x, y = y, x + y`의 `x + y`는 x가 바뀌기 전 값으로 계산돼요. `x = y`와 `y = x + y` 두 줄로 나눠 쓰면 두 번째 줄은 이미 바뀐 x를 써서 결과가 달라져요.",in_code:'`for name, score in pairs:`처럼 for 문에서 쌍을 바로 두 이름으로 나눠 받는 줄을 아주 자주 봐요. 리스트의 원소가 `("민아", 90)` 같은 튜플이면 반복할 때마다 이 언패킹이 일어나요.'},{type:`example`,id:`theory-py-tuple-ex2`,kind:`choice`,title:`바뀌기 전 값으로 계산`,prompt:`아래 코드의 출력값을 고르세요.`,code:`w, h = 3, 5
w, h = h, w * h
print(w, h)`,output:`5 15
`,choices:[`5 15`,`5 25`,`3 15`,`15 5`],answer:`5 15`,feedback:{"5 25":`w가 먼저 5로 바뀐 뒤에 w * h를 계산한다고 생각했나요?`,"3 15":`왼쪽의 w에는 새 값이 담기지 않고 h만 바뀐다고 생각했나요?`,"15 5":`오른쪽 값이 왼쪽 이름에 거꾸로 담긴다고 생각했나요?`},explanation:`오른쪽 h, w * h를 먼저 계산하면 바뀌기 전 값으로 (5, 15)가 돼요. 그다음 w에 5, h에 15를 나눠 담아서 5 15예요.`,card:`unpack`},{type:`explain`,id:`star-rest`,title:`별표로 나머지 모으기`,body:"왼쪽 이름 하나에 별표(`*`)를 붙이면, 다른 이름들이 자기 몫을 가져간 뒤 남은 값을 모두 그 이름이 받아요. 별표 이름은 튜플을 풀든 리스트를 풀든 언제나 리스트로 받고, 남은 값이 없으면 빈 리스트 `[]`가 돼요. 별표는 한 줄에 하나만 쓸 수 있고 앞, 가운데, 뒤 어디에나 둘 수 있어요. 리스트와 튜플은 서로 다른 자료형이라, 리스트 `[1, 2]`와 튜플 `(1, 2)`는 내용이 같아도 `==`로 비교하면 False예요(수끼리는 자료형이 달라도 `1 == 1.0`처럼 True예요).",code:`top, *rest = ("금", "은", "동")
print(top, rest)
first, *mid, last = (4, 7)
print(first, mid, last)
print(rest == ("은", "동"))`,trace:['`top, *rest = ("금", "은", "동")` → top이 첫 값 "금"을 받고, 별표 붙은 rest가 남은 값을 모두 받아요',"`print(top, rest)` → 별표 이름은 리스트로 받아서 **금 ['은', '동']**","`first, *mid, last = (4, 7)` → 앞뒤 이름이 4와 7을 먼저 가져가고, 남은 값이 없어 mid는 빈 리스트예요","`print(first, mid, last)` → **4 [] 7**",'`rest == ("은", "동")` → 리스트와 튜플은 내용이 같아도 자료형이 달라서 **False**'],output:`금 ['은', '동']
4 [] 7
False
`,mistake:"오른쪽이 튜플이니 별표 이름도 튜플을 받는다고 생각하기. rest는 언제나 리스트라서, 튜플과 `==`로 비교하면 False예요. 튜플이 필요하면 `tuple(rest)`로 바꿔요.",in_code:'`head, *cols = row.split(",")`처럼 맨 앞 칸만 따로 떼고 나머지를 한꺼번에 받는 줄을 자주 봐요. 줄마다 칸 수가 달라도 별표 이름이 남은 만큼 받아 주니 개수가 맞지 않는다는 오류가 나지 않아요.'},{type:`example`,id:`theory-py-tuple-ex3`,kind:`choice`,title:`팀장 빼고 나머지`,prompt:`아래 코드의 출력값을 고르세요.`,code:`team = ("팀장", "민아", "준호")
boss, *crew = team
print(crew)`,output:`['민아', '준호']
`,choices:[`['민아', '준호']`,`('민아', '준호')`,`민아 준호`,`['팀장', '민아', '준호']`],answer:`['민아', '준호']`,feedback:{"('민아', '준호')":`오른쪽이 튜플이면 별표 이름도 튜플로 받는다고 생각했나요?`,"민아 준호":`별표 이름이 값들을 따로따로 받아 print에서 한 칸씩 띄워 보인다고 생각했나요?`,"['팀장', '민아', '준호']":`별표 이름이 앞의 boss가 가져간 값까지 모두 받는다고 생각했나요?`},explanation:`boss가 첫 값 "팀장"을 가져가고, 별표 붙은 crew가 남은 두 값을 받아요. 별표 이름은 튜플을 풀어도 리스트로 받아서 ['민아', '준호']예요.`,card:`star-rest`},{type:`explain`,id:`immutable`,title:`고칠 수 없으니 새로 만들어요`,body:'튜플은 원소를 바꾸거나 더할 수 없어서, `day[0] = "수"`처럼 고치려 하면 TypeError(자료형이 그 동작을 못 한다는 오류)가 나요. 바뀐 튜플이 필요하면 새 튜플을 만들어요. 튜플을 자르면(`day[1:]`) 결과도 튜플이고, 튜플끼리 `+`하면 이어 붙인 새 튜플이 생겨요. 이때 원래 튜플은 그대로 남아요.',code:`day = ("화", 7)
moved = day[:1] + (9,)
print(moved, day)
print(day[1:], ("수",) + day)`,trace:['`day = ("화", 7)` → 요일과 날짜를 튜플로 묶어요',"`moved = day[:1] + (9,)` → 잘라 낸 `('화',)`와 `(9,)`를 이어 붙인 새 튜플을 moved에 담아요","`print(moved, day)` → 새 튜플만 다르고 원래 day는 그대로 → **('화', 9) ('화', 7)**","`print(day[1:], (\"수\",) + day)` → 자른 결과도 튜플이라 `(7,)`이고, `(\"수\",)`를 앞에 이으면 원소가 셋 → **(7,) ('수', '화', 7)**"],output:`('화', 9) ('화', 7)
(7,) ('수', '화', 7)
`,mistake:'`("수") + day`처럼 쉼표 없이 이어 붙이기. `("수")`는 튜플이 아니라 문자열이라 튜플과 `+`할 수 없어서 TypeError가 나요. 값 하나를 붙일 때도 `("수",)`처럼 쉼표를 써서 튜플끼리 더해요.',in_code:"튜플은 고칠 수 없어서, 함수가 돌려주는 여러 값이나 설정값처럼 바뀌면 안 되는 묶음에 자주 써요. `t = t + (값,)`처럼 같은 이름에 다시 담는 줄은 원래 튜플을 고친 게 아니라 새 튜플로 바꿔 끼운 거예요."},{type:`example`,id:`theory-py-tuple-ex4`,kind:`choice`,title:`마지막 계절 두 번`,prompt:`아래 코드의 출력값을 고르세요.`,code:`season = ("봄", "여름", "가을")
end = season[-1:]
print(end + end, len(season))`,output:`('가을', '가을') 3
`,choices:[`('가을', '가을') 3`,`가을가을 3`,`(('가을',), ('가을',)) 3`,`('가을', '가을') 2`],answer:`('가을', '가을') 3`,feedback:{"가을가을 3":`season[-1:]이 튜플이 아니라 마지막 원소 하나(문자열)를 돌려준다고 생각했나요?`,"(('가을',), ('가을',)) 3":`튜플끼리 +하면 두 튜플이 통째로 원소가 된다고 생각했나요?`,"('가을', '가을') 2":`잘라 내면 원래 튜플에서 그 원소가 빠진다고 생각했나요?`},explanation:`season[-1:]은 마지막 원소만 담은 튜플 ('가을',)이에요. 튜플끼리 +하면 원소를 이어 붙인 새 튜플 ('가을', '가을')이 되고, 자르기는 원래 튜플을 바꾸지 않아 len은 그대로 3이에요.`,card:`immutable`},{type:`explain`,id:`rebuild`,title:`묶음째 넣기와 펼쳐 넣기`,body:'튜플 안에 다른 튜플의 이름을 그냥 쓰면, 그 튜플이 통째로 원소 하나로 들어가요. 이름 앞에 별표를 붙인 `(*pair, "초록")`은 pair의 원소를 하나씩 꺼내 그 자리에 펼쳐 넣어요. 리스트처럼 고쳐 가며 만들고 싶으면 `list(튜플)`로 리스트로 바꿔 고친 뒤 `tuple(리스트)`로 다시 튜플로 바꿔요. 어느 방법이든 원래 튜플은 그대로예요.',code:`pair = ("빨강", "파랑")
nest = (pair, "초록")
flat = (*pair, "초록")
print(nest, len(nest))
print(flat, len(flat))
print(tuple(list(pair) + ["흰"]))`,trace:['`pair = ("빨강", "파랑")` → 원소 두 개짜리 튜플이에요','`nest = (pair, "초록")` → pair가 통째로 원소 하나로 들어가요','`flat = (*pair, "초록")` → 별표가 pair를 풀어 "빨강", "파랑"을 따로 넣어요',"`print(nest, len(nest))` → 안쪽 튜플째 원소 하나라 → **(('빨강', '파랑'), '초록') 2**","`print(flat, len(flat))` → 펼쳐 넣어 원소 셋 → **('빨강', '파랑', '초록') 3**",`\`tuple(list(pair) + ["흰"])\` → 리스트로 바꿔 이어 붙이고 다시 튜플로 → **('빨강', '파랑', '흰')**`],output:`(('빨강', '파랑'), '초록') 2
('빨강', '파랑', '초록') 3
('빨강', '파랑', '흰')
`,mistake:'`(pair, "초록")`도 원소가 세 개일 거라고 생각하기. 별표가 없으면 pair는 펼쳐지지 않고 원소 하나로 들어가서 len이 2예요.',in_code:"`[*a, *b]`나 `(*row, total)`처럼 별표로 묶음을 펼쳐 새 묶음을 만드는 줄을 AI가 쓴 코드에서 자주 봐요. 별표를 함수 호출에 쓰는 방법은 9강에서 더 배워요."},{type:`example`,id:`theory-py-tuple-ex5`,kind:`choice`,title:`펼친 것과 통째로 넣은 것`,prompt:`아래 코드의 출력값을 고르세요.`,code:`nums = (5, 8)
grown = (*nums, nums)
print(len(grown), grown[-1])`,output:`3 (5, 8)
`,choices:[`3 (5, 8)`,`4 8`,`2 (5, 8)`,`3 8`],answer:`3 (5, 8)`,feedback:{"4 8":`별표가 없는 nums도 원소가 펼쳐져 들어간다고 생각했나요?`,"2 (5, 8)":`별표를 붙여도 nums가 원소 하나로 들어간다고 생각했나요?`,"3 8":`마지막 원소가 nums 안의 마지막 값 8이라고 생각했나요?`},explanation:`*nums는 5와 8을 펼쳐 넣고, 별표 없는 nums는 튜플째 원소 하나로 들어가서 grown은 (5, 8, (5, 8))이에요. 원소는 셋이고, 마지막 원소는 튜플 (5, 8)이에요.`,card:`rebuild`},{type:`summary`,points:["튜플을 만드는 것은 쉼표예요. `(8)`은 정수이고, `(8,)`과 `8,`은 원소 하나짜리 튜플이에요.","`a, b = b, a`는 오른쪽을 먼저 다 계산한 뒤 나눠 담아서, 바뀌기 전 값으로 맞바꿔요.","별표 이름은 남은 값을 언제나 리스트로 받고, 남은 게 없으면 `[]`예요. 리스트와 튜플은 내용이 같아도 `==`가 False예요.","튜플은 고칠 수 없어서 자르기와 `+`로 새 튜플을 만들어요. 원래 튜플은 그대로예요.","`(t, x)`는 t를 통째로 넣고 `(*t, x)`는 t를 펼쳐 넣어요. `list()`와 `tuple()`로 서로 바꿀 수 있어요."]}],covers:{"py-tuple-01":[`tuple-comma`],"py-tuple-02":[`unpack`],"py-tuple-03":[`star-rest`],"py-tuple-04":[`tuple-comma`,`immutable`,`rebuild`]}},{id:`theory-py-dict`,version:2,concept_id:`py-dict`,title:`딕셔너리`,minutes:13,steps:[{type:`explain`,id:`dict-basics`,title:`키로 값을 찾는 딕셔너리`,body:"딕셔너리는 `{키: 값}` 쌍을 쉼표로 늘어놓아, 번호 대신 키로 값을 찾는 묶음이에요. `d[키]`로 값을 꺼내고, `d[키] = 값`은 없는 키면 새로 넣고 있는 키면 값을 바꿔요. `len(d)`는 키의 개수이고, `키 in d`는 그 키가 있는지만 물어서 값은 보지 않아요. `not in`은 그 반대로, 키가 없을 때 True예요.",code:`seat = {"A1": "민아", "B2": "준호"}
print(seat["A1"], len(seat))
seat["C3"] = "서연"
seat["A1"] = "지우"
print(seat)
print("B2" in seat, "준호" in seat)`,trace:['`seat = {"A1": "민아", "B2": "준호"}` → 좌석 번호(키)마다 이름(값)을 짝지어 담아요','`print(seat["A1"], len(seat))` → 키 "A1"의 값과 키의 개수 → **민아 2**','`seat["C3"] = "서연"` → 없는 키라 새 쌍을 넣어요','`seat["A1"] = "지우"` → 있는 키라 값만 바꿔요',"`print(seat)` → 딕셔너리는 중괄호와 `키: 값`째 보여요 → **{'A1': '지우', 'B2': '준호', 'C3': '서연'}**",'`"B2" in seat, "준호" in seat` → in은 키만 찾아서, 값인 "준호"는 없다고 봐요 → **True False**'],output:`민아 2
{'A1': '지우', 'B2': '준호', 'C3': '서연'}
True False
`,mistake:'없는 키를 대괄호로 꺼내기. `seat["D4"]`처럼 없는 키를 읽으면 KeyError(그런 키가 없다는 오류)가 나고 프로그램이 멈춰요. 있는지 모르면 `in`으로 먼저 확인하거나 뒤에 나오는 카드의 `get`을 써요.',in_code:"`if key not in table:` 다음 줄에서 그 키를 0이나 빈 리스트로 먼저 만들어 두는 코드를 자주 봐요. 없는 키를 읽다가 KeyError가 나지 않게 미리 자리를 만드는 거예요."},{type:`example`,id:`theory-py-dict-ex1`,kind:`choice`,title:`메뉴판에 값이 있나요`,prompt:`아래 코드의 출력값을 고르세요.`,code:`menu = {"라떼": 4500, "모카": 5000}
menu["녹차"] = 4000
print(len(menu), 4500 in menu)`,output:`3 False
`,choices:[`3 False`,`3 True`,`6 False`,`2 False`],answer:`3 False`,feedback:{"3 True":`in이 키뿐 아니라 값까지 찾아본다고 생각했나요?`,"6 False":`len이 키와 값을 모두 센다고 생각했나요?`,"2 False":`없는 키에 값을 담아도 새 쌍이 생기지 않는다고 생각했나요?`},explanation:`menu["녹차"] = 4000은 없는 키라 새 쌍을 넣어 키가 3개예요. in은 키만 찾는데 4500은 키가 아니라 값이라서 False예요.`,card:`dict-basics`},{type:`explain`,id:`dict-order`,title:`키는 하나, 순서는 넣은 대로`,body:"딕셔너리의 키는 하나뿐이라, 같은 키를 두 번 쓰면 나중 값이 앞의 값을 덮어써요. 이때 키의 자리는 처음 들어간 곳 그대로예요. 키는 넣은 순서를 지키고, 새 키는 맨 끝에 붙어요. 있는 키에 값을 다시 담아도 자리는 바뀌지 않아요. `list(d)`는 키만 순서대로 모은 리스트예요.",code:`cup = {"S": 85, "M": 95, "S": 90}
print(cup)
cup["L"] = 99
cup["S"] = 80
print(list(cup), cup["S"])`,trace:['`cup = {"S": 85, "M": 95, "S": 90}` → "S"를 두 번 썼으니 나중 값 90이 85를 덮어써요',"`print(cup)` → S는 하나만 남고 자리는 처음 그대로 → **{'S': 90, 'M': 95}**",'`cup["L"] = 99` → 새 키라 맨 끝에 붙어요','`cup["S"] = 80` → 있는 키라 값만 80으로 바뀌고 자리는 맨 앞 그대로예요',`\`print(list(cup), cup["S"])\` → 키만 넣은 순서대로 → **['S', 'M', 'L'] 80**`],output:`{'S': 90, 'M': 95}
['S', 'M', 'L'] 80
`,mistake:'값을 덮어쓴 키가 맨 뒤로 간다고 생각하기. 값만 바뀌고 자리는 처음 들어간 곳이라, `cup["S"] = 80` 뒤에도 S가 맨 앞이에요.',in_code:"`for key in d:`처럼 딕셔너리로 반복하면 키를 넣은 순서대로 하나씩 받아요. 값까지 함께 받으려면 이 강의 마지막 카드의 `d.items()`를 써요."},{type:`example`,id:`theory-py-dict-ex2`,kind:`choice`,title:`메달 주인 바꾸기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`rank = {"금": "민아", "은": "준호"}
rank["금"] = "서연"
rank["동"] = "민아"
print(rank)`,output:`{'금': '서연', '은': '준호', '동': '민아'}
`,choices:[`{'금': '서연', '은': '준호', '동': '민아'}`,`{'은': '준호', '금': '서연', '동': '민아'}`,`{'금': '민아', '은': '준호', '동': '민아'}`,`{'금': '서연', '은': '준호'}`],answer:`{'금': '서연', '은': '준호', '동': '민아'}`,feedback:{"{'은': '준호', '금': '서연', '동': '민아'}":`있는 키에 값을 다시 담으면 그 키가 맨 뒤로 옮겨진다고 생각했나요?`,"{'금': '민아', '은': '준호', '동': '민아'}":`있는 키에 새 값을 담아도 처음 값이 그대로 남는다고 생각했나요?`,"{'금': '서연', '은': '준호'}":`값 "민아"가 이미 있어서 새 키 "동"이 들어가지 않는다고 생각했나요?`},explanation:`"금"은 있는 키라 값만 서연으로 바뀌고 자리는 맨 앞 그대로예요. "동"은 새 키라 맨 끝에 붙고, 값은 겹쳐도 상관없어요.`,card:`dict-order`},{type:`explain`,id:`dict-get`,title:`get으로 멈추지 않고 꺼내기`,body:"`d.get(키)`는 키가 있으면 그 값을, 없으면 오류 대신 None을 돌려줘요. `d.get(키, 기본값)`처럼 두 번째 값을 주면, 키가 없을 때 None 대신 그 기본값을 돌려줘요. 키가 있으면 값이 0이나 빈 문자열이어도 그 값을 그대로 돌려줘요. 1강의 `or`를 뒤에 붙이면 0도 거짓이라 기본값으로 바뀌니 조심해요.",code:`left = {"쿠폰": 0, "포인트": 250}
print(left.get("포인트"))
print(left.get("도장"))
print(left.get("도장", 1))
print(left.get("쿠폰", 1))
print(left.get("쿠폰") or 1)`,trace:['`left = {"쿠폰": 0, "포인트": 250}` → 남은 쿠폰 0장, 포인트 250을 담아요','`left.get("포인트")` → 있는 키라 그 값 → **250**','`left.get("도장")` → 없는 키라 오류 없이 → **None**','`left.get("도장", 1)` → 없는 키라 기본값 → **1**','`left.get("쿠폰", 1)` → 있는 키라 기본값과 상관없이 그 값 → **0**','`left.get("쿠폰") or 1` → get이 꺼낸 0이 거짓이라 or가 오른쪽으로 → **1**'],output:`250
None
1
0
1
`,mistake:`기본값이 '값이 비었을 때' 쓰인다고 생각하기. 기본값은 키가 없을 때만 쓰여서, 값이 0인 "쿠폰"은 \`get("쿠폰", 1)\`에서도 0이에요.`,in_code:'`name = user.get("name", "손님")`처럼 없을 수도 있는 키를 기본값과 함께 꺼내는 줄을 자주 봐요. `user["name"]`은 키가 없으면 KeyError로 멈추지만 get은 멈추지 않아요.'},{type:`example`,id:`theory-py-dict-ex3`,kind:`line`,title:`0이 나오는 줄`,prompt:`아래 코드에서 0을 출력하는 줄을 고르세요.`,code:`stamp = {"월": 0, "화": 2}
print(stamp.get("월") or 4)
print(stamp.get("월", 4))
print(stamp.get("수"))`,output:`4
0
None
`,choices:[`2`,`3`,`4`],answer:`3`,check:{type:`prints`,target:`0`},feedback:{2:`or를 붙여도 get이 꺼낸 0이 그대로 남는다고 생각했나요?`,4:`키가 없으면 get이 None 대신 0을 돌려준다고 생각했나요?`},explanation:`2번 줄은 get이 꺼낸 0이 거짓이라 or가 4를 돌려줘요. 3번 줄은 "월"이 있는 키라 기본값 4와 상관없이 0이 나오고, 4번 줄은 없는 키라 None이 나와요.`,card:`dict-get`},{type:`explain`,id:`dict-update`,title:`덮어쓰기와 더해 쌓기`,body:"`d[키] = 값`은 앞의 값을 지우고 새 값으로 덮어써요. `d[키] += 4`는 원래 값을 먼저 읽어 더한 뒤 다시 담으니, 키가 없으면 읽을 값이 없어 KeyError가 나요. 처음 보는 키도 안전하게 쌓으려면 `d[키] = d.get(키, 0) + 1`처럼 없을 때 0부터 시작해요. `d.update({키: 값})`은 괄호 안 딕셔너리의 쌍을 넣거나 덮어써서, `d[키] = 값`을 쌍마다 한 것과 같아요.",code:`pts = {"민아": 5}
pts["민아"] = 2
pts["민아"] += 4
pts.update({"준호": 7})
pts["서연"] = pts.get("서연", 0) + 1
print(pts)`,trace:['`pts = {"민아": 5}` → 민아의 점수 5로 시작해요','`pts["민아"] = 2` → 앞의 5를 지우고 2로 덮어써요','`pts["민아"] += 4` → 원래 값 2를 읽어 4를 더해 6을 담아요','`pts.update({"준호": 7})` → 없는 키 "준호"를 새로 넣어요','`pts["서연"] = pts.get("서연", 0) + 1` → 처음 보는 키라 get이 0을 주고, 1을 더해 담아요',"`print(pts)` → **{'민아': 6, '준호': 7, '서연': 1}**"],output:`{'민아': 6, '준호': 7, '서연': 1}
`,mistake:"`d.get(키) + 1`로 세기. 처음 보는 키에서 get이 None을 돌려줘 `None + 1`이 되고, None과 수는 더할 수 없어 TypeError가 나요. 셀 때는 기본값 0을 꼭 줘요.",in_code:"`freq[w] = freq.get(w, 0) + 1`은 단어나 기록의 개수를 세는 가장 흔한 줄이에요. 같은 일을 14강에서 배울 `Counter`로 한 번에 하기도 해요."},{type:`example`,id:`theory-py-dict-ex4`,kind:`choice`,title:`펜 개수 바꾸기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`box = {"펜": 3}
box["펜"] += 2
box["펜"] = 1
box.update({"풀": 4, "펜": 9})
print(box)`,output:`{'펜': 9, '풀': 4}
`,choices:[`{'펜': 9, '풀': 4}`,`{'펜': 15, '풀': 4}`,`{'펜': 1, '풀': 4}`,`{'풀': 4, '펜': 9}`],answer:`{'펜': 9, '풀': 4}`,feedback:{"{'펜': 15, '풀': 4}":`=와 update도 원래 값에 더해 준다고 생각했나요?`,"{'펜': 1, '풀': 4}":`update가 이미 있는 키의 값은 바꾸지 않는다고 생각했나요?`,"{'풀': 4, '펜': 9}":`update로 다시 담은 키가 맨 뒤로 간다고 생각했나요?`},explanation:`+= 2로 5가 된 뒤 = 1이 덮어써 1이 되고, update가 "펜"을 다시 9로 덮어쓰며 새 키 "풀"을 끝에 넣어요. "펜"의 자리는 처음 그대로라 맨 앞이에요.`,card:`dict-update`},{type:`explain`,id:`dict-loop`,title:`쌍을 나눠 받으며 쌓기`,body:"`for 이름1, 이름2 in 쌍들:`처럼 쓰면 `(키, 값)` 모양의 튜플을 반복마다 두 이름으로 나눠 받아요(5강의 언패킹). 받은 키마다 `d[키] = d.get(키, 0) + 값`으로 쌓으면 같은 키의 값이 합쳐져요. 쌓는 줄에 `=`만 쓰면 같은 키가 다시 나올 때 앞의 합계가 지워지고 마지막 값만 남아요. `d.items()`는 딕셔너리의 `(키, 값)` 쌍을 넣은 순서대로 돌려줘서 같은 방법으로 나눠 받아요.",code:`log = [("월", 3), ("화", 2), ("월", 4)]
tot = {}
for day, h in log:
    tot[day] = tot.get(day, 0) + h
for day, h in tot.items():
    print(day, h)`,trace:['`log = [("월", 3), ("화", 2), ("월", 4)]` → 요일과 공부한 시간을 쌍으로 담은 리스트예요',"`tot = {}` → 요일별 합계를 쌓을 빈 딕셔너리예요","`for day, h in log:` → 쌍마다 요일은 day, 시간은 h에 나눠 받아요","`tot[day] = tot.get(day, 0) + h` → 월 3, 화 2, 그리고 월은 3에 4를 더해 7이 돼요","`for day, h in tot.items():` → 쌓은 딕셔너리의 쌍을 넣은 순서대로 받아요","`print(day, h)` → **월 7**, **화 2**"],output:`월 7
화 2
`,mistake:"합계를 쌓는 줄에 `tot[day] = h`처럼 `=`만 쓰기. 같은 키가 다시 나오면 앞에서 쌓은 값을 지우고 새 값으로 덮어써서 마지막 값만 남아요. 더하려면 `tot.get(day, 0) + h`처럼 쓰고, 빈 딕셔너리에 바로 `+= h`를 쓰면 처음 보는 키에서 KeyError가 나요.",in_code:"`for key, value in data.items():`는 딕셔너리를 키와 값으로 한 번에 훑는 가장 흔한 줄이에요. 이름 순서는 쌍의 순서를 따라서, 앞 이름이 키, 뒤 이름이 값이에요."},{type:`example`,id:`theory-py-dict-ex5`,kind:`choice`,title:`사람별 최고 기록`,prompt:`아래 코드의 출력값을 고르세요.`,code:`rec = [("민", 7), ("준", 9), ("민", 5)]
best = {}
for w, t in rec:
    old = best.get(w, 0)
    best[w] = t if t > old else old
print(best)`,output:`{'민': 7, '준': 9}
`,choices:[`{'민': 7, '준': 9}`,`{'민': 5, '준': 9}`,`{'민': 12, '준': 9}`,`{'준': 9, '민': 7}`],answer:`{'민': 7, '준': 9}`,feedback:{"{'민': 5, '준': 9}":`같은 키가 다시 나오면 조건과 상관없이 마지막 값으로 덮어쓴다고 생각했나요?`,"{'민': 12, '준': 9}":`get으로 꺼낸 앞의 값과 t가 더해진다고 생각했나요?`,"{'준': 9, '민': 7}":`같은 키에 다시 담으면 그 키가 맨 뒤로 간다고 생각했나요?`},explanation:`세 번째 쌍에서 old는 앞에서 담은 7이고, 5는 7보다 크지 않아 7을 그대로 다시 담아요. 키 "민"의 자리는 처음 들어간 맨 앞 그대로예요.`,card:`dict-loop`},{type:`summary`,points:["`d[키]`로 꺼내고 `d[키] = 값`으로 넣거나 바꿔요. `in`과 `len`은 키만 보고, 없는 키를 `d[키]`로 읽으면 KeyError예요.","같은 키는 하나만 남아 나중 값이 이기고, 자리는 처음 들어간 곳이에요. 새 키는 맨 끝에 붙고 `list(d)`는 키 목록이에요.","`get(키, 기본값)`은 키가 없을 때만 기본값을 줘요. 값이 0이어도 키가 있으면 0이고, 기본값이 없으면 None이에요.","`=`는 덮어쓰고 `+=`는 더해요. 처음 보는 키에 `+=`는 KeyError라서 `d.get(키, 0) + 1`로 쌓아요.","`for k, v in 쌍들:`과 `d.items()`로 쌍을 두 이름에 나눠 받아요."]}],covers:{"py-dict-01":[`dict-basics`,`dict-get`],"py-dict-02":[`dict-basics`,`dict-order`],"py-dict-03":[`dict-get`,`dict-update`],"py-dict-04":[`dict-basics`,`dict-update`,`dict-loop`]}},{id:`theory-py-set`,version:2,concept_id:`py-set`,title:`집합`,minutes:11,steps:[{type:`explain`,id:`set-basics`,title:`중복 없는 묶음, 집합`,body:"집합은 중복 없이 서로 다른 값만 담는 묶음이에요. `{1, 3}`처럼 중괄호에 값만 늘어놓아 만들고, 같은 값을 여러 번 써도 하나로 합쳐져요. `set(리스트)`는 리스트의 중복을 합친 새 집합을 만들 뿐, 원래 리스트는 그대로 둬요. `add(값)`은 집합에 값을 하나 넣고, `값 in 집합`은 개수가 아니라 들어 있는지를 True나 False로 알려 줘요.",code:`tags = ["빨강", "파랑", "빨강"]
kinds = set(tags)
kinds.add("노랑")
print(len(tags), len(kinds))
odd = {1, 3, 3, 5}
print(len(odd), 3 in odd)`,trace:['`tags = ["빨강", "파랑", "빨강"]` → 빨강이 두 번 든 리스트예요',"`kinds = set(tags)` → 중복을 합친 새 집합 {빨강, 파랑}을 만들고, tags는 그대로 둬요",'`kinds.add("노랑")` → 집합에 노랑을 넣어 원소가 셋이 돼요',"`print(len(tags), len(kinds))` → 리스트는 여전히 3개, 집합도 3개 → **3 3**","`odd = {1, 3, 3, 5}` → 중괄호에 값만 쓰면 집합이고, 두 번 쓴 3은 하나로 합쳐져요","`print(len(odd), 3 in odd)` → 원소는 1, 3, 5 세 개, 3이 들어 있으니 → **3 True**"],output:`3 3
3 True
`,mistake:"`set(tags)` 뒤에 tags의 중복도 사라졌다고 생각하기. set()은 새 집합을 만들 뿐이라 tags는 여전히 원소 3개예요. 중복 없는 결과를 쓰려면 새 이름에 담아 써요.",in_code:"`seen = set()`을 만들고 반복하면서 `if x in seen:`으로 이미 본 값인지 확인한 뒤 `seen.add(x)`로 넣는 코드를 자주 봐요. 리스트로 같은 확인을 하면 원소가 많을수록 느려지지만, 집합의 in은 원소가 많아도 빨라요."},{type:`example`,id:`theory-py-set-ex1`,kind:`line`,title:`'3'이 나오는 줄`,prompt:`아래 코드에서 3을 출력하는 줄을 고르세요.`,code:`pets = {"개", "고양이"}
pets.add("개")
print(len(pets))
pets.add("새")
print(len(pets))
print("새" in pets)`,output:`2
3
True
`,choices:[`3`,`5`,`6`],answer:`5`,check:{type:`prints`,target:`3`},feedback:{3:`이미 있는 "개"를 add하면 원소가 하나 더 늘어난다고 생각했나요?`,6:`in이 True나 False 대신 원소의 개수를 돌려준다고 생각했나요?`},explanation:`2번 줄의 "개"는 이미 있어서 3번 줄은 2를 출력해요. 4번 줄에서 "새"가 들어가 5번 줄이 3을 출력하고, 6번 줄은 들어 있는지를 물어 True를 출력해요.`,card:`set-basics`},{type:`explain`,id:`set-empty`,title:`빈 집합은 set()으로`,body:'빈 중괄호 `{}`는 빈 집합이 아니라 빈 딕셔너리예요. 중괄호를 딕셔너리가 먼저 쓰고 있었기 때문이에요. 그래서 빈 집합은 `set()`으로만 만들어요. 값이 들어 있으면 `{5}`는 집합, `{"k": 5}`처럼 `키: 값`이 있으면 딕셔너리예요. `type(값).__name__`은 값의 자료형 이름을 `dict`, `set`처럼 글자로 알려 줘요.',code:`box = {}
box["펜"] = 2
bag = set()
bag.add("펜")
print(type(box).__name__, box)
print(type(bag).__name__, len(bag))`,trace:["`box = {}` → 빈 중괄호라 빈 딕셔너리를 만들어요",'`box["펜"] = 2` → 딕셔너리라서 키 "펜"에 값 2를 담을 수 있어요',"`bag = set()` → 빈 집합은 이렇게만 만들어요",'`bag.add("펜")` → 집합에 "펜"을 넣어요',"`print(type(box).__name__, box)` → **dict {'펜': 2}**","`print(type(bag).__name__, len(bag))` → **set 1**"],output:`dict {'펜': 2}
set 1
`,mistake:"빈 집합을 `{}`로 만들고 `add()`를 부르기. `{}`는 딕셔너리라 add라는 기능이 없어서 AttributeError(그런 속성이나 기능이 없다는 오류)가 나요.",in_code:"`print(type(x).__name__)`은 값이 무슨 자료형인지 확인하려고 디버깅할 때 자주 끼워 넣는 줄이에요. `type(x)`만 출력하면 `<class 'dict'>`처럼 보여요."},{type:`example`,id:`theory-py-set-ex2`,kind:`line`,title:`'set'이 나오는 줄`,prompt:`아래 코드에서 set을 출력하는 줄을 고르세요.`,code:`s1 = {5}
s2 = {}
s3 = {"k": 5}
print(type(s1).__name__)
print(type(s2).__name__)
print(type(s3).__name__)`,output:`set
dict
dict
`,choices:[`4`,`5`,`6`],answer:`4`,check:{type:`prints`,target:`set`},feedback:{5:`빈 중괄호 {}도 집합이라고 생각했나요?`,6:`중괄호로 감싸면 키: 값이 있어도 집합이라고 생각했나요?`},explanation:`{5}는 값만 든 중괄호라 집합이에요. 빈 중괄호 {}와 키: 값이 있는 {"k": 5}는 둘 다 딕셔너리라 dict가 나와요.`,card:`set-empty`},{type:`explain`,id:`set-ops`,title:`겹치고 합치고 빼기`,body:"두 집합에서 `&`(교집합)는 양쪽에 모두 있는 값, `|`(합집합)는 어느 한쪽에라도 있는 값을 중복 없이 모아요. `a - b`(차집합)는 a에만 있는 값이라 `b - a`와 결과가 달라요. `^`(대칭 차집합)는 한쪽에만 있는 값, 곧 겹치는 부분을 뺀 나머지예요. 집합은 순서가 없어서 `{5, 7} == {7, 5}`는 True이고, 보기 좋게 출력하려면 `sorted()`로 정렬한 리스트로 바꿔요.",code:`a = {1, 3, 5, 7}
b = {5, 7, 9}
print(sorted(a & b), sorted(a | b))
print(sorted(a - b), sorted(b - a))
print(sorted(a ^ b))
print(a & b == {7, 5})`,trace:["`a = {1, 3, 5, 7}` → 집합 a를 만들어요","`b = {5, 7, 9}` → 집합 b를 만들어요. 5와 7이 겹쳐요","`sorted(a & b), sorted(a | b)` → 겹치는 값, 그리고 겹치는 5와 7을 한 번씩만 넣은 합 → **[5, 7] [1, 3, 5, 7, 9]**","`sorted(a - b), sorted(b - a)` → a에만 있는 값과 b에만 있는 값이 서로 달라요 → **[1, 3] [9]**","`sorted(a ^ b)` → 겹치는 5와 7을 뺀 나머지 → **[1, 3, 9]**","`a & b == {7, 5}` → 집합은 순서를 보지 않아서 **True**"],output:`[5, 7] [1, 3, 5, 7, 9]
[1, 3] [9]
[1, 3, 9]
True
`,mistake:"`a - b`와 `b - a`를 같은 것으로 보기. 빼기는 왼쪽 집합에만 있는 값을 남겨서, 순서를 바꾸면 결과가 완전히 달라져요.",in_code:"두 표의 열 이름을 `set(cols_a) - set(cols_b)`로 비교해 a 표에만 있는 열을 찾는 코드를 자주 봐요. 엑셀에서 두 목록을 하나씩 대조하던 일을 한 줄로 해요."},{type:`example`,id:`theory-py-set-ex3`,kind:`choice`,title:`두 가게의 메뉴`,prompt:`아래 코드의 출력값을 고르세요.`,code:`x = {"김밥", "라면", "우동"}
y = {"라면", "만두"}
print(sorted(x - y), len(x | y))`,output:`['김밥', '우동'] 4
`,choices:[`['김밥', '우동'] 4`,`['김밥', '우동'] 5`,`['만두'] 4`,`['김밥', '만두', '우동'] 4`],answer:`['김밥', '우동'] 4`,feedback:{"['김밥', '우동'] 5":`|가 양쪽에 다 있는 라면을 두 번 센다고 생각했나요?`,"['만두'] 4":`x - y가 오른쪽 y에만 있는 값을 남긴다고 생각했나요?`,"['김밥', '만두', '우동'] 4":`-가 ^처럼 한쪽에만 있는 값을 모두 남긴다고 생각했나요?`},explanation:`x - y는 x에만 있는 김밥과 우동이에요. x | y는 라면을 한 번만 넣어 김밥, 라면, 우동, 만두 네 개라 4예요.`,card:`set-ops`},{type:`explain`,id:`set-order`,title:`집합에는 순서가 없어요`,body:"집합에는 순서가 없어서, `list(set(리스트))`로 중복을 없애면 들어온 순서가 사라지고 어떤 순서로 나올지 장담할 수 없어요. `sorted(집합)`은 값의 크기 순으로 정렬한 리스트라 들어온 순서와는 상관없어요. 순서를 지키며 빼려면 원래 리스트를 앞에서부터 돌고, 집합으로는 `not in` 확인만 해요. `not x in s`는 `x not in s`와 같은 뜻이지만, `x != s`는 수와 집합 자체를 비교해서 늘 True라 아무것도 걸러 내지 못해요.",code:`xs = [9, 1, 8, 1]
u = set(xs)
print(list(u), sorted(u))
out = {8}
ok = [x for x in xs if x not in out]
print(ok, 8 != out)`,trace:["`xs = [9, 1, 8, 1]` → 들어온 순서대로 담긴 리스트예요","`u = set(xs)` → 중복을 합친 집합 {1, 8, 9}를 만들어요. 이때 순서는 사라져요","`print(list(u), sorted(u))` → 리스트로 바꾸면 들어온 순서도 크기 순서도 아닌 순서가 될 수 있고, sorted는 크기 순이에요 → **[8, 9, 1] [1, 8, 9]**","`out = {8}` → 뺄 값을 집합으로 담아요","`ok = [x for x in xs if x not in out]` → xs를 앞에서부터 돌며 out에 없는 값만 남겨요","`print(ok, 8 != out)` → 순서와 중복 1이 그대로 남고, 수 8과 집합 {8}은 서로 다른 값이라 → **[9, 1, 1] True**"],output:`[8, 9, 1] [1, 8, 9]
[9, 1, 1] True
`,mistake:"`list(set(xs))`가 들어온 순서를 지킨다고 생각하기. 이번 실행의 [8, 9, 1]처럼 순서가 섞일 수 있고, 값이 바뀌면 순서도 달라져요. 순서가 중요하면 원래 리스트를 돌며 걸러요.",in_code:"AI가 `list(set(rows))`로 중복을 없앤 코드는 순서가 바뀌어도 되는 곳에서만 안전해요. 순서가 중요한 결과라면 원래 리스트를 돌며 `not in seen`으로 거르는 코드로 바꿔요."},{type:`example`,id:`theory-py-set-ex4`,kind:`choice`,title:`중복 빼고 큰 값부터`,prompt:`아래 코드의 출력값을 고르세요.`,code:`votes = [3, 1, 3, 2, 1]
kinds = set(votes)
print(sorted(kinds, reverse=True))`,output:`[3, 2, 1]
`,choices:[`[3, 2, 1]`,`[3, 3, 2, 1, 1]`,`[1, 2, 3]`,`{3, 2, 1}`],answer:`[3, 2, 1]`,feedback:{"[3, 3, 2, 1, 1]":`set으로 바꿔도 중복이 그대로 남는다고 생각했나요?`,"[1, 2, 3]":`reverse=True가 있어도 작은 값부터 정렬한다고 생각했나요?`,"{3, 2, 1}":`집합을 정렬하면 결과도 집합으로 나온다고 생각했나요?`},explanation:`set(votes)가 중복을 합쳐 1, 2, 3만 남기고, sorted는 그것을 정렬한 리스트를 돌려줘요. reverse=True라 큰 값부터 [3, 2, 1]이에요.`,card:`set-order`},{type:`example`,id:`theory-py-set-ex5`,kind:`choice`,title:`빼는 줄 두 가지`,prompt:`아래 코드의 출력값을 고르세요.`,code:`xs = [4, 8, 4, 1]
bad = {4}
p = [x for x in xs if x not in bad]
q = [x for x in xs if x != bad]
print(len(p), len(q))`,output:`2 4
`,choices:[`2 4`,`2 2`,`3 4`,`4 4`],answer:`2 4`,feedback:{"2 2":`x != bad도 x가 bad 안에 들어 있는지 확인한다고 생각했나요?`,"3 4":`not in이 같은 값을 하나만 빼고 나머지는 남긴다고 생각했나요?`,"4 4":`not in으로 걸러도 원소가 하나도 빠지지 않는다고 생각했나요?`},explanation:`not in bad는 4를 모두 빼서 [8, 1]이라 2개예요. x != bad는 수와 집합 {4}를 비교해 늘 True라 아무것도 빼지 못해서 4개 그대로예요.`,card:`set-order`},{type:`summary`,points:["집합은 중복 없이 값을 담아요. `set(리스트)`는 새 집합을 만들 뿐 리스트는 그대로이고, `in`은 True나 False를 돌려줘요.","빈 `{}`는 딕셔너리라서 빈 집합은 `set()`으로 만들어요. `type(x).__name__`으로 자료형 이름을 확인해요.","`&`는 겹치는 값, `|`는 모든 값, `a - b`는 a에만 있는 값, `^`는 한쪽에만 있는 값이에요. 집합끼리 `==`는 순서를 보지 않아요.","집합을 거치면 순서가 사라져요. 크기 순은 `sorted()`, 들어온 순서는 원래 리스트를 돌며 `not in`으로 걸러 지켜요.","`x != 집합`은 수와 집합을 비교해 늘 True라서 원소인지 확인하지 못해요."]}],covers:{"py-set-01":[`set-basics`],"py-set-02":[`set-basics`,`set-empty`],"py-set-03":[`set-ops`],"py-set-04":[`set-basics`,`set-order`]}},{id:`theory-py-func`,version:2,concept_id:`py-func`,title:`함수와 인자`,minutes:12,steps:[{type:`explain`,id:`def-return`,title:`def로 만들고 return으로 돌려받기`,body:"`def 이름(매개변수):` 아래 들여 쓴 줄들이 함수예요. 만들 때는 실행되지 않고, `이름(값)`으로 부를 때 값이 매개변수에 담겨 실행돼요. `return 값`은 그 값을 부른 자리로 돌려주고 함수를 바로 끝내요. return이 없는 함수는 끝까지 실행한 뒤 None을 돌려주고, 안에서 계산한 값은 함수가 끝나면 사라져요. 화면에 보이는 `print`와 값을 돌려주는 `return`은 달라서, 결과를 계산에 다시 쓰려면 return이 필요해요.",code:`def area(w, h):
    return w * h
def show(w, h):
    print(w * h)
r = show(2, 3)
print(area(4, 5) + 1, r)`,trace:["`def area(w, h):` → area 함수를 만들어요. w와 h는 부를 때 값을 받을 이름(매개변수)이에요","`return w * h` → 계산한 값을 부른 자리로 돌려주고 함수를 끝내요","`def show(w, h):` → return 없이 출력만 하는 함수를 만들어요","`print(w * h)` → 화면에 보여 줄 뿐, 값을 돌려주지는 않아요","`r = show(2, 3)` → 함수 안의 print가 **6**을 출력하고, 돌려준 값이 없어 r에는 None이 담겨요","`print(area(4, 5) + 1, r)` → 돌려받은 20에 1을 더하고, r은 None → **21 None**"],output:`6
21 None
`,mistake:"함수 안에서 print했으니 결과를 돌려받았다고 생각하기. print는 화면에 보여 줄 뿐이라 `r = show(2, 3)`의 r은 None이에요. 값을 다른 계산에 쓰려면 return으로 돌려줘요.",in_code:"AI가 쓴 함수를 읽을 때 끝에 `return result`가 있는지 먼저 확인해 봐요. 마지막 return을 빠뜨린 함수는 오류 없이 None을 돌려줘서, 그 값을 쓰는 엉뚱한 줄에서 None 때문에 오류가 나요."},{type:`example`,id:`theory-py-func-ex1`,kind:`choice`,title:`두 배로 만드는 함수`,prompt:`아래 코드의 출력값을 고르세요.`,code:`def double(n):
    n * 2

print(f"결과: {double(5)}")`,output:`결과: None
`,choices:[`결과: None`,`결과: 10`,`결과: 5`,`오류 발생`],answer:`결과: None`,feedback:{"결과: 10":`return이 없어도 마지막에 계산한 값이 돌아온다고 생각했나요?`,"결과: 5":`함수가 값을 돌려주지 않으면 넘긴 값이 그대로 돌아온다고 생각했나요?`,"오류 발생":`return이 없는 함수를 부르면 오류가 난다고 생각했나요?`},explanation:`double 안에서 n * 2를 계산하지만 return이 없어 그 값은 버려지고, 함수는 None을 돌려줘요. 그래서 f-문자열의 {} 자리에 None이 들어가요.`,card:`def-return`},{type:`explain`,id:`params`,title:`기본값과 이름 붙인 인자`,body:"`def 이름(a, b=값):`처럼 매개변수에 `=값`을 붙이면, 부를 때 그 값을 주지 않았을 때 쓰는 기본값이 돼요. 이름 없이 넘긴 값(위치 인자)은 왼쪽 매개변수부터 차례로 채워요. `n=3`처럼 이름을 붙여 넘긴 값(키워드 인자)은 순서와 상관없이 그 매개변수에만 들어가서, 중간 매개변수를 건너뛰고 원하는 값만 바꿀 수 있어요. 기본값이 있는 매개변수는 기본값이 없는 매개변수 뒤에 써요.",code:`def label(text, mark="-", n=1):
    return mark * n + text
print(label("공지"))
print(label("공지", "#"))
print(label("공지", n=3))`,trace:['`def label(text, mark="-", n=1):` → mark와 n은 기본값이 있어 빼고 불러도 돼요',"`return mark * n + text` → 기호를 n번 반복해 글자 앞에 붙여 돌려줘요",'`label("공지")` → 넘긴 값은 text에만 들어가고, 나머지는 기본값 "-"와 1 → **-공지**','`label("공지", "#")` → 두 번째 값은 위치상 두 번째 매개변수 mark에 들어가요 → **#공지**','`label("공지", n=3)` → 이름을 붙인 값은 n에만 들어가고, mark는 기본값 그대로 → **---공지**'],output:`-공지
#공지
---공지
`,mistake:'`label("공지", 3)`처럼 이름 없이 넘겨 n을 바꾸려 하기. 위치 인자는 순서대로 채워서 3이 mark에 들어가고, `3 * 1 + "공지"`에서 수와 글자를 더하려다 TypeError가 나요. 중간을 건너뛰려면 `n=3`처럼 이름을 붙여요.',in_code:"`sorted(xs, reverse=True)`처럼 함수에 키워드 인자로 옵션 하나만 바꾸는 줄을 아주 자주 봐요(3강). 넘기지 않은 나머지 옵션은 기본값 그대로 쓰여요."},{type:`example`,id:`theory-py-func-ex2`,kind:`choice`,title:`등급만 바꿔 부르기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`def card(name, title="회원", lv=1):
    return f"{title} {name} Lv{lv}"

print(card("민아", lv=5))`,output:`회원 민아 Lv5
`,choices:[`회원 민아 Lv5`,`5 민아 Lv1`,`회원 민아 Lv1`,`오류 발생`],answer:`회원 민아 Lv5`,feedback:{"5 민아 Lv1":`이름을 붙여 넘겨도 값이 다음 자리인 title에 들어간다고 생각했나요?`,"회원 민아 Lv1":`기본값이 있으면 넘긴 lv=5보다 기본값이 먼저 쓰인다고 생각했나요?`,"오류 발생":`가운데 매개변수 title을 건너뛰고 부르면 오류가 난다고 생각했나요?`},explanation:`"민아"는 위치상 첫 매개변수 name에 들어가고, lv=5는 이름이 붙어 lv에만 들어가요. 건너뛴 title은 기본값 "회원"을 써서 회원 민아 Lv5예요.`,card:`params`},{type:`explain`,id:`local`,title:`함수 안의 이름은 함수 안에서만`,body:"함수 안에서 `=`로 담은 이름은 그 함수 안에서만 쓰는 지역 이름이에요. 밖에 같은 이름이 있어도 서로 다른 이름표라, 함수 안에서 `=`로 다시 담아도 밖의 값은 그대로예요. 매개변수도 지역 이름이라 마찬가지지만, 넘겨받은 리스트를 `append`로 고치면 밖에서 넘긴 그 리스트가 바뀌어요(3강). 함수가 끝나면 지역 이름은 사라지니, 결과는 `return`으로 돌려주고 부른 쪽에서 `x = f()`처럼 받아 써야 해요.",code:`score = 10
def bonus(score):
    score = score + 5
    return score
bonus(score)
print(score, bonus(score))`,trace:["`score = 10` → 함수 밖에서 score에 10을 담아요","`def bonus(score):` → 매개변수 score는 함수 안에서만 쓰는 새 이름이에요","`score = score + 5` → 함수 안의 score만 15가 돼요. 밖의 score와는 다른 이름표예요","`return score` → 안쪽 score의 값 15를 돌려줘요","`bonus(score)` → 15를 돌려받았지만 아무 데도 담지 않아 그대로 버려져요","`print(score, bonus(score))` → 밖의 score는 그대로 10이고, 돌려받은 값을 바로 쓰면 15 → **10 15**"],output:`10 15
`,mistake:"`bonus(score)`만 부르고 score가 바뀌었다고 생각하기. 함수는 안의 지역 이름만 바꾸고, 돌려준 값은 받지 않으면 버려져요. `score = bonus(score)`처럼 받아서 다시 담아요.",in_code:"함수 안에서 `global total`이라고 써서 밖의 이름을 직접 바꾸는 코드도 있지만, 어디서 값이 바뀌는지 찾기 어려워져요. 그래서 `total += f(x)`처럼 돌려받은 값을 함수 밖에서 쌓는 코드가 더 흔하고 안전해요."},{type:`example`,id:`theory-py-func-ex3`,kind:`choice`,title:`이름을 바꾸는 함수`,prompt:`아래 코드의 출력값을 고르세요.`,code:`name = "민아"
def rename():
    name = "준호"
    return name
other = rename()
print(name, other)`,output:`민아 준호
`,choices:[`민아 준호`,`준호 준호`,`민아 민아`,`오류 발생`],answer:`민아 준호`,feedback:{"준호 준호":`함수 안에서 name에 담으면 밖의 name도 바뀐다고 생각했나요?`,"민아 민아":`함수가 안에서 담은 값이 아니라 밖의 name을 돌려준다고 생각했나요?`,"오류 발생":`함수 안에서 밖과 같은 이름을 쓰면 오류가 난다고 생각했나요?`},explanation:`함수 안의 name = "준호"는 함수 안에서만 쓰는 지역 이름이라 밖의 name은 민아 그대로예요. 함수는 지역 name의 값 준호를 돌려주고, 그 값이 other에 담겨요.`,card:`local`},{type:`explain`,id:`mutable-default`,title:`기본값 리스트는 한 번만 만들어져요`,body:"기본값은 함수를 만들 때 딱 한 번 계산돼요. 그래서 `book=[]`처럼 리스트를 기본값으로 두면, 인자를 넘기지 않은 모든 호출이 그 리스트 하나를 함께 써요. 한 호출에서 append한 값이 다음 호출에도 남아 있는 이유예요. 호출마다 새 리스트가 필요하면 기본값을 `None`으로 두고, 함수 안에서 `if book is None:`일 때 새 리스트를 만들어요.",code:`def stamp(day, book=[]):
    book.append(day)
    return book
a = stamp("월")
b = stamp("화")
print(a, a is b)`,trace:["`def stamp(day, book=[]):` → 함수를 만드는 이때 빈 리스트 하나가 기본값으로 만들어져요","`book.append(day)` → 넘겨받은 리스트나 기본값 리스트에 day를 넣어요","`return book` → 그 리스트를 돌려줘요",'`a = stamp("월")` → 기본값 리스트에 "월"이 들어가고, a가 그 리스트를 가리켜요','`b = stamp("화")` → 새 리스트가 아니라 같은 기본값 리스트에 "화"가 더해져요',"`print(a, a is b)` → a와 b는 같은 리스트 하나라 → **['월', '화'] True**"],output:`['월', '화'] True
`,mistake:"부를 때마다 `book=[]`가 새 빈 리스트를 만든다고 생각하기. 기본값은 함수를 만들 때 한 번만 만들어져서, 인자를 넘기지 않은 호출끼리 같은 리스트를 나눠 써요.",in_code:"`def add(item, items=None):` 다음 줄에 `if items is None:`과 `items = []`가 있으면 이 함정을 피하려는 코드예요. 리스트나 딕셔너리를 기본값으로 바로 쓴 함수를 보면 먼저 의심해 봐요."},{type:`example`,id:`theory-py-func-ex4`,kind:`choice`,title:`메모 개수 세기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`def note(msg, out=[]):
    out.append(msg)
    return len(out)

note("시작")
print(note("저장"), note("끝", []))`,output:`2 1
`,choices:[`2 1`,`1 1`,`2 3`,`오류 발생`],answer:`2 1`,feedback:{"1 1":`부를 때마다 out=[]가 새 빈 리스트를 만든다고 생각했나요?`,"2 3":`새 리스트 []를 넘겨도 기본값 리스트에 이어서 넣는다고 생각했나요?`,"오류 발생":`리스트를 기본값으로 쓰면 오류가 난다고 생각했나요?`},explanation:`첫 호출과 note("저장")은 같은 기본값 리스트를 써서 두 번째에는 원소가 2개예요. note("끝", [])는 새 빈 리스트를 넘겼으니 그 리스트에만 넣어 1이에요.`,card:`mutable-default`},{type:`summary`,points:["`def`로 만든 함수는 부를 때 실행되고, `return 값`이 그 값을 돌려줘요. return이 없으면 None이에요.","위치 인자는 왼쪽 매개변수부터 채우고, `n=3`처럼 이름을 붙이면 그 매개변수에만 들어가요. 빠진 매개변수는 기본값을 써요.",`함수 안에서 담은 이름과 매개변수는 지역 이름이라 밖의 같은 이름을 바꾸지 않아요. 결과는 돌려받아 담아야 남아요.`,"기본값은 함수를 만들 때 한 번만 만들어져요. 리스트 기본값은 호출끼리 함께 쓰니 `None`을 기본값으로 둬요."]}],covers:{"py-func-01":[`def-return`],"py-func-02":[`def-return`,`params`],"py-func-03":[`params`,`mutable-default`],"py-func-04":[`def-return`,`local`]}},{id:`theory-py-star`,version:1,concept_id:`py-star`,title:`*와 ** 펼치기`,minutes:17,steps:[{type:`explain`,id:`collect-args`,title:`정의의 *는 남은 인자를 모아요`,body:"함수를 만들 때 매개변수 이름 앞에 별표를 붙인 `*extras`는, 앞의 매개변수가 가져가고 남은 위치 인자를 개수와 상관없이 모두 모아 튜플로 받아요. 남은 인자가 없으면 빈 튜플 `()`이고, 하나면 `('계란',)`처럼 원소 하나짜리 튜플이에요. 그래서 인자를 몇 개 넘겨도 오류가 나지 않아요. 이름은 무엇이든 되지만 흔히 `*args`라고 써요.",code:`def order(menu, *extras):
    print(menu, extras, len(extras))
order("라면")
order("라면", "계란")
order("김밥", "단무지", "국")`,trace:["`def order(menu, *extras):` → 첫 인자는 menu가 받고, 남은 인자는 extras가 튜플로 모아요","`print(menu, extras, len(extras))` → 받은 값과 모인 개수를 보여 줘요",'`order("라면")` → 남은 인자가 없어 빈 튜플 → **라면 () 0**',`\`order("라면", "계란")\` → 하나만 남아도 튜플이라 쉼표가 붙어요 → **라면 ('계란',) 1**`,`\`order("김밥", "단무지", "국")\` → 남은 둘을 모아 → **김밥 ('단무지', '국') 2**`],output:`라면 () 0
라면 ('계란',) 1
김밥 ('단무지', '국') 2
`,mistake:"`*extras`가 리스트를 받는다고 생각하기. 함수 정의에서 별표로 모은 인자는 튜플이에요. 5강의 `first, *rest = …`는 리스트로 받으니 둘을 헷갈리지 않게 해요.",in_code:"`def log(*args):`처럼 만든 함수는 몇 개를 넘기든 모두 튜플 args로 받아요. `print`처럼 인자 개수가 자유로운 기본 함수도 같은 방식으로 만들어져 있어요."},{type:`example`,id:`theory-py-star-ex1`,kind:`choice`,title:`남은 인자 세기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`def more(a, *rest):
    return len(rest)

print(more(7), more(7, 3, 9))`,output:`0 2
`,choices:[`0 2`,`1 3`,`오류 발생`],answer:`0 2`,feedback:{"1 3":`첫 인자도 *rest에 함께 모인다고 생각했나요?`,"오류 발생":`남은 인자가 하나도 없으면 *rest 때문에 오류가 난다고 생각했나요?`},explanation:`첫 인자 7은 a가 가져가고, *rest는 남은 인자만 모아요. more(7)은 남은 게 없어 빈 튜플이라 0, more(7, 3, 9)는 3과 9가 모여 2예요.`,card:`collect-args`},{type:`explain`,id:`spread-call`,title:`호출의 *는 펼쳐 넘겨요`,body:'함수를 부를 때 리스트나 튜플 앞에 별표를 붙이면, 원소를 하나씩 꺼내 위치 인자로 펼쳐 넘겨요. 그래서 `hm(*t)`는 `hm(9, 30)`과 같아요. `print(*t, sep=":")`도 `print(9, 30, sep=":")`가 되어, `sep`(값 사이에 넣을 글자, 기본은 공백)이 값 사이에 들어가요. 별표 없이 묶음 하나만 넘기면 값이 하나라 sep이 들어갈 자리가 없어요. 같은 `*`라도 `w * h`처럼 두 값 사이에 있으면 곱셈이고, `f(*t)`나 `[*t, 5]`처럼 값 앞에 붙으면 펼치기예요.',code:`def hm(h, m):
    return f"{h}시 {m}분"
t = (9, 30)
print(hm(*t))
print(*t, sep=":")
print(t, sep=":")`,trace:["`def hm(h, m):` → 시와 분, 두 값을 받는 함수예요",'`return f"{h}시 {m}분"` → 받은 두 값으로 글자를 만들어 돌려줘요',"`t = (9, 30)` → 시와 분을 튜플 하나로 묶어요","`print(hm(*t))` → *t가 튜플을 풀어 hm(9, 30)으로 부르니 → **9시 30분**",'`print(*t, sep=":")` → print(9, 30, sep=":")가 되어 두 값 사이에 :이 들어가요 → **9:30**','`print(t, sep=":")` → 튜플 하나만 넘겨 값이 하나라 sep이 쓰이지 않아요 → **(9, 30)**'],output:`9시 30분
9:30
(9, 30)
`,mistake:"`hm(t)`처럼 별표 없이 묶음을 넘기기. 튜플이 통째로 h 하나에 들어가고 m은 받을 값이 없어 TypeError가 나요. 원소를 각각의 인자로 넘기려면 `hm(*t)`처럼 펼쳐요.",in_code:'`print(*names, sep=", ")`처럼 리스트를 펼쳐 쉼표로 이어 출력하는 줄을 자주 봐요. 함수 정의의 `*args`는 모으기, 호출의 `f(*xs)`는 펼치기라고 짝지어 기억해요.'},{type:`example`,id:`theory-py-star-ex2`,kind:`line`,title:`'11/25'가 나오는 줄`,prompt:`아래 코드에서 11/25를 출력하는 줄을 고르세요.`,code:`day = [11, 25]
print(*day, sep="/")
print(day, sep="/")
print(*day)`,output:`11/25
[11, 25]
11 25
`,choices:[`2`,`3`,`4`],answer:`2`,check:{type:`prints`,target:`11/25`},feedback:{3:`리스트 하나만 넘겨도 sep이 원소 사이에 들어간다고 생각했나요?`,4:`sep을 주지 않아도 앞 줄의 sep이 이어서 쓰인다고 생각했나요?`},explanation:`2번 줄은 *day가 print(11, 25, sep="/")로 펼쳐져 11/25예요. 3번 줄은 리스트 하나라 [11, 25]가 그대로 나오고, 4번 줄은 sep을 주지 않아 기본값인 공백으로 11 25가 나와요.`,card:`spread-call`},{type:`explain`,id:`join-str`,title:`join은 문자열만 이어요`,body:'2강의 `"-".join(리스트)`는 원소가 모두 문자열일 때만 쓸 수 있어요. 수가 섞이면 TypeError가 나서, `str(n) for n in nums`처럼 하나씩 문자열로 바꿔 넘겨요. 괄호 안에 대괄호 없이 쓴 이 모양은 4강의 리스트 컴프리헨션과 같지만, 리스트를 만들지 않고 값을 하나씩 바로 건네요(생성기 식이라고 해요). 수를 이어 출력만 할 거라면 `print(*nums, sep="")`처럼 펼쳐도 돼요. 5강처럼 `head, *tail = nums`로 나눠 받은 값도 `print(head, *tail)`처럼 다시 펼치면 원소가 모두 넘어가요.',code:`codes = ["A", "B", "C"]
print("-".join(codes))
nums = [4, 0, 9]
print("".join(str(n) for n in nums))
print(*nums, sep="")`,trace:['`codes = ["A", "B", "C"]` → 문자열 세 개를 담아요','`"-".join(codes)` → 원소 사이에만 -를 넣어 이어요 → **A-B-C**',"`nums = [4, 0, 9]` → 이번에는 수 세 개예요",'`"".join(str(n) for n in nums)` → 수를 하나씩 문자열로 바꿔 빈 글자로 이어요 → **409**','`print(*nums, sep="")` → 수를 펼쳐 넘기고 사이에 아무것도 넣지 않아요 → **409**'],output:`A-B-C
409
409
`,mistake:'`"-".join(nums)`처럼 수 리스트를 바로 잇기. join은 문자열만 이을 수 있어서 TypeError가 나요. 먼저 `str()`로 하나씩 바꿔요.',in_code:'`", ".join(str(x) for x in values)`는 수를 쉼표로 이어 보여 줄 때 AI가 아주 자주 쓰는 줄이에요. `", ".join(map(str, values))`도 같은 뜻으로, map은 모든 값에 str을 적용한다는 뜻이에요.'},{type:`example`,id:`theory-py-star-ex3`,kind:`choice`,title:`숫자를 이어 붙인 번호`,prompt:`아래 코드의 출력값을 고르세요.`,code:`pin = [2, 0, 5]
code = "".join(str(d) for d in pin)
print(code, len(code))`,output:`205 3
`,choices:[`205 3`,`7 1`,`2 0 5 5`],answer:`205 3`,feedback:{"7 1":`join이 숫자를 더해 하나의 수로 만든다고 생각했나요?`,"2 0 5 5":`빈 글자 ""로 이어도 원소 사이에 공백이 들어간다고 생각했나요?`},explanation:`str(d)가 수를 하나씩 문자열 "2", "0", "5"로 바꾸고, 빈 글자로 이어 문자열 "205"가 돼요. 글자 세 개라 len은 3이에요.`,card:`join-str`},{type:`explain`,id:`zip-star`,title:`zip(*행들)로 열 만들기`,body:"`zip(a, b)`는 두 묶음에서 같은 번호의 원소끼리 짝지어 튜플로 묶어 줘요. 결과는 `list()`로 바꿔야 한눈에 보여요(14강에서 더 배워요). 행들이 담긴 리스트에 `zip(*행들)`을 쓰면 별표가 행을 하나씩 따로 넘겨 `zip(행1, 행2)`가 되고, 결과는 각 행의 첫 번째끼리, 두 번째끼리 묶은 열이에요. 칸이 두 개면 열도 두 묶음이라 `a, b = zip(*행들)`로 나눠 받을 수 있고, 각 열은 리스트가 아니라 튜플이에요. 나눠 받은 열에는 `max(묶음)`(가장 큰 값)이나 `sum(묶음)`(모두 더한 합계)을 바로 쓸 수 있어요.",code:`who = ["민아", "준호"]
ages = [9, 11]
print(list(zip(who, ages)))
pairs = [("a", 1), ("b", 2)]
ks, vs = zip(*pairs)
print(ks, vs, max(vs), sum(vs))`,trace:['`who = ["민아", "준호"]` → 이름 두 개를 담아요',"`ages = [9, 11]` → 나이 두 개를 같은 순서로 담아요","`list(zip(who, ages))` → 같은 번호끼리 짝지은 튜플들 → **[('민아', 9), ('준호', 11)]**",'`pairs = [("a", 1), ("b", 2)]` → 행 두 개, 칸 두 개짜리 표예요','`ks, vs = zip(*pairs)` → zip(("a", 1), ("b", 2))가 되어 첫 칸끼리, 둘째 칸끼리 묶은 두 열을 두 이름에 나눠 담아요',"`print(ks, vs, max(vs), sum(vs))` → 열은 튜플이고, max는 가장 큰 값, sum은 합계예요 → **('a', 'b') (1, 2) 2 3**"],output:`[('민아', 9), ('준호', 11)]
('a', 'b') (1, 2) 2 3
`,mistake:"`zip(pairs)`처럼 별표 없이 넘기기. 묶음 하나만 넘긴 셈이라 열로 나뉘지 않고, 행마다 `(('a', 1),)`처럼 한 겹 더 싸인 튜플이 나와요. 행을 따로 넘기려면 `zip(*pairs)`처럼 펼쳐요.",in_code:"행 단위로 읽은 표를 열 단위로 바꿀 때 `cols = list(zip(*table))`이라는 관용구를 자주 봐요. 행과 열을 뒤바꾸는 가장 짧은 방법이에요."},{type:`example`,id:`theory-py-star-ex4`,kind:`choice`,title:`가운데 열`,prompt:`아래 코드의 출력값을 고르세요.`,code:`grid = [(1, 2, 3), (4, 5, 6)]
a, b, c = zip(*grid)
print(b)`,output:`(2, 5)
`,choices:[`(2, 5)`,`(4, 5, 6)`,`[2, 5]`,`오류 발생`],answer:`(2, 5)`,feedback:{"(4, 5, 6)":`zip(*grid)가 행을 그대로 돌려줘 b가 둘째 행이 된다고 생각했나요?`,"[2, 5]":`zip이 묶은 열을 리스트로 돌려준다고 생각했나요?`,"오류 발생":`행이 두 개인데 이름 세 개에 나눠 담으면 오류가 난다고 생각했나요?`},explanation:`zip(*grid)는 zip((1, 2, 3), (4, 5, 6))이라 칸끼리 묶은 열 세 개 (1, 4), (2, 5), (3, 6)을 만들어요. 열이 세 개라 세 이름에 나뉘고, b는 둘째 열 (2, 5)예요.`,card:`zip-star`},{type:`explain`,id:`kwargs`,title:`별표 두 개는 이름 붙인 인자`,body:"함수를 만들 때 `**attrs`처럼 별표 두 개를 붙인 매개변수는, 이름이 맞는 매개변수가 없는 키워드 인자를 모두 모아 딕셔너리로 받아요. 거꾸로 부를 때 딕셔너리 앞에 별표 두 개를 붙인 `tag(**opt)`는 키를 이름으로 삼아 키워드 인자로 펼쳐 넘겨요. 이름이 맞는 키는 그 매개변수가 받고, 받는 매개변수가 없는 키만 attrs에 모여요. 넘어오지 않은 매개변수는 기본값을 써요.",code:`def tag(text, size=1, **attrs):
    return text, size, attrs
print(tag("hi", id=3))
opt = {"text": "ok", "bold": True}
print(tag(**opt))`,trace:["`def tag(text, size=1, **attrs):` → text와 size가 받지 않은 키워드 인자는 `**attrs`가 딕셔너리로 모아요","`return text, size, attrs` → 세 값을 튜플 하나로 돌려줘요",`\`print(tag("hi", id=3))\` → id라는 매개변수가 없어 attrs에 모이고, size는 기본값 → **('hi', 1, {'id': 3})**`,'`opt = {"text": "ok", "bold": True}` → 키워드 인자로 넘길 이름과 값을 딕셔너리에 담아요',"`print(tag(**opt))` → `**opt`가 text=\"ok\", bold=True로 펼쳐져, text는 매개변수가 받고 bold만 attrs에 모여요 → **('ok', 1, {'bold': True})**"],output:`('hi', 1, {'id': 3})
('ok', 1, {'bold': True})
`,mistake:"`**attrs`에 모든 키워드 인자가 모인다고 생각하기. 이름이 맞는 매개변수가 먼저 가져가서, `**opt`로 펼친 text 키는 attrs에 들어가지 않아요.",in_code:"읽어 온 설정 딕셔너리를 `build(**settings)`처럼 펼쳐 넘기거나, 받은 옵션을 `**kwargs`로 모아 다른 함수에 그대로 전달하는 코드를 자주 봐요."},{type:`example`,id:`theory-py-star-ex5`,kind:`choice`,title:`모인 키 이름`,prompt:`아래 코드의 출력값을 고르세요.`,code:`def make(name, **opts):
    return list(opts)
d = {"ml": 350, "name": "컵"}
print(make(**d))`,output:`['ml']
`,choices:[`['ml']`,`['ml', 'name']`,`[350]`,`[]`],answer:`['ml']`,feedback:{"['ml', 'name']":`이름이 맞는 매개변수가 있는 키도 opts에 함께 모인다고 생각했나요?`,"[350]":`list(딕셔너리)가 키가 아니라 값을 모은다고 생각했나요?`,"[]":`딕셔너리를 펼치면 매개변수 이름과 같은 키만 넘어간다고 생각했나요?`},explanation:`별표 두 개로 d를 펼치면 make(ml=350, name="컵")으로 부른 것과 같아요. name은 매개변수가 받고 ml만 opts에 모이며, list(딕셔너리)는 키 목록이라 ['ml']이에요.`,card:`kwargs`},{type:`explain`,id:`dict-merge`,title:`딕셔너리 펼쳐 합치기`,body:"중괄호 안에서 `{**a, **b}`처럼 딕셔너리를 펼치면, 쌍들을 차례로 넣은 새 딕셔너리가 돼요. 같은 키는 나중에 펼친 쪽의 값이 이기고, 키의 자리는 처음 들어간 곳을 따라요. `a | b`도 같은 새 딕셔너리를 만들어요. `a.update(b)`는 a 자체를 고치고 None을 돌려줘요(3강의 `sort()`와 같은 성질).",code:`a = {"qty": 1, "wrap": False}
b = {"wrap": True, "memo": "문앞"}
print({**a, **b})
print({**b, **a})
print(a | b == dict(a, **b))
print(a.update(b), a)`,trace:['`a = {"qty": 1, "wrap": False}` → 주문 옵션 a예요','`b = {"wrap": True, "memo": "문앞"}` → wrap 키가 a와 겹치는 옵션 b예요',"`print({**a, **b})` → a를 먼저, b를 나중에 펼쳐 wrap은 b의 True가 이기고 자리는 a의 순서 → **{'qty': 1, 'wrap': True, 'memo': '문앞'}**","`print({**b, **a})` → 순서를 바꾸면 a의 False가 이기고 키 순서도 b를 따라요 → **{'wrap': False, 'memo': '문앞', 'qty': 1}**","`print(a | b == dict(a, **b))` → `a | b`와 `dict(a, **b)`는 둘 다 b가 이기는 같은 새 딕셔너리라 → **True**","`print(a.update(b), a)` → update는 a 자체를 고치고 None을 돌려줘요 → **None {'qty': 1, 'wrap': True, 'memo': '문앞'}**"],output:`{'qty': 1, 'wrap': True, 'memo': '문앞'}
{'wrap': False, 'memo': '문앞', 'qty': 1}
True
None {'qty': 1, 'wrap': True, 'memo': '문앞'}
`,mistake:"`merged = a.update(b)`로 합친 결과를 받으려 하기. update는 a 자체를 고치고 None을 돌려줘서 merged는 None이에요. 새 딕셔너리가 필요하면 `{**a, **b}`나 `a | b`를 써요.",in_code:"여러 곳에서 모은 옵션을 `opts = {**common, **local}`처럼 합쳐 한 번에 넘기는 줄을 봐요. 뒤에 쓴 쪽이 이긴다는 점만 기억하면 읽기 쉬워요. `a | b`는 Python 3.9부터 쓸 수 있어요."},{type:`example`,id:`theory-py-star-ex6`,kind:`choice`,title:`펼치는 순서`,prompt:`아래 코드의 출력값을 고르세요.`,code:`x = {"m": 1, "n": 2}
y = {"n": 5, "k": 0}
z = {**y, **x}
print(z)`,output:`{'n': 2, 'k': 0, 'm': 1}
`,choices:[`{'n': 2, 'k': 0, 'm': 1}`,`{'n': 5, 'k': 0, 'm': 1}`,`{'m': 1, 'n': 2, 'k': 0}`,`{'m': 1, 'n': 5, 'k': 0}`],answer:`{'n': 2, 'k': 0, 'm': 1}`,feedback:{"{'n': 5, 'k': 0, 'm': 1}":`먼저 펼친 y의 값이 같은 키에서 이긴다고 생각했나요?`,"{'m': 1, 'n': 2, 'k': 0}":`키 순서가 이긴 값을 준 x를 따른다고 생각했나요?`,"{'m': 1, 'n': 5, 'k': 0}":`중괄호 안에서 x가 y보다 먼저 펼쳐진다고 생각했나요?`},explanation:`y를 먼저 펼쳐 n, k가 자리를 잡고, 나중에 펼친 x가 n의 값을 2로 덮어쓴 뒤 m을 끝에 붙여요. 그래서 키 순서는 n, k, m이고 n은 2예요.`,card:`dict-merge`},{type:`summary`,points:["정의의 `*args`는 남은 위치 인자를 튜플로 모아요. 하나도 없으면 `()`, 하나면 `(값,)`이에요.",'호출의 `f(*xs)`와 `[*xs, 5]`는 원소를 펼쳐 넣고, `print(*xs, sep="-")`는 값 사이에 sep을 넣어요. 두 값 사이의 `*`는 곱셈이에요.',"join은 문자열만 이어요. 수는 `str(n) for n in xs`로 바꿔 넘겨요.","`zip(a, b)`는 같은 번호끼리 튜플로 묶고, `zip(*행들)`은 행을 열로 바꿔요.","정의의 `**kw`는 남은 키워드 인자를 딕셔너리로 모으고, 호출의 `f(**d)`는 키를 인자 이름으로 펼쳐요.","`{**a, **b}`와 `a | b`는 같은 키에서 b가 이기는 새 딕셔너리를 만들고, `a.update(b)`는 a를 고치고 None을 돌려줘요."]}],covers:{"py-star-01":[`collect-args`],"py-star-02":[`spread-call`],"py-star-03":[`kwargs`],"py-star-04":[`spread-call`,`zip-star`],"py-star-05":[`dict-merge`],"py-star-06":[`spread-call`,`join-str`]}},{id:`theory-py-decorator`,version:2,concept_id:`py-decorator`,title:`데코레이터 @`,minutes:15,steps:[{type:`explain`,id:`func-value`,title:`함수도 값이에요`,body:"`hi`처럼 괄호 없이 쓴 함수 이름은 함수 그 자체라서, 다른 이름에 담거나 다른 함수에 넘길 수 있어요. 괄호를 붙인 `hi()`는 함수를 실행해 돌려받은 값이에요. 그래서 `say = hi`는 같은 함수에 이름표를 하나 더 붙이는 거고(3강의 리스트처럼), `two(hi)`는 함수를 넘겨 two 안에서 부르게 해요. `함수.__name__`은 그 함수를 만들 때 쓴 이름을 문자열로 알려 줘요.",code:`def hi():
    return "안녕"
def two(f):
    return f() + f()
say = hi
print(say(), two(hi), say.__name__)`,trace:["`def hi():` → 인자 없이 부르는 함수를 만들어요",'`return "안녕"` → 부르면 "안녕"을 돌려줘요',"`def two(f):` → 함수를 받아 f라는 이름으로 쓰는 함수예요","`return f() + f()` → 받은 함수를 두 번 불러 결과를 이어 붙여요","`say = hi` → 괄호가 없으니 실행하지 않고, 함수 자체에 이름표 say를 더 붙여요","`print(say(), two(hi), say.__name__)` → say()는 hi를 부른 것, two(hi)는 두 번 부른 것, 이름은 만들 때의 hi → **안녕 안녕안녕 hi**"],output:`안녕 안녕안녕 hi
`,mistake:'`two(hi())`처럼 괄호를 붙여 넘기기. 그러면 함수가 아니라 이미 실행한 결과 "안녕"이 넘어가서, two 안의 `f()`가 글자를 부르려다 TypeError가 나요.',in_code:"`sorted(words, key=len)`처럼 함수 이름을 괄호 없이 넘기는 줄을 자주 봐요. sorted가 원소마다 len을 불러 그 결과로 정렬하라는 뜻이에요."},{type:`example`,id:`theory-py-decorator-ex1`,kind:`choice`,title:`함수를 넘겨 부르기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`def up(s):
    return s.upper()
def apply(f, x):
    return f(x)
print(apply(up, "ok"), up.__name__)`,output:`OK up
`,choices:[`OK up`,`ok up`,`OK OK`,`오류 발생`],answer:`OK up`,feedback:{"ok up":`apply 안의 f(x)가 up을 부르지 않고 x를 그대로 돌려준다고 생각했나요?`,"OK OK":`__name__이 함수를 실행한 결과를 돌려준다고 생각했나요?`,"오류 발생":`괄호 없이 쓴 함수 이름은 다른 함수에 넘길 수 없다고 생각했나요?`},explanation:`apply(up, "ok")는 함수 up을 f로 받아 f("ok")로 불러 "OK"를 돌려줘요. up.__name__은 실행 결과가 아니라 함수를 만들 때 쓴 이름 up이에요.`,card:`func-value`},{type:`explain`,id:`wrapper`,title:`함수를 감싸는 함수`,body:"함수를 받아서, 그 함수를 안에서 부르는 새 함수를 만들어 돌려주는 함수를 만들 수 있어요. 바깥 함수 안에서 `def inner`로 만든 함수는 바깥 함수가 받은 `func`를 기억해 두었다가, 불릴 때 그것을 불러요. `size = plus1(len)`은 len을 감싼 새 함수를 받을 뿐, len 자체는 바뀌지 않아요. 이렇게 함수를 받아 감싼 함수를 돌려주는 함수를 데코레이터라고 하고, 안쪽 함수를 흔히 wrapper(포장지)라고 불러요.",code:`def plus1(func):
    def inner(x):
        return func(x) + 1
    return inner
size = plus1(len)
print(size("abc"), len("abc"))`,trace:["`def plus1(func):` → 함수를 받아 func라는 이름에 담는 함수예요","`def inner(x):` → plus1 안에서 새 함수 inner를 만들어요. 아직 실행하지 않아요","`return func(x) + 1` → inner가 불리면 받아 둔 func를 부르고 1을 더해요","`return inner` → 괄호 없이, 만든 inner 함수 자체를 돌려줘요","`size = plus1(len)` → len을 감싼 새 함수가 size에 담겨요. len은 그대로예요",'`print(size("abc"), len("abc"))` → size는 len의 결과 3에 1을 더하고, 원래 len은 그대로 → **4 3**'],output:`4 3
`,mistake:"`return inner()`처럼 괄호를 붙여 돌려주기. 새 함수가 아니라 inner를 실행한 결과를 돌려주게 되고, 이 코드에서는 inner가 받을 x가 없어 TypeError가 나요. 감싼 함수를 돌려줄 때는 괄호 없이 `return inner`예요.",in_code:"`timer(func)`나 `retry(func)`처럼 함수를 받아 시간을 재거나 다시 시도하는 기능을 덧입히는 코드가 이 모양이에요. 원래 함수는 손대지 않고 앞뒤에 할 일만 더해요."},{type:`example`,id:`theory-py-decorator-ex2`,kind:`choice`,title:`두 번 부르는 포장`,prompt:`아래 코드의 출력값을 고르세요.`,code:`def twice(func):
    def inner(x):
        return func(func(x))
    return inner

def add3(n):
    return n + 3

f = twice(add3)
print(f(1), add3(1))`,output:`7 4
`,choices:[`7 4`,`7 7`,`4 4`,`8 4`],answer:`7 4`,feedback:{"7 7":`twice(add3)가 원래 add3도 바꿔 놓는다고 생각했나요?`,"4 4":`inner가 func를 한 번만 부른다고 생각했나요?`,"8 4":`twice가 결과에 2를 곱한다고 생각했나요?`},explanation:`f는 add3을 감싼 inner라 f(1)은 add3(add3(1)), 곧 add3(4)라서 7이에요. twice는 새 함수를 돌려줄 뿐이라 add3(1)은 그대로 4예요.`,card:`wrapper`},{type:`explain`,id:`at-sign`,title:`@는 만들자마자 감싸 담기`,body:"`@mark`를 `def` 바로 위에 쓰면, 함수를 만든 직후 `hi = mark(hi)`를 실행한 것과 같아요. 데코레이터가 돌려준 값이 그 이름에 다시 담기는 거예요. 이 일은 함수를 부를 때가 아니라 def 문이 실행되어 함수가 만들어지는 순간 한 번 일어나서, hi를 한 번도 부르지 않아도 mark 안의 print가 실행돼요. 데코레이터가 받은 함수를 그대로 돌려주면 hi는 원래 함수 그대로예요.",code:`def mark(fn):
    print("등록:", fn.__name__)
    return fn
@mark
def hi():
    return "안녕"`,trace:["`def mark(fn):` → 함수를 fn이라는 이름으로 받는 데코레이터를 만들어요",'`print("등록:", fn.__name__)` → 받은 함수의 이름을 출력하는 줄이에요',"`return fn` → 받은 함수를 바꾸지 않고 그대로 돌려줘요","`@mark` → 바로 아래 함수를 만들자마자 mark에 넘기라는 표시예요","`def hi():` → hi를 만든 직후 `hi = mark(hi)`가 실행되어 → **등록: hi**",'`return "안녕"` → hi의 본문이에요. hi를 부르지 않았으니 실행되지 않아요'],output:`등록: hi
`,mistake:"데코레이터가 함수를 부를 때마다 실행된다고 생각하기. `@mark`는 def가 실행될 때 mark를 한 번 부르고 끝이에요. 부를 때마다 할 일은 앞 카드의 inner처럼 감싼 함수 안에 넣어요.",in_code:"AI가 쓴 코드에서 `@functools.cache`처럼 표준 라이브러리의 데코레이터를 붙인 함수도 같은 규칙이에요. def가 실행되는 순간 한 번 감싸지고, 그 뒤로 그 이름은 감싼 함수를 가리켜요."},{type:`example`,id:`theory-py-decorator-ex3`,kind:`choice`,title:`언제 기록될까`,prompt:`아래 코드의 출력값을 고르세요.`,code:`trail = []
def track(func):
    trail.append("감쌈")
    def inner():
        trail.append("실행")
        return func()
    return inner

@track
def job():
    return 1

print(trail)`,output:`['감쌈']
`,choices:[`['감쌈']`,`[]`,`['감쌈', '실행']`],answer:`['감쌈']`,feedback:{"[]":`데코레이터는 함수를 부를 때에야 실행된다고 생각했나요?`,"['감쌈', '실행']":`def 직후에 감싼 inner까지 실행된다고 생각했나요?`},explanation:`@track은 def job이 실행되는 순간 job = track(job)을 실행해 "감쌈"을 남겨요. inner는 만들어서 돌려줬을 뿐 job()을 부르지 않았으니 "실행"은 없어요.`,card:`at-sign`},{type:`explain`,id:`wrapper-args`,title:`어떤 인자든 그대로 넘기고 돌려주기`,body:"어떤 함수든 감쌀 수 있게 하려면 wrapper를 `def inner(*args, **kwargs):`로 만들어, 위치 인자는 튜플 args에, 이름 붙인 인자는 딕셔너리 kwargs에 모두 모아요(9강). 그리고 `func(*args, **kwargs)`로 모은 것을 다시 펼쳐 넘기면 원래 호출과 똑같이 전달돼요. `func(args)`처럼 별표 없이 넘기면 튜플이 통째로 인자 하나가 되어 버려요. 감싼 함수의 결과를 쓰려면 inner가 그 값을 `return`으로 돌려줘야 해요.",code:`def keep(func):
    def inner(*args, **kwargs):
        return func(*args, **kwargs)
    return inner
top = keep(sorted)
print(top([3, 9, 1], reverse=True))`,trace:["`def keep(func):` → 감쌀 함수를 받는 데코레이터예요","`def inner(*args, **kwargs):` → 위치 인자는 args에 튜플로, 이름 붙인 인자는 `**kwargs`가 딕셔너리로 모아요","`return func(*args, **kwargs)` → args와 `**kwargs`로 모은 것을 다시 펼쳐 원래 함수에 똑같이 넘기고, 결과를 돌려줘요","`return inner` → 감싼 함수를 돌려줘요","`top = keep(sorted)` → sorted를 감싼 inner가 top에 담겨요","`top([3, 9, 1], reverse=True)` → args는 ([3, 9, 1],), kwargs는 {'reverse': True}로 모였다가 sorted에 그대로 넘어가요 → **[9, 3, 1]**"],output:`[9, 3, 1]
`,mistake:"inner 마지막 줄의 `return`을 빠뜨리기. `func(*args, **kwargs)`만 쓰면 원래 함수는 실행되지만 결과가 버려지고, inner는 return이 없는 함수라 None을 돌려줘요. 그래서 9강의 `sum(리스트)`처럼 합계를 돌려주는 함수를 감싸도 None만 나와요. `return func(*args, **kwargs)`처럼 꼭 돌려줘요.",in_code:"실제 코드의 데코레이터는 대부분 `def wrapper(*args, **kwargs):`와 `return func(*args, **kwargs)` 두 줄을 품고 있어요. 이 두 줄이 보이면 '원래 호출을 그대로 전달하고 결과도 그대로 돌려준다'고 읽으면 돼요."},{type:`example`,id:`theory-py-decorator-ex4`,kind:`choice`,title:`결과를 받기만 한 포장`,prompt:`아래 코드의 출력값을 고르세요.`,code:`def keep(func):
    def inner(*args):
        result = func(*args)
    return inner

@keep
def hi(name):
    return name + "!"

print(hi("민아"))`,output:`None
`,choices:[`None`,`민아!`,`오류 발생`],answer:`None`,feedback:{"민아!":`inner가 return 없이도 func의 결과를 돌려준다고 생각했나요?`,"오류 발생":`return이 없는 wrapper를 부르면 오류가 난다고 생각했나요?`},explanation:`@keep 뒤의 hi는 inner예요. inner는 원래 hi를 불러 "민아!"를 result에 담지만 돌려주지 않아서, return이 없는 함수처럼 None을 돌려줘요.`,card:`wrapper-args`},{type:`example`,id:`theory-py-decorator-ex5`,kind:`choice`,title:`별표 없이 넘긴 인자`,prompt:`아래 코드의 출력값을 고르세요.`,code:`def show(func):
    def inner(*args):
        return func(args)
    return inner

@show
def count(*items):
    return len(items)

print(count(4, 5, 6))`,output:`1
`,choices:[`1`,`3`,`오류 발생`],answer:`1`,feedback:{3:`별표 없이 args를 넘겨도 원래처럼 세 값으로 펼쳐져 넘어간다고 생각했나요?`,"오류 발생":`튜플을 통째로 인자 하나로 넘기면 오류가 난다고 생각했나요?`},explanation:`inner의 args는 (4, 5, 6)이고, func(args)는 이 튜플을 펼치지 않고 인자 하나로 넘겨요. 원래 count는 인자 하나를 받아 items가 ((4, 5, 6),)이 되니 len은 1이에요.`,card:`wrapper-args`},{type:`explain`,id:`stack`,title:`쌓으면 아래쪽부터 감싸요`,body:"데코레이터를 여러 줄 쌓으면 def에 가까운 아래쪽부터 차례로 감싸요. `@sq` 아래에 `@rd`를 쓴 함수는 `f = sq(rd(f))`와 같아서, rd가 먼저 안쪽을 감싸고 sq가 그 바깥을 감싸요. 아래 코드는 감싸는 순서를 함수 호출로 보인 것으로, 안쪽 괄호의 함수가 먼저 실행되어 결과의 안쪽에 자리 잡아요. 쌓는 순서를 바꾸면 결과도 바뀌고, 쌓은 데코레이터 줄 중 맨 아래 줄 바로 아래에는 꼭 def(또는 class)가 와야 해요.",code:`def sq(text):
    return "[" + text + "]"
def rd(text):
    return "(" + text + ")"
print(sq(rd("안녕")))
print(rd(sq("안녕")))`,trace:["`def sq(text):` → 글자를 대괄호로 감싸는 함수예요",'`return "[" + text + "]"` → 받은 글자 앞뒤에 [와 ]를 붙여요',"`def rd(text):` → 글자를 둥근 괄호로 감싸는 함수예요",'`return "(" + text + ")"` → 받은 글자 앞뒤에 (와 )를 붙여요','`sq(rd("안녕"))` → 안쪽 rd가 먼저 (안녕)을 만들고, sq가 바깥을 감싸 → **[(안녕)]**','`rd(sq("안녕"))` → 순서를 바꾸면 sq가 안쪽이 되어 → **([안녕])**'],output:`[(안녕)]
([안녕])
`,mistake:`위에 쓴 데코레이터가 먼저 적용된다고 생각하기. def에 가까운 아래쪽이 먼저 함수를 감싸서 안쪽에 자리 잡고, 맨 위의 데코레이터가 가장 바깥을 감싸요.`,in_code:`로그인 확인, 기록 남기기, 결과 저장 같은 데코레이터를 함께 붙인 함수에서는 쌓은 순서가 동작을 바꿔요. 맨 위 데코레이터가 가장 바깥이라 호출은 가장 먼저 받고, 안쪽 데코레이터가 만든 결과는 가장 나중에 받아 마무리한다고 읽으면 돼요.`},{type:`example`,id:`theory-py-decorator-ex6`,kind:`choice`,title:`느낌표와 두 번`,prompt:`아래 코드의 출력값을 고르세요.`,code:`def ex(func):
    def inner():
        return func() + "!"
    return inner

def two(func):
    def inner():
        return func() * 2
    return inner

@two
@ex
def hi():
    return "ok"

print(hi())`,output:`ok!ok!
`,choices:[`ok!ok!`,`okok!`,`ok!`,`okok`],answer:`ok!ok!`,feedback:{"okok!":`위에 쓴 @two가 먼저 감싸고 @ex가 그 바깥을 감싼다고 생각했나요?`,"ok!":`데코레이터를 쌓으면 def에 가까운 하나만 적용된다고 생각했나요?`,okok:`맨 위의 @two 하나만 적용된다고 생각했나요?`},explanation:`쌓은 데코레이터는 hi = two(ex(hi))와 같아요. def에 가까운 ex가 먼저 감싸 "ok!"를 만들고, 바깥의 two가 그 결과를 두 번 이어 ok!ok!예요.`,card:`stack`},{type:`summary`,points:["괄호 없는 함수 이름은 함수 자체라서 담고 넘길 수 있어요. `f.__name__`은 함수를 만들 때 쓴 이름이에요.",`데코레이터는 함수를 받아 감싼 새 함수를 돌려줘요. 원래 함수는 바뀌지 않아요.`,"`@deco` 아래의 `def f`는 만든 직후 `f = deco(f)`가 한 번 실행돼요. 부를 때가 아니라 def가 실행될 때예요.","범용 wrapper는 `*args`와 `**kwargs`로 받아 `func(*args, **kwargs)`로 그대로 펼쳐 넘기고, 결과를 꼭 return해요. 빠뜨리면 None이에요.",`쌓은 데코레이터는 def에 가까운 아래쪽부터 감싸고, 맨 위가 가장 바깥이에요.`]}],covers:{"py-decorator-01":[`func-value`,`wrapper`,`at-sign`],"py-decorator-02":[`func-value`,`at-sign`],"py-decorator-03":[`wrapper-args`],"py-decorator-04":[`at-sign`,`stack`],"py-decorator-05":[`wrapper-args`]}},{id:`theory-py-class`,version:1,concept_id:`py-class`,title:`클래스와 객체`,minutes:17,steps:[{type:`explain`,id:`class-init`,title:`틀로 객체를 찍어 내요`,body:"클래스는 같은 모양의 객체(값과 기능을 묶은 덩어리)를 찍어 내는 틀이에요. `Cup(300)`처럼 클래스를 부르면 새 객체가 만들어지고, 그때 `__init__`이 한 번 실행돼요. `__init__`의 첫 매개변수 `self`는 방금 만든 그 객체라서, `self.ml = ml`은 그 객체에 ml이라는 속성(객체에 붙은 이름)을 붙여요. 매개변수의 기본값은 함수와 똑같이 쓰고, 같은 클래스에서 나온 객체라도 속성은 각자 따로 가져요.",code:`class Cup:
    def __init__(self, ml=250):
        self.ml = ml
a, b = Cup(), Cup(300)
a.ml += 100
print(a.ml, b.ml)`,trace:["`class Cup:` → 컵 객체를 찍어 낼 틀(클래스)을 만들어요","`def __init__(self, ml=250):` → 객체를 만들 때 실행될 준비 메서드예요. ml을 주지 않으면 250이에요","`self.ml = ml` → 만들어지는 그 객체(self)에 ml 속성을 붙여요","`a, b = Cup(), Cup(300)` → a는 기본값 250, b는 300을 가진 서로 다른 객체예요","`a.ml += 100` → a의 ml만 350이 되고 b는 그대로예요","`print(a.ml, b.ml)` → **350 300**"],output:`350 300
`,mistake:"`def __init__(ml):`처럼 self를 빼고 쓰기. Python은 만든 객체를 첫 인자로 넣어 부르기 때문에 자리가 모자라 TypeError가 나요. 클래스 안 메서드의 첫 매개변수는 늘 self예요.",in_code:"AI가 쓴 클래스는 대부분 `__init__`에서 `self.name = name`처럼 받은 값을 같은 이름의 속성으로 옮겨 담는 줄로 시작해요. 앞의 `self.name`은 객체의 속성, 뒤의 name은 넘겨받은 매개변수예요."},{type:`example`,id:`theory-py-class-ex1`,kind:`choice`,title:`상자 넓이`,prompt:`아래 코드의 출력값을 고르세요.`,code:`class Box:
    def __init__(self, w, h=1):
        self.w = w
        self.h = h

x = Box(4)
y = Box(2, 5)
x.h = 3
print(x.w * x.h, y.w * y.h)`,output:`12 10
`,choices:[`12 10`,`4 10`,`12 6`,`오류 발생`],answer:`12 10`,feedback:{"4 10":`객체 밖에서 x.h = 3으로 담아도 속성이 바뀌지 않는다고 생각했나요?`,"12 6":`x.h를 바꾸면 같은 클래스에서 나온 y.h도 함께 바뀐다고 생각했나요?`,"오류 발생":`h를 넘기지 않고 Box(4)로 만들면 오류가 난다고 생각했나요?`},explanation:`x는 h 기본값 1로 만들어진 뒤 x.h = 3으로 바뀌어 4 × 3 = 12예요. y는 자기 속성 2와 5를 그대로 가져 10이에요.`,card:`class-init`},{type:`explain`,id:`method-self`,title:`메서드와 self`,body:"클래스 안에 만든 함수를 메서드라고 해요. `p.hello()`처럼 객체 뒤에 점을 찍어 부르면, Python이 그 객체를 첫 매개변수 self에 알아서 넣어 줘요. 그래서 메서드 안의 `self.name`은 '이 메서드를 부른 그 객체의 name'이에요. 메서드 안에서 `self.count += 1`처럼 속성을 고치면, 점 앞에 쓴 그 객체의 속성만 바뀌고 그 값은 다음 호출까지 남아 있어요.",code:`class Pet:
    def __init__(self, name):
        self.name = name
    def hello(self):
        return self.name + "예요"
print(Pet("콩이").hello())`,trace:["`class Pet:` → 반려동물 틀을 만들어요","`def __init__(self, name):` → 만들 때 이름을 받아요","`self.name = name` → 새 객체에 name 속성을 붙여요","`def hello(self):` → 클래스 안의 함수, 곧 메서드예요. self로 그 객체를 받아요",'`return self.name + "예요"` → 이 메서드를 부른 객체의 name을 꺼내 써요','`print(Pet("콩이").hello())` → 만든 객체가 self로 들어가 → **콩이예요**'],output:`콩이예요
`,mistake:"메서드를 `Pet.hello()`처럼 클래스 이름으로 부르기. 메서드는 어느 객체의 것인지 알아야 해서 self가 비어 TypeError가 나요. `p.hello()`처럼 객체 뒤에 점을 찍어 불러요.",in_code:"`timer.start()`는 `Timer.start(timer)`처럼 점 앞의 객체를 self 자리에 넣어 부르는 것과 같아요. 코드를 읽을 때 '점 앞의 객체가 곧 self'라고 바꿔 읽으면 메서드 안의 self가 누구인지 헷갈리지 않아요."},{type:`example`,id:`theory-py-class-ex2`,kind:`choice`,title:`누른 횟수`,prompt:`아래 코드의 출력값을 고르세요.`,code:`class Lamp:
    def __init__(self):
        self.count = 0

    def press(self):
        self.count += 1
        return self.count

a = Lamp()
b = Lamp()
a.press()
print(a.press(), b.press())`,output:`2 1
`,choices:[`2 1`,`1 1`,`2 2`,`3 3`],answer:`2 1`,feedback:{"1 1":`메서드를 부를 때마다 count가 처음 값 0으로 돌아간다고 생각했나요?`,"2 2":`같은 클래스의 객체끼리 count를 함께 쓴다고 생각했나요?`,"3 3":`press를 부른 횟수를 객체와 상관없이 모두 센다고 생각했나요?`},explanation:`a.press()는 self가 a라서 a의 count만 늘려요. a는 두 번 눌러 2이고, b는 자기 count를 처음 한 번 눌러 1이에요.`,card:`method-self`},{type:`explain`,id:`self-local`,title:`self.를 빼면 지역 이름`,body:"메서드 안에서 `self.kg = …`처럼 `self.`를 붙여 담아야 객체의 속성이 바뀌어요. `self.`를 빼고 `kg = …`라고 쓰면 8강에서 배운 지역 이름이라, 메서드가 끝나면 사라지고 객체에는 아무 일도 일어나지 않아요. 이름이 속성과 같아도 마찬가지예요. 그래서 속성을 바꾸려 했는데 값이 그대로라면, 대입한 줄에 `self.`가 빠졌는지 먼저 봐요.",code:`class Bag:
    def __init__(self):
        self.kg = 0
        kg = self.kg + 5
        self.kg = self.kg + 2
print(Bag().kg)`,trace:["`class Bag:` → 가방 틀을 만들어요","`def __init__(self):` → 객체를 만들 때 실행돼요. 이것도 메서드라 self가 그 객체예요","`self.kg = 0` → 객체의 kg 속성을 0으로 붙여요","`kg = self.kg + 5` → self.가 없으니 지역 이름 kg에 5를 담을 뿐, 속성은 그대로 0이에요","`self.kg = self.kg + 2` → self.가 있어 객체의 속성을 2로 바꿔요","`print(Bag().kg)` → 지역 이름 kg의 5는 메서드가 끝나며 사라지고 → **2**"],output:`2
`,mistake:"`kg = self.kg + 5`로 속성을 늘렸다고 생각하기. 오른쪽에서 속성을 읽기만 했을 뿐 담은 곳은 지역 이름이라 `self.kg`는 그대로예요. `self.kg += 5`처럼 왼쪽에도 `self.`를 붙여요.",in_code:"속성을 바꾸는 메서드를 고쳤는데도 값이 그대로라면, 대입한 줄의 왼쪽에 `self.`가 있는지부터 확인해요. 속성과 이름만 같은 지역 이름에 담는 실수는 AI가 쓴 코드에서도 나와요."},{type:`example`,id:`theory-py-class-ex3`,kind:`choice`,title:`걸음 수 기록`,prompt:`아래 코드의 출력값을 고르세요.`,code:`class Step:
    def __init__(self):
        self.n = 0

    def walk(self, k):
        n = self.n + k
        return n

s = Step()
s.walk(3)
print(s.walk(4), s.n)`,output:`4 0
`,choices:[`4 0`,`7 7`,`4 4`,`7 0`],answer:`4 0`,feedback:{"7 7":`walk가 걸음을 s.n에 쌓아 둔다고 생각했나요?`,"4 4":`지역 이름 n에 담으면 s.n도 같이 바뀐다고 생각했나요?`,"7 0":`지역 이름 n이 호출 사이에 남아 있어 3에 4를 더한다고 생각했나요?`},explanation:`walk 안의 n은 self.가 없는 지역 이름이라 s.n은 계속 0이에요. 그래서 walk(4)는 0 + 4인 4를 돌려주고, s.n은 0 그대로예요.`,card:`self-local`},{type:`explain`,id:`class-attr`,title:`클래스 속성은 함께 써요`,body:"클래스 본문에 바로 쓴 `seats = 40`은 객체마다가 아니라 클래스에 하나만 있는 클래스 속성이에요. `b.seats`처럼 객체로 읽을 때 그 객체에 그 이름의 속성이 없으면, 클래스로 올라가 클래스 속성을 읽어요. 하지만 `a.seats = 25`처럼 객체로 대입하면 클래스 속성은 그대로 두고 a에만 새 속성이 생겨, 그 뒤로 a는 자기 것을 읽어요. 모두가 함께 쓰는 값을 바꾸려면 `Bus.seats = 45`처럼 클래스 이름으로 바꿔요.",code:`class Bus:
    seats = 40
a, b = Bus(), Bus()
a.seats = 25
Bus.seats = 45
print(a.seats, b.seats, Bus.seats)`,trace:["`class Bus:` → 버스 틀을 만들어요","`seats = 40` → 클래스에 하나만 있는 클래스 속성이에요","`a, b = Bus(), Bus()` → 객체 둘을 만들어요. 둘 다 아직 자기 seats가 없어요","`a.seats = 25` → 클래스 속성은 그대로 두고 a에만 seats 속성이 새로 생겨요","`Bus.seats = 45` → 클래스 이름으로 클래스 속성을 45로 바꿔요","`print(a.seats, b.seats, Bus.seats)` → a는 자기 속성을, 자기 속성이 없는 b는 클래스 것을 읽어 → **25 45 45**"],output:`25 45 45
`,mistake:"`a.seats = 25`가 모든 버스의 좌석 수를 바꾼다고 생각하기. 객체로 대입하면 그 객체에만 새 속성이 생겨요. 함께 쓰는 값은 `Bus.seats`처럼 클래스 이름으로 바꿔요.",in_code:"모든 객체가 함께 쓰는 설정값(세율, 기본 단위 같은 것)을 클래스 속성으로 두는 코드를 자주 봐요. 그 값을 바꿀 때는 `Bus.seats += 5`처럼 클래스 이름으로 바꿔야 자기 속성이 없는 모든 객체에 보여요."},{type:`example`,id:`theory-py-class-ex4`,kind:`choice`,title:`할인율 바꾸기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`class Shop:
    rate = 10

x = Shop()
y = Shop()
y.rate += 5
Shop.rate += 1
print(x.rate, y.rate)`,output:`11 15
`,choices:[`11 15`,`16 16`,`11 16`,`10 15`],answer:`11 15`,feedback:{"16 16":`y.rate += 5가 클래스 속성 rate를 바꾼다고 생각했나요?`,"11 16":`y에 자기 속성이 생긴 뒤에도 클래스 속성의 변화가 y에 더해진다고 생각했나요?`,"10 15":`클래스 이름으로 바꾼 값이 자기 속성이 없는 x에는 보이지 않는다고 생각했나요?`},explanation:`y.rate += 5는 클래스의 10을 읽어 15를 y의 새 속성에 담아요. Shop.rate += 1은 클래스 속성을 11로 바꾸고, 자기 속성이 없는 x는 11, 자기 속성이 있는 y는 15를 읽어요.`,card:`class-attr`},{type:`explain`,id:`shared-list`,title:`함께 쓰는 리스트를 고치면`,body:"클래스 속성이 리스트면 이야기가 달라요. `x.names.append(…)`는 대입이 아니라 읽어 온 리스트 자체를 고치는 일이에요. x에 names 속성이 없으니 클래스의 리스트를 찾아 그 하나를 고치고, 그 리스트는 모든 객체가 함께 쓰니 y로 봐도 바뀌어 있어요. 객체마다 따로 쓸 리스트는 `__init__`에서 `self.names = []`로 객체마다 새로 만들어요.",code:`class Team:
    names = []
x, y = Team(), Team()
x.names.append("민아")
print(y.names, x.names is y.names)`,trace:["`class Team:` → 팀 틀을 만들어요","`names = []` → 클래스 속성으로 리스트 하나를 둬요","`x, y = Team(), Team()` → 두 객체 모두 자기 names가 없어요",'`x.names.append("민아")` → x에 names가 없어 클래스의 리스트를 찾아 그 리스트 자체에 넣어요. 메서드 안의 `self.names.append(…)`도 똑같이 동작해요',"`print(y.names, x.names is y.names)` → 둘 다 클래스의 같은 리스트를 봐서 → **['민아'] True**"],output:`['민아'] True
`,mistake:"`x.n = 5`처럼 대입할 때와 같다고 생각하기. 대입은 그 객체에 새 속성을 만들지만, append는 함께 쓰는 리스트를 고쳐서 모든 객체에 보여요.",in_code:"AI가 쓴 클래스에서 리스트나 딕셔너리가 `__init__` 밖, 클래스 본문에 바로 놓여 있으면 먼저 의심해 봐요. 대부분은 `__init__`에서 `self.names = []`처럼 객체마다 만들어야 하는 값이에요."},{type:`example`,id:`theory-py-class-ex5`,kind:`choice`,title:`메모에 붙인 태그`,prompt:`아래 코드의 출력값을 고르세요.`,code:`class Note:
    tags = []

    def __init__(self, title):
        self.title = title

    def tag(self, t):
        self.tags.append(t)

a = Note("일기")
b = Note("메모")
a.tag("개인")
print(len(b.tags), b.title)`,output:`1 메모
`,choices:[`1 메모`,`0 메모`,`1 일기`,`오류 발생`],answer:`1 메모`,feedback:{"0 메모":`클래스 본문의 tags = []도 객체마다 따로 만들어진다고 생각했나요?`,"1 일기":`__init__에서 붙인 title까지 객체끼리 함께 쓴다고 생각했나요?`,"오류 발생":`b는 tag를 부른 적이 없어 b.tags를 읽으면 오류가 난다고 생각했나요?`},explanation:`tags는 클래스에 하나뿐인 리스트라 a.tag("개인")이 그 리스트에 넣으면 b로 봐도 원소가 1개예요. title은 __init__에서 self.title로 객체마다 붙여서 b는 자기 값 메모를 가져요.`,card:`shared-list`},{type:`explain`,id:`inherit`,title:`물려받고 바꿔 쓰기`,body:"`class Big(Cup):`처럼 괄호 안에 다른 클래스를 쓰면, Big은 Cup의 메서드를 모두 물려받아요(상속). 자식 클래스에 같은 이름의 메서드를 다시 만들면 그 메서드만 바뀌어요(오버라이드). 부모에게서 물려받은 bill 안의 `self.price()`도 self가 Big 객체라서 자식의 price를 불러요. 자식 메서드 안의 `super().price()`는 부모 쪽 price를 불러와요. 더 바꿀 것이 없으면 아무 일도 하지 않는 `pass`를 써서 `class Mini(Cup): pass`처럼 물려받기만 해요.",code:`class Cup:
    def price(self):
        return 1000
    def bill(self):
        return self.price() + 300
class Big(Cup):
    def price(self):
        return super().price() * 2
print(Cup().bill(), Big().bill())`,trace:["`class Cup:` → 부모가 될 클래스예요","`def price(self):` → 가격을 돌려주는 메서드예요","`return 1000` → 기본 가격은 1000이에요","`def bill(self):` → 낼 돈을 돌려주는 메서드예요","`return self.price() + 300` → self가 어떤 객체인지에 따라 그 객체의 price를 불러 300을 더해요","`class Big(Cup):` → Cup을 물려받은 자식 클래스라 bill도 그대로 가져요","`def price(self):` → 자식이 price만 다시 만들어요(오버라이드)","`return super().price() * 2` → super()로 부모의 price 1000을 불러와 두 배로 돌려줘요","`print(Cup().bill(), Big().bill())` → Cup은 1000 + 300, Big은 물려받은 bill이 자식의 price 2000을 불러 2000 + 300 → **1300 2300**"],output:`1300 2300
`,mistake:"부모의 bill 안에 있는 `self.price()`는 늘 부모의 price를 부른다고 생각하기. self는 bill을 부른 객체라서, Big 객체로 부르면 자식이 다시 만든 price가 불려요.",in_code:"라이브러리의 기본 클래스를 물려받아 메서드 한두 개만 다시 만드는 코드를 자주 봐요. `super().__init__(…)`처럼 부모의 준비 과정을 먼저 실행하고 자식의 준비를 덧붙이는 줄도 흔해요."},{type:`example`,id:`theory-py-class-ex6`,kind:`choice`,title:`두 번 물려받은 소개`,prompt:`아래 코드의 출력값을 고르세요.`,code:`class Animal:
    def name(self):
        return "동물"

    def intro(self):
        return "나는 " + self.name()

class Dog(Animal):
    def name(self):
        return "개"

class Puppy(Dog):
    pass

print(Puppy().intro())`,output:`나는 개
`,choices:[`나는 개`,`나는 동물`,`오류 발생`],answer:`나는 개`,feedback:{"나는 동물":`부모의 intro 안에서 self.name()은 늘 부모의 name을 부른다고 생각했나요?`,"오류 발생":`본문이 pass뿐인 Puppy는 물려받은 메서드도 쓸 수 없다고 생각했나요?`},explanation:`Puppy는 Dog를, Dog는 Animal을 물려받아 intro를 쓸 수 있어요. intro 안의 self는 Puppy 객체라서 self.name()은 가장 가까운 Dog의 name을 불러 나는 개예요.`,card:`inherit`},{type:`summary`,points:["클래스를 부르면 객체가 만들어지고 `__init__`이 한 번 실행돼요. `self.x = 값`으로 붙인 속성은 객체마다 따로예요.","`obj.method()`로 부르면 점 앞의 obj가 self로 들어가서, 메서드 안의 `self.x += 1`은 그 객체의 속성만 바꿔요.","메서드 안에서 `self.` 없이 담은 이름은 지역 이름이라 속성을 바꾸지 않아요.",`클래스 본문의 속성은 함께 써요. 객체로 대입하면 그 객체에만 새 속성이 생기고, 함께 쓰는 리스트를 append로 고치면 모두에게 보여요.`,"자식 클래스는 부모 메서드를 물려받고 다시 만들 수 있어요. 부모 메서드 안의 `self.x()`도 자식 것을 부르고, `super().x()`는 부모 것을 불러요."]}],covers:{"py-class-01":[`class-init`,`method-self`],"py-class-02":[`class-attr`],"py-class-03":[`method-self`,`class-attr`,`shared-list`],"py-class-04":[`method-self`,`inherit`],"py-class-05":[`class-init`,`method-self`,`self-local`]}},{id:`theory-py-class-deco`,version:2,concept_id:`py-class-deco`,title:`@property와 @dataclass`,minutes:16,steps:[{type:`explain`,id:`property`,title:`@property는 괄호 없이 읽는 계산`,body:"메서드 위에 `@property`를 붙이면, `r.area`처럼 괄호 없이 속성을 읽듯이 그 메서드를 실행해 결과를 받아요. 값을 저장해 두는 게 아니라 읽을 때마다 메서드가 다시 실행되어서, 속성이 바뀌면 결과도 따라 바뀌어요. 그래서 `r.area()`처럼 괄호를 붙이면 이미 계산된 수를 부르려다 TypeError가 나요. 계산으로 얻는 값을 속성처럼 깔끔하게 보여 줄 때 써요.",code:`class Rect:
    def __init__(self, w, h):
        self.w, self.h = w, h
    @property
    def area(self):
        return self.w * self.h
r = Rect(2, 3)
r.w = 5
print(r.area)`,trace:["`class Rect:` → 직사각형 틀을 만들어요","`def __init__(self, w, h):` → 가로와 세로를 받아요","`self.w, self.h = w, h` → 두 속성을 한 줄에 나눠 담아요(5강의 언패킹)","`@property` → 바로 아래 메서드를 괄호 없이 읽는 속성으로 만들어요","`def area(self):` → 넓이를 계산하는 메서드예요","`return self.w * self.h` → 읽을 때마다 지금의 w와 h로 계산해요","`r = Rect(2, 3)` → 이때 넓이를 미리 계산해 두지는 않아요","`r.w = 5` → 가로를 5로 바꿔요","`print(r.area)` → 괄호 없이 읽는 순간 지금 값으로 계산해서 5 × 3 → **15**"],output:`15
`,mistake:"`r.area()`처럼 괄호를 붙여 부르기. `r.area`가 이미 계산한 수 15라서, 수를 함수처럼 부르려다 TypeError가 나요.",in_code:"AI가 쓴 클래스에서 `@property` 아래 `def full_name(self):`처럼 값을 계산해 돌려주는 메서드를 자주 봐요. 쓰는 쪽에서는 `user.full_name`처럼 괄호 없이 읽으니, 저장된 속성인지 계산값인지는 클래스 본문을 보고 확인해요."},{type:`example`,id:`theory-py-class-deco-ex1`,kind:`choice`,title:`동전을 더 넣은 뒤`,prompt:`아래 코드의 출력값을 고르세요.`,code:`class Wallet:
    def __init__(self, coins):
        self.coins = coins

    @property
    def won(self):
        return self.coins * 500

w = Wallet(2)
before = w.won
w.coins += 3
print(before, w.won)`,output:`1000 2500
`,choices:[`1000 2500`,`1000 1000`,`2500 2500`,`오류 발생`],answer:`1000 2500`,feedback:{"1000 1000":`property 값이 객체를 만들 때 한 번만 계산돼 저장된다고 생각했나요?`,"2500 2500":`before에 담아 둔 값도 coins가 바뀌면 다시 계산된다고 생각했나요?`,"오류 발생":`@property 메서드도 w.won()처럼 괄호를 붙여야 읽힌다고 생각했나요?`},explanation:`before에는 읽은 순간의 값 1000이 담겨요. coins가 5로 바뀐 뒤 w.won을 다시 읽으면 메서드가 다시 실행되어 2500이에요.`,card:`property`},{type:`explain`,id:`dataclass`,title:`@dataclass가 대신 만들어 주는 것`,body:"클래스 위에 `@dataclass`를 붙이고 본문에 `이름: 자료형`으로 필드를 적으면, 그 필드를 받는 `__init__`이 저절로 만들어져요. `= 값`을 붙인 필드는 기본값이 있어 빼고 만들 수 있고, 필드가 여러 개면 적은 순서대로 매개변수가 돼요. print로 보면 `Seat(row='A')`처럼 필드 이름과 값이 보이고, `==`는 같은 객체인지가 아니라 필드 값이 모두 같은지를 비교해요. `: str` 같은 자료형 표시는 설명일 뿐이라 다른 자료형을 넣어도 막지 않아요.",code:`from dataclasses import dataclass
@dataclass
class Seat:
    row: str = "A"
s = Seat()
print(s, s == Seat("A"))`,trace:["`from dataclasses import dataclass` → Python에 기본으로 들어 있는 dataclasses 모듈(관련 기능을 모아 둔 파일)에서 dataclass를 가져와 이 코드에서 쓸 수 있게 해요","`@dataclass` → 아래 클래스에 `__init__`, 출력 모양, `==` 비교를 자동으로 만들어 달라는 표시예요","`class Seat:` → 좌석 클래스예요",'`row: str = "A"` → 필드 row를 적어요. 기본값은 "A"예요','`s = Seat()` → 자동으로 만들어진 `__init__`이 row에 기본값 "A"를 담아요',`\`print(s, s == Seat("A"))\` → 필드 이름과 값이 보이고, 따로 만든 객체라도 필드 값이 같아서 → **Seat(row='A') True**`],output:`Seat(row='A') True
`,mistake:"`@dataclass`의 `==`도 같은 객체인지 비교한다고 생각하기. 보통 클래스의 `==`는 같은 객체인지 보지만, `@dataclass`는 필드 값을 비교하도록 만들어 줘서 따로 만든 두 객체도 True가 될 수 있어요.",in_code:"AI가 쓴 코드에서 데이터를 담기만 하는 클래스는 대부분 `@dataclass`로 써요. 필드 목록만 보면 그 객체가 무엇을 담는지 한눈에 알 수 있어요."},{type:`example`,id:`theory-py-class-deco-ex2`,kind:`choice`,title:`나중에 맞춘 개수`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from dataclasses import dataclass

@dataclass
class Goods:
    name: str
    qty: int = 1

a = Goods("펜", 2)
b = Goods("펜")
b.qty = 2
print(a == b, a)`,output:`True Goods(name='펜', qty=2)
`,choices:[`True Goods(name='펜', qty=2)`,`False Goods(name='펜', qty=2)`,`True Goods('펜', 2)`],answer:`True Goods(name='펜', qty=2)`,feedback:{"False Goods(name='펜', qty=2)":`@dataclass의 ==도 같은 객체인지를 비교한다고 생각했나요?`,"True Goods('펜', 2)":`print가 필드 이름 없이 값만 보여 준다고 생각했나요?`},explanation:`b는 qty 기본값 1로 만들어졌다가 2로 바뀌어, 두 객체의 필드 값이 모두 같아져 ==가 True예요. print는 필드 이름과 값을 함께 보여 줘요.`,card:`dataclass`},{type:`explain`,id:`dc-eq`,title:`eq=False와 in`,body:"`@dataclass(eq=False)`처럼 괄호 안에 `eq=False`를 주면 필드 값을 비교하는 `==`를 만들지 않아요. 그러면 보통 클래스처럼 `==`가 같은 객체인지만 봐서, 필드 값이 같아도 따로 만든 객체는 False예요. 리스트의 `in`, `count`, `remove`도 속으로 `==`를 쓰기 때문에 결과가 함께 바뀌어요. 값이 같은 객체를 같다고 보려면 `eq=False`를 빼요.",code:`from dataclasses import dataclass
@dataclass(eq=False)
class Tag:
    name: str
a, b = Tag("새"), Tag("새")
print(a == b, a == a, a in [b])`,trace:["`from dataclasses import dataclass` → dataclass를 가져와요","`@dataclass(eq=False)` → 필드 값으로 비교하는 `==`는 만들지 말라는 설정이에요","`class Tag:` → 태그 클래스예요","`name: str` → 필드 하나를 적어요",'`a, b = Tag("새"), Tag("새")` → 필드 값은 같지만 따로 만든 두 객체예요',"`print(a == b, a == a, a in [b])` → 같은 객체인지만 봐서 a와 b는 다르고, a는 자기 자신과 같고, [b] 안에 a 자체는 없어서 → **False True False**"],output:`False True False
`,mistake:"`in`은 `==`와 상관없이 값을 찾는다고 생각하기. `a in [b]`는 원소마다 `==`로 비교하니, eq=False면 필드가 같아도 False예요.",in_code:"`list.count(x)`나 `list.remove(x)`로 데이터 객체를 세거나 지우는 코드가 이상하게 동작하면, 그 클래스의 `==` 규칙부터 확인해요. `eq=False` 한 단어가 세는 결과를 바꿔요."},{type:`example`,id:`theory-py-class-deco-ex3`,kind:`choice`,title:`손에 든 카드 찾기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from dataclasses import dataclass

@dataclass(eq=False)
class Card:
    num: int

hand = [Card(7), Card(9)]
new = Card(7)
print(new in hand, hand[0] in hand)`,output:`False True
`,choices:[`False True`,`True True`,`False False`],answer:`False True`,feedback:{"True True":`eq=False여도 필드 값이 같으면 ==가 True라고 생각했나요?`,"False False":`eq=False면 ==가 같은 객체끼리도 늘 False라고 생각했나요?`},explanation:`eq=False라서 in은 같은 객체인지만 봐요. 새로 만든 new는 hand 안의 Card(7)과 다른 객체라 False이고, hand[0]은 리스트에 든 바로 그 객체라 True예요.`,card:`dc-eq`},{type:`explain`,id:`default-factory`,title:`바뀌는 기본값은 default_factory`,body:"`tags: list = []`처럼 리스트를 기본값으로 바로 주면, 8강의 함수 기본값처럼 모든 객체가 리스트 하나를 함께 쓰게 돼요. 그래서 @dataclass는 클래스를 만드는 순간 ValueError를 내며 이를 막아요. 대신 `field(default_factory=list)`라고 쓰면 객체를 만들 때마다 `list()`를 불러 새 빈 리스트를 줘요. 괄호 안에 `lambda: []`를 넣어도 같은데, lambda는 이름 없이 한 줄로 만든 함수라 부를 때마다 새 빈 리스트를 돌려줘요.",code:`from dataclasses import dataclass, field
@dataclass
class Box:
    tags: list = field(
        default_factory=list)
print(Box().tags is Box().tags)`,trace:["`from dataclasses import dataclass, field` → dataclass와 field를 함께 가져와요","`@dataclass` → `__init__`을 자동으로 만들어요","`class Box:` → 상자 클래스예요","`tags: list = field(` → 기본값을 값 대신 '만드는 방법'으로 주는 field를 써요","`default_factory=list)` → 객체를 만들 때마다 list()를 불러 새 빈 리스트를 줘요. 괄호 안이라 두 줄로 나눠 써도 돼요","`print(Box().tags is Box().tags)` → 두 객체가 각자 새 리스트를 받아서 → **False**"],output:`False
`,mistake:"`tags: list = None`으로 두고 바로 `append`하기. None에는 append가 없어 AttributeError가 나요. `field(default=[])`도 `[]`를 바로 준 것과 똑같이 ValueError로 막혀요.",in_code:"`items: list = field(default_factory=list)`나 `meta: dict = field(default_factory=dict)`는 데이터 클래스에서 아주 자주 보는 줄이에요. 기본값 자리에 리스트나 딕셔너리가 보이면 default_factory로 줬는지 확인해요."},{type:`example`,id:`theory-py-class-deco-ex4`,kind:`choice`,title:`요일별 기록장`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from dataclasses import dataclass, field

@dataclass
class Log:
    days: dict = field(
        default_factory=dict)

x = Log()
y = Log()
x.days["월"] = 1
print(x.days, y.days)`,output:`{'월': 1} {}
`,choices:[`{'월': 1} {}`,`{'월': 1} {'월': 1}`,`{} {}`,`오류 발생`],answer:`{'월': 1} {}`,feedback:{"{'월': 1} {'월': 1}":`default_factory로 만든 딕셔너리도 객체끼리 함께 쓴다고 생각했나요?`,"{} {}":`기본값으로 받은 딕셔너리는 고칠 수 없어 빈 채로 남는다고 생각했나요?`,"오류 발생":`딕셔너리처럼 바뀌는 값은 default_factory로 줘도 오류가 난다고 생각했나요?`},explanation:`default_factory=dict는 객체를 만들 때마다 dict()로 새 빈 딕셔너리를 줘요. x의 딕셔너리에만 키를 넣었으니 y는 빈 딕셔너리 그대로예요.`,card:`default-factory`},{type:`explain`,id:`classmethod`,title:`@classmethod는 클래스를 받아요`,body:"메서드 위에 `@classmethod`를 붙이면 첫 매개변수로 객체 대신 클래스 자체가 들어오고, 이름은 흔히 `cls`라고 써요. 그래서 객체 없이 `Temp.from_f(212)`처럼 클래스 이름으로 불러요. 안에서 `cls(…)`를 부르면 `Temp(…)`처럼 그 클래스의 새 객체를 만들고, `cls.rate`처럼 클래스 속성도 읽을 수 있어요. 그래서 다른 단위나 형식의 값을 받아 객체를 만드는 '대체 생성자'에 자주 써요.",code:`class Temp:
    def __init__(self, c):
        self.c = c
    @classmethod
    def from_f(cls, f):
        return cls((f - 32) * 5 / 9)
print(Temp.from_f(212).c)`,trace:["`class Temp:` → 섭씨 온도 c를 속성으로 가지는 클래스예요","`def __init__(self, c):` → 섭씨 값을 받아요","`self.c = c` → 객체에 c 속성을 붙여요","`@classmethod` → 아래 메서드가 객체 대신 클래스를 받게 해요","`def from_f(cls, f):` → cls에는 Temp 클래스가 들어와요","`return cls((f - 32) * 5 / 9)` → 화씨를 섭씨로 바꿔 Temp(100.0)처럼 새 객체를 만들어 돌려줘요","`print(Temp.from_f(212).c)` → 객체 없이 클래스로 부르고, 돌려받은 객체의 c를 읽어 → **100.0**"],output:`100.0
`,mistake:"classmethod가 계산한 수를 돌려준다고 생각하기. `cls(…)`로 만든 것은 Temp 객체라서, 수는 그 객체의 속성 `.c`로 꺼내요.",in_code:"`dict.fromkeys(…)`처럼 `from…`으로 시작하는 이름은 대부분 classmethod로 만든 대체 생성자예요. 클래스 이름 뒤에 바로 점을 찍어 부르고, 그 클래스의 객체를 돌려줘요."},{type:`example`,id:`theory-py-class-deco-ex5`,kind:`choice`,title:`미터로 만든 거리`,prompt:`아래 코드의 출력값을 고르세요.`,code:`class Km:
    def __init__(self, km):
        self.km = km

    @classmethod
    def from_m(cls, m):
        return cls(m / 1000)

d = Km.from_m(2500)
print(d.km, type(d).__name__)`,output:`2.5 Km
`,choices:[`2.5 Km`,`2.5 float`,`오류 발생`],answer:`2.5 Km`,feedback:{"2.5 float":`classmethod가 계산한 수를 그대로 돌려준다고 생각했나요?`,"오류 발생":`객체를 만들지 않고 클래스 이름으로 메서드를 부르면 오류가 난다고 생각했나요?`},explanation:`from_m은 cls에 Km을 받아 cls(2.5), 곧 Km(2.5)를 만들어 돌려줘요. 그래서 d는 Km 객체이고 km 속성은 2.5예요.`,card:`classmethod`},{type:`explain`,id:`staticmethod`,title:`@staticmethod는 클래스 안의 보통 함수`,body:"`@staticmethod`를 붙인 메서드는 self도 cls도 받지 않는, 클래스 안에 넣어 둔 보통 함수예요. `Temp.deg(25)`처럼 클래스 이름으로 불러도, `Temp().deg(3)`처럼 객체로 불러도 넘긴 값만 받아요. 객체의 속성은 쓰지 않지만 그 클래스와 관련 있는 도우미 기능을 묶어 둘 때 써요.",code:`class Temp:
    @staticmethod
    def deg(c):
        return f"{c}도"
print(Temp.deg(25), Temp().deg(3))`,trace:["`class Temp:` → 온도 클래스예요","`@staticmethod` → 아래 메서드는 self나 cls를 받지 않아요","`def deg(c):` → 첫 매개변수 c도 그냥 넘긴 값이에요",'`return f"{c}도"` → 받은 값 뒤에 도를 붙여 돌려줘요',"`print(Temp.deg(25), Temp().deg(3))` → 클래스로 불러도 객체로 불러도 객체는 넘어가지 않아요 → **25도 3도**"],output:`25도 3도
`,mistake:"staticmethod 안에서 `self.c`를 쓰기. self를 받지 않으니 self라는 이름이 없어 NameError(그런 이름이 없다는 오류)가 나요. 객체의 속성이 필요하면 보통 메서드로 만들어요.",in_code:"AI가 쓴 클래스에서 `@staticmethod` 아래 `def validate(text):`처럼 입력을 검사하는 도우미를 자주 봐요. 객체 없이도 부를 수 있어 다른 곳에서 다시 쓰기 쉬워요."},{type:`example`,id:`theory-py-class-deco-ex6`,kind:`choice`,title:`어디서 불러도 같은 덧셈`,prompt:`아래 코드의 출력값을 고르세요.`,code:`class Calc:
    @staticmethod
    def add(a, b):
        return a + b

c = Calc()
print(Calc.add(2, 3), c.add(4, 5))`,output:`5 9
`,choices:[`5 9`,`오류 발생`,`None None`],answer:`5 9`,feedback:{"오류 발생":`객체로 부르면 staticmethod에도 객체가 첫 인자로 넘어가 오류가 난다고 생각했나요?`,"None None":`self가 없는 staticmethod는 값을 돌려주지 못한다고 생각했나요?`},explanation:`staticmethod는 self를 받지 않아서 클래스로 불러도 객체로 불러도 넘긴 두 값만 받아요. 그래서 2 + 3은 5, 4 + 5는 9예요.`,card:`staticmethod`},{type:`summary`,points:["`@property` 메서드는 `obj.area`처럼 괄호 없이 읽고, 읽을 때마다 다시 계산돼요. 괄호를 붙이면 오류예요.","`@dataclass`는 필드로 `__init__`, 출력 모양, 필드 값 비교 `==`를 만들어 줘요.","`eq=False`면 `==`와 `in`이 같은 객체인지만 봐요.","리스트나 딕셔너리 기본값은 `field(default_factory=list)`로 객체마다 새로 만들어요. `[]`를 바로 주면 ValueError예요.","`@classmethod`는 cls로 클래스를 받아 `cls(…)`로 객체를 만들고, `@staticmethod`는 self 없이 넘긴 값만 받아요."]}],covers:{"py-class-deco-01":[`property`],"py-class-deco-02":[`dataclass`],"py-class-deco-03":[`dataclass`,`default-factory`],"py-class-deco-04":[`classmethod`,`staticmethod`],"py-class-deco-05":[`dataclass`,`dc-eq`]}},{id:`theory-py-error`,version:2,concept_id:`py-error`,title:`예외와 트레이스백`,minutes:15,steps:[{type:`explain`,id:`try-except`,title:`try와 except로 오류 받기`,body:'`try:` 아래 줄을 실행하다 오류(예외)가 나면, 프로그램이 멈추는 대신 바로 `except` 아래로 건너가요. `except Exception as e:`는 거의 모든 오류를 받아 e라는 이름에 담고, `type(e).__name__`은 그 오류의 이름이에요. 오류 이름이 원인의 종류를 알려 줘요. IndexError는 없는 번호, KeyError는 없는 키, ZeroDivisionError는 0으로 나누기예요. TypeError는 자료형이 맞지 않음(`int(None)`, 글자를 번호로 쓰기), ValueError는 자료형은 맞지만 값이 맞지 않음(`int("abc")`)이에요.',code:`row = [7, 3]
for i in [1, 5, "1"]:
    try:
        print(row[i])
    except Exception as e:
        print(type(e).__name__)`,trace:["`row = [7, 3]` → 번호 0과 1만 있는 리스트예요",'`for i in [1, 5, "1"]:` → 번호로 쓸 값 셋을 차례로 i에 담아요',"`try:` → 아래 줄에서 오류가 나는지 지켜봐요",'`print(row[i])` → i가 1이면 **3**을 출력해요. 5는 없는 번호, 글자 "1"은 번호로 쓸 수 없는 자료형이라 여기서 오류가 나요',"`except Exception as e:` → 오류가 나면 이 아래로 건너와 오류를 e에 담아요","`print(type(e).__name__)` → 오류 이름을 출력하고 다음 차례로 넘어가요 → **IndexError**, **TypeError**"],output:`3
IndexError
TypeError
`,mistake:'따옴표 안의 `"1"`도 번호로 쓸 수 있다고 생각하기. 리스트 번호는 정수여야 해서 글자를 쓰면 TypeError예요. 숫자처럼 보이는 글자는 `int("1")`로 바꿔 써요.',in_code:"AI가 쓴 코드에서 `except Exception as e:` 다음 줄에 `print(e)`처럼 오류를 남기는 줄을 자주 봐요. `print(e)`는 오류 이름 없이 메시지 부분(예: `list index out of range`)만 보여 줘요."},{type:`example`,id:`theory-py-error-ex1`,kind:`choice`,title:`빈 목록의 첫 값`,prompt:`아래 코드의 출력값을 고르세요.`,code:`def first(xs):
    try:
        return xs[0]
    except IndexError:
        return "비었음"

print(first([4, 2]), first([]))`,output:`4 비었음
`,choices:[`4 비었음`,`4 None`,`4 IndexError`,`오류 발생`],answer:`4 비었음`,feedback:{"4 None":`오류가 나면 함수가 None을 돌려준다고 생각했나요?`,"4 IndexError":`except가 오류 이름을 대신 돌려준다고 생각했나요?`,"오류 발생":`except로 받아도 오류가 나면 프로그램이 멈춘다고 생각했나요?`},explanation:`[4, 2]의 0번은 4라 그대로 돌려줘요. 빈 리스트의 0번은 없는 번호라 IndexError가 나고, except가 받아 "비었음"을 돌려줘요.`,card:`try-except`},{type:`explain`,id:`else-finally`,title:`else는 성공할 때만, finally는 늘`,body:"`try` 묶음에는 `else`와 `finally`도 붙일 수 있어요. `else:` 아래는 try에서 오류가 나지 않았을 때만 실행되고, 오류가 나서 except로 갔다면 건너뛰어요. `finally:` 아래는 오류가 났든 안 났든 try 묶음이 끝날 때 맨 마지막에 꼭 실행돼요. 그래서 성공하면 try → else → finally, 실패하면 try → except → finally 순서예요.",code:`try:
    n = int("42")
except ValueError:
    print("바꿀 수 없음")
else:
    print("변환 완료", n)
finally:
    print("마무리")`,trace:["`try:` → 아래 줄을 지켜봐요",'`n = int("42")` → 글자 "42"를 정수 42로 바꾸는 데 성공해요',"`except ValueError:` → 오류가 없었으니 건너뛰어요",'`print("바꿀 수 없음")` → 실행되지 않아요',"`else:` → try가 오류 없이 끝났을 때만 들어와요",'`print("변환 완료", n)` → **변환 완료 42**',"`finally:` → 오류와 상관없이 마지막에 들어와요",'`print("마무리")` → **마무리**. "사십이"처럼 바꿀 수 없는 글자였다면 바꿀 수 없음 다음에 마무리가 나와요'],output:`변환 완료 42
마무리
`,mistake:"`finally`는 오류가 났을 때만 실행된다고 생각하기. finally는 성공했을 때도 실패했을 때도 마지막에 늘 실행돼서, 꼭 해야 하는 정리를 넣는 자리예요.",in_code:"파일이나 데이터베이스 연결을 다루는 코드에서 `finally:` 아래 `conn.close()`처럼 연결을 닫는 줄을 자주 봐요. 성공했을 때만 할 일은 try 안에 섞지 않고 `else:`에 따로 둬요."},{type:`example`,id:`theory-py-error-ex2`,kind:`choice`,title:`실행된 칸 기록`,prompt:`아래 코드의 출력값을 고르세요.`,code:`msg = ""
try:
    x = 7 // 0
except ZeroDivisionError:
    msg += "E"
else:
    msg += "S"
finally:
    msg += "F"
print(msg)`,output:`EF
`,choices:[`EF`,`ESF`,`E`,`오류 발생`],answer:`EF`,feedback:{ESF:`except로 간 뒤에도 else가 실행된다고 생각했나요?`,E:`오류가 나서 except로 가면 finally는 건너뛴다고 생각했나요?`,"오류 발생":`0으로 나누면 except가 있어도 프로그램이 멈춘다고 생각했나요?`},explanation:`7 // 0은 ZeroDivisionError라 except로 가서 E를 붙이고, 오류가 났으니 else는 건너뛰어요. finally는 늘 마지막에 실행돼 F를 붙여 EF예요.`,card:`else-finally`},{type:`explain`,id:`except-order`,title:`except는 위에서부터 하나만`,body:"`except`를 여러 개 쓰면 4강의 if·elif처럼 위에서부터 검사해, 처음 맞는 칸 하나만 실행해요. ValueError, TypeError, KeyError 같은 오류는 모두 Exception의 한 종류라서 `except Exception:`은 거의 모든 오류와 맞아요. 그래서 넓은 Exception을 위에 두면 그 아래의 `except KeyError:` 같은 칸은 실행될 기회가 없어요. 구체적인 오류를 먼저, 넓은 Exception을 마지막에 써요.",code:`try:
    {"펜": 3}["풀"]
except Exception as e:
    print("넓은 칸", type(e).__name__)
except KeyError:
    print("없는 키")`,trace:["`try:` → 아래 줄을 지켜봐요",'`{"펜": 3}["풀"]` → 없는 키 "풀"을 찾아 KeyError가 나요',"`except Exception as e:` → 위에서부터 검사해요. KeyError도 Exception의 한 종류라 여기서 맞아요",'`print("넓은 칸", type(e).__name__)` → **넓은 칸 KeyError**',"`except KeyError:` → 앞 칸이 이미 받았으니 검사하지 않아요",'`print("없는 키")` → 실행되지 않아요'],output:`넓은 칸 KeyError
`,mistake:"더 꼭 맞는 except가 골라진다고 생각하기. elif처럼 위에서 처음 맞는 칸이 이겨요. KeyError를 따로 처리하려면 `except KeyError:`를 넓은 Exception 칸보다 위에 써요.",in_code:"AI가 쓴 코드에서 `except KeyError:` 다음에 `except Exception as e:`로 끝나는 묶음을 자주 봐요. 예상한 오류는 위에서 따로 처리하고, 남은 뜻밖의 오류만 마지막 칸에서 받는 순서예요."},{type:`example`,id:`theory-py-error-ex3`,kind:`choice`,title:`소수점이 있는 글자`,prompt:`아래 코드의 출력값을 고르세요.`,code:`try:
    n = int("3.5")
except TypeError:
    n = -2
except ValueError:
    n = -1
print(n)`,output:`-1
`,choices:[`-1`,`-2`,`3`,`3.5`],answer:`-1`,feedback:{"-2":`글자를 int로 바꾸지 못하는 오류를 TypeError로 생각했나요?`,3:`int가 소수점 아래를 버려 "3.5"를 3으로 바꿔 준다고 생각했나요?`,"3.5":`int가 글자 "3.5"를 소수로 바꿔 준다고 생각했나요?`},explanation:`int에 글자를 넣는 것은 자료형이 맞지만, "3.5"는 정수 모양이 아니라서 ValueError예요. 첫 칸 TypeError와는 맞지 않아 두 번째 칸이 n에 -1을 담아요.`,card:`try-except`},{type:`explain`,id:`except-tuple`,title:`여러 오류를 한 칸에서`,body:"여러 오류를 한 칸에서 받으려면 `except (ValueError, KeyError):`처럼 괄호로 묶은 튜플을 써요. 튜플 안의 오류 중 하나와 맞으면 그 칸이 실행돼요. `except ValueError or KeyError:`처럼 or로 이으면 1강의 규칙대로 or가 앞의 ValueError를 돌려줘서, ValueError 하나만 받는 칸이 되어 버려요. 오류 이름도 값이라서 `.__name__`으로 이름 글자를 꺼낼 수 있어요.",code:`pick = ValueError or KeyError
print(pick.__name__)
try:
    {"a": 1}["b"]
except (ValueError, KeyError) as e:
    print("잡음", type(e).__name__)`,trace:["`pick = ValueError or KeyError` → ValueError는 참으로 보는 값이라 or가 여기서 멈춰 ValueError를 돌려줘요","`print(pick.__name__)` → **ValueError**","`try:` → 아래 줄을 지켜봐요",'`{"a": 1}["b"]` → 없는 키 "b"를 찾아 KeyError가 나요',"`except (ValueError, KeyError) as e:` → 튜플 안에 KeyError가 있어 이 칸이 받아요",'`print("잡음", type(e).__name__)` → **잡음 KeyError**'],output:`ValueError
잡음 KeyError
`,mistake:"`except ValueError or KeyError:`로 두 오류를 받는다고 생각하기. or는 앞의 ValueError만 남겨서, KeyError는 잡히지 않고 프로그램이 그대로 멈춰요.",in_code:"`except (KeyError, IndexError):`처럼 받을 오류를 좁게 적은 코드가 `except Exception:`보다 안전해요. Exception은 예상하지 못한 버그까지 조용히 받아 숨길 수 있어서예요."},{type:`example`,id:`theory-py-error-ex4`,kind:`choice`,title:`없는 번호 꺼내기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`def pick(xs, i):
    try:
        return xs[i]
    except (KeyError, IndexError):
        return "없음"

xs = [4, 6]
print(pick(xs, 1), pick(xs, 2))`,output:`6 없음
`,choices:[`6 없음`,`오류 발생`,`6 None`,`4 없음`],answer:`6 없음`,feedback:{"오류 발생":`괄호로 묶은 오류 중 하나와만 맞아서는 그 칸이 받지 못한다고 생각했나요?`,"6 None":`except 칸에서 돌려준 값 대신 None이 나온다고 생각했나요?`,"4 없음":`리스트 번호가 1부터 시작한다고 생각했나요?`},explanation:`xs[1]은 6이에요. xs[2]는 없는 번호라 IndexError가 나고, 튜플 (KeyError, IndexError) 안에 IndexError가 있어 그 칸이 "없음"을 돌려줘요.`,card:`except-tuple`},{type:`explain`,id:`traceback`,title:`트레이스백은 끝줄부터 읽어요`,body:"오류를 받지 않으면 프로그램이 멈추고 트레이스백(오류가 난 길을 거슬러 보여 주는 안내문)이 나와요. 먼저 맨 마지막 줄의 `오류 이름: 메시지`를 읽고, 그 위의 `line 번호`로 오류가 터진 줄을 찾아요. 하지만 터진 줄이 원인이 아닐 때가 많아서, 메시지에 나온 자료형(아래에서는 int와 str)을 보고 그 값이 어디서 만들어졌는지 거슬러 올라가요. `sum(리스트)`도 0에서 시작해 `+`로 하나씩 더하기 때문에 글자가 섞이면 같은 메시지가 나오고, `split()`으로 나눈 조각은 숫자처럼 보여도 글자예요.",code:`count = 10
extra = "5"
try:
    print(count + extra)
except TypeError as e:
    print(e)`,trace:["`count = 10` → 정수 10이에요",'`extra = "5"` → 따옴표가 있어 글자 "5"예요. 문제의 원인은 이 줄이에요',"`try:` → 아래 줄을 지켜봐요","`print(count + extra)` → 정수와 글자를 더하려다 이 줄에서 TypeError가 터져요","`except TypeError as e:` → 오류를 받아 e에 담아요","`print(e)` → 트레이스백 마지막 줄의 메시지 부분과 같아요. + 왼쪽이 int, 오른쪽이 str이라는 뜻 → **unsupported operand type(s) for +: 'int' and 'str'**"],output:`unsupported operand type(s) for +: 'int' and 'str'
`,mistake:"오류가 터진 줄만 고치기. 원인은 extra를 글자로 만든 줄이라, 계산하는 줄만 `int(extra)`로 고치면 extra를 다른 계산에 쓸 때마다 같은 오류가 또 나요. 값을 만들 때 `int()`로 바꿔 담으면 그 뒤의 계산이 모두 맞아요.",in_code:'트레이스백에는 `File "main.py", line 12`처럼 파일과 줄 번호가 함께 나와요. AI에게 오류를 물어볼 때도 마지막 줄의 오류 이름과 메시지, 그 줄 번호를 함께 붙여 주면 원인을 훨씬 빨리 찾아요.'},{type:`example`,id:`theory-py-error-ex5`,kind:`choice`,title:`글자로 들어온 수량`,prompt:`아래 코드의 출력값을 고르세요.`,code:`qty = "7"
try:
    print(qty * 2 + 1)
except TypeError as e:
    print(type(e).__name__)`,output:`TypeError
`,choices:[`TypeError`,`15`,`771`,`ValueError`],answer:`TypeError`,feedback:{15:`글자 "7"이 계산에서 수 7처럼 쓰인다고 생각했나요?`,771:`글자에 수 1을 +하면 이어 붙여 준다고 생각했나요?`,ValueError:`글자와 수를 더하려다 나는 오류를 ValueError로 생각했나요?`},explanation:`qty * 2는 글자 "7"을 두 번 이어 "77"이에요. 그다음 "77" + 1은 글자와 수를 더하려는 것이라 자료형이 맞지 않는 TypeError가 나고, except가 받아 오류 이름을 출력해요.`,card:`traceback`},{type:`explain`,id:`swallow`,title:`pass로 삼키면 틀린 값이 숨어요`,body:'`except ValueError:` 아래에 `pass`만 쓰면 오류를 받고 아무것도 하지 않아요(`pass`는 비워 둘 수 없는 자리에 쓰는 \'아무 일도 안 함\'이에요). 오류 메시지가 보이지 않으니, 틀린 결과가 나와도 왜 틀렸는지 알 수 없게 돼요. 예를 들어 `int("2,500")`은 쉼표 때문에 ValueError가 나는데, 이를 삼키면 그 값이 조용히 빠져요. 건너뛰는 대신 `replace(",", "")`로 쉼표를 지우듯 원인을 고치거나, 건너뛴 값을 따로 모아 확인해요.',code:`t = "2,500"
try:
    print(int(t))
except ValueError:
    pass
print(int(t.replace(",", "")))`,trace:['`t = "2,500"` → 쉼표가 든 금액 글자예요',"`try:` → 아래 줄을 지켜봐요","`print(int(t))` → 쉼표 때문에 정수로 바꾸지 못해 ValueError가 나고, print는 실행되지 못해요","`except ValueError:` → 그 오류를 받아요","`pass` → 아무것도 하지 않고 넘어가요. 그래서 이 묶음은 아무것도 출력하지 않아요",'`print(int(t.replace(",", "")))` → 쉼표를 지운 "2500"은 정수로 바뀌어 → **2500**'],output:`2500
`,mistake:"오류가 귀찮아 `except: pass`로 모두 덮기. 결과가 틀려도 아무 표시가 없어 한참 뒤에야 알게 돼요. 덮기 전에 어떤 값이 왜 실패하는지 먼저 확인해요.",in_code:"데이터를 읽는 코드에서 `except ValueError:` 아래 `skipped.append(row)`처럼 건너뛴 값을 따로 모으는 줄을 자주 봐요. 나중에 모은 값을 출력해 보면 쉼표나 단위 글자처럼 고칠 수 있는 원인이 드러나요."},{type:`example`,id:`theory-py-error-ex6`,kind:`choice`,title:`바꾼 값과 못 바꾼 값`,prompt:`아래 코드의 출력값을 고르세요.`,code:`ok, bad = [], []
for t in ["31", "1,5", "7"]:
    try:
        ok.append(int(t))
    except ValueError:
        bad.append(t)
print(ok, bad)`,output:`[31, 7] ['1,5']
`,choices:[`[31, 7] ['1,5']`,`[31, 15, 7] []`,`[31] ['1,5', '7']`,`[31, 1, 7] []`],answer:`[31, 7] ['1,5']`,feedback:{"[31, 15, 7] []":`int가 쉼표를 알아서 지우고 바꿔 준다고 생각했나요?`,"[31] ['1,5', '7']":`한 번 오류가 나면 그 뒤의 값도 모두 except로 간다고 생각했나요?`,"[31, 1, 7] []":`int가 쉼표 앞의 숫자까지만 바꿔 준다고 생각했나요?`},explanation:`"1,5"는 쉼표 때문에 int로 바꾸지 못해 ValueError가 나고, except가 그 글자를 bad에 모아요. 오류는 그 차례에서만 처리되고 반복은 이어져서 "7"은 정상으로 바뀌어요.`,card:`swallow`},{type:`summary`,points:["try 안에서 오류가 나면 except로 건너가요. `type(e).__name__`은 오류 이름이고, IndexError·KeyError는 없는 것, TypeError는 자료형, ValueError는 값이 맞지 않는 오류예요.","`else`는 오류가 없을 때만, `finally`는 늘 마지막에 실행돼요.",`except는 위에서부터 처음 맞는 칸 하나만 실행해요. 넓은 Exception은 맨 아래에 둬요.`,"여러 오류는 `except (A, B):`처럼 튜플로 받아요. `A or B`는 A 하나와 같아요.",`트레이스백은 마지막 줄의 오류 이름과 메시지부터 읽고, 터진 줄이 아니라 값이 만들어진 곳을 거슬러 찾아요.`,"`except: pass`로 삼키면 틀린 값이 조용히 빠져요. 원인을 고치거나 건너뛴 값을 모아 확인해요."]}],covers:{"py-error-01":[`try-except`,`except-tuple`],"py-error-02":[`else-finally`],"py-error-03":[`try-except`,`except-order`],"py-error-04":[`try-except`,`except-tuple`],"py-error-05":[`traceback`],"py-error-06":[`try-except`,`swallow`]}},{id:`theory-py-iter`,version:2,concept_id:`py-iter`,title:`반복자와 생성기`,minutes:16,steps:[{type:`explain`,id:`iterator`,title:`한 번 꺼내면 비는 반복자`,body:"zip, map, enumerate, 생성기처럼 값을 하나씩 꺼내 주는 것을 반복자(이터레이터)라고 해요. 반복자는 `next()`로 다음 값을 하나씩 꺼내고, `list()`나 for 문은 끝까지 다 꺼내요. 한 번 다 꺼낸 반복자는 비어서, 다시 `list()`로 바꾸면 오류 없이 빈 리스트가 나와요. 리스트는 몇 번이든 다시 돌 수 있으니, 여러 번 쓸 묶음은 처음에 `list()`로 바꿔 담아 둬요. `map(함수, 묶음)`은 원소마다 함수를 적용한 값을 하나씩 꺼내 주는 반복자예요.",code:`nums = [3, 8]
it = iter(nums)
print(next(it), next(it))
m = map(str, nums)
print(list(m), list(m))`,trace:["`nums = [3, 8]` → 보통 리스트예요","`it = iter(nums)` → 리스트에서 값을 하나씩 꺼내 줄 반복자를 만들어요","`print(next(it), next(it))` → 꺼낼 때마다 다음 값이 나와요 → **3 8**","`m = map(str, nums)` → 원소마다 str을 적용할 반복자예요. 아직 아무것도 계산하지 않았어요","`print(list(m), list(m))` → 첫 list가 끝까지 꺼내 가서, 두 번째는 빈 리스트 → **['3', '8'] []**"],output:`3 8
['3', '8'] []
`,mistake:"확인하려고 `print(list(it))`를 끼워 넣기. 그 순간 반복자를 다 꺼내 버려서, 뒤의 for 문이나 list()는 빈 결과를 받아요. 확인할 때는 `items = list(it)`로 먼저 담아 두고 items를 써요.",in_code:"파일 객체도 반복자라서 `for line in f:`로 한 번 다 읽으면, 같은 f로 다시 for를 돌 때 아무 줄도 나오지 않아요. 두 번 쓸 데이터는 처음부터 리스트로 받아 둬요."},{type:`example`,id:`theory-py-iter-ex1`,kind:`choice`,title:`하나 꺼내고 나머지`,prompt:`아래 코드의 출력값을 고르세요.`,code:`it = iter("abc")
first = next(it)
rest = list(it)
print(first, rest, list(it))`,output:`a ['b', 'c'] []
`,choices:[`a ['b', 'c'] []`,`a ['a', 'b', 'c'] []`,`a ['b', 'c'] ['b', 'c']`,`오류 발생`],answer:`a ['b', 'c'] []`,feedback:{"a ['a', 'b', 'c'] []":`next로 꺼낸 값도 list가 처음부터 다시 꺼낸다고 생각했나요?`,"a ['b', 'c'] ['b', 'c']":`다 꺼낸 반복자도 다시 list로 바꾸면 같은 값이 나온다고 생각했나요?`,"오류 발생":`빈 반복자를 list로 바꾸면 오류가 난다고 생각했나요?`},explanation:`next가 a를 꺼낸 뒤 list(it)는 남은 b, c만 꺼내요. 그 뒤의 list(it)는 이미 빈 반복자라 오류 없이 빈 리스트예요.`,card:`iterator`},{type:`explain`,id:`zip-enum`,title:`zip은 짧은 쪽에서 멈춰요`,body:"`zip(a, b)`는 같은 번호끼리 짝을 짓다가 더 짧은 쪽이 끝나면 멈춰요. 짝이 없는 남은 원소는 오류 없이 조용히 빠져요. `enumerate(묶음, 1)`은 원소마다 1부터 번호를 붙여 `(번호, 원소)` 쌍을 꺼내 주고, 두 번째 값은 `start=1`처럼 이름을 붙여 쓰기도 해요(주지 않으면 0부터예요). 원소가 쌍이면 `for i, (f, c) in …`처럼 괄호로 한 번 더 나눠 받아요.",code:`fruits = ["감", "배", "귤"]
costs = [800, 1500]
z = zip(fruits, costs)
for i, (f, c) in enumerate(z, 1):
    print(i, f, c)
print(i)`,trace:['`fruits = ["감", "배", "귤"]` → 과일 세 개예요',"`costs = [800, 1500]` → 가격은 두 개뿐이에요","`z = zip(fruits, costs)` → 짧은 costs에 맞춰 (감, 800), (배, 1500) 두 쌍만 꺼내 줄 반복자예요. 귤은 빠져요","`for i, (f, c) in enumerate(z, 1):` → 1부터 번호를 붙인 (번호, 쌍)을 받아, 쌍은 괄호로 한 번 더 나눠 f와 c에 담아요","`print(i, f, c)` → **1 감 800**, **2 배 1500**","`print(i)` → 반복이 끝나도 i에는 마지막 번호가 남아요(4강) → **2**"],output:`1 감 800
2 배 1500
2
`,mistake:"zip이 긴 쪽에 맞춰 빈칸을 None으로 채워 준다고 생각하기. 짧은 쪽에서 멈춰서 남은 원소는 사라지고 오류도 나지 않아요. 길이가 다를 때 오류가 나게 하려면 Python 3.10부터 `zip(a, b, strict=True)`를 써요.",in_code:"`for i, row in enumerate(rows, start=1):`처럼 줄 번호를 1부터 붙여 출력하거나, 오류가 난 줄을 알려 주는 코드를 자주 봐요."},{type:`example`,id:`theory-py-iter-ex2`,kind:`choice`,title:`번호 붙인 짝`,prompt:`아래 코드의 출력값을 고르세요.`,code:`days = ["월", "화", "수"]
temps = [12, 15]
z = zip(days, temps)
print(list(enumerate(z)))`,output:`[(0, ('월', 12)), (1, ('화', 15))]
`,choices:[`[(0, ('월', 12)), (1, ('화', 15))]`,`[(1, ('월', 12)), (2, ('화', 15))]`,`[(0, ('월', 12)), (1, ('화', 15)), (2, ('수', None))]`,`[(0, '월', 12), (1, '화', 15)]`],answer:`[(0, ('월', 12)), (1, ('화', 15))]`,feedback:{"[(1, ('월', 12)), (2, ('화', 15))]":`enumerate에 시작 번호를 주지 않아도 1부터 센다고 생각했나요?`,"[(0, ('월', 12)), (1, ('화', 15)), (2, ('수', None))]":`zip이 긴 쪽에 맞춰 빈자리를 None으로 채운다고 생각했나요?`,"[(0, '월', 12), (1, '화', 15)]":`enumerate가 번호와 쌍을 납작한 튜플 하나로 합친다고 생각했나요?`},explanation:`zip은 짧은 temps에 맞춰 두 쌍만 만들고 "수"는 빠져요. enumerate는 시작 번호를 주지 않아 0부터 세고, 번호와 쌍을 (번호, 쌍)으로 묶어요.`,card:`zip-enum`},{type:`explain`,id:`generator`,title:`yield로 만드는 생성기`,body:"함수 안에 `yield`가 있으면 생성기 함수가 돼요. 생성기 함수를 부르면 본문을 실행하지 않고, 값을 하나씩 만들어 줄 생성기(반복자의 한 종류)만 돌려줘요. `next(g)`를 부르면 그제야 본문이 실행되다가 `yield 값`에서 그 값을 돌려주고 그 자리에서 멈춰요. 다음 `next()`는 멈춘 자리부터 이어서 다음 yield까지 실행하고, for 문이나 list()는 끝까지 이어서 꺼내요.",code:`def gen():
    print("본문 실행")
    yield 1
g = gen()
print("next 전")
print(next(g))`,trace:["`def gen():` → 본문에 yield가 있어 생성기 함수예요",'`print("본문 실행")` → 본문의 첫 줄이에요',"`yield 1` → 값 1을 내주고 그 자리에서 멈출 곳이에요","`g = gen()` → 생성기만 만들고 본문은 아직 실행하지 않아요",'`print("next 전")` → **next 전**',"`print(next(g))` → 이제야 본문이 실행되어 **본문 실행**이 나오고, yield에서 멈추며 돌려준 값이 출력돼요 → **1**"],output:`next 전
본문 실행
1
`,mistake:`생성기 함수를 부르는 순간 본문이 끝까지 실행된다고 생각하기. 부르면 생성기만 만들어지고, 본문은 next()나 for 문이 값을 꺼낼 때 조금씩 실행돼요.`,in_code:"큰 파일을 줄마다 처리하는 코드에서 `def read_rows(path):` 안에 `yield row`가 있는 함수를 자주 봐요. 모든 줄을 리스트에 담지 않고 필요할 때 한 줄씩 만들어 메모리를 아껴요. `sum(x * 2 for x in nums)`처럼 괄호 안에 쓴 생성기 식(9강)도 같은 방식이에요."},{type:`example`,id:`theory-py-iter-ex3`,kind:`choice`,title:`꺼내다 멈춘 생성기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`def steps():
    for k in [4, 5, 6]:
        yield k + 1

g = steps()
head = next(g)
tail = list(g)
print(head, tail)`,output:`5 [6, 7]
`,choices:[`5 [6, 7]`,`5 [5, 6, 7]`,`5 []`,`5 [6]`],answer:`5 [6, 7]`,feedback:{"5 [5, 6, 7]":`list(g)가 생성기를 처음부터 다시 실행한다고 생각했나요?`,"5 []":`next로 하나를 꺼내면 생성기가 끝나 버린다고 생각했나요?`,"5 [6]":`list도 next처럼 값을 하나만 꺼낸다고 생각했나요?`},explanation:`next(g)는 첫 yield까지 실행해 5를 돌려주고 멈춰요. list(g)는 멈춘 자리부터 끝까지 이어 6과 7을 꺼내요.`,card:`generator`},{type:`explain`,id:`defaultdict`,title:`없는 키를 만들어 주는 defaultdict`,body:"`defaultdict(list)`는 없는 키를 `d[키]`로 읽는 순간, `list()`로 만든 빈 리스트를 그 키에 넣고 돌려주는 딕셔너리예요. 그래서 키가 있는지 확인하지 않고 `d[키].append(값)`을 바로 쓸 수 있어요. 반대로 `in`과 `get()`은 키를 만들지 않아서, 없는 키에 `in`은 False, `get`은 None이에요. `defaultdict(int)`는 없는 키를 0으로 시작해서 `d[키] += 1`로 셀 때 써요.",code:`from collections import defaultdict
box = defaultdict(list)
box["과일"].append("감")
print(box["채소"], "고기" in box)
print(dict(box))`,trace:["`from collections import defaultdict` → collections 모듈에서 defaultdict를 가져와요","`box = defaultdict(list)` → 없는 키는 빈 리스트로 시작하는 딕셔너리예요",'`box["과일"].append("감")` → 없는 키 "과일"을 읽는 순간 빈 리스트가 생기고, 거기에 감을 넣어요','`print(box["채소"], "고기" in box)` → 대괄호로 읽은 채소는 빈 리스트로 새로 생기고, in은 키를 만들지 않아 → **[] False**',"`print(dict(box))` → 읽기만 한 채소도 키로 남았고, 고기는 없어요 → **{'과일': ['감'], '채소': []}**"],output:`[] False
{'과일': ['감'], '채소': []}
`,mistake:'`box["채소"]`를 읽기만 했으니 키가 생기지 않는다고 생각하기. defaultdict는 대괄호로 읽기만 해도 키를 만들어서 길이와 키 목록이 바뀌어요. 있는지만 확인하려면 `in`이나 `get`을 써요.',in_code:"`groups = defaultdict(list)` 다음에 `groups[k].append(v)`가 반복문 안에 이어지는 코드는 같은 키끼리 값을 모으는 흔한 모양이에요. 6강의 `if k not in d:` 확인 줄이 필요 없어져요."},{type:`example`,id:`theory-py-iter-ex4`,kind:`choice`,title:`읽기만 한 키`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from collections import defaultdict

d = defaultdict(int)
for ch in "아야아":
    d[ch] += 1
print(d["어"], len(d), d.get("우"))`,output:`0 3 None
`,choices:[`0 3 None`,`0 2 None`,`0 3 0`,`오류 발생`],answer:`0 3 None`,feedback:{"0 2 None":`대괄호로 없는 키를 읽기만 해서는 키가 생기지 않는다고 생각했나요?`,"0 3 0":`get도 없는 키에 기본값 0을 만들어 돌려준다고 생각했나요?`,"오류 발생":`defaultdict도 없는 키를 대괄호로 읽으면 KeyError가 난다고 생각했나요?`},explanation:`반복으로 아와 야, 두 키가 생겨요. d["어"]는 읽는 순간 0으로 새 키가 생겨 len이 3이 되고, get("우")는 키를 만들지 않아 None이에요.`,card:`defaultdict`},{type:`explain`,id:`counter`,title:`Counter로 한 번에 세기`,body:"`Counter(묶음)`은 값마다 몇 번 나왔는지 세어, 값을 키로, 개수를 값으로 담은 딕셔너리처럼 만들어요. 없는 값을 `c[\"지\"]`처럼 읽으면 KeyError 대신 0이에요. `most_common(n)`은 많이 나온 순서로 `(값, 개수)` 튜플 n개를 담은 리스트를 돌려줘요. 괄호 안의 `w for w, _ in ps`는 쌍에서 앞 값만 꺼내 넘기는 생성기 식이고, `_`는 '이 값은 쓰지 않아요'라는 뜻으로 흔히 쓰는 이름이에요.",code:`from collections import Counter
ps = [("민", 1), ("준", 2), ("민", 3)]
c = Counter(w for w, _ in ps)
print(c["민"], c["지"])
print(c.most_common(1))`,trace:["`from collections import Counter` → 개수를 세는 도구 Counter를 가져와요",'`ps = [("민", 1), ("준", 2), ("민", 3)]` → (이름, 번호) 쌍 세 개예요',"`c = Counter(w for w, _ in ps)` → 쌍마다 이름만 꺼내 세요. 번호는 _에 받아 쓰지 않아요",'`print(c["민"], c["지"])` → 민은 두 번, 없는 지는 오류 대신 0 → **2 0**',"`print(c.most_common(1))` → 가장 많이 나온 하나를 (값, 개수) 튜플의 리스트로 → **[('민', 2)]**"],output:`2 0
[('민', 2)]
`,mistake:"`most_common(1)`이 값 하나나 튜플 하나를 돌려준다고 생각하기. 하나만 달라고 해도 결과는 리스트라서, 값만 꺼내려면 `c.most_common(1)[0][0]`처럼 번호를 두 번 써요.",in_code:"6강의 `freq[w] = freq.get(w, 0) + 1` 반복을 `Counter(words)` 한 줄로 바꾼 코드를 자주 봐요. 결과는 딕셔너리처럼 `c[키]`로 읽고, `.most_common(3)`으로 상위 3개를 뽑아요."},{type:`example`,id:`theory-py-iter-ex5`,kind:`choice`,title:`두 번째로 많은 값`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from collections import Counter

c = Counter([3, 1, 3, 2, 3, 1])
top = c.most_common(2)
print(top[1], c[9])`,output:`(1, 2) 0
`,choices:[`(1, 2) 0`,`(3, 3) 0`,`1 0`,`오류 발생`],answer:`(1, 2) 0`,feedback:{"(3, 3) 0":`top[1]이 가장 많이 나온 첫 번째 항목이라고 생각했나요?`,"1 0":`most_common이 개수 없이 값만 돌려준다고 생각했나요?`,"오류 발생":`Counter에 없는 값을 대괄호로 읽으면 KeyError가 난다고 생각했나요?`},explanation:`3이 세 번, 1이 두 번, 2가 한 번이라 most_common(2)는 [(3, 3), (1, 2)]예요. 번호는 0부터라 top[1]은 (1, 2)이고, 없는 값 9는 0이에요.`,card:`counter`},{type:`explain`,id:`groupby`,title:`groupby는 이웃한 것만 묶어요`,body:"`groupby(묶음)`은 바로 이웃한 같은 값끼리만 한 묶음으로 만들어 `(값, 묶음)` 쌍을 하나씩 꺼내 줘요. 같은 값이라도 사이에 다른 값이 끼어 있으면 다른 묶음이 돼요. 묶음 g도 반복자라서 개수를 세려면 `len(list(g))`처럼 리스트로 바꿔요. 같은 값을 모두 한 묶음으로 모으려면 `groupby(sorted(묶음))`처럼 먼저 정렬해서 같은 값을 붙여 놓아요.",code:`from itertools import groupby
s = "aabaa"
for k, g in groupby(s):
    print(k, len(list(g)))
for k, g in groupby(sorted(s)):
    print(k, len(list(g)))`,trace:["`from itertools import groupby` → itertools 모듈에서 groupby를 가져와요",'`s = "aabaa"` → a 둘, b 하나, a 둘이 이어진 글자예요',"`for k, g in groupby(s):` → 이웃한 같은 글자끼리 묶어 (글자, 묶음)을 받아요","`print(k, len(list(g)))` → b를 사이에 둔 a는 다른 묶음이라 → **a 2**, **b 1**, **a 2**","`for k, g in groupby(sorted(s)):` → 정렬하면 a 넷이 붙어요","`print(k, len(list(g)))` → **a 4**, **b 1**"],output:`a 2
b 1
a 2
a 4
b 1
`,mistake:`groupby가 같은 값을 모두 한 묶음으로 모아 준다고 생각하기. 이웃한 값만 묶어서, 시간 순서 기록처럼 섞인 데이터는 같은 값이 여러 묶음으로 나와요. 먼저 sorted로 정렬하거나, 개수만 필요하면 Counter를 써요.`,in_code:"`groupby(sorted(rows, key=…), key=…)`처럼 정렬과 groupby가 짝으로 붙은 코드를 자주 봐요. sorted가 빠져 있으면 같은 값이 여러 묶음으로 쪼개질 수 있으니 먼저 확인해요."},{type:`example`,id:`theory-py-iter-ex6`,kind:`choice`,title:`묶음은 몇 개`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from itertools import groupby

s = "OOXO"
n1 = len(list(groupby(s)))
n2 = len(list(groupby(sorted(s))))
print(n1, n2)`,output:`3 2
`,choices:[`3 2`,`2 2`,`4 2`,`3 3`],answer:`3 2`,feedback:{"2 2":`groupby가 떨어져 있는 같은 값도 한 묶음으로 모은다고 생각했나요?`,"4 2":`정렬하지 않으면 groupby가 글자 하나하나를 따로 묶는다고 생각했나요?`,"3 3":`정렬해도 묶음 수가 그대로라고 생각했나요?`},explanation:`"OOXO"는 OO, X, O 세 묶음이에요. 정렬하면 "OOOX"가 되어 O 셋이 붙으니 OOO와 X 두 묶음이에요.`,card:`groupby`},{type:`summary`,points:["zip·map·enumerate·생성기는 반복자라서 한 번 다 꺼내면 비어요. 다시 `list()`나 for로 꺼내면 오류 없이 빈 결과예요.","zip은 짧은 쪽에서 멈추고, `enumerate(묶음, start=1)`은 1부터 번호를 붙여요. 쌍은 `for i, (a, b) in …`로 나눠 받아요.",`yield가 있는 함수는 부를 때 본문을 실행하지 않아요. next()마다 다음 yield까지 실행하고 멈춰요.`,"`defaultdict(list)`는 대괄호로 읽기만 해도 키를 만들고, `in`과 `get`은 만들지 않아요.","`Counter`는 값마다 개수를 세고 없는 값은 0이에요. `most_common(n)`은 (값, 개수) 튜플의 리스트예요.","`groupby`는 이웃한 같은 값만 묶어요. 모두 모으려면 먼저 sorted로 정렬해요."]}],covers:{"py-iter-01":[`iterator`],"py-iter-02":[`zip-enum`],"py-iter-03":[`generator`],"py-iter-04":[`defaultdict`,`counter`],"py-iter-05":[`counter`,`groupby`]}}]};export{e as default};