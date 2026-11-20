var e={schema_version:1,track_id:`sql`,lang:`sql`,lessons:[{id:`theory-sql-rows`,version:2,concept_id:`sql-rows`,title:`행 조건과 NULL`,minutes:18,steps:[{type:`explain`,id:`table-select`,title:`표에서 열 꺼내기`,body:"데이터베이스는 데이터를 표(테이블)에 담아요. 가로 한 줄인 행은 기록 한 건, 세로 한 칸인 열은 같은 종류의 값이에요. `SELECT 열 FROM 표;`는 모든 행에서 적은 열만 꺼내 결과 표를 만들고, 열 자리의 `*`는 모든 열이에요. 맨 위 `--` 줄은 실행되지 않는 주석으로, 표를 만드는 `CREATE TABLE`과 행을 넣는 `INSERT INTO`로 입력 데이터 전체를 보여 줘요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE pets(name, age);
-- INSERT INTO pets VALUES('콩',5);
-- INSERT INTO pets VALUES('별',2);
-- INSERT INTO pets VALUES('달',9);
SELECT name FROM pets;
SELECT * FROM pets;`,trace:["`-- 입력 데이터 전체 (SQLite)` → 아래 주석이 입력의 전부이고, SQLite(작은 데이터베이스)에서 실행해요","`-- CREATE TABLE pets(name, age);` → 두 열을 가진 pets 표를 만들어요","`-- INSERT INTO pets VALUES('콩',5);` → 열 순서대로 값을 넣어 한 행을 만들고, 글자는 작은따옴표로 감싸요","`SELECT name FROM pets;` → name 열만 → **콩, 별, 달**","`SELECT * FROM pets;` → 모든 열. 결과 첫 줄은 열 이름, 아래는 한 행씩 `|`로 칸을 나눠요"],output:`name
콩
별
달

name | age
콩 | 5
별 | 2
달 | 9
`,mistake:"`SELECT`가 표를 고친다고 생각하기. 결과 표를 새로 보여 줄 뿐이라, `SELECT name` 뒤에도 pets 표에는 age 열이 그대로 있어요.",in_code:"`SELECT *`는 처음 보는 표를 살필 때 써요. 프로그램 안에서는 열이 늘어도 결과 모양이 그대로이도록 필요한 열만 적어요."},{type:`explain`,id:`notation`,title:`결과 표를 한 줄로 적기`,body:"`COUNT(*)`는 행의 개수를, `SUM(열)`은 그 열 값의 합을 값 하나로 돌려줘요. 이 앱은 작은 결과 표를 한 줄로 적어서, 값이 하나면 `3`, 한 행에 열이 여러 개면 열 순서대로 소괄호에 `(3, 16)`, 한 열에 행이 여러 개면 위에서부터 대괄호에 `['콩', '별']`처럼 적어요. 행을 골라 꺼내는 조회는 한 행만 남아도 `['콩']`, 하나도 남지 않으면 `[]`처럼 대괄호로 적어요. 글자는 작은따옴표로 감싸고 빈 값은 `NULL`로 적어요. 괄호는 한 줄로 적기 위한 표시라, 답을 직접 적을 때 `3, 16`처럼 괄호를 빼도 같은 답이에요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE pets(name, age);
-- INSERT INTO pets VALUES('콩',5);
-- INSERT INTO pets VALUES('별',2);
-- INSERT INTO pets VALUES('달',9);
SELECT COUNT(*) FROM pets;
SELECT COUNT(*), SUM(age)
FROM pets;
SELECT name FROM pets;
SELECT SUM(age) AS total
FROM pets;`,trace:["`SELECT COUNT(*) FROM pets;` → 행이 세 개, 값 하나라 **3**","`SELECT COUNT(*), SUM(age)` → 5 + 2 + 9 = 16, 한 행에 두 열이라 **(3, 16)**","`SELECT name FROM pets;` → 한 열에 세 행이라 **['콩', '별', '달']**","`SUM(age) AS total` → `AS 이름`은 결과 열의 이름만 정해요 → 열 이름 total, 값 **16**"],output:`COUNT(*)
3

COUNT(*) | SUM(age)
3 | 16

name
콩
별
달

total
16
`,mistake:"한 행에 열이 여러 개인 결과를 대괄호로 적기. `[3, 16]`은 한 열에 3과 16이 위아래로 있다는 뜻이고, 한 행에 두 열이면 `(3, 16)`이에요.",in_code:"Python에서 SQL을 실행하면 `fetchall()`(결과를 모두 받는 기능)이 `[(3, 16)]`처럼 행마다 소괄호로 묶은 목록을 돌려줘요."},{type:`example`,id:`theory-sql-rows-ex1`,kind:`choice`,title:`책 두 권 집계`,prompt:`아래 SQL의 결과를 한 줄로 적은 것을 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE book(name, page);
-- INSERT INTO book VALUES('강',92);
-- INSERT INTO book VALUES('숲',48);
SELECT COUNT(*), SUM(page)
FROM book;`,output:`COUNT(*) | SUM(page)
2 | 140
`,choices:[`(2, 140)`,`[2, 140]`,`(140, 2)`,`140`],answer:`(2, 140)`,feedback:{"[2, 140]":`한 행에 나란히 놓인 두 값을 한 열의 위아래 값처럼 대괄호로 적는다고 생각했나요?`,"(140, 2)":`소괄호 안의 순서가 SELECT에 적은 열 순서와 상관없다고 생각했나요?`,140:`SELECT에 적은 두 식 중 마지막 식의 값만 결과로 나온다고 생각했나요?`},explanation:`COUNT(*)는 두 행을 세어 2, SUM(page)는 92 + 48 = 140이에요. 한 행에 두 열이라 SELECT에 적은 순서대로 소괄호에 적어 (2, 140)이에요.`,card:`notation`},{type:`explain`,id:`order-limit`,title:`정렬하고 앞에서 잘라 내기`,body:"`ORDER BY 열`은 작은 값부터, 열 뒤에 `DESC`를 붙이면 큰 값부터 행을 줄 세워요. `ORDER BY a DESC, b`는 a가 같은 행끼리만 b로 순서를 정하고, DESC는 바로 앞 열 하나에만 붙어요. `LIMIT n`은 정렬된 결과의 앞 n행만 남기고, `OFFSET m`을 더하면 앞의 m행을 건너뛴 뒤 n행을 남겨요. 글자는 가나다순으로 비교하고, ORDER BY가 없으면 결과 순서는 약속되지 않아요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE game(name, pt);
-- INSERT INTO game VALUES('콩',31);
-- INSERT INTO game VALUES('별',28);
-- INSERT INTO game VALUES('달',31);
-- INSERT INTO game VALUES('해',35);
SELECT name FROM game
ORDER BY pt DESC, name;
SELECT name FROM game
ORDER BY pt DESC, name
LIMIT 2 OFFSET 2;`,trace:["`ORDER BY pt DESC, name` → 점수가 큰 순서로, 31점으로 같은 콩과 달은 이름 순서로 → **해, 달, 콩, 별**",`정렬은 pt로 했지만 결과에는 SELECT에 적은 name 열만 나와요`,"`LIMIT 2 OFFSET 2` → 같은 순서에서 앞의 두 행(해, 달)을 건너뛰고 다음 두 행 → **콩, 별**"],output:`name
해
달
콩
별

name
콩
별
`,mistake:"OFFSET이 건너뛸 값이나 번호라고 생각하기. `OFFSET 2`는 정렬된 결과의 앞 두 행을 건너뛴다는 뜻이라, 무엇이 빠질지는 ORDER BY가 정해요.",in_code:"목록을 쪽으로 나누는 코드에서 `LIMIT 20 OFFSET 40`(20개씩 셋째 쪽)을, 가장 큰 행 하나를 꺼낼 때 `ORDER BY 열 DESC LIMIT 1`을 자주 봐요."},{type:`explain`,id:`where`,title:`WHERE로 행 고르기`,body:"`WHERE 조건`은 FROM 뒤에 붙어 조건이 참인 행만 남겨요. 비교는 `=`, `<>`(다르다, `!=`도 같아요), `<`, `<=`, `>`, `>=`이고, `>=`와 `<=`는 경계값과 같은 행도 남겨요. `AND`는 둘 다 참, `OR`는 하나라도 참이면 참인데, AND가 먼저 묶여 `a OR b AND c`는 `a OR (b AND c)`예요. 쓰는 순서는 `SELECT` → `FROM` → `WHERE` → `ORDER BY` → `LIMIT`이고, 여러 행을 묶은 그룹에 거는 조건(`HAVING`)은 다음 강의에서 배워요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE zoo(id, kind, age);
-- INSERT INTO zoo VALUES(1,'곰',5);
-- INSERT INTO zoo VALUES(2,'새',2);
-- INSERT INTO zoo VALUES(3,'곰',9);
-- INSERT INTO zoo VALUES(4,'곰',3);
SELECT id FROM zoo
WHERE kind = '새' OR kind = '곰'
  AND age >= 5 ORDER BY id;
SELECT id FROM zoo
WHERE (kind = '새' OR kind = '곰')
  AND age >= 5 ORDER BY id;`,trace:["`kind = '새' OR kind = '곰' AND age >= 5` → AND가 먼저 묶여 '새' 또는 '5살 이상인 곰' → 경계값 5살인 1번도 남아 **[1, 2, 3]**","3살 곰인 4번은 `age >= 5`가 거짓이라 빠져요","`(kind = '새' OR kind = '곰') AND age >= 5` → 괄호 안을 먼저 계산해 '5살 이상인 새나 곰' → 2살 새가 빠져 **[1, 3]**"],output:`id
1
2
3

id
1
3
`,mistake:"왼쪽부터 차례로 계산된다고 생각하기. `a OR b AND c`는 `(a OR b) AND c`가 아니에요. 헷갈리면 괄호로 뜻을 분명히 적어요.",in_code:"`WHERE deleted = 0`(지우지 않은 행) 뒤에 `OR`로 검색 조건을 덧붙이다 괄호를 빠뜨리면, 지운 행까지 결과에 섞여요."},{type:`example`,id:`theory-sql-rows-ex2`,kind:`choice`,title:`빵과 떡 재고 고르기`,prompt:`아래 SQL의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE box(id, kind, qty);
-- INSERT INTO box VALUES(1,'빵',9);
-- INSERT INTO box VALUES(2,'떡',4);
-- INSERT INTO box VALUES(3,'빵',3);
-- INSERT INTO box VALUES(4,'떡',7);
SELECT id FROM box
WHERE qty > 8 OR kind = '떡'
  AND qty < 5
ORDER BY id;`,output:`id
1
2
`,choices:[`[1, 2]`,`[2]`,`[2, 4]`,`[1, 2, 3, 4]`],answer:`[1, 2]`,feedback:{"[2]":`왼쪽부터 차례로 묶어 qty > 8 OR kind = '떡'을 먼저 계산한다고 생각했나요?`,"[2, 4]":`AND가 바로 앞의 kind = '떡'이 아니라 맨 앞의 qty > 8과 묶인다고 생각했나요?`,"[1, 2, 3, 4]":`AND도 OR처럼 조건 하나만 참이면 된다고 생각했나요?`},explanation:`AND가 먼저 묶여 조건은 qty > 8 OR (kind = '떡' AND qty < 5)예요. qty가 9인 1번은 앞 조건으로 남고, 떡 중에는 qty가 4인 2번만 뒤 조건을 만족해 [1, 2]예요.`,card:`where`},{type:`explain`,id:`null`,title:`NULL은 비교하면 '알 수 없음'`,body:"NULL은 0이나 빈 글자가 아니라 '값이 없음'이에요. NULL과 `=`, `<>`, `>=` 같은 비교를 하면 참도 거짓도 아닌 '알 수 없음'(NULL)이 되고, WHERE는 참인 행만 남기므로 그 행은 빠져요. 알 수 없음은 OR에서 다른 쪽이 참이면 참, AND에서 다른 쪽이 거짓이면 거짓이고, 그 밖에는 알 수 없음이에요. NULL은 `IS NULL`·`IS NOT NULL`로 찾고, SQLite의 `a IS b`는 같거나 둘 다 NULL이면 참이에요. FROM 없는 `SELECT 식, 식`은 그 값으로 한 행을 만들고, 참은 1, 거짓은 0으로 보여요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE pets(id, owner);
-- INSERT INTO pets VALUES(1,'민');
-- INSERT INTO pets VALUES(2,NULL);
-- INSERT INTO pets VALUES(3,'준');
SELECT id FROM pets
WHERE owner <> '민';
SELECT id FROM pets
WHERE owner IS NULL;
SELECT NULL = NULL, NULL IS NULL,
  5 IS NULL;`,trace:["`WHERE owner <> '민'` → 1번은 거짓, 3번은 참, 2번은 알 수 없음이라 빠져 → **[3]**","`WHERE owner IS NULL` → 주인이 빈 행을 찾는 바른 방법 → **[2]**","`NULL = NULL` → 알 수 없음이라 **NULL**. 그래서 `WHERE owner = NULL`은 어떤 행도 남기지 않아요","`NULL IS NULL`, `5 IS NULL` → 둘 다 NULL이면 참, 한쪽만 NULL이면 거짓 → **1**, **0**"],output:`id
3

id
2

NULL = NULL | NULL IS NULL | 5 IS NULL
NULL | 1 | 0
`,mistake:"'아니다' 조건이면 NULL인 행도 남는다고 생각하기. `owner <> '민'`은 주인이 없는 행에서 알 수 없음이라 그 행도 빠져요. 남기려면 `OR owner IS NULL`을 더해요.",in_code:"`WHERE deleted_at IS NULL`(아직 지우지 않은 행)을 자주 봐요. `WHERE memo = NULL`은 오류 없이 빈 결과만 돌려줘 알아채기 어려워요."},{type:`example`,id:`theory-sql-rows-ex3`,kind:`choice`,title:`이상이거나 미만이거나`,prompt:`아래 SQL의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE quiz(id, pt);
-- INSERT INTO quiz VALUES(1,80);
-- INSERT INTO quiz VALUES(2,55);
-- INSERT INTO quiz VALUES(3,NULL);
SELECT id FROM quiz
WHERE pt >= 60 OR pt < 60
ORDER BY id;`,output:`id
1
2
`,choices:[`[1, 2]`,`[1, 2, 3]`,`[]`,`[3]`],answer:`[1, 2]`,feedback:{"[1, 2, 3]":`60 이상이거나 미만이라는 조건이면 pt가 NULL인 행도 둘 중 하나에는 들어간다고 생각했나요?`,"[]":`NULL인 행이 하나 있으면 WHERE 조건이 모든 행에서 알 수 없음이 된다고 생각했나요?`,"[3]":`WHERE가 조건이 참인 행이 아니라 알 수 없음이 된 행을 남긴다고 생각했나요?`},explanation:`1번(80)은 pt >= 60이, 2번(55)은 pt < 60이 참이라 남아요. 3번은 두 비교가 모두 NULL과의 비교라 알 수 없음이고, 알 수 없음끼리 OR로 이어도 참이 되지 않아 빠져요.`,card:`null`},{type:`explain`,id:`like`,title:`LIKE로 글자 모양 찾기`,body:"`LIKE '패턴'`은 글자가 패턴 모양과 맞는지 봐요. 패턴의 `%`는 글자 0개 이상, `_`는 정확히 한 글자예요. 그래서 `'콩%'`는 콩 한 글자와도 맞지만, `'콩_'`는 콩 뒤에 딱 한 글자가 더 있어야 맞아요. NULL은 LIKE로 비교해도 알 수 없음이라 빠져요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE pets(name);
-- INSERT INTO pets VALUES('콩');
-- INSERT INTO pets VALUES('콩이');
-- INSERT INTO pets VALUES('왕콩');
-- INSERT INTO pets VALUES(NULL);
SELECT name FROM pets
WHERE name LIKE '콩%';
SELECT name FROM pets
WHERE name LIKE '콩_';`,trace:["`LIKE '콩%'` → 콩으로 시작하고 뒤는 0글자 이상이라 **콩, 콩이**","`LIKE '콩_'` → 콩 뒤에 정확히 한 글자 → **콩이**. 콩은 뒤에 글자가 없어 빠져요",`왕콩은 콩으로 시작하지 않아 두 패턴에 모두 맞지 않고, NULL 행도 빠져요`],output:`name
콩
콩이

name
콩이
`,mistake:"`_`도 `%`처럼 글자가 없어도 된다고 생각하기. `_`는 반드시 한 글자를 차지해요.",in_code:"`LIKE '%@%'`처럼 앞뒤에 `%`를 붙여 '어디든 들어 있는 값'을 찾는 줄을 자주 봐요. SQLite의 LIKE는 영어 대소문자를 구별하지 않아요."},{type:`explain`,id:`values`,title:`행마다 값 만들기: COALESCE · NULLIF · CASE`,body:"NULL이 섞인 계산은 `5 + NULL`처럼 결과도 NULL이에요. `COALESCE(a, b)`는 a가 NULL이면 b를, 아니면 a를 돌려주고, `NULLIF(a, b)`는 a와 b가 같으면 NULL을, 다르면 a를 돌려줘서 `x / NULLIF(y, 0)`은 y가 0일 때 NULL이에요(다른 데이터베이스는 0으로 나누면 오류예요). `CASE WHEN 조건 THEN 값 … ELSE 값 END`는 위에서부터 처음 참인 WHEN의 값을, 없으면 ELSE 값을 돌려주고, ELSE가 없으면 NULL이에요. 세 식은 행마다 값을 만들 뿐 행을 지우지 않고, `WHERE COALESCE(x, 0) <> 3`처럼 NULL을 바꾼 뒤 비교할 수도 있어요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE trips(km, hours);
-- INSERT INTO trips VALUES(12,3);
-- INSERT INTO trips VALUES(8,2);
-- INSERT INTO trips VALUES(5,0);
-- INSERT INTO trips VALUES(6,NULL);
SELECT COALESCE(hours, 1) AS h,
  km / NULLIF(hours, 0) AS speed,
  CASE WHEN hours > 2 THEN '길게'
  WHEN hours > 0 THEN '짧게'
  ELSE '없음' END AS len
FROM trips;`,trace:["`COALESCE(hours, 1)` → NULL인 넷째 행만 1로, 0은 값이라 그대로 → **3, 2, 0, 1**","`km / NULLIF(hours, 0)` → 0인 행은 NULL로 나눠 NULL, NULL인 행도 NULL → **4, 4, NULL, NULL**","`CASE WHEN hours > 2 … WHEN hours > 0 …` → 첫 행은 두 WHEN이 다 참이라 처음 것 **길게**, 둘째 행은 **짧게**",`0과 NULL인 행은 맞는 WHEN이 없어 ELSE → **없음**. WHERE가 없으니 네 행이 모두 남아요`],output:`h | speed | len
3 | 4 | 길게
2 | 4 | 짧게
0 | NULL | 없음
1 | NULL | 없음
`,mistake:`CASE나 COALESCE가 조건에 맞지 않는 행을 지운다고 생각하기. 이 식들은 행마다 값을 바꿀 뿐이라 행 수는 그대로예요. 행을 고르는 것은 WHERE예요.`,in_code:"보고서 쿼리에서 `COALESCE(discount, 0)`으로 빈 할인을 0으로 바꾸고, `CASE WHEN score >= 60 THEN '통과' ELSE '재시험' END`로 이름표를 붙여요."},{type:`example`,id:`theory-sql-rows-ex4`,kind:`choice`,title:`가방 무게 요금`,prompt:`아래 SQL의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE bags(id, kg);
-- INSERT INTO bags VALUES(1,3);
-- INSERT INTO bags VALUES(2,12);
-- INSERT INTO bags VALUES(3,7);
SELECT CASE
  WHEN kg > 10 THEN '추가'
  WHEN kg > 5 THEN '보통'
END AS fee FROM bags ORDER BY id;`,output:`fee
NULL
추가
보통
`,choices:[`[NULL, '추가', '보통']`,`['추가', '보통']`,`[NULL, '보통', '보통']`,`['', '추가', '보통']`],answer:`[NULL, '추가', '보통']`,feedback:{"['추가', '보통']":`맞는 WHEN이 없는 행은 CASE가 결과에서 지운다고 생각했나요?`,"[NULL, '보통', '보통']":`참인 WHEN이 여러 개면 마지막 WHEN의 값을 고른다고 생각했나요?`,"['', '추가', '보통']":`ELSE가 없으면 빈 글자가 들어간다고 생각했나요?`},explanation:`12kg은 첫 WHEN kg > 10이 참이라 처음 참인 '추가'를, 7kg은 둘째 WHEN으로 '보통'을 받아요. 3kg은 맞는 WHEN이 없고 ELSE도 없어 NULL이 되고, 행은 지워지지 않아요.`,card:`values`},{type:`explain`,id:`in-list`,title:`IN으로 목록과 비교하기`,body:"`x IN (a, b)`는 `x = a OR x = b`, `x NOT IN (a, b)`는 `x <> a AND x <> b`와 같아요. 그래서 NOT IN 목록에 NULL이 있으면 `x <> NULL`이 알 수 없음이라 어떤 행도 참이 되지 못해요(IN은 같은 값이 있으면 NULL이 섞여도 참이에요). 목록 자리에 한 열을 돌려주는 하위 조회 `(SELECT 열 FROM 표)`를 넣을 수 있고, 목록에 같은 값이 여러 번 있어도 행이 늘지 않아요. 목록이 비면 IN은 늘 거짓, NOT IN은 x가 NULL이어도 늘 참이에요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE pets(name, age);
-- INSERT INTO pets VALUES('콩',5);
-- INSERT INTO pets VALUES('별',2);
-- INSERT INTO pets VALUES(NULL,7);
SELECT name FROM pets
WHERE name IN ('별', '별', '해');
SELECT name FROM pets
WHERE name NOT IN ('별', NULL);
SELECT age FROM pets
WHERE name NOT IN (SELECT name
  FROM pets WHERE age > 8);`,trace:["`IN ('별', '별', '해')` → 별은 목록에 두 번 있지만 한 번만 판정해 **별** 한 행","`NOT IN ('별', NULL)` → 콩은 `콩 <> NULL`이 알 수 없음, 별은 거짓, 이름이 NULL인 행도 알 수 없음 → **(행 없음)**","`(SELECT name FROM pets WHERE age > 8)` → 8살보다 많은 반려동물이 없어 빈 목록이에요","`NOT IN (빈 목록)` → 이름이 NULL인 행까지 모두 참 → **5, 2, 7**"],output:`name
별

name
(행 없음)

age
5
2
7
`,mistake:`NOT IN 목록의 NULL은 무시될 거라고 생각하기. NULL 하나 때문에 모든 행이 알 수 없음이나 거짓이 되어 결과가 비어요.`,in_code:"`WHERE status IN ('대기', '발송')`처럼 허용할 값을 나열하는 줄을 자주 봐요. 하위 조회 목록에 NULL이 섞일 수 있으면 다음 카드의 NOT EXISTS를 써요."},{type:`explain`,id:`exists`,title:`EXISTS로 짝이 있는지 보기`,body:"`EXISTS (SELECT …)`는 괄호 안 조회가 행을 하나라도 돌려주면 참, 하나도 없으면 거짓이에요. 있는지만 보므로 안쪽은 보통 `SELECT 1`로 적고, 안쪽 조건에 바깥 행의 열을 쓰면 바깥 행마다 다시 검사해요. `FROM pets AS p`의 p는 표에 붙인 별명이고, `p.name`은 'p 표의 name 열'이라는 뜻이에요. NOT IN과 달리 `NOT EXISTS`는 안쪽의 NULL이 짝을 만들지 않을 뿐이라, 짝 없는 행이 제대로 남아요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE pets(name);
-- INSERT INTO pets VALUES('콩');
-- INSERT INTO pets VALUES('별');
-- CREATE TABLE vet(pet);
-- INSERT INTO vet VALUES('콩');
-- INSERT INTO vet VALUES(NULL);
SELECT name FROM pets WHERE
name NOT IN (SELECT pet FROM vet);
SELECT name FROM pets AS p
WHERE NOT EXISTS (SELECT 1
  FROM vet WHERE vet.pet = p.name);`,trace:["`name NOT IN (SELECT pet FROM vet)` → 목록이 (콩, NULL)이라 별도 `별 <> NULL`이 알 수 없음 → **(행 없음)**","콩 → `vet.pet = '콩'`인 행이 있어 EXISTS가 참이니, NOT EXISTS는 거짓이라 빠져요",`별 → 맞는 행이 없고 NULL 행은 비교가 알 수 없음이라 짝이 아니에요 → NOT EXISTS가 참 → **별**`],output:`name
(행 없음)

name
별
`,mistake:`안쪽 표에 NULL이 있으면 NOT EXISTS도 결과가 빈다고 생각하기. NULL 행은 짝이 되지 않을 뿐이에요.`,in_code:"'숙제를 안 낸 학생 찾기' 같은 조회에서 `NOT EXISTS (SELECT 1 FROM 제출 WHERE 제출.학생 = s.id)` 모양을 자주 봐요."},{type:`example`,id:`theory-sql-rows-ex5`,kind:`choice`,title:`가입한 사람이 있는 동아리`,prompt:`아래 SQL의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE clubs(name);
-- INSERT INTO clubs VALUES('책');
-- INSERT INTO clubs VALUES('공');
-- INSERT INTO clubs VALUES('붓');
-- CREATE TABLE signups(club);
-- INSERT INTO signups VALUES('공');
-- INSERT INTO signups VALUES('공');
-- INSERT INTO signups VALUES('붓');
-- INSERT INTO signups VALUES(NULL);
SELECT name FROM clubs AS c
WHERE EXISTS (SELECT 1 FROM signups
  WHERE signups.club = c.name)
ORDER BY name;`,output:`name
공
붓
`,choices:[`['공', '붓']`,`['공', '공', '붓']`,`['공', '붓', '책']`,`[]`],answer:`['공', '붓']`,feedback:{"['공', '공', '붓']":`안쪽에서 찾은 행이 두 개면 바깥 행도 두 번 나온다고 생각했나요?`,"['공', '붓', '책']":`SELECT 1은 언제나 1을 돌려주니 EXISTS가 모든 행에서 참이라고 생각했나요?`,"[]":`안쪽 표에 NULL이 있으면 EXISTS가 참이 될 수 없다고 생각했나요?`},explanation:`공과 붓은 signups에 이름이 같은 행이 있어 EXISTS가 참이고, 책은 없어 거짓이에요. EXISTS는 행이 있는지만 보니 공이 두 번 가입돼도 한 번만 나오고, NULL 행은 어느 동아리와도 짝이 되지 않아요.`,card:`exists`},{type:`explain`,id:`set-ops`,title:`UNION · EXCEPT와 WITH`,body:"`UNION`은 두 SELECT의 결과를 합치며 같은 행을 한 번만 남기는데, 한쪽 안에서 겹친 행도 줄여요. `UNION ALL`은 모두 남기고, `EXCEPT`는 왼쪽에서 오른쪽에도 있는 행을 빼고 한 번씩만 남기며, 세 연산은 NULL끼리를 같은 값으로 봐요. `WITH 이름 AS (SELECT …)`는 결과에 이름을 붙여 그 문장 안에서 표처럼 쓰게 하고, 쉼표로 여러 개를 만들 수 있어요. 괄호로 감싼 SELECT(하위 조회)가 값 하나를 돌려주면 그 자리에 값처럼 써요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE jan(item);
-- INSERT INTO jan VALUES('감');
-- INSERT INTO jan VALUES('감');
-- INSERT INTO jan VALUES(NULL);
-- CREATE TABLE feb(item);
-- INSERT INTO feb VALUES('귤');
-- INSERT INTO feb VALUES(NULL);
SELECT item FROM jan UNION
SELECT item FROM feb ORDER BY item;
SELECT item FROM jan EXCEPT
SELECT item FROM feb;
WITH x AS (SELECT item FROM jan
  UNION ALL SELECT item FROM feb)
SELECT (SELECT COUNT(*) FROM x);`,trace:["`… UNION … ORDER BY item` → 겹친 감과 양쪽의 NULL을 하나씩만 남기고, 맨 끝 ORDER BY가 합친 결과 전체를 정렬해 → **NULL, 감, 귤**(SQLite는 NULL을 맨 앞에, PostgreSQL·Oracle은 맨 뒤에 정렬해요)","`… EXCEPT …` → jan의 감·NULL 중 feb에도 있는 NULL을 빼고, 감은 한 번만 → **감**","`WITH x AS (… UNION ALL …)` → 겹친 행도 모두 남긴 다섯 행에 x라는 이름을 붙여요","`(SELECT COUNT(*) FROM x)` → 괄호 안 SELECT가 값 5를 돌려주고, 바깥 SELECT가 그 값으로 한 행을 만들어 → **5**"],output:`item
NULL
감
귤

item
감

(SELECT COUNT(*) FROM x)
5
`,mistake:`UNION이 두 결과 사이에 겹친 행만 줄인다고 생각하기. 합친 결과 전체에서 줄이므로 한쪽 안에서 겹친 행도 하나가 돼요.`,in_code:"여러 달의 표를 모을 때 겹친 기록도 세려면 `UNION ALL`, 서로 다른 값 목록이면 `UNION`을 써요. WITH로 이름 붙인 결과는 CTE라고도 불러요."},{type:`example`,id:`theory-sql-rows-ex6`,kind:`choice`,title:`이틀 동안 나온 반찬`,prompt:`아래 SQL의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE mon(dish);
-- INSERT INTO mon VALUES('국');
-- INSERT INTO mon VALUES('밥');
-- INSERT INTO mon VALUES('국');
-- CREATE TABLE tue(dish);
-- INSERT INTO tue VALUES('밥');
-- INSERT INTO tue VALUES('죽');
SELECT dish FROM mon UNION
SELECT dish FROM tue
ORDER BY dish;`,output:`dish
국
밥
죽
`,choices:[`['국', '밥', '죽']`,`['국', '국', '밥', '밥', '죽']`,`['국', '국', '밥', '죽']`,`['밥']`],answer:`['국', '밥', '죽']`,feedback:{"['국', '국', '밥', '밥', '죽']":`UNION이 UNION ALL처럼 겹친 행도 모두 남긴다고 생각했나요?`,"['국', '국', '밥', '죽']":`UNION이 두 결과 사이에 겹친 행만 줄이고, 한쪽 안에서 겹친 행은 그대로 둔다고 생각했나요?`,"['밥']":`UNION이 두 결과에 모두 있는 행만 남긴다고 생각했나요?`},explanation:`UNION은 두 결과를 합친 뒤 같은 행을 한 번만 남겨요. 월요일 안에서 두 번 나온 국도, 이틀 모두 나온 밥도 하나씩만 남아 국, 밥, 죽이에요.`,card:`set-ops`},{type:`summary`,points:["`SELECT 열 FROM 표`는 고른 열로 결과 표를 만들어요. 결과는 `3`, `(3, 16)`, `['콩', '별']`처럼 한 줄로 적고, 괄호는 빼도 같은 답이에요.","`WHERE`는 조건이 참인 행만 남기고 AND가 OR보다 먼저 묶여요. `ORDER BY … DESC`로 정렬한 뒤 `LIMIT`·`OFFSET`이 앞에서부터 잘라요.","NULL과의 비교는 알 수 없음이라 WHERE에서 빠져요. NULL은 `IS NULL`로 찾고, `COALESCE`로 다른 값으로 바꿔요.","`COALESCE`·`NULLIF`·`CASE`는 행마다 값을 만들 뿐 행을 지우지 않아요. LIKE의 `%`는 0글자 이상, `_`는 정확히 한 글자예요.","`NOT IN` 목록에 NULL이 있으면 아무 행도 남지 않고, 목록이 비면 모든 행이 남아요. 짝이 있는지는 `EXISTS`·`NOT EXISTS`로 봐요.","`UNION`은 같은 행을 한 번만, `UNION ALL`은 모두 남기고, `EXCEPT`는 오른쪽에도 있는 행을 빼요. `WITH`는 결과에 이름을 붙여요."]}],covers:{"sql-where-01":[`where`,`order-limit`],"sql-null-01":[`null`,`where`],"sql-where-02":[`in-list`,`null`],"sql-null-02":[`values`,`notation`],"sql-exists-20261017":[`exists`,`null`],"sql-union-rows-20261020":[`set-ops`,`notation`],"sql-like-width-20261021":[`like`],"sql-nullsafe-is-20261022":[`null`],"sql-offset-page-20261023":[`order-limit`],"sql-except-set-20261024":[`set-ops`],"sql-rows-foundation-01":[`where`,`notation`],"sql-rows-foundation-02":[`null`,`notation`],"sql-rows-foundation-03":[`order-limit`,`table-select`],"sql-rows-foundation-04":[`in-list`,`notation`],"sql-rows-transfer-02":[`values`,`null`],"sql-condition-order-20261019":[`where`,`null`],"sql-case-values-20261021":[`values`],"sql-membership-duplicates-20261021":[`in-list`,`null`],"sql-nullif-ratio-20261023":[`values`],"sql-empty-membership-20261023":[`in-list`,`notation`],"sql-clause-order-form-01":[`where`,`order-limit`],"sql-null-compare-form-01":[`null`,`where`]}},{id:`theory-sql-aggregation`,version:2,concept_id:`sql-aggregation`,title:`SQL 집계`,minutes:17,steps:[{type:`explain`,id:`agg-null`,title:`집계 함수는 NULL을 빼고 계산해요`,body:"`SUM`(합)·`AVG`(평균)·`MIN`(최솟값)·`MAX`(최댓값)·`COUNT`(개수)를 집계 함수라고 하고, 여러 행을 값 하나로 줄여요. `COUNT(*)`는 행을 세지만, `COUNT(열)`·SUM·AVG·MIN·MAX는 그 열이 NULL인 행을 빼고 계산해요. 그래서 AVG의 분모도 행 수가 아니라 NULL이 아닌 값의 개수이고, SQLite의 AVG는 늘 소수로 돌려줘요(SQL Server는 정수 열이면 AVG도 정수예요). 집계는 열마다 따로 해서, `MAX(item)`은 무게가 가장 큰 행의 이름이 아니라 이름 중 가나다순으로 가장 뒤인 값이에요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE bag(item, kg);
-- INSERT INTO bag VALUES('책',4);
-- INSERT INTO bag VALUES('물',9);
-- INSERT INTO bag VALUES('컵',NULL);
SELECT COUNT(*), COUNT(kg),
  SUM(kg), AVG(kg) FROM bag;
SELECT MIN(kg), MAX(kg),
  MAX(item) FROM bag;`,trace:["`COUNT(*)` → 행 수 **3**. `COUNT(kg)` → kg이 NULL인 컵을 빼 **2**","`SUM(kg), AVG(kg)` → NULL을 빼고 4 + 9 = 13, 13 / 2 → **13, 6.5**","`MIN(kg), MAX(kg)` → NULL을 빼고 **4, 9**","`MAX(item)` → 이름끼리 비교해 가장 뒤인 **컵**. 무게가 NULL인 행의 이름이에요"],output:`COUNT(*) | COUNT(kg) | SUM(kg) | AVG(kg)
3 | 2 | 13 | 6.5

MIN(kg) | MAX(kg) | MAX(item)
4 | 9 | 컵
`,mistake:"AVG가 NULL을 0으로 보고 행 수로 나눈다고 생각하기. NULL은 분모에서도 빠져요. 0으로 세려면 `AVG(COALESCE(kg, 0))`처럼 먼저 바꿔요.",in_code:"가장 무거운 짐의 이름이 필요하면 `ORDER BY kg DESC LIMIT 1`로 그 행을 통째로 꺼내요. `MAX(kg)`와 `MAX(item)`을 함께 적으면 서로 다른 행의 값이 섞여요."},{type:`example`,id:`theory-sql-aggregation-ex1`,kind:`choice`,title:`나흘 동안 달린 거리`,prompt:`아래 SQL의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE runs(day, km);
-- INSERT INTO runs VALUES(1,3);
-- INSERT INTO runs VALUES(2,NULL);
-- INSERT INTO runs VALUES(3,5);
-- INSERT INTO runs VALUES(4,7);
SELECT COUNT(km), AVG(km)
FROM runs;`,output:`COUNT(km) | AVG(km)
3 | 5.0
`,choices:[`(3, 5.0)`,`(4, 3.75)`,`(4, 5.0)`,`(3, 3.75)`],answer:`(3, 5.0)`,feedback:{"(4, 3.75)":`COUNT(km)와 AVG가 NULL을 0으로 보고 함께 센다고 생각했나요?`,"(4, 5.0)":`COUNT(열)도 COUNT(*)처럼 NULL인 행까지 센다고 생각했나요?`,"(3, 3.75)":`AVG가 합계를 NULL이 든 행까지 포함한 행 수로 나눈다고 생각했나요?`},explanation:`km가 NULL인 2일을 빼면 값은 3, 5, 7 세 개라 COUNT(km)는 3이에요. AVG도 NULL을 빼고 (3 + 5 + 7) / 3 = 5.0이에요.`,card:`agg-null`},{type:`explain`,id:`empty`,title:`행이 없을 때와 값이 모두 NULL일 때`,body:"집계 SELECT는 남은 행이 하나도 없어도 결과 한 행을 돌려줘요. 이때 COUNT는 0이지만 SUM·AVG·MIN·MAX는 계산할 값이 없어 NULL이에요. 행은 있는데 값이 모두 NULL이어도 SUM은 NULL이지만, `SUM(COALESCE(won, 0))`은 행마다 0으로 바꾼 뒤 더해 0이에요. 행이 아예 없으면 그 COALESCE는 한 번도 실행되지 않아 NULL이라, 0이 필요하면 바깥에서 `COALESCE(SUM(won), 0)`으로 바꿔요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE tips(day, won);
-- INSERT INTO tips VALUES(1,NULL);
-- INSERT INTO tips VALUES(2,NULL);
-- INSERT INTO tips VALUES(3,NULL);
SELECT COUNT(*), SUM(won),
  SUM(COALESCE(won, 0)) FROM tips;
SELECT COUNT(*), SUM(won),
  COALESCE(SUM(won), 0),
  SUM(COALESCE(won, 0))
FROM tips WHERE day > 5;`,trace:["`FROM tips;` → 세 행 모두 won이 NULL → COUNT(*)는 **3**, SUM(won)은 더할 값이 없어 **NULL**","`SUM(COALESCE(won, 0))` → 행마다 NULL을 0으로 바꿔 0 + 0 + 0 → **0**","`WHERE day > 5` → 남는 행이 없어도 결과는 한 행이고, COUNT(*)는 **0**, SUM(won)은 **NULL**","`COALESCE(SUM(won), 0)` → SUM이 돌려준 NULL을 0으로 → **0**. 안쪽 COALESCE는 바꿀 행이 없어 **NULL**"],output:`COUNT(*) | SUM(won) | SUM(COALESCE(won, 0))
3 | NULL | 0

COUNT(*) | SUM(won) | COALESCE(SUM(won), 0) | SUM(COALESCE(won, 0))
0 | NULL | 0 | NULL
`,mistake:`행이 없으면 SUM이 0일 거라고 생각하기. 더할 값이 하나도 없으면 SUM은 NULL이에요. 0이 필요하면 바깥에 COALESCE를 둘러요.`,in_code:"AI가 쓴 매출 쿼리에서 `COALESCE(SUM(price), 0) AS total`처럼 합계를 감싼 줄을 자주 봐요. 조건에 맞는 행이 없는 날에도 NULL 대신 0이 나오게 하려는 거예요."},{type:`example`,id:`theory-sql-aggregation-ex2`,kind:`choice`,title:`비가 많이 온 날`,prompt:`아래 SQL의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE rain(day, mm);
-- INSERT INTO rain VALUES(1,3);
-- INSERT INTO rain VALUES(2,NULL);
SELECT COUNT(*), MAX(mm),
  COALESCE(SUM(mm), 0)
FROM rain WHERE mm > 50;`,output:`COUNT(*) | MAX(mm) | COALESCE(SUM(mm), 0)
0 | NULL | 0
`,choices:[`(0, NULL, 0)`,`(0, 0, 0)`,`(NULL, NULL, 0)`,`(0, NULL, NULL)`],answer:`(0, NULL, 0)`,feedback:{"(0, 0, 0)":`행이 없으면 MAX도 0을 돌려준다고 생각했나요?`,"(NULL, NULL, 0)":`행이 없으면 COUNT(*)도 NULL을 돌려준다고 생각했나요?`,"(0, NULL, NULL)":`바깥 COALESCE가 SUM이 돌려준 NULL은 바꾸지 못한다고 생각했나요?`},explanation:`mm > 50인 행이 없어 집계할 행이 하나도 없어요. 그래도 결과는 한 행이고 COUNT(*)는 0, MAX는 고를 값이 없어 NULL이에요. SUM도 NULL이지만 바깥 COALESCE가 0으로 바꿔요.`,card:`empty`},{type:`explain`,id:`distinct`,title:`DISTINCT로 같은 값은 한 번만`,body:"`COUNT(DISTINCT 열)`은 서로 다른 값이 몇 가지인지 세고, `SUM(DISTINCT 열)`은 같은 값을 한 번씩만 더해요. DISTINCT는 행 전체가 아니라 괄호 안의 값을 보고 중복을 없애고, NULL은 세지도 더하지도 않아요. 글자는 대소문자가 다르면 다른 값이고, `열 COLLATE NOCASE`를 붙이면 영어 대소문자를 구별하지 않고 비교해요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE tags(tag, pt);
-- INSERT INTO tags VALUES('Cat',3);
-- INSERT INTO tags VALUES('cat',3);
-- INSERT INTO tags VALUES('CAT',5);
-- INSERT INTO tags VALUES('Dog',4);
-- INSERT INTO tags VALUES(NULL,5);
SELECT COUNT(DISTINCT tag) AS a,
  COUNT(DISTINCT tag COLLATE NOCASE)
  AS b FROM tags;
SELECT SUM(pt), SUM(DISTINCT pt),
  COUNT(DISTINCT pt) FROM tags;`,trace:["`COUNT(DISTINCT tag)` → NULL은 빼고, Cat·cat·CAT·Dog는 모두 다른 글자라 **4**","`COLLATE NOCASE` → 대소문자를 무시하면 cat과 dog 두 가지 → **2**","`SUM(pt)` → 3 + 3 + 5 + 4 + 5 = **20**. `SUM(DISTINCT pt)` → 서로 다른 3, 5, 4만 더해 **12**","`COUNT(DISTINCT pt)` → 3·5·4 세 가지 → **3**"],output:`a | b
4 | 2

SUM(pt) | SUM(DISTINCT pt) | COUNT(DISTINCT pt)
20 | 12 | 3
`,mistake:"DISTINCT가 행 전체가 같을 때만 줄인다고 생각하기. `SUM(DISTINCT pt)`는 tag가 달라도 pt 값이 같으면 한 번만 더해요.",in_code:"기록 표에서 `COUNT(*)`는 기록 수, `COUNT(DISTINCT 사람 열)`은 서로 다른 사람 수라서, 보고서 코드에서 둘을 나란히 계산하는 줄을 자주 봐요. `COLLATE NOCASE`는 SQLite 표기이고, MySQL·SQL Server는 보통 처음부터 대소문자를 구별하지 않아 'Cat'과 'cat'을 같은 값으로 봐요."},{type:`example`,id:`theory-sql-aggregation-ex3`,kind:`choice`,title:`도장 찍은 가게 수`,prompt:`아래 SQL의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE stamp(kid, shop);
-- INSERT INTO stamp VALUES(1,'빵');
-- INSERT INTO stamp VALUES(1,'빵');
-- INSERT INTO stamp VALUES(2,'꽃');
-- INSERT INTO stamp VALUES(2,NULL);
SELECT COUNT(shop),
  COUNT(DISTINCT shop),
  COUNT(DISTINCT kid) FROM stamp;`,output:`COUNT(shop) | COUNT(DISTINCT shop) | COUNT(DISTINCT kid)
3 | 2 | 2
`,choices:[`(3, 2, 2)`,`(4, 3, 2)`,`(3, 3, 2)`,`(3, 2, 4)`],answer:`(3, 2, 2)`,feedback:{"(4, 3, 2)":`COUNT(shop)과 COUNT(DISTINCT shop)이 NULL도 값 하나로 센다고 생각했나요?`,"(3, 3, 2)":`COUNT(DISTINCT shop)이 NULL을 서로 다른 값 하나로 센다고 생각했나요?`,"(3, 2, 4)":`COUNT(DISTINCT kid)가 서로 다른 아이 수가 아니라 행 수를 센다고 생각했나요?`},explanation:`shop 값은 빵, 빵, 꽃, NULL이라 COUNT(shop)은 NULL을 뺀 3이고, 서로 다른 값은 빵과 꽃 두 가지예요. kid는 1과 2 두 가지라 COUNT(DISTINCT kid)는 2예요.`,card:`distinct`},{type:`explain`,id:`case-count`,title:`CASE로 조건에 맞는 행 세기`,body:"CASE는 행마다 값을 만들고, 집계 함수는 그 값들을 모아 계산해요. `SUM(CASE WHEN 조건 THEN 1 ELSE 0 END)`는 맞는 행에 1, 아닌 행에 0을 주고 더해 맞는 행 수를 세고, SQLite에서는 비교식 자체가 1이나 0이라 `SUM(m >= 20)`도 같아요. COUNT는 참의 개수가 아니라 NULL이 아닌 값의 개수라 0도 세요. ELSE를 빼면 맞지 않는 행은 NULL이 되어 COUNT·SUM·AVG에서 모두 빠져요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE plays(id, m);
-- INSERT INTO plays VALUES(1,10);
-- INSERT INTO plays VALUES(2,40);
-- INSERT INTO plays VALUES(3,20);
SELECT SUM(m >= 20) AS a,
  COUNT(m >= 20) AS b,
  COUNT(CASE WHEN m >= 20
    THEN 1 END) AS c
FROM plays;`,trace:["`m >= 20` → 행마다 0, 1, 1. `CASE WHEN m >= 20 THEN 1 ELSE 0 END`도 똑같이 0, 1, 1이에요","`SUM(m >= 20)` → 1만 더해져 맞는 행 수 **2**","`COUNT(m >= 20)` → 0도 NULL이 아닌 값이라 세어 **3**","`COUNT(CASE WHEN m >= 20 THEN 1 END)` → ELSE가 없어 첫 행은 NULL, 1인 두 행만 세어 **2**"],output:`a | b | c
2 | 3 | 2
`,mistake:"COUNT가 조건이 참인 행만 센다고 생각하기. `COUNT(m >= 20)`이나 `COUNT(CASE … ELSE 0 END)`는 0도 세어 모든 행 수가 돼요.",in_code:"AI가 만든 보고서 쿼리에서 `SUM(CASE WHEN 상태 = '완료' THEN 1 ELSE 0 END) AS 완료_수`처럼 조건별 건수를 한 SELECT에 나란히 세는 줄을 자주 봐요."},{type:`example`,id:`theory-sql-aggregation-ex4`,kind:`choice`,title:`30분이 넘은 운동`,prompt:`아래 SQL의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE laps(id, m);
-- INSERT INTO laps VALUES(1,45);
-- INSERT INTO laps VALUES(2,20);
-- INSERT INTO laps VALUES(3,35);
-- INSERT INTO laps VALUES(4,10);
SELECT COUNT(CASE WHEN m > 30
  THEN 'Y' ELSE 'N' END) AS a,
  SUM(CASE WHEN m > 30
  THEN 1 END) AS b FROM laps;`,output:`a | b
4 | 2
`,choices:[`(4, 2)`,`(2, 2)`,`(4, 4)`,`(4, NULL)`],answer:`(4, 2)`,feedback:{"(2, 2)":`COUNT가 'Y'가 된 행만 센다고 생각했나요?`,"(4, 4)":`ELSE가 없는 CASE도 맞지 않는 행에 1을 준다고 생각했나요?`,"(4, NULL)":`ELSE 없는 CASE가 NULL을 만들면 SUM 전체가 NULL이 된다고 생각했나요?`},explanation:`첫 CASE는 행마다 'Y'나 'N'을 만들어 NULL이 없으니 COUNT는 네 행을 모두 세어 4예요. 둘째 CASE는 ELSE가 없어 30분을 넘는 두 행만 1이고 나머지는 NULL이라, SUM은 NULL을 빼고 1 + 1 = 2예요.`,card:`case-count`},{type:`explain`,id:`division`,title:`정수 나눗셈과 ROUND`,body:"SQLite에서 정수끼리 나누면 소수 부분을 버려서 `7 / 2`는 3이에요. 한쪽이 소수면 결과도 소수라, 나누기 전에 `1.0 *`을 곱하면 3.5가 되지만 나눈 뒤에 곱하면 이미 버려진 소수는 돌아오지 않아요. `ROUND(값, 자릿수)`는 소수 그 자리까지 반올림해요. COUNT와 정수 열의 SUM도 정수라서, 비율을 구할 때 이 규칙을 자주 만나요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE shots(goal);
-- INSERT INTO shots VALUES(1),(1);
-- INSERT INTO shots VALUES(0);
SELECT 7 / 2, 7 / 2 * 1.0,
  1.0 * 7 / 2, ROUND(2.0 / 3, 2);
SELECT SUM(goal) * 100 / COUNT(*)
FROM shots;`,trace:["`-- INSERT INTO shots VALUES(1),(1);` → 괄호 하나가 한 행이라, goal이 1인 행 두 개를 한 번에 넣어요","`7 / 2` → 정수끼리라 소수를 버려 **3**","`7 / 2 * 1.0` → 먼저 3이 된 뒤 곱해 **3.0**. 버려진 0.5는 돌아오지 않아요","`1.0 * 7 / 2` → 7.0이 먼저 소수가 되어 **3.5**. `ROUND(2.0 / 3, 2)` → **0.67**","`SUM(goal) * 100 / COUNT(*)` → 200 / 3을 정수로 나눠 **66**"],output:`7 / 2 | 7 / 2 * 1.0 | 1.0 * 7 / 2 | ROUND(2.0 / 3, 2)
3 | 3.0 | 3.5 | 0.67

SUM(goal) * 100 / COUNT(*)
66
`,mistake:`결과에 1.0을 곱하면 소수가 살아난다고 생각하기. 소수로 바꾸는 곱셈은 나누기 전에 해요.`,in_code:"AI가 쓴 비율 계산에서 `100.0 * SUM(x) / COUNT(*)`나 `CAST(SUM(x) AS REAL) / COUNT(*)`처럼 나누기 전에 소수로 바꾸는 줄을 자주 봐요. `CAST(값 AS REAL)`은 값을 소수로 바꿔요."},{type:`example`,id:`theory-sql-aggregation-ex5`,kind:`choice`,title:`찬성 비율 두 가지`,prompt:`아래 SQL의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE polls(yes, total);
-- INSERT INTO polls VALUES(3,7);
SELECT yes / total * 100,
  100 * yes / total FROM polls;`,output:`yes / total * 100 | 100 * yes / total
0 | 42
`,choices:[`(0, 42)`,`(42, 42)`,`(0, 0)`,`(0, 43)`],answer:`(0, 42)`,feedback:{"(42, 42)":`곱셈과 나눗셈의 순서를 바꿔도 결과가 같다고 생각했나요?`,"(0, 0)":`100을 먼저 곱한 식도 결국 정수 나눗셈이라 0이 된다고 생각했나요?`,"(0, 43)":`정수 나눗셈이 소수 부분을 버리지 않고 반올림한다고 생각했나요?`},explanation:`왼쪽부터 계산해 yes / total = 3 / 7은 정수끼리라 0이 되고, 100을 곱해도 0이에요. 100 * yes = 300을 먼저 만든 뒤 7로 나누면 42.85…의 소수를 버려 42예요.`,card:`division`},{type:`explain`,id:`group-by`,title:`GROUP BY로 묶어서 집계하기`,body:"`GROUP BY 열`은 그 열 값이 같은 행끼리 한 묶음(그룹)으로 모아, 묶음마다 결과 한 행을 만들어요. SELECT의 집계 함수는 표 전체가 아니라 묶음마다 따로 계산돼요. 그래서 묶을 행이 하나도 없으면 묶음도 없어, GROUP BY가 없을 때와 달리 결과 행이 하나도 나오지 않아요. SELECT에는 보통 묶은 열과 집계 결과를 함께 적고, 묶음 순서가 중요하면 ORDER BY로 정렬해요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE buy(day, won);
-- INSERT INTO buy VALUES('월',500);
-- INSERT INTO buy VALUES('화',300);
-- INSERT INTO buy VALUES('월',200);
SELECT day, COUNT(*) AS n,
  SUM(won) AS total FROM buy
GROUP BY day ORDER BY day;`,trace:["`GROUP BY day` → 월 묶음(500, 200)과 화 묶음(300)을 만들어요","`COUNT(*) AS n, SUM(won) AS total` → 묶음마다 세고 더해 월은 **2, 700**, 화는 **1, 300**",`세 행이던 표가 묶음 수만큼 두 행으로 줄어요`],output:`day | n | total
월 | 2 | 700
화 | 1 | 300
`,mistake:`GROUP BY 뒤에도 원래 행이 그대로 남는다고 생각하기. 묶음 하나가 결과 한 행이 돼요.`,in_code:"AI가 쓴 집계 코드에서 `GROUP BY 날짜`로 날짜별 합계를 내는 모양을 가장 자주 봐요. SELECT에 묶지 않은 열을 집계 없이 적으면 SQLite는 묶음 안 아무 행의 값이나 보여 주니 조심해요."},{type:`explain`,id:`having`,title:`WHERE는 묶기 전, HAVING은 묶은 뒤`,body:"WHERE는 묶기 전에 행을 하나하나 거르고, `HAVING 조건`은 묶은 뒤 묶음의 집계 결과를 걸러요. 그래서 `SUM(qty) >= 6`처럼 집계한 값에 거는 조건은 HAVING에 써요. 쓰는 순서는 `SELECT` → `FROM` → `WHERE` → `GROUP BY` → `HAVING` → `ORDER BY` → `LIMIT`이고, ORDER BY에도 집계 결과를 쓸 수 있어요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE buy(day, qty, ok);
-- INSERT INTO buy VALUES('월',5,1);
-- INSERT INTO buy VALUES('화',3,1);
-- INSERT INTO buy VALUES('월',2,0);
-- INSERT INTO buy VALUES('화',4,1);
-- INSERT INTO buy VALUES('수',6,1);
SELECT day, SUM(qty) FROM buy
WHERE ok = 1 GROUP BY day
HAVING SUM(qty) >= 6
ORDER BY SUM(qty) DESC;`,trace:["`WHERE ok = 1` → 묶기 전에 취소된(ok가 0인) 월요일 qty 2 행 하나를 빼요","`GROUP BY day` → 남은 행을 묶어 월 5, 화 7, 수 6","`HAVING SUM(qty) >= 6` → 화·수만 남아요. WHERE가 없었다면 월도 7이라 남았을 거예요","`ORDER BY SUM(qty) DESC` → 합계가 큰 순서로 → **화 | 7**, **수 | 6**"],output:`day | SUM(qty)
화 | 7
수 | 6
`,mistake:"집계 조건을 WHERE에 쓰기. `WHERE SUM(qty) >= 6`은 묶기 전이라 합계가 없어 `misuse of aggregate`로 시작하는 오류가 나요.",in_code:"중복 데이터를 찾는 코드에서 `GROUP BY email HAVING COUNT(*) > 1`처럼 두 번 이상 나온 값을 고르는 줄을 자주 봐요."},{type:`example`,id:`theory-sql-aggregation-ex6`,kind:`choice`,title:`자전거를 두 번 이상 탄 아이`,prompt:`아래 SQL의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE rides(kid, km);
-- INSERT INTO rides VALUES('민',3);
-- INSERT INTO rides VALUES('민',9);
-- INSERT INTO rides VALUES('준',4);
-- INSERT INTO rides VALUES('준',5);
-- INSERT INTO rides VALUES('윤',8);
SELECT kid FROM rides
WHERE km > 3 GROUP BY kid
HAVING COUNT(*) >= 2 ORDER BY kid;`,output:`kid
준
`,choices:[`['준']`,`['민', '준']`,`['민', '윤', '준']`,`['준', '준']`],answer:`['준']`,feedback:{"['민', '준']":`HAVING의 COUNT(*)가 WHERE로 거르기 전의 행 수를 센다고 생각했나요?`,"['민', '윤', '준']":`HAVING COUNT(*) >= 2가 묶음마다가 아니라 남은 행 전체 수를 본다고 생각했나요?`,"['준', '준']":`GROUP BY 뒤에도 묶음 안의 행이 따로따로 남는다고 생각했나요?`},explanation:`WHERE km > 3이 먼저 민의 3km 기록을 빼서 민 1개, 준 2개, 윤 1개가 남아요. 묶은 뒤 HAVING이 기록이 2개 이상인 묶음만 남겨 ['준']이에요.`,card:`having`},{type:`explain`,id:`left-count`,title:`짝 없는 행과 COUNT`,body:"`FROM 왼쪽 LEFT JOIN 오른쪽 ON 조건`은 왼쪽 행마다 조건이 맞는 오른쪽 행을 이어 붙여요(표 잇기는 다음 강의에서 자세히 배워요). 맞는 오른쪽 행이 없어도 왼쪽 행은 남고, 오른쪽 열은 NULL로 채워져요. 이 NULL 행도 한 행이라 묶음의 `COUNT(*)`는 1이지만, `COUNT(오른쪽.열)`은 NULL을 빼서 0이에요. `kids k`의 k는 표에 붙인 별명이고(AS 생략), `b.kid IS NOT NULL` 같은 1·0 값을 SUM으로 더해도 짝을 셀 수 있어요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE kids(id, name);
-- INSERT INTO kids VALUES(1,'민');
-- INSERT INTO kids VALUES(2,'준');
-- CREATE TABLE books(kid, title);
-- INSERT INTO books VALUES(1,'해');
-- INSERT INTO books VALUES(1,'달');
SELECT k.name, b.title FROM kids k
LEFT JOIN books b ON b.kid = k.id
ORDER BY k.id, b.title;
SELECT k.name, COUNT(*) AS n,
  COUNT(b.title) AS m FROM kids k
LEFT JOIN books b ON b.kid = k.id
GROUP BY k.id ORDER BY k.id;`,trace:["`LEFT JOIN books b ON b.kid = k.id` → 민은 책 두 권과 이어져 두 행이에요",`준은 짝인 책이 없지만 왼쪽 행이라 남고, title은 NULL → **준 | NULL**`,"`GROUP BY k.id` 뒤 `COUNT(*)` → 준의 묶음도 행이 하나라 **1**","`COUNT(b.title)` → NULL을 세지 않아 준은 **0**, 민은 **2**"],output:`name | title
민 | 달
민 | 해
준 | NULL

name | n | m
민 | 2 | 2
준 | 1 | 0
`,mistake:`짝 없는 행의 COUNT(*)가 0일 거라고 생각하기. NULL로 채운 행도 한 행이라 1이에요. 짝의 수는 오른쪽 표에서 늘 값이 있는 열을 세요.`,in_code:"'회원별 글 수'처럼 0인 회원까지 보여야 하는 집계에서 `COUNT(*)`를 쓰면 글이 없는 회원이 1로 나와요. `COUNT(p.id)`처럼 오른쪽 표의 열을 세야 해요."},{type:`explain`,id:`running`,title:`행을 줄이지 않는 누적 합계`,body:"집계 함수 뒤에 `OVER (…)`를 붙이면 행을 하나로 줄이지 않고 행마다 값을 계산해요(윈도 함수라고 해요). `SUM(열) OVER (ORDER BY 기준 ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`는 기준 순서로 줄 세운 뒤 첫 행부터 지금 행까지 더해 누적 합계를 만들어요. OVER 안의 ORDER BY는 계산 순서만 정하고, 보여 주는 순서는 맨 끝의 ORDER BY가 정해요. 윈도 함수는 뒤의 강의에서 더 배워요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE saves(week, won);
-- INSERT INTO saves VALUES(2,300);
-- INSERT INTO saves VALUES(1,500);
-- INSERT INTO saves VALUES(3,200);
SELECT week, SUM(won) OVER (
  ORDER BY week ROWS BETWEEN
  UNBOUNDED PRECEDING AND
  CURRENT ROW) AS total
FROM saves ORDER BY week;
SELECT SUM(won) FROM saves;`,trace:["`OVER (ORDER BY week …)` → 넣은 순서(2, 1, 3주)가 아니라 week 순서로 줄을 세워요","`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` → 첫 행부터 지금 행까지 더해 **500, 800, 1000**","`FROM saves ORDER BY week;` → 세 행이 모두 남고 week 순서로 보여요","`SELECT SUM(won) FROM saves;` → OVER가 없으면 전체를 한 행으로 줄여 **1000**"],output:`week | total
1 | 500
2 | 800
3 | 1000

SUM(won)
1000
`,mistake:`OVER를 붙인 SUM도 결과를 한 행으로 줄인다고 생각하기. 윈도 함수는 원래 행을 모두 남기고 행마다 값을 붙여요.`,in_code:"AI가 쓴 매출 보고서에서 `SUM(금액) OVER (ORDER BY 날짜)`로 날짜별 누적 매출을 붙이는 줄을 자주 봐요. ROWS 부분을 빼면 같은 날짜가 여러 행일 때 결과가 달라지는데, 윈도 함수 강의에서 다뤄요."},{type:`summary`,points:["집계 함수는 여러 행을 값 하나로 줄여요. `COUNT(*)`는 행을 세고, `COUNT(열)`·SUM·AVG·MIN·MAX는 NULL을 빼고 열마다 따로 계산해요.","행이 없으면 COUNT는 0, SUM·MAX는 NULL이에요. 0이 필요하면 `COALESCE(SUM(x), 0)`처럼 바깥에서 바꿔요.","`DISTINCT`는 괄호 안 값의 중복을 없애고 `COLLATE NOCASE`는 영어 대소문자를 무시해요. COUNT는 0도 세고 NULL만 빼요.","정수끼리 나누면 소수를 버려요. 나누기 전에 `1.0 *`을 곱하고 `ROUND`로 자릿수를 맞춰요.","`GROUP BY`는 묶음마다 한 행을 만들고, WHERE는 묶기 전, HAVING은 묶은 뒤 걸러요. LEFT JOIN의 짝 없는 행은 `COUNT(*)` 1, `COUNT(오른쪽.열)` 0이에요.","`SUM(…) OVER (ORDER BY …)`는 행을 남긴 채 누적 합계를 붙여요."]}],covers:{"sql-count-01":[`agg-null`],"sql-having-01":[`having`,`group-by`],"sql-having-02":[`having`,`distinct`,`group-by`],"sql-count-02":[`case-count`],"sql-empty-sum-20261018":[`empty`],"sql-null-count-20261018":[`empty`,`agg-null`],"sql-refund-average-20261018":[`agg-null`],"sql-distinct-sum-20261018":[`distinct`,`agg-null`],"sql-division-rate-20261020":[`division`],"sql-running-window-20261023":[`running`],"sql-distinct-nocase-20261025":[`distinct`],"sql-agg-transfer-02":[`having`,`group-by`],"sql-conditional-average-20261019":[`case-count`,`agg-null`,`division`],"sql-unique-visitors-20261020":[`distinct`,`agg-null`],"sql-case-counts-20261021":[`case-count`],"sql-group-clauses-form-01":[`having`],"sql-outer-count-form-01":[`left-count`,`case-count`],"sql-minmax-01":[`agg-null`]}},{id:`theory-sql-joins`,version:2,concept_id:`sql-joins`,title:`테이블 연결`,minutes:16,steps:[{type:`explain`,id:`pairs`,title:`JOIN으로 두 표의 행 잇기`,body:"`FROM a, b`처럼 표를 쉼표로 적으면 a의 모든 행과 b의 모든 행을 하나씩 짝지어, a 행 수 × b 행 수만큼 결과를 만들어요(CROSS JOIN). `FROM a JOIN b ON 조건`은 그 짝 중 ON 조건이 참인 짝만 남겨요(INNER JOIN이라고도 해요). 그래서 짝이 없는 행은 사라지고, 짝이 여럿인 행은 그만큼 여러 행이 돼요. `kids k`처럼 표 뒤에 별명을 붙이고, `k.id`처럼 '별명.열'로 어느 표의 열인지 밝혀요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE kids(id, name);
-- INSERT INTO kids VALUES(1,'민');
-- INSERT INTO kids VALUES(2,'준');
-- INSERT INTO kids VALUES(3,'윤');
-- CREATE TABLE books(kid, title);
-- INSERT INTO books VALUES(1,'해');
-- INSERT INTO books VALUES(1,'달');
-- INSERT INTO books VALUES(2,'별');
SELECT COUNT(*) FROM kids, books;
SELECT k.name, b.title FROM kids k
JOIN books b ON b.kid = k.id
ORDER BY k.id, b.title;`,trace:["`FROM kids, books` → 아이 3명 × 책 3권, 조건 없이 모든 짝 → **9**","`JOIN books b ON b.kid = k.id` → 9개 짝 중 b.kid와 k.id가 같은 짝만 남겨요",`민은 책 두 권과 짝이라 두 행, 준은 한 행 → **민 | 달**, **민 | 해**, **준 | 별**`,`윤은 짝인 책이 없어 결과에서 사라져요`],output:`COUNT(*)
9

name | title
민 | 달
민 | 해
준 | 별
`,mistake:`JOIN 결과의 행 수가 왼쪽 표의 행 수와 같다고 생각하기. 짝이 여럿이면 행이 늘고, 짝이 없으면 행이 사라져요.`,in_code:"AI가 쓴 조회는 `FROM posts p JOIN users u ON u.id = p.user_id`처럼 표마다 한 글자 별명을 붙이는 모양이 많아요. ON을 빠뜨리고 쉼표로 이으면 오류 없이 모든 짝이 생겨 행이 곱으로 불어나요."},{type:`example`,id:`theory-sql-joins-ex1`,kind:`choice`,title:`장난감과 고양이`,prompt:`아래 SQL의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE cats(id, name);
-- INSERT INTO cats VALUES(1,'솜');
-- INSERT INTO cats VALUES(2,'밤');
-- INSERT INTO cats VALUES(3,'콩');
-- CREATE TABLE toys(cat, toy);
-- INSERT INTO toys VALUES(2,'공');
-- INSERT INTO toys VALUES(2,'줄');
-- INSERT INTO toys VALUES(1,'쥐');
SELECT c.name FROM cats c
JOIN toys t ON t.cat = c.id
ORDER BY c.name;`,output:`name
밤
밤
솜
`,choices:[`['밤', '밤', '솜']`,`['밤', '솜']`,`['밤', '밤', '솜', '콩']`,`['밤', '솜', '콩']`],answer:`['밤', '밤', '솜']`,feedback:{"['밤', '솜']":`짝이 여러 개여도 왼쪽 행은 한 번만 나온다고 생각했나요?`,"['밤', '밤', '솜', '콩']":`JOIN도 짝이 없는 고양이를 결과에 남긴다고 생각했나요?`,"['밤', '솜', '콩']":`JOIN이 고양이 표의 행을 그대로 한 번씩 보여 준다고 생각했나요?`},explanation:`JOIN은 ON 조건이 맞는 짝만 남겨요. 밤(2번)은 장난감 두 개와 짝이라 두 행, 솜(1번)은 한 행이고, 장난감이 없는 콩은 사라져요.`,card:`pairs`},{type:`explain`,id:`left`,title:`LEFT JOIN은 왼쪽 행을 모두 남겨요`,body:"`LEFT JOIN`은 왼쪽 표의 행을 모두 남겨요. 짝이 있으면 JOIN처럼 이어 붙이고 짝이 여럿이면 그만큼 행이 늘지만, 짝이 없으면 오른쪽 열을 모두 NULL로 채운 한 행을 만들어요. 그래서 연결한 뒤 `WHERE 오른쪽.키 IS NULL`로 거르면 짝 없는 왼쪽 행만 남아요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE kids(id);
-- INSERT INTO kids VALUES(1),(2);
-- INSERT INTO kids VALUES(3);
-- CREATE TABLE books(kid, title);
-- INSERT INTO books VALUES(1,'해');
-- INSERT INTO books VALUES(1,'달');
-- INSERT INTO books VALUES(3,'별');
SELECT k.id, b.title FROM kids k
LEFT JOIN books b ON b.kid = k.id
ORDER BY k.id, b.title;
SELECT k.id FROM kids k
LEFT JOIN books b ON b.kid = k.id
WHERE b.kid IS NULL;`,trace:["`LEFT JOIN books b ON b.kid = k.id` → 1번은 책 두 권과 이어져 두 행, 3번은 한 행이에요",`2번은 짝이 없지만 왼쪽 행이라 남고 title은 NULL → **2 | NULL**`,"`WHERE b.kid IS NULL` → 연결이 끝난 뒤 오른쪽이 NULL인 행만 → **[2]**"],output:`id | title
1 | 달
1 | 해
2 | NULL
3 | 별

id
2
`,mistake:`짝 없는 행을 찾을 때 아무 오른쪽 열이나 IS NULL로 검사하기. 짝이 있어도 비어 있을 수 있는 열을 고르면 짝 있는 행이 섞여요. 연결 키처럼 짝이 있으면 늘 값이 있는 열을 써요.`,in_code:"'한 번도 로그인하지 않은 회원'처럼 짝 없는 행을 찾는 코드에서 `LEFT JOIN … WHERE 오른쪽.id IS NULL` 모양을 자주 봐요. 1강의 NOT EXISTS와 같은 결과를 내는 다른 표현이에요."},{type:`explain`,id:`full`,title:`FULL OUTER JOIN은 양쪽을 모두 남겨요`,body:"`FULL OUTER JOIN`은 양쪽 표의 행을 모두 남겨요. 짝이 맞는 행은 하나로 이어지고, 짝 없는 왼쪽 행은 오른쪽 열이, 짝 없는 오른쪽 행은 왼쪽 열이 NULL로 채워져요. `RIGHT JOIN`은 LEFT JOIN을 거꾸로 해서 오른쪽 표의 행을 모두 남기고, 두 연결 모두 SQLite 3.39(2022년)부터 쓸 수 있어요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE jan(no);
-- INSERT INTO jan VALUES(1),(2);
-- INSERT INTO jan VALUES(3);
-- CREATE TABLE feb(no);
-- INSERT INTO feb VALUES(2),(5);
SELECT j.no AS j, f.no AS f
FROM jan j FULL OUTER JOIN feb f
ON f.no = j.no
ORDER BY COALESCE(j.no, f.no);`,trace:["`FULL OUTER JOIN feb f ON f.no = j.no` → 2번은 양쪽에 있어 한 행으로 이어져요 → **2 | 2**",`jan에만 있는 1·3번은 f가 NULL, feb에만 있는 5번은 j가 NULL인 행으로 남아 모두 네 행이에요`,"`ORDER BY COALESCE(j.no, f.no)` → 비어 있지 않은 번호로 정렬해 1, 2, 3, 5 순서예요"],output:`j | f
1 | NULL
2 | 2
3 | NULL
NULL | 5
`,mistake:`FULL OUTER JOIN의 행 수가 두 표의 행 수를 더한 값이라고 생각하기. 짝이 맞는 행은 하나로 합쳐져 3 + 2 = 5가 아니라 4행이에요.`,in_code:"두 명단을 맞춰 보며 한쪽에만 있는 항목을 찾는 코드에서 `FULL OUTER JOIN` 뒤에 `WHERE a.id IS NULL OR b.id IS NULL`을 붙인 모양을 봐요."},{type:`explain`,id:`on-where`,title:`조건을 ON에 둘까, WHERE에 둘까`,body:"LEFT JOIN의 ON 조건은 '어떤 오른쪽 행을 짝으로 볼지'를 정해요. `ON b.kid = k.id AND b.done = 1`이면 done이 0인 책은 짝이 아니라서, 다 읽은 책이 없는 왼쪽 행도 남고 오른쪽 열이 NULL이 돼요. WHERE는 연결이 끝난 결과를 거르므로, 오른쪽 열에 거는 `WHERE b.done = 1`은 NULL 행까지 지워 LEFT JOIN을 JOIN처럼 만들어요. 왼쪽 행을 모두 지키려면 오른쪽 표의 조건은 ON에 둬요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE kids(id);
-- INSERT INTO kids VALUES(1),(2);
-- CREATE TABLE books(kid, done);
-- INSERT INTO books VALUES(1,1);
-- INSERT INTO books VALUES(1,0);
-- INSERT INTO books VALUES(2,0);
SELECT k.id, b.done FROM kids k
LEFT JOIN books b
ON b.kid = k.id AND b.done = 1;
SELECT k.id FROM kids k
LEFT JOIN books b ON b.kid = k.id
WHERE b.done = 1;`,trace:["`ON b.kid = k.id AND b.done = 1` → 다 읽은 책만 짝이에요. 1번은 그 책 한 권과 이어져 **1 | 1**","2번은 책이 있지만 다 읽은 책이 없어 왼쪽 행만 남아 **2 | NULL**. 여기에 `WHERE b.kid IS NULL`을 붙이면 2번만 남아요","`WHERE b.done = 1` → 먼저 모든 책과 이은 뒤 걸러요. 2번의 행은 done이 0이라 지워져 → **[1]**"],output:`id | done
1 | 1
2 | NULL

id
1
`,mistake:`LEFT JOIN을 썼으니 WHERE를 붙여도 왼쪽 행이 모두 남는다고 생각하기. 오른쪽 열에 건 WHERE 조건은 짝 없는 행을 지워요.`,in_code:`'모든 학생과 통과한 시험 수'처럼 0인 학생도 보여야 하는 코드에서는 시험 조건을 ON에 둬요. LEFT JOIN 뒤 WHERE에 오른쪽 표 조건이 있으면 사라진 행이 없는지 확인해 보세요.`},{type:`example`,id:`theory-sql-joins-ex2`,kind:`choice`,title:`통과 표시 붙이기`,prompt:`아래 SQL의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE kids(id);
-- INSERT INTO kids VALUES(1),(2);
-- INSERT INTO kids VALUES(3);
-- CREATE TABLE marks(kid, pass);
-- INSERT INTO marks VALUES(1,1);
-- INSERT INTO marks VALUES(2,0);
SELECT m.pass FROM kids k
LEFT JOIN marks m
ON m.kid = k.id AND m.pass = 1
ORDER BY k.id;`,output:`pass
1
NULL
NULL
`,choices:[`[1, NULL, NULL]`,`[1]`,`[1, 0, NULL]`,`[1, NULL]`],answer:`[1, NULL, NULL]`,feedback:{"[1]":`ON에 넣은 조건도 WHERE처럼 왼쪽 행을 지운다고 생각했나요?`,"[1, 0, NULL]":`ON의 m.pass = 1은 무시되고 kid만 같으면 짝이 된다고 생각했나요?`,"[1, NULL]":`짝 조건에 맞지 않는 행과 짝이 아예 없는 행 중 한쪽만 남는다고 생각했나요?`},explanation:`LEFT JOIN은 세 아이를 모두 남겨요. 1번은 pass가 1인 기록과 짝이라 1이고, 2번은 기록이 있지만 ON 조건에 맞지 않아, 3번은 기록이 없어 둘 다 pass가 NULL이에요.`,card:`on-where`},{type:`explain`,id:`left-count`,title:`LEFT JOIN 뒤에 짝 세기`,body:"2강에서 본 대로 LEFT JOIN이 남긴 짝 없는 행도 한 행이라, 묶음의 `COUNT(*)`는 1이고 `COUNT(오른쪽.열)`은 NULL을 빼서 0이에요. 그래서 `COUNT(*)`만으로는 짝이 하나인 행과 짝이 없는 행을 구별하지 못해요. 짝이 있는지는 `COUNT(b.kid) = 0`처럼 오른쪽 열의 COUNT로 판단해요. 집계 결과도 값이라 이렇게 비교하거나 CASE에 넣거나 서로 뺄 수 있어요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE kids(id);
-- INSERT INTO kids VALUES(1),(2);
-- INSERT INTO kids VALUES(3);
-- CREATE TABLE books(kid);
-- INSERT INTO books VALUES(1),(3);
-- INSERT INTO books VALUES(3);
SELECT k.id, COUNT(*) AS n,
  COUNT(b.kid) AS m,
  COUNT(b.kid) = 0 AS zero
FROM kids k LEFT JOIN books b
ON b.kid = k.id GROUP BY k.id
ORDER BY k.id;`,trace:["`LEFT JOIN … GROUP BY k.id` → 아이마다 이어진 행을 묶어요. 2번 묶음은 b.kid가 NULL인 한 행이에요","`COUNT(*) AS n` → 1번과 2번이 똑같이 **1**, 3번은 **2**","`COUNT(b.kid) AS m` → NULL을 빼고 세어 실제 책 수 **1, 0, 2**","`COUNT(b.kid) = 0 AS zero` → 책이 없는 2번만 참 → **0, 1, 0**"],output:`id | n | m | zero
1 | 1 | 1 | 0
2 | 1 | 0 | 1
3 | 2 | 2 | 0
`,mistake:"`COUNT(*) = 1`이면 짝이 없다고 판단하기. 책이 딱 한 권인 1번도 COUNT(*)가 1이라 구별되지 않아요.",in_code:"'활동 없는 회원 표시' 코드에서는 `COUNT(a.id) = 0`처럼 오른쪽 표에서 늘 값이 있는 열을 세요. COUNT(*)로 판단하면 활동이 하나인 회원과 없는 회원이 같은 값이 돼요."},{type:`example`,id:`theory-sql-joins-ex3`,kind:`choice`,title:`동아리별 행 수`,prompt:`아래 SQL의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE clubs(id);
-- INSERT INTO clubs VALUES(1),(2);
-- INSERT INTO clubs VALUES(3);
-- CREATE TABLE joins(club);
-- INSERT INTO joins VALUES(1),(1);
-- INSERT INTO joins VALUES(3);
SELECT COUNT(*) FROM clubs c
LEFT JOIN joins j ON j.club = c.id
GROUP BY c.id ORDER BY c.id;`,output:`COUNT(*)
2
1
1
`,choices:[`[2, 1, 1]`,`[2, 0, 1]`,`[2, 1]`,`[1, 1, 1]`],answer:`[2, 1, 1]`,feedback:{"[2, 0, 1]":`짝이 없는 2번 동아리는 COUNT(*)가 0이라고 생각했나요?`,"[2, 1]":`LEFT JOIN도 짝 없는 동아리를 결과에서 뺀다고 생각했나요?`,"[1, 1, 1]":`동아리마다 묶으면 COUNT(*)가 늘 1이라고 생각했나요?`},explanation:`1번 동아리는 가입 기록 두 건과 이어져 두 행, 3번은 한 행이에요. 기록이 없는 2번도 오른쪽이 NULL인 한 행으로 남아 COUNT(*)가 1이에요.`,card:`left-count`},{type:`explain`,id:`keys`,title:`여러 열로 잇기와 USING`,body:"번호가 묶음마다 1부터 다시 시작하면 번호만으로는 같은 대상인지 알 수 없어요. 그럴 땐 `ON a.x = b.x AND a.y = b.y`처럼 여러 열을 함께 비교해, 모두 참인 짝만 남겨요. 연결할 열 이름이 양쪽에서 같으면 `JOIN b USING (x, y)`로 줄여 쓸 수 있고, 이때 `SELECT *`에 그 열은 한 번만 나와요. ON으로 이으면 `SELECT *`에 그 열이 양쪽에서 두 번 나와요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE seats(room, no);
-- INSERT INTO seats VALUES('가',1);
-- INSERT INTO seats VALUES('나',1);
-- CREATE TABLE res(room, no, kid);
-- INSERT INTO res VALUES('가',1,7);
SELECT COUNT(*) FROM seats s
JOIN res r ON r.no = s.no;
SELECT * FROM seats
JOIN res USING (room, no);`,trace:["`ON r.no = s.no` → 번호만 비교하면 가·나 두 방의 1번 좌석이 모두 예약 한 건과 짝이 돼 **2**","`USING (room, no)` → 방과 번호가 모두 같은 짝만 남아 가 방 1번만 이어져요","`SELECT *` → USING으로 이은 room·no는 한 번만, 그 뒤에 res의 나머지 열 kid → **가 | 1 | 7**"],output:`COUNT(*)
2

room | no | kid
가 | 1 | 7
`,mistake:`번호 열 하나만 같으면 같은 대상이라고 생각하기. 방마다 1번이 있으면 번호만으로 이을 때 다른 방의 좌석까지 짝이 돼 행이 늘어요.`,in_code:"여러 지점의 데이터를 합친 표에서는 `ON a.branch = b.branch AND a.code = b.code`처럼 묶음 열과 번호 열을 함께 거는 코드를 자주 봐요."},{type:`explain`,id:`self`,title:`같은 표끼리 잇기`,body:"같은 표를 `FROM t x JOIN t y`처럼 두 번 적으면(셀프 조인), 두 별명이 각각 그 표의 행을 하나씩 골라 짝을 만들어요. 같은 값 조건만 걸면 자기 자신과의 짝 (1, 1)과 순서만 바뀐 짝 (3, 1)도 생겨요. `x.id < y.id`를 더하면 서로 다른 두 행의 짝을 한 번씩만 남겨요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE band(id, part);
-- INSERT INTO band VALUES(1,'북');
-- INSERT INTO band VALUES(2,'종');
-- INSERT INTO band VALUES(3,'북');
-- INSERT INTO band VALUES(4,'북');
SELECT COUNT(*) FROM band x
JOIN band y ON x.part = y.part;
SELECT x.id, y.id FROM band x
JOIN band y ON x.part = y.part
WHERE x.id < y.id
ORDER BY x.id, y.id;`,trace:["`FROM band x JOIN band y ON x.part = y.part` → 북 세 명끼리 3 × 3 = 9쌍(자기 자신 포함), 종은 자기 자신과 1쌍 → **10**","`WHERE x.id < y.id` → 자기 자신과의 짝과 순서만 바뀐 짝을 빼요","`ORDER BY x.id, y.id` → **(1, 3)**, **(1, 4)**, **(3, 4)** 세 쌍"],output:`COUNT(*)
10

id | id
1 | 3
1 | 4
3 | 4
`,mistake:`같은 표끼리 이으면 자기 자신과는 짝이 되지 않는다고 생각하기. x와 y는 따로 행을 고르므로 (1, 1)도 짝이 되고, (1, 3)과 (3, 1)도 따로 생겨요.`,in_code:"같은 반 학생 쌍이나 같은 날 예약 두 건을 비교하는 코드에서 셀프 조인을 봐요. `x.id <> y.id`를 쓰면 순서만 바뀐 쌍이 두 번씩 나와요."},{type:`explain`,id:`range`,title:`구간으로 잇기: 시작은 넣고 끝은 빼기`,body:"ON에는 `=`뿐 아니라 `>=`, `<` 같은 비교도 쓸 수 있어서, 값이 어느 구간에 드는지로 두 표를 이을 수 있어요. 구간은 `값 >= 시작 AND 값 < 끝`처럼 시작은 넣고 끝은 빼는 모양(반열린 구간)을 많이 써요. 그러면 한 구간의 끝이 다음 구간의 시작과 같아도, 경계값은 다음 구간 한 곳에만 이어져요. `BETWEEN a AND b`는 `>= a AND <= b`라 양 끝을 모두 넣어서, 경계값이 두 구간에 다 이어져요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE fees(lo, hi, won);
-- INSERT INTO fees VALUES(0,8,0);
-- INSERT INTO fees VALUES(8,65,900);
-- CREATE TABLE kids(name, age);
-- INSERT INTO kids VALUES('민',5);
-- INSERT INTO kids VALUES('준',8);
SELECT k.name, f.won FROM kids k
JOIN fees f ON k.age >= f.lo
  AND k.age < f.hi ORDER BY k.name;
SELECT COUNT(*) FROM kids k
JOIN fees f ON k.age BETWEEN f.lo
  AND f.hi;`,trace:["`k.age >= f.lo AND k.age < f.hi` → 민(5살)은 0 이상 8 미만 구간 → **민 | 0**",`준(8살)은 첫 구간의 끝 8이 빠지고, 8 이상 65 미만 구간 → **준 | 900**`,"`BETWEEN f.lo AND f.hi` → 양 끝을 넣어 준이 두 구간에 다 이어져 **3**"],output:`name | won
민 | 0
준 | 900

COUNT(*)
3
`,mistake:"BETWEEN이 끝값을 빼는 구간이라고 생각하기. `BETWEEN a AND b`는 a와 b를 모두 포함해요.",in_code:"요금표·등급표처럼 구간이 이어진 표를 붙이는 코드에서 `ON x >= t.start AND x < t.end`를 자주 봐요."},{type:`example`,id:`theory-sql-joins-ex4`,kind:`choice`,title:`점수에 등급 붙이기`,prompt:`아래 SQL의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE lvl(lo, hi, g);
-- INSERT INTO lvl VALUES(0,6,'하');
-- INSERT INTO lvl VALUES(6,8,'중');
-- INSERT INTO lvl VALUES(8,11,'상');
-- CREATE TABLE pts(s);
-- INSERT INTO pts VALUES(8),(4);
-- INSERT INTO pts VALUES(9),(6);
SELECT l.g FROM pts p JOIN lvl l
ON p.s >= l.lo AND p.s < l.hi
ORDER BY p.s;`,output:`g
하
중
상
상
`,choices:[`['하', '중', '상', '상']`,`['하', '하', '중', '상']`,`['하', '하', '중', '중', '상', '상']`,`['하', '상']`],answer:`['하', '중', '상', '상']`,feedback:{"['하', '하', '중', '상']":`p.s >= l.lo가 시작값을 빼고 p.s < l.hi가 끝값을 넣는다고 생각했나요?`,"['하', '하', '중', '중', '상', '상']":`구간의 시작과 끝이 모두 들어가 경계 점수가 두 구간에 이어진다고 생각했나요?`,"['하', '상']":`경계값과 같은 점수는 어느 구간에도 들지 않는다고 생각했나요?`},explanation:`구간은 시작을 넣고 끝을 빼서 4점은 하, 6점은 6 이상 8 미만인 중, 8점과 9점은 8 이상 11 미만인 상이에요. 경계 점수 6과 8은 다음 구간 한 곳에만 이어져요.`,card:`range`},{type:`explain`,id:`fanout`,title:`행이 불어나는 연결과 미리 묶기`,body:"JOIN에서 한 행이 짝을 여러 개 가지면 그 행의 값이 짝 수만큼 반복돼요. 이 결과에 SUM을 하면 같은 값이 여러 번 더해져 합계가 부풀고, 여행 하나에 주유 기록이 여러 행 딸린 fuel 같은 표(상세 표)를 두 개 이으면 짝의 수끼리 곱해져 더 불어나요. 그래서 상세 표는 `WITH` 안에서 먼저 GROUP BY로 한 행씩 묶은 뒤 이어요. `SUM(DISTINCT …)`는 우연히 값이 같은 다른 행까지 한 번으로 줄여 버려 해결책이 아니에요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE trips(id, km);
-- INSERT INTO trips VALUES(1,30);
-- CREATE TABLE fuel(trip, won);
-- INSERT INTO fuel VALUES(1,5);
-- INSERT INTO fuel VALUES(1,7);
SELECT t.km, f.won FROM trips t
JOIN fuel f ON f.trip = t.id;
WITH g AS (SELECT trip, SUM(won)
  AS w FROM fuel GROUP BY trip)
SELECT t.km, g.w FROM trips t
JOIN g ON g.trip = t.id;`,trace:["`JOIN fuel f ON f.trip = t.id` → 주유 기록 두 건과 짝이 되어 km 30이 두 행에 반복 → **30 | 5**, **30 | 7**","이 결과로 `SUM(t.km)`을 하면 30이 두 번 더해져 60이 돼요","`WITH g AS (… GROUP BY trip)` → 주유 기록을 여행마다 한 행으로 먼저 묶어 w는 12","`JOIN g ON g.trip = t.id` → 짝이 하나라 km가 반복되지 않아요 → **30 | 12**"],output:`km | won
30 | 5
30 | 7

km | w
30 | 12
`,mistake:"부푼 합계를 `SUM(DISTINCT t.km)`로 고치기. 서로 다른 여행의 km가 우연히 같으면 그것까지 한 번만 더해져 틀려요.",in_code:`주문·결제·배송처럼 상세 표 여러 개를 한꺼번에 JOIN한 뒤 SUM한 코드는 합계가 부풀었는지 먼저 의심해 보세요. 고친 코드는 보통 WITH로 표마다 먼저 집계해요.`},{type:`example`,id:`theory-sql-joins-ex5`,kind:`choice`,title:`정류장과 여행 거리`,prompt:`아래 SQL의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE trips(id, km);
-- INSERT INTO trips VALUES(1,30);
-- INSERT INTO trips VALUES(2,20);
-- CREATE TABLE stops(trip);
-- INSERT INTO stops VALUES(1),(1);
-- INSERT INTO stops VALUES(1),(2);
SELECT SUM(t.km) FROM trips t
JOIN stops s ON s.trip = t.id;`,output:`SUM(t.km)
110
`,choices:[`110`,`50`,`200`,`90`],answer:`110`,feedback:{50:`JOIN해도 여행 한 행의 km는 한 번만 더해진다고 생각했나요?`,200:`모든 여행의 km가 전체 정류장 수만큼 반복된다고 생각했나요?`,90:`정류장이 하나뿐인 2번 여행은 더해지지 않는다고 생각했나요?`},explanation:`1번 여행은 정류장 세 곳과 짝이라 km 30이 세 행에, 2번 여행은 한 행에 나와요. 그래서 SUM은 30 × 3 + 20 = 110으로, 실제 거리 합 50보다 부풀어요.`,card:`fanout`},{type:`summary`,points:["`FROM a, b`는 모든 짝을 만들고, `JOIN … ON`은 ON이 참인 짝만 남겨요. 짝이 여럿이면 행이 늘고, 짝이 없으면 사라져요.","`LEFT JOIN`은 왼쪽 행을, `FULL OUTER JOIN`은 양쪽 행을 모두 남기고 짝이 없으면 반대쪽 열을 NULL로 채워요. `WHERE 오른쪽.키 IS NULL`은 짝 없는 행만 남겨요.",`LEFT JOIN에서 오른쪽 표 조건은 ON에 둬야 왼쪽 행이 남아요. WHERE에 두면 짝 없는 행이 지워져요.`,"짝의 수는 `COUNT(*)`가 아니라 `COUNT(오른쪽.열)`로 세요. 짝이 없으면 COUNT(*)도 1이에요.","같은 대상인지 열 여러 개가 정하면 ON에 AND로 모두 걸고, `USING`은 같은 이름의 열을 한 번만 보여 줘요. 셀프 조인은 `x.id < y.id`로 짝을 한 번씩 남기고, 구간은 시작은 넣고 끝은 빼요.",`한 행이 여러 짝과 이어지면 SUM이 부풀어요. 상세 표는 WITH에서 먼저 묶은 뒤 이어요.`]}],covers:{"sql-join-01":[`left`,`pairs`],"sql-join-02":[`left`],"sql-fanout-20261017":[`fanout`,`pairs`],"sql-qualified-join-20261018":[`on-where`,`left`],"sql-using-columns-20261021":[`keys`],"sql-self-pairs-20261022":[`self`],"sql-full-coverage-20261024":[`full`],"sql-halfopen-periods-20261025":[`range`],"sql-join-foundation-01":[`pairs`],"sql-join-foundation-02":[`left`],"sql-join-transfer-02":[`left-count`],"sql-customer-totals-20261019":[`fanout`,`left`],"sql-composite-match-20261020":[`keys`],"sql-outer-filter-form-01":[`on-where`,`left-count`],"sql-cross-01":[`pairs`]}},{id:`theory-sql-functions`,version:2,concept_id:`sql-functions`,title:`문자열·날짜 함수`,minutes:11,steps:[{type:`explain`,id:`text-funcs`,title:`글자 다듬기: LENGTH · TRIM · UPPER`,body:"`LENGTH(글자)`는 공백까지 센 글자 수예요. `TRIM`은 앞뒤 공백만 지우고 가운데 공백은 남기며, `UPPER`·`LOWER`는 영어를 대문자·소문자로 바꿔요. `UPPER(TRIM(w))`처럼 함수를 겹쳐 쓰면 안쪽부터 계산해요. SELECT에 적은 식은 서로 따로 계산돼서, 한 식의 TRIM이 다른 식에 영향을 주지 않아요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE word(w);
-- INSERT INTO word VALUES('  sky ');
-- INSERT INTO word VALUES(' go up');
SELECT LENGTH(w), LENGTH(TRIM(w)),
  UPPER(TRIM(w)) FROM word;`,trace:["`LENGTH(w)` → 첫 행 '  sky '는 앞 공백 둘과 뒤 공백 하나까지 세어 **6**","`LENGTH(TRIM(w))` → 안쪽 TRIM이 앞뒤 공백을 먼저 지운 뒤 세어 **3**, 둘째 행은 가운데 공백이 남아 **5**","`UPPER(TRIM(w))` → 공백을 지운 뒤 대문자로 → **SKY**, **GO UP**"],output:`LENGTH(w) | LENGTH(TRIM(w)) | UPPER(TRIM(w))
6 | 3 | SKY
6 | 5 | GO UP
`,mistake:"같은 SELECT에 TRIM이 있으면 `LENGTH(w)`도 공백을 뺀 길이일 거라고 생각하기. 식마다 원래 값을 따로 계산해서 `LENGTH(w)`는 공백까지 세요.",in_code:"사람이 입력한 값을 비교하기 전에 `WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))`처럼 공백과 대소문자를 맞추는 줄을 자주 봐요(`?`는 프로그램이 값을 넣는 자리예요)."},{type:`example`,id:`theory-sql-functions-ex1`,kind:`choice`,title:`인사말 맞춰 보기`,prompt:`아래 SQL의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE word(w);
-- INSERT INTO word VALUES(' Hi  ');
SELECT LOWER(TRIM(w)) = 'hi',
  LENGTH(w) FROM word;`,output:`LOWER(TRIM(w)) = 'hi' | LENGTH(w)
1 | 5
`,choices:[`(1, 5)`,`(0, 5)`,`(1, 2)`,`('hi', 5)`],answer:`(1, 5)`,feedback:{"(0, 5)":`TRIM과 LOWER를 거쳐도 대문자 H나 공백이 남아 'hi'와 다르다고 생각했나요?`,"(1, 2)":`같은 SELECT의 TRIM이 LENGTH(w)에도 적용된다고 생각했나요?`,"('hi', 5)":`LOWER(TRIM(w)) = 'hi'가 비교 결과 대신 글자 hi를 돌려준다고 생각했나요?`},explanation:`LOWER(TRIM(w))는 안쪽 TRIM이 앞뒤 공백을 지운 'Hi'를 LOWER가 'hi'로 바꿔 비교가 참(1)이에요. LENGTH(w)는 따로 계산돼 원래 값의 공백까지 세어 5예요.`,card:`text-funcs`},{type:`explain`,id:`concat`,title:`|| 로 글자 잇기와 NULL`,body:"`a || b`는 두 값을 글자로 이어 붙여요. 숫자도 글자로 바뀌어 이어지지만, 한쪽이라도 NULL이면 결과 전체가 NULL이에요. 빈 글자처럼 사라지지 않고 오류도 나지 않아요. `NULL + 1` 같은 계산도 결과가 NULL이에요. 빈 값을 건너뛰고 이으려면 `COALESCE(x, '')`처럼 먼저 다른 값으로 바꿔요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE tag(kind, no);
-- INSERT INTO tag VALUES('빵',7);
-- INSERT INTO tag VALUES('떡',NULL);
SELECT kind || '-' || no AS code,
  kind || '-' || COALESCE(no, 0)
  AS fixed FROM tag;`,trace:["`kind || '-' || no` → 빵과 7을 이어 **빵-7**. 숫자 7도 글자로 이어져요",`둘째 행은 no가 NULL이라 이은 결과 전체가 **NULL**이에요. 오류는 나지 않아요`,"`COALESCE(no, 0)` → NULL을 0으로 먼저 바꿔 이어서 **떡-0**"],output:`code | fixed
빵-7 | 빵-7
NULL | 떡-0
`,mistake:"NULL이 빈 글자처럼 사라지고 나머지만 이어진다고 생각하기. `'떡-' || NULL`은 '떡-'가 아니라 NULL이에요.",in_code:"AI가 쓴 보고서 쿼리에서 `COALESCE(nickname, '') || '#' || tag`처럼 비어 있을 수 있는 칸을 먼저 빈 글자로 바꿔 잇는 줄을 자주 봐요. Oracle은 NULL을 빈 글자처럼 이어 붙이고, MySQL은 `||` 대신 `CONCAT(a, b)`로 이어요."},{type:`example`,id:`theory-sql-functions-ex2`,kind:`choice`,title:`메모에 괄호 씌우기`,prompt:`아래 SQL의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE note(id, memo);
-- INSERT INTO note VALUES(1,'hi');
-- INSERT INTO note VALUES(2,NULL);
-- INSERT INTO note VALUES(3,'');
SELECT '[' || memo || ']'
FROM note ORDER BY id;`,output:`'[' || memo || ']'
[hi]
NULL
[]
`,choices:[`['[hi]', NULL, '[]']`,`['[hi]', '[]', '[]']`,`['[hi]', '[NULL]', '[]']`,`['[hi]', NULL, NULL]`],answer:`['[hi]', NULL, '[]']`,feedback:{"['[hi]', '[]', '[]']":`NULL이 빈 글자처럼 사라지고 괄호만 이어진다고 생각했나요?`,"['[hi]', '[NULL]', '[]']":`NULL이 'NULL'이라는 글자로 바뀌어 이어진다고 생각했나요?`,"['[hi]', NULL, NULL]":`빈 글자 ''도 NULL처럼 이은 결과를 NULL로 만든다고 생각했나요?`},explanation:`1번은 '[hi]'가 되고, 2번은 memo가 NULL이라 이은 결과 전체가 NULL이에요. 3번의 ''는 NULL이 아니라 길이 0인 글자라서 괄호만 이어진 '[]'가 돼요.`,card:`concat`},{type:`explain`,id:`text-number`,title:`글자로 저장된 숫자`,body:"TEXT(글자) 열에 담긴 숫자는 글자라서, 비교하거나 정렬할 때 첫 글자부터 하나씩 비교해요. 그래서 `'8' > '60'`은 참이고 `'300' > '60'`은 거짓이에요. SQLite는 TEXT 열을 60 같은 숫자와 비교할 때 숫자 쪽을 글자로 바꿔 비교해서 결과가 같아요. 수로 비교하려면 `CAST(qty AS INTEGER)`나 `qty + 0`처럼 계산을 거쳐 수로 바꾸고, 글자를 계산에 쓰면 앞쪽의 숫자 부분만 읽어요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE box(name, qty TEXT);
-- INSERT INTO box VALUES('감','8');
-- INSERT INTO box VALUES('배','40');
-- INSERT INTO box VALUES('귤','300');
SELECT name FROM box WHERE qty > 60;
SELECT name FROM box
WHERE CAST(qty AS INTEGER) > 60;
SELECT '12개' + 3;`,trace:["`WHERE qty > 60` → qty가 TEXT라 60도 글자 '60'으로 바꿔 비교해요. '8'은 8 > 6이라 참, '40'·'300'은 첫 글자 4·3이 6보다 작아 거짓 → **감**","`CAST(qty AS INTEGER) > 60` → 수로 바꿔 비교하니 300만 커서 → **귤**","`'12개' + 3` → 글자를 수로 바꿀 때 앞쪽 숫자 12만 읽어 → **15**"],output:`name
감

name
귤

'12개' + 3
15
`,mistake:`TEXT 열의 숫자도 수처럼 크기를 비교할 거라고 생각하기. 글자는 첫 글자부터 비교해서 '8'이 '300'보다 커요.`,in_code:"CSV 파일(쉼표로 칸을 나눈 표 파일)을 불러오면 숫자가 TEXT로 저장되는 일이 흔해요. AI가 쓴 코드에서 `CAST(price AS INTEGER)`나 `price + 0`으로 바꾼 뒤 비교·정렬하는 줄이 그래서 나와요."},{type:`example`,id:`theory-sql-functions-ex3`,kind:`choice`,title:`용량 순서로 줄 세우기`,prompt:`아래 SQL의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE lab(id, ml TEXT);
-- INSERT INTO lab VALUES(1,'90');
-- INSERT INTO lab VALUES(2,'120');
-- INSERT INTO lab VALUES(3,'7');
SELECT id FROM lab
ORDER BY ml DESC;`,output:`id
1
3
2
`,choices:[`[1, 3, 2]`,`[2, 1, 3]`,`[2, 3, 1]`,`[3, 1, 2]`],answer:`[1, 3, 2]`,feedback:{"[2, 1, 3]":`TEXT 열의 숫자도 수의 크기로 정렬된다고 생각했나요?`,"[2, 3, 1]":`DESC를 붙여도 글자가 작은 것부터 정렬된다고 생각했나요?`,"[3, 1, 2]":`수의 크기로, 그것도 작은 것부터 정렬된다고 생각했나요?`},explanation:`ml은 TEXT라 첫 글자부터 비교해요. 첫 글자가 9인 '90', 7인 '7', 1인 '120' 순서로 커서, 큰 것부터 세우면 1번, 3번, 2번이에요.`,card:`text-number`},{type:`explain`,id:`dates`,title:`날짜는 글자: julianday · date · strftime`,body:"SQLite에는 날짜 자료형이 따로 없어서 날짜를 `'2025-02-27'` 같은 'YYYY-MM-DD' 글자로 저장해요. `julianday(날짜)`는 날짜를 일 단위 수로 바꿔서, 두 julianday를 빼면 며칠 차이인지 소수로 나와요. `date(날짜, '+4 days')`는 달과 해가 바뀌는 것까지 계산한 날짜 글자를 돌려주고, `strftime('%Y-%m', 날짜)`는 연과 월만 꺼내요. 시각이 붙은 값에 `date()`를 쓰면 날짜만 남아요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE due(d);
-- INSERT INTO due VALUES('2025-02-27');
SELECT julianday('2025-03-02')
  - julianday(d) AS gap,
  date(d, '+4 days') AS later,
  strftime('%Y-%m', d) AS ym
FROM due;
SELECT date('2025-03-09 21:40');`,trace:["`julianday('2025-03-02') - julianday(d)` → 2월 27일과 3월 2일의 차이 **3.0**일(2025년 2월은 28일까지예요). 두 날을 모두 센 4일이 아니에요","`date(d, '+4 days')` → 달을 넘겨 **2025-03-03**","`strftime('%Y-%m', d)` → 연·월만 꺼내 **2025-02**","`date('2025-03-09 21:40')` → 시각을 떼고 날짜만 → **2025-03-09**"],output:`gap | later | ym
3.0 | 2025-03-03 | 2025-02

date('2025-03-09 21:40')
2025-03-09
`,mistake:"날짜 글자끼리 바로 빼면 날짜 차이가 나온다고 생각하기. `'2025-03-02' - '2025-02-27'`은 앞쪽 숫자 2025끼리 빼서 0이에요. 차이는 julianday로 구해요.",in_code:"AI가 쓴 SQLite 코드에서 `julianday('now') - julianday(created_at)`으로 며칠 지났는지 구하는 줄을 자주 봐요. 다른 데이터베이스는 `DATEDIFF` 같은 다른 함수를 써요."},{type:`example`,id:`theory-sql-functions-ex4`,kind:`choice`,title:`열흘 뒤와 새해까지`,prompt:`아래 SQL의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE due(d);
-- INSERT INTO due VALUES('2024-12-25');
SELECT date(d, '+10 days'),
  julianday('2025-01-01')
  - julianday(d) AS gap FROM due;`,output:`date(d, '+10 days') | gap
2025-01-04 | 7.0
`,choices:[`('2025-01-04', 7.0)`,`('2024-12-35', 7.0)`,`('2025-01-04', 1)`,`('2025-01-05', 6.0)`],answer:`('2025-01-04', 7.0)`,feedback:{"('2024-12-35', 7.0)":`date가 달을 넘기지 않고 일 숫자에 10을 그냥 더한다고 생각했나요?`,"('2025-01-04', 1)":`julianday로 바꿔도 날짜 글자를 바로 뺄 때처럼 연도끼리 뺀다고 생각했나요?`,"('2025-01-05', 6.0)":`12월이 30일까지라고 생각했나요?`},explanation:`12월은 31일까지라 12월 25일에서 열흘 뒤는 1월 4일이에요. julianday는 날짜를 일 단위 수로 바꾸니 1월 1일과의 차이는 7.0일이에요.`,card:`dates`},{type:`explain`,id:`date-range`,title:`날짜 구간 거르기`,body:"날짜 글자는 글자 순서로 비교되는데, 'YYYY-MM-DD' 모양이라 글자 순서가 곧 날짜 순서예요. `BETWEEN a AND b`는 `>= a AND <= b`라 양 끝을 포함해요. 그런데 시각이 붙은 `'2025-03-31 20:10'`은 `'2025-03-31'`로 시작하고 더 길어서 그보다 커요. 그래서 시각이 섞인 열의 한 달은 `>= '2025-03-01' AND < '2025-04-01'`처럼 다음 달 첫날 미만으로 잘라요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE visit(at);
-- INSERT INTO visit VALUES('2025-03-01');
-- INSERT INTO visit VALUES('2025-03-31 20:10');
-- INSERT INTO visit VALUES('2025-04-01');
SELECT COUNT(*) FROM visit
WHERE at BETWEEN '2025-03-01'
  AND '2025-03-31';
SELECT COUNT(*) FROM visit
WHERE at >= '2025-03-01'
  AND at < '2025-04-01';`,trace:["`BETWEEN '2025-03-01' AND '2025-03-31'` → 3월 1일은 시작값과 같아 들어가요",`'2025-03-31 20:10'은 끝값 '2025-03-31'보다 긴 글자라 더 커서 빠져요 → **1**`,"`at >= '2025-03-01' AND at < '2025-04-01'` → 3월 31일 저녁까지 들어가고 4월 1일은 빠져 → **2**"],output:`COUNT(*)
1

COUNT(*)
2
`,mistake:`BETWEEN의 끝을 그달 마지막 날로 두면 그날 하루가 다 들어간다고 생각하기. 시각이 붙은 값은 끝값보다 커서 빠져요.`,in_code:"AI가 쓴 월별 집계 코드에서 `WHERE created_at >= :start AND created_at < :next_month`처럼 다음 달 첫날 미만으로 자르는 줄을 자주 봐요(`:start`는 프로그램이 값을 넣는 자리예요). `strftime('%Y-%m', 열) = '2025-03'`이나 `date(열)`로 비교해도 결과는 같지만, 행마다 함수를 계산해서 큰 표에서는 느려요."},{type:`example`,id:`theory-sql-functions-ex5`,kind:`choice`,title:`5월 기록 고르기`,prompt:`아래 SQL의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE log(id, at);
-- INSERT INTO log VALUES(1,'2025-05-01 00:00');
-- INSERT INTO log VALUES(2,'2025-05-31');
-- INSERT INTO log VALUES(3,'2025-05-31 08:00');
-- INSERT INTO log VALUES(4,'2025-06-01');
SELECT id FROM log
WHERE at BETWEEN '2025-05-01'
  AND '2025-05-31' ORDER BY id;`,output:`id
1
2
`,choices:[`[1, 2]`,`[1, 2, 3]`,`[2]`,`[1, 2, 3, 4]`],answer:`[1, 2]`,feedback:{"[1, 2, 3]":`5월 31일 08시도 끝값 '2025-05-31'과 같은 날이라 들어간다고 생각했나요?`,"[2]":`시각이 붙은 '2025-05-01 00:00'은 시작값 '2025-05-01'보다 작다고 생각했나요?`,"[1, 2, 3, 4]":`BETWEEN이 끝값 다음 날까지 포함한다고 생각했나요?`},explanation:`'2025-05-01 00:00'은 시작값으로 시작하고 더 길어서 시작값보다 크니 들어가고, '2025-05-31'은 끝값과 같아 들어가요. '2025-05-31 08:00'은 끝값보다 커서 빠지고, 6월 1일도 빠져요.`,card:`date-range`},{type:`summary`,points:["`LENGTH`는 공백까지 세고, `TRIM`은 앞뒤 공백만 지워요. 겹친 함수는 안쪽부터, SELECT의 식은 서로 따로 계산돼요.","`||`는 글자를 이어 붙이고, 한쪽이 NULL이면 결과 전체가 NULL이에요. 빈 글자 `''`는 NULL이 아니에요.","TEXT 열의 숫자는 첫 글자부터 비교·정렬돼요. 수로 다루려면 `CAST(x AS INTEGER)`나 `x + 0`으로 바꿔요.","날짜는 'YYYY-MM-DD' 글자예요. 차이는 `julianday`, 며칠 뒤는 `date(d, '+n days')`, 연·월은 `strftime('%Y-%m', d)`로 구해요.","BETWEEN은 양 끝을 포함하지만 시각이 붙은 값은 끝값보다 커요. 한 달은 `>= 첫날 AND < 다음 달 첫날`로 잘라요."]}],covers:{"sql-func-01":[`text-funcs`],"sql-func-02":[`concat`],"sql-func-03":[`dates`,`text-number`],"sql-func-04":[`date-range`],"sql-func-05":[`text-number`],"sql-func-06":[`date-range`,`dates`]}},{id:`theory-sql-windows`,version:2,concept_id:`sql-windows`,title:`윈도 함수`,minutes:12,steps:[{type:`explain`,id:`row-number`,title:`ROW_NUMBER와 PARTITION BY`,body:"`함수() OVER (…)`는 윈도 함수예요. GROUP BY와 달리 행을 줄이지 않고, 원래 행마다 계산 결과를 붙여요. `ROW_NUMBER() OVER (ORDER BY sec)`는 sec 순서로 줄 세워 1부터 번호를 매기고, `PARTITION BY who`를 넣으면 who가 같은 행끼리 나눠 묶음마다 1부터 다시 매겨요. OVER 안의 ORDER BY는 번호를 매기는 순서이고, 맨 끝의 ORDER BY는 보여 주는 순서일 뿐이에요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE lap(id, who, sec);
-- INSERT INTO lap VALUES(1,'민',50);
-- INSERT INTO lap VALUES(2,'준',42);
-- INSERT INTO lap VALUES(3,'민',38);
-- INSERT INTO lap VALUES(4,'준',47);
SELECT id, ROW_NUMBER() OVER (
  ORDER BY sec) AS n,
  ROW_NUMBER() OVER (PARTITION BY
  who ORDER BY sec) AS p
FROM lap ORDER BY id;`,trace:["`ROW_NUMBER() OVER (ORDER BY sec)` → 기록이 빠른 3, 2, 4, 1번 순서로 1, 2, 3, 4","`OVER (PARTITION BY who ORDER BY sec)` → 민끼리(3번 38초, 1번 50초), 준끼리(2번, 4번) 따로 1부터","`ORDER BY id` → 번호는 그대로 두고 id 순서로 보여 줘요 → n은 **[4, 2, 1, 3]**, p는 **[2, 1, 1, 2]**"],output:`id | n | p
1 | 4 | 2
2 | 2 | 1
3 | 1 | 1
4 | 3 | 2
`,mistake:`맨 끝의 ORDER BY가 번호를 다시 매긴다고 생각하기. 번호는 OVER 안의 순서로 이미 정해졌고, 끝의 ORDER BY는 보여 주는 순서만 바꿔요.`,in_code:"AI가 쓴 코드에서 `ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC)`로 사람마다 가장 최근 기록에 1을 매기는 줄을 자주 봐요."},{type:`explain`,id:`rank`,title:`동점 처리: RANK · DENSE_RANK`,body:"동점인 행에 번호를 어떻게 매기는지가 함수마다 달라요. `ROW_NUMBER`는 동점이어도 1, 2, 3처럼 서로 다른 번호를 주고, 동점끼리의 순서는 OVER 안 ORDER BY의 다음 기준이 정해요. `RANK`는 동점에 같은 번호를 주고 다음 행에는 앞선 행 수에 1을 더한 번호를 줘서 1등이 셋이면 다음은 4등이고, `DENSE_RANK`는 같은 번호를 주되 건너뛰지 않아 다음이 2등이에요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE test(name, pt);
-- INSERT INTO test VALUES('민',9);
-- INSERT INTO test VALUES('준',9);
-- INSERT INTO test VALUES('윤',9);
-- INSERT INTO test VALUES('하',6);
SELECT name, RANK() OVER (
  ORDER BY pt DESC) AS rk,
  DENSE_RANK() OVER (
  ORDER BY pt DESC) AS dr,
  ROW_NUMBER() OVER (
  ORDER BY pt DESC, name) AS rn
FROM test ORDER BY rn;`,trace:[`민·윤·준은 9점 동점 → RANK와 DENSE_RANK는 셋 다 **1**, ROW_NUMBER는 이름 순서로 **1, 2, 3**`,`하(6점) → RANK는 1등이 세 명이라 2·3을 건너뛰고 **4**`,`DENSE_RANK는 건너뛰지 않고 바로 다음 **2**, ROW_NUMBER는 **4**`],output:`name | rk | dr | rn
민 | 1 | 1 | 1
윤 | 1 | 1 | 2
준 | 1 | 1 | 3
하 | 4 | 2 | 4
`,mistake:`RANK도 DENSE_RANK처럼 번호를 건너뛰지 않는다고 생각하기. RANK는 동점자가 차지한 자리만큼 번호가 밀려서, 1등이 셋이면 2등과 3등은 없고 다음이 4등이에요.`,in_code:"'상위 3명' 같은 조건에서 `WHERE rk <= 3`의 결과는 함수에 따라 달라져요. 동점자를 모두 넣으려면 RANK나 DENSE_RANK를, 딱 세 명이면 ROW_NUMBER를 써요."},{type:`example`,id:`theory-sql-windows-ex1`,kind:`choice`,title:`볼링 점수 순위`,prompt:`아래 SQL의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE pin(id, pt);
-- INSERT INTO pin VALUES(1,8);
-- INSERT INTO pin VALUES(2,9);
-- INSERT INTO pin VALUES(3,8);
-- INSERT INTO pin VALUES(4,7);
-- INSERT INTO pin VALUES(5,9);
SELECT RANK() OVER (
  ORDER BY pt DESC) AS r
FROM pin ORDER BY pt DESC;`,output:`r
1
1
3
3
5
`,choices:[`[1, 1, 3, 3, 5]`,`[1, 1, 2, 2, 3]`,`[1, 2, 3, 4, 5]`,`[1, 1, 3, 3, 4]`],answer:`[1, 1, 3, 3, 5]`,feedback:{"[1, 1, 2, 2, 3]":`RANK도 DENSE_RANK처럼 동점 뒤에 번호를 건너뛰지 않는다고 생각했나요?`,"[1, 2, 3, 4, 5]":`RANK도 ROW_NUMBER처럼 동점에 서로 다른 번호를 준다고 생각했나요?`,"[1, 1, 3, 3, 4]":`번호를 건너뛰는 일이 동점 묶음마다가 아니라 한 번만 일어난다고 생각했나요?`},explanation:`9점 두 명이 1등을 함께 하고 두 자리를 썼으니 8점 두 명은 3등이에요. 8점도 두 자리를 써서 7점은 5등이라 [1, 1, 3, 3, 5]예요.`,card:`rank`},{type:`explain`,id:`filter-window`,title:`윈도 함수 결과로 거르기`,body:"윈도 함수의 결과는 같은 SELECT의 WHERE에서 바로 쓸 수 없어요. WHERE가 윈도 함수보다 먼저 계산되기 때문이에요. 그래서 `FROM (SELECT …)`처럼 FROM 자리에 둔 하위 조회나 1강의 `WITH`로 번호를 먼저 붙인 뒤, 바깥에서 `WHERE n = 1`처럼 걸러요. 묶음마다 1등을 고르려면 OVER에 PARTITION BY가 있어야 하고, 없으면 전체에서 1등인 한 행만 남아요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE lap(id, who, sec);
-- INSERT INTO lap VALUES(1,'민',50);
-- INSERT INTO lap VALUES(2,'준',42);
-- INSERT INTO lap VALUES(3,'민',38);
-- INSERT INTO lap VALUES(4,'준',47);
SELECT id FROM (SELECT id,
  ROW_NUMBER() OVER (PARTITION BY
  who ORDER BY sec) AS n FROM lap)
WHERE n = 1 ORDER BY id;
SELECT id FROM (SELECT id,
  ROW_NUMBER() OVER (ORDER BY sec)
  AS n FROM lap) WHERE n = 1;`,trace:["`FROM (SELECT … PARTITION BY who …)` → 사람마다 빠른 순서로 번호를 붙인 결과를 표처럼 읽어요","`WHERE n = 1 ORDER BY id` → 각자 1번인 행만 → **[2, 3]**",`둘째 조회는 OVER에 PARTITION BY가 없어 전체에서 가장 빠른 3번만 n이 1 → **[3]**`],output:`id
2
3

id
3
`,mistake:"`WHERE ROW_NUMBER() OVER (…) = 1`처럼 같은 SELECT에서 바로 거르기. 윈도 함수는 WHERE 다음에 계산돼서 오류(`misuse of window function`)가 나요.",in_code:`AI가 쓴 '사람마다 가장 최근 기록 한 건' 코드는 보통 WITH 안에서 PARTITION BY로 번호를 붙이고, 바깥에서 번호가 1인 행만 고르는 모양이에요.`},{type:`example`,id:`theory-sql-windows-ex2`,kind:`choice`,title:`클럽마다 두 명씩`,prompt:`아래 SQL의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE swim(club, sec);
-- INSERT INTO swim VALUES('해',40);
-- INSERT INTO swim VALUES('해',33);
-- INSERT INTO swim VALUES('해',37);
-- INSERT INTO swim VALUES('달',35);
-- INSERT INTO swim VALUES('별',41);
WITH r AS (SELECT ROW_NUMBER()
  OVER (PARTITION BY club
  ORDER BY sec) AS n FROM swim)
SELECT COUNT(*) FROM r WHERE n <= 2;`,output:`COUNT(*)
4
`,choices:[`4`,`2`,`5`,`3`],answer:`4`,feedback:{2:`PARTITION BY가 있어도 전체를 한 줄로 세워 번호를 매긴다고 생각했나요?`,5:`WHERE n <= 2가 아무 행도 거르지 않는다고 생각했나요?`,3:`n <= 2여도 묶음마다 한 행씩만 남는다고 생각했나요?`},explanation:`클럽마다 번호를 1부터 다시 매겨요. 해 클럽은 세 명이라 1·2·3번 중 두 행이, 달과 별은 한 명씩이라 1번 한 행씩 남아 모두 4행이에요.`,card:`filter-window`},{type:`explain`,id:`lag-lead`,title:`LAG · LEAD로 앞뒤 행 보기`,body:"`LAG(열) OVER (ORDER BY 기준)`은 기준 순서에서 바로 앞 행의 값을, `LEAD(열)`은 바로 뒤 행의 값을 가져와요. 앞이나 뒤에 행이 없으면 NULL이고, `LAG(열, 1, 0)`처럼 둘째 값에 몇 행 앞을 볼지(빼면 1), 셋째 값에 NULL 대신 쓸 값을 줄 수 있어요. 그래서 `deg - LAG(deg) OVER (ORDER BY day)`는 전날보다 오른 만큼이고, 첫날은 NULL과의 뺄셈이라 NULL이에요. OVER 안을 `ORDER BY day DESC`로 바꾸면 '바로 앞 행'이 다음 날이 돼요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE heat(day, deg);
-- INSERT INTO heat VALUES(1,12);
-- INSERT INTO heat VALUES(2,15);
-- INSERT INTO heat VALUES(3,11);
SELECT day,
  LAG(deg) OVER (ORDER BY day) AS a,
  LAG(deg, 1, 0) OVER (ORDER BY day)
  AS b,
  LEAD(deg) OVER (ORDER BY day) AS c
FROM heat ORDER BY day;`,trace:["`LAG(deg) OVER (ORDER BY day) AS a` → 전날 기온, 첫날은 앞 행이 없어 → **NULL, 12, 15**","`LAG(deg, 1, 0) … AS b` → 앞 행이 없으면 0 → **0, 12, 15**","`LEAD(deg) … AS c` → 다음 날 기온, 마지막 날은 뒤 행이 없어 → **15, 11, NULL**"],output:`day | a | b | c
1 | NULL | 0 | 15
2 | 12 | 12 | 11
3 | 15 | 15 | NULL
`,mistake:`LAG에 기본값을 주지 않아도 첫 행에는 0이 들어간다고 생각하기. 앞 행이 없으면 NULL이고, NULL과의 계산도 NULL이에요.`,in_code:"AI가 쓴 분석 코드에서 `price - LAG(price) OVER (ORDER BY 날짜)`로 전날 대비 가격 변화를 구하는 줄을 자주 봐요."},{type:`example`,id:`theory-sql-windows-ex3`,kind:`choice`,title:`하루 동안 팔린 개수`,prompt:`아래 SQL의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE shelf(day, qty);
-- INSERT INTO shelf VALUES(1,20);
-- INSERT INTO shelf VALUES(2,14);
-- INSERT INTO shelf VALUES(3,9);
SELECT LAG(qty) OVER (ORDER BY day)
  - qty AS sold FROM shelf
ORDER BY day;`,output:`sold
NULL
6
5
`,choices:[`[NULL, 6, 5]`,`[-20, 6, 5]`,`[-6, -5, NULL]`,`[NULL, -6, -5]`],answer:`[NULL, 6, 5]`,feedback:{"[-20, 6, 5]":`앞 행이 없으면 LAG가 0을 돌려준다고 생각했나요?`,"[-6, -5, NULL]":`LAG가 바로 뒤 행의 값을 가져온다고 생각했나요?`,"[NULL, -6, -5]":`LAG(qty) - qty가 오늘에서 어제를 뺀 값이라고 생각했나요?`},explanation:`LAG(qty)는 날짜 순서로 바로 앞 날의 재고예요. 첫날은 앞 행이 없어 NULL이고 NULL과의 뺄셈도 NULL이에요. 둘째 날은 20 - 14 = 6, 셋째 날은 14 - 9 = 5예요.`,card:`lag-lead`},{type:`explain`,id:`frame`,title:`같은 값끼리 묶이는 누적 합계`,body:"OVER에 ORDER BY만 쓰면 더하는 범위의 기본값은 `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`, 곧 '처음부터 정렬 값이 지금 행과 같은 행까지 모두'예요. 그래서 정렬 값이 같은 행(동점)들은 같은 누적 합계를 받아요. `ORDER BY wk, no`처럼 겹치지 않는 기준을 더하거나 2강의 ROWS로 범위를 정하면 한 행씩 더해져요. PARTITION BY를 넣으면 묶음마다 누적을 처음부터 다시 해요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE pay(no, wk, won);
-- INSERT INTO pay VALUES(1,1,4);
-- INSERT INTO pay VALUES(2,1,2);
-- INSERT INTO pay VALUES(3,2,5);
-- INSERT INTO pay VALUES(4,2,1);
SELECT no,
  SUM(won) OVER (ORDER BY wk) AS a,
  SUM(won) OVER (ORDER BY wk, no)
  AS b,
  SUM(won) OVER (PARTITION BY wk
  ORDER BY no) AS c
FROM pay ORDER BY no;`,trace:["`OVER (ORDER BY wk) AS a` → 1주의 두 행은 정렬 값이 같아 함께 더해져 둘 다 **6**, 2주의 두 행은 둘 다 **12**","`OVER (ORDER BY wk, no) AS b` → 동점이 없어 한 행씩 → **4, 6, 11, 12**","`OVER (PARTITION BY wk ORDER BY no) AS c` → 주마다 처음부터 다시 → **4, 6, 5, 6**"],output:`no | a | b | c
1 | 6 | 4 | 4
2 | 6 | 6 | 6
3 | 12 | 11 | 5
4 | 12 | 12 | 6
`,mistake:`ORDER BY만 쓴 누적 합계가 언제나 한 행씩 더해진다고 생각하기. 정렬 값이 같은 행은 한꺼번에 더해져 같은 값을 받아요.`,in_code:"일별 누적 매출 보고서에서 같은 날 주문이 여러 건이면 누적 합계가 한 번에 뛰어요. AI가 쓴 코드에서 `OVER (ORDER BY 날짜, id)`처럼 기준을 하나 더 붙인 줄은 이걸 막으려는 거예요."},{type:`example`,id:`theory-sql-windows-ex4`,kind:`choice`,title:`두 주 동안 모은 점수`,prompt:`아래 SQL의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE pts(no, wk, p);
-- INSERT INTO pts VALUES(1,1,5);
-- INSERT INTO pts VALUES(2,1,2);
-- INSERT INTO pts VALUES(3,2,4);
SELECT SUM(p) OVER (ORDER BY wk)
FROM pts ORDER BY no;`,output:`SUM(p) OVER (ORDER BY wk)
7
7
11
`,choices:[`[7, 7, 11]`,`[5, 7, 11]`,`[7, 7, 4]`,`[11, 11, 11]`],answer:`[7, 7, 11]`,feedback:{"[5, 7, 11]":`ORDER BY만 쓴 누적 합계도 같은 주의 행을 한 행씩 더한다고 생각했나요?`,"[7, 7, 4]":`주가 바뀌면 누적이 처음부터 다시 시작된다고 생각했나요?`,"[11, 11, 11]":`OVER 안의 ORDER BY와 상관없이 전체 합계가 붙는다고 생각했나요?`},explanation:`OVER에 ORDER BY만 쓰면 지금 행과 wk가 같은 행까지 한꺼번에 더해요. 1주의 두 행은 5 + 2 = 7을 함께 받고, 2주 행은 7 + 4 = 11이에요.`,card:`frame`},{type:`summary`,points:["`OVER (…)`가 붙은 윈도 함수는 행을 줄이지 않고 행마다 값을 붙여요. `PARTITION BY`는 묶음마다 처음부터 다시 계산하고, 맨 끝의 ORDER BY는 보여 주는 순서만 정해요.","`ROW_NUMBER`는 동점에도 다른 번호를 주고, `RANK`는 같은 번호 뒤에 건너뛰고, `DENSE_RANK`는 건너뛰지 않아요.",`윈도 함수 결과는 같은 SELECT의 WHERE에서 못 써요. FROM의 하위 조회나 WITH로 먼저 붙인 뒤 바깥에서 걸러요.`,"`LAG`는 앞 행, `LEAD`는 뒤 행의 값을 가져오고, 없으면 NULL(셋째 값을 주면 그 값)이에요.",`ORDER BY만 쓴 누적 합계는 정렬 값이 같은 행을 한꺼번에 더해요. 한 행씩 더하려면 겹치지 않는 기준을 더해요.`]}],covers:{"sql-window-01":[`rank`,`filter-window`],"sql-window-02":[`row-number`],"sql-window-03":[`lag-lead`],"sql-window-04":[`filter-window`,`row-number`],"sql-window-05":[`frame`,`row-number`]}},{id:`theory-sql-modify`,version:2,concept_id:`sql-modify`,title:`데이터 변경과 제약`,minutes:12,steps:[{type:`explain`,id:`update`,title:`UPDATE는 WHERE로 대상을 골라요`,body:"`UPDATE 표 SET 열 = 값 WHERE 조건`은 조건이 참인 행의 그 열을 새 값으로 바꿔요. `SET n = n + 1`처럼 쓰면 오른쪽의 n은 바꾸기 전의 값이에요. WHERE를 빼면 표의 모든 행이 바뀌고, SQLite는 경고나 오류 없이 실행해요. 그래서 바꾸기 전에 같은 WHERE로 SELECT를 먼저 실행해 대상 행을 확인하는 습관이 안전해요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE jars(id, n);
-- INSERT INTO jars VALUES(1,5);
-- INSERT INTO jars VALUES(2,8);
-- INSERT INTO jars VALUES(3,2);
UPDATE jars SET n = n + 1
WHERE id = 3;
SELECT n FROM jars;
UPDATE jars SET n = 0;
SELECT n FROM jars;`,trace:["`UPDATE jars SET n = n + 1 WHERE id = 3;` → 3번 행만 원래 값 2에 1을 더해 3으로 바꿔요","`SELECT n FROM jars;` → **5, 8, 3**","`UPDATE jars SET n = 0;` → WHERE가 없어 세 행이 모두 0이 돼요","`SELECT n FROM jars;` → **0, 0, 0**"],output:`n
5
8
3

n
0
0
0
`,mistake:`WHERE 없는 UPDATE는 오류가 날 거라고 생각하기. SQLite는 모든 행을 조용히 바꿔요.`,in_code:"실무 코드는 `UPDATE … WHERE id = ?`처럼 바꿀 행을 정확히 고르고, 실행한 뒤 바뀐 행 수(Python의 `cursor.rowcount`)를 확인해요."},{type:`example`,id:`theory-sql-modify-ex1`,kind:`choice`,title:`점수 두 번 고치기`,prompt:`SQL을 위에서부터 실행한 뒤 마지막 SELECT의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE score(id, pt);
-- INSERT INTO score VALUES(1,5);
-- INSERT INTO score VALUES(2,8);
UPDATE score SET pt = pt * 2
WHERE pt < 6;
UPDATE score SET pt = pt + 1;
SELECT pt FROM score ORDER BY id;`,output:`pt
11
9
`,choices:[`[11, 9]`,`[10, 8]`,`[11, 17]`,`[11, 8]`],answer:`[11, 9]`,feedback:{"[10, 8]":`WHERE 없는 UPDATE는 아무 행도 바꾸지 않는다고 생각했나요?`,"[11, 17]":`WHERE pt < 6이 있어도 첫 UPDATE가 모든 행을 두 배로 만든다고 생각했나요?`,"[11, 8]":`둘째 UPDATE가 바로 앞에서 바뀐 행에만 적용된다고 생각했나요?`},explanation:`첫 UPDATE는 pt < 6인 1번만 5 × 2 = 10으로 바꿔요. 둘째 UPDATE는 WHERE가 없어 두 행 모두 1을 더하니 11과 9예요.`,card:`update`},{type:`explain`,id:`transaction`,title:`BEGIN · COMMIT · ROLLBACK`,body:"`BEGIN`으로 트랜잭션(여러 변경을 한 덩어리로 묶는 것)을 시작하면, `COMMIT`할 때 그 안의 변경이 모두 확정되고 `ROLLBACK`하면 모두 처음 상태로 돌아가요. 트랜잭션은 문제가 생겼을 때 되돌릴 수 있게 묶어 줄 뿐, 스스로 되돌리지는 않아요. `WHERE id = 7`처럼 맞는 행이 없는 UPDATE는 오류가 아니라 0개 행을 바꾸고 끝나서, 그대로 COMMIT하면 앞의 변경만 확정돼요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE memo(id, txt);
-- INSERT INTO memo VALUES(1,'빨래');
-- INSERT INTO memo VALUES(2,'운동');
BEGIN;
DELETE FROM memo;
SELECT COUNT(*) FROM memo;
ROLLBACK;
UPDATE memo SET txt = '독서'
WHERE id = 7;
SELECT txt FROM memo;`,trace:["`BEGIN;` → 트랜잭션을 시작해요","`DELETE FROM memo;` 뒤 `SELECT COUNT(*)` → 트랜잭션 안에서는 지워진 상태라 **0**","`ROLLBACK;` → BEGIN 뒤의 변경을 모두 되돌려 두 행이 다시 있어요","`UPDATE … WHERE id = 7;` → 7번 행이 없어 0개 행을 바꾸고 오류 없이 끝나요 → 마지막 결과는 **빨래, 운동**"],output:`COUNT(*)
0

txt
빨래
운동
`,mistake:`맞는 행이 없는 UPDATE는 오류라서 트랜잭션이 알아서 되돌릴 거라고 생각하기. 0개 행을 바꾼 것도 정상 실행이라, 그대로 COMMIT하면 앞의 변경만 확정돼요.`,in_code:"AI가 쓴 이체 같은 코드는 `BEGIN` 뒤에 UPDATE 여러 개를 두고, 바뀐 행 수(`cursor.rowcount`)가 1이 아니면 `ROLLBACK`, 맞으면 `COMMIT`하는 모양이에요."},{type:`example`,id:`theory-sql-modify-ex2`,kind:`choice`,title:`장바구니 되돌리기`,prompt:`SQL을 위에서부터 실행한 뒤 마지막 SELECT의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE cart(item, n);
-- INSERT INTO cart VALUES('감',2);
-- INSERT INTO cart VALUES('귤',3);
BEGIN;
UPDATE cart SET n = n + 1;
ROLLBACK;
UPDATE cart SET n = n * 10
WHERE item = '배';
SELECT SUM(n) FROM cart;`,output:`SUM(n)
5
`,choices:[`5`,`7`,`50`,`오류 발생`],answer:`5`,feedback:{7:`ROLLBACK을 해도 BEGIN 뒤의 변경이 남는다고 생각했나요?`,50:`WHERE에 맞는 행이 없으면 UPDATE가 모든 행에 적용된다고 생각했나요?`,"오류 발생":`맞는 행이 없는 UPDATE는 오류가 난다고 생각했나요?`},explanation:`BEGIN 뒤에 더한 1은 ROLLBACK으로 모두 되돌아가요. item이 '배'인 행이 없어 둘째 UPDATE는 0개 행을 바꾸고 오류 없이 끝나서, 합계는 처음 그대로 2 + 3 = 5예요.`,card:`transaction`},{type:`explain`,id:`constraints`,title:`UNIQUE 제약과 NULL`,body:"`UNIQUE` 제약(표에 거는 규칙)이 붙은 열에는 이미 있는 값을 또 넣을 수 없고, 넣으려 하면 오류가 나요. 하지만 NULL은 '값 없음'이라 서로 같다고 보지 않아서, UNIQUE 열에도 여러 번 들어가요(SQL Server는 NULL도 하나만 받아요). 값이 꼭 있어야 하면 `NOT NULL`을 함께 걸어요. `INSERT OR IGNORE`는 제약을 어기는 행만 조용히 건너뛰고 나머지 행은 넣어요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE nick(name UNIQUE);
-- INSERT INTO nick VALUES('봄');
-- INSERT INTO nick VALUES(NULL);
INSERT OR IGNORE INTO nick
VALUES('봄'),('비'),(NULL);
SELECT COUNT(*), COUNT(name)
FROM nick;`,trace:["`INSERT OR IGNORE … VALUES('봄'),('비'),(NULL)` → 봄은 이미 있어 건너뛰고, 비와 NULL은 들어가요",`NULL은 이미 있는 NULL과 같은 값으로 보지 않아 UNIQUE를 어기지 않아요`,"`SELECT COUNT(*), COUNT(name)` → 봄·NULL·비·NULL 네 행, 이름이 있는 행은 둘 → **(4, 2)**"],output:`COUNT(*) | COUNT(name)
4 | 2
`,mistake:`UNIQUE 열이면 NULL도 한 번만 들어간다고 생각하기. NULL끼리는 같다고 보지 않아 여러 개 들어가요.`,in_code:"회원 표에서 `email TEXT NOT NULL UNIQUE`처럼 두 제약을 함께 건 열을 자주 봐요. `INSERT OR IGNORE`는 SQLite 문법이고, 다른 데이터베이스는 `ON CONFLICT DO NOTHING` 같은 표기를 써요."},{type:`example`,id:`theory-sql-modify-ex3`,kind:`choice`,title:`입장 코드 등록`,prompt:`SQL을 위에서부터 실행한 뒤 마지막 SELECT의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE pass(code UNIQUE);
-- INSERT INTO pass VALUES('K1');
INSERT OR IGNORE INTO pass VALUES
('K1'),('K2'),('K2'),(NULL),(NULL);
SELECT code FROM pass ORDER BY code;`,output:`code
NULL
NULL
K1
K2
`,choices:[`[NULL, NULL, 'K1', 'K2']`,`['K1', 'K2']`,`[NULL, 'K1', 'K2']`,`[NULL, NULL, 'K1', 'K1', 'K2', 'K2']`],answer:`[NULL, NULL, 'K1', 'K2']`,feedback:{"['K1', 'K2']":`NULL도 UNIQUE에 걸려 하나도 들어가지 못한다고 생각했나요?`,"[NULL, 'K1', 'K2']":`UNIQUE 열에는 NULL이 한 번만 들어간다고 생각했나요?`,"[NULL, NULL, 'K1', 'K1', 'K2', 'K2']":`OR IGNORE를 쓰면 제약과 상관없이 모든 행이 들어간다고 생각했나요?`},explanation:`K1은 이미 있고, 두 번째 K2는 방금 넣은 K2와 겹쳐 건너뛰어요. NULL은 서로 같은 값으로 보지 않아 둘 다 들어가고, 정렬하면 NULL이 앞에 와요.`,card:`constraints`},{type:`explain`,id:`upsert`,title:`ON CONFLICT: 있으면 고치고 없으면 넣기`,body:"`INSERT … ON CONFLICT(열) DO UPDATE SET …`는 넣으려는 행이 그 열의 UNIQUE나 기본 키(행마다 달라야 하는 열)와 겹치면, 오류 대신 기존 행을 고쳐요. 겹치지 않는 행은 그냥 들어가요(업서트라고 해요). DO UPDATE 안에서 이름만 쓴 `n`(또는 `inv.n`)은 표에 이미 있는 값이고, `excluded.n`은 넣으려다 겹친 새 행의 값이에요. `DO NOTHING`을 쓰면 겹친 행은 건너뛰어요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE inv(item UNIQUE, n);
-- INSERT INTO inv VALUES('공',4);
-- INSERT INTO inv VALUES('컵',2);
INSERT INTO inv
VALUES('공',3),('펜',1)
ON CONFLICT(item)
DO UPDATE SET n = n + excluded.n;
SELECT item, n FROM inv
ORDER BY item;`,trace:["`VALUES('공',3),('펜',1)` → 공은 이미 있어 겹치고, 펜은 새 행이라 그대로 들어가요","`DO UPDATE SET n = n + excluded.n` → 겹친 공 행에서 기존 n 4에 새 값 3을 더해 7","`SELECT item, n FROM inv ORDER BY item;` → **공 | 7**, **컵 | 2**, **펜 | 1**"],output:`item | n
공 | 7
컵 | 2
펜 | 1
`,mistake:"`SET n = excluded.n`도 더해 줄 거라고 생각하기. 그건 기존 값을 버리고 새 값으로 덮어써요. 더하려면 `n + excluded.n`처럼 둘 다 적어요.",in_code:"AI가 쓴 동기화·집계 코드에서 `ON CONFLICT(key) DO UPDATE SET count = count + excluded.count`처럼 있으면 더하고 없으면 넣는 줄을 자주 봐요. 다른 데이터베이스는 `MERGE`나 `ON DUPLICATE KEY UPDATE`를 써요."},{type:`example`,id:`theory-sql-modify-ex4`,kind:`choice`,title:`메뉴 투표 다시 세기`,prompt:`SQL을 위에서부터 실행한 뒤 마지막 SELECT의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE vote(menu UNIQUE, n);
-- INSERT INTO vote VALUES('국',2);
-- INSERT INTO vote VALUES('밥',5);
INSERT INTO vote
VALUES('국',1),('죽',4)
ON CONFLICT(menu)
DO UPDATE SET n = excluded.n;
SELECT n FROM vote ORDER BY menu;`,output:`n
1
5
4
`,choices:[`[1, 5, 4]`,`[3, 5, 4]`,`[2, 5, 4]`,`[1, 5]`],answer:`[1, 5, 4]`,feedback:{"[3, 5, 4]":`SET n = excluded.n이 기존 값에 새 값을 더한다고 생각했나요?`,"[2, 5, 4]":`겹친 행은 DO UPDATE가 있어도 기존 값을 그대로 둔다고 생각했나요?`,"[1, 5]":`ON CONFLICT를 쓰면 겹치지 않는 새 행은 들어가지 않는다고 생각했나요?`},explanation:`국은 이미 있어 겹치고, DO UPDATE가 기존 값 2를 새 값 1로 덮어써요. 죽은 겹치지 않아 그대로 들어가서, 메뉴 순서(국, 밥, 죽)로 [1, 5, 4]예요.`,card:`upsert`},{type:`explain`,id:`delete-null`,title:`DELETE와 NOT IN의 NULL`,body:"`DELETE FROM 표 WHERE 조건`은 조건이 참인 행을 지우고, WHERE가 없으면 모든 행을 지워요. 조건은 SELECT의 WHERE와 같아서 1강의 NOT IN 함정도 그대로 나타나요. 하위 조회 목록에 NULL이 하나라도 있으면 NOT IN이 어느 행에서도 참이 되지 않아 아무것도 지워지지 않아요. 목록에서 NULL을 빼거나(`WHERE kid IS NOT NULL`) NOT EXISTS를 쓰면 의도대로 지워져요.",code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE kids(id);
-- INSERT INTO kids VALUES(1),(2);
-- INSERT INTO kids VALUES(3);
-- CREATE TABLE ride(kid);
-- INSERT INTO ride VALUES(2),(NULL);
DELETE FROM kids WHERE id NOT IN
  (SELECT kid FROM ride);
SELECT COUNT(*) FROM kids;
DELETE FROM kids WHERE id NOT IN
  (SELECT kid FROM ride
  WHERE kid IS NOT NULL);
SELECT id FROM kids;`,trace:["`id NOT IN (SELECT kid FROM ride)` → 목록이 (2, NULL)이라 1·3번도 `<> NULL`이 알 수 없음 → 지워지는 행이 없어요","`SELECT COUNT(*) FROM kids;` → 그대로 **3**","`WHERE kid IS NOT NULL` → 목록에서 NULL을 빼 (2)만 남기니 1·3번이 지워져요","`SELECT id FROM kids;` → **[2]**"],output:`COUNT(*)
3

id
2
`,mistake:`SELECT에서 결과가 비는 것과 DELETE에서 아무것도 안 지워지는 것은 별개라고 생각하기. 같은 조건이라, 실행 전에 같은 WHERE로 SELECT해서 대상 행을 먼저 확인해요.`,in_code:"AI가 쓴 정리 코드에서 `DELETE FROM … WHERE id NOT IN (SELECT …)`를 보면, 안쪽 열에 NULL이 들어올 수 있는지 먼저 확인해요. 그럴 수 있으면 NOT EXISTS로 바꾸는 편이 안전해요."},{type:`example`,id:`theory-sql-modify-ex5`,kind:`choice`,title:`빌린 적 없는 책 정리`,prompt:`SQL을 위에서부터 실행한 뒤 마지막 SELECT의 결과를 고르세요.`,code:`-- 입력 데이터 전체 (SQLite)
-- CREATE TABLE books(id);
-- INSERT INTO books VALUES(1),(2);
-- INSERT INTO books VALUES(3);
-- CREATE TABLE lend(book);
-- INSERT INTO lend VALUES(3),(NULL);
DELETE FROM books WHERE NOT EXISTS
  (SELECT 1 FROM lend
  WHERE lend.book = books.id);
SELECT id FROM books;`,output:`id
3
`,choices:[`[3]`,`[1, 2, 3]`,`[1, 2]`],answer:`[3]`,feedback:{"[1, 2, 3]":`안쪽 표에 NULL이 있으면 NOT EXISTS도 NOT IN처럼 아무 행도 지우지 못한다고 생각했나요?`,"[1, 2]":`NOT EXISTS가 짝이 있는 행을 지운다고 생각했나요?`},explanation:`NOT EXISTS는 책마다 대출 기록에 짝이 있는지 봐요. 3번은 짝이 있어 남고, 1·2번은 짝이 없어 지워져요. NULL 기록은 어느 책과도 짝이 되지 않을 뿐이에요.`,card:`delete-null`},{type:`summary`,points:["`UPDATE … SET … WHERE`와 `DELETE FROM … WHERE`는 WHERE가 참인 행만 바꾸거나 지우고, WHERE를 빼면 모든 행이 대상이에요. `SET n = n + 1`의 오른쪽 n은 바꾸기 전 값이에요.","`BEGIN` 뒤의 변경은 `COMMIT`으로 확정하고 `ROLLBACK`으로 되돌려요. 맞는 행이 없는 UPDATE는 오류가 아니라 0개 행을 바꿔요.","UNIQUE 열에는 같은 값을 다시 넣을 수 없지만 NULL은 여러 개 들어가요. `INSERT OR IGNORE`는 어기는 행만 건너뛰어요.","`ON CONFLICT(열) DO UPDATE SET n = n + excluded.n`에서 n은 기존 값, `excluded.n`은 새로 넣으려던 값이에요.","`NOT IN` 하위 조회에 NULL이 있으면 DELETE도 아무것도 지우지 못해요. NULL을 빼거나 NOT EXISTS를 써요."]}],covers:{"sql-change-01":[`update`],"sql-change-02":[`constraints`],"sql-change-03":[`transaction`,`update`],"sql-change-04":[`upsert`],"sql-change-05":[`delete-null`]}}]};export{e as default};