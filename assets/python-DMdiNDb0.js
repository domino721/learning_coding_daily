var e={schema_version:1,track_id:`python`,lang:`python`,lessons:[{id:`theory-pandas-select`,version:2,concept_id:`pandas-select`,title:`행·열 선택`,minutes:18,steps:[{type:`explain`,id:`table`,title:`pandas로 표 만들기`,body:'pandas(판다스)는 엑셀처럼 행과 열로 된 표 데이터를 다루는 Python 도구 묶음(라이브러리)이에요. `import pandas as pd`는 pandas를 불러와 `pd`라는 짧은 이름으로 쓰겠다는 뜻이에요. `pd.DataFrame({...})`의 중괄호 안에 `"열 이름": [값들]`을 쉼표로 이어 적으면(이런 묶음을 딕셔너리라고 해요) 열마다 값이 세로로 들어간 표, DataFrame(데이터프레임)이 돼요. 왼쪽의 0, 1, 2는 pandas가 붙인 행 이름(라벨)이고, `.shape`는 표의 크기를 (행 수, 열 수) 순서로 알려 줘요.',code:`import pandas as pd
walk = pd.DataFrame({
    "steps": [6400, 8100, 5300],
    "km": [4.2, 5.6, 3.7]})
print(walk)
print(walk.shape, walk.shape[1])`,trace:["`import pandas as pd` → pandas를 불러와 `pd`라는 이름으로 써요","`walk = pd.DataFrame({...})` → steps·km 두 열에 값이 세 개씩 든 표를 walk에 담아요. 리스트 하나에 든 값의 개수가 행 수가 돼요","`print(walk)` → 첫 줄은 열 이름, 왼쪽 0·1·2는 행 라벨이고, 행마다 한 줄씩 표 모양으로 나와요","`walk.shape` → 행 3개, 열 2개라 **(3, 2)**. 이렇게 괄호 안에 값을 묶은 것을 튜플이라고 해요. `walk.shape[1]`은 두 번째 값인 열 수라 **2**"],output:`   steps   km
0   6400  4.2
1   8100  5.6
2   5300  3.7
(3, 2) 2
`,mistake:"`shape`를 (열 수, 행 수)로 읽기. 앞이 행 수, 뒤가 열 수라서 `shape[0]`이 행 수, `shape[1]`이 열 수예요.",in_code:'AI가 쓴 분석 코드는 거의 늘 `import pandas as pd`로 시작하고, 표 이름은 흔히 `df`(DataFrame의 줄임)예요. `df = pd.read_csv("파일.csv")`로 파일을 표로 읽은 뒤 `print(df.shape)`로 행과 열이 몇 개인지 먼저 보는 줄을 자주 봐요.'},{type:`explain`,id:`select`,title:`대괄호 한 겹은 Series, 두 겹은 표`,body:'`표["열 이름"]`처럼 대괄호 한 겹에 열 이름을 넣으면 그 열 하나가 Series(시리즈)로 나와요. Series는 행 라벨이 붙은 값 한 줄이고, 어느 열에서 왔는지 그 이름을 `.name`에 기억하며, `.tolist()`로 라벨을 뗀 값만 Python 리스트(`[...]`처럼 값을 늘어놓은 묶음)로 바꿀 수 있어요. 대괄호를 두 겹 써서 `표[["km", "steps"]]`처럼 열 이름 리스트를 넣으면, 그 열들을 적은 순서대로 담은 새 DataFrame이 나와요. 열을 하나만 적은 `표[["km"]]`도 열이 하나인 DataFrame이고, 열만 골랐으니 행은 모두 남아요.',code:`import pandas as pd
walk = pd.DataFrame({
    "steps": [6400, 8100, 5300],
    "km": [4.2, 5.6, 3.7]})
print(walk["km"])
print(walk[["km"]].shape)`,trace:["`walk = pd.DataFrame({...})` → steps·km 두 열짜리 표예요",'`print(walk["km"])` → km 열이 Series로 나와요. 왼쪽은 행 라벨, 오른쪽은 값이고, `Name: km`은 이 Series의 이름(`.name`), `dtype: float64`는 값의 종류가 소수라는 뜻이에요','`walk[["km"]].shape` → 두 겹이라 행 3개, 열 1개인 DataFrame → **(3, 1)**'],output:`0    4.2
1    5.6
2    3.7
Name: km, dtype: float64
(3, 1)
`,mistake:'`walk[["km"]].tolist()`처럼 두 겹 결과에 `.tolist()`를 쓰기. 결과가 DataFrame이라 AttributeError(그런 기능이 없다는 오류)가 나요. 리스트가 필요하면 한 겹으로 `walk["km"].tolist()`라고 써요.',in_code:'`df["km"].tolist()`처럼 열을 리스트로 바꿔 출력하는 줄과, `report = df[["날짜", "거리"]]`처럼 필요한 열만 골라 새 표를 만드는 줄을 자주 봐요. `df.km`처럼 점 뒤에 열 이름을 적은 줄도 `df["km"]`와 같은 Series예요.'},{type:`explain`,id:`slice`,title:`loc은 라벨, iloc은 위치`,body:"행 라벨은 0, 1, 2만 있는 게 아니라 `index=[...]`로 직접 붙일 수 있어요. `.loc[...]`은 라벨 이름으로, `.iloc[...]`은 0부터 세는 위치로 골라요. 그래서 아래 fans에서 `fans.loc[2022]`는 라벨 2022의 값 45이고, `fans.iloc[2]`는 세 번째 값 52예요. 구간을 자를 때 `loc[a:b]`는 끝 라벨 b까지 포함하고, `iloc[i:j]`는 끝 위치 j 바로 앞까지만 담아요. 떨어진 라벨 몇 개만 고를 때는 `loc[[a, b]]`처럼 리스트를 넣어요.",code:`import pandas as pd
fans = pd.Series(
    [38, 45, 52, 61],
    index=[2021, 2022, 2023, 2024])
print(fans.loc[2022:2024].tolist())
print(fans.iloc[1:3].tolist())`,trace:["`fans = pd.Series(...)` → 연도를 라벨로 붙인 관객 수(만 명)예요. 라벨 2021~2024는 위치 0~3에 있어요","`fans.loc[2022:2024]` → 라벨 2022부터 끝 라벨 2024까지 포함해 **[45, 52, 61]**","`fans.iloc[1:3]` → 위치 1부터 3 바로 앞(위치 2)까지라 **[45, 52]**"],output:`[45, 52, 61]
[45, 52]
`,mistake:"loc과 iloc의 끝을 같게 읽기. `fans.iloc[1:3]`에는 위치 3의 61이 빠져요. 같은 세 값을 iloc으로 고르려면 끝을 하나 더 적어 `fans.iloc[1:4]`라고 써요.",in_code:"AI가 만든 예제 표에는 `index=[...]`로 번호나 날짜를 행 라벨로 붙인 경우가 많아요. 그런 표에서 `df.loc[3]`은 '라벨이 3인 행', `df.iloc[3]`은 '네 번째 행'이라 결과가 다를 수 있어요. 라벨에 없는 값을 loc에 넣으면 KeyError(그런 라벨이 없다는 오류)가 나요."},{type:`example`,id:`theory-pandas-select-ex1`,kind:`choice`,title:`날짜 라벨로 자르기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
rain = pd.Series(
    [13, 31, 6, 24, 19],
    index=[3, 4, 5, 6, 7])
print(rain.loc[4:6].tolist())`,output:`[31, 6, 24]
`,choices:[`[31, 6, 24]`,`[31, 6]`,`[31, 24]`,`[19]`],answer:`[31, 6, 24]`,feedback:{"[31, 6]":`loc도 iloc처럼 끝 라벨 6을 빼고 자른다고 생각했나요?`,"[31, 24]":`loc[4:6]이 라벨 4와 6 두 개만 고른다고 생각했나요?`,"[19]":`loc의 4와 6을 라벨이 아니라 몇 번째 위치로 생각했나요?`},explanation:`라벨 3~7은 위치 0~4에 붙어 있어요. loc[4:6]은 라벨 4부터 끝 라벨 6까지 포함하니 라벨 4·5·6의 값 [31, 6, 24]예요.`,card:`slice`},{type:`explain`,id:`rows-cols`,title:`행과 열을 함께 골라요`,body:"`표.loc[행, 열]`처럼 쉼표 앞에는 행, 뒤에는 열을 적으면 둘을 한 번에 골라요. 열 자리에 이름 리스트를 넣으면 적은 순서대로 열이 놓이고, `iloc`에서는 이름 대신 열의 위치 번호를 써요. 행 자리만 적은 `표.iloc[0]`은 첫 행 전체를 Series로 꺼내요. `.to_numpy().tolist()`는 표를 행마다 리스트로 묶은 리스트로 바꿔요.",code:`import pandas as pd
gym = pd.DataFrame({
    "kg": [61, 74, 58],
    "cm": [165, 180, 162]})
part = gym.loc[0:1, ["cm", "kg"]]
print(part.to_numpy().tolist())`,trace:["`gym = pd.DataFrame({...})` → 라벨 0·1·2에 몸무게(kg)와 키(cm)가 있는 표예요",'`part = gym.loc[0:1, ["cm", "kg"]]` → 라벨 0부터 끝 라벨 1까지의 행을 고르고, 열은 적은 순서대로 cm 다음 kg예요',"`part.to_numpy().tolist()` → 행마다 [cm, kg] 리스트 → **[[165, 61], [180, 74]]**"],output:`[[165, 61], [180, 74]]
`,mistake:'`gym.loc["kg"]`처럼 loc에 열 이름만 넣기. loc의 첫 자리는 행 라벨이라 "kg"라는 행을 찾다가 KeyError가 나요. 열만 고를 때는 `gym["kg"]`나, 모든 행을 뜻하는 `:`를 앞에 둔 `gym.loc[:, "kg"]`라고 써요.',in_code:'AI가 만든 예제 표에는 `"tag": list("xyz")`처럼 문자열을 `list()`에 넣어 `[\'x\', \'y\', \'z\']`로 한 글자씩 나눈 열이 자주 나와요. 그런 표에서 `df.loc[:, ["열1", "열2"]]`나 `df.iloc[:, [0, 2]]`로 필요한 열만 순서대로 골라요.'},{type:`example`,id:`theory-pandas-select-ex2`,kind:`choice`,title:`위치로 행과 열 고르기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
box = pd.DataFrame({
    "cm": [25, 41, 33],
    "kg": [2, 5, 3]})
part = box.iloc[1:3, [1, 0]]
print(part.to_numpy().tolist())`,output:`[[5, 41], [3, 33]]
`,choices:[`[[5, 41], [3, 33]]`,`[[41, 5], [33, 3]]`,`[[2, 25], [5, 41]]`,`[[5, 3], [41, 33]]`],answer:`[[5, 41], [3, 33]]`,feedback:{"[[41, 5], [33, 3]]":`열 위치를 [1, 0]으로 적어도 원래 표의 열 순서대로 나온다고 생각했나요?`,"[[2, 25], [5, 41]]":`iloc의 위치 번호가 1부터 시작한다고 생각했나요?`,"[[5, 3], [41, 33]]":`to_numpy().tolist()가 열마다 리스트를 만든다고 생각했나요?`},explanation:`iloc[1:3]은 위치 1과 2의 행이고, 열 위치 [1, 0]은 kg 다음 cm이에요. to_numpy().tolist()는 행마다 리스트를 만들어 [[5, 41], [3, 33]]이에요.`,card:`rows-cols`},{type:`explain`,id:`mask`,title:`참·거짓으로 행 고르기`,body:'`gym["cm"] >= 165`처럼 열을 값과 비교하면 행마다 True·False가 담긴 Series가 나와요(`>=`는 \'크거나 같다\', `==`는 \'같다\'예요). 이것을 `loc[조건, "열"]`의 행 자리에 넣으면 True인 행만 골라요. 열을 먼저 꺼내 `gym["kg"][조건]`처럼 걸어도 같은 값이 나와요. 조건 앞에 `~`를 붙인 `~tall`은 True와 False를 뒤집어 나머지 행을 골라요.',code:`import pandas as pd
gym = pd.DataFrame({
    "kg": [61, 74, 58],
    "cm": [165, 180, 162]})
tall = gym["cm"] >= 165
print(gym.loc[tall, "kg"].tolist())`,trace:["`gym = pd.DataFrame({...})` → 세 사람의 몸무게(kg)와 키(cm) 표예요",`\`tall = gym["cm"] >= 165\` → 행마다 비교한 [True, True, False]를 tall에 담아요. 165도 '크거나 같다'에 들어가요`,'`gym.loc[tall, "kg"]` → True인 라벨 0·1 행의 kg만 골라 **[61, 74]**'],output:`[61, 74]
`,mistake:'조건 Series를 출력하면 걸러진 값이 나온다고 생각하기. `print(tall.tolist())`는 [True, True, False]처럼 참·거짓만 보여 줘요. 값을 고르려면 `gym.loc[tall, "kg"]`처럼 표에 넣어야 해요.',in_code:'`df.loc[df["cm"] >= 165, "kg"]`처럼 조건을 이름에 담지 않고 대괄호 안에 바로 쓰는 줄이 흔해요. 안쪽의 비교가 먼저 계산돼 참·거짓 Series가 되고, 그다음 행을 골라요.'},{type:`explain`,id:`mask-label`,title:`참·거짓 Series는 라벨로 맞춰요`,body:"참·거짓 Series도 값마다 라벨을 달고 있어요. Series나 표에 참·거짓 Series를 넣으면 pandas는 적힌 순서가 아니라 같은 라벨끼리 짝을 지어 True인 라벨을 고르고, 결과는 원래 Series의 순서대로 나와요. `~`는 True와 False를 뒤집고, `.sum()`은 남은 값을 모두 더해요. 참·거짓을 그냥 리스트로 주면 라벨이 없으니 위치 순서대로 적용돼요.",code:`import pandas as pd
kg = pd.Series([61, 74, 58])
ok = pd.Series([True, False, True],
               index=[2, 0, 1])
print(kg[ok].tolist())
print(kg[~ok].sum())`,trace:["`kg = pd.Series([61, 74, 58])` → 라벨 0·1·2에 몸무게를 담아요","`ok = pd.Series(..., index=[2, 0, 1])` → 라벨 2는 True, 0은 False, 1은 True예요. 적힌 순서와 라벨 순서가 달라요","`kg[ok]` → 라벨끼리 맞춰 True인 라벨 1·2를 원래 순서대로 골라 **[74, 58]**","`kg[~ok].sum()` → 뒤집으면 라벨 0만 True라 61만 더해 **61**"],output:`[74, 58]
61
`,mistake:"참·거짓을 적힌 순서대로 첫째·둘째·셋째 값에 붙인다고 생각하기. 그러면 [61, 58]을 예상하지만, Series끼리는 라벨로 짝을 지어 [74, 58]이에요. `kg[[True, False, True]]`처럼 리스트로 줄 때만 위치 순서대로 [61, 58]이 나와요.",in_code:'다른 표에서 만든 조건 Series를 `df.loc[조건, "열"]`에 넣는 코드를 자주 봐요. 한쪽 표를 정렬했거나 라벨을 바꿨다면, 조건은 순서가 아니라 라벨로 맞춰진다는 점을 기억해요.'},{type:`example`,id:`theory-pandas-select-ex3`,kind:`choice`,title:`라벨이 섞인 조건`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
kcal = pd.Series([320, 180, 450])
sel = pd.Series([False, True, True],
                index=[1, 2, 0])
print(kcal[sel].tolist())`,output:`[320, 450]
`,choices:[`[320, 450]`,`[180, 450]`,`[180]`,`[450, 320]`],answer:`[320, 450]`,feedback:{"[180, 450]":`참·거짓을 적힌 순서대로 첫째·둘째·셋째 값에 붙인다고 생각했나요?`,"[180]":`False가 붙은 라벨의 값을 고른다고 생각했나요?`,"[450, 320]":`결과가 조건 Series에 적힌 라벨 순서대로 나온다고 생각했나요?`},explanation:`sel은 라벨 1이 False, 라벨 2와 0이 True예요. kcal과 라벨로 짝을 지으면 라벨 0과 2가 남고, 결과는 kcal의 원래 순서라 [320, 450]이에요.`,card:`mask-label`},{type:`explain`,id:`align`,title:`새 열도 라벨로 짝을 지어요`,body:'`표["새 열"] = Series`처럼 Series를 열로 넣으면, pandas는 값의 순서가 아니라 행 라벨이 같은 것끼리 짝을 지어 넣어요. 표에 있는데 Series에 없는 라벨 자리는 NaN(값이 비어 있다는 표시, 결측치)이 되고, 표에 없는 라벨의 값은 버려져요. `pd.Series({라벨: 값})`처럼 딕셔너리로 만들면 키가 라벨이 돼요. `.isna()`는 값마다 비어 있는지 True·False로 알려 주고, True는 1로 더해지니 `.sum()`이 빈 칸 수예요. `int()`는 결과를 보통 정수로 바꿔요.',code:`import pandas as pd
cup = pd.DataFrame({"n": [3, 5, 2]})
more = pd.Series({2: 7, 5: 8})
cup["tea"] = more
print(cup["tea"].tolist())
print(int(cup["tea"].isna().sum()))`,trace:['`cup = pd.DataFrame({"n": [3, 5, 2]})` → 라벨 0·1·2인 표예요',"`more = pd.Series({2: 7, 5: 8})` → 라벨 2에 7, 라벨 5에 8을 담아요",'`cup["tea"] = more` → 라벨 2만 짝이 있어 7이 들어가요. 라벨 0·1은 빈 칸이 되고, 표에 없는 라벨 5의 8은 버려져요','`cup["tea"].tolist()` → NaN은 리스트에서 nan으로 보이고, NaN이 섞이면 숫자가 소수가 돼요 → **[nan, nan, 7.0]**','`int(cup["tea"].isna().sum())` → [True, True, False]를 더해 **2**'],output:`[nan, nan, 7.0]
2
`,mistake:'Series의 값이 위에서부터 차례로 들어간다고 생각하기. 그러면 7과 8이 라벨 0·1에 들어갈 것 같지만, 라벨이 맞는 자리에만 들어가요. 순서대로 넣고 싶으면 `cup["tea"] = [7, 8, 9]`처럼 길이가 같은 리스트를 넣어요.',in_code:'다른 표에서 계산한 Series를 `df["새 열"] = ...`로 붙인 뒤 NaN이 생기는 일이 흔해요. 두 라벨이 다르기 때문이라 `.isna().sum()`으로 빈 칸 수를 먼저 확인해요. `print((a, b))`처럼 여러 값을 튜플로 묶어 출력하면 pandas의 숫자가 `np.int64(2)`처럼 보여서, `int()`로 감싸 2로 보이게 하는 줄도 자주 봐요.'},{type:`explain`,id:`reindex`,title:`reindex로 라벨 순서를 다시 정해요`,body:"`s.reindex([라벨들])`은 적은 라벨 순서대로 값을 다시 늘어놓은 새 Series를 돌려줘요. 원래 있던 라벨의 값은 그대로 따라오고, 원래 없던 라벨에는 NaN이 들어가요. `fill_value=0`을 주면 새로 생긴 라벨 자리만 0으로 채워요. 원래부터 비어 있던 값(만들 때 `None`을 넣은 값도 NaN이에요)은 '있던 라벨'이라 그대로 NaN으로 남아요.",code:`import pandas as pd
mm = pd.Series({4: None, 5: 6.5})
need = [5, 6, 4]
print(mm.reindex(need).tolist())
out = mm.reindex(need, fill_value=0)
print(out.tolist())`,trace:["`mm = pd.Series({4: None, 5: 6.5})` → 날짜(일)가 라벨인 강수량(mm)이에요. 4일은 측정하지 못해 None이 NaN으로 들어가요","`need = [5, 6, 4]` → 보고 싶은 날짜 순서예요. 6일은 원래 없던 라벨이에요","`mm.reindex(need)` → 5일, 6일, 4일 순서로 놓고, 없던 6일과 비어 있던 4일은 NaN → **[6.5, nan, nan]**","`out = mm.reindex(need, fill_value=0)` → 새로 생긴 6일 자리만 0으로 채워요","`out.tolist()` → 4일은 원래 있던 빈 값이라 그대로 → **[6.5, 0.0, nan]**"],output:`[6.5, nan, nan]
[6.5, 0.0, nan]
`,mistake:"`fill_value`가 모든 빈 값을 채운다고 생각하기. fill_value는 reindex로 새로 생긴 라벨에만 쓰여요. 원래 있던 빈 값까지 채우려면 빈 값을 채우는 기능(fillna)을 따로 써요.",in_code:"날짜별·지점별 보고서의 행 순서를 맞추려고 `df.reindex(정한_순서)`를 쓰는 코드를 자주 봐요. 빠진 날짜를 0으로 보일지, 빈 칸으로 둘지에 따라 fill_value를 정해요."},{type:`example`,id:`theory-pandas-select-ex4`,kind:`choice`,title:`다시 고른 라벨의 값`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
kg = pd.Series(
    [1.5, None, 4.0],
    index=[7, 8, 9])
want = [9, 10, 8]
new = kg.reindex(want, fill_value=0)
print(new.tolist())`,output:`[4.0, 0.0, nan]
`,choices:[`[4.0, 0.0, nan]`,`[4.0, 0.0, 0.0]`,`[4.0, nan, nan]`,`[1.5, nan, 4.0]`],answer:`[4.0, 0.0, nan]`,feedback:{"[4.0, 0.0, 0.0]":`fill_value가 원래 비어 있던 라벨 8까지 채운다고 생각했나요?`,"[4.0, nan, nan]":`fill_value를 줘도 새로 생긴 라벨 10이 빈 값으로 남는다고 생각했나요?`,"[1.5, nan, 4.0]":`reindex가 값의 순서는 그대로 두고 라벨 이름만 바꾼다고 생각했나요?`},explanation:`reindex는 라벨 9, 10, 8 순서로 값을 다시 놓아요. 라벨 9의 4.0이 그대로 오고, 새로 생긴 10만 0으로 채워지며, 원래 비어 있던 8은 NaN으로 남아요.`,card:`reindex`},{type:`explain`,id:`where`,title:`where는 조건에 맞지 않는 값만 바꿔요`,body:"`s.where(조건, 대체값)`은 조건이 True인 자리는 원래 값을 두고, False인 자리만 대체값으로 바꿔요. 값을 버리지 않아서 결과의 길이가 원래와 같아요. 대체값으로 Series를 주면 위치가 아니라 같은 라벨의 값을 가져와요. 대체값을 적지 않으면 False 자리가 NaN이 돼요.",code:`import pandas as pd
temp = pd.Series([21, -4, -8])
fix = pd.Series({2: 5, 1: 6, 0: 7})
up = temp > 0
print(temp.where(up, 0).tolist())
print(temp.where(up, fix).tolist())`,trace:["`temp = pd.Series([21, -4, -8])` → 라벨 0·1·2의 온도예요. 음수는 센서 오류라고 해요","`fix = pd.Series({2: 5, 1: 6, 0: 7})` → 예비 센서 값을 라벨 2부터 적었어요","`up = temp > 0` → [True, False, False]","`temp.where(up, 0)` → True인 21은 두고 False 자리는 0으로 → **[21, 0, 0]**","`temp.where(up, fix)` → False인 라벨 1·2는 fix에서 같은 라벨의 6·5를 가져와요 → **[21, 6, 5]**"],output:`[21, 0, 0]
[21, 6, 5]
`,mistake:`대체 Series의 값을 적힌 순서대로 가져온다고 생각하기. 그러면 라벨 1·2에 6·7이 들어갈 것 같지만, where는 라벨로 짝을 지어 6·5를 가져와요.`,in_code:"`age.where(age < 120)`처럼 말이 안 되는 값을 NaN으로 바꾸는 정리 코드를 자주 봐요. 행을 거르는 `age[age < 120]`과 달리 길이가 그대로라 다른 열과 행이 어긋나지 않아요."},{type:`example`,id:`theory-pandas-select-ex5`,kind:`choice`,title:`대체값을 고르는 기준`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
obs = pd.Series([-2, 7, -5])
alt = pd.Series({2: 4, 0: 1, 1: 9})
ok = obs > 0
print(obs.where(ok, alt).tolist())`,output:`[1, 7, 4]
`,choices:[`[1, 7, 4]`,`[4, 7, 9]`,`[-2, 9, -5]`,`[7]`],answer:`[1, 7, 4]`,feedback:{"[4, 7, 9]":`대체 Series의 값을 적힌 순서대로 가져온다고 생각했나요?`,"[-2, 9, -5]":`where가 조건이 True인 자리를 바꾼다고 생각했나요?`,"[7]":`where가 조건에 맞지 않는 값을 걸러 낸다고 생각했나요?`},explanation:`ok는 [False, True, False]예요. False인 라벨 0과 2는 alt에서 같은 라벨의 1과 4를 가져오고, True인 7은 그대로라 [1, 7, 4]예요.`,card:`where`},{type:`explain`,id:`types`,title:`isinstance로 종류를 확인해요`,body:'`isinstance(값, 종류)`는 값이 그 종류인지 True·False로 알려 줘요. 대괄호 한 겹으로 꺼낸 열은 `pd.Series`, 두 겹으로 꺼낸 것은 `pd.DataFrame` 종류예요. Python에서 True·False(bool)는 정수(int)의 한 종류라서 `isinstance(True, int)`도 True예요. `7.0`은 소수(float), `"7"`은 글자(str)라 int가 아니에요. 종류를 `(int, float)`처럼 괄호로 묶어(튜플) 주면 그중 하나만 맞아도 True예요.',code:`import pandas as pd
km = pd.Series([4.2, 5.6, 3.7])
print(isinstance(km, pd.Series))
print(isinstance(True, int))
print(isinstance(7.0, int))
print(isinstance(7.0, (int, float)))`,trace:["`km = pd.Series([4.2, 5.6, 3.7])` → Series를 하나 만들어요","`isinstance(km, pd.Series)` → km은 Series라 **True**","`isinstance(True, int)` → bool은 int의 한 종류라 **True**","`isinstance(7.0, int)` → 소수점이 있으면 float라 **False**","`isinstance(7.0, (int, float))` → int와 float 중 float가 맞아 **True**"],output:`True
True
False
True
`,mistake:'`isinstance("7", int)`가 True일 거라고 생각하기. 따옴표 안의 7은 글자(str)라 False예요. isinstance는 종류만 확인하고 값을 바꾸지 않아요. 숫자로 바꾸려면 `int("7")`처럼 따로 변환해요.',in_code:"AI가 쓴 입력 검사 코드에서 `isinstance(x, (int, float))`로 숫자만 통과시키는 줄을 자주 봐요. pandas 코드에서는 `isinstance(obj, pd.DataFrame)`으로 표가 들어왔는지 확인한 뒤 처리 방법을 나누기도 해요. 검사 결과 여러 개를 `print((a, b))`처럼 괄호로 한 번 더 묶어 출력하면 `(True, False)` 같은 튜플 한 줄로 나와요."},{type:`explain`,id:`comprehension`,title:`조건에 맞는 값만 담는 한 줄`,body:"`[x for x in 목록 if 조건]`은 목록에서 값을 하나씩 x로 꺼내, 조건이 True인 값만 담은 새 리스트를 만들어요(리스트 컴프리헨션이라고 해요). 대괄호 안이라 조건이 길면 줄을 바꿔 써도 돼요. 조건 두 개를 모두 만족해야 하면 `and`로 잇고, `not`은 True와 False를 뒤집어요. 그래서 bool을 빼고 싶을 때는 `not isinstance(x, bool)`을 붙여요.",code:`ans = [4, "4", 3.5, None, True]
print([x for x in ans
       if isinstance(x, int)])
print([x for x in ans
       if isinstance(x, int)
       and not isinstance(x, bool)])`,trace:['`ans = [4, "4", 3.5, None, True]` → 숫자, 글자, 소수, 빈 값, bool이 섞인 설문 응답이에요',"`[x for x in ans if isinstance(x, int)]` → int인 값만 담아요. True도 int라 함께 남아 **[4, True]**","`... and not isinstance(x, bool)` → int이면서 bool이 아닌 값만 남아 **[4]**"],output:`[4, True]
[4]
`,mistake:'`"4"`도 int로 남을 거라고 생각하기. 따옴표 안의 숫자는 str이라 `isinstance("4", int)`가 False예요. 숫자로 쓰려면 먼저 `int("4")`로 바꿔야 해요.',in_code:"데이터 정리 코드에서 `tidy = [v for v in raw if v is not None]`처럼 빈 값을 거르는 한 줄을 자주 봐요. `v is not None`은 'v가 None이 아니면'이라는 뜻이에요."},{type:`example`,id:`theory-pandas-select-ex6`,kind:`choice`,title:`종류로 거른 결과`,prompt:`아래 코드의 출력값을 고르세요.`,code:`vals = [3, False, 1.5, "2"]
num = (int, float)
keep = [v for v in vals
        if isinstance(v, num)]
print(keep)`,output:`[3, False, 1.5]
`,choices:[`[3, False, 1.5]`,`[3, 1.5]`,`[3, 1.5, '2']`,`[]`],answer:`[3, False, 1.5]`,feedback:{"[3, 1.5]":`False는 int가 아니라서 걸러진다고 생각했나요?`,"[3, 1.5, '2']":`따옴표 안의 숫자도 int나 float로 본다고 생각했나요?`,"[]":`튜플 (int, float)의 두 종류를 모두 만족해야 통과한다고 생각했나요?`},explanation:`num에 담은 (int, float)는 둘 중 하나만 맞으면 통과해요. False는 bool이고 bool은 int의 한 종류라 남고, "2"는 글자라 빠져서 [3, False, 1.5]예요.`,card:`types`},{type:`summary`,points:["`import pandas as pd`로 불러와 `pd.DataFrame({열 이름: 값 리스트})`로 표를 만들어요. `.shape`는 (행 수, 열 수)예요.",'`표["열"]`은 라벨과 이름(`.name`)을 가진 Series, `표[["열"]]`은 적은 순서대로 열을 고른 DataFrame이에요. `.tolist()`는 Series에 써요.',"`loc`은 라벨, `iloc`은 0부터 센 위치로 골라요. `loc[a:b]`는 끝 라벨을 포함하고 `iloc[i:j]`는 끝 위치를 빼요. `[행, 열]`로 함께 골라요.",'비교식은 참·거짓 Series를 만들고 `loc[조건, "열"]`은 True인 행만 골라요. 참·거짓 Series, 새 열, `where`의 대체값은 위치가 아니라 라벨로 짝을 지어요.',"짝이 없는 라벨은 NaN이 되고, `reindex(…, fill_value=0)`은 새로 생긴 라벨만 채워요.","`isinstance`에서 True·False도 int로 통과해요. `[x for x in 목록 if 조건]`은 조건이 참인 값만 담아요."]}],covers:{"pandas-select-01":[`table`,`select`,`rows-cols`],"pandas-select-02":[`table`,`select`],"pandas-select-03":[`slice`,`rows-cols`,`mask`,`mask-label`],"pandas-alignment-20261017":[`align`,`slice`],"pandas-reindex-fill-scope-20261025":[`reindex`,`align`,`slice`],"pandas-select-scaffold-01":[`select`],"pandas-select-scaffold-02":[`table`,`select`],"pandas-select-transfer-02":[`slice`,`rows-cols`],"pandas-mask-labels-20261019":[`mask`,`mask-label`],"python-column-types-20261021":[`select`,`types`],"python-bool-type-20261021":[`types`],"python-numeric-inputs-20261021":[`types`,`comprehension`],"pandas-where-labels-20261021":[`where`,`mask`,`slice`]}},{id:`theory-pandas-filter`,version:2,concept_id:`pandas-filter`,title:`조건 필터`,minutes:16,steps:[{type:`explain`,id:`compare`,title:`비교해서 행 거르기`,body:"`>`(크다), `>=`(크거나 같다), `<`(작다), `<=`(작거나 같다), `==`(같다), `!=`(다르다)로 열을 비교하면 행마다 True·False가 담긴 Series가 나와요. 이 Series를 `표[...]` 대괄호 안에 넣으면 True인 행만 남은 새 표가 돼요. `>=`는 기준값과 같은 값도 남기고, `>`는 기준값을 빼요. `len(표)`는 표의 행 수라서 몇 행이 남았는지 셀 때 써요.",code:`import pandas as pd
run = pd.DataFrame(
    {"km": [5, 21, 7, 3, 7]})
print((run["km"] >= 7).tolist())
print(len(run[run["km"] >= 7]))
print(len(run[run["km"] > 7]))`,trace:["`run = pd.DataFrame(...)` → 다섯 번 달린 거리(km) 표예요",'`run["km"] >= 7` → 행마다 비교한 참·거짓 → **[False, True, True, False, True]**','`run[run["km"] >= 7]` → True인 행 세 개만 남은 표, `len`으로 세면 **3**','`run[run["km"] > 7]` → 7과 같은 두 행이 빠지고 21만 남아 **1**'],output:`[False, True, True, False, True]
3
1
`,mistake:"`>=`와 `>`를 같은 뜻으로 읽기. 기준값과 딱 같은 7이 남는지가 달라요. '이상'은 `>=`, '초과'는 `>`, '이하'는 `<=`, '미만'은 `<`예요.",in_code:'`df[df["km"] >= 7]`처럼 대괄호 안에 같은 표 이름이 한 번 더 나오는 줄이 필터의 가장 흔한 모양이에요. 안쪽은 조건 Series를 만들고, 바깥 대괄호가 행을 걸러요.'},{type:`example`,id:`theory-pandas-filter-ex1`,kind:`choice`,title:`더운 날 고르기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
temp = pd.DataFrame({
    "day": [1, 2, 3, 4, 5],
    "c": [28, 31, 33, 25, 31]})
hot = temp[temp["c"] > 31]
print(hot["day"].tolist())`,output:`[3]
`,choices:[`[3]`,`[2, 3, 5]`,`[1, 4]`,`[2, 5]`],answer:`[3]`,feedback:{"[2, 3, 5]":`>가 기준값과 같은 31인 날도 남긴다고 생각했나요?`,"[1, 4]":`>를 '작다'로 거꾸로 읽어 31보다 작은 날만 남긴다고 생각했나요?`,"[2, 5]":`> 31을 31과 같은 값만 찾는 조건이라고 생각했나요?`},explanation:`> 31은 31보다 큰 값만 True라서 33도인 3일만 남아요. 31도인 2일과 5일은 >=를 써야 남아요.`,card:`compare`},{type:`explain`,id:`pick`,title:`거른 행에서 열 꺼내기`,body:'행을 거른 뒤 열을 꺼내는 방법은 세 가지이고, 결과는 모두 같은 Series예요. `표.loc[조건, "열"]`, 행을 먼저 거르는 `표[조건]["열"]`, 열을 먼저 꺼내는 `표["열"][조건]`이에요. 조건 Series는 행 라벨로 짝을 지으니 어느 순서로 써도 같은 행이 남아요. 마지막 열 자리를 `[["열"]]`로 두 겹 쓰면 결과가 DataFrame이 돼서 `.tolist()`를 쓸 수 없어요.',code:`import pandas as pd
run = pd.DataFrame({
    "day": ["토", "일", "토"],
    "km": [5, 21, 7]})
sat = run["day"] == "토"
print(run[sat]["km"].tolist())`,trace:["`run = pd.DataFrame({...})` → 요일과 거리 표예요",'`sat = run["day"] == "토"` → 글자도 `==`로 비교해요 → [True, False, True]','`run[sat]["km"]` → 토요일 두 행만 남긴 표에서 km 열을 꺼내요. `run.loc[sat, "km"]`, `run["km"][sat]`도 같아요 → **[5, 7]**'],output:`[5, 7]
`,mistake:'`run.loc["토", "km"]`처럼 조건 대신 찾는 값을 loc에 넣기. loc은 "토"라는 행 라벨을 찾다가 KeyError가 나요. 값으로 고를 때는 `run["day"] == "토"` 같은 조건을 넣어요.',in_code:'`df[df["요일"] == "토"]["거리"].sum()`처럼 거르고, 열을 꺼내고, 합계까지 한 줄에 잇는 코드를 자주 봐요. 예제 표에서는 `"요일": list("토일토")`처럼 문자열을 `list()`로 한 글자씩 나눠 열을 만들기도 해요.'},{type:`explain`,id:`and-or`,title:`조건 두 개를 &와 |로 묶어요`,body:"조건 Series 두 개는 `&`(그리고: 둘 다 True), `|`(또는: 하나라도 True)로 묶어요. 두 조건을 모두 만족하는 행도 `|`에서는 한 번만 남아요. 조건마다 괄호를 꼭 둘러요. `&`·`|`가 `>=` 같은 비교보다 먼저 계산되기 때문이에요. 1강에서 본 `~`는 조건 하나를 뒤집어요.",code:`import pandas as pd
day = pd.Series(["토", "일", "토"])
km = pd.Series([5, 21, 7])
sat = day == "토"
print(km[sat & (km >= 6)].tolist())
print(km[sat | (km >= 6)].tolist())`,trace:["`day`, `km` → 같은 라벨 0·1·2를 가진 요일과 거리예요",'`sat = day == "토"` → [True, False, True]',"`sat & (km >= 6)` → [True, False, True]와 [False, True, True]가 둘 다 True인 라벨 2만 남아 **[7]**","`sat | (km >= 6)` → 하나라도 True면 남아요. 둘 다 맞는 7도 한 번만 → **[5, 21, 7]**"],output:`[7]
[5, 21, 7]
`,mistake:"괄호를 빼고 `km[sat & km >= 6]`처럼 쓰기. `sat & km`이 먼저 계산돼 오류 없이 엉뚱한 결과(여기서는 빈 리스트)가 나와요. `and`·`or`를 쓰면 Series 전체를 참·거짓 하나로 바꾸려다 ValueError(값이 애매하다는 오류)가 나요.",in_code:'필터 코드에서 `df[(df["요일"] == "토") & (df["거리"] >= 6)]`처럼 괄호로 감싼 조건이 `&`나 `|`로 이어진 줄을 자주 봐요. 조건이 길면 `sat = ...`처럼 이름에 담아 두고 `df[sat & far]`로 쓰기도 해요.'},{type:`example`,id:`theory-pandas-filter-ex2`,kind:`choice`,title:`결제 기록 세기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
shop = pd.DataFrame({
    "day": list("토일월토화토"),
    "won": [52, 18, 64, 9, 71, 55]})
sat = shop["day"] == "토"
big = shop["won"] >= 45
print(len(shop[sat | big]))`,output:`5
`,choices:[`5`,`2`,`7`,`3`],answer:`5`,feedback:{2:`|가 두 조건을 모두 만족하는 행만 남긴다고 생각했나요?`,7:`두 조건을 모두 만족하는 행을 두 번 센다고 생각했나요?`,3:`|가 한쪽 조건만 만족하는 행만 남긴다고 생각했나요?`},explanation:`sat은 [True, False, False, True, False, True], big은 [True, False, True, False, True, True]예요. |는 하나라도 True인 행을 남기니 1번 행만 빠져 5행이고, 둘 다 True인 0번과 5번 행도 한 번씩만 세요.`,card:`and-or`},{type:`explain`,id:`between`,title:`between으로 구간 고르기`,body:'`s.between(a, b)`는 값마다 a 이상 b 이하인지 True·False로 알려 줘요. 양 끝을 넣을지는 `inclusive`로 정해요. `"both"`(기본값, 둘 다 포함), `"left"`(왼쪽 끝 a만), `"right"`(오른쪽 끝 b만), `"neither"`(둘 다 빼기)예요. \'5 이상 10 미만\'처럼 끝 하나만 빼야 하는 구간이면 기본값을 그대로 쓰면 안 돼요.',code:`import pandas as pd
km = pd.Series([5, 21, 7, 3, 10])
print(km.between(5, 10).tolist())
left = km.between(
    5, 10, inclusive="left")
print(left.tolist())`,trace:["`km = pd.Series([5, 21, 7, 3, 10])` → 달린 거리예요","`km.between(5, 10)` → 기본값은 양 끝 포함이라 5와 10도 True → **[True, False, True, False, True]**",'`left = km.between(5, 10, inclusive="left")` → 왼쪽 끝 5는 넣고 오른쪽 끝 10은 빼요',"`left.tolist()` → 10이 False로 바뀌어 **[True, False, True, False, False]**"],output:`[True, False, True, False, True]
[True, False, True, False, False]
`,mistake:`between이 양 끝을 빼고 사이만 고른다고 생각하기. 기본값 "both"는 5와 10을 모두 포함해요. 끝을 빼려면 inclusive를 직접 적어요.`,in_code:'`lo, hi = 5, 10`처럼 쉼표로 두 이름에 차례로 담은 뒤 `s.between(lo, hi)`로 쓰는 코드를 자주 봐요. `print(f"{lo}~{hi}km:", 결과)`처럼 f-문자열(따옴표 앞에 f를 붙이면 `{}` 자리에 값이 들어가요)로 기준과 함께 출력하기도 해요.'},{type:`example`,id:`theory-pandas-filter-ex3`,kind:`choice`,title:`키 구간 고르기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
cm = pd.Series([158, 160, 169, 170])
mid = cm.between(
    160, 170, inclusive="left")
print(cm[mid].tolist())`,output:`[160, 169]
`,choices:[`[160, 169]`,`[160, 169, 170]`,`[169]`,`[169, 170]`],answer:`[160, 169]`,feedback:{"[160, 169, 170]":`inclusive="left"도 오른쪽 끝 170을 포함한다고 생각했나요?`,"[169]":`"left"가 왼쪽 끝 160을 뺀다고 생각했나요?`,"[169, 170]":`"left"와 "right"의 뜻을 서로 바꿔 생각했나요?`},explanation:`inclusive="left"는 왼쪽 끝 160은 넣고 오른쪽 끝 170은 빼요. 그래서 160 이상 170 미만인 160과 169가 남아요.`,card:`between`},{type:`explain`,id:`isin`,title:`isin으로 목록에 있는 값 고르기`,body:"`s.isin([후보들])`은 값마다 후보 목록 안에 있는지 True·False로 알려 줘요. 결과는 원래와 길이가 같은 참·거짓 Series라서, 행을 고르려면 다시 `s[...]`에 넣어요. 후보로 Series를 주면 그 Series의 라벨은 보지 않고 값만 후보로 써요. 고른 결과의 `.index.tolist()`는 값이 아니라 행 라벨 목록이에요.",code:`import pandas as pd
mm = pd.Series([240, 255, 270, 255])
print(mm.isin([255, 270]).tolist())
sold = pd.Series([270, 255])
hit = mm.isin(sold)
print(mm[hit].index.tolist())`,trace:["`mm = pd.Series([240, 255, 270, 255])` → 신발 치수(mm)예요","`mm.isin([255, 270])` → 값마다 목록에 있는지 → **[False, True, True, True]**","`sold = pd.Series([270, 255])` → 라벨 0·1에 270·255를 담은 후보예요","`hit = mm.isin(sold)` → sold의 라벨은 보지 않고 값 270·255만 후보로 써서 위와 같은 [False, True, True, True]","`mm[hit].index.tolist()` → 고른 행의 라벨 → **[1, 2, 3]**"],output:`[False, True, True, True]
[1, 2, 3]
`,mistake:"isin이 목록에 있는 값만 모아 돌려준다고 생각하기. 결과는 원래 길이 그대로의 True·False라서, 값이 필요하면 `mm[mm.isin([...])]`처럼 다시 걸러요. 목록에 없는 값을 고를 때는 `~mm.isin([...])`처럼 `~`로 뒤집어요.",in_code:'`df[df["지역"].isin(["서울", "부산"])]`처럼 여러 값 중 하나인 행을 고르는 줄을 자주 봐요. `==`를 `|`로 여러 번 잇는 것보다 짧고, 앞에 `~`를 붙이면 그 목록을 빼는 필터가 돼요.'},{type:`example`,id:`theory-pandas-filter-ex4`,kind:`choice`,title:`지역 라벨 고르기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
city = pd.Series(
    ["부산", "대구", "부산"],
    index=[31, 32, 33])
far = ~city.isin(["대구"])
print(city[far].index.tolist())`,output:`[31, 33]
`,choices:[`[31, 33]`,`[32]`,`['부산', '부산']`,`[0, 2]`],answer:`[31, 33]`,feedback:{"[32]":`~가 붙어도 목록에 있는 값을 고른다고 생각했나요?`,"['부산', '부산']":`index.tolist()가 라벨이 아니라 값을 돌려준다고 생각했나요?`,"[0, 2]":`index가 0부터 센 위치를 돌려준다고 생각했나요?`},explanation:`isin(["대구"])는 [False, True, False]이고 ~로 뒤집으면 [True, False, True]예요. 고른 두 행의 라벨 31과 33이 출력돼요.`,card:`isin`},{type:`explain`,id:`isin-table`,title:`표 전체에 isin 쓰기`,body:'DataFrame에 `isin([후보들])`을 쓰면 칸마다 후보에 있는지 확인해, 원래와 같은 크기의 True·False 표를 돌려줘요. 행을 지우거나 한 행을 하나로 합치지 않아요. `isin({"열": [후보], ...})`처럼 딕셔너리를 주면 열마다 자기 후보와만 비교해요(딕셔너리에 없는 열은 모두 False). `.all(axis=1)`은 한 행의 모든 칸이 True인지 행마다 하나로 줄여요. `.values.tolist()`는 1강의 `.to_numpy().tolist()`처럼 표를 행마다 리스트로 바꿔요.',code:`import pandas as pd
ans = pd.DataFrame(
    {"q1": [2, 3], "q2": [4, 4]})
print(ans.isin([4]).values.tolist())
key = {"q1": [2], "q2": [4]}
print(ans.isin(key).all(axis=1))`,trace:["`ans = pd.DataFrame(...)` → 두 학생이 문제 q1·q2에 고른 답 번호예요","`ans.isin([4]).values.tolist()` → 모든 칸을 같은 후보 [4]와 비교 → **[[False, True], [False, True]]**",'`key = {"q1": [2], "q2": [4]}` → 열마다 정답을 따로 정한 딕셔너리예요',"`ans.isin(key).all(axis=1)` → q1은 [2]와, q2는 [4]와 비교해 [[True, True], [False, True]]가 되고, 행마다 모두 True인지 줄이면 0번 **True**, 1번 **False**"],output:`[[False, True], [False, True]]
0     True
1    False
dtype: bool
`,mistake:"isin 결과가 조건에 맞는 행만 남긴 표라고 생각하기. isin은 칸마다 True·False를 채운 같은 크기의 표예요. 행을 고르려면 `ans[ans.isin(key).all(axis=1)]`처럼 행마다 하나로 줄인 뒤 다시 넣어요.",in_code:"검사 코드에서 `df[df.isin(허용값).all(axis=1)]`로 모든 열이 허용된 값인 행만 남기는 줄을 자주 봐요. 한 칸이라도 맞으면 되는 경우는 `.any(axis=1)`을 써요."},{type:`example`,id:`theory-pandas-filter-ex5`,kind:`choice`,title:`채점 결과 세기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
ans = pd.DataFrame({
    "q1": [2, 2, 3, 2],
    "q2": [4, 1, 4, 4]})
key = {"q1": [2], "q2": [4]}
ok = ans.isin(key).all(axis=1)
print(ans[ok].index.tolist())`,output:`[0, 3]
`,choices:[`[0, 3]`,`[0, 1, 2, 3]`,`[0, 1, 3]`,`[0, 2, 3]`],answer:`[0, 3]`,feedback:{"[0, 1, 2, 3]":`all(axis=1)이 한 칸만 맞아도 True라고 생각했나요?`,"[0, 1, 3]":`all(axis=1)이 첫 번째 열 q1만 본다고 생각했나요?`,"[0, 2, 3]":`all(axis=1)이 마지막 열 q2만 본다고 생각했나요?`},explanation:`isin(key)는 q1을 [2]와, q2를 [4]와 비교해요. 두 칸이 모두 True인 행은 0번과 3번이라 그 라벨 [0, 3]이 나와요.`,card:`isin-table`},{type:`explain`,id:`where`,title:`where는 거르지 않고 바꿔요`,body:"조건으로 거르는 `s[조건]`은 False인 값을 빼서 길이가 줄어요. `s.where(조건, 대체값)`은 아무것도 빼지 않고 False인 자리만 대체값으로 바꿔서 길이가 그대로예요. 1강에서 본 where와 같은 기능이에요. True인 자리의 원래 값은 그대로 남아요.",code:`import pandas as pd
speed = pd.Series([52, 71, 48, 88])
ok = speed <= 60
print(speed[ok].tolist())
print(speed.where(ok, 60).tolist())`,trace:["`speed = pd.Series([52, 71, 48, 88])` → 측정한 속도예요","`ok = speed <= 60` → [True, False, True, False]","`speed[ok]` → False인 값이 빠져 두 개만 남아 **[52, 48]**","`speed.where(ok, 60)` → False 자리만 60으로 바꿔 네 개 그대로 → **[52, 60, 48, 60]**"],output:`[52, 48]
[52, 60, 48, 60]
`,mistake:`where가 조건이 True인 자리를 바꾼다고 생각하기. 반대로 True는 그대로 두고 False만 바꿔요. 조건에는 '바꿀 값'이 아니라 '남길 값'을 적는다고 기억해요.`,in_code:'`df["속도"] = df["속도"].where(df["속도"] <= 60, 60)`처럼 상한을 넘는 값을 잘라 같은 열에 다시 담는 줄을 자주 봐요. 길이가 그대로라 다른 열과 행이 어긋나지 않아요.'},{type:`explain`,id:`duplicated`,title:`duplicated로 중복 표시하기`,body:'`s.duplicated()`는 값마다 같은 값이 앞에 이미 나왔는지 True·False로 표시해요. 기본값 `keep="first"`는 처음 나온 것만 빼고 그 뒤에 다시 나온 것을 True로, `keep="last"`는 마지막 것만 빼고 그 앞의 것을 True로 표시해요. `keep=False`는 남길 하나를 정하지 않아 중복 묶음 전체를 True로 표시해요. 표에서는 `표.duplicated(subset=["열"])`처럼 비교할 열을 정하고, 적지 않으면 모든 열이 같아야 중복이에요.',code:`import pandas as pd
seat = pd.Series(["A1", "B2", "A1"])
print(seat.duplicated().tolist())
last = seat.duplicated(keep="last")
both = seat.duplicated(keep=False)
print(last.tolist(), both.sum())`,trace:['`seat = pd.Series(["A1", "B2", "A1"])` → 예약된 좌석 번호예요. A1이 두 번 있어요',"`seat.duplicated()` → 두 번째로 나온 A1만 True → **[False, False, True]**",'`last = seat.duplicated(keep="last")` → 마지막 A1은 두고 앞의 A1을 True로 표시해요',"`both = seat.duplicated(keep=False)` → A1 두 개를 모두 True로 표시해 [True, False, True]예요","`print(last.tolist(), both.sum())` → last는 그대로, both는 True 개수를 세어 **[True, False, False] 2**"],output:`[False, False, True]
[True, False, False] 2
`,mistake:"`keep=False`를 '아무것도 표시하지 않기'로 읽기. False는 '남길 하나를 정하지 않는다'는 뜻이라 중복 묶음 전체가 True예요.",in_code:'`df[df.duplicated(subset=["전화"], keep=False)]`처럼 중복된 행을 모두 모아 확인하거나, `df[~df.duplicated()]`로 처음 나온 행만 남기는 정리 코드를 자주 봐요.'},{type:`example`,id:`theory-pandas-filter-ex6`,kind:`choice`,title:`중복 표시 확인`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
who = pd.Series(list("kjkk"))
again = who.duplicated(keep="last")
print(again.tolist())`,output:`[True, False, True, False]
`,choices:[`[True, False, True, False]`,`[False, False, True, True]`,`[True, False, True, True]`,`[False, False, False, True]`],answer:`[True, False, True, False]`,feedback:{"[False, False, True, True]":`keep="last"도 처음 나온 것을 남기고 뒤의 것을 표시한다고 생각했나요?`,"[True, False, True, True]":`keep="last"가 마지막 k까지 중복으로 표시한다고 생각했나요?`,"[False, False, False, True]":`keep="last"가 마지막에 나온 값만 True로 표시한다고 생각했나요?`},explanation:`keep="last"는 같은 값 묶음에서 마지막 하나만 False로 두고 나머지를 True로 표시해요. k는 0·2·3번에 있으니 0번과 2번이 True이고, j는 한 번뿐이라 False예요.`,card:`duplicated`},{type:`explain`,id:`query`,title:`query로 조건을 글자로 쓰기`,body:'`표.query("조건")`은 조건을 따옴표 안의 글자로 받아 True인 행만 남겨요. 따옴표 안에서는 열 이름을 그대로 쓰고, 바깥의 Python 변수는 앞에 `@`를 붙여 가리켜요. `@`를 빼면 pandas가 그 이름을 열에서 찾다가 없어서 오류를 내요. 따옴표 안에서는 `and`·`or`를 쓸 수 있고, `5 <= km < 10`처럼 비교를 이어 쓸 수도 있어요.',code:`import pandas as pd
run = pd.DataFrame(
    {"km": [5, 21, 7, 3]})
lo, hi = 5, 10
got = run.query("@lo <= km < @hi")
print(got["km"].tolist())`,trace:["`run = pd.DataFrame(...)` → 달린 거리 표예요","`lo, hi = 5, 10` → 쉼표로 두 이름에 차례로 담아요. lo는 5, hi는 10이에요",'`run.query("@lo <= km < @hi")` → km은 열 이름, `@lo`·`@hi`는 바깥 변수라 5 이상 10 미만인 행만 남겨요','`got["km"].tolist()` → **[5, 7]**'],output:`[5, 7]
`,mistake:'`run.query("km < hi")`처럼 @를 빼기. pandas가 hi를 열 이름으로 찾다가 없어서 UndefinedVariableError(정의되지 않은 이름이라는 오류)가 나요.',in_code:'`df.query("km >= @goal")`처럼 조건을 글자로 쓰는 코드를 자주 봐요. 여기의 `@`는 query 문자열 안에서 바깥 변수를 가리키는 표시일 뿐, 다른 곳의 `@`와는 상관없어요.'},{type:`summary`,points:["비교식(`>`, `>=`, `==` …)은 참·거짓 Series를 만들고, `표[조건]`은 True인 행만 남겨요. `>=`는 기준값을 포함하고 `>`는 빼요. `len(표)`는 행 수예요.",'`표.loc[조건, "열"]`, `표[조건]["열"]`, `표["열"][조건]`은 같은 Series예요. 값을 `loc`의 행 자리에 넣으면 라벨로 찾다가 KeyError가 나요.',"조건은 괄호로 감싸 `&`(둘 다), `|`(하나라도)로 묶고, `~`로 뒤집어요.",'`between(a, b)`는 양 끝을 포함하고, `inclusive`로 "left"·"right"·"neither"를 골라요.',"`isin`은 값마다 후보에 있는지 같은 길이(표는 같은 크기)로 알려 줘요. 딕셔너리는 열마다 후보를 따로 정하고, `.all(axis=1)`은 행마다 하나로 줄여요.","`where`는 False 자리만 바꿔 길이가 그대로예요. `duplicated`는 `keep`으로 남길 하나를 정하고, `query`에서 바깥 변수는 `@`를 붙여요."]}],covers:{"pandas-filter-01":[`compare`],"pandas-filter-02":[`compare`],"pandas-filter-03":[`between`,`pick`,`query`],"pandas-duplicate-members-20261024":[`duplicated`,`pick`],"pandas-filter-scaffold-01":[`compare`,`pick`],"pandas-filter-scaffold-02":[`and-or`,`compare`],"pandas-filter-transfer-02":[`and-or`,`isin`,`compare`,`pick`],"pandas-union-filter-20261019":[`and-or`,`compare`,`pick`],"pandas-where-values-20261021":[`where`],"pandas-isin-values-20261021":[`isin`],"pandas-isin-labels-20261021":[`isin`],"pandas-isin-cells-20261023":[`isin-table`],"pandas-isin-column-rules-20261023":[`isin-table`],"pandas-isin-cross-columns-20261023":[`isin-table`],"pandas-paid-amounts-form-01":[`pick`,`compare`],"pandas-query-at-01":[`query`,`compare`]}},{id:`theory-pandas-null`,version:1,concept_id:`pandas-null`,title:`결측치 처리`,minutes:15,steps:[{type:`explain`,id:`nan`,title:`빈 값 NaN 세기`,body:"데이터에서 비어 있는 값을 결측치라고 하고, pandas는 이것을 NaN(Not a Number, 숫자가 아님)으로 표시해요. 숫자 Series에 `None`을 넣으면 NaN으로 바뀌고, NaN이 섞인 숫자는 모두 소수(float)가 돼요. `.isna()`는 값마다 비어 있는지, `.notna()`는 값이 있는지 True·False로 알려 주고, `.sum()`을 붙이면 그 개수예요. `.count()`는 값이 있는 칸 수, `len()`은 빈 칸까지 센 전체 길이이고, `.sum()`·`.mean()`은 NaN을 빼고 계산해요. 0은 빈 값이 아니라 0이라는 값이에요.",code:`import pandas as pd
rain = pd.Series([6, None, 0, 9])
print(rain.tolist())
print(rain.isna().sum())
print(rain.count(), len(rain))
print(rain.sum(), rain.mean())`,trace:["`rain = pd.Series([6, None, 0, 9])` → 나흘 동안의 강수량(mm)이에요. 이틀째는 측정하지 못했고, 사흘째는 비가 오지 않아 0이에요","`rain.tolist()` → None은 NaN이 되고 숫자는 소수로 바뀌어 **[6.0, nan, 0.0, 9.0]**","`rain.isna().sum()` → [False, True, False, False]의 True 개수 **1**","`rain.count(), len(rain)` → 값이 있는 칸 3개, 전체 4칸 → **3 4**","`rain.sum(), rain.mean()` → NaN을 빼고 6 + 0 + 9 = 15, 평균은 15 ÷ 3 → **15.0 5.0**"],output:`[6.0, nan, 0.0, 9.0]
1
3 4
15.0 5.0
`,mistake:"평균의 분모를 전체 길이로 생각하기. `mean()`은 값이 있는 3칸으로 나눠 5.0이에요. 15 ÷ 4 = 3.75는 빈 값을 0으로 채운 뒤의 평균이에요.",in_code:"데이터를 읽은 뒤 `df.isna().sum()`으로 열마다 빈 칸이 몇 개인지 먼저 확인하는 줄을 자주 봐요. 평균을 `합계 / len(...)`으로 직접 나누는 코드는 빈 값이 있으면 `mean()`과 결과가 달라요."},{type:`example`,id:`theory-pandas-null-ex1`,kind:`choice`,title:`두 가지 평균`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
ea = pd.Series([3, None, 0, 6])
print(ea.mean(), ea.sum() / len(ea))`,output:`3.0 2.25
`,choices:[`3.0 2.25`,`2.25 2.25`,`3.0 3.0`,`4.5 2.25`],answer:`3.0 2.25`,feedback:{"2.25 2.25":`mean()도 빈 칸까지 센 전체 길이로 나눈다고 생각했나요?`,"3.0 3.0":`len()이 빈 칸을 빼고 센다고 생각했나요?`,"4.5 2.25":`0도 빈 값처럼 평균에서 빠진다고 생각했나요?`},explanation:`mean()은 NaN을 빼고 값이 있는 3, 0, 6의 합 9를 3으로 나눠 3.0이에요. len()은 빈 칸까지 센 4라서 9 ÷ 4 = 2.25예요.`,card:`nan`},{type:`explain`,id:`fillna`,title:`fillna는 새 결과를 돌려줘요`,body:'`s.fillna(0)`은 비어 있는 자리만 0으로 채운 새 Series를 돌려줘요. 원래 s는 바뀌지 않아서, 결과를 쓰려면 `s = s.fillna(0)`처럼 이름에 다시 담아야 해요. 표의 열이면 `df["열"] = df["열"].fillna(0)`처럼 같은 열에 다시 넣어요. 0으로 채우면 그 칸도 평균의 분모에 들어가서 평균이 달라져요.',code:`import pandas as pd
rain = pd.Series([6, None, 0, 9])
rain.fillna(0)
print(rain.isna().sum())
rain = rain.fillna(0)
print(rain.tolist(), rain.mean())`,trace:["`rain = pd.Series([6, None, 0, 9])` → 앞 카드와 같은 강수량이에요","`rain.fillna(0)` → 빈 자리를 채운 새 Series를 만들지만, 아무 데도 담지 않아 그대로 사라져요","`rain.isna().sum()` → rain은 그대로라 빈 칸이 여전히 **1**","`rain = rain.fillna(0)` → 채운 결과를 rain에 다시 담아요","`rain.tolist(), rain.mean()` → 네 칸 모두 값이 있어 15 ÷ 4 → **[6.0, 0.0, 0.0, 9.0] 3.75**"],output:`1
[6.0, 0.0, 0.0, 9.0] 3.75
`,mistake:"`rain.fillna(0)`만 쓰고 rain이 채워졌다고 생각하기. pandas의 많은 메서드(점 뒤에 붙여 부르는 기능)는 원본을 고치지 않고 새 결과를 돌려줘요. 돌려받은 값을 담지 않으면 그대로 사라져요.",in_code:'`df["강수량"] = df["강수량"].fillna(0)`처럼 같은 열에 다시 담는 줄을 자주 봐요. 예전 코드에는 `fillna(0, inplace=True)`처럼 원본을 직접 고치는 옵션도 보이지만, 요즘은 다시 담는 방식을 권해요.'},{type:`example`,id:`theory-pandas-null-ex2`,kind:`choice`,title:`채운 결과는 어디에`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
kg = pd.Series([1.5, None, 3.5])
full = kg.fillna(1)
kg.fillna(0)
print(kg.count(), full.count())`,output:`2 3
`,choices:[`2 3`,`3 3`,`2 2`,`3 2`],answer:`2 3`,feedback:{"3 3":`다시 담지 않은 kg.fillna(0)도 kg의 빈 칸을 채운다고 생각했나요?`,"2 2":`fillna(1)의 결과를 담은 full에도 빈 칸이 남는다고 생각했나요?`,"3 2":`fillna가 원본 kg를 고치고 full에는 원래 값이 담긴다고 생각했나요?`},explanation:`fillna는 채운 새 Series를 돌려줄 뿐 원본을 바꾸지 않아요. full에는 채운 결과가 담겨 세 칸 모두 값이 있고, kg는 그대로라 count()가 2예요.`,card:`fillna`},{type:`explain`,id:`dropna`,title:`dropna로 빈 값이 있는 행 빼기`,body:'`df.dropna()`는 기본값이 `how="any"`라서 빈 칸이 하나라도 있는 행을 뺀 새 표를 돌려줘요. `how="all"`을 주면 모든 칸이 비어 있는 행만 빼요. 열은 그대로이고 행만 줄어들며, 남은 행의 라벨도 그대로예요.',code:`import pandas as pd
log = pd.DataFrame({
    "kg": [64, 66, None, None],
    "cm": [171, None, 168, None]})
print(len(log.dropna()))
print(len(log.dropna(how="all")))`,trace:["`log = pd.DataFrame({...})` → 몸무게(kg)와 키(cm) 기록이에요. 1번은 cm, 2번은 kg, 3번은 둘 다 비어 있어요","`log.dropna()` → 한 칸이라도 빈 1·2·3번을 빼고 0번만 남아 **1**",'`log.dropna(how="all")` → 두 칸이 모두 빈 3번만 빼서 **3**'],output:`1
3
`,mistake:`dropna가 빈 칸만 지우고 그 행의 다른 값은 남긴다고 생각하기. 표에서 칸 하나만 지울 수는 없어서 행 전체가 빠지고, 다른 열의 값도 함께 사라져요.`,in_code:"`df = df.dropna()`처럼 다시 담는 줄을 자주 봐요. fillna처럼 새 표를 돌려주기 때문이에요. 행이 얼마나 줄었는지 앞뒤의 `len(df)`를 비교해 보는 것이 좋아요."},{type:`explain`,id:`subset`,title:`subset으로 볼 열 정하기`,body:'`df.dropna(subset=["열"])`은 적은 열만 보고, 그 열이 빈 행만 빼요. 열을 여러 개 적으면 기본값 `how="any"`라 그중 하나라도 빈 행이 빠지고, `how="all"`이면 적은 열이 모두 빈 행만 빠져요. 두 열을 적은 `dropna(subset=["열1", "열2"])`와 같은 행은 `df[df["열1"].notna() & df["열2"].notna()]`처럼 \'값이 있다\' 조건을 `&`로 묶어서도 고를 수 있어요.',code:`import pandas as pd
log = pd.DataFrame({
    "kg": [64, 66, None, None],
    "cm": [171, None, 168, None]})
sub = log.dropna(subset=["kg"])
print(sub.index.tolist())`,trace:["`log = pd.DataFrame({...})` → kg가 빈 행은 2·3번, cm가 빈 행은 1·3번이에요",'`sub = log.dropna(subset=["kg"])` → kg만 보고 kg가 빈 2·3번을 빼요. 1번은 cm가 비었지만 kg가 있어 남아요',"`sub.index.tolist()` → 남은 행의 라벨 → **[0, 1]**"],output:`[0, 1]
`,mistake:`subset을 정해도 다른 열의 빈 칸 때문에 행이 빠진다고 생각하기. subset에 적은 열만 봐서, cm가 빈 1번 행도 남아요.`,in_code:'`df.dropna(subset=["날짜", "거리"])`처럼 꼭 있어야 하는 열만 정해 행을 빼는 줄을 자주 봐요. 예제 데이터에는 `[5., None]`처럼 끝에 점만 찍은 숫자가 보이는데, `5.`는 5.0과 같은 소수예요.'},{type:`explain`,id:`fill-dict`,title:`열마다 채우고, 순서도 정해요`,body:'`df.fillna({"열": 값})`처럼 딕셔너리를 주면 적은 열의 빈 칸만 그 값으로 채우고, 나머지 열의 빈 칸은 그대로 둬요. 채우기와 빼기는 순서가 중요해요. 먼저 채우면 그 칸은 더 이상 비어 있지 않아서 뒤의 dropna가 그 행을 빼지 않아요. 원래 있던 0도 빈 값이 아니라서 dropna가 빼지 않아요.',code:`import pandas as pd
log = pd.DataFrame({
    "kg": [64, 66, None, None],
    "cm": [171, None, 168, None]})
fix = log.fillna({"cm": 0})
print(fix.dropna().index.tolist())`,trace:["`log = pd.DataFrame({...})` → 1번은 cm, 2번은 kg, 3번은 둘 다 비어 있어요",'`fix = log.fillna({"cm": 0})` → cm의 빈 칸(1·3번)만 0으로 채우고 kg의 빈 칸은 그대로 둬요',"`fix.dropna().index.tolist()` → 남은 빈 칸은 kg의 2·3번뿐이라 그 두 행만 빠져 **[0, 1]**"],output:`[0, 1]
`,mistake:'채운 뒤에 빼든, 뺀 뒤에 채우든 같다고 생각하기. `log.dropna().fillna({"cm": 0})`은 1번 행을 먼저 빼 버려서 [0]만 남아요. 순서를 바꾸면 남는 행이 달라져요.',in_code:`\`df.fillna({"메모": "", "수량": 0})\`처럼 열마다 알맞은 기본값을 한 번에 채우는 줄을 자주 봐요. 빈 값을 0으로 볼지, 그 행을 뺄지는 데이터의 뜻을 보고 정해요. 예제 표에 보이는 \`list("가나다")\`는 글자를 하나씩 나눈 \`['가', '나', '다']\`예요.`},{type:`example`,id:`theory-pandas-null-ex3`,kind:`choice`,title:`두 열을 보고 빼기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
bag = pd.DataFrame({
    "won": [9, None, 4, None],
    "ea": [0, 2, None, None]})
cols = ["won", "ea"]
ok = bag.dropna(subset=cols)
print(ok.index.tolist())`,output:`[0]
`,choices:[`[0]`,`[0, 1, 2]`,`[]`,`[0, 2]`],answer:`[0]`,feedback:{"[0, 1, 2]":`subset에 열 두 개를 적으면 두 열이 모두 빈 행만 뺀다고 생각했나요?`,"[]":`ea의 0도 빈 값이라 0번 행도 빠진다고 생각했나요?`,"[0, 2]":`subset에 적은 첫 번째 열 won만 본다고 생각했나요?`},explanation:`기본값 how="any"라 won과 ea 중 하나라도 빈 행이 빠져요. ea의 0은 빈 값이 아니라 0번 행은 남고, 1·2·3번은 빈 칸이 있어 빠져 [0]이에요.`,card:`subset`},{type:`explain`,id:`map`,title:`map으로 바꿀 때 생기는 빈 값`,body:"`s.map({원래 값: 새 값})`은 값마다 딕셔너리에서 같은 키를 찾아, 짝지은 값으로 바꾼 새 Series를 돌려줘요. 딕셔너리에 없는 값은 바꿀 짝이 없어서 NaN이 돼요. 키가 있어도 짝지은 값이 `None`이면 역시 NaN이에요. 그래서 키가 있다고 해서 값이 채워진다는 보장은 없어요.",code:`import pandas as pd
size = pd.Series(["S", "M", "XL"])
cm = size.map({"S": 90, "XL": None})
print(cm.tolist())
print(cm.count())`,trace:['`size = pd.Series(["S", "M", "XL"])` → 옷 사이즈 기호예요','`cm = size.map({"S": 90, "XL": None})` → S는 90으로, M은 키가 없어 NaN, XL은 None과 짝이라 NaN이 돼요',"`cm.tolist()` → NaN이 섞여 90도 소수 → **[90.0, nan, nan]**","`cm.count()` → 값이 있는 칸은 하나라 **1**"],output:`[90.0, nan, nan]
1
`,mistake:'map이 딕셔너리에 없는 값을 원래대로 둔다고 생각하기. 그건 `replace`예요. `size.replace({"S": 90})`은 M과 XL을 그대로 두지만, map은 짝이 없으면 NaN으로 바꿔요.',in_code:'`df["요일"].map({"월": 1, "화": 2})`처럼 글자 코드를 숫자로 바꾸는 줄을 자주 봐요. 표에 딕셔너리에 없는 값이 섞여 있으면 NaN이 생기니, 바꾼 뒤 `.isna().sum()`으로 확인해요.'},{type:`example`,id:`theory-pandas-null-ex4`,kind:`choice`,title:`코드를 바꾼 결과`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
lv = pd.Series(["b", "a", "c", "b"])
pt = lv.map({"a": 3, "b": None})
print(pt.tolist())`,output:`[nan, 3.0, nan, nan]
`,choices:[`[nan, 3.0, nan, nan]`,`[nan, 3.0, 'c', nan]`,`['b', 3, 'c', 'b']`,`[nan, 3, nan, nan]`],answer:`[nan, 3.0, nan, nan]`,feedback:{"[nan, 3.0, 'c', nan]":`딕셔너리에 없는 c는 원래 값 그대로 남는다고 생각했나요?`,"['b', 3, 'c', 'b']":`map이 None과 짝지은 값이나 짝이 없는 값을 원래대로 둔다고 생각했나요?`,"[nan, 3, nan, nan]":`NaN이 섞여도 3이 정수로 남는다고 생각했나요?`},explanation:`a는 3으로 바뀌고, b 두 개는 None과 짝이라 NaN, c는 딕셔너리에 키가 없어 NaN이에요. NaN이 섞여서 3도 소수 3.0이 돼요.`,card:`map`},{type:`explain`,id:`inf`,title:`무한대 inf는 NaN이 아니에요`,body:"pandas에서 0으로 나누면 오류 대신 무한대 `inf`가 되고, 0을 0으로 나누면 NaN이 돼요. `inf`는 비어 있는 값이 아니라 '끝없이 큰 수'라는 값이라 `notna()`가 True예요. 계산에 쓸 수 있는 보통 숫자(유한한 수)인지는 NumPy(넘파이, pandas가 안에서 쓰는 숫자 계산 도구)의 `np.isfinite()`로 확인해요. NaN과 inf는 둘 다 유한한 수가 아니라 False예요. NumPy로 `np.nan`, `np.inf`, `-np.inf`처럼 NaN과 무한대를 직접 적을 수도 있어요.",code:`import numpy as np
import pandas as pd
old = pd.Series([4, 0, 0])
rate = pd.Series([6, 3, 0]) / old
print(rate.notna().tolist())
print(np.isfinite(rate).tolist())`,trace:["`import numpy as np` → NumPy를 `np`라는 이름으로 불러와요","`old = pd.Series([4, 0, 0])` → 지난달 값이에요. 두 번째와 세 번째가 0이에요","`rate = pd.Series([6, 3, 0]) / old` → 같은 라벨끼리 나눠 6 ÷ 4 = 1.5, 3 ÷ 0 = inf, 0 ÷ 0 = NaN이 돼요","`rate.notna()` → inf는 값이 있다고 봐서 **[True, True, False]**","`np.isfinite(rate)` → 보통 숫자는 1.5뿐이라 **[True, False, False]**"],output:`[True, True, False]
[True, False, False]
`,mistake:"`notna().sum()`을 계산에 쓸 수 있는 값의 수로 생각하기. inf도 세기 때문에, 그대로 평균을 내면 결과가 inf가 될 수 있어요. 유한한 값만 세려면 `np.isfinite(rate).sum()`을 써요.",in_code:'증가율처럼 나누기를 하는 코드 뒤에 `df[np.isfinite(df["증가율"])]`로 inf와 NaN을 함께 거르는 줄을 자주 봐요. `df.replace([np.inf, -np.inf], np.nan)`으로 inf를 NaN으로 바꾼 뒤 결측치로 다루기도 해요.'},{type:`example`,id:`theory-pandas-null-ex5`,kind:`choice`,title:`나눈 결과 세기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
import pandas as pd
cnt = pd.Series([2, 0, 0, 4])
each = pd.Series([8, 6, 0, 2]) / cnt
ok = np.isfinite(each)
print(each.notna().sum(), ok.sum())`,output:`3 2
`,choices:[`3 2`,`2 2`,`3 3`,`4 2`],answer:`3 2`,feedback:{"2 2":`notna()가 inf도 빈 값으로 본다고 생각했나요?`,"3 3":`np.isfinite가 inf를 보통 숫자로 본다고 생각했나요?`,"4 2":`0 ÷ 0도 inf가 되어 빈 값이 없다고 생각했나요?`},explanation:`8 ÷ 2 = 4.0, 6 ÷ 0 = inf, 0 ÷ 0 = NaN, 2 ÷ 4 = 0.5예요. notna()는 NaN만 빼서 3이고, isfinite는 4.0과 0.5만 True라 2예요.`,card:`inf`},{type:`explain`,id:`short-circuit`,title:`and는 앞이 False면 멈춰요`,body:"`A and B`는 A가 False이면 B를 계산하지 않고 바로 False로 끝나요. 그래서 '숫자인지' 검사를 앞에 두면 숫자가 아닌 값은 뒤의 계산에 들어가지 않아 오류가 나지 않아요. `math.isfinite(x)`는 x가 유한한 수인지 알려 주는데, 글자를 넣으면 TypeError(자료형이 맞지 않는다는 오류)가 나요. `float(\"inf\")`는 Python에서 무한대를 만드는 방법이에요. 1강처럼 True·False도 int로 통과하니, 빼려면 `not isinstance(x, bool)`을 함께 적어요.",code:`import math
raw = [2.0, "?", float("inf"), True]
ok = [v for v in raw
      if isinstance(v, float)
      and math.isfinite(v)]
print(ok)`,trace:["`import math` → 수학 기능 묶음 math를 불러와요",'`raw = [2.0, "?", float("inf"), True]` → 소수, 글자, 무한대, bool이 섞인 입력이에요','`[v for v in raw if isinstance(v, float) and math.isfinite(v)]` → "?"와 True는 float가 아니라 and 앞에서 멈추고, inf는 float지만 유한하지 않아 빠져요',"`print(ok)` → **[2.0]**"],output:`[2.0]
`,mistake:'검사 순서를 바꿔 `math.isfinite(v) and isinstance(v, float)`로 쓰기. "?"가 먼저 `math.isfinite`에 들어가 TypeError가 나요. 종류 검사를 앞에 둬야 해요.',in_code:"외부에서 받은 값을 검사하는 코드에서 `x is not None and x > 0`처럼 '있는지' 검사를 앞에 두는 줄을 자주 봐요. x가 None이면 뒤의 비교를 하지 않아서 오류가 나지 않아요."},{type:`example`,id:`theory-pandas-null-ex6`,kind:`choice`,title:`섞인 입력 검사`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import math
obs = [5, None, float("inf"), False]
kind = (int, float)
good = [d for d in obs
        if isinstance(d, kind)
        and math.isfinite(d)]
print(good)`,output:`[5, False]
`,choices:[`[5, False]`,`[5]`,`TypeError가 발생한다`,`[5, inf, False]`],answer:`[5, False]`,feedback:{"[5]":`False는 int가 아니라서 첫 검사에서 빠진다고 생각했나요?`,"TypeError가 발생한다":`None도 math.isfinite까지 들어가 오류가 난다고 생각했나요?`,"[5, inf, False]":`math.isfinite가 무한대도 통과시킨다고 생각했나요?`},explanation:`None은 숫자 종류가 아니라 and 앞에서 멈춰 math.isfinite에 들어가지 않으니 오류가 없어요. inf는 유한하지 않아 빠지고, False는 bool이지만 int의 한 종류라 남아 [5, False]예요.`,card:`short-circuit`},{type:`summary`,points:["비어 있는 값은 NaN이에요. 숫자 Series의 `None`은 NaN이 되고, NaN이 섞인 숫자는 소수가 돼요. 0은 빈 값이 아니에요.","`isna()`·`notna()`는 칸마다 True·False, `.sum()`은 그 개수예요. `count()`는 값이 있는 칸 수, `len()`은 전체 길이이고, `sum()`·`mean()`은 NaN을 빼고 계산해요.","`fillna`·`dropna`는 새 결과를 돌려주니 `s = s.fillna(0)`처럼 다시 담아요. 0으로 채우면 평균의 분모가 달라져요.",'`dropna()`는 빈 칸이 하나라도 있는 행을 빼요. `subset`은 볼 열을, `how="all"`은 모두 빈 행만 빼도록 정해요. `fillna({열: 값})`은 그 열만 채우고, 채우기와 빼기의 순서에 따라 남는 행이 달라요.',"`map`은 딕셔너리에 없는 값과 `None`에 짝지은 값을 NaN으로 만들어요.","`inf`는 NaN이 아니라서 `notna()`가 True예요. 유한한지는 `np.isfinite`·`math.isfinite`로 확인하고, 종류 검사는 `and` 앞에 둬요."]}],covers:{"pandas-null-01":[`nan`],"pandas-null-02":[`fillna`,`nan`],"pandas-null-03":[`nan`],"pandas-map-missing-20261022":[`map`,`nan`],"pandas-null-scaffold-01":[`dropna`],"pandas-null-scaffold-02":[`fillna`,`nan`],"pandas-null-transfer-02":[`subset`,`fill-dict`,`dropna`,`nan`],"pandas-fill-return-20261019":[`fillna`,`nan`],"pandas-valid-counts-20261021":[`inf`,`nan`],"python-finite-inputs-20261021":[`short-circuit`],"pandas-fill-assign-form-01":[`fillna`,`nan`]}},{id:`theory-pandas-sort`,version:2,concept_id:`pandas-sort`,title:`정렬과 순서`,minutes:13,steps:[{type:`explain`,id:`sort-values`,title:`sort_values로 값 순서대로 정렬하기`,body:'`s.sort_values()`는 값이 작은 것부터(오름차순) 늘어놓은 새 결과를 돌려주고, `ascending=False`를 주면 큰 것부터(내림차순) 늘어놓아요. 표는 `표.sort_values("열")`처럼 기준 열 이름을 줘요. 정렬해도 행 라벨은 값에 붙은 채 함께 움직이고, 0부터 다시 매겨지지 않아요. 그래서 정렬 뒤 맨 위 값은 `.iloc[0]`, 맨 위 행의 라벨은 `.index[0]`으로 읽고, `.loc[0]`은 여전히 라벨 0의 값이에요.',code:`import pandas as pd
km = pd.Series([8, 23, 5])
hi = km.sort_values(ascending=False)
print(hi.tolist())
print(hi.index.tolist())
print(hi.iloc[0], hi.loc[0])`,trace:["`km = pd.Series([8, 23, 5])` → 라벨 0·1·2에 자전거로 달린 거리예요","`hi = km.sort_values(ascending=False)` → 큰 값부터 늘어놓은 새 Series를 hi에 담아요","`hi.tolist()` → **[23, 8, 5]**","`hi.index.tolist()` → 라벨이 값을 따라 움직여 **[1, 0, 2]**","`hi.iloc[0], hi.loc[0]` → 맨 위 위치의 23과 라벨 0의 8 → **23 8**"],output:`[23, 8, 5]
[1, 0, 2]
23 8
`,mistake:"정렬하면 라벨도 0, 1, 2로 다시 붙는다고 생각하기. 라벨은 값을 따라가서 맨 위 행의 라벨은 1이에요. 맨 위 값이 필요하면 `loc[0]`이 아니라 `iloc[0]`을 써요.",in_code:'`df.sort_values("거리", ascending=False)`처럼 기준 열과 방향을 적어 표 전체를 정렬하는 줄을 자주 봐요. 원본은 그대로라 `df = df.sort_values(...)`처럼 다시 담기도 해요.'},{type:`example`,id:`theory-pandas-sort-ex1`,kind:`choice`,title:`정렬한 뒤 두 번째 값`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
room = pd.DataFrame(
    {"won": [73, 58, 91]},
    index=[301, 302, 303])
top = room.sort_values(
    "won", ascending=False)
print(top["won"].iloc[1])`,output:`73
`,choices:[`73`,`58`,`91`,`301`],answer:`73`,feedback:{58:`iloc[1]이 정렬하기 전 두 번째 행의 값을 읽는다고 생각했나요?`,91:`iloc의 위치 번호가 1부터 시작한다고 생각했나요?`,301:`iloc이 값이 아니라 그 행의 라벨을 돌려준다고 생각했나요?`},explanation:`won을 큰 순서로 정렬하면 91(303호), 73(301호), 58(302호) 순서예요. iloc[1]은 정렬된 결과의 두 번째 위치라 73이에요.`,card:`sort-values`},{type:`explain`,id:`sort-index`,title:`라벨로 정렬하는 sort_index`,body:"`sort_values()`는 값의 크기로, `sort_index()`는 행 라벨로 순서를 정해요. 날짜나 번호를 라벨로 쓴 데이터를 라벨 순서로 되돌릴 때 sort_index를 써요. `ignore_index=True`를 주면 정렬된 순서는 그대로 두고 라벨만 0, 1, 2…로 새로 붙여요.",code:`import pandas as pd
km = pd.Series({3: 8, 1: 23, 2: 5})
print(km.sort_index().tolist())
print(km.sort_values().tolist())
print(km.sort_values(
    ignore_index=True))`,trace:["`km = pd.Series({3: 8, 1: 23, 2: 5})` → 날짜(일)를 라벨로 붙인 거리예요. 3일이 먼저 적혀 있어요","`km.sort_index()` → 라벨 1, 2, 3 순서로 → **[23, 5, 8]**","`km.sort_values()` → 값 5, 8, 23 순서로 → **[5, 8, 23]**","`km.sort_values(ignore_index=True)` → 값 순서는 같고 라벨만 0·1·2로 새로 붙어요"],output:`[23, 5, 8]
[5, 8, 23]
0     5
1     8
2    23
dtype: int64
`,mistake:"`sort_index()`가 값을 정렬한다고 생각하기. sort_index는 라벨만 보고 값의 크기는 보지 않아요. 값 순서가 필요하면 sort_values를 써요.",in_code:"날짜가 라벨인 데이터를 합치거나 걸러서 순서가 섞인 뒤 `df.sort_index()`로 날짜 순서를 되돌리는 줄을 자주 봐요. 이름이 비슷한 `reset_index(drop=True)`는 정렬 없이 라벨만 0부터 다시 붙이고, `value_counts()`는 값마다 몇 번 나왔는지 센 새 결과를 돌려줘서, 둘 다 행을 값 순서로 정렬하는 기능이 아니에요."},{type:`explain`,id:`multi-key`,title:`여러 열로 정렬하기`,body:'`sort_values(["열1", "열2"])`처럼 열 이름 리스트를 주면 왼쪽 열부터 기준으로 써요. 첫 열의 값이 같은 행끼리만 다음 열로 순서를 정해요. `ascending=[False, True]`처럼 리스트를 주면 같은 자리의 열마다 방향을 따로 정해요. 글자는 사전 순서(알파벳 순서)로 정렬되는데, 영어 대문자는 모두 소문자보다 먼저 와요.',code:`import pandas as pd
game = pd.DataFrame({
    "lv": [2, 1, 2, 1],
    "xp": [9, 5, 7, 8]})
print(game.sort_values(["lv", "xp"],
      ascending=[False, True]))`,trace:["`game = pd.DataFrame({...})` → 네 사람의 레벨(lv)과 경험치(xp)예요",'`game.sort_values(["lv", "xp"],` → lv가 첫 기준, xp가 둘째 기준이에요',"`ascending=[False, True]` → lv는 큰 것부터, lv가 같은 행끼리는 xp가 작은 것부터 → 라벨 2(7)·0(9), 그다음 1(5)·3(8) 순서의 표"],output:`   lv  xp
2   2   7
0   2   9
1   1   5
3   1   8
`,mistake:'열 리스트의 순서는 상관없다고 생각하기. `["xp", "lv"]`로 바꾸면 xp가 첫 기준이 되어 순서가 완전히 달라져요. ascending 리스트도 같은 자리의 열과 짝지어져요.',in_code:'랭킹 코드에서 `df.sort_values(["레벨", "가입일"], ascending=[False, True])`처럼 동점을 다음 열로 가르는 줄을 자주 봐요. 보고서에 라벨이 필요 없으면 `ignore_index=True`를 함께 적기도 해요.'},{type:`example`,id:`theory-pandas-sort-ex2`,kind:`choice`,title:`두 기준으로 정렬한 순서`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
pack = pd.DataFrame({
    "box": ["s", "m", "s", "m"],
    "kg": [3, 1, 2, 4]})
out = pack.sort_values(
    ["box", "kg"],
    ascending=[True, False])
print(out.index.tolist())`,output:`[3, 1, 0, 2]
`,choices:[`[3, 1, 0, 2]`,`[1, 3, 2, 0]`,`[0, 2, 3, 1]`,`[3, 0, 2, 1]`],answer:`[3, 1, 0, 2]`,feedback:{"[1, 3, 2, 0]":`ascending 리스트의 False가 두 번째 열 kg에 쓰이지 않는다고 생각했나요?`,"[0, 2, 3, 1]":`글자 "s"가 "m"보다 먼저 온다고 생각했나요?`,"[3, 0, 2, 1]":`kg를 첫 번째 기준으로 정렬한다고 생각했나요?`},explanation:`첫 기준 box는 오름차순이라 글자 순서대로 "m"이 "s"보다 먼저예요. box가 같은 행끼리는 kg를 큰 순서로 놓아 m은 3번(4)·1번(1), s는 0번(3)·2번(2)이라 [3, 1, 0, 2]예요.`,card:`multi-key`},{type:`explain`,id:`na-position`,title:`빈 값은 정렬하면 맨 뒤로 가요`,body:'정렬할 때 NaN은 비교할 값이 없어서 기본으로 맨 뒤에 놓여요. 오름차순이든 내림차순이든 똑같이 맨 뒤예요. `na_position="first"`를 주면 NaN을 맨 앞에 모아요. 여러 열로 정렬하면 첫 열이 NaN인 행끼리는 다음 열로 순서를 정해요.',code:`import pandas as pd
km = pd.Series([8, None, 23, 5])
print(km.sort_values(
    ascending=False).tolist())
print(km.sort_values(
    na_position="first").tolist())`,trace:["`km = pd.Series([8, None, 23, 5])` → 하루는 기록이 비어 있어요","`km.sort_values(ascending=False)` → 큰 값부터 놓고 NaN은 맨 뒤 → **[23.0, 8.0, 5.0, nan]**",'`km.sort_values(na_position="first")` → 작은 값부터 놓고 NaN은 맨 앞 → **[nan, 5.0, 8.0, 23.0]**'],output:`[23.0, 8.0, 5.0, nan]
[nan, 5.0, 8.0, 23.0]
`,mistake:`내림차순이면 NaN이 맨 앞으로 온다고 생각하기. NaN의 자리는 방향과 상관없이 na_position으로만 정해지고, 기본은 맨 뒤예요.`,in_code:'기록이 빠진 사람을 먼저 확인하려고 `df.sort_values("기록", na_position="first")`처럼 쓰는 줄을 볼 수 있어요.'},{type:`example`,id:`theory-pandas-sort-ex3`,kind:`choice`,title:`빈 기록이 있는 정렬`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
lap = pd.DataFrame({
    "sec": [41.0, None, 38.0, None],
    "who": ["m", "k", "j", "a"]})
out = lap.sort_values(
    ["sec", "who"],
    na_position="first")
print(out["who"].tolist())`,output:`['a', 'k', 'j', 'm']
`,choices:[`['a', 'k', 'j', 'm']`,`['k', 'a', 'j', 'm']`,`['j', 'm', 'a', 'k']`,`['a', 'j', 'k', 'm']`],answer:`['a', 'k', 'j', 'm']`,feedback:{"['k', 'a', 'j', 'm']":`sec가 빈 행끼리는 원래 순서대로 남는다고 생각했나요?`,"['j', 'm', 'a', 'k']":`na_position을 줘도 빈 값이 맨 뒤로 간다고 생각했나요?`,"['a', 'j', 'k', 'm']":`첫 기준 sec를 건너뛰고 who로만 정렬한다고 생각했나요?`},explanation:`na_position="first"라서 sec가 빈 k와 a가 맨 앞에 와요. 두 행은 다음 기준 who의 순서로 a, k가 되고, 나머지는 38초인 j, 41초인 m 순서예요.`,card:`na-position`},{type:`explain`,id:`head`,title:`head는 그 순간의 앞부분만 잘라요`,body:"`s.head(n)`은 지금 놓인 순서에서 앞의 n개만 잘라 돌려줘요. 그래서 '가장 큰 두 개'가 필요하면 먼저 정렬하고 나서 head를 써야 해요. 순서를 바꿔 head를 먼저 하면 처음 두 개 안에서만 정렬해서, 뒤쪽의 큰 값은 다시 돌아오지 않아요.",code:`import pandas as pd
km = pd.Series([8, 23, 5, 16])
hi = km.sort_values(ascending=False)
print(hi.head(2).tolist())
lo = km.head(2).sort_values()
print(lo.tolist())`,trace:["`km = pd.Series([8, 23, 5, 16])` → 네 번의 기록이에요","`hi = km.sort_values(ascending=False)` → [23, 16, 8, 5] 순서로 정렬해요","`hi.head(2).tolist()` → 정렬된 순서의 앞 두 개 → **[23, 16]**","`lo = km.head(2).sort_values()` → 먼저 8, 23만 자른 뒤 정렬해서 16은 들어오지 못해요","`lo.tolist()` → **[8, 23]**"],output:`[23, 16]
[8, 23]
`,mistake:`head를 어디에 붙여도 결과가 같다고 생각하기. head는 부르는 순간의 앞부분만 남기니, 정렬보다 먼저 쓰면 전체에서 가장 큰 값을 놓칠 수 있어요.`,in_code:'`df.sort_values("조회수", ascending=False).head(10)`처럼 정렬 뒤에 head를 붙여 상위 10개를 뽑는 줄을 자주 봐요. `df.nlargest(10, "조회수")`도 같은 일을 해요.'},{type:`explain`,id:`idxmax`,title:`가장 큰 값의 라벨 idxmax`,body:"`s.max()`는 가장 큰 값을, `s.idxmax()`는 그 값이 있는 행의 라벨을 돌려줘요. 가장 큰 값이 여러 번 나오면 원래 순서에서 처음 나온 라벨 하나만 돌려주고, 라벨을 글자 순서로 다시 비교하지 않아요. 가장 작은 값은 `min()`과 `idxmin()`으로 찾아요.",code:`import pandas as pd
km = pd.Series(
    [23, 16, 23],
    index=["월", "화", "수"])
print(km.max(), km.idxmax())
print(km.min(), km.idxmin())`,trace:["`km = pd.Series(...)` → 월요일과 수요일의 거리가 똑같이 23이에요","`km.max(), km.idxmax()` → 가장 큰 값 23과 그 값이 처음 나온 라벨 → **23 월**","`km.min(), km.idxmin()` → 가장 작은 값 16과 그 라벨 → **16 화**"],output:`23 월
16 화
`,mistake:`idxmax가 가장 큰 값을 돌려준다고 생각하기. 값은 max(), 라벨은 idxmax()예요. 몇 번째인지(위치 번호)를 돌려주는 것도 아니에요.`,in_code:'`df.loc[df["거리"].idxmax()]`처럼 가장 큰 값이 있는 행 전체를 꺼내는 줄을 자주 봐요. idxmax가 라벨을 돌려주니 loc과 함께 써요.'},{type:`example`,id:`theory-pandas-sort-ex4`,kind:`choice`,title:`최솟값의 라벨`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
won = pd.Series(
    [41, 37, 52, 37],
    index=["q", "m", "x", "k"])
print(won.idxmin(), won.min())`,output:`m 37
`,choices:[`m 37`,`k 37`,`1 37`,`37 m`],answer:`m 37`,feedback:{"k 37":`가장 작은 값이 여러 개면 라벨의 글자 순서로 앞선 것을 고른다고 생각했나요?`,"1 37":`idxmin이 라벨이 아니라 몇 번째 위치인지를 돌려준다고 생각했나요?`,"37 m":`idxmin이 값을, min이 라벨을 돌려준다고 생각했나요?`},explanation:`가장 작은 값 37은 라벨 m과 k에 있어요. idxmin은 원래 순서에서 먼저 나온 m을 돌려주고, min()은 값 37이에요.`,card:`idxmax`},{type:`explain`,id:`rank`,title:`rank로 등수 매기기`,body:'`s.rank()`는 값마다 작은 것부터 몇 번째인지 등수를 매기고, 클수록 1등이어야 하면 `ascending=False`를 줘요. 같은 값(동점)은 기본으로 차지한 등수의 평균을 받아 2.5처럼 소수가 돼요. `method="min"`은 동점에게 그중 가장 작은 등수를 함께 주고, 다음 값은 동점이 차지한 자리만큼 건너뛰어요. `method="dense"`는 건너뛰지 않고 바로 다음 등수를 줘요. 등수는 소수로 나오니 `.astype(int)`로 정수로 바꿔요.',code:`import pandas as pd
sec = pd.Series([52, 48, 52, 61])
print(sec.rank().tolist())
mn = sec.rank(method="min")
print(mn.astype(int).tolist())`,trace:["`sec = pd.Series([52, 48, 52, 61])` → 달리기 기록(초)이에요. 작을수록 빨라요","`sec.rank()` → 48이 1등, 52 두 개는 2·3등 자리의 평균 2.5, 61은 4등 → **[2.5, 1.0, 2.5, 4.0]**",'`mn = sec.rank(method="min")` → 52 두 개는 2·3등 중 작은 2등, 61은 그대로 4등이에요',"`mn.astype(int).tolist()` → 정수로 바꿔 **[2, 1, 2, 4]**"],output:`[2.5, 1.0, 2.5, 4.0]
[2, 1, 2, 4]
`,mistake:`동점 다음 등수가 3이라고 생각하기. method="min"에서는 52 두 개가 2·3등 자리를 차지해 다음은 4등이에요. 3등으로 바로 잇는 것은 method="dense"예요.`,in_code:'`df["순위"] = df["판매량"].rank(method="min", ascending=False).astype(int)`처럼 큰 값이 1등인 순위 열을 만드는 줄을 자주 봐요.'},{type:`example`,id:`theory-pandas-sort-ex5`,kind:`choice`,title:`멀리뛰기 등수`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
cm = pd.Series([210, 235, 235, 198])
r = cm.rank(method="dense",
            ascending=False)
print(r.astype(int).tolist())`,output:`[2, 1, 1, 3]
`,choices:[`[2, 1, 1, 3]`,`[3, 1, 1, 4]`,`[2, 3, 3, 1]`,`[3, 1, 2, 4]`],answer:`[2, 1, 1, 3]`,feedback:{"[3, 1, 1, 4]":`dense도 min처럼 동점이 차지한 자리만큼 다음 등수를 건너뛴다고 생각했나요?`,"[2, 3, 3, 1]":`ascending=False를 줘도 작은 값이 1등이라고 생각했나요?`,"[3, 1, 2, 4]":`동점도 원래 순서대로 다른 등수를 받는다고 생각했나요?`},explanation:`ascending=False라 큰 값이 1등이에요. 235 두 개가 함께 1등이고, dense는 건너뛰지 않아 210이 2등, 198이 3등이에요.`,card:`rank`},{type:`summary`,points:["`sort_values()`는 값 순서(기본 오름차순, `ascending=False`면 내림차순)로, `sort_index()`는 라벨 순서로 정렬한 새 결과를 돌려줘요.","정렬해도 라벨은 값을 따라가요. 맨 위 값은 `iloc[0]`, 맨 위 라벨은 `index[0]`이고, `ignore_index=True`는 라벨만 0부터 다시 붙여요.","여러 열은 왼쪽 열부터 기준이 되고, `ascending` 리스트는 같은 자리의 열과 짝지어져요. 글자는 사전 순서예요.",'NaN은 방향과 상관없이 맨 뒤로 가고, `na_position="first"`면 맨 앞으로 와요.',"`head(n)`은 그 순간의 앞 n개라서 '상위 n개'는 정렬한 뒤에 잘라요.",'`idxmax()`·`idxmin()`은 처음 나온 라벨을, `rank()`는 등수를 돌려줘요. 동점은 기본이 평균, `"min"`은 작은 등수에 건너뛰기, `"dense"`는 건너뛰지 않기예요.']}],covers:{"pandas-sort-01":[`sort-values`],"pandas-sort-02":[`sort-index`,`sort-values`],"pandas-sort-03":[`multi-key`,`sort-index`],"pandas-max-label-20261020":[`idxmax`],"pandas-tie-rank-20261021":[`rank`],"pandas-sort-scaffold-01":[`sort-values`],"pandas-sort-scaffold-02":[`multi-key`,`sort-values`],"pandas-sort-missing-20261019":[`na-position`,`multi-key`],"pandas-top-order-20261020":[`head`,`sort-values`]}},{id:`theory-pandas-group`,version:2,concept_id:`pandas-group`,title:`그룹 집계`,minutes:14,steps:[{type:`explain`,id:`aggregate`,title:`값을 하나로 모으는 집계`,body:"여러 값을 계산해 하나로 줄이는 것을 집계라고 해요. `sum()`은 합계, `mean()`은 평균, `count()`는 비어 있지 않은 값의 수, `max()`·`min()`은 가장 큰·작은 값이에요. `nunique()`는 서로 다른 값이 몇 종류인지 세요. 모두 NaN은 빼고 계산해요.",code:`import pandas as pd
cup = pd.Series([4, None, 4, 10])
print(cup.sum(), cup.mean())
print(cup.count(), len(cup))
print(cup.nunique(), cup.max())`,trace:["`cup = pd.Series([4, None, 4, 10])` → 나흘 동안 판 컵 수예요. 하루는 기록이 없어요","`cup.sum(), cup.mean()` → NaN을 빼고 4 + 4 + 10 = 18, 평균은 18 ÷ 3 → **18.0 6.0**","`cup.count(), len(cup)` → 값이 있는 칸 3개, 전체 4칸 → **3 4**","`cup.nunique(), cup.max()` → 서로 다른 값은 4와 10 두 종류, 가장 큰 값은 10 → **2 10.0**"],output:`18.0 6.0
3 4
2 10.0
`,mistake:`nunique가 값의 개수를 센다고 생각하기. 4가 두 번 나와도 한 종류로 세서 2예요. 개수는 count(), 종류 수는 nunique()예요.`,in_code:'`df["고객"].nunique()`로 서로 다른 고객 수를, `df["메뉴"].value_counts()`로 값마다 몇 번 나왔는지를 세는 줄을 자주 봐요.'},{type:`example`,id:`theory-pandas-group-ex1`,kind:`choice`,title:`평균과 종류 수`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
kg = pd.Series([3, 5, None, 3, 3])
print(kg.mean(), kg.nunique())`,output:`3.5 2
`,choices:[`3.5 2`,`3.5 4`,`2.8 2`,`3.5 3`],answer:`3.5 2`,feedback:{"3.5 4":`nunique가 비어 있지 않은 값의 개수를 센다고 생각했나요?`,"2.8 2":`mean()이 빈 칸까지 센 5로 나눈다고 생각했나요?`,"3.5 3":`nunique가 빈 값도 한 종류로 센다고 생각했나요?`},explanation:`mean()은 NaN을 빼고 (3 + 5 + 3 + 3) ÷ 4 = 3.5예요. nunique()는 NaN을 빼고 3과 5 두 종류라 2예요.`,card:`aggregate`},{type:`explain`,id:`groupby`,title:`groupby로 묶어서 집계하기`,body:'`표.groupby("열")`은 그 열의 값이 같은 행끼리 묶음(그룹)을 만들어요. 뒤에 `["집계할 열"]`과 `.sum()` 같은 집계를 붙이면 그룹마다 값 하나가 나와요. 결과는 그룹 이름이 라벨인 Series이고, 라벨은 기본으로 정렬돼 있어요. 그래서 `결과["그룹 이름"]`으로 한 그룹의 값을 꺼내요.',code:`import pandas as pd
run = pd.DataFrame({
    "who": ["kim", "lee", "kim"],
    "km": [6, 8, 13]})
tot = run.groupby("who")["km"].sum()
print(tot)`,trace:["`run = pd.DataFrame({...})` → 누가 몇 km를 달렸는지 기록이에요",'`tot = run.groupby("who")["km"].sum()` → who가 같은 행끼리 묶어 km를 더해요. kim은 6 + 13이에요',"`print(tot)` → 맨 위 `who`는 라벨의 이름이고, 그룹마다 한 줄씩 kim **19**, lee **8**이에요"],output:`who
kim    19
lee     8
Name: km, dtype: int64
`,mistake:'`tot["kim"]`이 원래 표의 kim 행을 읽는다고 생각하기. tot는 그룹마다 한 줄로 줄어든 새 Series라서 `tot["kim"]`은 kim의 합계 19예요.',in_code:'`df.groupby("요일")["방문자"].mean()`처럼 묶고, 열을 고르고, 집계하는 세 단계가 한 줄에 이어진 코드를 자주 봐요. 결과를 다시 표로 쓰려고 끝에 `.reset_index()`를 붙이기도 해요.'},{type:`example`,id:`theory-pandas-group-ex2`,kind:`choice`,title:`요일별 평균`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
gym = pd.DataFrame({
    "day": ["월", "수", "월", "수"],
    "kg": [42, 25, 58, 35]})
grp = gym.groupby("day")["kg"]
print(grp.mean()["월"])`,output:`50.0
`,choices:[`50.0`,`40.0`,`42.0`,`100`],answer:`50.0`,feedback:{"40.0":`groupby가 요일과 상관없이 전체 평균을 낸다고 생각했나요?`,"42.0":`그룹마다 첫 번째 값만 남는다고 생각했나요?`,100:`mean() 대신 합계를 구한다고 생각했나요?`},explanation:`groupby("day")는 월과 수로 행을 나눠요. 월 그룹의 kg는 42와 58이라 평균이 50.0이에요.`,card:`groupby`},{type:`explain`,id:`size-count`,title:`size는 행 수, count는 값의 수`,body:'그룹마다 \'몇 개인지\' 세는 방법은 두 가지예요. `size()`는 그룹에 든 행을 모두 세서 값이 비어 있는 행도 들어가고, `count()`는 고른 열에서 비어 있지 않은 값만 세요. `agg(["size", "count"])`처럼 집계 이름 리스트를 주면 여러 집계를 한 번에 표로 볼 수 있어요.',code:`import pandas as pd
run = pd.DataFrame({
    "who": ["oh", "yu", "yu", "yu"],
    "km": [6, 8, None, 13]})
grp = run.groupby("who")["km"]
print(grp.agg(["size", "count"]))`,trace:["`run = pd.DataFrame({...})` → yu의 두 번째 기록은 거리가 비어 있어요",'`grp = run.groupby("who")["km"]` → who로 묶고 km 열을 골라 둔 묶음이에요','`grp.agg(["size", "count"])` → 그룹마다 두 집계를 한 줄에 보여 줘요. yu는 행이 3개라 size **3**, 값이 있는 칸은 2개라 count **2**'],output:`     size  count
who             
oh      1      1
yu      3      2
`,mistake:"'기록이 몇 번 있었나'를 세면서 `count()`를 쓰기. 거리가 빈 기록은 빠져서 yu가 2번으로 줄어요. 행 수가 필요하면 `size()`를 써요.",in_code:'`df.groupby("요일").size()`처럼 열을 고르지 않고 size를 바로 붙여 그룹마다 행 수를 세는 줄을 자주 봐요. `print((int(a), int(b)))`처럼 그룹 결과 두 개를 `int()`로 감싸 튜플로 출력하는 줄도 흔해요.'},{type:`example`,id:`theory-pandas-group-ex3`,kind:`choice`,title:`월요일 주문 세기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
cafe = pd.DataFrame({
    "day": ["월", "월", "월", "화"],
    "menu": [3, None, 3, 7]})
grp = cafe.groupby("day")["menu"]
m = grp.agg(["size", "nunique"])
print(m.loc["월"].tolist())`,output:`[3, 1]
`,choices:[`[3, 1]`,`[3, 2]`,`[2, 1]`,`[2, 2]`],answer:`[3, 1]`,feedback:{"[3, 2]":`nunique가 빈 값도 한 종류로 센다고 생각했나요?`,"[2, 1]":`size가 빈 값이 있는 행은 빼고 센다고 생각했나요?`,"[2, 2]":`size와 nunique가 모두 비어 있지 않은 값의 수라고 생각했나요?`},explanation:`월 그룹은 행이 3개라 size가 3이에요. menu 값은 3, NaN, 3이고 nunique는 NaN을 빼고 서로 다른 값만 세서 1이에요.`,card:`size-count`},{type:`explain`,id:`steps`,title:`묶기 전에 거를까, 묶은 뒤에 거를까`,body:"집계 코드는 순서가 중요해요. 한 행에 대한 조건(예: 5km 이상 달린 기록)은 묶기 전에 `표[조건]`으로 걸러요. 그룹 합계에 대한 조건(예: 합계 18km 이상)은 합계를 만든 뒤 `tot[tot >= 18]`처럼 결과 Series에 걸어요. 결과 Series도 `sort_values(ascending=False)`로 정렬할 수 있고, `.to_dict()`는 `{라벨: 값}` 딕셔너리로, `.index.tolist()`는 남은 그룹 이름 목록으로 바꿔요.",code:`import pandas as pd
run = pd.DataFrame({
    "who": ["oh", "yu", "yu", "oh"],
    "km": [13, 6, 8, 9]})
tot = run.groupby("who")["km"].sum()
print(tot[tot >= 18].to_dict())`,trace:["`run = pd.DataFrame({...})` → oh는 13·9km, yu는 6·8km를 달렸어요",'`tot = run.groupby("who")["km"].sum()` → 사람마다 합계를 내면 oh 22, yu 14예요',"`tot[tot >= 18].to_dict()` → 합계가 18 이상인 그룹만 남겨 딕셔너리로 → **{'oh': 22}**"],output:`{'oh': 22}
`,mistake:'합계 조건을 묶기 전에 `run[run["km"] >= 18]`처럼 걸기. 그건 한 번에 18km 이상 달린 기록을 고르는 조건이라, 그런 기록이 없으니 묶어도 빈 결과 `{}`가 나와요.',in_code:'`df[df["요일"] != "일"].groupby("반")["출석"].sum()`처럼 행을 먼저 거르고 묶는 줄과, 그 결과에 `결과[결과 >= 기준]`을 거는 줄이 함께 나오는 코드를 자주 봐요.'},{type:`example`,id:`theory-pandas-group-ex4`,kind:`choice`,title:`거른 뒤 묶은 합계`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
rec = pd.DataFrame({
    "who": ["yu", "oh", "yu", "ko"],
    "km": [6, 13, 9, 16]})
far = rec[rec["km"] >= 8]
tot = far.groupby("who")["km"].sum()
print(tot.to_dict())`,output:`{'ko': 16, 'oh': 13, 'yu': 9}
`,choices:[`{'ko': 16, 'oh': 13, 'yu': 9}`,`{'ko': 16, 'oh': 13, 'yu': 15}`,`{'yu': 9, 'oh': 13, 'ko': 16}`,`{'yu': 6}`],answer:`{'ko': 16, 'oh': 13, 'yu': 9}`,feedback:{"{'ko': 16, 'oh': 13, 'yu': 15}":`행을 거르기 전의 표로 합계를 낸다고 생각했나요?`,"{'yu': 9, 'oh': 13, 'ko': 16}":`groupby 결과가 표에 처음 나온 순서대로 놓인다고 생각했나요?`,"{'yu': 6}":`조건에 맞지 않는 행이 남는다고 생각했나요?`},explanation:`먼저 km가 8 이상인 행만 남겨 yu의 6km 기록이 빠져요. 남은 행을 사람별로 더하면 ko 16, oh 13, yu 9이고, 그룹 이름은 글자 순서로 정렬돼요.`,card:`steps`},{type:`explain`,id:`transform`,title:`transform은 행마다 그룹 값을 돌려줘요`,body:'`grp.sum()`은 그룹마다 한 줄로 줄어든 결과라 라벨이 그룹 이름이에요. 이것을 원래 표의 열과 계산하면 라벨(0, 1, 2…와 그룹 이름)이 맞지 않아 NaN이 돼요. `grp.transform("sum")`은 그룹 합계를 원래 행마다, 그 행이 속한 그룹의 값으로 돌려줘요. 길이와 라벨이 원래 표와 같아서 `표["km"] / 그 결과`처럼 행마다 바로 계산할 수 있어요.',code:`import pandas as pd
run = pd.DataFrame({
    "who": ["kim", "yu", "kim"],
    "km": [13, 6, 5]})
grp = run.groupby("who")["km"]
print(grp.transform("sum").tolist())`,trace:["`run = pd.DataFrame({...})` → kim은 13·5km, yu는 6km예요",'`grp = run.groupby("who")["km"]` → who로 묶은 km예요. `grp.sum()`이라면 kim 18, yu 6 두 줄이에요','`grp.transform("sum")` → 행마다 자기 그룹의 합계를 놓아 행 수가 그대로 → **[18, 6, 18]**'],output:`[18, 6, 18]
`,mistake:'`run["km"] / grp.sum()`으로 그룹 안 비율을 구하기. 왼쪽은 라벨 0·1·2, 오른쪽은 라벨 kim·yu라 짝이 하나도 맞지 않아 모두 NaN이에요. 행마다 그룹 합계가 필요하면 transform을 써요.',in_code:'`df["차이"] = df["km"] - df.groupby("사람")["km"].transform("mean")`처럼 그룹 평균을 행마다 붙여 비교하는 줄을 자주 봐요. 끝에 `.round(2)`를 붙여 소수 둘째 자리까지 반올림해 보여 주기도 해요. 예제 표의 `list("가나다")`는 글자를 하나씩 나눈 `[\'가\', \'나\', \'다\']`예요.'},{type:`example`,id:`theory-pandas-group-ex5`,kind:`choice`,title:`그룹 평균과의 차이`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
pay = pd.DataFrame({
    "who": ["yu", "kim", "yu"],
    "won": [6, 7, 2]})
grp = pay.groupby("who")["won"]
avg = grp.transform("mean")
print((pay["won"] - avg).tolist())`,output:`[2.0, 0.0, -2.0]
`,choices:[`[2.0, 0.0, -2.0]`,`[nan, nan, nan]`,`[0.0, 0.0, -2.0]`,`[1.0, 2.0, -3.0]`],answer:`[2.0, 0.0, -2.0]`,feedback:{"[nan, nan, nan]":`transform도 sum()처럼 그룹마다 한 줄로 줄어 라벨이 맞지 않는다고 생각했나요?`,"[0.0, 0.0, -2.0]":`transform이 그 행까지 나온 값만으로 평균을 낸다고 생각했나요?`,"[1.0, 2.0, -3.0]":`그룹과 상관없이 전체 평균을 뺀다고 생각했나요?`},explanation:`transform("mean")은 행마다 자기 그룹의 평균을 돌려줘요. yu는 (6 + 2) ÷ 2 = 4, kim은 7이라서 [4.0, 7.0, 4.0]이고, 빼면 [2.0, 0.0, -2.0]이에요.`,card:`transform`},{type:`explain`,id:`cumsum`,title:`그룹 안에서 누적하기`,body:"`cumsum()`은 위에서부터 값을 차례로 더해 가며 그때까지의 합(누적합)을 행마다 남겨요. groupby 뒤에 쓰면 그룹마다 따로 누적해요. 결과는 transform처럼 원래 행 자리에 그대로 놓이고, 그룹 순서로 다시 모이지 않아요.",code:`import pandas as pd
run = pd.DataFrame({
    "who": ["oh", "oh", "yu", "oh"],
    "km": [13, 5, 6, 4]})
grp = run.groupby("who")["km"]
print(grp.cumsum().tolist())`,trace:["`run = pd.DataFrame({...})` → oh, oh, yu, oh 순서의 기록이에요",'`grp = run.groupby("who")["km"]` → who로 묶은 km예요',"`grp.cumsum()` → oh는 13 → 18 → 22, yu는 6에서 시작해 원래 행 자리에 놓여요 → **[13, 18, 6, 22]**"],output:`[13, 18, 6, 22]
`,mistake:'그룹과 상관없이 전체를 누적한다고 생각하기. `run["km"].cumsum()`이라면 [13, 18, 24, 28]이지만, groupby 뒤에는 그룹마다 따로 더해요.',in_code:'`df["누적"] = df.groupby("사람")["km"].cumsum()`처럼 날짜순으로 정렬한 뒤 사람별 누적 거리를 새 열로 붙이는 줄을 자주 봐요.'},{type:`explain`,id:`null-key`,title:`그룹 이름이 빈 행은 빠져요`,body:'groupby는 기본으로 묶는 기준 열이 NaN인 행을 어느 그룹에도 넣지 않아요. 그래서 그 행은 다른 열에 값이 있어도 그룹 합계에서 통째로 빠져요. `groupby("열", dropna=False)`를 주면 NaN도 하나의 그룹으로 남겨요.',code:`import pandas as pd
run = pd.DataFrame(
    {"who": ["kim", None, "kim"]})
print(run.groupby("who").size())
print(run.groupby(
    "who", dropna=False).size())`,trace:["`run = pd.DataFrame(...)` → 두 번째 기록은 누가 달렸는지 비어 있어요",'`run.groupby("who").size()` → who가 빈 행은 빠지고 kim 그룹만 남아 행 수 **2**','`run.groupby("who", dropna=False).size()` → 빈 값도 NaN 그룹으로 남아 kim **2**, NaN **1**'],output:`who
kim    2
dtype: int64
who
kim    2
NaN    1
dtype: int64
`,mistake:`집계할 열에 빈 값이 없으면 합계가 줄지 않는다고 생각하기. 기준 열이 빈 행은 통째로 빠지니, 그룹 합계를 모두 더해도 전체 합계보다 작을 수 있어요.`,in_code:'그룹별 합계를 모두 더한 값이 전체 합계와 다르면 기준 열의 빈 값부터 의심해요. `df["사람"].isna().sum()`으로 확인하거나 `dropna=False`로 빈 그룹을 드러내 보는 줄을 자주 봐요.'},{type:`example`,id:`theory-pandas-group-ex6`,kind:`choice`,title:`자전거별 거리 합계`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
ride = pd.DataFrame({
    "bike": ["a", None, "b", None],
    "km": [3, 5, 4, 2]})
grp = ride.groupby("bike")["km"]
print(grp.sum().to_dict())`,output:`{'a': 3, 'b': 4}
`,choices:[`{'a': 3, 'b': 4}`,`{'a': 3, 'b': 4, nan: 7}`,`{'a': 8, 'b': 6}`,`{}`],answer:`{'a': 3, 'b': 4}`,feedback:{"{'a': 3, 'b': 4, nan: 7}":`기본 groupby도 bike가 빈 행을 NaN 그룹으로 남긴다고 생각했나요?`,"{'a': 8, 'b': 6}":`bike가 빈 행이 바로 위 행의 그룹에 들어간다고 생각했나요?`,"{}":`기준 열에 빈 값이 하나라도 있으면 아무 그룹도 만들지 않는다고 생각했나요?`},explanation:`기본 groupby는 bike가 빈 두 행을 어느 그룹에도 넣지 않아요. 그래서 a의 3과 b의 4만 남고, 빈 행의 km 5와 2는 합계에서 빠져요.`,card:`null-key`},{type:`summary`,points:["`sum`·`mean`·`count`·`max`·`min`·`nunique`는 여러 값을 하나로 모으고, 모두 NaN을 빼고 계산해요. `nunique`는 서로 다른 값의 종류 수예요.",'`표.groupby("열")["값 열"].sum()`은 그룹마다 한 값을 내고, 결과의 라벨은 정렬된 그룹 이름이라 `결과["이름"]`으로 꺼내요.',"`size()`는 그룹의 행 수, `count()`는 비어 있지 않은 값의 수예요.","한 행의 조건은 묶기 전에, 그룹 합계의 조건은 합계를 만든 뒤 결과에 걸어요. `.to_dict()`·`.index.tolist()`로 결과를 꺼내요.","`transform`과 `cumsum`은 원래 행 자리에 그룹의 값을 돌려줘요. 그룹마다 한 줄인 `sum()` 결과를 원래 열과 계산하면 라벨이 맞지 않아 NaN이 돼요.","기준 열이 NaN인 행은 기본으로 빠지고, `dropna=False`면 남아요."]}],covers:{"pandas-group-01":[`aggregate`],"pandas-group-02":[`groupby`],"pandas-group-03":[`size-count`,`steps`],"pandas-group-04":[`size-count`],"pandas-group-cumulative-20261023":[`cumsum`],"pandas-group-scaffold-01":[`size-count`,`groupby`],"pandas-group-scaffold-02":[`groupby`,`aggregate`],"pandas-group-steps-form-01":[`steps`,`groupby`],"pandas-group-transfer-02":[`transform`],"pandas-null-groups-20261019":[`null-key`],"pandas-unique-buyers-20261020":[`size-count`,`aggregate`]}},{id:`theory-numpy-structure`,version:2,concept_id:`numpy-structure`,title:`배열 구조와 축`,minutes:18,steps:[{type:`explain`,id:`array-shape`,title:`NumPy 배열 만들기`,body:"NumPy(넘파이)는 숫자를 표처럼 모아 한꺼번에 계산하게 해 주는 Python 도구 모음(라이브러리)이에요. `import numpy as np`는 NumPy를 불러와 `np`라는 짧은 이름을 붙이는 줄이라, 그 뒤로는 `np.array()`처럼 앞에 `np.`을 붙여 써요. `np.array(리스트)`는 리스트(대괄호 안에 값을 쉼표로 늘어놓은 묶음)로 배열(ndarray, NumPy가 값을 칸에 나란히 담는 묶음)을 만들고, 리스트 안에 길이가 같은 리스트를 넣으면 행과 열이 있는 2차원 배열이 돼요. `.ndim`은 축(값이 늘어선 방향)의 개수이고, `.shape`는 축마다 길이를 바깥 축부터 괄호 안에 적은 튜플(값을 묶은 것)이에요.",code:`import numpy as np
cups = np.array([2, 0, 3])
print(cups.ndim, cups.shape)
temp = np.array([[3, 5, 8, 2],
                 [1, 4, 6, 7]])
print(temp.ndim, temp.shape)`,trace:["`import numpy as np` → NumPy를 불러와 np라는 짧은 이름을 붙여요","`cups = np.array([2, 0, 3])` → 사흘 동안 마신 커피 잔 수가 한 줄로 늘어선 1차원 배열이에요","`print(cups.ndim, cups.shape)` → 축 1개, 그 축의 길이 3 → **1 (3,)**. 값이 하나뿐인 튜플은 `(3,)`처럼 끝에 쉼표를 붙여 적어요","`temp = np.array([[3, 5, 8, 2], [1, 4, 6, 7]])` → 안쪽 리스트 하나가 한 행이 되어, 두 도시의 나흘 기온이 2행 4열 표로 담겨요","`print(temp.ndim, temp.shape)` → 축 2개, 바깥 축(행) 길이 2 · 안쪽 축(열) 길이 4 → **2 (2, 4)**"],output:`1 (3,)
2 (2, 4)
`,mistake:"shape를 (열 수, 행 수)로 거꾸로 읽기. shape는 바깥 축부터 적어서 2차원이면 (행 수, 열 수)예요. `(2, 4)`는 2행 4열이고, 칸의 개수 8과도 달라요.",in_code:"데이터를 불러온 뒤 `print(data.shape)`로 모양부터 확인하는 줄을 자주 봐요. AI가 쓴 코드가 오류를 내면 계산 앞뒤의 shape를 찍어 보는 것이 첫 점검이에요."},{type:`example`,id:`theory-numpy-structure-ex1`,kind:`line`,title:`(3,)이 나오는 줄`,prompt:`아래 코드에서 (3,)을 출력하는 줄을 고르세요.`,code:`import numpy as np
p1 = np.array([[6, 1, 4]])
p2 = np.array([6, 1, 4])
p3 = np.array([[6], [1], [4]])
print(p1.shape)
print(p2.shape)
print(p3.shape)`,output:`(1, 3)
(3,)
(3, 1)
`,choices:[`5`,`6`,`7`],answer:`6`,feedback:{5:`바깥 대괄호가 한 겹 더 있어도 축은 하나라고 생각했나요?`,7:`값을 세로로 한 칸씩 늘어놓으면 축이 하나라고 생각했나요?`},explanation:`p1은 안쪽 리스트 하나가 한 행이라 (1, 3), p3는 값이 하나인 행이 셋이라 (3, 1)이에요. 대괄호가 한 겹인 p2만 축이 하나라서 (3,)이 나와요.`,card:`array-shape`,check:{type:`prints`,target:`(3,)`}},{type:`explain`,id:`index`,title:`행과 열 번호로 꺼내기`,body:"배열의 칸에도 리스트처럼 0부터 번호가 붙어요. 2차원 배열은 `rain[행, 열]`처럼 쉼표 앞에 행 번호, 뒤에 열 번호를 적어 한 칸을 꺼내요. 번호를 하나만 적은 `rain[1]`은 1번 행 전체이고, 행 자리에 `:`(처음부터 끝까지)를 쓴 `rain[:, 0]`은 모든 행의 0번 열이에요. `.tolist()`는 배열을 보통 리스트로 바꿔 보여 줘요. 꺼낸 한 칸은 NumPy의 수라서 `float()`·`int()`로 보통 Python 수로 바꿔 써요.",code:`import numpy as np
rain = np.array([[0.5, 2.0, 0.0],
                 [1.5, 0.0, 3.5]])
print(float(rain[1, 2]))
print(rain[1].tolist())
print(rain[:, 0].tolist())`,trace:["`rain = np.array([[0.5, 2.0, 0.0], [1.5, 0.0, 3.5]])` → 두 지역(행)의 사흘(열) 강수량(mm)을 2행 3열로 담아요","`float(rain[1, 2])` → 1번 행(둘째 행)의 2번 열(셋째 칸)을 꺼내 Python 소수로 바꿔요 → **3.5**","`rain[1].tolist()` → 번호가 하나면 그 행 전체 → **[1.5, 0.0, 3.5]**","`rain[:, 0].tolist()` → 행 자리의 `:`는 모든 행, 열 자리의 0은 0번 열 → **[0.5, 1.5]**"],output:`3.5
[1.5, 0.0, 3.5]
[0.5, 1.5]
`,mistake:"`rain[:, 0]`을 0번 행으로 읽기. 쉼표 앞이 행, 뒤가 열이라 `[:, 0]`은 모든 행의 0번 열, 곧 첫 번째 열이에요. 0번 행은 `rain[0]`이에요.",in_code:"`X[:, 0]`은 표의 첫 번째 열만, `X[0]`은 첫 번째 행만 꺼내는 흔한 줄이에요. 꺼낸 칸을 튜플이나 리스트에 담아 출력하면 `np.float64(3.5)`처럼 보여서, `float()`나 `.tolist()`로 바꾸는 줄이 함께 나와요."},{type:`explain`,id:`reshape`,title:`reshape는 순서대로 다시 잘라요`,body:"`np.arange(8)`은 0부터 7까지 정수 여덟 개를 차례로 담은 1차원 배열이에요(8은 들어가지 않아요). `reshape(행, 열)`은 값의 순서를 그대로 둔 채 앞에서부터 한 행씩 채워 모양만 바꿔요. 새 모양의 칸 수(축 길이를 모두 곱한 값)는 원래 값 개수와 같아야 하고, 다르면 오류가 나요. 길이 하나를 `-1`로 적으면 NumPy가 전체 개수를 다른 축 길이의 곱으로 나눠 채워요. 축이 셋인 (2, 2, 2)는 바깥 축부터 '2묶음 × 묶음마다 2행 × 행마다 2칸'으로 읽어요.",code:`import numpy as np
nums = np.arange(8)
two = nums.reshape(2, -1)
print(two.shape, two.tolist())
cube = nums.reshape(2, 2, -1)
print(cube.shape, cube[1].tolist())`,trace:["`nums = np.arange(8)` → 0, 1, …, 7을 차례로 담은 배열이에요","`two = nums.reshape(2, -1)` → 2행으로 자르고, -1 자리는 8 ÷ 2 = 4가 돼요. 앞에서부터 4개씩 한 행을 채워요","`print(two.shape, two.tolist())` → **(2, 4) [[0, 1, 2, 3], [4, 5, 6, 7]]**","`cube = nums.reshape(2, 2, -1)` → -1 자리는 8 ÷ (2 × 2) = 2라서 (2, 2, 2)예요","`print(cube.shape, cube[1].tolist())` → `cube[1]`은 바깥 축의 1번 묶음(2행 2열) → **(2, 2, 2) [[4, 5], [6, 7]]**"],output:`(2, 4) [[0, 1, 2, 3], [4, 5, 6, 7]]
(2, 2, 2) [[4, 5], [6, 7]]
`,mistake:"칸 수만 같으면 어떤 모양이든 뜻이 같다고 생각하기. `nums.reshape(4, 2)`도 8칸이지만 [[0, 1], [2, 3], …]로 잘려서, (2, 4)에서 [0, 4]였던 0번 열이 [0, 2, 4, 6]이 돼요. reshape는 값을 다시 잘라 담을 뿐 열을 그대로 옮겨 주지 않아요.",in_code:"한 줄로 읽은 값을 `data.reshape(-1, 3)`으로 '3칸씩 한 행'인 표로 바꾸는 줄을 자주 봐요. -1 자리는 행 수를 알아서 맞추지만, 값 개수가 3으로 나누어떨어지지 않으면 오류가 나요."},{type:`example`,id:`theory-numpy-structure-ex2`,kind:`choice`,title:`좌석 번호를 4개씩`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
seat = np.arange(12).reshape(-1, 4)
print(seat[:, 0].tolist())`,output:`[0, 4, 8]
`,choices:[`[0, 4, 8]`,`[0, 1, 2, 3]`,`[0, 3, 6, 9]`,`[0, 1, 2]`],answer:`[0, 4, 8]`,feedback:{"[0, 1, 2, 3]":`[:, 0]이 첫 번째 행을 꺼낸다고 생각했나요?`,"[0, 3, 6, 9]":`reshape(-1, 4)가 4행으로 자르고 -1 자리가 열 수가 된다고 생각했나요?`,"[0, 1, 2]":`reshape가 위에서 아래로 한 열씩 채운다고 생각했나요?`},explanation:`-1 자리는 12 ÷ 4 = 3이라 3행 4열이고, 앞에서부터 한 행씩 채워 [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]]이 돼요. [:, 0]은 모든 행의 0번 열이라 [0, 4, 8]이에요.`,card:`reshape`},{type:`explain`,id:`axis`,title:`axis로 접을 방향을 정해요`,body:"`sum()`(합)·`mean()`(평균)·`max()`(가장 큰 값)처럼 여러 값을 하나로 줄이는 계산은 `axis`로 어느 축을 따라 줄일지 정해요. `axis=0`은 0번 축(행)을 따라 위아래로 접어서 열마다 값 하나가 남아요. `axis=1`은 1번 축(열)을 따라 좌우로 접어서 행마다 값 하나가 남아요. 접은 축은 shape에서 빠지고, axis를 적지 않으면 모든 칸을 수 하나로 줄여요. 평균은 나누어떨어져도 소수로 나와요.",code:`import numpy as np
km = np.array([[4, 6, 2, 8],
               [3, 5, 7, 1]])
col = km.sum(axis=0)
print(col.tolist(), col.shape)
print(km.mean(axis=1).tolist())`,trace:["`km = np.array([[4, 6, 2, 8], [3, 5, 7, 1]])` → 두 사람(행)이 나흘(열) 동안 달린 거리(km)를 2행 4열로 담아요","`col = km.sum(axis=0)` → 행들을 위아래로 접어 열마다 더해요: 4+3, 6+5, 2+7, 8+1","`print(col.tolist(), col.shape)` → 열 4개마다 하나씩 남고 0번 축은 빠져요 → **[7, 11, 9, 9] (4,)**","`km.mean(axis=1)` → 행마다 네 값을 평균 내요: 20 ÷ 4, 16 ÷ 4 → **[5.0, 4.0]**"],output:`[7, 11, 9, 9] (4,)
[5.0, 4.0]
`,mistake:"`axis=0`을 '0번 행만 계산'으로 읽기. axis는 고를 줄이 아니라 접어서 없앨 축이에요. `axis=0`이면 행 축이 없어져 열 개수만큼 값이 남아요.",in_code:"분석 코드의 `X.mean(axis=0)`은 열(항목)마다 평균을 내는 줄이에요. 한 행이 데이터 한 건이면 `axis=0`은 항목별, `axis=1`은 건별 결과라서, 결과 개수가 열 수인지 행 수인지로 맞게 썼는지 확인해요."},{type:`example`,id:`theory-numpy-structure-ex3`,kind:`choice`,title:`두 과목 중 높은 점수`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
exam = np.array([[70, 85],
                 [90, 60],
                 [80, 75]])
print(exam.max(axis=1).tolist())`,output:`[85, 90, 80]
`,choices:[`[85, 90, 80]`,`[90, 85]`,`[155, 150, 155]`,`90`],answer:`[85, 90, 80]`,feedback:{"[90, 85]":`axis=1이 열마다 값 하나를 남긴다고 생각했나요?`,"[155, 150, 155]":`max도 sum처럼 그 축의 값을 모두 더한다고 생각했나요?`,90:`axis를 적어도 모든 칸에서 가장 큰 값 하나만 남는다고 생각했나요?`},explanation:`axis=1은 한 행 안의 열들을 좌우로 접어 행마다 값 하나를 남겨요. 학생마다 두 점수 중 큰 값인 85, 90, 80이 남아요.`,card:`axis`},{type:`explain`,id:`all-any`,title:`참·거짓 배열은 all·any로 모아요`,body:"배열의 칸에는 `True`(참)·`False`(거짓)도 담을 수 있어요. `all()`은 모든 값이 True일 때만 True, `any()`는 하나라도 True면 True를 돌려줘요. 둘 다 `sum()`처럼 `axis`를 받아서 `axis=0`이면 열마다, `axis=1`이면 행마다 결과 하나가 남고, axis가 없으면 전체를 보고 하나만 돌려줘요.",code:`import numpy as np
rec = [[True, False, True],
       [False, False, True]]
hit = np.array(rec)
print(hit.all(axis=0).tolist())
print(hit.any(axis=1).tolist())`,trace:["`rec = [[True, False, True], [False, False, True]]` → 두 사람(행)이 사흘(열) 동안 운동 목표를 채웠는지 적은 리스트예요","`hit = np.array(rec)` → 2행 3열의 참·거짓 배열이 돼요","`hit.all(axis=0)` → 열(날)마다 두 사람이 모두 True인지 봐요. 셋째 날만 둘 다 채웠어요 → **[False, False, True]**","`hit.any(axis=1)` → 행(사람)마다 하루라도 True인지 봐요. 두 사람 모두 하루 이상 채웠어요 → **[True, True]**"],output:`[False, False, True]
[True, True]
`,mistake:"`all`과 `any`를 바꿔 읽기. `all`은 '모두 참', `any`는 '하나라도 참'이에요. 첫 사람은 사흘 중 이틀을 채워서 `any`로는 True지만 `all`로는 False예요.",in_code:"데이터 점검 코드에서 `bad.any(axis=1)`은 '문제 있는 칸이 하나라도 있는 행', `ok.all(axis=1)`은 '모든 칸이 괜찮은 행'을 찾는 줄이에요."},{type:`explain`,id:`keepdims`,title:`keepdims로 줄인 축을 1로 남겨요`,body:"축을 따라 줄이면 그 축이 shape에서 빠져서 (2, 4) 배열의 `mean(axis=1)`은 (2,)가 돼요. `keepdims=True`를 함께 쓰면 줄인 축을 길이 1로 남겨 (2, 1)이 되고, 축 개수는 그대로예요. 축이 몇 개든 axis로 정한 축만 1이 되고 나머지 길이는 그대로예요. 이렇게 남긴 (2, 1) 결과를 원래 표에서 빼면 행마다 자기 행의 값이 빠져요(길이 1인 축을 늘려 맞추는 규칙은 다음 강의에서 자세히 배워요).",code:`import numpy as np
km = np.array([[4, 6, 2, 8],
               [3, 5, 7, 1]])
avg = km.mean(axis=1, keepdims=True)
print(avg.shape, avg.tolist())
print((km - avg)[1].tolist())`,trace:["`km = np.array([[4, 6, 2, 8], [3, 5, 7, 1]])` → 앞 카드와 같은 두 사람의 나흘 달리기 거리예요","`avg = km.mean(axis=1, keepdims=True)` → 행마다 평균을 내고, 줄인 1번 축을 길이 1로 남겨요","`print(avg.shape, avg.tolist())` → keepdims가 없으면 (2,)였을 모양이 (2, 1)이에요 → **(2, 1) [[5.0], [4.0]]**","`(km - avg)[1]` → 각 행에서 자기 행의 평균을 빼요. 둘째 사람은 3−4, 5−4, 7−4, 1−4 → **[-1.0, 1.0, 3.0, -3.0]**"],output:`(2, 1) [[5.0], [4.0]]
[-1.0, 1.0, 3.0, -3.0]
`,mistake:"`keepdims=True`가 값을 바꾼다고 생각하기. 평균값 5.0과 4.0은 그대로이고, 모양만 (2,)에서 (2, 1)로 바뀌어요.",in_code:"AI가 쓴 정규화 코드에서 `X - X.mean(axis=1, keepdims=True)`는 '행마다 자기 평균 빼기'예요. axis를 잘못 고르면 오류 없이 다른 기준의 평균이 빠지니, 기준이 행인지 열인지 먼저 확인해요."},{type:`example`,id:`theory-numpy-structure-ex4`,kind:`choice`,title:`세 축 중 하나 줄이기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
vol = np.arange(24).reshape(2, 3, 4)
out = vol.sum(axis=1, keepdims=True)
print(out.shape)`,output:`(2, 1, 4)
`,choices:[`(2, 1, 4)`,`(2, 4)`,`(1, 3, 1)`,`(2, 3, 1)`],answer:`(2, 1, 4)`,feedback:{"(2, 4)":`keepdims=True여도 줄인 축이 shape에서 빠진다고 생각했나요?`,"(1, 3, 1)":`axis=1로 정한 축만 남고 나머지 축이 1이 된다고 생각했나요?`,"(2, 3, 1)":`axis=1이 마지막 축을 줄인다고 생각했나요?`},explanation:`axis=1은 가운데 축(길이 3)을 따라 더해요. keepdims=True라서 그 축만 길이 1로 남고 앞뒤 길이 2와 4는 그대로라 (2, 1, 4)예요.`,card:`keepdims`},{type:`explain`,id:`transpose-diff`,title:`행·열 맞바꾸기와 이웃끼리 빼기`,body:"`.T`는 행과 열을 맞바꾼 배열이에요(전치라고 해요). (2, 3) 배열의 `.T`는 (3, 2)이고, 원래의 0번 열이 새 0번 행이 돼요. 값을 순서대로 다시 자르는 `reshape(3, 2)`와는 결과가 달라요. `np.diff(배열, axis=1)`은 행마다 이웃한 두 값의 차이(뒤 값 − 앞 값)를 차례로 구해서, 그 축의 길이가 1 줄어요. `axis=0`이면 열마다 아래 값 − 위 값이에요.",code:`import numpy as np
deg = np.array([[3, 7, 6],
                [9, 4, 8]])
print(deg.T.shape, deg.T.tolist())
print(np.diff(deg, axis=1).tolist())
print(np.diff(deg, axis=0).tolist())`,trace:["`deg = np.array([[3, 7, 6], [9, 4, 8]])` → 두 도시(행)의 사흘(열) 기온을 2행 3열로 담아요","`deg.T` → 행과 열을 맞바꿔요. 원래 0번 열 [3, 9]가 새 0번 행이 돼요 → **(3, 2) [[3, 9], [7, 4], [6, 8]]**","`np.diff(deg, axis=1)` → 행마다 뒤 값 − 앞 값: 7−3, 6−7 그리고 4−9, 8−4 → **[[4, -1], [-5, 4]]**","`np.diff(deg, axis=0)` → 열마다 아래 값 − 위 값: 9−3, 4−7, 8−6 → **[[6, -3, 2]]**"],output:`(3, 2) [[3, 9], [7, 4], [6, 8]]
[[4, -1], [-5, 4]]
[[6, -3, 2]]
`,mistake:"`np.diff`를 '앞 값 − 뒤 값'으로 계산하기. 늘 뒤 값에서 앞 값을 빼서 오르면 양수, 내리면 음수예요. 값이 3개면 사이의 간격은 2개라 결과도 2개예요.",in_code:"날짜순 기록에서 `np.diff(levels)`로 전날 대비 변화량을 구하는 줄을 자주 봐요. `X.T`는 행렬곱(이 강의 끝에서 배워요)을 하기 전에 행과 열을 바꿔 모양을 맞출 때 자주 나와요."},{type:`explain`,id:`squeeze`,title:`길이 1인 축은 squeeze로 없애요`,body:"`np.zeros((1, 3, 1))`은 0으로 채운 (1, 3, 1) 모양의 배열을 만들어요. 길이가 1인 축은 칸 수를 바꾸지 않는 껍데기 같은 축이라 `np.squeeze()`로 없앨 수 있어요. 축을 정하지 않으면 길이 1인 축을 모두 없애고, `axis=0`처럼 정하면 그 축 하나만 없애요. 길이가 1이 아닌 축을 정하면 오류(ValueError)가 나요.",code:`import numpy as np
box = np.zeros((1, 3, 1))
print(np.squeeze(box).shape)
print(np.squeeze(box, axis=0).shape)
print(np.squeeze(box, axis=2).shape)`,trace:["`box = np.zeros((1, 3, 1))` → 0번 축과 2번 축의 길이가 1인 배열이에요","`np.squeeze(box)` → 길이 1인 축을 모두 없애 길이 3인 축만 남아요 → **(3,)**","`np.squeeze(box, axis=0)` → 0번 축만 없애고 2번 축은 남겨요 → **(3, 1)**","`np.squeeze(box, axis=2)` → 2번 축만 없애요 → **(1, 3)**"],output:`(3,)
(3, 1)
(1, 3)
`,mistake:"`squeeze`가 값을 합치거나 줄인다고 생각하기. 칸은 3개 그대로이고 모양만 바뀌어요. `np.squeeze(box, axis=1)`처럼 길이 3인 축을 정하면 없앨 수 없어서 오류가 나요.",in_code:"모델이 (1, n)이나 (n, 1) 모양으로 돌려준 결과를 `np.squeeze(pred)`로 (n,)으로 펴는 줄을 자주 봐요. 묶음(배치) 축처럼 지켜야 할 길이 1 축이 있으면 `axis=`로 없앨 축을 꼭 정해요."},{type:`explain`,id:`join`,title:`concatenate는 잇고, stack은 쌓아요`,body:"`np.concatenate([배열, 배열])`은 있던 축을 따라 배열을 이어 붙여서 축 개수가 그대로예요. 길이 3인 1차원 배열 둘을 이으면 길이 6인 (6,)이 돼요. `np.stack([배열, 배열])`은 새 축을 하나 만들어 배열을 쌓아서, 같은 둘을 쌓으면 (2, 3)인 2차원 배열이 돼요. 둘 다 `axis=`를 받는데, 적지 않으면 0번 축이에요.",code:`import numpy as np
lo = np.array([1, 3, 5])
hi = np.array([2, 4, 6])
cat = np.concatenate([lo, hi])
pile = np.stack([lo, hi])
print(cat.shape, pile.shape)`,trace:["`lo = np.array([1, 3, 5])` → 길이 3인 1차원 배열이에요","`hi = np.array([2, 4, 6])` → 같은 길이의 배열을 하나 더 만들어요","`cat = np.concatenate([lo, hi])` → 0번 축을 따라 이어 붙여 [1, 3, 5, 2, 4, 6]이 되고, 여전히 1차원이에요","`pile = np.stack([lo, hi])` → 새 축을 만들어 한 행씩 쌓아 [[1, 3, 5], [2, 4, 6]]이 돼요","`print(cat.shape, pile.shape)` → **(6,) (2, 3)**"],output:`(6,) (2, 3)
`,mistake:"`concatenate`와 `stack`이 같은 일을 한다고 생각하기. 칸 수는 6개로 같아도 `concatenate`는 축 개수가 그대로이고 `stack`은 축이 하나 늘어요.",in_code:"나눠 계산한 결과를 `np.concatenate(parts)`로 한 줄로 잇거나, 길이가 같은 결과들을 `np.stack(chunks)`로 표 하나로 만드는 줄을 자주 봐요."},{type:`example`,id:`theory-numpy-structure-ex5`,kind:`choice`,title:`세 개를 잇거나 쌓기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
z = np.zeros((2, 2))
cat3 = np.concatenate([z, z, z])
pile3 = np.stack([z, z, z])
print(cat3.shape, pile3.ndim)`,output:`(6, 2) 3
`,choices:[`(6, 2) 3`,`(6, 2) 2`,`(3, 2, 2) 2`,`(2, 6) 3`],answer:`(6, 2) 3`,feedback:{"(6, 2) 2":`stack도 새 축을 만들지 않고 이어 붙인다고 생각했나요?`,"(3, 2, 2) 2":`concatenate와 stack이 하는 일을 서로 바꿔 생각했나요?`,"(2, 6) 3":`concatenate가 axis를 적지 않으면 1번 축(열)을 따라 잇는다고 생각했나요?`},explanation:`concatenate는 0번 축을 따라 2행씩 세 번 이어 (6, 2)가 돼요. stack은 새 축을 맨 앞에 만들어 (2, 2) 배열 셋을 쌓으니 (3, 2, 2), 축은 3개예요.`,card:`join`},{type:`explain`,id:`dtype`,title:`배열은 한 가지 자료형만 담아요`,body:"배열은 모든 칸이 같은 자료형(dtype, 값의 종류)이에요. 종류가 섞인 리스트로 만들면 모두 담을 수 있는 한 가지로 맞춰져서, 정수와 True·False가 섞이면 정수 배열이 되고 True는 1, False는 0이 돼요. 정수와 소수가 섞이면 소수 배열이 돼요. 배열에서 꺼낸 한 칸은 Python의 `int`가 아니라 `np.int64` 같은 NumPy의 수예요. `[int(k) for k in 배열 if 조건]`은 칸을 하나씩 k에 담아 조건이 참인 칸만 `int()`로 바꿔 새 리스트로 모아요(리스트 컴프리헨션이라고 해요).",code:`import numpy as np
mix = np.array([5, False, True])
print(mix.dtype, mix.tolist())
print(type(mix[0]))
pos = [int(k) for k in mix if k > 0]
print(pos)`,trace:["`mix = np.array([5, False, True])` → 정수와 참·거짓이 섞여 정수 배열이 돼요","`print(mix.dtype, mix.tolist())` → 자료형은 64비트 정수, False는 0, True는 1 → **int64 [5, 0, 1]**","`type(mix[0])` → 꺼낸 칸의 종류는 NumPy 정수 → **<class 'numpy.int64'>**","`pos = [int(k) for k in mix if k > 0]` → 5, 0, 1을 차례로 k에 담아 0보다 큰 5와 1만 Python 정수로 바꿔 모아요","`print(pos)` → **[5, 1]**"],output:`int64 [5, 0, 1]
<class 'numpy.int64'>
[5, 1]
`,mistake:"배열이 칸마다 원래 값을 그대로 지킨다고 생각하기. `[5, False, True]`로 만든 배열에는 False와 True가 남지 않고 0과 1이 들어가요. 참·거짓인지 따져야 하면 배열로 바꾸기 전에 원래 리스트에서 확인해요.",in_code:"AI가 쓴 코드에서 `[int(k) for k in arr]`나 `arr.tolist()`는 NumPy 수를 Python 수로 바꿔, 결과를 JSON 같은 다른 형식으로 저장하거나 출력할 때 자주 나와요."},{type:`example`,id:`theory-numpy-structure-ex6`,kind:`choice`,title:`섞인 값으로 만든 배열`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
mixed = np.array([1.5, True, 3])
print(mixed.tolist())`,output:`[1.5, 1.0, 3.0]
`,choices:[`[1.5, 1.0, 3.0]`,`[1.5, True, 3]`,`[1, 1, 3]`,`[1.5, 1, 3]`],answer:`[1.5, 1.0, 3.0]`,feedback:{"[1.5, True, 3]":`배열이 칸마다 원래 자료형을 따로 지킨다고 생각했나요?`,"[1, 1, 3]":`섞인 값은 모두 정수로 맞춰진다고 생각했나요?`,"[1.5, 1, 3]":`소수 배열이 되어도 정수였던 값은 정수로 남는다고 생각했나요?`},explanation:`소수 1.5가 있으니 세 값을 모두 담을 수 있는 소수 배열이 돼요. True는 1이 되고 소수로 맞춰져 1.0, 3도 3.0이라 [1.5, 1.0, 3.0]이에요.`,card:`dtype`},{type:`explain`,id:`isinstance`,title:`isinstance로 종류를 확인해요`,body:"`isinstance(값, 자료형)`은 값이 그 자료형에 속하는지 True·False로 알려 줘요. 배열에서 꺼낸 NumPy 정수는 숫자처럼 보여도 Python의 `int`가 아니고, NumPy 정수 종류 전체를 뜻하는 `np.integer`에 속해요. 자료형 자리에 `(int, np.integer)`처럼 튜플을 주면 그중 하나에만 맞아도 True예요. True·False는 Python에서 `int`의 한 종류라 `isinstance(False, int)`도 True예요. 그래서 참·거짓을 빼려면 `not isinstance(값, bool)`(bool이 아니면 True)을 `and`로 함께 써요.",code:`import numpy as np
num = np.array([5, 8])[1]
ints = (int, np.integer)
print(isinstance(num, int))
print(isinstance(num, ints))
print(isinstance(False, int))`,trace:["`num = np.array([5, 8])[1]` → 배열의 1번 칸 8을 꺼내요. 종류는 NumPy 정수(np.int64)예요","`ints = (int, np.integer)` → Python 정수와 NumPy 정수 종류를 튜플로 묶어 이름을 붙여요","`isinstance(num, int)` → NumPy 정수는 Python의 int가 아니라 **False**","`isinstance(num, ints)` → 튜플 안의 `np.integer`에 맞으니 **True**","`isinstance(False, int)` → bool은 int의 한 종류라 **True**"],output:`False
True
True
`,mistake:"`print(num)`이 8로 보이니 `int`라고 생각하기. 보이는 모양은 같아도 종류가 달라서 `isinstance(num, int)`는 False예요. `int(num)`으로 바꾼 값이어야 Python 정수예요.",in_code:"AI가 쓴 검사 코드가 `isinstance(n, int)`만 보면 배열에서 꺼낸 NumPy 정수를 거절해요. 그래서 `np.integer`를 함께 넣거나, 먼저 `int()`로 바꾼 뒤 검사하는 줄을 자주 봐요."},{type:`explain`,id:`matmul`,title:`칸끼리 곱하기와 행렬곱`,body:"배열끼리 `*`는 같은 자리의 칸끼리 곱해서 모양이 그대로예요. `@`는 행렬곱이라, 결과의 [i, j] 칸은 왼쪽의 i번 행과 오른쪽의 j번 열을 칸끼리 곱해 모두 더한 값이에요. 그래서 (m, n) @ (n, p)처럼 왼쪽의 열 수와 오른쪽의 행 수가 같아야 하고 결과는 (m, p)이며, 안쪽 길이가 다르면 오류가 나요. 오른쪽이 길이 n인 1차원 배열이면 결과는 축 하나가 빠진 (m,)이에요. `np.dot(a, b)`도 2차원끼리는 `@`와 같은 행렬곱이고, `np.ones((4, 2))`는 1로 채운 4행 2열 배열이에요.",code:`import numpy as np
ma = np.array([[1, 2], [3, 0]])
mb = np.array([[2, 0], [1, 4]])
print((ma * mb).tolist())
print((ma @ mb).tolist())
print((np.ones((4, 2)) @ mb).shape)`,trace:["`ma = np.array([[1, 2], [3, 0]])` → 2행 2열 배열이에요","`mb = np.array([[2, 0], [1, 4]])` → 곱할 2행 2열 배열이에요","`ma * mb` → 같은 자리끼리 곱해요: 1×2, 2×0, 3×1, 0×4 → **[[2, 0], [3, 0]]**","`ma @ mb` → [0, 0] 칸은 ma의 0번 행 [1, 2]와 mb의 0번 열 [2, 1]을 곱해 더한 1×2 + 2×1 = 4예요. 같은 방법으로 → **[[4, 8], [6, 0]]**","`np.ones((4, 2)) @ mb` → (4, 2) @ (2, 2)는 안쪽 2와 2가 같아 바깥 길이만 남아요 → **(4, 2)**"],output:`[[2, 0], [3, 0]]
[[4, 8], [6, 0]]
(4, 2)
`,mistake:"`*`를 수학의 행렬곱으로 읽기. NumPy 배열에서 `*`는 칸끼리 곱하기이고 행렬곱은 `@`예요. `*`는 두 배열의 모양이 맞아야 해서, (4, 2)와 (2, 4)처럼 맞출 수 없는 모양이면 오류가 나요(모양을 맞추는 규칙은 다음 강의의 브로드캐스팅이에요).",in_code:"선형 모델의 예측 `features @ weights`는 데이터 표의 행마다 가중치를 곱해 더한 값이에요. 함수 위에 붙는 `@이름` 줄(데코레이터)과 달리, 두 값 사이의 `@`는 행렬곱이에요."},{type:`example`,id:`theory-numpy-structure-ex7`,kind:`choice`,title:`사람별 과일값 합계`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
buy = np.array([[2, 1], [0, 3]])
won = np.array([5, 4])
print((buy @ won).tolist())`,output:`[14, 12]
`,choices:[`[14, 12]`,`[[10, 4], [0, 12]]`,`[10, 17]`,`26`],answer:`[14, 12]`,feedback:{"[[10, 4], [0, 12]]":`@가 같은 자리끼리 곱하기만 하고 더하지는 않는다고 생각했나요?`,"[10, 17]":`왼쪽 배열의 열과 오른쪽 값을 짝지어 곱한다고 생각했나요?`,26:`@가 모든 곱을 더해 수 하나를 만든다고 생각했나요?`},explanation:`@는 buy의 행마다 won과 칸끼리 곱해 더해요. 첫 사람은 2×5 + 1×4 = 14, 둘째 사람은 0×5 + 3×4 = 12이고, 오른쪽이 1차원이라 결과도 1차원 [14, 12]예요.`,card:`matmul`},{type:`summary`,points:["`import numpy as np`로 불러와 `np.array(리스트)`로 배열을 만들어요. `.shape`는 바깥 축부터 적은 길이이고, 축이 하나면 `(3,)`처럼 써요.","`a[행, 열]`은 한 칸, `a[1]`은 행 전체, `a[:, 0]`은 모든 행의 0번 열이에요. `reshape`는 순서대로 다시 자르고 `-1`은 길이를 알아서 채우며, `.T`는 행과 열을 맞바꿔요.","`axis=0`은 열마다, `axis=1`은 행마다 값 하나를 남기고 그 축은 사라져요. `keepdims=True`면 길이 1로 남아요. `all`·`any`도 같은 규칙이고, `np.diff`는 그 축의 길이를 1 줄여요.","`np.squeeze`는 길이 1인 축을 없애고(`axis=`를 쓰면 그 축만), `concatenate`는 있던 축으로 잇고 `stack`은 새 축을 만들어 쌓아요.","배열은 한 가지 자료형이라 True는 1이 되고, 꺼낸 칸은 `np.int64` 같은 NumPy 수예요. `isinstance(값, int)`는 False, `np.integer`는 True이고, True·False도 `int`에 속해요.","`*`는 칸끼리 곱하고 `@`는 행렬곱이에요. (m, n) @ (n, p)는 (m, p)이고 안쪽 길이가 다르면 오류예요."]}],covers:{"numpy-shape-01":[`array-shape`],"numpy-axis-01":[`axis`],"numpy-shape-02":[`reshape`,`array-shape`],"numpy-axis-02":[`axis`,`keepdims`,`index`],"numpy-transpose-mean-20261020":[`transpose-diff`,`axis`],"numpy-adjacent-diff-20261021":[`transpose-diff`],"numpy-stack-concatenate-20261023":[`join`,`array-shape`],"numpy-squeeze-axis-20261025":[`squeeze`],"numpy-index-foundation-01":[`index`],"numpy-shape-application-01":[`axis`,`keepdims`],"numpy-kept-axis-20261019":[`keepdims`],"numpy-reshape-columns-20261020":[`reshape`,`index`],"numpy-row-all-20261023":[`all-any`],"numpy-scalar-types-20261023":[`isinstance`,`dtype`],"numpy-integer-inputs-20261023":[`isinstance`,`dtype`],"numpy-coercion-types-20261023":[`dtype`,`isinstance`],"numpy-axis-mean-form-01":[`reshape`,`axis`],"numpy-matmul-01":[`matmul`],"numpy-matmul-02":[`matmul`]}},{id:`theory-numpy-broadcast`,version:2,concept_id:`numpy-broadcast`,title:`브로드캐스팅`,minutes:13,steps:[{type:`explain`,id:`scalar`,title:`수 하나는 모든 칸에 적용돼요`,body:"배열에 수 하나를 더하거나 곱하면 모든 칸에 똑같이 계산되고 모양은 그대로예요. 이렇게 크기가 다른 값을 맞춰 계산하는 규칙을 브로드캐스팅(모양을 넓혀 맞추기)이라고 해요. `>`·`<`·`>=` 같은 비교도 칸마다 이뤄져서 같은 모양의 True·False 배열이 나와요. 모양이 같은 배열끼리는 같은 자리의 칸끼리 계산해요.",code:`import numpy as np
cm = np.array([150, 162, 171])
print((cm + 5).tolist())
print((cm > 160).tolist())
gain = np.array([2, 0, 1])
print((cm + gain).tolist())`,trace:["`cm = np.array([150, 162, 171])` → 세 사람의 키(cm)를 담아요","`cm + 5` → 5가 세 칸 모두에 더해져요 → **[155, 167, 176]**","`cm > 160` → 칸마다 160보다 큰지 비교해 같은 모양의 참·거짓 배열이 돼요 → **[False, True, True]**","`gain = np.array([2, 0, 1])` → 한 해 동안 자란 키를 같은 길이로 담아요","`cm + gain` → 모양이 같으니 같은 자리끼리 더해요 → **[152, 162, 172]**"],output:`[155, 167, 176]
[False, True, True]
[152, 162, 172]
`,mistake:"리스트처럼 생각하기. 리스트의 `[1, 2] * 3`은 원소를 세 번 반복하지만, 배열의 `*`는 칸마다 곱해요. 배열에 수를 더해도 칸이 하나 붙지 않고 모든 칸의 값이 바뀌어요.",in_code:"`krw / 1300`처럼 모든 값의 단위를 바꾸거나 `cm > 160`처럼 조건을 검사하는 줄이 반복문 없이 한 줄로 쓰여요."},{type:`example`,id:`theory-numpy-broadcast-ex1`,kind:`choice`,title:`배열에 3 곱하기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
cnt = np.array([4, 7, 2])
print((cnt * 3).tolist())`,output:`[12, 21, 6]
`,choices:[`[12, 21, 6]`,`[4, 7, 2, 4, 7, 2, 4, 7, 2]`,`[12, 7, 2]`,`39`],answer:`[12, 21, 6]`,feedback:{"[4, 7, 2, 4, 7, 2, 4, 7, 2]":`배열에 정수를 곱하면 리스트처럼 원소가 반복된다고 생각했나요?`,"[12, 7, 2]":`수 하나는 첫 번째 칸에만 곱해진다고 생각했나요?`,39:`곱한 뒤 모두 더해 수 하나가 나온다고 생각했나요?`},explanation:`배열에 수 하나를 곱하면 모든 칸에 곱해져요. 4×3, 7×3, 2×3이라 [12, 21, 6]이고, 리스트처럼 원소가 반복되지 않아요.`,card:`scalar`},{type:`explain`,id:`last-axis`,title:`1차원 배열은 모든 행에 똑같이`,body:`(행, 열) 표에 길이가 열 수와 같은 1차원 배열을 더하면, 그 배열이 행마다 똑같이 더해져요. 1차원 배열의 칸은 표의 열과 짝지어져서, 0번 칸은 모든 행의 0번 열에, 1번 칸은 모든 행의 1번 열에 계산돼요. 결과의 모양은 원래 표와 같아요. 행마다 다른 값을 쓰는 것이 아니라 열마다 다른 값을 쓰는 거예요.`,code:`import numpy as np
pts = np.array([[60, 70, 80],
                [50, 65, 90]])
bonus = np.array([5, 0, 10])
out = pts + bonus
print(out.shape, out.tolist())`,trace:["`pts = np.array([[60, 70, 80], [50, 65, 90]])` → 두 학생(행)의 세 과목(열) 점수예요","`bonus = np.array([5, 0, 10])` → 과목마다 주는 가산점이에요. 길이 3은 열 수와 같아요","`out = pts + bonus` → bonus가 행마다 똑같이 더해져요. 0번 열에 5, 1번 열에 0, 2번 열에 10","`print(out.shape, out.tolist())` → 모양은 표 그대로 → **(2, 3) [[65, 70, 90], [55, 65, 100]]**"],output:`(2, 3) [[65, 70, 90], [55, 65, 100]]
`,mistake:`bonus의 값이 행마다 하나씩 더해진다고 생각하기. 5가 첫 학생, 0이 둘째 학생에게 가는 게 아니에요. bonus의 칸은 열과 짝지어져서 모든 학생의 같은 과목에 같은 값이 더해져요.`,in_code:"분석 코드의 `X - col_mean`은 열(항목)마다 정해진 기준값을 모든 행에서 빼는 줄이에요. 1차원 배열의 길이가 열 수와 같은지부터 확인해요."},{type:`example`,id:`theory-numpy-broadcast-ex2`,kind:`choice`,title:`품목별 추가 수량`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
qty = np.array([[2, 0, 1],
                [3, 4, 0]])
extra = np.array([1, 5, 2])
print((qty + extra).tolist())`,output:`[[3, 5, 3], [4, 9, 2]]
`,choices:[`[[3, 5, 3], [4, 9, 2]]`,`[[3, 5, 3], [3, 4, 0]]`,`[[2, 0, 1], [3, 4, 0], [1, 5, 2]]`,`[[3, 1, 2], [8, 9, 5]]`],answer:`[[3, 5, 3], [4, 9, 2]]`,feedback:{"[[3, 5, 3], [3, 4, 0]]":`1차원 배열이 첫 번째 행에만 더해진다고 생각했나요?`,"[[2, 0, 1], [3, 4, 0], [1, 5, 2]]":`배열끼리 +가 리스트처럼 이어 붙인다고 생각했나요?`,"[[3, 1, 2], [8, 9, 5]]":`extra의 값이 행마다 하나씩 더해진다고 생각했나요?`},explanation:`extra (3,)은 qty의 세 열과 짝지어져 행마다 똑같이 더해져요. 첫 행은 [2+1, 0+5, 1+2], 둘째 행은 [3+1, 4+5, 0+2]예요.`,card:`last-axis`},{type:`explain`,id:`rules`,title:`모양 맞추기는 오른쪽 축부터`,body:`모양이 다른 두 배열을 계산할 때 NumPy는 shape를 오른쪽 끝 축부터 하나씩 짝지어 비교해요. 짝마다 길이가 같거나 한쪽이 1이면 통과하고, 1인 쪽은 상대 길이만큼 같은 값이 늘어난 것처럼 계산돼요. 축 개수가 모자란 쪽은 왼쪽에 길이 1인 축이 있다고 봐서 (3,)은 (1, 3)처럼 다뤄요. 결과 shape는 짝마다 큰 쪽 길이이고, 길이가 다른데 둘 다 1이 아닌 짝이 하나라도 있으면 오류(ValueError)가 나요. 예를 들어 (2, 1)과 (3, 1)은 첫 축이 2와 3이라 계산되지 않아요.`,code:`import numpy as np
floor = np.array([[100], [200]])
room = np.array([1, 2, 3])
num = floor + room
print(num.shape)
print(num.tolist())`,trace:["`floor = np.array([[100], [200]])` → 층 번호를 한 행에 하나씩, (2, 1) 세로 모양으로 담아요","`room = np.array([1, 2, 3])` → 호 번호예요. 모양은 (3,)이에요","`num = floor + room` → 오른쪽 짝 1과 3은 1이 3으로 늘고, 왼쪽 짝 2와 (없음 → 1)은 2가 돼요","`print(num.shape)` → 짝마다 큰 길이를 모아 → **(2, 3)**","`print(num.tolist())` → 층마다 호 번호가 더해져요 → **[[101, 102, 103], [201, 202, 203]]**"],output:`(2, 3)
[[101, 102, 103], [201, 202, 203]]
`,mistake:`shape가 완전히 같아야만 계산된다고 생각하기. (2, 1)과 (3,)처럼 달라도 짝마다 같거나 1이면 계산돼요. 반대로 (2, 3)과 (2,)는 오른쪽 짝 3과 2가 달라 오류예요.`,in_code:"오류 메시지 `operands could not be broadcast together with shapes (2,3) (2,)`는 이 규칙에 걸렸다는 뜻이에요. 두 shape를 오른쪽 끝에 맞춰 적어 보면 어느 짝이 어긋났는지 바로 보여요."},{type:`example`,id:`theory-numpy-broadcast-ex3`,kind:`choice`,title:`세로와 가로 더하기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
tall = np.ones((3, 1))
wide = np.ones((1, 4))
print((tall + wide).shape)`,output:`(3, 4)
`,choices:[`(3, 4)`,`(1, 4)`,`(4, 3)`,`오류가 나요`],answer:`(3, 4)`,feedback:{"(1, 4)":`길이 1인 축은 늘어나지 않고 그대로 남는다고 생각했나요?`,"(4, 3)":`뒤에 쓴 배열의 길이가 결과의 첫 축이 된다고 생각했나요?`,"오류가 나요":`두 배열의 shape가 완전히 같아야만 계산된다고 생각했나요?`},explanation:`오른쪽 짝 1과 4는 4로, 왼쪽 짝 3과 1은 3으로 늘어나요. 짝마다 큰 길이를 모아 결과는 (3, 4)예요.`,card:`rules`},{type:`explain`,id:`new-axis`,title:`None으로 축을 세워요`,body:"`v[:, None]`은 1차원 배열 (n,)의 뒤에 길이 1인 축을 더해 (n, 1) 세로 모양으로 만들어요(`None` 자리에 새 축이 생겨요). `v.reshape(1, n)`은 거꾸로 (1, n) 가로 모양이에요. (행, 열) 표에서 행마다 다른 값을 계산하려면 그 값들이 (행 수, 1) 모양이어야 해요. 반대로 (n, 1) 배열에서 `c[:, 0]`처럼 열 하나를 고르면 축이 빠져 (n,)이 돼요.",code:`import numpy as np
per = np.array([1, 2])
print(per[:, None].shape)
print(per.reshape(1, 2).shape)
tbl = np.zeros((2, 3))
print((tbl + per[:, None]).tolist())`,trace:["`per = np.array([1, 2])` → 행마다 더할 값 두 개, 모양은 (2,)예요","`per[:, None]` → 뒤에 길이 1인 축을 세워요 → **(2, 1)**","`per.reshape(1, 2)` → 앞에 길이 1인 축을 둬요 → **(1, 2)**","`tbl = np.zeros((2, 3))` → 0으로 채운 2행 3열 표예요","`tbl + per[:, None]` → (2, 3)과 (2, 1)은 오른쪽 짝 1이 3으로 늘어 행마다 자기 값이 더해져요 → **[[1.0, 1.0, 1.0], [2.0, 2.0, 2.0]]**"],output:`(2, 1)
(1, 2)
[[1.0, 1.0, 1.0], [2.0, 2.0, 2.0]]
`,mistake:"`tbl + per`로도 행마다 더해진다고 생각하기. (2, 3)과 (2,)는 오른쪽 짝 3과 2가 달라 오류가 나요. 행마다 다른 값은 `per[:, None]`처럼 세로로 세워야 해요.",in_code:"`data - row_mean[:, None]`처럼 행 기준값을 빼는 줄을 자주 봐요. 같은 뜻으로 `np.newaxis`를 쓴 `row_mean[:, np.newaxis]`도 나와요."},{type:`example`,id:`theory-numpy-broadcast-ex4`,kind:`choice`,title:`세로로, 가로로`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
five = np.arange(5)
up = five[:, None]
flat = five.reshape(1, -1)
print(up.shape, flat.shape)`,output:`(5, 1) (1, 5)
`,choices:[`(5, 1) (1, 5)`,`(1, 5) (5, 1)`,`(5,) (5,)`,`(5, 1) (5,)`],answer:`(5, 1) (1, 5)`,feedback:{"(1, 5) (5, 1)":`[:, None]이 앞쪽에 길이 1인 축을 만든다고 생각했나요?`,"(5,) (5,)":`None을 넣어도 모양은 그대로라고 생각했나요?`,"(5, 1) (5,)":`reshape(1, -1)이 1차원 배열을 그대로 돌려준다고 생각했나요?`},explanation:`[:, None]은 뒤에 길이 1인 축을 세워 (5, 1)이고, reshape(1, -1)은 앞에 길이 1인 축을 두고 -1 자리가 5가 되어 (1, 5)예요.`,card:`new-axis`},{type:`explain`,id:`centering`,title:`평균을 빼는 기준 고르기`,body:"`h - h.mean(axis=0)`은 열마다 평균을 빼요. 열 평균의 모양 (열 수,)가 열과 짝지어져 모든 행에 적용되기 때문이에요. 행마다 자기 평균을 빼려면 행 평균 (행 수,)를 `[:, None]`으로 세워 (행 수, 1)로 만들어야 해요(`keepdims=True`로 구해도 같아요). 행 평균을 그대로 빼면 오른쪽 짝이 어긋나 오류가 나요. 그런데 행과 열 수가 같은 정사각 표에서는 오류 없이 열 방향으로 빠져서 틀린 값이 나와요.",code:`import numpy as np
h = np.array([[6, 9, 3], [8, 5, 2]])
by_col = h - h.mean(axis=0)
print(by_col.tolist())
by_row = h - h.mean(axis=1)[:, None]
print(by_row.tolist())`,trace:["`h = np.array([[6, 9, 3], [8, 5, 2]])` → 두 사람(행)이 사흘(열) 동안 공부한 시간이에요","`by_col = h - h.mean(axis=0)` → 날(열)마다 평균 [7.0, 7.0, 2.5]를 모든 행에서 빼요","`print(by_col.tolist())` → **[[-1.0, 2.0, 0.5], [1.0, -2.0, -0.5]]**","`by_row = h - h.mean(axis=1)[:, None]` → 사람(행)마다 평균 6.0과 5.0을 (2, 1)로 세워 자기 행에서 빼요","`print(by_row.tolist())` → **[[0.0, 3.0, -3.0], [3.0, 0.0, -3.0]]**"],output:`[[-1.0, 2.0, 0.5], [1.0, -2.0, -0.5]]
[[0.0, 3.0, -3.0], [3.0, 0.0, -3.0]]
`,mistake:"`h - h.mean(axis=1)`로도 사람마다 평균이 빠진다고 생각하기. 행 평균 (2,)는 열과 짝지어지려 해서 (2, 3)과는 오류가 나요. 2행 2열 같은 정사각 표라면 오류 없이 엉뚱한 칸에서 빠지니 더 조심해요.",in_code:"표준화 코드 `(X - X.mean(axis=0)) / X.std(axis=0)`은 열(항목)마다 평균을 빼고 표준편차(값이 흩어진 정도)로 나눠요. 행 기준이 필요하면 `keepdims=True`나 `[:, None]`이 붙어 있는지 확인해요."},{type:`example`,id:`theory-numpy-broadcast-ex5`,kind:`choice`,title:`사람마다 자기 평균 빼기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
hr = np.array([[4, 8],
               [6, 2],
               [5, 5]])
m = hr.mean(axis=1)[:, None]
print((hr - m)[:, 0].tolist())`,output:`[-2.0, 2.0, 0.0]
`,choices:[`[-2.0, 2.0, 0.0]`,`[-1.0, 1.0, 0.0]`,`[-2.0, 2.0]`,`오류가 나요`],answer:`[-2.0, 2.0, 0.0]`,feedback:{"[-1.0, 1.0, 0.0]":`mean(axis=1)이 열마다 평균을 낸다고 생각했나요?`,"[-2.0, 2.0]":`[:, 0]이 첫 번째 행을 꺼낸다고 생각했나요?`,"오류가 나요":`[:, None]으로 세운 (3, 1)도 (3, 2)와 모양을 맞출 수 없다고 생각했나요?`},explanation:`행 평균은 [6.0, 4.0, 5.0]이고 [:, None]으로 (3, 1)이 되어 행마다 자기 평균이 빠져요. 그 결과의 0번 열은 4−6, 6−4, 5−5라 [-2.0, 2.0, 0.0]이에요.`,card:`centering`},{type:`explain`,id:`where`,title:`np.where도 모양을 맞춰 골라요`,body:"`np.where(조건, A, B)`는 칸마다 조건이 True면 A의 값을, False면 B의 값을 골라 같은 모양의 새 배열을 만들어요. A나 B 자리에는 수 하나나 모양이 다른 배열도 올 수 있고, 브로드캐스팅 규칙으로 조건의 모양에 맞춰져요. 그래서 (행, 열) 조건에 길이가 열 수인 1차원 배열을 주면, 그 배열이 행마다 똑같이 쓰여 열마다 다른 값이 채워져요.",code:`import numpy as np
got = np.array([[7, -1, 4],
                [-2, 5, -3]])
fill = np.array([0, 9, 8])
out = np.where(got >= 0, got, fill)
print(out.tolist())`,trace:["`got = np.array([[7, -1, 4], [-2, 5, -3]])` → 두 번 잰(행) 세 센서(열)의 값이에요. 음수는 잘못 잰 값이에요","`fill = np.array([0, 9, 8])` → 센서(열)마다 대신 쓸 값이에요","`out = np.where(got >= 0, got, fill)` → `got >= 0`은 [[True, False, True], [False, True, False]]예요. True 칸은 got, False 칸은 같은 열의 fill 값을 골라요","`print(out.tolist())` → **[[7, 9, 4], [0, 5, 8]]**"],output:`[[7, 9, 4], [0, 5, 8]]
`,mistake:`fill의 값이 행마다 하나씩 쓰인다고 생각하기. fill (3,)은 열과 짝지어져서, 1번 열의 False 칸에는 어느 행이든 9가, 2번 열에는 8이 들어가요.`,in_code:'`np.where(score > 60, "통과", "재시험")`처럼 A·B 자리에 값 하나씩을 두면 칸마다 둘 중 하나를 고른 배열이 돼요. 원래 배열은 바뀌지 않아요.'},{type:`example`,id:`theory-numpy-broadcast-ex6`,kind:`choice`,title:`빈 기록 채우기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
obs = np.array([[8, -1, 6],
                [-1, 3, -1]])
dflt = np.array([5, 5, 0])
out = np.where(obs < 0, dflt, obs)
print(out.tolist())`,output:`[[8, 5, 6], [5, 3, 0]]
`,choices:[`[[8, 5, 6], [5, 3, 0]]`,`[[5, -1, 0], [-1, 5, -1]]`,`[8, 6, 3]`,`[[8, 5, 6], [-1, 3, -1]]`],answer:`[[8, 5, 6], [5, 3, 0]]`,feedback:{"[[5, -1, 0], [-1, 5, -1]]":`조건이 참인 칸에 세 번째 값이 들어간다고 생각했나요?`,"[8, 6, 3]":`np.where가 조건이 거짓인 칸만 골라 남긴다고 생각했나요?`,"[[8, 5, 6], [-1, 3, -1]]":`dflt가 첫 번째 행에만 쓰인다고 생각했나요?`},explanation:`obs < 0인 칸에는 두 번째 값인 dflt에서 같은 열의 값을, 나머지 칸에는 obs 값을 골라요. dflt는 행마다 똑같이 쓰여 둘째 행의 0번 열은 5, 2번 열은 0이에요.`,card:`where`},{type:`summary`,points:["배열과 수 하나의 계산·비교는 모든 칸에 똑같이 적용되고 모양은 그대로예요. 리스트의 `*`는 반복이지만 배열의 `*`는 칸마다 곱하기예요.",`(행, 열) 표와 길이가 열 수인 1차원 배열을 계산하면, 그 배열이 모든 행에 똑같이 적용돼요.`,`모양이 다르면 shape를 오른쪽 축부터 짝지어, 같거나 한쪽이 1이면 계산돼요. 모자란 축은 왼쪽에 1이 있다고 보고, 결과는 짝마다 큰 길이예요. 길이가 다르고 1도 없는 짝이 있으면 오류예요.`,"`v[:, None]`은 (n,)을 (n, 1)로, `v.reshape(1, n)`은 (1, n)으로 만들어요. 행마다 다른 값을 계산하려면 (행 수, 1)이 필요해요.","열 평균은 `h - h.mean(axis=0)`으로 바로 빼고, 행 평균은 `[:, None]`이나 `keepdims=True`로 세워서 빼요. 정사각 표에서는 잘못 빼도 오류가 나지 않아요.","`np.where(조건, A, B)`는 칸마다 참이면 A, 거짓이면 B를 고르고, A·B도 같은 규칙으로 모양을 맞춰요."]}],covers:{"numpy-broadcast-01":[`last-axis`,`rules`],"numpy-broadcast-02":[`rules`,`new-axis`,`last-axis`,`scalar`],"numpy-broadcast-foundation-01":[`scalar`],"numpy-broadcast-foundation-02":[`rules`],"numpy-broadcast-application-02":[`centering`,`last-axis`],"numpy-square-centering-20261019":[`centering`,`new-axis`],"numpy-where-columns-20261021":[`where`,`scalar`]}},{id:`theory-numpy-mask`,version:2,concept_id:`numpy-mask`,title:`조건 마스크`,minutes:17,steps:[{type:`explain`,id:`filter`,title:`마스크로 골라내기`,body:"`age >= 18`처럼 배열을 비교하면 칸마다 True·False가 든 같은 모양의 배열이 나오는데, 이것을 마스크(고를 칸을 표시한 배열)라고 해요. `age[마스크]`는 True인 칸의 값만 원래 순서대로 모아 더 짧은 배열을 만들어요. `마스크.sum()`은 True를 1, False를 0으로 더해서 True의 개수가 돼요. 마스크는 비교한 그 순간의 결과를 담은 따로 된 배열이라, 나중에 `age`를 바꿔도 마스크는 저절로 바뀌지 않아요. `age += 1`은 `age = age + 1`처럼 모든 칸에 1을 더하되, 같은 배열을 직접 고쳐요.",code:`import numpy as np
age = np.array([13, 30, 17, 45])
adult = age >= 18
print(adult.tolist(), adult.sum())
age += 1
print(age[adult].tolist())`,trace:["`age = np.array([13, 30, 17, 45])` → 네 사람의 나이예요","`adult = age >= 18` → 칸마다 18 이상인지 비교한 마스크를 adult에 담아요","`print(adult.tolist(), adult.sum())` → True 두 개를 1로 세어 → **[False, True, False, True] 2**","`age += 1` → age가 [14, 31, 18, 46]으로 바뀌어요. adult는 이미 만든 배열이라 그대로예요","`age[adult]` → adult가 True인 1번·3번 칸만 순서대로 → **[31, 46]**. 18이 된 2번 칸은 adult가 False라 빠져요"],output:`[False, True, False, True] 2
[31, 46]
`,mistake:"마스크가 배열을 따라 다시 계산된다고 생각하기. `adult`는 `age >= 18`을 계산한 그 순간의 결과예요. 바뀐 age로 다시 고르려면 `age[age >= 18]`처럼 비교를 새로 해요.",in_code:"AI가 쓴 분석 코드에서 `n_big = (spend > 100).sum()`은 조건에 맞는 건수를 세고, `data[data > 100]`은 그 값들만 고르는 줄이에요."},{type:`example`,id:`theory-numpy-mask-ex1`,kind:`choice`,title:`9분 이상 기다린 손님`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
wait = np.array([4, 13, 7, 16, 9])
slow = wait >= 9
print(slow.sum(), wait[slow].sum())`,output:`3 38
`,choices:[`3 38`,`2 29`,`3 49`,`38 38`],answer:`3 38`,feedback:{"2 29":`>= 9가 9와 같은 값은 뺀다고 생각했나요?`,"3 49":`wait[slow]가 걸러 내지 않고 모든 칸을 남긴다고 생각했나요?`,"38 38":`마스크의 sum도 True 칸의 값을 더한다고 생각했나요?`},explanation:`slow는 [False, True, False, True, True]라 sum()은 True의 개수 3이에요. wait[slow]는 13, 16, 9만 남기니 그 합은 38이에요.`,card:`filter`},{type:`explain`,id:`and-or`,title:`조건 묶기는 &와 |`,body:"배열의 조건 두 개를 묶을 때는 `and`·`or` 대신 `&`(그리고)·`|`(또는)를 쓰고, `~`는 참·거짓을 뒤집어요. `&`와 `|`는 비교보다 먼저 계산되기 때문에 `(tmp >= 19) & (tmp < 25)`처럼 조건마다 괄호를 씌워야 해요. `and`를 쓰면 배열 전체를 참 하나로 정할 수 없어 오류(ValueError)가 나요. `<`는 기준값을 빼고 `<=`는 기준값을 넣어요.",code:`import numpy as np
tmp = np.array([19, 25, 31, 11, 25])
mild = (tmp >= 19) & (tmp < 25)
print(tmp[mild].tolist())
edge = (tmp < 14) | (tmp > 30)
print(tmp[edge].tolist())`,trace:["`tmp = np.array([19, 25, 31, 11, 25])` → 닷새 동안의 기온이에요","`mild = (tmp >= 19) & (tmp < 25)` → 두 조건이 모두 True인 칸만 True예요","`print(tmp[mild].tolist())` → 25는 `< 25`에서 빠져 → **[19]**","`edge = (tmp < 14) | (tmp > 30)` → 둘 중 하나라도 True면 True라 31과 11 자리가 True예요","`print(tmp[edge].tolist())` → 원래 순서 그대로 → **[31, 11]**"],output:`[19]
[31, 11]
`,mistake:"괄호 없이 `tmp >= 19 & tmp < 25`로 쓰기. `&`가 먼저 계산돼 `19 & tmp`라는 엉뚱한 계산이 되고 결국 오류가 나요. 조건마다 괄호를 씌워요.",in_code:"AI가 쓴 코드에서 `data[(data > lo) & (data < hi)]`는 두 기준 사이의 값만 고르는 줄이에요. 경계값을 넣을지(`<=`) 뺄지(`<`)를 꼭 확인해요."},{type:`example`,id:`theory-numpy-mask-ex2`,kind:`choice`,title:`가볍거나 무거운 짐`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
kg = np.array([15, 20, 25, 30])
odd = (kg < 20) | (kg >= 30)
print(kg[odd].tolist())`,output:`[15, 30]
`,choices:[`[15, 30]`,`[15]`,`[]`,`[15, 20, 30]`],answer:`[15, 30]`,feedback:{"[15]":`>= 30이 30과 같은 값은 뺀다고 생각했나요?`,"[]":`|도 &처럼 두 조건이 모두 참이어야 한다고 생각했나요?`,"[15, 20, 30]":`< 20이 20도 넣는다고 생각했나요?`},explanation:`|는 둘 중 하나라도 참이면 True예요. 15는 20보다 작고 30은 30 이상이라 True이고, 20과 25는 둘 다 아니라서 [15, 30]이에요.`,card:`and-or`},{type:`explain`,id:`replace`,title:`바꾸는 두 방법: np.where와 대입`,body:"`np.where(조건, A, B)`는 조건이 True인 칸은 A, False인 칸은 B를 골라 새 배열을 돌려줘요. 원래 배열은 그대로이고, 칸 수도 줄지 않아요. `pt[pt > 100] = 100`처럼 마스크 자리에 값을 넣으면 원래 배열의 그 칸들만 바뀌고 길이는 그대로예요. 골라내기(`pt[마스크]`)는 칸이 줄지만, 이 두 방법은 칸 수를 지켜요.",code:`import numpy as np
pt = np.array([95, 120, 80, 105])
cap = np.where(pt > 100, 100, pt)
print(pt.tolist(), cap.tolist())
pt[pt > 100] = 100
print(pt.tolist())`,trace:["`pt = np.array([95, 120, 80, 105])` → 네 번 받은 점수예요. 100을 넘는 값이 섞여 있어요","`cap = np.where(pt > 100, 100, pt)` → 100 초과 칸은 100, 나머지는 pt의 값을 골라 새 배열을 만들어요","`print(pt.tolist(), cap.tolist())` → pt는 그대로이고 cap만 바뀌어요 → **[95, 120, 80, 105] [95, 100, 80, 100]**","`pt[pt > 100] = 100` → 100 초과인 1번·3번 칸에 100을 넣어 pt 자체를 고쳐요","`print(pt.tolist())` → 길이는 4 그대로 → **[95, 100, 80, 100]**"],output:`[95, 120, 80, 105] [95, 100, 80, 100]
[95, 100, 80, 100]
`,mistake:"`np.where(...)`만 쓰고 원래 배열이 바뀌었다고 생각하기. np.where는 새 배열을 돌려줄 뿐이라 결과를 이름에 담아 써야 해요. 원래 배열을 고치려면 `pt[pt > 100] = 100`처럼 대입해요.",in_code:"AI가 쓴 정리 코드에서 원본을 남겨야 할 때는 `clean = np.where(...)`처럼 새 이름에 담고, 원본을 고쳐도 될 때는 `arr[조건] = 값` 한 줄로 바꾸는 경우가 많아요."},{type:`example`,id:`theory-numpy-mask-ex3`,kind:`choice`,title:`담지 않은 결과`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
lvl = np.array([3, 8, 5, 9])
np.where(lvl > 6, 6, lvl)
lvl[lvl < 4] = 4
print(lvl.tolist())`,output:`[4, 8, 5, 9]
`,choices:[`[4, 8, 5, 9]`,`[4, 6, 5, 6]`,`[3, 6, 5, 6]`,`[8, 5, 9]`],answer:`[4, 8, 5, 9]`,feedback:{"[4, 6, 5, 6]":`담지 않은 np.where의 결과도 lvl을 바꾼다고 생각했나요?`,"[3, 6, 5, 6]":`np.where는 원래 배열을 고치고 대입은 고치지 않는다고 생각했나요?`,"[8, 5, 9]":`마스크 자리에 대입하면 그 칸이 빠진다고 생각했나요?`},explanation:`3번 줄의 np.where는 새 배열을 만들지만 아무 데도 담지 않아 사라져요. lvl[lvl < 4] = 4는 lvl의 0번 칸만 4로 바꾸고 길이는 그대로라 [4, 8, 5, 9]예요.`,card:`replace`},{type:`explain`,id:`mask-shape`,title:`마스크와 배열의 모양 맞추기`,body:"마스크로 고를 때는 마스크의 길이가 고를 배열과 같아야 하고, 다르면 오류(IndexError)가 나요. `a % 2 == 0`(2로 나눈 나머지가 0, 곧 짝수)처럼 계산한 결과로도 마스크를 만들 수 있는데, 걸러서 짧아진 배열에는 그 배열로 다시 만든 마스크를 써야 해요. 2차원 배열에 같은 모양의 마스크를 쓰면 True 칸의 값만 1차원으로 모여요. 길이가 행 수와 같은 1차원 마스크를 쓰면 True인 행이 통째로 남아요.",code:`import numpy as np
box = np.array([[1, 8, 6],
                [9, 7, 6]])
print(box[box > 5].tolist())
keep = (box > 5).all(axis=1)
print(box[keep].tolist())`,trace:["`box = np.array([[1, 8, 6], [9, 7, 6]])` → 이틀(행)의 세 시간대(열) 대기 인원이에요","`box[box > 5]` → 같은 모양 마스크의 True 칸 값만 행 순서대로 모여 1차원 → **[8, 6, 9, 7, 6]**","`keep = (box > 5).all(axis=1)` → 행마다 모든 칸이 5보다 큰지 봐서 [False, True]예요. 길이 2는 행 수와 같아요","`box[keep]` → True인 1번 행이 통째로 남아 2차원 → **[[9, 7, 6]]**"],output:`[8, 6, 9, 7, 6]
[[9, 7, 6]]
`,mistake:`다른 배열로 만든 마스크를 그대로 쓰기. 길이 5인 배열로 만든 마스크를 걸러서 3칸이 된 배열에 쓰면 길이가 맞지 않아 IndexError가 나요. 오류는 고르는 줄에서 나지만, 고칠 곳은 마스크를 만든 줄이에요.`,in_code:"결측값이 있는 행을 빼는 코드에서 `data[ok.all(axis=1)]`처럼 행 마스크로 행을 통째로 고르는 줄을 자주 봐요. `data[ok]`처럼 칸 마스크를 쓰면 표 모양이 사라지고 값만 1차원으로 남아요."},{type:`example`,id:`theory-numpy-mask-ex4`,kind:`choice`,title:`하나라도 큰 값이 있는 행`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
tb = np.array([[2, 9],
               [7, 8],
               [1, 3]])
good = (tb > 5).any(axis=1)
print(tb[good].tolist())`,output:`[[2, 9], [7, 8]]
`,choices:[`[[2, 9], [7, 8]]`,`[9, 7, 8]`,`[[7, 8]]`],answer:`[[2, 9], [7, 8]]`,feedback:{"[9, 7, 8]":`행 마스크도 칸마다 골라 값만 1차원으로 남긴다고 생각했나요?`,"[[7, 8]]":`any(axis=1)가 행의 모든 칸이 True여야 True라고 생각했나요?`},explanation:`(tb > 5).any(axis=1)은 행마다 5보다 큰 칸이 하나라도 있는지 봐서 [True, True, False]예요. 길이가 행 수와 같은 마스크라 True인 0번과 1번 행이 통째로 남아요.`,card:`mask-shape`},{type:`explain`,id:`where-pos`,title:`조건만 주면 위치를 알려 줘요`,body:"`np.where(조건)`처럼 조건 하나만 주면 값이 아니라 True인 칸의 위치(번호)를 돌려줘요. 결과는 축마다 위치 배열이 하나씩 든 튜플이라, 1차원이면 `[0]`으로 첫 배열을 꺼내요. 2차원이면 행 위치 배열과 열 위치 배열이 나오고, 같은 순번끼리 짝지으면 한 칸의 좌표가 돼요. `ri, ci = 튜플`처럼 쓰면 튜플의 값을 차례로 두 이름에 나눠 담아요. 번호는 0부터 세요.",code:`import numpy as np
lap = np.array([5, 9, 3, 9])
print(np.where(lap > 4)[0].tolist())
tab = np.array([[0, 0], [3, 8]])
ri, ci = np.where(tab > 0)
print(ri.tolist(), ci.tolist())`,trace:["`lap = np.array([5, 9, 3, 9])` → 네 번의 대기 시간(분)이에요","`np.where(lap > 4)[0]` → 조건 [True, True, False, True]에서 True인 번호를 모은 튜플의 첫 배열 → **[0, 1, 3]**","`tab = np.array([[0, 0], [3, 8]])` → 2행 2열 배열이에요","`ri, ci = np.where(tab > 0)` → True인 칸 (1, 0)과 (1, 1)의 행 번호는 ri에, 열 번호는 ci에 나눠 담아요","`print(ri.tolist(), ci.tolist())` → 같은 순번끼리 짝지으면 (1, 0), (1, 1) → **[1, 1] [0, 1]**"],output:`[0, 1, 3]
[1, 1] [0, 1]
`,mistake:"`np.where(조건)`이 값을 돌려준다고 생각하기. [0, 1, 3]은 값이 아니라 번호예요. 값이 필요하면 그 번호로 다시 꺼내서 `lap[np.where(lap > 4)]`는 [5, 9, 9]예요.",in_code:"AI가 쓴 코드에서 `idx = np.where(flags)[0]`은 True인 칸의 번호 목록을 뽑는 흔한 줄이에요. `[0]`을 빼면 배열이 아니라 튜플이 담겨요."},{type:`example`,id:`theory-numpy-mask-ex5`,kind:`choice`,title:`번호로 다시 꺼내기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
sc = np.array([7, 2, 9, 2, 5])
ix = np.where(sc < 6)[0]
print(ix.tolist(), sc[ix].tolist())`,output:`[1, 3, 4] [2, 2, 5]
`,choices:[`[1, 3, 4] [2, 2, 5]`,`[2, 2, 5] [1, 3, 4]`,`[2, 4, 5] [2, 2, 5]`,`[1, 3, 4] [1, 3, 4]`],answer:`[1, 3, 4] [2, 2, 5]`,feedback:{"[2, 2, 5] [1, 3, 4]":`np.where(조건)이 값을 돌려주고, 그 값으로 꺼내면 번호가 나온다고 생각했나요?`,"[2, 4, 5] [2, 2, 5]":`위치 번호가 1부터 시작한다고 생각했나요?`,"[1, 3, 4] [1, 3, 4]":`번호 배열로 꺼내도 번호가 그대로 나온다고 생각했나요?`},explanation:`6보다 작은 칸은 1번, 3번, 4번이라 ix는 [1, 3, 4]예요. sc[ix]는 그 번호의 값을 꺼내 [2, 2, 5]예요.`,card:`where-pos`},{type:`explain`,id:`isin`,title:`목록에 든 값인지는 np.isin`,body:"`np.isin(배열, 목록)`은 배열의 칸마다 그 값이 목록에 들어 있는지 검사해, 배열과 같은 모양의 True·False 배열을 돌려줘요. 목록의 순서나 길이는 결과 모양과 상관없어요. 이 마스크로 고르면 원래 배열의 순서와 겹친 값이 그대로 남아요(정렬하거나 하나로 줄이지 않아요). 글자가 든 배열에도 똑같이 써요.",code:`import numpy as np
dice = np.array([6, 2, 5, 1, 6, 3])
hit = np.isin(dice, [6, 1])
print(dice[hit].tolist())
two = dice.reshape(2, 3)
print(np.isin(two, [6, 1]).tolist())`,trace:["`dice = np.array([6, 2, 5, 1, 6, 3])` → 주사위를 여섯 번 던진 눈이에요","`hit = np.isin(dice, [6, 1])` → 칸마다 6이나 1인지 봐서 [True, False, False, True, True, False]예요","`dice[hit]` → 원래 순서대로, 두 번 나온 6도 그대로 → **[6, 1, 6]**","`two = dice.reshape(2, 3)` → 같은 값을 2행 3열로 다시 잘라요","`np.isin(two, [6, 1])` → 결과도 2행 3열 모양 → **[[True, False, False], [True, True, False]]**"],output:`[6, 1, 6]
[[True, False, False], [True, True, False]]
`,mistake:"결과가 목록 순서대로 정렬되거나 겹친 값이 하나로 줄어든다고 생각하기. `isin`은 칸마다 True·False만 정하고, 고른 결과는 원래 배열의 순서와 개수 그대로예요.",in_code:'`np.isin(city, ["서울", "부산"])`처럼 글자 배열에서 특정 값만 고르는 줄을 자주 봐요. 반대로 목록에 없는 것만 고를 때는 `~np.isin(...)`처럼 `~`로 뒤집어요.'},{type:`example`,id:`theory-numpy-mask-ex6`,kind:`choice`,title:`짝수 눈만 고르기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
roll = np.array([3, 6, 6, 1, 4])
even = np.isin(roll, [6, 4, 2])
print(roll[even].tolist())`,output:`[6, 6, 4]
`,choices:[`[6, 6, 4]`,`[6, 4]`,`[4, 6, 6]`,`[6, 4, 2]`],answer:`[6, 6, 4]`,feedback:{"[6, 4]":`isin으로 고르면 겹친 값은 하나만 남는다고 생각했나요?`,"[4, 6, 6]":`isin으로 고른 결과가 작은 값부터 정렬된다고 생각했나요?`,"[6, 4, 2]":`결과가 목록에 적은 값과 순서대로 나온다고 생각했나요?`},explanation:`마스크는 [False, True, True, False, True]이고, 고르면 원래 순서대로 겹친 6까지 남아 [6, 6, 4]예요. 목록에만 있는 2는 roll에 없으니 나오지 않아요.`,card:`isin`},{type:`explain`,id:`finite`,title:`빈 값 nan과 무한대 inf 거르기`,body:"`np.nan`은 '값이 없음'을 뜻하는 특별한 소수(NaN)이고, `np.inf`는 무한대, `-np.inf`는 음의 무한대예요. NumPy 배열은 pandas의 `mean()`과 달리 nan을 빼지 않아서, 이런 값이 하나라도 섞이면 평균 같은 계산 결과도 nan이나 inf가 돼요. `np.isfinite(배열)`은 보통의 수(유한한 수)인 칸만 True이고 nan·inf·-inf는 False라서, 이 마스크로 고르면 계산할 수 있는 값만 남아요. 0도 보통의 수라 True예요.",code:`import numpy as np
dist = np.array([3.0, np.nan,
                 0.0, np.inf])
ok = np.isfinite(dist)
print(ok.tolist())
print(float(dist[ok].mean()))`,trace:["`dist = np.array([3.0, np.nan, 0.0, np.inf])` → 네 번 잰 거리예요. 하나는 빈 값, 하나는 무한대예요","`ok = np.isfinite(dist)` → 보통의 수인 칸만 True인 마스크예요","`print(ok.tolist())` → 0.0도 보통의 수라 True → **[True, False, True, False]**","`float(dist[ok].mean())` → 3.0과 0.0만 남겨 평균 내요 → **1.5**"],output:`[True, False, True, False]
1.5
`,mistake:"nan만 빼면 된다고 생각하기. `np.isnan`은 nan만 찾고, nan을 건너뛰고 평균 내는 `np.nanmean`도 inf는 그대로 둬서 결과가 inf가 돼요. 둘 다 거르려면 `np.isfinite`를 써요.",in_code:"센서나 비율 데이터를 다루는 코드에서 `data = data[np.isfinite(data)]`로 계산 전에 nan·inf를 거르는 줄을 자주 봐요. 남은 값이 하나도 없을 수 있는지도 함께 확인해요."},{type:`explain`,id:`divide-zero`,title:`0으로 나누면 inf나 nan이 돼요`,body:'NumPy 배열을 0으로 나누면 Python처럼 멈추지 않고, 양수 ÷ 0은 inf(음수면 -inf), 0 ÷ 0은 nan이 되며 경고(RuntimeWarning)를 띄워요. `with np.errstate(all="ignore"):` 아래 들여 쓴 줄에서는 그 경고를 숨기고, 블록이 끝나면 원래대로 돌아와요. `all` 대신 `divide="ignore"`(0으로 나누기)·`invalid="ignore"`(0 ÷ 0처럼 답이 없는 계산)로 하나씩 정할 수도 있어요. 경고만 숨길 뿐 결과는 그대로 inf·nan이라, 입력이 모두 보통의 수여도 나눈 결과는 `np.isfinite`로 따로 확인해요.',code:`import numpy as np
up = np.array([6, 0, 5])
dn = np.array([3, 0, 0])
with np.errstate(all="ignore"):
    q = up / dn
print(q.tolist())`,trace:["`up = np.array([6, 0, 5])` → 나눌 값이에요","`dn = np.array([3, 0, 0])` → 나누는 값이에요. 0이 두 칸 있어요",'`with np.errstate(all="ignore"):` → 이 블록 안에서는 계산 경고를 띄우지 않아요',"`q = up / dn` → 6 ÷ 3 = 2.0, 0 ÷ 0은 답이 없어 nan, 5 ÷ 0은 inf가 돼요","`print(q.tolist())` → **[2.0, nan, inf]**"],output:`[2.0, nan, inf]
`,mistake:'`errstate`의 `"ignore"`가 0으로 나눈 결과를 고쳐 준다고 생각하기. 경고 글자만 숨기고 nan·inf는 그대로 남아요. 입력에 nan·inf가 없다는 검사로는 나눈 결과까지 보장하지 못해요.',in_code:"비율을 계산하는 코드에서 errstate로 경고를 숨긴 나눗셈 바로 다음 줄에 `np.isfinite(결과)`로 걸러 내는 줄이 짝으로 나와요."},{type:`example`,id:`theory-numpy-mask-ex7`,kind:`choice`,title:`나눈 결과 점검`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
tot = np.array([7.0, 0.0, 6.0])
cnt = np.array([2.0, 0.0, 5.0])
with np.errstate(all="ignore"):
    per = tot / cnt
print(np.isfinite(per).tolist())`,output:`[True, False, True]
`,choices:[`[True, False, True]`,`[True, True, True]`,`[False, True, False]`,`[3.5, nan, 1.2]`],answer:`[True, False, True]`,feedback:{"[True, True, True]":`errstate로 경고를 숨기면 0 ÷ 0도 보통의 수가 된다고 생각했나요?`,"[False, True, False]":`isfinite가 nan인 칸을 True로 표시한다고 생각했나요?`,"[3.5, nan, 1.2]":`isfinite가 나눈 결과의 값을 그대로 보여 준다고 생각했나요?`},explanation:`per는 [3.5, nan, 1.2]예요. 0 ÷ 0은 경고를 숨겨도 nan이고, isfinite는 보통의 수만 True라서 [True, False, True]예요.`,card:`divide-zero`},{type:`explain`,id:`where-eval`,title:`np.where의 재료는 먼저 다 계산돼요`,body:'Python은 함수를 부르기 전에 괄호 안의 값을 모두 먼저 계산해요. 그래서 `np.where(dn != 0, 8 / dn, 0.0)`에서는 np.where가 칸을 고르기 전에 `8 / dn`이 0인 칸까지 배열 전체에서 계산돼요. `np.errstate(divide="raise")`처럼 `"raise"`로 정하면 0으로 나누는 순간 경고 대신 오류(FloatingPointError)가 나는데, np.where로 감싸도 이 오류를 막지 못해요. `try:` 아래 줄에서 오류가 나면 멈추지 않고 `except 오류이름:` 아래 줄을 실행해요.',code:`import numpy as np
dn = np.array([2.0, 0.0])
with np.errstate(divide="ignore"):
    q = 8 / dn
    out = np.where(dn != 0, q, 0.0)
print(q.tolist(), out.tolist())`,trace:["`dn = np.array([2.0, 0.0])` → 나누는 값이에요. 1번 칸이 0이에요",'`with np.errstate(divide="ignore"):` → 블록 안에서 0으로 나누기 경고를 숨겨요',"`q = 8 / dn` → 두 칸 모두 나눠요. 0으로 나눈 칸은 inf가 돼요","`out = np.where(dn != 0, q, 0.0)` → dn이 0이 아닌 칸은 q, 0인 칸은 0.0을 골라요. `np.where(dn != 0, 8 / dn, 0.0)`으로 한 줄에 써도 `8 / dn`이 먼저 다 계산된 뒤 고르는 것은 같아요","`print(q.tolist(), out.tolist())` → 고르기 전에 inf가 이미 만들어졌어요 → **[4.0, inf] [4.0, 0.0]**"],output:`[4.0, inf] [4.0, 0.0]
`,mistake:'np.where가 조건이 False인 칸은 계산을 건너뛴다고 생각하기. 나눗셈은 np.where가 불리기 전에 모든 칸에서 끝나요. 그래서 `divide="raise"`로 정해 두면 np.where 안에 써도 FloatingPointError가 나고, `try:`로 감쌌다면 `except FloatingPointError:` 아래 줄이 실행돼요.',in_code:"0인 칸을 아예 계산하지 않으려면 `np.divide`의 `where=` 인자처럼 계산 함수 자체에 조건을 주는 방법을 써요. AI가 쓴 코드의 `np.where(분모 != 0, 분자 / 분모, 0)`은 경고가 날 수 있는 줄이라는 걸 알아 두세요."},{type:`summary`,points:["`a > 3`처럼 비교하면 같은 모양의 마스크가 나와요. `a[마스크]`는 True 칸만 순서대로 남기고 `마스크.sum()`은 True의 개수예요. 마스크는 만든 순간의 결과라 나중에 a를 바꿔도 그대로예요.","조건 여러 개는 조건마다 괄호를 씌워 `&`(그리고)·`|`(또는)로 묶어요. `<`는 기준값을 빼고 `<=`는 넣어요.","`np.where(조건, A, B)`는 칸 수가 그대로인 새 배열을 돌려주고 원래 배열은 그대로예요. `a[마스크] = 값`은 원래 배열의 그 칸만 바꿔요.",`마스크는 고를 배열과 길이가 같아야 해요. 칸 마스크로 고르면 값이 1차원으로, 행 마스크로 고르면 행이 통째로 남아요.`,"`np.where(조건)`은 True 칸의 번호를 축마다 배열로 돌려주고, `np.isin`은 목록에 든 값인지를 같은 모양으로 표시해요.","`np.isfinite`는 nan·inf를 False로 표시해요. 0으로 나누면 inf·nan이 생기고 `errstate`의 ignore는 경고만 숨기며, np.where의 재료는 고르기 전에 모두 계산돼요."]}],covers:{"numpy-mask-01":[`and-or`,`filter`],"numpy-mask-02":[`mask-shape`,`filter`],"numpy-where-20261017":[`replace`],"numpy-mask-foundation-02":[`filter`],"numpy-mask-application-02":[`replace`],"numpy-mask-state-20261019":[`filter`],"numpy-where-source-20261021":[`replace`],"numpy-isin-shape-20261021":[`isin`],"numpy-isin-order-20261021":[`isin`,`filter`],"numpy-finite-mask-20261021":[`finite`],"numpy-finite-average-20261021":[`finite`],"numpy-where-positions-20261023":[`where-pos`],"numpy-where-coordinates-20261023":[`where-pos`],"numpy-where-evaluation-20261023":[`where-eval`,`divide-zero`],"numpy-finite-rows-20261023":[`mask-shape`,`finite`],"numpy-finite-ratios-20261023":[`divide-zero`,`finite`,`and-or`]}},{id:`theory-numpy-memory`,version:2,concept_id:`numpy-memory`,title:`뷰와 복사`,minutes:13,steps:[{type:`explain`,id:`alias-copy`,title:`이름표 하나 더 붙이기와 복사`,body:"`same = cur`는 배열을 복사하지 않고 같은 배열에 이름표를 하나 더 붙여요. 그래서 `same`으로 칸을 고치면 `cur`로 봐도 바뀌어 있어요. `cur.copy()`는 그 순간의 값을 따로 떼어 낸 새 배열(복사본)이라, 그 뒤에 어느 쪽을 고쳐도 서로 영향을 주지 않아요. 바꾸기 전의 값을 남기려면 바꾸기 전에 복사해야 해요.",code:`import numpy as np
cur = np.array([3, 5, 2])
same = cur
snap = cur.copy()
same[0] = 8
print(cur.tolist(), snap.tolist())`,trace:["`cur = np.array([3, 5, 2])` → 지금 재고 세 칸을 담아요","`same = cur` → 같은 배열에 이름표 same을 하나 더 붙여요(복사 아님)","`snap = cur.copy()` → 지금 값 [3, 5, 2]를 따로 떼어 새 배열로 만들어요","`same[0] = 8` → same이 가리키는 배열, 곧 cur의 배열의 0번 칸을 고쳐요","`print(cur.tolist(), snap.tolist())` → cur는 바뀌고 snap은 복사한 때의 값 그대로 → **[8, 5, 2] [3, 5, 2]**"],output:`[8, 5, 2] [3, 5, 2]
`,mistake:"`same = cur`로 백업이 생겼다고 생각하기. 이름만 하나 늘어서 same을 고치면 cur도 바뀌어요. 또 `cur.copy()`를 값을 바꾼 뒤에 하면 바뀐 값이 복사되니, 원래 값을 남기려면 바꾸기 전에 복사해요.",in_code:"AI가 쓴 전처리 코드에서 `orig = data.copy()`처럼 원본을 먼저 복사해 두고 data를 고치는 줄을 자주 봐요. 복사 없이 다른 이름에 담기만 하면 원본이 함께 바뀌어요."},{type:`example`,id:`theory-numpy-memory-ex1`,kind:`choice`,title:`언제 복사했나`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
cart = np.array([2, 1, 4])
cart[0] = 5
old = cart.copy()
cart[2] = 0
print(old.tolist())`,output:`[5, 1, 4]
`,choices:[`[5, 1, 4]`,`[2, 1, 4]`,`[5, 1, 0]`],answer:`[5, 1, 4]`,feedback:{"[2, 1, 4]":`copy()가 배열을 처음 만들었을 때의 값을 복사한다고 생각했나요?`,"[5, 1, 0]":`copy()로 만든 배열도 원본이 바뀌면 함께 바뀐다고 생각했나요?`},explanation:`copy()는 그 줄이 실행되는 순간의 값 [5, 1, 4]를 떼어 내요. 그 뒤의 cart[2] = 0은 cart만 바꾸니 old는 [5, 1, 4]예요.`,card:`alias-copy`},{type:`explain`,id:`view`,title:`잘라 낸 부분은 원본을 함께 써요`,body:"`a[1:4]`(1번부터 4번 바로 앞까지)나 `a[1::2]`(1번부터 끝까지 두 칸 간격)처럼 `:`로 잘라 낸 배열은 값을 복사하지 않고 원본의 칸을 그대로 보여 주는 뷰(view)예요. 그래서 뷰의 칸을 고치면 원본이 바뀌고, 원본을 고치면 뷰에서도 바뀐 값이 보여요. 뷰의 번호는 뷰 안에서 다시 0부터 세서, `a[1::2]`의 0번 칸은 원본의 1번 칸이에요. 원본과 떼어 쓰려면 `a[1:4].copy()`처럼 복사해요.",code:`import numpy as np
seat = np.array([1, 2, 3, 4, 5])
odd = seat[1::2]
odd[0] = 0
seat[3] = 9
print(seat.tolist(), odd.tolist())`,trace:["`seat = np.array([1, 2, 3, 4, 5])` → 좌석 다섯 칸의 번호예요","`odd = seat[1::2]` → 1번부터 두 칸 간격으로 1번·3번 칸을 보여 주는 뷰 [2, 4]예요","`odd[0] = 0` → 뷰의 0번 칸은 원본의 1번 칸이라 seat[1]이 0이 돼요","`seat[3] = 9` → 원본의 3번 칸을 고쳐요. 뷰의 1번 칸과 같은 칸이에요","`print(seat.tolist(), odd.tolist())` → 바뀐 값이 양쪽에 모두 보여요 → **[1, 0, 3, 9, 5] [0, 9]**"],output:`[1, 0, 3, 9, 5] [0, 9]
`,mistake:"리스트처럼 잘라 낸 결과가 복사본이라고 생각하기. 리스트의 `a[1:3]`은 새 리스트지만, NumPy 배열을 자른 결과는 원본을 함께 쓰는 뷰예요. 따로 고칠 배열이 필요하면 `.copy()`를 붙여요.",in_code:"큰 배열의 일부를 `window = signal[100:200]`처럼 잘라 고치는 코드는 원본도 바꿔요. AI가 쓴 코드에서 자른 배열에 값을 넣는 줄이 있으면 `.copy()`가 붙었는지 먼저 봐요."},{type:`example`,id:`theory-numpy-memory-ex2`,kind:`choice`,title:`두 칸 간격으로 자른 뒤`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
lamp = np.array([7, 3, 8, 2, 9, 4])
ev = lamp[1::2]
ev[2] = 0
print(lamp.tolist())`,output:`[7, 3, 8, 2, 9, 0]
`,choices:[`[7, 3, 8, 2, 9, 0]`,`[7, 3, 0, 2, 9, 4]`,`[7, 3, 8, 2, 9, 4]`,`[3, 2, 0]`],answer:`[7, 3, 8, 2, 9, 0]`,feedback:{"[7, 3, 0, 2, 9, 4]":`뷰의 2번 칸이 원본의 2번 칸이라고 생각했나요?`,"[7, 3, 8, 2, 9, 4]":`잘라 낸 배열은 복사본이라 고쳐도 원본은 그대로라고 생각했나요?`,"[3, 2, 0]":`print(lamp)가 잘라 낸 부분만 보여 준다고 생각했나요?`},explanation:`ev는 lamp의 1번·3번·5번 칸을 보여 주는 뷰 [3, 2, 4]예요. ev의 2번 칸은 lamp의 5번 칸이라, ev[2] = 0이 lamp의 마지막 칸을 0으로 바꿔요.`,card:`view`},{type:`explain`,id:`view-2d`,title:`열 자르기와 reshape도 뷰예요`,body:"2차원 배열에서 `tb[:, 1]`처럼 `:`와 번호로 꺼낸 열도 원본의 칸을 함께 쓰는 뷰예요. reshape도 보통 값을 복사하지 않고 같은 칸을 다른 모양으로 보여 주는 뷰라서, reshape한 배열의 열을 고쳐도 맨 처음 배열이 바뀌어요. `col += 100`처럼 `+=`로 계산하면 새 배열을 만들지 않고 그 칸들을 직접 고쳐요. 원본을 지키려면 `tb[:, 1].copy()`나 `tb.copy()[:, 1]`처럼 복사본을 만든 뒤 고쳐요.",code:`import numpy as np
seq = np.arange(8)
tb = seq.reshape(4, 2)
col = tb[:, 1]
col += 100
print(seq.tolist())`,trace:["`seq = np.arange(8)` → 0부터 7까지 여덟 칸이에요","`tb = seq.reshape(4, 2)` → 같은 칸을 4행 2열로 보여 주는 뷰예요","`col = tb[:, 1]` → 모든 행의 1번 열, 곧 seq의 1·3·5·7번 칸을 보여 주는 뷰예요","`col += 100` → 그 네 칸에 직접 100을 더해요","`print(seq.tolist())` → 맨 처음 배열까지 바뀌어요 → **[0, 101, 2, 103, 4, 105, 6, 107]**"],output:`[0, 101, 2, 103, 4, 105, 6, 107]
`,mistake:"reshape나 열 자르기가 새 배열을 만든다고 생각하기. 모양만 다르게 보여 줄 뿐 같은 칸이라, 고치면 원래 배열도 바뀌어요. reshape가 늘 뷰인 것은 아니니, 원본을 지켜야 하면 `.copy()`로 확실히 떼어 내요.",in_code:"`X[:, 0] -= X[:, 0].mean()`처럼 열 하나를 제자리에서 고치는 줄은 X 자체를 바꿔요. 원본 데이터를 남겨야 하면 먼저 `X = X.copy()`를 해 두는 코드를 자주 봐요."},{type:`example`,id:`theory-numpy-memory-ex3`,kind:`choice`,title:`reshape한 표의 한 행 바꾸기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
cells = np.zeros(6)
tb2 = cells.reshape(2, 3)
tb2[1] = 7
print(cells.tolist())`,output:`[0.0, 0.0, 0.0, 7.0, 7.0, 7.0]
`,choices:[`[0.0, 0.0, 0.0, 7.0, 7.0, 7.0]`,`[0.0, 0.0, 0.0, 0.0, 0.0, 0.0]`,`[0.0, 7.0, 0.0, 7.0, 0.0, 7.0]`,`[7.0, 7.0, 7.0, 0.0, 0.0, 0.0]`],answer:`[0.0, 0.0, 0.0, 7.0, 7.0, 7.0]`,feedback:{"[0.0, 0.0, 0.0, 0.0, 0.0, 0.0]":`reshape가 값을 복사한 새 배열을 만든다고 생각했나요?`,"[0.0, 7.0, 0.0, 7.0, 0.0, 7.0]":`reshape가 위에서 아래로 한 열씩 채운다고 생각했나요?`,"[7.0, 7.0, 7.0, 0.0, 0.0, 0.0]":`tb2[1]이 첫 번째 행이라고 생각했나요?`},explanation:`tb2는 cells의 칸을 2행 3열로 보여 주는 뷰라, 1번 행은 cells의 3·4·5번 칸이에요. tb2[1] = 7이 그 세 칸을 바꿔 cells에도 보여요.`,card:`view-2d`},{type:`explain`,id:`copy-index`,title:`번호 목록으로 고르면 복사본이에요`,body:"`inv[[0, 2]]`처럼 대괄호 안에 번호 목록을 넣어 고르면(팬시 인덱싱이라고 해요), 고른 값을 새 배열에 복사해요. 그래서 고른 배열을 고쳐도 원본은 그대로이고, 결과는 목록에 적은 번호 순서대로 나와요. 2차원 배열에서 `tb[:, [1]]`처럼 열 번호를 목록으로 주면 열이 하나여도 2차원 모양 (행 수, 1)이 남고, 이것도 복사본이에요.",code:`import numpy as np
inv = np.array([5, 0, 8, 0])
two = inv[[0, 2]]
two[0] = 1
print(inv.tolist(), two.tolist())
print(np.ones((3, 2))[:, [1]].shape)`,trace:["`inv = np.array([5, 0, 8, 0])` → 네 상품의 재고예요","`two = inv[[0, 2]]` → 0번·2번 칸의 값 [5, 8]을 복사한 새 배열이에요","`two[0] = 1` → 복사본의 0번 칸만 바뀌어요","`print(inv.tolist(), two.tolist())` → 원본은 그대로 → **[5, 0, 8, 0] [1, 8]**","`np.ones((3, 2))[:, [1]]` → 열 번호를 목록으로 주면 2차원이 남아요 → **(3, 1)**"],output:`[5, 0, 8, 0] [1, 8]
(3, 1)
`,mistake:"`a[[0, 2]]`와 `a[0:2]`를 같은 것으로 보기. `a[0:2]`는 0번부터 2번 앞까지를 보여 주는 뷰이고, `a[[0, 2]]`는 0번과 2번을 복사한 배열이에요. 앞의 것을 고치면 원본이 바뀌고 뒤의 것은 바뀌지 않아요.",in_code:"`X[:, [0, 2]]`처럼 필요한 열만 골라 새 표를 만드는 줄을 자주 봐요. 이 결과는 복사본이라 고쳐도 X는 그대로예요."},{type:`example`,id:`theory-numpy-memory-ex4`,kind:`choice`,title:`순서를 바꿔 고르기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
bag = np.array([4, 6, 1])
sub = bag[[2, 0]]
sub += 10
print(bag.tolist(), sub.tolist())`,output:`[4, 6, 1] [11, 14]
`,choices:[`[4, 6, 1] [11, 14]`,`[14, 6, 11] [11, 14]`,`[4, 6, 1] [14, 11]`],answer:`[4, 6, 1] [11, 14]`,feedback:{"[14, 6, 11] [11, 14]":`번호 목록으로 고른 배열도 원본과 칸을 함께 쓴다고 생각했나요?`,"[4, 6, 1] [14, 11]":`번호 목록으로 골라도 결과가 원본 순서대로 나온다고 생각했나요?`},explanation:`bag[[2, 0]]은 2번과 0번 값을 그 순서대로 복사해 [1, 4]를 만들어요. sub += 10은 복사본만 바꿔 [11, 14]이고 bag은 그대로예요.`,card:`copy-index`},{type:`explain`,id:`write-back`,title:`고른 결과를 고쳐도 원본은 그대로예요`,body:"마스크로 고른 `hp[hp == 0]`도 번호 목록처럼 값을 복사한 새 배열이에요. 그래서 `hp[hp == 0][0] = 10`처럼 고른 결과에 바로 대입하면, 잠깐 만든 복사본만 바뀌고 사라져서 hp는 그대로예요. 원본을 바꾸려면 `hp[hp == 0] = 10`처럼 원본에 바로 대입해요. 고른 값을 따로 고친 뒤 되돌려 놓을 때도 `hp[마스크] = 고친배열`처럼 원본 자리에 대입해야 해요.",code:`import numpy as np
hp = np.array([30, 0, 70, 0])
hp[hp == 0][0] = 10
print(hp.tolist())
hp[hp == 0] = 10
print(hp.tolist())`,trace:["`hp = np.array([30, 0, 70, 0])` → 네 캐릭터의 체력이에요","`hp[hp == 0][0] = 10` → `hp[hp == 0]`이 [0, 0] 복사본을 만들고, 그 복사본의 0번 칸만 10이 됐다가 사라져요","`print(hp.tolist())` → 원본은 그대로 → **[30, 0, 70, 0]**","`hp[hp == 0] = 10` → 마스크 자리에 바로 대입하면 원본의 1번·3번 칸이 바뀌어요","`print(hp.tolist())` → **[30, 10, 70, 10]**"],output:`[30, 0, 70, 0]
[30, 10, 70, 10]
`,mistake:"고른 결과에 대입해도 원본이 바뀐다고 생각하기. `:`로 자른 뷰라면 바뀌지만(`hp[1:][0] = 10`은 hp[1]을 바꿔요), 마스크나 번호 목록으로 고른 결과는 복사본이라 바뀌지 않아요.",in_code:"검토용으로 `sel = data[mask]`를 만들어 고친 뒤 마지막에 `data[mask] = sel`로 되돌려 놓는 코드를 자주 봐요. 이 마지막 줄이 빠지면 원본에는 아무것도 반영되지 않아요."},{type:`example`,id:`theory-numpy-memory-ex5`,kind:`choice`,title:`0인 칸만 골라 더하기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
life = np.array([40, 0, 90, 0])
fix = life[life == 0]
fix += 25
print(life.tolist(), fix.tolist())`,output:`[40, 0, 90, 0] [25, 25]
`,choices:[`[40, 0, 90, 0] [25, 25]`,`[40, 25, 90, 25] [25, 25]`,`[40, 0, 90, 0] [0, 0]`],answer:`[40, 0, 90, 0] [25, 25]`,feedback:{"[40, 25, 90, 25] [25, 25]":`마스크로 고른 배열을 고치면 원본도 바뀐다고 생각했나요?`,"[40, 0, 90, 0] [0, 0]":`복사본에 +=를 해도 값이 바뀌지 않는다고 생각했나요?`},explanation:`life[life == 0]은 0인 두 칸을 복사한 [0, 0]이에요. fix += 25는 복사본만 [25, 25]로 바꾸고, 원본 자리에 대입하지 않았으니 life는 그대로예요.`,card:`write-back`},{type:`explain`,id:`rebind`,title:`+=는 제자리, =는 새 배열`,body:"`pts += 10`(`-=`·`*=`도 같아요)은 원래 배열의 칸을 직접 고쳐서, 그 배열을 보는 뷰나 다른 이름에도 바뀐 값이 보여요. `pts = pts + 10`은 오른쪽에서 새 배열을 만든 뒤 pts라는 이름만 새 배열로 옮겨 붙여요. 그래서 그 전에 만든 뷰는 여전히 옛 배열을 보여 줘요. `pts[:] = 값`처럼 `[:]`에 대입해도 새 배열 없이 원래 칸에 값을 넣어요.",code:`import numpy as np
pts = np.array([1, 2, 3])
head = pts[:2]
pts += 10
pts = pts + 10
print(head.tolist(), pts.tolist())`,trace:["`pts = np.array([1, 2, 3])` → 처음 배열이에요","`head = pts[:2]` → 처음 배열의 앞 두 칸을 보여 주는 뷰예요","`pts += 10` → 처음 배열의 칸을 직접 고쳐 [11, 12, 13]이 되고, head도 [11, 12]를 보여요","`pts = pts + 10` → 새 배열 [21, 22, 23]을 만들어 pts라는 이름만 옮겨 붙여요. 처음 배열은 그대로예요","`print(head.tolist(), pts.tolist())` → head는 처음 배열을 계속 봐요 → **[11, 12] [21, 22, 23]**"],output:`[11, 12] [21, 22, 23]
`,mistake:"`pts = pts + 10`도 원래 배열을 고친다고 생각하기. 새 배열이 생기고 이름만 옮겨 가서, 예전 이름이나 뷰가 보던 배열은 바뀌지 않아요.",in_code:"함수 안에서 `arr += 1`로 받은 배열을 고치면 함수를 부른 쪽의 배열도 바뀌고, `arr = arr + 1`이면 바뀌지 않아요. AI가 쓴 코드에서 원본이 뜻밖에 바뀌었다면 이 차이부터 확인해요."},{type:`example`,id:`theory-numpy-memory-ex6`,kind:`choice`,title:`이름이 둘인 배열에 *=`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
day = np.array([5, 6, 7])
ref = day
day *= 2
print(ref.tolist())`,output:`[10, 12, 14]
`,choices:[`[10, 12, 14]`,`[5, 6, 7]`,`[5, 6, 7, 5, 6, 7]`],answer:`[10, 12, 14]`,feedback:{"[5, 6, 7]":`*= 2도 새 배열을 만들어 ref가 보던 배열은 그대로라고 생각했나요?`,"[5, 6, 7, 5, 6, 7]":`배열의 *= 2가 리스트처럼 원소를 반복한다고 생각했나요?`},explanation:`ref = day는 같은 배열에 이름을 하나 더 붙여요. day *= 2는 그 배열의 칸을 직접 고치니 ref로 봐도 [10, 12, 14]예요.`,card:`rebind`},{type:`summary`,points:["`b = a`는 같은 배열에 이름만 하나 더 붙여요. `a.copy()`는 그 순간의 값을 떼어 낸 복사본이라, 원래 값을 남기려면 바꾸기 전에 복사해요.","`a[1:4]`, `a[1::2]`, `tb[:, 1]`처럼 `:`로 자른 배열은 원본을 함께 쓰는 뷰이고 reshape 결과도 보통 뷰라서, 고치면 원본도 바뀌어요.","`a[[0, 2]]` 같은 번호 목록과 `a[마스크]`로 고른 배열은 복사본이라 고쳐도 원본은 그대로예요. `tb[:, [1]]`은 (행 수, 1) 모양이에요.","원본을 바꾸려면 `a[마스크] = 값`처럼 원본 자리에 바로 대입해요. `a[마스크][0] = 값`은 복사본만 바꿔요.","`a += 1`과 `a[:] = 값`은 원래 배열을 고치고, `a = a + 1`은 새 배열을 만들어 이름만 옮겨요."]}],covers:{"numpy-view-01":[`view`],"numpy-view-02":[`copy-index`],"numpy-memory-foundation-01":[`alias-copy`],"numpy-memory-foundation-02":[`alias-copy`],"numpy-memory-transfer-01":[`view-2d`,`copy-index`,`rebind`],"numpy-memory-transfer-02":[`write-back`,`view`,`rebind`],"numpy-rebind-view-20261019":[`rebind`,`view`],"numpy-chained-write-20261020":[`write-back`,`view`],"numpy-copy-timing-form-01":[`alias-copy`,`write-back`]}},{id:`theory-stats-summaries`,version:2,concept_id:`stats-summaries`,title:`대표값과 변동`,minutes:18,steps:[{type:`explain`,id:`center`,title:`평균과 중앙값`,body:"자료 전체를 숫자 하나로 요약한 값을 대표값이라고 해요. Python에 기본으로 들어 있는 `statistics` 모듈(통계 함수 모음)에서 `from statistics import mean, median`처럼 쓸 함수를 불러와요. `mean`은 모두 더해 개수로 나눈 평균이고, `median`은 작은 순서로 줄 세웠을 때 한가운데 있는 중앙값이에요. 값 하나가 유난히 크면 평균은 그쪽으로 끌려가지만 중앙값은 거의 움직이지 않아요.",code:`from statistics import mean, median
wait = [4, 38, 2, 3, 3]
print(sorted(wait))
print(mean(wait))
print(median(wait))`,trace:["`from statistics import mean, median` → statistics 모듈에서 평균과 중앙값 함수를 불러와요","`wait = [4, 38, 2, 3, 3]` → 닷새 동안 버스를 기다린 시간(분)이에요. 38분인 날이 하루 있어요","`sorted(wait)` → 작은 순서로 줄 세운 새 리스트 → **[2, 3, 3, 4, 38]**","`mean(wait)` → (4 + 38 + 2 + 3 + 3) ÷ 5 = 50 ÷ 5. 정수 자료의 평균이 딱 나누어떨어져서 소수점 없이 → **10**","`median(wait)` → 줄 세운 다섯 값 중 세 번째 값을 그대로 → **3**"],output:`[2, 3, 3, 4, 38]
10
3
`,mistake:"적힌 순서의 한가운데 값을 중앙값으로 고르기. `wait`에 적힌 순서로는 가운데가 2지만, `median`은 먼저 줄 세운 뒤 가운데를 골라서 3이에요.",in_code:`집값·연봉처럼 몇몇 값이 아주 큰 자료를 다루는 코드에서는 평균과 중앙값을 함께 출력하는 줄을 자주 봐요. 두 값이 크게 다르면 극단값(유난히 크거나 작은 값)이 있다는 신호예요.`},{type:`explain`,id:`mode-range`,title:`최빈값과 범위`,body:"`mode`는 가장 여러 번 나온 값인 최빈값이에요. `min`과 `max`는 가장 작은 값과 가장 큰 값이고, `max - min`을 범위라고 해서 값이 퍼진 폭을 대강 보여 줘요. 가장 작은 값이 더 작아지거나 가장 큰 값이 더 커지면, 모든 값을 더하는 평균과 끝값을 쓰는 범위는 바뀌지만 중앙값은 그대로이고, 바뀐 값이 최빈값이 아니었다면 최빈값도 그대로예요. 최솟값과 최댓값 중에서는 바뀐 쪽 끝의 값만 달라져요.",code:`from statistics import mean, median, mode
d1 = [5, 7, 7, 8, 9]
d2 = [-40, 7, 7, 8, 9]
print(mean(d1), median(d1), mode(d1))
print(mean(d2), median(d2), mode(d2))
print(max(d2) - min(d2), max(d2))`,trace:["`from statistics import mean, median, mode` → 최빈값 함수 `mode`까지 불러와요","`d1 = [5, 7, 7, 8, 9]` → 원래 자료예요. 범위는 9 - 5 = 4예요","`d2 = [-40, 7, 7, 8, 9]` → 가장 작은 값 하나만 -40으로 크게 바뀐 자료예요","`mean(d1), median(d1), mode(d1)` → 36 ÷ 5, 가운데 값, 두 번 나온 값 → **7.2 7 7**","`mean(d2), median(d2), mode(d2)` → 합이 -9로 줄어 평균만 바뀌어요 → **-1.8 7 7**","`max(d2) - min(d2), max(d2)` → 범위는 9 - (-40)으로 커졌지만, 반대쪽 끝인 최댓값은 그대로 → **49 9**"],output:`7.2 7 7
-1.8 7 7
49 9
`,mistake:`범위도 중앙값처럼 극단값에 흔들리지 않는다고 생각하기. 범위는 끝값 두 개로만 계산해서, 끝값 하나가 바뀌면 바로 달라져요.`,in_code:"자료를 처음 받으면 `min`과 `max`부터 출력해 보는 코드를 자주 봐요. 말이 안 되는 끝값(예: 나이 -1)이 보이면 평균을 내기 전에 그 값부터 확인해요."},{type:`example`,id:`theory-stats-summaries-ex1`,kind:`choice`,title:`달린 거리 요약`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from statistics import median, mode
km = [7, 3, 9, 3, 41]
r = max(km) - min(km)
print(median(km), mode(km), r)`,output:`7 3 38
`,choices:[`7 3 38`,`9 3 38`,`7 3 41`,`12.6 3 38`],answer:`7 3 38`,feedback:{"9 3 38":`중앙값이 줄 세우지 않고 적힌 순서의 가운데 값이라고 생각했나요?`,"7 3 41":`범위가 가장 큰 값 그 자체라고 생각했나요?`,"12.6 3 38":`median이 모두 더해 개수로 나눈 평균이라고 생각했나요?`},explanation:`줄 세우면 [3, 3, 7, 9, 41]이라 가운데 값 7이 중앙값이고, 두 번 나온 3이 최빈값이에요. 범위는 41 - 3 = 38이에요.`,card:`mode-range`},{type:`explain`,id:`np-median`,title:`NumPy와 짝수 개의 중앙값`,body:"NumPy(넘파이)는 숫자를 묶음째 빠르게 계산하는 데이터 분석용 라이브러리(남이 만들어 둔 코드 모음)예요. 보통 `import numpy as np`로 불러와 `np`라는 짧은 이름으로 쓰고, `np.array([...])`로 배열(숫자를 담은 묶음)을 만들어요. 값이 짝수 개면 한가운데 값이 없어서, 줄 세운 뒤 가운데 두 값의 평균이 중앙값이에요. NumPy가 돌려준 숫자를 튜플(괄호로 묶은 여러 값)에 넣어 출력하면 `np.float64(…)`처럼 보이니, `float()`로 보통 소수로 바꿔 출력해요.",code:`import numpy as np
t = np.array([18, 25, 21, 30])
print(np.mean(t), np.median(t))
m = np.median(t)
print((m, float(m)))`,trace:["`import numpy as np` → NumPy를 불러와 `np`라는 이름으로 써요","`t = np.array([18, 25, 21, 30])` → 나흘 동안의 낮 기온 네 개로 배열을 만들어요","`np.mean(t), np.median(t)` → 평균은 94 ÷ 4, 중앙값은 줄 세운 [18, 21, 25, 30]의 가운데 두 값 21과 25의 평균 → **23.5 23.0**","`m = np.median(t)` → 중앙값 23.0을 m에 담아요","`print((m, float(m)))` → 튜플 안의 NumPy 숫자는 종류까지 보이고, `float()`로 바꾼 값은 숫자만 보여요 → **(np.float64(23.0), 23.0)**"],output:`23.5 23.0
(np.float64(23.0), 23.0)
`,mistake:"짝수 개일 때 가운데 두 값 중 하나를 중앙값으로 고르기. 21이나 25가 아니라 둘의 평균 23.0이에요. NumPy의 중앙값은 정수 자료여도 `23.0`처럼 소수로 나와요.",in_code:"`round(float(x.mean()), 2)`처럼 NumPy 결과를 `float()`로 감싼 뒤 반올림하는 줄을 자주 봐요. 출력을 깔끔하게 하거나 다른 곳에 저장하기 전에 보통 숫자로 바꾸는 거예요."},{type:`explain`,id:`group-median`,title:`중앙값은 합친 뒤 다시 구해요`,body:"리스트끼리 `+`를 하면 두 리스트를 이어 붙인 새 리스트가 돼요. 묶음마다 구한 중앙값을 모아 다시 중앙값을 내면, 전체 자료의 중앙값과 다를 수 있어요. 묶음별 중앙값에는 나머지 값들이 어디에 있었는지가 남지 않기 때문이에요. 묶음 크기가 같아도 마찬가지라서, 전체 중앙값은 원래 값을 모두 모아 다시 줄 세워 구해요.",code:`import numpy as np
am = [2, 3, 40]
pm = [5, 6, 7, 9]
mids = [np.median(am), np.median(pm)]
print(float(np.median(mids)))
print(float(np.median(am + pm)))`,trace:["`am = [2, 3, 40]` → 오전에 잰 대기 시간(분) 세 개예요","`pm = [5, 6, 7, 9]` → 오후에 잰 대기 시간 네 개예요","`mids = [np.median(am), np.median(pm)]` → 오전 중앙값 3.0과, 오후의 가운데 두 값 6과 7의 평균 6.5를 담아요","`np.median(mids)` → 3.0과 6.5, 두 값의 평균 → **4.75**","`np.median(am + pm)` → 이어 붙여 줄 세운 [2, 3, 5, 6, 7, 9, 40]에서 일곱 개의 가운데 → **6.0**"],output:`4.75
6.0
`,mistake:`묶음별 중앙값을 다시 가운데로 모으면 전체 중앙값이 된다고 생각하기. 위 코드처럼 4.75와 6.0으로 달라요.`,in_code:"날짜별로 구해 둔 중앙값 리스트에 다시 `np.median`을 적용하는 코드가 보이면 의심해 봐요. 전체 중앙값은 요약하기 전의 원래 값을 모아 다시 구해야 해요."},{type:`example`,id:`theory-stats-summaries-ex2`,kind:`choice`,title:`두 요일 기록 합치기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
mon = [9, 1, 2]
tue = [30, 5, 6]
print(float(np.median(mon + tue)))`,output:`5.5
`,choices:[`5.5`,`4.0`,`8.0`,`16.0`],answer:`5.5`,feedback:{"4.0":`요일별 중앙값 2와 6의 가운데를 구하면 된다고 생각했나요?`,"8.0":"리스트끼리 `+`가 같은 자리의 값끼리 더한다고 생각했나요?","16.0":`합친 리스트를 줄 세우지 않고 적힌 순서의 가운데 두 값을 쓴다고 생각했나요?`},explanation:"`mon + tue`는 여섯 값을 이어 붙인 리스트예요. 줄 세우면 [1, 2, 5, 6, 9, 30]이고, 짝수 개라 가운데 두 값 5와 6의 평균 5.5가 중앙값이에요.",card:`group-median`},{type:`explain`,id:`spread`,title:`편차와 분산`,body:`값이 평균에서 얼마나 떨어졌는지(값 - 평균)를 편차라고 해요. 편차를 그냥 더하면 늘 0이라서, 제곱해 모두 양수로 만든 뒤 평균을 내요. 이것이 분산이고, 분산의 제곱근(√)이 표준편차예요. 가진 자료 전체를 요약할 때는 개수 n으로 나누고(모집단 분산), 일부만 뽑은 표본으로 더 큰 전체를 짐작할 때는 n - 1로 나눠요(표본 분산). NumPy 배열에 빼기나 제곱을 하면 칸마다 따로 계산돼요.`,code:`import numpy as np
v = np.array([4, 6, 7, 8, 10])
d = v - v.mean()
print(d.tolist())
sq = d ** 2
print(sq.sum() / 5, sq.sum() / 4)`,trace:["`v = np.array([4, 6, 7, 8, 10])` → 평균이 35 ÷ 5 = 7인 다섯 값이에요","`d = v - v.mean()` → 칸마다 평균 7을 빼서 편차를 만들어요","`d.tolist()` → 배열을 보통 리스트로 바꿔 보여 줘요 → **[-3.0, -1.0, 0.0, 1.0, 3.0]**","`sq = d ** 2` → `**`는 거듭제곱이라 칸마다 제곱해 [9, 1, 0, 1, 9]가 되고, 합은 20이에요","`sq.sum() / 5, sq.sum() / 4` → n으로 나눈 모집단 분산과 n - 1로 나눈 표본 분산 → **4.0 5.0**"],output:`[-3.0, -1.0, 0.0, 1.0, 3.0]
4.0 5.0
`,mistake:"표본 분산을 구하면서 개수 n으로 나누기. 표본 분산의 분모는 n - 1이라 `len(v) - 1`이에요. 괄호 없이 `sq.sum() / len(v) - 1`로 쓰면 나눗셈을 먼저 하니 `(len(v) - 1)`처럼 괄호로 묶어요.",in_code:"분석 코드에서는 직접 나누기보다 `v.var()`, `v.std()`를 많이 써요. 다음 카드처럼 이 함수들은 n과 n - 1 중 무엇으로 나눌지를 옵션으로 정해요."},{type:`explain`,id:`ddof`,title:"`ddof`로 분모를 정해요",body:"NumPy 배열의 `.var()`는 분산, `.std()`는 표준편차를 구해요. 둘 다 기본은 개수 n으로 나누고, `ddof=1`을 주면 n - 1로 나눠요. ddof는 분모에서 뺄 수라서 분모는 늘 n - ddof예요. 표준편차는 같은 ddof로 구한 분산의 제곱근이에요.",code:`import numpy as np
v = np.array([4, 6, 7, 8, 10])
print(v.var(), v.var(ddof=1))
print(v.std())
print(round(float(v.std(ddof=1)), 3))`,trace:["`v = np.array([4, 6, 7, 8, 10])` → 앞 카드와 같은 값이라 편차 제곱의 합은 20이에요","`v.var(), v.var(ddof=1)` → 20 ÷ 5와 20 ÷ (5 - 1) → **4.0 5.0**","`v.std()` → 기본 ddof=0이라 √4 → **2.0**","`round(float(v.std(ddof=1)), 3)` → √5 = 2.2360…을 보통 소수로 바꿔 셋째 자리까지 → **2.236**"],output:`4.0 5.0
2.0
2.236
`,mistake:"`.std()`가 기본으로 n - 1로 나눈다고 생각하기. NumPy의 기본은 ddof=0이에요. 표본 표준편차가 필요하면 `ddof=1`을 꼭 적어요.",in_code:"pandas의 `.std()`는 기본이 ddof=1이고, `statistics` 모듈의 `stdev`도 n - 1로, `pstdev`는 n으로 나눠요. 같은 자료라도 라이브러리마다 기본값이 달라서, AI가 쓴 코드에서 표준편차가 다르게 나오면 ddof부터 확인해요."},{type:`example`,id:`theory-stats-summaries-ex3`,kind:`choice`,title:`분산과 표준편차`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
h = np.array([2, 2, 8, 8])
print(h.var(ddof=1), h.std())`,output:`12.0 3.0
`,choices:[`12.0 3.0`,`9.0 3.0`,`7.2 3.0`,`12.0 9.0`],answer:`12.0 3.0`,feedback:{"9.0 3.0":"`ddof=1`을 줘도 개수 4로 나눈다고 생각했나요?","7.2 3.0":"`ddof=1`이 분모에 1을 더해 5로 나눈다고 생각했나요?","12.0 9.0":"`.std()`가 제곱근을 씌우지 않은 분산을 돌려준다고 생각했나요?"},explanation:"평균 5에서 편차는 [-3, -3, 3, 3]이고 제곱의 합은 36이에요. `ddof=1`인 분산은 36 ÷ 3 = 12.0이고, `.std()`는 기본 ddof=0이라 √(36 ÷ 4) = 3.0이에요.",card:`ddof`},{type:`explain`,id:`shift-scale`,title:`모든 값에 더하거나 곱하면`,body:`배열에 수를 더하거나 곱하면 모든 칸에 똑같이 적용돼요. 모든 값에 c를 더하면 평균도 c만큼 커지지만, 값끼리의 간격은 그대로라 표준편차는 바뀌지 않아요. 모든 값에 a를 곱하면 평균은 a배, 표준편차는 a의 절댓값(부호를 뗀 크기)배가 돼요. 표준편차는 '얼마나 퍼졌나'를 나타내는 거리라서 음수가 되지 않아요.`,code:`import numpy as np
v = np.array([2.0, 8.0])
up = v + 4
flip = -3 * v
print(v.mean(), up.mean(), flip.mean())
print(v.std(), up.std(), flip.std())`,trace:["`v = np.array([2.0, 8.0])` → 평균 5에서 두 값이 3씩 떨어져 있어 표준편차가 3이에요","`up = v + 4` → 모든 칸에 4를 더해 [6.0, 12.0]이 돼요","`flip = -3 * v` → 모든 칸에 -3을 곱해 [-6.0, -24.0]이 돼요","`v.mean(), up.mean(), flip.mean()` → 5, 5 + 4, 5 × (-3) → **5.0 9.0 -15.0**","`v.std(), up.std(), flip.std()` → 더하기는 그대로, -3을 곱하면 3 × 3 → **3.0 3.0 9.0**"],output:`5.0 9.0 -15.0
3.0 3.0 9.0
`,mistake:`음수를 곱하면 표준편차도 음수가 된다고 생각하기. 부호는 평균에만 남고, 표준편차는 절댓값 3배인 9.0이에요.`,in_code:"섭씨를 화씨로 바꾸는 `f = c * 1.8 + 32`처럼 단위를 바꾸는 코드에 이 규칙이 그대로 쓰여요. 평균은 같은 식으로 바꾸면 되고, 표준편차에는 1.8만 곱하면 돼요."},{type:`example`,id:`theory-stats-summaries-ex4`,kind:`choice`,title:`틀린 만큼 깎는 점수`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
wrong = np.array([2.0, 6.0])
score = 50 - 3 * wrong
print(score.mean(), score.std())`,output:`38.0 6.0
`,choices:[`38.0 6.0`,`38.0 -6.0`,`38.0 2.0`,`38.0 56.0`,`-12.0 6.0`],answer:`38.0 6.0`,feedback:{"38.0 -6.0":`-3을 곱했으니 표준편차도 음수가 된다고 생각했나요?`,"38.0 2.0":`곱하기도 더하기처럼 표준편차를 바꾸지 않는다고 생각했나요?`,"38.0 56.0":`앞의 50도 표준편차에 더해진다고 생각했나요?`,"-12.0 6.0":`평균에는 50이 더해지지 않는다고 생각했나요?`},explanation:`틀린 개수는 평균 4, 표준편차 2예요. 점수의 평균은 50 - 3 × 4 = 38.0이고, 표준편차는 2에 |-3|을 곱한 6.0이에요. 더한 50은 표준편차를 바꾸지 않아요.`,card:`shift-scale`},{type:`explain`,id:`quantile`,title:`분위수: 아래에서 몇 % 지점`,body:'`np.quantile(값들, q)`는 작은 순서로 줄 세웠을 때 아래에서 q(0~1) 비율 지점의 값이에요. q가 0.5면 중앙값이고, 0.25와 0.75 지점은 사분위수라고 불러요. 기본 방식(`method="linear"`)은 0부터 센 위치를 (개수 - 1) × q로 정하고, 위치가 두 값 사이에 걸리면 그 사이를 비율만큼 나눠요(보간). `method="lower"`처럼 방식을 바꾸면 사이에 걸릴 때 아래 값을 고르는 식으로 결과가 달라져요.',code:`import numpy as np
m = [12, 4, 8, 20, 16, 0]
print(sorted(m))
print(np.quantile(m, 0.75))
print(np.quantile(m, 0.5), np.median(m))`,trace:["`m = [12, 4, 8, 20, 16, 0]` → 여섯 값이라 줄 세운 뒤 위치 번호는 0~5예요","`sorted(m)` → 먼저 줄 세운 모습 → **[0, 4, 8, 12, 16, 20]**","`np.quantile(m, 0.75)` → 위치 (6 - 1) × 0.75 = 3.75. 3번 값 12와 4번 값 16 사이의 0.75 지점이라 12 + 0.75 × 4 → **15.0**","`np.quantile(m, 0.5), np.median(m)` → 위치 2.5라 8과 12의 한가운데. 중앙값과 같아요 → **10.0 10.0**"],output:`[0, 4, 8, 12, 16, 20]
15.0
10.0 10.0
`,mistake:`위치를 개수 × q로 세기. 6 × 0.75 = 4.5가 아니라, 번호가 0부터라서 (6 - 1) × 0.75 = 3.75예요.`,in_code:"이상한 값을 거를 때 `np.quantile(x, [0.25, 0.75])`처럼 q 자리에 리스트를 넣어 두 사분위수를 한 번에 구하는 줄을 자주 봐요. 결과도 값 두 개가 든 배열로 나와요."},{type:`example`,id:`theory-stats-summaries-ex5`,kind:`choice`,title:`60% 지점의 값`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
w = [7, 1, 3, 9, 5]
print(np.quantile(w, 0.6))`,output:`5.8
`,choices:[`5.8`,`5.4`,`7.0`,`6.0`],answer:`5.8`,feedback:{"5.4":`값을 줄 세우지 않고 적힌 순서대로 위치를 센다고 생각했나요?`,"7.0":`위치를 개수 × 0.6 = 3번으로 센다고 생각했나요?`,"6.0":`두 값 사이에 걸리면 정확히 한가운데를 고른다고 생각했나요?`},explanation:`줄 세우면 [1, 3, 5, 7, 9]이고 위치는 (5 - 1) × 0.6 = 2.4예요. 2번 값 5와 3번 값 7 사이의 0.4 지점이라 5 + 0.4 × 2 = 5.8이에요.`,card:`quantile`},{type:`explain`,id:`corr`,title:`상관계수: 함께 움직이는 정도`,body:"상관계수는 두 값이 한 직선을 따라 함께 움직이는 정도를 -1부터 1 사이 수로 나타내요. 한쪽이 커질 때 다른 쪽도 커지면 양수, 작아지면 음수이고, 점들이 직선 위에 딱 놓이면 1이나 -1이에요. 단위나 기울기(얼마나 가파른지)와는 상관없어서, 한쪽 자료의 모든 값에 10을 곱해도 상관계수는 그대로예요. `np.corrcoef(x, y)`는 2×2 표(행렬)를 돌려주는데, `[0, 1]` 칸이 x와 y 사이의 상관계수이고 대각선 칸은 자기 자신과의 상관계수라 늘 1이에요.",code:`import numpy as np
h = [1, 2, 3, 4]
m = np.corrcoef(h, [1, 3, 2, 4])
print(m.round(2).tolist())
r = np.corrcoef(h, [9, 7, 5, 3])
print(r[0, 1])`,trace:["`h = [1, 2, 3, 4]` → 공부한 시간이에요","`m = np.corrcoef(h, [1, 3, 2, 4])` → 점수가 대체로 함께 오르지만 중간에 한 번 내려가는 자료와의 2×2 표예요","`m.round(2).tolist()` → 칸마다 둘째 자리까지 반올림해 보면, 대각선은 자기 자신과의 1.0이고 [0, 1]과 [1, 0]이 h와 점수 사이 → **[[1.0, 0.8], [0.8, 1.0]]**","`r = np.corrcoef(h, [9, 7, 5, 3])` → 한 시간마다 2씩 줄어드는, 직선 위에 딱 놓인 자료예요","`r[0, 1]` → 반대 방향으로 직선에 딱 맞아서 기울기와 상관없이 → **-1.0**"],output:`[[1.0, 0.8], [0.8, 1.0]]
-1.0
`,mistake:`상관계수가 기울기라고 생각하기. 한 시간에 몇씩 줄어들든, 점들이 내려가는 직선 위에 딱 놓이면 상관계수는 -1이에요. 오르는 직선이면 1이에요.`,in_code:"pandas의 `df.corr()`는 열마다 짝지어 이런 표를 한꺼번에 만들어요. 상관계수가 높아도 한쪽이 다른 쪽의 원인이라는 뜻은 아니에요."},{type:`example`,id:`theory-stats-summaries-ex6`,kind:`choice`,title:`두 상관계수`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
h = [1, 2, 3, 4]
m1 = np.corrcoef(h, [100, 200, 300, 400])
m2 = np.corrcoef(h, [2, 1, 4, 3])
print(m1[0, 1].round(2), m2[0, 1].round(2))`,output:`1.0 0.6
`,choices:[`1.0 0.6`,`100.0 0.6`,`1.0 1.0`,`1.0 -0.6`],answer:`1.0 0.6`,feedback:{"100.0 0.6":`상관계수가 한 칸 오를 때 늘어나는 양(기울기)이라고 생각했나요?`,"1.0 1.0":`두 값이 대체로 함께 오르기만 하면 상관계수가 1이 된다고 생각했나요?`,"1.0 -0.6":`중간에 한 번이라도 내려가면 상관계수가 음수가 된다고 생각했나요?`},explanation:`[100, 200, 300, 400]은 h와 한 직선 위에 있어서 기울기가 100이어도 상관계수는 1.0이에요. [2, 1, 4, 3]은 대체로 함께 오르지만 직선에서 벗어나 0.6이에요.`,card:`corr`},{type:`explain`,id:`group-mean`,title:`그룹 평균은 개수로 가중해요`,body:"크기가 다른 그룹의 평균들을 그냥 평균 내면, 작은 그룹이 큰 그룹과 같은 무게를 얻어요. 전체 평균은 (그룹 평균 × 그룹 크기)를 모두 더해 전체 개수로 나눈 값이고, 이를 가중 평균이라고 해요. `np.average(값, weights=무게)`가 이 계산을 해 줘요. 2차원 배열 `t`에서 `t[:, 0]`은 모든 행의 0번 열이고, `t[t[:, 0] == 1, 1]`처럼 쓰면 0번 열이 1인 행만 골라 1번 열을 꺼내요.",code:`import numpy as np
cls = np.array([[3, 70], [1, 90]])
n, avg = cls[:, 0], cls[:, 1]
print(avg.mean())
print(np.average(avg, weights=n))
print((n * avg).sum() / n.sum())`,trace:["`cls = np.array([[3, 70], [1, 90]])` → 행마다 [학생 수, 평균 점수]인 두 반이에요","`n, avg = cls[:, 0], cls[:, 1]` → 0번 열(학생 수) [3, 1]과 1번 열(평균) [70, 90]을 꺼내 두 이름에 담아요","`avg.mean()` → 두 반에 같은 무게를 준 단순 평균 → **80.0**","`np.average(avg, weights=n)` → (70 × 3 + 90 × 1) ÷ (3 + 1) → **75.0**","`(n * avg).sum() / n.sum()` → 반별 점수 합 210과 90을 더해 전체 4명으로 나눠 같은 값 → **75.0**"],output:`80.0
75.0
75.0
`,mistake:"그룹 평균들을 `.mean()`으로 한 번 더 평균 내기. 학생이 1명인 반이 3명인 반과 같은 무게를 얻어 80.0이 돼요. 학생 한 명 한 명에게 같은 무게를 주려면 학생 수로 가중해요.",in_code:"그룹별로 미리 요약한 표만 있을 때 `(평균 × 개수).sum() / 개수.sum()`으로 전체 평균을 되살리는 줄을 자주 봐요. 원래 자료가 있다면 그룹을 나누기 전 전체에서 `.mean()`을 구하는 게 가장 간단해요."},{type:`example`,id:`theory-stats-summaries-ex7`,kind:`choice`,title:`상자 무게의 전체 평균`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
kg = np.array([2.0, 10.0])
boxes = np.array([6, 2])
print(np.average(kg, weights=boxes))`,output:`4.0
`,choices:[`4.0`,`6.0`,`32.0`,`8.0`],answer:`4.0`,feedback:{"6.0":`두 평균을 상자 수와 상관없이 같은 무게로 평균 낸다고 생각했나요?`,"32.0":"`weights`를 주면 곱해서 더하기만 하고 나누지는 않는다고 생각했나요?","8.0":`상자가 적은 쪽에 더 큰 무게를 준다고 생각했나요?`},explanation:`작은 상자 6개의 무게 합은 12kg, 큰 상자 2개는 20kg이에요. 전체 8개의 평균이라 (2 × 6 + 10 × 2) ÷ 8 = 4.0이에요.`,card:`group-mean`},{type:`summary`,points:[`평균은 모두 더해 개수로 나눈 값이고, 중앙값은 줄 세운 뒤 한가운데 값이에요. 짝수 개면 가운데 두 값의 평균이에요.`,`가장 작은 값이 더 작아지거나 가장 큰 값이 더 커지면 평균과 범위는 달라지지만 중앙값은 그대로이고, 바뀐 값이 최빈값이 아니었다면 최빈값도 그대로예요.`,"분산은 편차 제곱의 평균이고 표준편차는 그 제곱근이에요. NumPy의 `.var()`·`.std()`는 기본으로 n으로 나누고, `ddof=1`이면 n - 1로 나눠요.",`모든 값에 c를 더하면 평균만 c만큼 바뀌고, a를 곱하면 평균은 a배, 표준편차는 |a|배예요.`,"`np.quantile`은 (개수 - 1) × q 위치에서 두 값 사이를 나눠 구하고, 상관계수는 기울기와 상관없이 -1부터 1 사이예요.",`크기가 다른 그룹의 평균은 개수로 가중해 합치고, 중앙값은 원래 값을 모아 다시 구해요.`]}],covers:{"stats-median-01":[`center`],"stats-std-01":[`np-median`,`spread`,`ddof`],"stats-median-02":[`np-median`,`group-mean`],"stats-std-02":[`np-median`,`spread`],"stats-linear-quantile-20261021":[`np-median`,`quantile`],"stats-correlation-scale-20261022":[`np-median`,`corr`],"stats-summary-foundation-02":[`np-median`],"stats-summary-application-02":[`np-median`,`ddof`,`shift-scale`],"stats-negative-scale-20261019":[`np-median`,`ddof`,`shift-scale`],"stats-median-pooling-20261020":[`np-median`,`group-median`],"stats-outlier-shift-form-01":[`center`,`mode-range`]}},{id:`theory-stats-rates`,version:2,concept_id:`stats-rates`,title:`비율과 비교`,minutes:18,steps:[{type:`explain`,id:`rate`,title:`비율은 부분 ÷ 전체`,body:"비율은 전체 중 얼마가 해당하는지를 0부터 1 사이 수로 나타낸 값이라, 해당 개수 ÷ 전체 개수로 구해요. 해당하면 1, 아니면 0으로 적은 리스트는 `sum`이 1의 개수이고 `len`이 전체 개수라서 `sum(리스트) / len(리스트)`가 곧 비율이에요. `r /= n`은 `r = r / n`을 줄여 쓴 것이에요. 비율에 100을 곱하면 퍼센트(%)이고, 긴 소수는 `round(값, 2)`로 소수 둘째 자리까지 반올림해 보여 줘요.",code:`gym = [1, 0, 1, 1, 0, 0, 1]
print(sum(gym), len(gym))
r = sum(gym)
r /= len(gym)
print(r, round(r, 2))`,trace:["`gym = [1, 0, 1, 1, 0, 0, 1]` → 일주일 동안 운동한 날은 1, 쉰 날은 0이에요","`sum(gym), len(gym)` → 1의 개수와 전체 날 수 → **4 7**","`r = sum(gym)` → 먼저 운동한 날 수 4를 담아요","`r /= len(gym)` → r을 7로 나눈 값으로 바꿔 담아요","`print(r, round(r, 2))` → 그대로의 비율과 둘째 자리까지 반올림한 비율 → **0.5714285714285714 0.57**"],output:`4 7
0.5714285714285714 0.57
`,mistake:`반올림한 0.57을 다시 계산에 쓰기. 반올림은 보여 줄 때만 하고, 다른 값과 더하거나 곱할 때는 반올림하기 전의 값을 써요.`,in_code:"사용자가 행동했는지를 0과 1로 적어 둔 자료에서 `sum(…) / len(…)`이나 평균으로 완료율·전환율을 구하는 코드를 자주 봐요. 0과 1로 된 값의 평균이 곧 1의 비율이에요."},{type:`explain`,id:`conditional`,title:`조건을 걸면 분모도 바뀌어요`,body:"'비 온 날 중 지각한 비율'처럼 조건으로 집단을 먼저 고르면, 분모는 그 집단의 크기예요. 이를 조건부 비율이라고 해요. 반면 '전체 날 중 비도 오고 지각도 한 날의 비율'은 분자가 같아도 분모가 전체라 값이 작아져요. `[값 for 이름 in 목록 if 조건]`은 목록을 돌며 조건에 맞는 것만 모아 새 리스트를 만들고(리스트 컴프리헨션), `for w, late in days`처럼 쓰면 튜플(괄호로 묶은 값) 안의 두 값을 차례로 두 이름에 나눠 담아요.",code:`days = [("비", 1), ("비", 0),
        ("해", 0), ("비", 1)]
rain = [late for w, late in days
        if w == "비"]
print(round(sum(rain) / len(rain), 2))
print(sum(rain) / len(days))`,trace:["`days = [...]` → 하루마다 (날씨, 지각했으면 1) 튜플을 담은 나흘치 기록이에요",'`rain = [late for w, late in days if w == "비"]` → 튜플을 w와 late에 나눠 담고, 날씨가 비인 날의 지각 값만 모아 [1, 0, 1]을 만들어요',"`round(sum(rain) / len(rain), 2)` → 비 온 3일 중 지각한 2일을 둘째 자리까지 반올림 → **0.67**","`sum(rain) / len(days)` → 분자는 같아도 분모가 전체 4일 → **0.5**"],output:`0.67
0.5
`,mistake:`조건으로 고른 뒤에도 전체 개수로 나누기. 'A 중에서'라고 물으면 분모는 A의 개수예요. 분모가 전체면 'A이면서 B인 비율'이라는 다른 질문의 답이 돼요.`,in_code:"AI가 쓴 집계 코드에서 '~ 중 ~ 비율'을 구하는 줄은 분모가 어느 집단의 개수인지부터 확인해요. 조건으로 고른 리스트가 아니라 원래 목록의 `len`으로 나누고 있으면 질문과 다른 값이에요."},{type:`example`,id:`theory-stats-rates-ex1`,kind:`choice`,title:`주말 늦잠 비율`,prompt:`아래 코드의 출력값을 고르세요.`,code:`nap = [("주말", 1), ("평일", 1),
       ("주말", 1), ("주말", 0),
       ("평일", 1), ("주말", 1)]
we = [x for d, x in nap if d == "주말"]
print(sum(we) / len(we))`,output:`0.75
`,choices:[`0.75`,`0.5`,`0.6`,`0.25`],answer:`0.75`,feedback:{"0.5":`주말 기록만 골라 놓고도 전체 6일로 나눈다고 생각했나요?`,"0.6":`늦잠 잔 날 중 주말의 비율을 구한다고 생각했나요?`,"0.25":"`sum(we)`가 0의 개수를 센다고 생각했나요?"},explanation:"`we`는 주말인 날의 늦잠 값만 모은 [1, 1, 0, 1]이에요. 분모도 주말 4일이라 3 ÷ 4 = 0.75예요.",card:`conditional`},{type:`explain`,id:`direction`,title:`'A 중 B'와 'B 중 A'는 달라요`,body:"'합격자 중 스터디 참여자의 비율'과 '스터디 참여자 중 합격자의 비율'은 분자(둘 다 해당하는 수)가 같지만 분모가 달라요. 앞은 합격자 수, 뒤는 참여자 수로 나눠요. `리스트.count(값)`은 그 값이 몇 번 있는지 세고, `sum(조건 for …)`은 조건이 참인 개수를 세요(True를 1, False를 0으로 더해요). `if ok`는 ok가 0이 아닐 때 참이고, 쓰지 않는 값은 `_`라는 이름으로 받아 둬요.",code:`log = [("O", 1), ("O", 0), ("X", 1),
       ("O", 1), ("O", 0)]
passed = [s for s, ok in log if ok]
study = sum(s == "O" for s, _ in log)
print(passed.count("O") / len(passed))
print(passed.count("O") / study)`,trace:["`log = [...]` → 한 사람마다 (스터디 참여 O/X, 합격 1/0) 기록이에요","`passed = [s for s, ok in log if ok]` → ok가 1인 사람, 즉 합격자의 참여 여부만 모아 ['O', 'X', 'O']",'`study = sum(s == "O" for s, _ in log)` → 참여한 사람이면 True(1)로 더해 4를 담아요. 합격 값은 `_`로 받고 쓰지 않아요','`passed.count("O") / len(passed)` → 합격자 3명 중 참여자 2명 → **0.6666666666666666**','`passed.count("O") / study` → 참여자 4명 중 합격자 2명 → **0.5**'],output:`0.6666666666666666
0.5
`,mistake:`'A 중 B'를 구하면서 B의 개수로 나누기. 분모에는 '중' 앞에 오는 집단, 즉 조건으로 먼저 고른 집단의 수가 들어가요.`,in_code:"`if done`처럼 0/1 값을 그대로 조건에 쓰는 줄을 자주 봐요. 1은 참, 0은 거짓이라 1인 기록만 남아요."},{type:`example`,id:`theory-stats-rates-ex2`,kind:`choice`,title:`비 온 날의 우산`,prompt:`아래 코드의 출력값을 고르세요.`,code:`log = [("O", 1), ("O", 0), ("X", 1),
       ("O", 1), ("X", 1), ("O", 0),
       ("O", 0)]
rainy = [u for u, r in log if r]
k = rainy.count("O")
print(round(k / len(rainy), 2))`,output:`0.5
`,choices:[`0.5`,`0.4`,`0.29`,`0.57`],answer:`0.5`,feedback:{"0.4":`우산을 챙긴 날 중 비 온 날의 비율을 구한다고 생각했나요?`,"0.29":`비 온 날만 골라도 분모는 전체 7일이라고 생각했나요?`,"0.57":`우산과 상관없이 비 온 날의 비율이 나온다고 생각했나요?`},explanation:"기록은 (우산 O/X, 비 1/0)이에요. `rainy`는 비 온 4일의 우산 기록 ['O', 'X', 'O', 'X']이고, 그중 우산을 챙긴 날은 2일이라 2 ÷ 4 = 0.5예요.",card:`direction`},{type:`explain`,id:`pooled`,title:`전체 비율은 합계 ÷ 합계`,body:"크기가 다른 묶음의 비율을 그냥 평균 내면, 작은 묶음이 큰 묶음과 같은 무게를 얻어요. 묶음을 합친 전체 비율은 해당 수의 합 ÷ 전체 수의 합으로 구해요. `zip(a, b)`는 두 리스트에서 같은 자리의 값끼리 짝지어 주고, 비율에 묶음 크기를 곱하면 다시 해당 개수가 돼요. 묶음 크기가 모두 같으면 두 방법의 값이 늘 같지만, 크기가 다르면 대개 값이 달라져요.",code:`size = [60, 20]
done = [15, 15]
r = [d / s for d, s in zip(done, size)]
print(r, sum(r) / len(r))
print(sum(done) / sum(size))`,trace:["`size = [60, 20]` → 두 강좌의 수강생 수예요","`done = [15, 15]` → 강좌마다 끝까지 들은 사람 수예요","`r = [d / s for d, s in zip(done, size)]` → (15, 60), (15, 20)으로 짝지어 강좌별 완주율을 만들어요","`print(r, sum(r) / len(r))` → 두 비율과 그 단순 평균 → **[0.25, 0.75] 0.5**","`sum(done) / sum(size)` → 전체 80명 중 30명 → **0.375**"],output:`[0.25, 0.75] 0.5
0.375
`,mistake:`강좌별 비율의 평균을 전체 비율로 보고하기. 20명짜리 강좌가 60명짜리와 같은 무게를 얻어 0.5가 되지만, 실제로 끝까지 들은 사람은 80명 중 30명이에요.`,in_code:"비율과 크기만 남아 있을 때는 `sum(n * p for n, p in zip(크기, 비율)) / sum(크기)`처럼 개수로 되돌려 합치는 줄을 써요. 60 × 0.25 + 20 × 0.75 = 30명이라 같은 0.375가 나와요."},{type:`example`,id:`theory-stats-rates-ex3`,kind:`choice`,title:`세 반의 제출률`,prompt:`아래 코드의 출력값을 고르세요.`,code:`kids = [30, 10, 10]
sent = [15, 10, 5]
r = [s / k for s, k in zip(sent, kids)]
avg = round(sum(r) / len(r), 2)
print(avg, sum(sent) / sum(kids))`,output:`0.67 0.6
`,choices:[`0.67 0.6`,`0.6 0.6`,`0.67 0.67`,`0.6 0.67`],answer:`0.67 0.6`,feedback:{"0.6 0.6":`반마다의 비율을 평균 내도 전체 제출률과 같다고 생각했나요?`,"0.67 0.67":`합계끼리 나눠도 반마다 비율의 평균과 같다고 생각했나요?`,"0.6 0.67":`앞의 avg가 전체 합계로 나눈 값이라고 생각했나요?`},explanation:`반별 제출률은 [0.5, 1.0, 0.5]라 단순 평균은 0.67이에요. 전체로는 50명 중 30명이 내서 0.6이에요. 인원이 다른 반에 같은 무게를 주면 이렇게 달라져요.`,card:`pooled`},{type:`explain`,id:`pooled-filter`,title:`행을 고르면 분자·분모 모두 고른 행에서`,body:"2차원 배열 `t`에서 `t[:, 1]`은 모든 행의 1번 열이고, `t[t[:, 0] == 1]`처럼 대괄호에 참·거짓 배열을 넣으면 참인 행만 남아요(조건 마스크). 조건에 맞는 행만 골라 비율을 구할 때는 분자와 분모를 모두 남은 행에서 더해야 해요. 분모만 원래 배열에서 가져오면 빠진 행의 수까지 분모에 남아 비율이 작아져요.",code:`import numpy as np
t = np.array([[1, 3, 10], [2, 1, 4],
              [1, 11, 25], [2, 2, 5]])
one = t[t[:, 0] == 1]
print(one[:, 1].sum() / one[:, 2].sum())
print(one[:, 1].sum() / t[:, 2].sum())`,trace:["`t = np.array([...])` → 행마다 [반, 맞힌 문제 수, 푼 문제 수]인 학생 네 명이에요","`one = t[t[:, 0] == 1]` → 0번 열이 1인 행, 즉 1반 학생 두 명만 남겨요","`one[:, 1].sum() / one[:, 2].sum()` → 1반이 맞힌 14문제 ÷ 1반이 푼 35문제 → **0.4**","`one[:, 1].sum() / t[:, 2].sum()` → 분모만 전체 학생이 푼 44문제라서 → **0.3181818181818182**"],output:`0.4
0.3181818181818182
`,mistake:"분자는 고른 행에서, 분모는 원래 배열에서 더하기. 고른 행과 같은 범위의 합계로 나눠야 해요. 이 코드에서는 `t[:, 2]`가 아니라 `one[:, 2]`예요.",in_code:"AI가 쓴 코드에서 `keep = …`로 행을 거른 뒤 한쪽 합계에만 `keep`이 붙은 나눗셈이 보이면 의심해 봐요. 분자와 분모에 같은 조건이 걸려 있는지 확인해요."},{type:`example`,id:`theory-stats-rates-ex4`,kind:`choice`,title:`오후 알림만 보기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
t = np.array([[9, 2, 10], [13, 6, 20],
              [15, 6, 10], [10, 4, 8]])
pm = t[t[:, 0] >= 12]
print(pm[:, 1].sum() / pm[:, 2].sum())`,output:`0.4
`,choices:[`0.4`,`0.25`,`0.375`,`0.45`],answer:`0.4`,feedback:{"0.25":"`pm[:, 2]`가 원래 배열 전체의 보낸 수를 가리킨다고 생각했나요?","0.375":`조건에 상관없이 모든 행이 계산에 들어간다고 생각했나요?`,"0.45":`남은 두 행의 비율 0.3과 0.6을 같은 무게로 평균 낸다고 생각했나요?`},explanation:"행은 [보낸 시각, 연 사람 수, 보낸 수]예요. `t[:, 0] >= 12`가 참인 13시와 15시 행만 남고, 연 사람 수 합 12를 보낸 수 합 30으로 나눠 0.4예요.",card:`pooled-filter`},{type:`explain`,id:`same-weight`,title:`같은 무게로 볼지, 크기대로 볼지`,body:"묶음별 비율을 `.mean()`으로 평균 내면 모든 묶음에 같은 무게를 줘요. `np.average(비율, weights=크기)`나 `(비율 * 크기).sum() / 크기.sum()`은 크기만큼 무게를 줘서 전체 합계 비율과 같아요. 사람 한 명 한 명에게 같은 무게를 주려면 크기 가중을 쓰고, '채널마다 같은 비중으로 섞였을 때'처럼 묶음에 같은 무게를 주려면 단순 평균을 써요. 두 집단의 묶음 구성이 다르면, 합계로 비교한 순위와 묶음마다 비교한 순위가 뒤집히기도 해요.",code:`import numpy as np
r = np.array([0.25, 0.75])
n = np.array([60, 20])
print(r.mean())
print((r * n).sum() / n.sum())
print(np.average(r, weights=n))`,trace:["`r = np.array([0.25, 0.75])` → '전체 비율은 합계 ÷ 합계' 카드의 두 강좌 완주율이에요","`n = np.array([60, 20])` → 각 강좌의 수강생 수예요","`r.mean()` → 두 강좌에 같은 무게 → **0.5**","`(r * n).sum() / n.sum()` → 칸마다 곱해 15명과 15명, 합 30을 80으로 나눠 → **0.375**","`np.average(r, weights=n)` → 크기를 무게로 준 평균이라 합계 비율과 같아요 → **0.375**"],output:`0.5
0.375
0.375
`,mistake:`어느 쪽이든 '평균'이니 같다고 생각하기. 묶음 크기가 다르면 두 값이 달라질 수 있으니, 보고서에 어떤 무게로 계산했는지 적어요.`,in_code:`두 안을 비교하는 코드에서는 두 비율이 같은 무게 방식으로 계산됐는지 먼저 맞춰 봐요. 한쪽만 합계 비율이고 다른 쪽은 단순 평균이면, 서로 다른 기준을 비교하는 셈이에요.`},{type:`explain`,id:`pp-relative`,title:`퍼센트포인트와 상대 변화`,body:`두 비율의 차이에 100을 곱한 값은 퍼센트포인트(%p)예요. 8%에서 12%가 되면 4%p 올랐다고 해요. 상대 변화율은 처음 값을 기준으로 얼마나 변했는지라서 (새 값 ÷ 처음 값 - 1) × 100으로 구하고, 같은 변화가 50% 증가가 돼요. 보고서의 '몇 % 올랐다'가 둘 중 무엇인지 먼저 확인해요.`,code:`old = 0.08
new = 0.12
print(round((new - old) * 100, 1))
print(round((new / old - 1) * 100, 1))`,trace:["`old = 0.08` → 처음 합격률 8%예요","`new = 0.12` → 바뀐 뒤의 합격률 12%예요","`round((new - old) * 100, 1)` → 0.04 × 100이라 퍼센트포인트 → **4.0**","`round((new / old - 1) * 100, 1)` → 1.5배에서 1을 빼 상대 변화 → **50.0**"],output:`4.0
50.0
`,mistake:`4%p 상승을 '4% 올랐다'고 말하기. 처음 값 기준의 상대 변화는 50%라서 두 숫자는 전혀 달라요.`,in_code:"A/B 실험(두 안을 나눠 비교하는 실험)을 보고하는 코드에는 상대 증가율 `(b / a - 1) * 100`과 퍼센트포인트 `(b - a) * 100`이 함께 나오는 경우가 많아요. 변수 이름에 `_pp`, `_pct`처럼 단위를 붙여 두면 헷갈리지 않아요."},{type:`example`,id:`theory-stats-rates-ex5`,kind:`choice`,title:`재구매율의 상대 변화`,prompt:`아래 코드의 출력값을 고르세요.`,code:`prev = 0.20
now = 0.25
print(round((now / prev - 1) * 100, 1))`,output:`25.0
`,choices:[`25.0`,`5.0`,`125.0`,`20.0`],answer:`25.0`,feedback:{"5.0":`상대 변화도 두 비율의 차이에 100을 곱한 값이라고 생각했나요?`,"125.0":"`now / prev`에서 1을 빼지 않은 배율이 그대로 나온다고 생각했나요?","20.0":`나중 값 0.25를 기준으로 나눈다고 생각했나요?`},explanation:`0.25 ÷ 0.20 = 1.25배라서 1을 빼고 100을 곱하면 25.0%예요. 두 비율의 차이 5%p와는 다른 값이에요.`,card:`pp-relative`},{type:`explain`,id:`compound`,title:`연속된 변화는 곱해요`,body:"변화가 연달아 일어나면 다음 변화율의 기준은 이미 바뀐 값이에요. 그래서 변화율을 더하지 않고, (1 + 변화율)을 차례로 곱해 최종 배율을 구해요. `np.prod(배열)`은 배열의 값을 모두 곱하고, `1 + 배열`은 칸마다 1을 더해요. 최종 변화율은 최종 배율 - 1이에요.",code:`import numpy as np
ch = np.array([0.5, -0.5])
print(ch.sum())
print(np.prod(1 + ch))
end = 200 * np.prod(1 + ch)
print(float(end), float(end / 200 - 1))`,trace:["`ch = np.array([0.5, -0.5])` → 50% 올랐다가 50% 내린 두 번의 변화예요","`ch.sum()` → 변화율을 그냥 더하면 → **0.0**","`np.prod(1 + ch)` → 1.5 × 0.5를 곱한 최종 배율 → **0.75**","`end = 200 * np.prod(1 + ch)` → 200이 300이 됐다가 150이 돼요","`float(end), float(end / 200 - 1)` → 최종 값과 최종 변화율 → **150.0 -0.25**"],output:`0.0
0.75
150.0 -0.25
`,mistake:`50% 오르고 50% 내리면 제자리라고 생각하기. 내릴 때의 기준은 이미 오른 300이라 150만큼 내려서, 처음보다 25% 낮아져요.`,in_code:"월별 성장률로 1년 성장률을 구하는 코드에서 `np.prod(1 + monthly) - 1`처럼 쓰는 줄을 자주 봐요. 변화율 리스트에 `sum()`을 쓴 줄이 보이면 의심해 봐요."},{type:`example`,id:`theory-stats-rates-ex6`,kind:`choice`,title:`두 번 오른 가격`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
r = np.array([0.1, 0.1])
print(round(float(np.prod(1 + r) - 1), 2))`,output:`0.21
`,choices:[`0.21`,`0.2`,`1.21`,`0.01`],answer:`0.21`,feedback:{"0.2":`연속된 변화율은 더하면 된다고 생각했나요?`,"1.21":"`- 1`을 하기 전의 최종 배율이 그대로 나온다고 생각했나요?","0.01":`두 변화율 0.1끼리 곱한다고 생각했나요?`},explanation:`1.1 × 1.1 = 1.21배라서 1을 빼면 0.21이에요. 두 번째 10%는 이미 오른 값을 기준으로 붙어서 0.2보다 커요.`,card:`compound`},{type:`explain`,id:`unit`,title:`기록 단위와 사람 단위`,body:'pandas(판다스)는 행과 열로 된 표 자료를 다루는 라이브러리라 보통 `import pandas as pd`로 불러와요. `pd.DataFrame({열 이름: 값 리스트, …})`로 표를 만들고, `df["late"]`처럼 열 이름으로 한 열을 꺼내요. 0과 1로 된 열의 `.mean()`은 기록(행) 하나하나를 센 비율이에요. `df.groupby("who")["late"].max()`는 사람마다 묶어 가장 큰 값을 구해 \'한 번이라도 1인가\'를 알려 주고, 그 평균은 사람 단위 비율이에요.',code:`import pandas as pd
df = pd.DataFrame({
    "who": ["민", "민", "수", "윤"],
    "late": [1, 1, 0, 0]})
g = df.groupby("who")["late"].max()
print(df["late"].mean(), g.mean())`,trace:["`import pandas as pd` → pandas를 불러와 `pd`라는 이름으로 써요","`df = pd.DataFrame({...})` → 출근 기록 네 줄짜리 표예요. 민은 두 번 모두 지각했어요",'`g = df.groupby("who")["late"].max()` → 사람마다 가장 큰 값이라 민 1, 수 0, 윤 0','`df["late"].mean(), g.mean()` → 기록 4개 중 2개, 사람 3명 중 1명 → **0.5 0.3333333333333333**'],output:`0.5 0.3333333333333333
`,mistake:`같은 사람이 여러 번 나오는 자료에서 행의 평균을 '사람 비율'로 보고하기. 행 하나는 기록 하나라서, 사람 단위로 보려면 사람마다 먼저 묶어야 해요.`,in_code:"방문 기록처럼 한 사람이 여러 줄로 나오는 자료를 다루는 코드에는 사람 단위 비율을 따로 구하는 줄이 함께 나와요. `.max()` 대신 `.min()`을 쓰면 '모든 기록이 1인가'를 묻게 돼요."},{type:`example`,id:`theory-stats-rates-ex7`,kind:`choice`,title:`한 번이라도 빠진 사람`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import pandas as pd
df = pd.DataFrame({
    "id": ["A", "A", "A", "B", "C", "C"],
    "miss": [0, 1, 0, 0, 0, 0]})
g = df.groupby("id")["miss"].max()
print(round(g.mean(), 2))`,output:`0.33
`,choices:[`0.33`,`0.17`,`1`,`0.11`],answer:`0.33`,feedback:{"0.17":`사람마다 묶어도 기록 6개를 하나씩 센다고 생각했나요?`,1:"`.max()`가 표 전체에서 가장 큰 값 하나만 돌려준다고 생각했나요?","0.11":`사람마다 평균을 낸 뒤 그 평균들을 다시 평균 낸다고 생각했나요?`},explanation:`사람마다 가장 큰 값은 A 1, B 0, C 0이라 세 명 중 한 명이 한 번이라도 빠졌어요. 그래서 1 ÷ 3을 반올림한 0.33이에요.`,card:`unit`},{type:`summary`,points:["비율은 해당 개수 ÷ 전체 개수예요. 0과 1로 된 리스트는 `sum`이 1의 개수라 `sum / len`이 비율이에요.",`조건으로 집단을 고르면 분모도 그 집단의 크기예요. 'A 중 B'와 'B 중 A'는 분모가 달라요.`,"크기가 다른 묶음의 전체 비율은 합계 ÷ 합계이고, 크기로 가중한 `np.average(…, weights=…)`와 같아요. 비율의 단순 평균은 묶음마다 같은 무게예요.",`행을 걸러 냈다면 분자와 분모를 모두 남은 행에서 더해요.`,`차이 × 100은 퍼센트포인트, (새 값 ÷ 처음 값 - 1) × 100은 상대 변화율이에요. 연속된 변화는 (1 + 변화율)을 곱해요.`,"같은 사람이 여러 번 나오면 기록 단위와 사람 단위 비율이 달라요. `groupby(…).max()`로 사람마다 먼저 묶어요."]}],covers:{"stats-weight-01":[`rate`,`pooled`],"stats-ab-01":[`pp-relative`],"stats-conditional-01":[`rate`,`conditional`],"stats-weight-02":[`pooled`,`pooled-filter`,`same-weight`],"stats-ab-02":[`rate`,`pooled-filter`,`pp-relative`],"stats-conditional-02":[`direction`],"stats-compound-change-20261024":[`compound`],"stats-rate-foundation-02":[`rate`],"stats-rate-transfer-02":[`conditional`,`pooled-filter`,`same-weight`],"stats-two-denominators-20261019":[`conditional`],"stats-user-session-20261020":[`unit`],"stats-pooled-rate-form-01":[`pooled`]}},{id:`theory-ml-evaluation`,version:2,concept_id:`ml-evaluation`,title:`학습·평가 분리`,minutes:16,steps:[{type:`explain`,id:`split`,title:`학습 데이터와 평가 데이터`,body:"모델은 예시(입력과 정답)에서 규칙을 배워 새 입력의 답을 내는 프로그램이에요. 모델이 배우는 예시를 학습 데이터, 배울 때 보여 주지 않고 성능을 확인하는 데만 쓰는 예시를 평가 데이터라고 해요. 시험 문제를 미리 보고 공부하면 점수가 실력을 말해 주지 못하듯, 평가 데이터로 학습하면 점수를 믿을 수 없어요. scikit-learn(사이킷런, 머신러닝 도구 모음)의 `train_test_split`은 데이터를 섞은 뒤 `test_size` 비율만큼 평가용으로 떼어 (학습용, 평가용) 순서로 돌려줘요. `random_state`에 숫자를 주면 몇 번을 실행해도 똑같이 섞여요.",code:`from sklearn.model_selection import train_test_split
n = list(range(1, 21))
tr, te = train_test_split(
    n, test_size=0.3, random_state=3)
print(len(tr), len(te))
print(te)`,trace:["`from sklearn.model_selection import train_test_split` → scikit-learn에서 나누는 함수를 불러와요","`n = list(range(1, 21))` → 1부터 20까지 스무 개의 값이에요","`tr, te = train_test_split(...)` → 번호 3으로 정해진 방식대로 섞고 30%인 6개를 평가용으로 떼어, 학습용·평가용 순서로 두 이름에 담아요","`len(tr), len(te)` → 남은 14개와 뗀 6개 → **14 6**","`print(te)` → 섞은 뒤 뽑아서 앞이나 뒤의 연속된 값이 아니에요 → **[15, 3, 2, 18, 5, 17]**"],output:`14 6
[15, 3, 2, 18, 5, 17]
`,mistake:"돌려받는 순서를 거꾸로 읽기. 첫 번째가 학습용, 두 번째가 평가용이에요. `test_size=0.3`은 평가용의 비율이라 보통 평가용이 더 작아요.",in_code:"AI가 쓴 코드에서 `random_state=0`처럼 숫자를 넣은 줄을 자주 봐요. 그 숫자에 특별한 뜻은 없고, 결과를 다시 똑같이 만들기 위한 번호일 뿐이에요."},{type:`example`,id:`theory-ml-evaluation-ex1`,kind:`choice`,title:`같은 번호로 두 번 나누기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from sklearn.model_selection import train_test_split
n = list(range(30))
a, b = train_test_split(
    n, test_size=0.2, random_state=5)
c, d = train_test_split(
    n, test_size=0.2, random_state=5)
print(b == d, len(c))`,output:`True 24
`,choices:[`True 24`,`False 24`,`True 6`,`False 6`],answer:`True 24`,feedback:{"False 24":"같은 `random_state`로 나눠도 실행할 때마다 다르게 섞인다고 생각했나요?","True 6":`앞에 돌려받는 c가 평가용이라고 생각했나요?`,"False 6":`매번 다르게 섞이고, 앞에 돌려받는 c가 평가용이라고 생각했나요?`},explanation:"`random_state`가 같으면 섞는 방식도 같아서 두 평가용 b와 d는 똑같아요. c는 학습용이라 30개 중 80%인 24개예요.",card:`split`},{type:`explain`,id:`split-facts`,title:`나눈 결과의 성질`,body:"`train_test_split`은 원래 리스트의 칸 하나하나를 학습용과 평가용 중 한쪽에만 넣어서 두 부분이 겹치지 않아요(같은 값이 두 칸에 있으면 그 값은 양쪽에 나뉠 수 있어요). 두 부분을 합치면 원래 값이 하나도 빠짐없이 다시 모여요. 다만 기본으로 섞은 뒤 나누기 때문에, 학습용이 원래 리스트의 앞부분과 같다고 볼 수는 없어요. `set(값들)`은 중복 없는 집합을 만들고, 집합끼리 `&`는 양쪽에 다 있는 값(교집합)이에요.",code:`from sklearn.model_selection import train_test_split
n = list(range(1, 9))
tr, te = train_test_split(
    n, test_size=0.5, random_state=4)
print(te, set(tr) & set(te))
print(sorted(tr + te) == n)`,trace:["`n = list(range(1, 9))` → 1부터 8까지 여덟 값이에요","`tr, te = train_test_split(...)` → 섞은 뒤 절반씩 학습용 tr과 평가용 te로 나눠요","`print(te, set(tr) & set(te))` → 평가용은 섞여서 뽑힌 네 값이고, 양쪽에 다 있는 값이 없어 빈 집합 → **[5, 8, 4, 1] set()**","`sorted(tr + te) == n` → 두 부분을 이어 붙여 줄 세우면 원래와 같아요 → **True**"],output:`[5, 8, 4, 1] set()
True
`,mistake:"학습용이 원래 리스트의 앞부분이라고 생각하기. 이 코드의 tr은 `n[:4]`인 [1, 2, 3, 4]가 아니에요. 섞지 않고 순서대로 자르려면 `shuffle=False`를 줘요.",in_code:"데이터를 나눈 뒤 `assert not set(train_ids) & set(test_ids)`처럼 겹치는 값이 없는지 확인하는 줄을 넣기도 해요. `assert`는 조건이 거짓이면 바로 오류를 내서 멈추는 문장이에요."},{type:`explain`,id:`xy-split`,title:`입력과 정답을 함께 나누기`,body:"scikit-learn에서는 보통 입력을 `X`, 정답을 `y`라고 불러요. `X`는 `[[1], [2]]`처럼 행마다 입력 값이 든 2차원 리스트(행의 리스트)이고, `y`는 행마다 정답이 하나씩 든 리스트예요. 둘을 함께 `train_test_split(X, y, …)`에 넣으면 같은 행끼리 짝을 지킨 채 섞여서, X 학습용 · X 평가용 · y 학습용 · y 평가용 네 개를 이 순서로 돌려줘요. 필요 없는 값은 `_`로 받아요.",code:`from sklearn.model_selection import train_test_split
X = [[1], [2], [3], [4]]
y = ["a", "b", "c", "d"]
X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.5, random_state=1)
print(X_te, y_te)`,trace:["`X = [[1], [2], [3], [4]]` → 행 네 개, 행마다 입력 값 하나예요",'`y = ["a", "b", "c", "d"]` → 행마다의 정답이에요. [1] 행의 정답은 a예요',"`X_tr, X_te, y_tr, y_te = train_test_split(...)` → 짝을 지켜 섞고 절반을 평가용으로 떼어 네 이름에 차례로 담아요","`print(X_te, y_te)` → 평가용 입력과 정답이 같은 순서로 짝을 이뤄요 → **[[4], [3]] ['d', 'c']**"],output:`[[4], [3]] ['d', 'c']
`,mistake:`돌려받는 네 개를 X 학습용, y 학습용, X 평가용, y 평가용 순서로 읽기. 넣은 것마다 (학습용, 평가용)이 붙어서 X_train, X_test, y_train, y_test 순서예요.`,in_code:"AI가 쓴 코드에서는 `X_train, X_test, y_train, y_test = train_test_split(X, y, …)`라는 줄을 거의 항상 봐요. 이름 순서와 돌려받는 순서가 같아서 외워 두면 편해요."},{type:`example`,id:`theory-ml-evaluation-ex2`,kind:`choice`,title:`돌려받는 값 세기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from sklearn.model_selection import train_test_split
X = [[1], [2], [3], [4], [5]]
y = [0, 0, 1, 1, 1]
out = train_test_split(
    X, y, test_size=0.2, random_state=0)
print(len(out), len(out[2]))`,output:`4 4
`,choices:[`4 4`,`2 4`,`4 1`,`4 5`],answer:`4 4`,feedback:{"2 4":`X와 y를 함께 넣어도 학습용·평가용 두 개만 돌려받는다고 생각했나요?`,"4 1":`세 번째 값이 y의 평가용이라고 생각했나요?`,"4 5":`세 번째 값이 나누기 전의 y 전체라고 생각했나요?`},explanation:"X와 y를 함께 넣으면 X 학습용, X 평가용, y 학습용, y 평가용 네 개를 돌려줘요. 세 번째 `out[2]`는 y 학습용이라 다섯 개 중 평가용 하나를 뺀 4개예요.",card:`xy-split`},{type:`explain`,id:`stratify`,title:"`stratify`로 비율 지키기",body:"정답 종류(클래스)가 한쪽으로 치우친 데이터를 그냥 섞어 나누면, 평가용에 적은 쪽이 너무 적게 들어가거나 아예 빠질 수 있어요. `stratify=y`를 주면 y의 종류별 비율을 학습용과 평가용 모두에서 원래대로 지키며 나눠요. 고양이 6장·개 4장(3:2)에서 평가용 5장을 떼면 고양이 3장·개 2장이 들어가요. `test_size`에 0.5처럼 소수를 주면 비율, 5처럼 정수를 주면 개수이고, 리스트의 `.count(값)`으로 종류별 개수를 세어 확인해요.",code:`from sklearn.model_selection import train_test_split
kind = ["cat"] * 6 + ["dog"] * 4
_, te = train_test_split(
    kind, test_size=0.5, stratify=kind,
    random_state=2)
print(te.count("cat"), te.count("dog"))`,trace:['`kind = ["cat"] * 6 + ["dog"] * 4` → 리스트 반복과 이어 붙이기로 고양이 6장, 개 4장의 정답을 만들어요',"`_, te = train_test_split(...)` → 3:2 비율을 지키며 절반인 5장을 평가용으로 떼고, 학습용은 `_`로 받아 쓰지 않아요",'`te.count("cat"), te.count("dog")` → 평가용 5장의 종류별 개수 → **3 2**'],output:`3 2
`,mistake:"`stratify`가 종류마다 같은 개수씩 뽑는다고 생각하기. 원래 비율 3:2를 지켜서 3장과 2장이에요.",in_code:"사기 거래나 불량품처럼 한쪽이 아주 적은 분류 문제의 코드에서 `train_test_split(X, y, test_size=0.3, stratify=y)`를 자주 봐요. 이렇게 하면 평가 데이터에도 적은 쪽이 비율만큼 들어가요."},{type:`example`,id:`theory-ml-evaluation-ex3`,kind:`choice`,title:`세 등급 나누기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from sklearn.model_selection import train_test_split
grade = ["상"] * 3 + ["중"] * 9 + ["하"] * 6
_, te = train_test_split(
    grade, test_size=6, stratify=grade,
    random_state=0)
print(te.count("상"), te.count("중"),
      te.count("하"))`,output:`1 3 2
`,choices:[`1 3 2`,`2 2 2`,`3 9 6`,`0 4 2`],answer:`1 3 2`,feedback:{"2 2 2":"`stratify`가 등급마다 같은 개수씩 뽑는다고 생각했나요?","3 9 6":`평가용에도 원래 개수가 그대로 들어간다고 생각했나요?`,"0 4 2":"`stratify`를 줘도 적은 등급은 평가용에서 빠질 수 있다고 생각했나요?"},explanation:`18개의 비율은 상:중:하 = 3:9:6 = 1:3:2예요. 평가용 6개도 이 비율을 지켜 상 1개, 중 3개, 하 2개가 들어가요.`,card:`stratify`},{type:`explain`,id:`leak`,title:`평가 데이터는 기준에 섞지 않아요`,body:"평균으로 값을 옮기는 것처럼 데이터에서 기준을 계산하는 작업도 '배우는 일'이라 학습 데이터로만 해야 해요. 평가 데이터까지 넣어 기준을 정하면 평가 데이터의 정보가 학습 쪽으로 새어 들어가는데, 이를 데이터 누수라고 해요. 기준은 학습 데이터에서 한 번 구하고, 학습 데이터와 평가 데이터에 같은 기준을 그대로 적용해요. 배열도 리스트처럼 `s[:3]`, `s[3:]`로 앞뒤를 자를 수 있어요.",code:`import numpy as np
s = np.array([3., 5., 7., 9., 41.])
tr, te = s[:3], s[3:]
print(tr.mean(), s.mean())
m = tr.mean()
print((te - m).tolist())`,trace:["`s = np.array([3., 5., 7., 9., 41.])` → `3.`은 `3.0`을 줄여 쓴 소수예요","`tr, te = s[:3], s[3:]` → 앞의 세 값은 학습용, 뒤의 9와 41은 평가용이에요","`tr.mean(), s.mean()` → 학습용만의 평균과, 평가 값 9와 41까지 섞인 평균 → **5.0 13.0**","`m = tr.mean()` → 기준은 학습용 평균 5.0으로 정해요","`(te - m).tolist()` → 평가 값도 같은 기준 5.0으로 옮겨 → **[4.0, 36.0]**"],output:`5.0 13.0
[4.0, 36.0]
`,mistake:"편하다고 전체 데이터의 평균 `s.mean()`을 기준으로 쓰기. 평가 값 9와 41이 기준을 5.0에서 13.0으로 끌어올려서, 평가 데이터가 '처음 보는 데이터' 역할을 못 하게 돼요.",in_code:"다음 강의의 `StandardScaler`처럼 기준을 배우는 도구는 학습 데이터에만 `fit`하고, 평가 데이터에는 그 기준을 적용만 해요. 코드에서 평가 데이터가 기준 계산에 들어가는 줄이 있는지 먼저 확인해요."},{type:`example`,id:`theory-ml-evaluation-ex4`,kind:`choice`,title:`평가 값 옮기기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
v = np.array([2.0, 4.0, 6.0, 12.0])
tr, te = v[:3], v[3:]
c = tr.mean()
print((te - c).tolist())`,output:`[8.0]
`,choices:[`[8.0]`,`[6.0]`,`[0.0]`,`[12.0]`],answer:`[8.0]`,feedback:{"[6.0]":`기준 c에 평가 값 12.0까지 들어간다고 생각했나요?`,"[0.0]":`평가 값도 자기 평균으로 따로 옮긴다고 생각했나요?`,"[12.0]":`빼기 전의 평가 값이 그대로 나온다고 생각했나요?`},explanation:`기준 c는 학습용 [2.0, 4.0, 6.0]의 평균 4.0이에요. 평가 값 12.0도 같은 기준으로 옮겨 12.0 - 4.0 = 8.0이에요.`,card:`leak`},{type:`explain`,id:`kfold`,title:`교차 검증: KFold`,body:"평가 데이터를 한 번만 떼면 어떤 값이 뽑혔느냐에 따라 점수가 흔들려요. 교차 검증은 데이터를 k개 묶음(fold)으로 나눠, 묶음마다 한 번씩 검증용(평가용)으로 쓰고 나머지로 학습해요. `KFold(n_splits=k)`의 `split(데이터)`는 (학습 행 번호, 검증 행 번호) 짝을 차례로 내놓고, `list()`로 모으면 k개의 짝이 돼요. 기본은 섞지 않고 앞에서부터 자르며, 나누어떨어지지 않으면 남는 개수만큼 앞 묶음들이 하나씩 더 가져요. 돌려주는 것은 값이 아니라 0부터 센 행 번호예요.",code:`from sklearn.model_selection import KFold
cv = KFold(n_splits=4)
parts = list(cv.split(list(range(10))))
print(len(parts))
for tr, va in parts:
    print(len(tr), va.tolist())`,trace:["`cv = KFold(n_splits=4)` → 네 묶음으로 나누는 도구를 만들어요","`parts = list(cv.split(list(range(10))))` → 행 10개를 나눈 (학습, 검증) 행 번호 짝을 모두 모아요","`len(parts)` → 묶음마다 한 번씩이라 짝은 → **4**","`for tr, va in parts:` → 짝을 하나씩 꺼내 학습 번호는 tr, 검증 번호는 va에 담아요","`print(len(tr), va.tolist())` → 10 = 3 + 3 + 2 + 2라 앞 두 묶음이 하나씩 더 가져요 → **7 [0, 1, 2]** … **8 [8, 9]**"],output:`4
7 [0, 1, 2]
7 [3, 4, 5]
8 [6, 7]
8 [8, 9]
`,mistake:`남는 값을 마지막 묶음에 몰아준다고 생각하기. 10개를 4묶음으로 나누면 [2, 2, 2, 4]가 아니라 앞에서부터 하나씩 더 받아 [3, 3, 2, 2]예요. 그래도 모든 행은 검증에 정확히 한 번씩 들어가요.`,in_code:"`cross_val_score(model, X, y, cv=5)`처럼 교차 검증 점수를 한 번에 구하는 함수도 자주 봐요. 안에서 이렇게 5묶음으로 나눠 다섯 번 학습하고 점수 다섯 개를 돌려줘요."},{type:`example`,id:`theory-ml-evaluation-ex5`,kind:`choice`,title:`마지막 검증 묶음`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from sklearn.model_selection import KFold
temps = [21, 26, 19, 31, 28, 23, 24, 27, 22]
cv = KFold(n_splits=4)
for tr, va in cv.split(temps):
    last = va.tolist()
print(last)`,output:`[7, 8]
`,choices:[`[7, 8]`,`[27, 22]`,`[6, 7, 8]`,`[0, 1, 2]`],answer:`[7, 8]`,feedback:{"[27, 22]":"`split`이 행 번호가 아니라 값 자체를 돌려준다고 생각했나요?","[6, 7, 8]":`남는 한 개가 마지막 묶음에 붙는다고 생각했나요?`,"[0, 1, 2]":`반복이 끝난 뒤 last에 첫 번째 묶음이 남는다고 생각했나요?`},explanation:`9개를 4묶음으로 나누면 크기는 [3, 2, 2, 2]이고, 검증 행 번호는 [0, 1, 2], [3, 4], [5, 6], [7, 8] 순서로 나와요. 반복이 끝나면 last에는 마지막 묶음의 행 번호 [7, 8]이 남아요.`,card:`kfold`},{type:`explain`,id:`time-split`,title:`시간 순서를 지키는 TimeSeriesSplit`,body:"날짜 순서가 있는 데이터를 섞어 나누면, 미래 기록으로 학습하고 과거를 맞히는 이상한 평가가 돼요. `TimeSeriesSplit`은 늘 앞쪽(과거)으로 학습하고 바로 뒤 구간으로 검증해요. `test_size=2`면 검증 구간은 매번 2행이고, 나눌 때마다 학습 구간이 앞에서부터 점점 길어져요. 검증 구간 n_splits개는 데이터 맨 뒤쪽에 이어 붙어 자리 잡고, 나올 때는 가장 앞(과거) 구간부터 차례로 나와요.",code:`from sklearn.model_selection import TimeSeriesSplit
days = list(range(7))
ts = TimeSeriesSplit(n_splits=3,
                     test_size=2)
for tr, va in ts.split(days):
    print(tr.tolist(), va.tolist())`,trace:["`days = list(range(7))` → 날짜 순서대로 놓인 7일치 기록이라고 해요","`ts = TimeSeriesSplit(...)` → 검증 2행씩, 세 번 나누는 도구예요","`for tr, va in ts.split(days):` → 세 번 나눈 (학습, 검증) 행 번호 짝을 차례로 꺼내요","`print(tr.tolist(), va.tolist())` → 검증 구간 [1, 2], [3, 4], [5, 6]을 뒤에서부터 잡고 그 앞을 모두 학습에 써요 → **[0] [1, 2]** … **[0, 1, 2, 3, 4] [5, 6]**"],output:`[0] [1, 2]
[0, 1, 2] [3, 4]
[0, 1, 2, 3, 4] [5, 6]
`,mistake:`학습 구간도 검증 구간처럼 같은 길이로 밀려 간다고 생각하기. 기본 TimeSeriesSplit은 학습 구간을 맨 앞에서부터 계속 늘려요.`,in_code:"매출이나 주가처럼 날짜가 있는 데이터를 다루는 코드에서는 `train_test_split` 대신 `TimeSeriesSplit`이나 날짜 기준 자르기를 쓰는지 확인해요. `train_test_split`에 `shuffle=False`를 줘도 마지막 구간을 평가용으로 남길 수 있어요."},{type:`example`,id:`theory-ml-evaluation-ex6`,kind:`choice`,title:`마지막 시간 순서 나눔`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from sklearn.model_selection import TimeSeriesSplit
months = list(range(8))
ts = TimeSeriesSplit(n_splits=3,
                     test_size=2)
splits = list(ts.split(months))
tr, va = splits[-1]
print(tr.tolist(), va.tolist())`,output:`[0, 1, 2, 3, 4, 5] [6, 7]
`,choices:[`[0, 1, 2, 3, 4, 5] [6, 7]`,`[4, 5] [6, 7]`,`[0, 1] [2, 3]`,`[2, 3, 4, 5, 6, 7] [0, 1]`],answer:`[0, 1, 2, 3, 4, 5] [6, 7]`,feedback:{"[4, 5] [6, 7]":`학습 구간도 검증 바로 앞의 같은 길이만 쓴다고 생각했나요?`,"[0, 1] [2, 3]":"`splits[-1]`이 첫 번째 나눔을 꺼낸다고 생각했나요?","[2, 3, 4, 5, 6, 7] [0, 1]":`검증 구간이 학습 구간보다 앞(과거)에 놓인다고 생각했나요?`},explanation:"8행에서 검증 구간 2행을 세 번 잡으면 [2, 3], [4, 5], [6, 7]이에요. `splits[-1]`은 마지막 나눔이라 검증은 [6, 7], 학습은 그 앞의 [0, 1, 2, 3, 4, 5] 전부예요.",card:`time-split`},{type:`explain`,id:`group-split`,title:`같은 사람은 한쪽에만: GroupKFold`,body:"한 사람이 여러 행으로 나오는 데이터를 행 단위로 나누면, 같은 사람의 기록이 학습과 검증에 함께 들어가요. 그러면 모델이 그 사람을 이미 본 셈이라 새 사람에 대한 성능보다 점수가 좋게 나와요. `GroupKFold`는 `split(데이터, groups=집단)`처럼 집단을 주면, 한 집단의 행을 모두 같은 묶음에 넣어요. `next(…)`는 차례로 나오는 짝 중 첫 번째만 꺼내고, `pid[tr]`처럼 배열에 행 번호 배열을 넣으면 그 번호의 값들을 꺼내요.",code:`import numpy as np
from sklearn.model_selection import GroupKFold
pid = np.array([1, 2, 1, 2, 3, 3])
cv = GroupKFold(n_splits=3)
tr, va = next(cv.split(pid, groups=pid))
print(pid[tr].tolist(), pid[va].tolist())`,trace:["`pid = np.array([1, 2, 1, 2, 3, 3])` → 행마다 누구의 기록인지 적은 사람 번호예요. 세 사람이 두 행씩 있어요","`cv = GroupKFold(n_splits=3)` → 사람 단위로 세 묶음을 만드는 도구예요","`tr, va = next(cv.split(pid, groups=pid))` → 첫 번째 (학습, 검증) 행 번호 짝만 꺼내요","`pid[tr].tolist(), pid[va].tolist()` → 행 번호로 사람 번호를 꺼내 보면, 검증에 있는 사람은 학습에 없어요 → **[1, 2, 1, 2] [3, 3]**"],output:`[1, 2, 1, 2] [3, 3]
`,mistake:"보통 `KFold`로 나눠도 같은 사람이 양쪽에 나뉘지 않는다고 생각하기. KFold는 행 순서로만 자르니, 이 데이터를 세 묶음으로 나누면 첫 검증 묶음(0·1번 행)에 든 사람 1과 2가 학습 쪽에도 남아요.",in_code:"예제 코드에서 `X = np.arange(6).reshape(-1, 1)`처럼 0~5를 한 열짜리 6행으로 세운 입력을 자주 봐요. GroupKFold는 X의 값이 아니라 행의 개수와 `groups`만 보고 나눠요."},{type:`example`,id:`theory-ml-evaluation-ex7`,kind:`choice`,title:`검증 묶음 속 사람`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
from sklearn.model_selection import GroupKFold
pid = np.array(["a", "b", "a",
                "c", "b", "c"])
cv = GroupKFold(n_splits=3)
tr, va = next(cv.split(pid, groups=pid))
common = set(pid[tr]) & set(pid[va])
print(len(va), len(common))`,output:`2 0
`,choices:[`2 0`,`2 1`,`3 0`,`1 0`],answer:`2 0`,feedback:{"2 1":`GroupKFold도 한 사람의 기록을 학습과 검증에 나눠 넣을 수 있다고 생각했나요?`,"3 0":`검증 묶음에 사람마다 한 행씩, 세 행이 들어간다고 생각했나요?`,"1 0":`한 사람의 기록 중 한 행만 검증에 들어간다고 생각했나요?`},explanation:`세 사람이 두 행씩이고 세 묶음이라, 첫 검증 묶음에는 한 사람의 두 행이 모두 들어가요. 그 사람은 학습 쪽에 없어서 겹치는 사람 수는 0이에요.`,card:`group-split`},{type:`summary`,points:[`모델은 학습 데이터로 배우고, 배울 때 보지 않은 평가 데이터로 성능을 확인해요.`,"`train_test_split`은 섞은 뒤 나눠 (학습용, 평가용) 순서로 돌려주고, X와 y를 함께 넣으면 X_train, X_test, y_train, y_test 네 개예요. 두 부분은 겹치지 않고 합치면 원래와 같아요.","`random_state`가 같으면 똑같이 나뉘고, `stratify=y`는 정답 종류의 비율을 지켜요.",`평균 같은 기준은 학습 데이터로만 구하고, 평가 데이터에는 같은 기준을 적용만 해요.`,"`KFold`는 앞 묶음부터 하나씩 더 받아 나누고, `split`은 값이 아니라 행 번호를 돌려줘요.","시간 순서가 있으면 `TimeSeriesSplit`(학습 구간이 앞에서부터 늘어남), 같은 사람이 여러 행이면 `GroupKFold`(한 사람은 한쪽에만)를 써요."]}],covers:{"ml-split-01":[`split`],"ml-split-02":[`split`,`stratify`],"ml-eval-foundation-02":[`xy-split`,`stratify`],"ml-eval-transfer-01":[`leak`],"ml-eval-transfer-02":[`kfold`],"ml-time-split-20261019":[`time-split`,`group-split`],"ml-group-isolation-20261020":[`kfold`,`split-facts`,`group-split`],"ml-split-facts-form-01":[`split`,`split-facts`]}},{id:`theory-ml-preprocessing`,version:2,concept_id:`ml-preprocessing`,title:`전처리 기준`,minutes:16,steps:[{type:`explain`,id:`scaler-fit`,title:`전처리와 StandardScaler의 fit`,body:"전처리는 모델에 넣기 전에 값을 같은 기준으로 바꾸는 일이에요. 키(cm)와 몸무게(kg)처럼 크기가 다른 열을 '평균에서 표준편차 몇 개만큼 떨어졌나'로 바꾸는 것을 표준화라고 하고, `StandardScaler`가 이 일을 해요. `fit(데이터)`는 열마다 평균과 표준편차(n으로 나누는 방식)를 계산해 `mean_`, `scale_`에 저장하고, 같은 객체(변환기 자신)를 돌려줘요. 이름 끝의 `_`는 fit으로 데이터에서 배운 값이라는 표시이고, 입력은 `[[1.0, 45.0], [5.0, 65.0]]`처럼 행의 리스트로 넣어요.",code:`from sklearn.preprocessing import StandardScaler
rows = [[1.0, 45.0], [5.0, 65.0]]
sc = StandardScaler()
print(sc.fit(rows) is sc)
print(sc.mean_.tolist())
print(sc.scale_.tolist())`,trace:["`from sklearn.preprocessing import StandardScaler` → 표준화 도구를 불러와요","`rows = [[1.0, 45.0], [5.0, 65.0]]` → 행 2개, 열 2개인 학습 데이터예요","`sc = StandardScaler()` → 아직 아무것도 배우지 않은 변환기를 만들어요","`sc.fit(rows) is sc` → fit은 기준을 배운 뒤 sc 자신을 돌려줘서, 같은 객체인지 묻는 `is`가 → **True**","`sc.mean_.tolist()` → 열마다 (1 + 5) ÷ 2와 (45 + 65) ÷ 2 → **[3.0, 55.0]**","`sc.scale_.tolist()` → 열마다 평균에서 2와 10씩 떨어져 있어 그게 표준편차 → **[2.0, 10.0]**"],output:`True
[3.0, 55.0]
[2.0, 10.0]
`,mistake:"fit이 바뀐 값(배열)을 돌려준다고 생각하기. fit은 기준만 배워 저장하고 변환기 자신을 돌려줘요. 바뀐 값은 다음 카드의 `transform`이 돌려줘요.",in_code:"fit이 자신을 돌려주기 때문에 `sc = StandardScaler().fit(X_train)`처럼 만들기와 fit을 한 줄에 이어 쓰는 코드를 자주 봐요."},{type:`example`,id:`theory-ml-preprocessing-ex1`,kind:`choice`,title:`두 열의 scale_`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from sklearn.preprocessing import StandardScaler
rows = [[1.0, 8.0], [3.0, 2.0]]
sc = StandardScaler().fit(rows)
print(sc.scale_.tolist())`,output:`[1.0, 3.0]
`,choices:[`[1.0, 3.0]`,`[2.0, 5.0]`,`[2.0, 6.0]`,`[3.5, 0.5]`],answer:`[1.0, 3.0]`,feedback:{"[2.0, 5.0]":"`scale_`에 열마다의 평균이 담긴다고 생각했나요?","[2.0, 6.0]":"`scale_`이 열마다 가장 큰 값과 작은 값의 차이(범위)라고 생각했나요?","[3.5, 0.5]":`열이 아니라 행마다 표준편차를 계산한다고 생각했나요?`},explanation:"첫 열 [1.0, 3.0]은 평균 2에서 1씩, 둘째 열 [8.0, 2.0]은 평균 5에서 3씩 떨어져 있어요. 그래서 열마다의 표준편차 [1.0, 3.0]이 `scale_`에 저장돼요.",card:`scaler-fit`},{type:`explain`,id:`transform`,title:`transform은 저장한 기준으로 바꿔요`,body:"`transform(데이터)`는 fit으로 저장한 기준으로 값마다 (값 - mean_) ÷ scale_을 계산해요. 새 데이터를 넣어도 기준을 다시 구하지 않고 저장한 그대로 써요. 결과에는 -1~1 같은 정해진 범위가 없고 평균에서 표준편차 몇 개만큼 떨어졌는지가 그대로 나와서, 아래 9.0은 2.5가 돼요. 결과는 입력과 같은 모양의 2차원 NumPy 배열이라 `z[0, 0]`은 0번 행 0번 열의 값이고, `.ravel()`은 한 줄로 펼친 1차원 배열이에요.",code:`from sklearn.preprocessing import StandardScaler
sc = StandardScaler()
sc.fit([[2.0], [6.0]])
z = sc.transform([[9.0], [3.0]])
print(z.tolist(), z.ravel().tolist())
print(float(z[0, 0]))`,trace:["`sc = StandardScaler()` → 변환기를 만들어요","`sc.fit([[2.0], [6.0]])` → 평균 4, 표준편차 2를 저장해요","`z = sc.transform([[9.0], [3.0]])` → (9 - 4) ÷ 2와 (3 - 4) ÷ 2를 계산해요","`z.tolist(), z.ravel().tolist()` → 행마다 대괄호가 남은 2차원 모양과, 한 줄로 펼친 모양 → **[[2.5], [-0.5]] [2.5, -0.5]**","`float(z[0, 0])` → 0번 행 0번 열의 값을 보통 소수로 → **2.5**"],output:`[[2.5], [-0.5]] [2.5, -0.5]
2.5
`,mistake:`transform이 넣은 값들로 평균과 표준편차를 새로 구한다고 생각하기. [9.0]과 [3.0]만 보면 평균이 6이지만, transform은 fit 때 저장한 평균 4를 그대로 써요.`,in_code:"학습을 마친 변환기를 저장해 두었다가 새 데이터가 올 때마다 `transform`만 부르는 코드를 자주 봐요. 그래야 오늘 들어온 값도 학습 때와 같은 잣대로 바뀌어요."},{type:`example`,id:`theory-ml-preprocessing-ex2`,kind:`choice`,title:`새 값 두 개 바꾸기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from sklearn.preprocessing import StandardScaler
sc = StandardScaler().fit([[4.0], [8.0]])
z = sc.transform([[12.0], [6.0]])
print(z.ravel().tolist())`,output:`[3.0, 0.0]
`,choices:[`[3.0, 0.0]`,`[1.0, -1.0]`,`[6.0, 0.0]`,`[1.5, 0.0]`],answer:`[3.0, 0.0]`,feedback:{"[1.0, -1.0]":`transform이 새 값 12.0과 6.0으로 기준을 다시 구한다고 생각했나요?`,"[6.0, 0.0]":`평균만 빼고 표준편차로는 나누지 않는다고 생각했나요?`,"[1.5, 0.0]":`표준편차 대신 범위(8 - 4)로 나눈다고 생각했나요?`},explanation:"fit으로 평균 6, 표준편차 2를 저장했어요. (12 - 6) ÷ 2 = 3.0, (6 - 6) ÷ 2 = 0.0이고 `.ravel()`로 펼쳐 [3.0, 0.0]이에요.",card:`transform`},{type:`explain`,id:`refit`,title:`다시 fit하면 기준이 바뀌어요`,body:"fit을 한 번 더 부르면 이전 기준은 지워지고 새 데이터의 평균·표준편차로 바뀌어요. `fit_transform(데이터)`는 fit과 transform을 한 번에 하는 줄임이라, 이것도 기준을 그 데이터로 새로 정해요. 결과를 담지 않고 버려도 변환기 안의 기준은 이미 바뀌어 있어요. 반면 바뀌기 전에 계산해 담아 둔 값은 그대로 남아요.",code:`from sklearn.preprocessing import StandardScaler
sc = StandardScaler().fit([[1.0], [7.0]])
old = sc.transform([[10.0]]).tolist()
sc.fit([[12.0], [16.0]])
new = sc.transform([[10.0]]).tolist()
print(old, new)`,trace:["`sc = StandardScaler().fit([[1.0], [7.0]])` → 평균 4, 표준편차 3을 저장해요","`old = sc.transform([[10.0]]).tolist()` → (10 - 4) ÷ 3 = 2.0을 계산해 old에 담아 둬요","`sc.fit([[12.0], [16.0]])` → 기준을 평균 14, 표준편차 2로 바꿔요","`new = sc.transform([[10.0]]).tolist()` → 같은 10.0이지만 새 기준으로 (10 - 14) ÷ 2를 계산해요","`print(old, new)` → old는 먼저 담아 둔 그대로예요 → **[[2.0]] [[-2.0]]**"],output:`[[2.0]] [[-2.0]]
`,mistake:"평가 데이터에 `fit_transform`을 쓰기. 기준이 평가 데이터로 바뀌어 학습 때와 다른 잣대가 돼요. 평가 데이터에는 `transform`만 써요.",in_code:`모델을 새 데이터로 다시 학습하는 코드에서는 변환기도 다시 fit해요. 그러면 예전 기준으로 바꿔 둔 값과 새 기준으로 바꾼 값이 서로 다른 잣대라서, 둘을 섞어 쓰지 않아요.`},{type:`example`,id:`theory-ml-preprocessing-ex3`,kind:`choice`,title:`결과를 담지 않은 fit_transform`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from sklearn.preprocessing import StandardScaler
sc = StandardScaler().fit([[1.0], [3.0]])
sc.fit_transform([[20.0], [28.0]])
print(sc.transform([[32.0]]).tolist())`,output:`[[2.0]]
`,choices:[`[[2.0]]`,`[[30.0]]`,`[[0.0]]`,`[[1.0]]`],answer:`[[2.0]]`,feedback:{"[[30.0]]":"`fit_transform`의 결과를 담지 않았으니 기준도 처음 그대로라고 생각했나요?","[[0.0]]":`transform이 넣은 값 하나로 기준을 다시 잡는다고 생각했나요?`,"[[1.0]]":`표준편차 대신 범위(28 - 20)로 나눈다고 생각했나요?`},explanation:"결과는 버렸지만 `fit_transform`이 기준을 평균 24, 표준편차 4로 바꿔 두었어요. 그래서 (32 - 24) ÷ 4 = 2.0이에요.",card:`refit`},{type:`explain`,id:`order`,title:`나눈 뒤 학습 데이터로만 fit해요`,body:"전처리 기준도 모델처럼 학습 데이터에서만 배워야 해요. 순서는 ① 학습·평가 데이터 나누기 → ② 학습 데이터로 fit(또는 fit_transform) → ③ 같은 기준으로 평가 데이터 transform이에요. 나누기 전에 전체 데이터로 fit하면 평가 데이터의 평균·표준편차가 기준에 섞여요(데이터 누수). `.round(2)`는 배열의 칸마다 소수 둘째 자리까지 반올림해요.",code:`from sklearn.preprocessing import StandardScaler
tr = [[2.0], [4.0], [9.0]]
te = [[12.0]]
sc = StandardScaler()
z_tr = sc.fit_transform(tr)
print(sc.transform(te).round(2).tolist())`,trace:["`tr = [[2.0], [4.0], [9.0]]` → 이미 나눠 둔 학습 데이터예요","`te = [[12.0]]` → 평가 데이터예요. 기준을 정할 때는 쓰지 않아요","`sc = StandardScaler()` → 만들기만 해서 아직 기준이 없어요","`z_tr = sc.fit_transform(tr)` → 학습 데이터로 평균 5와 표준편차 약 2.94를 정하고, 학습 데이터도 바로 바꿔요","`sc.transform(te).round(2).tolist()` → (12 - 5) ÷ 2.94…를 둘째 자리까지 반올림 → **[[2.38]]**"],output:`[[2.38]]
`,mistake:"fit하기 전에 transform부터 부르기. 기준이 없어서 `NotFittedError`(아직 학습하지 않았다는 오류)가 나요. 변환기를 만드는 줄은 나누기 전에 있어도 괜찮지만, fit은 꼭 나눈 뒤 학습 데이터로 해요.",in_code:"AI가 쓴 코드에서는 `X_train = sc.fit_transform(X_train)` 바로 다음에 `X_test = sc.transform(X_test)`가 오는 모양을 자주 봐요. 이 두 줄이 나누는 줄보다 아래에 있는지 확인해요."},{type:`explain`,id:`constant`,title:`값이 하나뿐인 열`,body:"학습 데이터에서 모든 값이 같은 열은 표준편차가 0이라, 그대로 나누면 0으로 나누게 돼요. 그래서 `StandardScaler`는 이런 열의 `scale_`을 1로 정해서, 그 열은 평균만 빼고 나누지 않아요. 새 데이터에서 그 열에 다른 값이 오면 (값 - 평균) ÷ 1이라 0이 아닌 값이 나와요.",code:`from sklearn.preprocessing import StandardScaler
rows = [[2.0, 1.0], [2.0, 5.0]]
sc = StandardScaler().fit(rows)
print(sc.scale_.tolist())
new = [[1.0, 9.0]]
print(sc.transform(new).tolist())`,trace:["`rows = [[2.0, 1.0], [2.0, 5.0]]` → 첫 열은 두 값이 모두 2.0이에요","`sc = StandardScaler().fit(rows)` → 평균 [2, 3]을 저장하고, 표준편차가 0인 첫 열은 1로 바꿔 저장해요","`sc.scale_.tolist()` → 첫 열 1, 둘째 열 2 → **[1.0, 2.0]**","`new = [[1.0, 9.0]]` → 첫 열에 학습 때와 다른 값이 들어온 새 행이에요","`sc.transform(new).tolist()` → (1 - 2) ÷ 1과 (9 - 3) ÷ 2 → **[[-1.0, 3.0]]**"],output:`[1.0, 2.0]
[[-1.0, 3.0]]
`,mistake:`학습 때 값이 하나뿐이던 열은 무엇을 넣어도 0이 된다고 생각하기. 학습 때와 같은 2.0이면 0이지만, 1.0처럼 다른 값이면 평균과의 차이 -1.0이 그대로 나와요.`,in_code:`실제 데이터에는 모든 행이 같은 값인 열(예: 한 지점 자료의 '지점 번호')이 자주 섞여 있어요. 분석 코드에서 이런 열을 먼저 찾아 빼는 줄을 넣기도 해요.`},{type:`example`,id:`theory-ml-preprocessing-ex4`,kind:`choice`,title:`모두 같은 학습 값`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from sklearn.preprocessing import StandardScaler
same = [[4.0], [4.0], [4.0]]
sc = StandardScaler().fit(same)
print(sc.transform([[6.0]]).tolist())`,output:`[[2.0]]
`,choices:[`[[2.0]]`,`[[0.0]]`,`[[inf]]`,`[[6.0]]`],answer:`[[2.0]]`,feedback:{"[[0.0]]":`학습 때 값이 하나뿐이던 열은 무엇을 넣어도 0이 된다고 생각했나요?`,"[[inf]]":`표준편차 0으로 그대로 나눠 무한대(inf)가 된다고 생각했나요?`,"[[6.0]]":`표준편차가 0인 열은 평균도 빼지 않고 그대로 둔다고 생각했나요?`},explanation:"학습 값이 모두 4.0이라 평균은 4이고, 표준편차가 0이어서 `scale_`이 1이 돼요. (6 - 4) ÷ 1 = 2.0이에요.",card:`constant`},{type:`explain`,id:`minmax`,title:`MinMaxScaler와 범위 밖 값`,body:"`MinMaxScaler`는 fit 때의 최솟값을 0, 최댓값을 1로 맞추도록 (값 - 최솟값) ÷ (최댓값 - 최솟값)을 계산해요. 기준은 fit 때 정해져서, 새 값이 학습 범위 밖이면 결과도 0~1 밖으로 나가요(최댓값보다 크면 1보다 크고, 최솟값보다 작으면 음수). `MinMaxScaler(clip=True)`로 만들면 0~1 밖의 결과를 경계값 0이나 1로 잘라 줘요.",code:`from sklearn.preprocessing import MinMaxScaler
base = [[2.0], [6.0]]
mm = MinMaxScaler().fit(base)
cl = MinMaxScaler(clip=True).fit(base)
print(mm.transform([[1.0]]).tolist())
print(cl.transform([[1.0]]).tolist())`,trace:["`base = [[2.0], [6.0]]` → 학습 최솟값 2, 최댓값 6이에요","`mm = MinMaxScaler().fit(base)` → 기본 설정으로 최솟값과 최댓값을 저장해요","`cl = MinMaxScaler(clip=True).fit(base)` → 같은 기준에 '0~1 밖은 자르기'를 켠 변환기예요","`mm.transform([[1.0]]).tolist()` → (1 - 2) ÷ (6 - 2)라 0보다 작은 범위 밖 값 → **[[-0.25]]**","`cl.transform([[1.0]]).tolist()` → -0.25를 경계 0으로 잘라 → **[[0.0]]**"],output:`[[-0.25]]
[[0.0]]
`,mistake:`MinMaxScaler의 결과는 늘 0과 1 사이라고 생각하기. 기본 설정은 자르지 않아서, 학습 최댓값 6보다 큰 8.0을 넣으면 1.5가 나와요.`,in_code:"이미지 밝기(0~255)나 점수처럼 범위가 정해진 값을 0~1로 바꿀 때 `MinMaxScaler`를 자주 써요. 새 데이터가 학습 범위를 넘을 수 있으면 `clip=True`를 켜 두기도 해요."},{type:`example`,id:`theory-ml-preprocessing-ex5`,kind:`choice`,title:`학습 범위 아래의 값`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from sklearn.preprocessing import MinMaxScaler
mm = MinMaxScaler().fit([[12.0], [28.0]])
z = mm.transform([[4.0], [24.0]])
print(z.ravel().tolist())`,output:`[-0.5, 0.75]
`,choices:[`[-0.5, 0.75]`,`[0.0, 0.75]`,`[0.0, 1.0]`,`[-8.0, 12.0]`],answer:`[-0.5, 0.75]`,feedback:{"[0.0, 0.75]":`기본 MinMaxScaler도 범위 밖 결과를 0으로 잘라 준다고 생각했나요?`,"[0.0, 1.0]":`transform이 새 값들의 최솟값·최댓값으로 다시 맞춘다고 생각했나요?`,"[-8.0, 12.0]":`최솟값만 빼고 (최댓값 - 최솟값)으로는 나누지 않는다고 생각했나요?`},explanation:`학습 최솟값 12, 최댓값 28로 (값 - 12) ÷ 16을 계산해요. 4.0은 -0.5, 24.0은 0.75이고, 기본 설정은 범위 밖 값을 자르지 않아요.`,card:`minmax`},{type:`explain`,id:`onehot`,title:`범주를 열로 펼치는 OneHotEncoder`,body:"'비', '눈'처럼 글자로 된 범주는 모델이 계산할 수 없어서, 범주마다 열을 하나씩 만들고 해당하는 열만 1로 적어요(원-핫 인코딩). `OneHotEncoder`는 fit 때 본 범주를 가나다순(알파벳은 ABC순)으로 정리해 열 순서를 정해요. 기본 결과는 0을 생략해 저장하는 희소 행렬이라, `sparse_output=False`를 주면 보통 배열로 받아요. fit 때 못 본 범주는 기본으로 오류가 나고, `handle_unknown=\"ignore\"`를 주면 모든 열이 0인 행으로 바꿔요.",code:`from sklearn.preprocessing import OneHotEncoder
oh = OneHotEncoder(sparse_output=False,
    handle_unknown="ignore")
oh.fit([["비"], ["눈"], ["비"]])
t = oh.transform([["비"], ["안개"]])
print(t.astype(int).tolist())`,trace:["`oh = OneHotEncoder(...)` → 보통 배열로 돌려주고, 처음 보는 범주는 0으로 두는 인코더예요",`\`oh.fit([["비"], ["눈"], ["비"]])\` → 본 범주를 가나다순으로 정리해 ['눈', '비'] 두 열을 만들어요`,'`t = oh.transform([["비"], ["안개"]])` → 비는 둘째 열만 1, 처음 보는 안개는 모두 0이에요',"`t.astype(int).tolist()` → 1.0, 0.0으로 나온 결과를 정수로 바꿔 보면 → **[[0, 1], [0, 0]]**"],output:`[[0, 1], [0, 0]]
`,mistake:"처음 보는 범주가 오면 열이 하나 더 생긴다고 생각하기. 열은 fit 때 정해져서 늘지 않아요. 기본 설정이면 오류(`ValueError`)가 나고, `ignore`면 모두 0이에요.",in_code:'pandas의 `pd.get_dummies(df["날씨"])`도 범주를 열로 펼쳐요. 다만 평가 데이터에서 따로 부르면 열이 달라질 수 있어서, 모델 코드에서는 학습 데이터로 fit한 `OneHotEncoder`를 더 많이 써요.'},{type:`example`,id:`theory-ml-preprocessing-ex6`,kind:`choice`,title:`분리수거 종류 펼치기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from sklearn.preprocessing import OneHotEncoder
oh = OneHotEncoder(sparse_output=False,
    handle_unknown="ignore")
oh.fit([["종이"], ["캔"], ["병"]])
out = oh.transform([["캔"], ["비닐"]])
print(out.astype(int).tolist())`,output:`[[0, 0, 1], [0, 0, 0]]
`,choices:[`[[0, 0, 1], [0, 0, 0]]`,`[[0, 1, 0], [0, 0, 0]]`,`[[0, 0, 1, 0], [0, 0, 0, 1]]`,`[[0, 0, 1], [1, 1, 1]]`],answer:`[[0, 0, 1], [0, 0, 0]]`,feedback:{"[[0, 1, 0], [0, 0, 0]]":`열 순서가 fit에 넣은 순서(종이, 캔, 병)라고 생각했나요?`,"[[0, 0, 1, 0], [0, 0, 0, 1]]":`처음 보는 범주가 나오면 새 열이 생긴다고 생각했나요?`,"[[0, 0, 1], [1, 1, 1]]":`처음 보는 범주는 모든 열이 1이 된다고 생각했나요?`},explanation:"열은 가나다순으로 병, 종이, 캔이라 캔은 셋째 열만 1이에요. 비닐은 fit 때 없던 범주라 `ignore` 설정에 따라 세 열이 모두 0이에요.",card:`onehot`},{type:`explain`,id:`imputer`,title:`SimpleImputer로 빈칸 채우기`,body:'실제 데이터에는 빈칸(결측값)이 있고, NumPy에서는 `np.nan`(숫자가 아님)으로 표시해요. `SimpleImputer(strategy="median")`은 fit 때 열마다 중앙값을 계산해 `statistics_`에 저장해요. transform은 빈칸만 그 열의 중앙값으로 채우고, 값이 있는 칸은 건드리지 않아요. `strategy`를 `"mean"`(평균)이나 `"most_frequent"`(최빈값)로 바꿀 수도 있어요.',code:`import numpy as np
from sklearn.impute import SimpleImputer
im = SimpleImputer(strategy="median")
im.fit([[1, 4], [3, 8], [9, 6]])
row = [[np.nan, 2]]
print(im.transform(row).tolist())`,trace:['`im = SimpleImputer(strategy="median")` → 빈칸을 중앙값으로 채우는 도구를 만들어요',"`im.fit([[1, 4], [3, 8], [9, 6]])` → 열마다 [1, 3, 9]와 [4, 8, 6]의 중앙값 3과 6을 `statistics_`에 저장해요. 첫 열의 평균 4.33…이 아니에요","`row = [[np.nan, 2]]` → 첫 칸이 비어 있는 새 행이에요","`im.transform(row).tolist()` → 빈 첫 칸만 3.0으로 채우고, 있는 값 2는 그대로 → **[[3.0, 2.0]]**"],output:`[[3.0, 2.0]]
`,mistake:"transform이 모든 칸을 중앙값으로 바꾼다고 생각하기. 바뀌는 건 `np.nan`인 칸뿐이에요.",in_code:'pandas에서는 `df["나이"].fillna(df["나이"].median())`처럼 채우기도 해요. 학습·평가를 나눈 모델 코드에서는 학습 데이터로 fit한 `SimpleImputer`를 써야 평가 데이터의 값이 기준에 섞이지 않아요.'},{type:`example`,id:`theory-ml-preprocessing-ex7`,kind:`choice`,title:`빈칸 하나 채우기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
from sklearn.impute import SimpleImputer
im = SimpleImputer(strategy="median")
im.fit([[2, 10], [4, 50], [9, 15]])
row = [[5, np.nan]]
print(im.transform(row).tolist())`,output:`[[5.0, 15.0]]
`,choices:[`[[5.0, 15.0]]`,`[[4.0, 15.0]]`,`[[5.0, 25.0]]`,`[[5.0, 0.0]]`],answer:`[[5.0, 15.0]]`,feedback:{"[[4.0, 15.0]]":`값이 있는 칸까지 그 열의 중앙값으로 바꾼다고 생각했나요?`,"[[5.0, 25.0]]":'`strategy="median"`이어도 평균으로 채운다고 생각했나요?',"[[5.0, 0.0]]":`빈칸은 0으로 채운다고 생각했나요?`},explanation:`둘째 열 [10, 50, 15]의 중앙값은 15예요. 빈 둘째 칸만 15.0으로 채우고 첫 칸 5는 그대로 두어 [[5.0, 15.0]]이에요.`,card:`imputer`},{type:`summary`,points:["전처리 기준은 `fit`으로 배워 `mean_`·`scale_`처럼 `_`가 붙은 속성에 저장되고, fit은 변환기 자신을 돌려줘요.","`transform`은 저장한 기준으로 (값 - 평균) ÷ 표준편차를 계산하고, 새 데이터로 기준을 다시 구하지 않아요.","다시 `fit`하거나 `fit_transform`을 부르면 기준이 바뀌어요. 평가 데이터에는 `transform`만 써요.",`순서는 나누기 → 학습 데이터로 fit → 평가 데이터 transform이고, fit 전에 transform하면 오류예요.`,"표준편차가 0인 열은 `scale_`이 1이에요. `MinMaxScaler`는 기본으로 범위 밖 값을 자르지 않고, `clip=True`면 0~1로 잘라요.","`OneHotEncoder`는 범주를 가나다순 열로 펼치고 `ignore`면 처음 보는 범주가 모두 0이에요. `SimpleImputer`는 빈칸만 학습 기준값으로 채워요."]}],covers:{"ml-scale-01":[`scaler-fit`,`transform`],"ml-scale-02":[`transform`,`refit`,`order`],"ml-category-20261017":[`onehot`],"ml-minmax-clip-20261022":[`transform`,`minmax`],"ml-imputer-median-scope-20261025":[`imputer`],"ml-fit-foundation-01":[`scaler-fit`],"ml-mean-foundation-01":[`scaler-fit`],"ml-scale-foundation-01":[`scaler-fit`],"ml-transform-foundation-01":[`scaler-fit`,`transform`],"ml-refit-state-20261019":[`transform`,`refit`],"ml-constant-feature-20261020":[`constant`],"ml-leak-free-steps-form-01":[`order`]}},{id:`theory-ml-metrics`,version:2,concept_id:`ml-metrics`,title:`모델 평가 지표`,minutes:15,steps:[{type:`explain`,id:`accuracy`,title:`정확도와 그 함정`,body:"분류 모델은 입력마다 정해진 답 중 하나를 고르는 모델이에요(예: 스팸이면 1, 아니면 0). 평가할 때는 실제 정답 리스트와 모델의 예측 리스트를 같은 순서로 놓고 비교하는데, 이 강의의 코드에서는 정답을 `y`, 예측을 `p`라고 불러요. 정확도는 전체 중 맞힌 비율이고 `accuracy_score(정답, 예측)`으로 구해요. 한쪽 답이 대부분인 데이터에서는 늘 많은 쪽만 고르는 모델도 정확도가 높게 나와서, 정확도만 보면 쓸모없는 모델을 놓칠 수 있어요.",code:`from sklearn.metrics import accuracy_score
y = [1, 0, 0, 0, 1, 0, 0, 0, 0, 0]
lazy = [0] * 10
p = [1, 0, 0, 1, 1, 0, 0, 0, 0, 0]
print(accuracy_score(y, lazy))
print(accuracy_score(y, p))`,trace:["`from sklearn.metrics import accuracy_score` → 평가 지표 모음에서 정확도 함수를 불러와요","`y = [1, 0, 0, 0, 1, 0, 0, 0, 0, 0]` → 메일 10통 중 스팸(1)은 2통이에요","`lazy = [0] * 10` → 모든 메일을 '스팸 아님'이라고만 하는 예측이에요","`p = [1, 0, 0, 1, 1, 0, 0, 0, 0, 0]` → 스팸 2통을 모두 찾고, 정상 메일 하나를 스팸으로 잘못 본 예측이에요","`accuracy_score(y, lazy)` → 스팸을 하나도 못 찾았는데도 10통 중 8통을 맞혀 → **0.8**","`accuracy_score(y, p)` → 10통 중 9통을 맞혀 → **0.9**"],output:`0.8
0.9
`,mistake:`정확도 0.8이면 쓸 만한 모델이라고 생각하기. 이 데이터는 0이 80%라서 아무것도 찾지 않아도 0.8이에요. 정확도는 늘 '많은 쪽만 고를 때의 점수'와 비교해요.`,in_code:"AI가 쓴 분류 코드가 `accuracy_score`만 출력하고 끝나면, 정답 종류의 비율부터 확인해 봐요. 다음 카드들의 혼동행렬·정밀도·재현율을 함께 보는 코드가 더 믿을 만해요."},{type:`example`,id:`theory-ml-metrics-ex1`,kind:`choice`,title:`정확도 계산`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from sklearn.metrics import accuracy_score
y = [1, 0, 1, 0, 0]
p = [0, 1, 1, 0, 0]
print(accuracy_score(y, p))`,output:`0.6
`,choices:[`0.6`,`0.5`,`3`,`0.4`],answer:`0.6`,feedback:{"0.5":`실제로 1인 칸만 보고 그중 맞힌 비율을 구한다고 생각했나요?`,3:"`accuracy_score`가 맞힌 개수를 그대로 돌려준다고 생각했나요?","0.4":"`accuracy_score`가 틀린 비율을 돌려준다고 생각했나요?"},explanation:`자리마다 비교하면 셋째, 넷째, 다섯째가 같아서 5개 중 3개를 맞혔어요. 정확도는 0과 1을 가리지 않고 맞힌 비율이라 0.6이에요.`,card:`accuracy`},{type:`explain`,id:`confusion`,title:`혼동행렬로 네 경우 세기`,body:"찾으려는 쪽(1)을 양성, 나머지(0)를 음성이라고 해요. 예측과 실제를 짝지으면 네 경우가 생겨요: 양성을 양성으로 맞힘(TP), 음성을 양성으로 잘못 봄(FP), 양성을 놓침(FN), 음성을 음성으로 맞힘(TN). `confusion_matrix(정답, 예측)`은 이 개수를 표로 돌려주는데, 행은 실제이고 열은 예측이며 순서는 기본으로 작은 값부터([0, 1])라서 [[TN, FP], [FN, TP]]예요. `labels=[1, 0]`을 주면 행과 열 순서가 모두 1부터로 바뀌어요.",code:`from sklearn.metrics import confusion_matrix
y = [1, 1, 1, 0, 0, 0, 0]
p = [1, 1, 0, 1, 0, 0, 0]
print(confusion_matrix(y, p).tolist())
m = confusion_matrix(y, p, labels=[1, 0])
print(m.tolist())`,trace:["`y = [1, 1, 1, 0, 0, 0, 0]` → 실제 양성 3개, 음성 4개예요","`p = [1, 1, 0, 1, 0, 0, 0]` → 양성 둘은 맞히고 하나는 놓쳤으며, 음성 하나를 양성으로 봤어요","`confusion_matrix(y, p).tolist()` → 실제 0 행 [TN 3, FP 1], 실제 1 행 [FN 1, TP 2] → **[[3, 1], [1, 2]]**","`m = confusion_matrix(y, p, labels=[1, 0])` → 행과 열을 모두 1, 0 순서로 세요","`m.tolist()` → 실제 1 행 [TP 2, FN 1], 실제 0 행 [FP 1, TN 3] → **[[2, 1], [1, 3]]**"],output:`[[3, 1], [1, 2]]
[[2, 1], [1, 3]]
`,mistake:"행이 예측, 열이 실제라고 거꾸로 읽기. scikit-learn의 혼동행렬은 행이 실제 정답이에요. 표를 읽기 전에 `labels` 순서도 확인해요.",in_code:"`tn, fp, fn, tp = confusion_matrix(y, p).ravel()`처럼 표를 펼쳐 네 개수를 한 번에 이름에 담는 줄을 자주 봐요. 기본 순서 [0, 1]일 때만 이 이름 순서가 맞아요."},{type:`example`,id:`theory-ml-metrics-ex2`,kind:`choice`,title:`혼동행렬 읽기`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from sklearn.metrics import confusion_matrix
y = [0, 0, 0, 1, 1, 1, 1]
p = [0, 0, 0, 1, 0, 0, 1]
print(confusion_matrix(y, p).tolist())`,output:`[[3, 0], [2, 2]]
`,choices:[`[[3, 0], [2, 2]]`,`[[3, 2], [0, 2]]`,`[[2, 2], [0, 3]]`,`[[2, 0], [2, 3]]`],answer:`[[3, 0], [2, 2]]`,feedback:{"[[3, 2], [0, 2]]":`행이 예측, 열이 실제라고 생각했나요?`,"[[2, 2], [0, 3]]":`기본 순서가 1을 먼저 놓는 [1, 0]이라고 생각했나요?`,"[[2, 0], [2, 3]]":`왼쪽 위 첫 칸이 맞힌 양성(TP)이라고 생각했나요?`},explanation:`행은 실제, 열은 예측이고 순서는 [0, 1]이에요. 실제 0 셋은 모두 0으로 예측해 [3, 0], 실제 1 넷 중 둘은 0, 둘은 1로 예측해 [2, 2]예요.`,card:`confusion`},{type:`explain`,id:`precision-recall`,title:`정밀도와 재현율`,body:"정밀도는 모델이 양성이라고 한 것 중 진짜 양성의 비율로 TP ÷ (TP + FP)예요. 재현율은 진짜 양성 중 모델이 찾아낸 비율로 TP ÷ (TP + FN)이에요. 분자는 같고 분모만 달라서, '예측한 양성'이 분모면 정밀도, '실제 양성'이 분모면 재현율이에요. `precision_score`, `recall_score`도 (정답, 예측) 순서로 넣어야 하고, 순서를 바꾸면 두 지표가 서로 뒤바뀌어요.",code:`from sklearn.metrics import precision_score, recall_score
y = [1, 1, 1, 1, 1, 1, 0, 0]
p = [1, 1, 1, 0, 0, 0, 1, 0]
print(precision_score(y, p))
print(recall_score(y, p))
print(recall_score(p, y))`,trace:["`y = [1, 1, 1, 1, 1, 1, 0, 0]` → 실제 양성 6개, 음성 2개예요","`p = [1, 1, 1, 0, 0, 0, 1, 0]` → 양성이라고 한 4개 중 3개가 맞고(TP 3, FP 1), 실제 양성 3개는 놓쳤어요(FN 3)","`precision_score(y, p)` → 3 ÷ (3 + 1) → **0.75**","`recall_score(y, p)` → 3 ÷ (3 + 3) → **0.5**","`recall_score(p, y)` → 순서를 바꾸면 p를 정답으로 보아 '예측한 양성' 4개가 분모가 되어, 정밀도와 같은 → **0.75**"],output:`0.75
0.5
0.75
`,mistake:`재현율을 구하면서 예측이 1인 개수로 나누기. 그건 정밀도예요. 재현율의 분모는 실제로 1인 개수예요.`,in_code:"암 검진처럼 놓치면 안 되는 문제는 재현율을, 스팸 차단처럼 잘못 잡으면 곤란한 문제는 정밀도를 더 챙겨요. 그래서 두 지표를 함께 표로 보여 주는 `classification_report(y, p)`를 출력하는 코드를 자주 봐요."},{type:`example`,id:`theory-ml-metrics-ex3`,kind:`choice`,title:`정밀도 계산`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from sklearn.metrics import precision_score
y = [1, 0, 1, 1, 0, 0]
p = [1, 1, 1, 0, 1, 1]
print(round(precision_score(y, p), 2))`,output:`0.4
`,choices:[`0.4`,`0.67`,`0.33`,`0.6`],answer:`0.4`,feedback:{"0.67":`정밀도의 분모가 실제로 1인 개수라고 생각했나요?`,"0.33":`정밀도가 전체 중 맞힌 비율(정확도)이라고 생각했나요?`,"0.6":`양성이라고 한 것 중 틀린 비율을 구한다고 생각했나요?`},explanation:`양성이라고 한 것은 5개이고 그중 실제 양성은 첫째와 셋째 2개예요. 정밀도는 2 ÷ 5 = 0.4예요.`,card:`precision-recall`},{type:`explain`,id:`bool-count`,title:`참·거짓 배열로 세기`,body:"NumPy 배열에 `==`를 쓰면 칸마다 비교한 참·거짓 배열이 나와요. 두 조건이 모두 참인 칸은 `&`(그리고)로 고르고, 조건마다 괄호를 씌워 `(y == 1) & (p == 1)`처럼 써요. 참·거짓 배열의 `.sum()`은 True의 개수, `.mean()`은 True의 비율이에요. 리스트라면 `sum(조건 for …)`가 같은 일을 해요(True는 1로 세요).",code:`import numpy as np
y = np.array([1, 1, 1, 1, 0, 0, 0, 0])
p = np.array([1, 0, 0, 1, 1, 0, 0, 0])
caught = (y == 1) & (p == 1)
print(caught.sum() / (y == 1).sum())
print((p == y).mean(), (p == 1).mean())`,trace:["`y = np.array([...])` → 실제 양성 4개, 음성 4개예요","`p = np.array([...])` → 모델이 양성이라고 한 칸은 0, 3, 4번이에요","`caught = (y == 1) & (p == 1)` → 실제도 1이고 예측도 1인 칸만 True라 0번과 3번이에요","`caught.sum() / (y == 1).sum()` → TP 2 ÷ 실제 양성 4, 즉 재현율 → **0.5**","`(p == y).mean(), (p == 1).mean()` → 같은 칸의 비율(정확도) 5/8과 양성으로 예측한 비율 3/8 → **0.625 0.375**"],output:`0.5
0.625 0.375
`,mistake:"`&` 대신 `and`를 쓰거나 괄호를 빼기. 배열에서는 둘 다 오류(`ValueError`)가 나요. 괄호가 없으면 `&`가 `==`보다 먼저 계산되기 때문이에요.",in_code:"모델 결과를 확인하는 코드에서 `(pred == y_test).mean()`으로 정확도를 바로 구하는 줄을 자주 봐요. 0과 1로 된 예측이라면 `pred.mean()`은 양성으로 예측한 비율이에요."},{type:`example`,id:`theory-ml-metrics-ex4`,kind:`choice`,title:`두 가지 평균`,prompt:`아래 코드의 출력값을 고르세요.`,code:`import numpy as np
y = np.array([1, 0, 1, 0, 1, 0, 0, 0])
p = np.array([1, 0, 0, 0, 1, 1, 0, 0])
print((p == y).mean(), (p == 1).mean())`,output:`0.75 0.375
`,choices:[`0.75 0.375`,`6 3`,`0.25 0.375`,`0.75 0.625`],answer:`0.75 0.375`,feedback:{"6 3":"`.mean()`이 True의 개수를 센다고 생각했나요?","0.25 0.375":"`p == y`가 서로 다른 칸을 True로 표시한다고 생각했나요?","0.75 0.625":"`(p == 1).mean()`이 0으로 예측한 칸의 비율이라고 생각했나요?"},explanation:`8칸 중 예측과 정답이 같은 칸은 6개라 0.75이고, 양성으로 예측한 칸은 3개라 3 ÷ 8 = 0.375예요.`,card:`bool-count`},{type:`explain`,id:`threshold`,title:`점수를 0과 1로 바꾸는 기준`,body:"많은 분류 모델은 0/1 대신 '1일 가능성' 점수(0~1)를 먼저 내놓아요. 점수가 기준값(임계값) 이상이면 1, 아니면 0으로 정해요. `int(True)`는 1, `int(False)`는 0이라서 `int(점수 >= 기준)`으로 0/1을 만들어요. 기준을 올리면 1로 예측하는 경우가 줄어서, 놓치는 양성이 늘고 재현율은 내려가거나 그대로예요.",code:`from sklearn.metrics import recall_score
y = [1, 1, 0, 1, 1, 0]
s = [0.9, 0.8, 0.6, 0.55, 0.3, 0.1]
for cut in (0.5, 0.85):
    p = [int(v >= cut) for v in s]
    print(cut, p, recall_score(y, p))`,trace:["`y = [1, 1, 0, 1, 1, 0]` → 실제 양성 4개예요","`s = [0.9, 0.8, 0.6, 0.55, 0.3, 0.1]` → 모델이 매긴 '양성일 가능성' 점수예요","`for cut in (0.5, 0.85):` → 기준 0.5와 0.85로 한 번씩 해 봐요","`p = [int(v >= cut) for v in s]` → 점수가 기준 이상이면 1, 아니면 0인 예측을 만들어요","`print(cut, p, recall_score(y, p))` → 0.5면 양성 3개를, 0.85면 1개만 찾아요 → **0.5 [1, 1, 1, 1, 0, 0] 0.75** · **0.85 [1, 0, 0, 0, 0, 0] 0.25**"],output:`0.5 [1, 1, 1, 1, 0, 0] 0.75
0.85 [1, 0, 0, 0, 0, 0] 0.25
`,mistake:"기준과 같은 점수는 0이 된다고 생각하기. `>=`는 '이상'이라 점수가 기준과 똑같으면 1이에요.",in_code:"`model.predict_proba(X)[:, 1]`로 양성 점수를 꺼낸 뒤 `(점수 >= 0.3).astype(int)`처럼 기준을 직접 정하는 코드를 자주 봐요. 대부분의 모델에서 `predict()`는 두 클래스일 때 점수가 0.5보다 크면 1로 고른 것과 같아요."},{type:`example`,id:`theory-ml-metrics-ex5`,kind:`choice`,title:`기준 0.5의 예측`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from sklearn.metrics import recall_score
y = [1, 0, 1, 1]
s = [0.7, 0.4, 0.45, 0.9]
p = [int(v >= 0.5) for v in s]
print(p, round(recall_score(y, p), 2))`,output:`[1, 0, 0, 1] 0.67
`,choices:[`[1, 0, 0, 1] 0.67`,`[1, 0, 1, 1] 1.0`,`[0, 1, 1, 0] 0.33`,`[1, 0, 0, 1] 1.0`],answer:`[1, 0, 0, 1] 0.67`,feedback:{"[1, 0, 1, 1] 1.0":`0.45도 반올림하면 0.5라서 1이 된다고 생각했나요?`,"[0, 1, 1, 0] 0.33":`점수가 기준보다 낮을 때 1이 된다고 생각했나요?`,"[1, 0, 0, 1] 1.0":`재현율이 1로 예측한 것 중 맞힌 비율이라고 생각했나요?`},explanation:`0.5 이상인 0.7과 0.9만 1이라 예측은 [1, 0, 0, 1]이에요. 실제 양성 3개 중 2개를 찾아 재현율은 0.67이에요.`,card:`threshold`},{type:`explain`,id:`f1`,title:`F1 점수는 조화평균`,body:"정밀도와 재현율을 숫자 하나로 합친 지표가 F1 점수예요. 보통 평균이 아니라 조화평균 2 × 정밀도 × 재현율 ÷ (정밀도 + 재현율)이라서, 둘 중 하나가 낮으면 F1도 낮아져요. 개수로 쓰면 2 × TP ÷ (2 × TP + FP + FN)이고, `f1_score(정답, 예측)`으로 구해요.",code:`from sklearn.metrics import f1_score
y = [1, 1, 1, 1, 0, 0]
p = [1, 0, 0, 0, 0, 0]
print(f1_score(y, p))
pr, rc = 1.0, 0.25
print(2 * pr * rc / (pr + rc))`,trace:["`y = [1, 1, 1, 1, 0, 0]` → 실제 양성 4개예요","`p = [1, 0, 0, 0, 0, 0]` → 딱 하나만 양성이라고 했고 그건 맞았어요. 정밀도 1.0, 재현율 0.25예요","`f1_score(y, p)` → 2 × 1 ÷ (2 × 1 + 0 + 3) → **0.4**","`pr, rc = 1.0, 0.25` → 정밀도와 재현율을 담아요","`2 * pr * rc / (pr + rc)` → 0.5 ÷ 1.25라 같은 값 → **0.4**"],output:`0.4
0.4
`,mistake:`F1이 정밀도와 재현율의 보통 평균이라고 생각하기. 보통 평균은 (1.0 + 0.25) ÷ 2 = 0.625지만 F1은 0.4로, 낮은 쪽에 끌려가요.`,in_code:"`classification_report(y, p)`는 클래스마다 precision·recall·f1-score를 표로 보여 줘요. 한쪽이 적은 데이터를 다루는 코드에서 정확도 대신 F1을 기준으로 모델을 고르는 줄을 자주 봐요."},{type:`example`,id:`theory-ml-metrics-ex6`,kind:`choice`,title:`모두 양성이라고 한 모델`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from sklearn.metrics import f1_score
y = [1, 1, 1, 1, 0, 0]
p = [1, 1, 1, 1, 1, 1]
print(round(f1_score(y, p), 2))`,output:`0.8
`,choices:[`0.8`,`0.83`,`1.0`,`0.67`],answer:`0.8`,feedback:{"0.83":`F1이 정밀도와 재현율의 보통 평균이라고 생각했나요?`,"1.0":`양성을 모두 찾았으니 F1도 1이라고 생각했나요?`,"0.67":`F1이 정밀도와 같다고 생각했나요?`},explanation:`양성을 모두 찾아 재현율은 1.0이지만, 양성이라고 한 6개 중 4개만 맞아 정밀도는 0.67이에요. F1은 2 × 4 ÷ (2 × 4 + 2 + 0) = 0.8이고, 보통 평균 0.83보다 낮아요.`,card:`f1`},{type:`explain`,id:`balanced`,title:`균형 정확도`,body:"균형 정확도는 클래스마다 재현율(그 클래스를 맞힌 비율)을 구해 같은 무게로 평균 낸 값이에요. 개수가 많은 클래스가 점수를 끌어올리지 못해서, 한쪽이 적은 데이터에서 정확도보다 정직해요. `balanced_accuracy_score(정답, 예측)`으로 구하고, 두 클래스에서 많은 쪽만 고르는 모델은 0.5가 나와요.",code:`from sklearn.metrics import accuracy_score
from sklearn.metrics import balanced_accuracy_score
y = [0, 0, 0, 0, 0, 0, 1, 1]
p = [0, 0, 0, 0, 0, 0, 0, 1]
print(accuracy_score(y, p))
print(balanced_accuracy_score(y, p))`,trace:["`y = [0, 0, 0, 0, 0, 0, 1, 1]` → 0이 6개, 1이 2개예요","`p = [0, 0, 0, 0, 0, 0, 0, 1]` → 0은 모두 맞히고, 1은 둘 중 하나만 맞혔어요","`accuracy_score(y, p)` → 8개 중 7개 → **0.875**","`balanced_accuracy_score(y, p)` → 0의 재현율 6/6 = 1.0과 1의 재현율 1/2 = 0.5의 평균 → **0.75**"],output:`0.875
0.75
`,mistake:`균형 정확도가 양성 클래스의 재현율만 본다고 생각하기. 모든 클래스의 재현율을 같은 무게로 평균 내요.`,in_code:'한쪽이 적은 분류 문제의 코드에서는 교차 검증 점수 이름으로 `scoring="balanced_accuracy"`를 넣는 줄도 자주 봐요.'},{type:`example`,id:`theory-ml-metrics-ex7`,kind:`choice`,title:`양성 쪽으로 기운 예측`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from sklearn.metrics import balanced_accuracy_score
y = [0, 0, 0, 1, 1, 1, 1, 1]
p = [0, 1, 1, 1, 1, 1, 1, 1]
b = balanced_accuracy_score(y, p)
print(round(b, 2))`,output:`0.67
`,choices:[`0.67`,`0.75`,`1.0`,`0.33`],answer:`0.67`,feedback:{"0.75":`균형 정확도도 전체 중 맞힌 비율(정확도)이라고 생각했나요?`,"1.0":`양성 클래스의 재현율만 본다고 생각했나요?`,"0.33":`클래스별 재현율 중 낮은 쪽을 고른다고 생각했나요?`},explanation:`0의 재현율은 3개 중 1개라 1/3, 1의 재현율은 5개 모두라 1.0이에요. 두 값의 평균 (1/3 + 1) ÷ 2를 반올림한 0.67이에요.`,card:`balanced`},{type:`summary`,points:[`정확도는 전체 중 맞힌 비율이라, 한쪽이 대부분인 데이터에서는 많은 쪽만 골라도 높게 나와요.`,"`confusion_matrix`는 행이 실제, 열이 예측이고 기본 순서 [0, 1]이면 [[TN, FP], [FN, TP]]예요. `labels`로 순서를 바꿔요.",`정밀도는 TP ÷ 예측 양성, 재현율은 TP ÷ 실제 양성이에요. 함수에는 (정답, 예측) 순서로 넣어요.`,"참·거짓 배열의 `.sum()`은 True 개수, `.mean()`은 True 비율이고, 두 조건은 `(…) & (…)`로 묶어요.",`점수가 기준 이상이면 1이에요. 기준을 올리면 재현율은 내려가거나 그대로예요.`,`F1은 정밀도와 재현율의 조화평균이고, 균형 정확도는 클래스별 재현율의 평균이에요.`]}],covers:{"ml-metric-01":[`accuracy`],"ml-metric-02":[`precision-recall`,`bool-count`,`threshold`],"ml-metric-03":[`precision-recall`,`bool-count`],"ml-confusion-order-20261020":[`confusion`],"ml-balanced-recall-20261024":[`accuracy`,`balanced`],"ml-metric-application-01":[`confusion`,`precision-recall`],"ml-metric-foundation-02":[`precision-recall`],"ml-threshold-recall-20261019":[`precision-recall`,`threshold`],"ml-f1-balance-20261020":[`confusion`,`f1`],"ml-recall-denominator-form-01":[`precision-recall`,`bool-count`]}},{id:`theory-ml-neighbors`,version:2,concept_id:`ml-neighbors`,title:`이웃 기반 예측`,minutes:12,steps:[{type:`explain`,id:`knn-idea`,title:`가장 가까운 이웃을 따라 해요`,body:"k-최근접 이웃(KNN)은 새 입력과 가장 가까운 학습 데이터 k개를 찾아, 그 정답을 따라 답하는 분류 모델이에요. `fit(X, y)`는 학습 데이터(입력 X와 정답 y)를 기억해 두고, `predict(새 입력)`이 그때 거리를 재서 답을 정해요. 값이 하나인 입력의 거리는 두 값의 차이(절댓값)예요. 입력은 `[[160], [172]]`처럼 행의 리스트로 넣고, 결과는 NumPy 배열이라 `.tolist()`로 리스트로 봐요. 도구 이름 `KNeighborsClassifier`가 길어서 `import … as KNC`처럼 짧은 별명을 붙여 써요.",code:`from sklearn.neighbors import KNeighborsClassifier as KNC
knn = KNC(n_neighbors=1)
knn.fit([[150], [180]], ["S", "L"])
q = [[160], [172]]
print(knn.predict(q).tolist())`,trace:["`from sklearn.neighbors import KNeighborsClassifier as KNC` → KNN 분류 모델을 KNC라는 별명으로 불러와요","`knn = KNC(n_neighbors=1)` → 가장 가까운 이웃 1개만 보는 모델을 만들어요",'`knn.fit([[150], [180]], ["S", "L"])` → 키 150은 S, 180은 L 사이즈라는 예시를 기억해요',"`q = [[160], [172]]` → 사이즈를 정할 새 키 두 개예요","`knn.predict(q).tolist()` → 160은 150과 10, 180과 20 차이라 S이고, 172는 180과 8 차이라 L → **['S', 'L']**"],output:`['S', 'L']
`,mistake:"`predict([160])`처럼 1차원으로 넣기. 입력은 행의 리스트여야 해서 값이 하나여도 `[[160]]`으로 감싸요. 1차원으로 넣으면 오류가 나요.",in_code:"`model = KNeighborsClassifier(n_neighbors=5).fit(X_train, y_train)` 다음 줄에 `model.predict(X_test)`가 오는 모양을 자주 봐요. fit이 모델 자신을 돌려주기 때문에 만들기와 fit을 한 줄에 이어 쓸 수 있어요."},{type:`example`,id:`theory-ml-neighbors-ex1`,kind:`choice`,title:`가장 가까운 등급`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from sklearn.neighbors import KNeighborsClassifier as KNC
X = [[3], [9], [20]]
y = ["저", "중", "고"]
knn = KNC(n_neighbors=1).fit(X, y)
print(knn.predict([[13]]).tolist())`,output:`['중']
`,choices:[`['중']`,`['고']`,`[9]`,`[13]`],answer:`['중']`,feedback:{"['고']":`13이 9보다 20에 더 가깝다고 생각했나요?`,"[9]":`predict가 가장 가까운 학습 입력값을 돌려준다고 생각했나요?`,"[13]":`predict가 넣은 값을 그대로 돌려준다고 생각했나요?`},explanation:`13에서 3, 9, 20까지의 거리는 10, 4, 7이에요. 가장 가까운 9의 정답 '중'을 따라 ['중']이에요.`,card:`knn-idea`},{type:`explain`,id:`vote`,title:`이웃 k개의 다수결`,body:"`n_neighbors=k`로 정한 k개의 가장 가까운 이웃이 각자 자기 정답에 한 표씩 내고, 표가 가장 많은 정답이 예측이 돼요. 그래서 k를 바꾸면 같은 입력이라도 예측이 달라질 수 있어요. k를 학습 데이터 전체 개수로 정하면 거리와 상관없이 전체에서 가장 많은 정답을 고르게 돼요. 두 정답의 표가 같아지지 않게 k는 보통 홀수로 정해요.",code:`from sklearn.neighbors import KNeighborsClassifier as KNC
X = [[1], [2], [3], [6], [7]]
y = ["A", "B", "B", "A", "A"]
for k in (1, 3, 5):
    m = KNC(n_neighbors=k).fit(X, y)
    print(k, m.predict([[1.4]]).tolist())`,trace:["`X = [[1], [2], [3], [6], [7]]` → 학습 입력 다섯 개예요",'`y = ["A", "B", "B", "A", "A"]` → 각 입력의 정답이에요',"`for k in (1, 3, 5):` → 이웃 수를 1, 3, 5로 바꿔 가며 해 봐요","`m = KNC(n_neighbors=k).fit(X, y)` → 그 k로 모델을 만들고 학습해요","`print(k, m.predict([[1.4]]).tolist())` → 1.4에서 가까운 순서는 1(A), 2(B), 3(B), 6(A), 7(A)라서 → **1 ['A']** · **3 ['B']** · **5 ['A']**"],output:`1 ['A']
3 ['B']
5 ['A']
`,mistake:`k개 중 가장 가까운 이웃의 정답이 이긴다고 생각하기. 기본 설정에서는 가까운 정도와 상관없이 한 표씩이라, k=3이면 가장 가까운 A보다 B 두 표가 이겨요.`,in_code:"`for k in range(1, 16, 2):`처럼 홀수 k를 바꿔 가며 검증 점수를 비교하는 코드를 자주 봐요. 점수가 가장 좋은 k로 최종 모델을 만들어요."},{type:`example`,id:`theory-ml-neighbors-ex2`,kind:`choice`,title:`세 이웃의 투표`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from sklearn.neighbors import KNeighborsClassifier as KNC
X = [[0], [3], [4], [5], [10]]
y = ["B", "A", "B", "B", "A"]
m = KNC(n_neighbors=3).fit(X, y)
print(m.predict([[2.8]]).tolist())`,output:`['B']
`,choices:[`['B']`,`['A']`,`['A', 'B', 'B']`],answer:`['B']`,feedback:{"['A']":`이웃 세 개 중 가장 가까운 하나만 따른다고 생각했나요?`,"['A', 'B', 'B']":`predict가 이웃 세 개의 정답을 모두 돌려준다고 생각했나요?`},explanation:`2.8에서 가까운 세 이웃은 3(A, 거리 0.2), 4(B, 1.2), 5(B, 2.2)예요. B가 두 표라 ['B']예요.`,card:`vote`},{type:`explain`,id:`weights`,title:`가까울수록 큰 표: weights`,body:'기본 설정 `weights="uniform"`은 이웃마다 똑같이 한 표예요. `weights="distance"`로 바꾸면 각 이웃의 표에 1 ÷ 거리만큼 무게를 줘서, 가까운 이웃의 목소리가 커져요. 같은 이웃이라도 무게 방식에 따라 예측이 바뀔 수 있으니, 이웃 수와 무게를 함께 봐야 해요. `KNC(4, …)`처럼 첫 자리에 숫자만 쓰면 n_neighbors예요.',code:`from sklearn.neighbors import KNeighborsClassifier as KNC
X = [[2.0], [4.5], [5.5], [6.5]]
y = ["A", "B", "B", "B"]
for w in ("uniform", "distance"):
    m = KNC(4, weights=w).fit(X, y)
    print(w, m.predict([[2.5]]).tolist())`,trace:["`X = [[2.0], [4.5], [5.5], [6.5]]` → 2.5에서 거리는 0.5, 2.0, 3.0, 4.0이에요",'`y = ["A", "B", "B", "B"]` → 가장 가까운 하나만 A예요','`for w in ("uniform", "distance"):` → 두 무게 방식을 차례로 해 봐요',"`m = KNC(4, weights=w).fit(X, y)` → 이웃 4개, 무게 방식 w로 모델을 만들어요","`print(w, m.predict([[2.5]]).tolist())` → 한 표씩이면 B가 3표, 거리 무게면 A 1 ÷ 0.5 = 2.0 대 B 0.5 + 0.33 + 0.25 ≈ 1.08 → **uniform ['B']** · **distance ['A']**"],output:`uniform ['B']
distance ['A']
`,mistake:'`weights="distance"`에서 먼 이웃이 더 큰 표를 받는다고 생각하기. 무게는 1 ÷ 거리라 가까울수록 커요. 거리가 0인 이웃이 있으면 그 이웃의 정답만 따라요.',in_code:'`KNeighborsClassifier(n_neighbors=7, weights="distance")`처럼 k를 조금 크게 잡고 거리 무게를 켜서, 먼 이웃의 영향을 줄이는 설정을 자주 봐요.'},{type:`example`,id:`theory-ml-neighbors-ex3`,kind:`choice`,title:`거리로 무게를 준 투표`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from sklearn.neighbors import KNeighborsClassifier as KNC
X = [[2.0], [6.0], [7.0]]
y = ["red", "blue", "blue"]
m = KNC(n_neighbors=3, weights="distance")
m.fit(X, y)
print(m.predict([[2.5]]).tolist())`,output:`['red']
`,choices:[`['red']`,`['blue']`,`['red', 'blue', 'blue']`],answer:`['red']`,feedback:{"['blue']":'`weights="distance"`여도 한 표씩 세어 많은 쪽을 고른다고 생각했나요?',"['red', 'blue', 'blue']":`predict가 이웃들의 정답을 가까운 순서로 모두 돌려준다고 생각했나요?`},explanation:`2.5에서 거리는 0.5, 3.5, 4.5예요. red의 무게는 1 ÷ 0.5 = 2.0이고 blue는 약 0.29 + 0.22 = 0.51이라 ['red']예요.`,card:`weights`},{type:`explain`,id:`kneighbors`,title:`이웃이 누구인지 보기: kneighbors`,body:"`kneighbors(새 입력)`은 예측 대신 가까운 이웃을 알려 줘요. (거리 배열, 행 번호 배열) 두 개를 이 순서로 돌려주고, 둘 다 가까운 이웃부터 놓여요. 행 번호는 학습 데이터에서 0부터 센 위치라 정답 글자가 아니고, `return_distance=False`를 주면 행 번호 배열만 돌려줘요. 입력 값이 두 개면 거리는 피타고라스 정리처럼 √(가로 차² + 세로 차²)으로 재고, 셋 이상이면 차의 제곱을 모두 더해 제곱근을 씌워요(유클리드 거리).",code:`from sklearn.neighbors import KNeighborsClassifier as KNC
X = [[5, 6], [2, 5], [2, 1], [6, 2]]
y = ["a", "b", "c", "d"]
m = KNC(n_neighbors=2).fit(X, y)
d, i = m.kneighbors([[2, 2]])
print(d.tolist(), i.tolist())`,trace:["`X = [[5, 6], [2, 5], [2, 1], [6, 2]]` → 값이 두 개인 점 네 개예요",'`y = ["a", "b", "c", "d"]` → 각 점의 정답이에요',"`m = KNC(n_neighbors=2).fit(X, y)` → 이웃 2개를 보는 모델이에요","`d, i = m.kneighbors([[2, 2]])` → (2, 2)에서 네 점까지 거리는 5, 3, 1, 4예요. 가까운 두 개의 거리와 행 번호를 받아요","`print(d.tolist(), i.tolist())` → 가까운 순서로 2번 행(거리 1)과 1번 행(거리 3) → **[[1.0, 3.0]] [[2, 1]]**"],output:`[[1.0, 3.0]] [[2, 1]]
`,mistake:"돌려받는 순서를 (행 번호, 거리)로 읽기. 기본은 거리가 먼저예요. 행 번호만 필요하면 `return_distance=False`를 줘요.",in_code:"추천 기능을 만드는 코드에서 `kneighbors`로 비슷한 상품의 행 번호를 찾은 뒤 `items[i[0]]`처럼 상품 배열에서 꺼내는 줄을 자주 봐요. 번호 배열로 이렇게 꺼내려면 `items`가 NumPy 배열이어야 하고, 보통 리스트면 오류가 나요."},{type:`example`,id:`theory-ml-neighbors-ex4`,kind:`choice`,title:`kneighbors가 돌려준 번호`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from sklearn.neighbors import KNeighborsClassifier as KNC
X = [[10], [40], [25], [31]]
y = ["a", "b", "c", "d"]
m = KNC(n_neighbors=3).fit(X, y)
d, i = m.kneighbors([[30]])
print(i.tolist())`,output:`[[3, 2, 1]]
`,choices:[`[[3, 2, 1]]`,`[[1, 2, 3]]`,`[['d', 'c', 'b']]`,`[[1, 5, 10]]`],answer:`[[3, 2, 1]]`,feedback:{"[[1, 2, 3]]":`행 번호가 작은 순서로 놓인다고 생각했나요?`,"[['d', 'c', 'b']]":`kneighbors가 이웃의 정답을 돌려준다고 생각했나요?`,"[[1, 5, 10]]":`두 번째로 받은 i에 거리가 담긴다고 생각했나요?`},explanation:`30에서 0~3번 행까지의 거리는 20, 10, 5, 1이에요. 가까운 세 이웃의 행 번호를 가까운 순서로 놓아 [[3, 2, 1]]이에요.`,card:`kneighbors`},{type:`explain`,id:`regressor`,title:`숫자를 예측하는 KNeighborsRegressor`,body:'정답이 종류가 아니라 숫자(가격, 기온 등)면 분류 대신 회귀라고 하고, `KNeighborsRegressor`를 써요. 가까운 이웃 k개를 찾는 방법은 같지만, 투표 대신 이웃들의 정답 숫자를 평균 내요. 기본 `weights="uniform"`이면 같은 무게로 평균 내고, `"distance"`면 가까운 이웃에 더 큰 무게를 줘요.',code:`from sklearn.neighbors import KNeighborsRegressor
X = [[1.0], [2.0], [6.0]]
y = [12.0, 20.0, 50.0]
reg = KNeighborsRegressor(n_neighbors=2)
reg.fit(X, y)
print(reg.predict([[1.8]]).tolist())`,trace:["`X = [[1.0], [2.0], [6.0]]` → 학습 입력 세 개예요","`y = [12.0, 20.0, 50.0]` → 각 입력의 정답 숫자예요","`reg = KNeighborsRegressor(n_neighbors=2)` → 이웃 2개의 평균을 내는 회귀 모델이에요","`reg.fit(X, y)` → 학습 데이터를 기억해요","`reg.predict([[1.8]]).tolist()` → 가까운 2.0(정답 20.0)과 1.0(정답 12.0)의 평균 → **[16.0]**"],output:`[16.0]
`,mistake:`회귀에서도 가장 가까운 이웃 하나의 값을 그대로 쓴다고 생각하기. 이웃 k개의 평균이라 20.0이 아니라 16.0이에요.`,in_code:"집값을 예측하는 예제 코드에서 `KNeighborsRegressor`와 다른 회귀 모델을 나란히 학습해 오차를 비교하는 줄을 자주 봐요."},{type:`example`,id:`theory-ml-neighbors-ex5`,kind:`choice`,title:`숫자 정답 예측`,prompt:`아래 코드의 출력값을 고르세요.`,code:`from sklearn.neighbors import KNeighborsRegressor
X = [[1], [3], [4], [9]]
y = [100, 200, 600, 900]
reg = KNeighborsRegressor(n_neighbors=3)
reg.fit(X, y)
print(reg.predict([[3]]).tolist())`,output:`[300.0]
`,choices:[`[300.0]`,`[200.0]`,`[450.0]`,`[400.0]`],answer:`[300.0]`,feedback:{"[200.0]":`거리가 0인 이웃의 값만 쓴다고 생각했나요?`,"[450.0]":`학습 데이터 전체의 평균을 낸다고 생각했나요?`,"[400.0]":`이웃 3개 중 가장 가까운 두 개만 평균 낸다고 생각했나요?`},explanation:`3에서 가까운 세 이웃은 3(정답 200), 4(600), 1(100)이에요. 세 값의 평균 900 ÷ 3 = 300.0이에요.`,card:`regressor`},{type:`summary`,points:["KNN은 `fit`으로 학습 데이터를 기억하고, `predict`에서 가장 가까운 k개 이웃의 정답을 따라요. 입력은 `[[값]]`처럼 행의 리스트예요.",`분류는 이웃마다 한 표씩 다수결이라, k를 바꾸면 예측이 바뀔 수 있어요.`,'`weights="distance"`는 1 ÷ 거리만큼 무게를 줘서 가까운 이웃의 표가 커져요.',"`kneighbors`는 (거리, 행 번호)를 가까운 순서로 돌려주고, `return_distance=False`면 행 번호만 줘요.","`KNeighborsRegressor`는 투표 대신 이웃 정답 숫자의 평균을 내요."]}],covers:{"ml-neighbor-01":[`knn-idea`],"ml-neighbor-02":[`knn-idea`,`vote`,`weights`],"ml-neighbor-indices-20261023":[`kneighbors`],"ml-neighbor-foundation-01":[`knn-idea`],"ml-neighbor-foundation-02":[`vote`],"ml-neighbor-regression-20261019":[`regressor`],"ml-neighbor-weights-20261020":[`weights`]}}]};export{e as default};