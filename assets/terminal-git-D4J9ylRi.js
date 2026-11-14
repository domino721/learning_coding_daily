var e={schema_version:1,track_id:`terminal-git`,lang:`bash`,lessons:[{id:`theory-sh-path`,version:2,concept_id:`sh-path`,title:`위치와 경로`,minutes:16,steps:[{type:`explain`,id:`terminal`,title:`터미널과 지금 위치`,body:"터미널은 글자로 명령을 입력해 컴퓨터를 다루는 창이에요. 한 줄에 명령을 쓰고 Enter를 누르면 셸(명령을 읽고 실행하는 프로그램, 여기서는 bash)이 실행하고, 결과를 바로 아래에 글자로 보여 줘요. 터미널은 늘 폴더 하나를 '지금 위치'(작업 폴더)로 기억하고, 처음에는 내 홈 폴더(`~`)에서 시작해요. `pwd`는 지금 위치를 경로로 보여 주는데, 경로는 맨 위 폴더 `/`부터 폴더 이름을 `/`로 이어 쓴 주소예요. 이 강의 코드의 맨 위 `#` 줄은 실행되지 않는 시작 상태 그림이에요.",code:`# ~/
# ├── music/
# └── study/  ← 지금 위치
pwd`,trace:["`# ~/` → 홈 폴더예요. 이 강의의 홈은 `/home/mina`예요(macOS에서는 `/Users/이름`처럼 보여요)","`# ├── music/`, `# └── study/` → 홈 안에 든 폴더 두 개예요. 이름 끝의 `/`가 폴더라는 표시예요","`← 지금 위치` → 명령을 study 폴더에서 시작한다는 표시예요","`pwd` → 지금 위치를 맨 위 `/`부터 이어 써서 → **/home/mina/study**"],output:`/home/mina/study
`,mistake:"`pwd`가 폴더 이름 study만 보여 줄 거라고 생각하기. `pwd`(print working directory)는 맨 위 `/`부터 이어 쓴 전체 경로를 보여 줘요.",in_code:"AI가 '프로젝트 폴더에서 실행하세요'라고 안내하면, 명령을 실행하기 전에 `pwd`로 지금 위치가 그 폴더인지 먼저 확인해요. 위치가 다르면 같은 명령도 다르게 동작하거나 실패해요."},{type:`example`,id:`theory-sh-path-ex1`,kind:`choice`,title:`사진 폴더에서 시작`,prompt:`아래 명령을 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/
# └── photos/
#     └── trip/  ← 지금 위치
#         └── day1.jpg
pwd`,output:`/home/mina/photos/trip
`,choices:[`trip`,`/home/mina/photos/trip`,`~/photos/trip`,`/home/mina/photos/trip/day1.jpg`],answer:`/home/mina/photos/trip`,feedback:{trip:`pwd가 지금 폴더의 이름만 보여 준다고 생각했나요?`,"~/photos/trip":`pwd가 홈 폴더 부분을 ~로 줄여 보여 준다고 생각했나요?`,"/home/mina/photos/trip/day1.jpg":`pwd가 폴더 안에 든 파일까지 경로에 붙인다고 생각했나요?`},explanation:`← 지금 위치 표시가 trip 폴더에 있으니 명령은 trip에서 시작해요. pwd는 맨 위 /부터 홈(/home/mina), photos, trip을 차례로 이어 /home/mina/photos/trip을 보여 줘요.`,card:`terminal`},{type:`explain`,id:`cd-ls`,title:`cd로 들어가고 ls로 보기`,body:"`cd 폴더`는 지금 위치 안에 있는 그 폴더로 들어가는 명령이에요(change directory). 이동한 위치는 다음 명령에도 그대로 이어지고, 이동이 잘되면 아무것도 출력하지 않아요. `ls`는 지금 위치에 든 파일과 폴더의 이름을 보여 주는데, 그 안쪽 폴더의 내용까지는 보여 주지 않아요. `cd study/week1`처럼 폴더 이름을 `/`로 이으면 여러 단계를 한 번에 들어가요.",code:`# ~/  ← 지금 위치
# ├── music/
# └── study/
#     ├── plan.md
#     └── week1/
ls
cd study
ls
pwd`,trace:["`ls` → 홈 안의 이름만 → **music  study**. study 안의 plan.md는 보이지 않아요","`cd study` → 홈 안의 study로 들어가요. 성공하면 아무것도 출력하지 않아요","`ls` → 바뀐 위치가 이어져 이번에는 study 안 → **plan.md  week1**","`pwd` → **/home/mina/study**"],output:`music  study
plan.md  week1
/home/mina/study
`,mistake:"`cd`로 이동한 위치가 그 줄에서만 쓰이고 다음 명령은 처음 위치에서 실행된다고 생각하기. 위치는 다른 곳으로 `cd`할 때까지 계속 유지돼요.",in_code:"AI가 '`cd my-project` 다음에 실행하세요'라고 두 줄로 안내하는 것은, 첫 줄로 바뀐 위치가 다음 줄까지 이어지기 때문이에요."},{type:`example`,id:`theory-sh-path-ex2`,kind:`choice`,title:`들어간 뒤의 목록`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# ├── photos/
# │   ├── cat.jpg
# │   └── trip/
# └── todo.txt
cd photos
ls`,output:`cat.jpg  trip
`,choices:[`photos  todo.txt`,`cat.jpg  trip`,`photos`,`photos/cat.jpg  photos/trip`],answer:`cat.jpg  trip`,feedback:{"photos  todo.txt":`cd로 들어간 뒤에도 ls가 처음 위치(홈)의 이름을 보여 준다고 생각했나요?`,photos:`ls가 지금 들어가 있는 폴더의 이름을 보여 준다고 생각했나요?`,"photos/cat.jpg  photos/trip":`ls가 이름 앞에 폴더 경로를 붙여 보여 준다고 생각했나요?`},explanation:`cd photos로 지금 위치가 photos로 바뀌고 다음 줄까지 이어져요. 그래서 ls는 photos 안의 이름인 cat.jpg와 trip을 경로 없이 보여 줘요.`,card:`cd-ls`},{type:`explain`,id:`hidden`,title:`숨김 항목과 옵션`,body:"이름이 `.`으로 시작하는 파일과 폴더는 숨김 항목이라 `ls`에 나오지 않아요. 명령 뒤에 `-`로 시작하는 글자를 붙이면 동작이 바뀌는데, 이것을 옵션이라고 해요. `ls -a`의 `-a`는 숨김 항목까지 모두(all) 보여 달라는 옵션이고, 이때 지금 폴더를 뜻하는 `.`과 한 단계 위 폴더를 뜻하는 `..`도 함께 나와요. 이름의 정렬 순서는 시스템 설정에 따라 조금 다를 수 있어요.",code:`# ~/blog/  ← 지금 위치
# ├── .draft
# ├── img/
# └── post.md
ls
ls -a`,trace:["`ls` → .으로 시작하는 .draft는 숨겨서 → **img  post.md**","`ls -a` → 숨김까지 모두 보이고 맨 앞에 `.`과 `..`도 → **.  ..  .draft  img  post.md**"],output:`img  post.md
.  ..  .draft  img  post.md
`,mistake:"파일을 만들었는데 `ls`에 안 보이니 만들어지지 않았다고 생각하기. 이름이 `.`으로 시작하면 숨김이라 `ls -a`로 봐야 보여요.",in_code:"AI가 만들라고 안내하는 `.env`(비밀 설정 파일)나 `.venv`(가상환경 폴더)는 대부분 숨김 항목이에요. 만든 뒤 확인할 때는 `ls -a`를 써요."},{type:`example`,id:`theory-sh-path-ex3`,kind:`choice`,title:`게임 폴더의 숨김 파일`,prompt:`아래 명령을 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/game/  ← 지금 위치
# ├── .save
# └── start.sh
ls -a`,output:`.  ..  .save  start.sh
`,choices:[`.save  start.sh`,`start.sh`,`.  ..  .save  start.sh`,`.  ..  start.sh`],answer:`.  ..  .save  start.sh`,feedback:{".save  start.sh":`ls -a가 지금 폴더(.)와 위 폴더(..)는 빼고 보여 준다고 생각했나요?`,"start.sh":`-a를 붙여도 .으로 시작하는 이름은 계속 숨겨진다고 생각했나요?`,".  ..  start.sh":`-a가 .과 ..만 더 보여 주고 숨김 파일은 그대로 숨긴다고 생각했나요?`},explanation:`-a는 숨김 항목까지 모두 보여 주는 옵션이라 .save가 나와요. 모든 폴더에 들어 있는 .(지금 폴더)과 ..(위 폴더)도 함께 나와요.`,card:`hidden`},{type:`explain`,id:`dots`,title:`점 두 개는 한 단계 위`,body:"경로에서 `.`은 지금 폴더, `..`은 한 단계 위 폴더를 뜻해요. `../..`처럼 이어 쓰면 `..` 하나에 한 단계씩, 두 단계를 올라가요. 이렇게 지금 위치에서 출발해 적는 경로를 상대 경로라고 하고, `ls ..`처럼 `ls` 뒤에 경로를 주면 이동하지 않고 그 폴더의 내용만 보여 줘요. `cd -`는 위로 가는 게 아니라 바로 전에 있던 위치로 돌아가고, 돌아간 경로를 한 줄 출력해요.",code:`# ~/
# └── study/
#     └── week1/  ← 지금 위치
#         └── memo.md
ls ..
cd ../..
pwd
cd -`,trace:["`ls ..` → 이동하지 않고 한 단계 위인 study의 내용을 보여 줘요 → **week1**","`cd ../..` → week1에서 study로, study에서 홈으로 두 단계 올라가요","`pwd` → **/home/mina**","`cd -` → 바로 전 위치인 week1로 돌아가며 그 경로를 출력해요 → **/home/mina/study/week1**"],output:`week1
/home/mina
/home/mina/study/week1
`,mistake:"`../..`을 한 단계 위로 읽기. `..`이 두 번이라 두 단계를 올라가요. 경로 속 `..`은 하나씩 세어요.",in_code:"AI가 쓴 안내의 `cd ..`은 '한 단계 위로', `cd -`는 '방금 있던 곳으로'예요. 두 폴더를 오가며 작업할 때 `cd -`를 자주 써요."},{type:`example`,id:`theory-sh-path-ex4`,kind:`choice`,title:`두 단계 올라가기`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/
# └── study/
#     └── week1/
#         └── day2/  ← 지금 위치
cd ../..
pwd`,output:`/home/mina/study
`,choices:[`/home/mina/study/week1`,`/home/mina/study`,`/home/mina`,`/home/mina/study/week1/day2`],answer:`/home/mina/study`,feedback:{"/home/mina/study/week1":`../..이 ..처럼 한 단계만 올라간다고 생각했나요?`,"/home/mina":`../..이 몇 단계든 홈 폴더까지 한 번에 올라간다고 생각했나요?`,"/home/mina/study/week1/day2":`..이 위 폴더가 아니라 지금 폴더를 뜻한다고 생각했나요?`},explanation:`첫 ..으로 day2에서 week1로, 둘째 ..으로 week1에서 study로 올라가요. 그래서 pwd는 /home/mina/study를 보여 줘요.`,card:`dots`},{type:`explain`,id:`absolute`,title:`어디서나 같은 경로`,body:"`/`로 시작하는 경로는 맨 위 폴더부터 적은 절대 경로라서, 어디서 실행해도 같은 곳을 가리켜요. `~`는 홈 폴더를 줄여 쓴 표기라 `~/study`도 어디서나 같은 곳이에요. 반대로 `study`나 `../study` 같은 상대 경로는 지금 위치에서 출발하므로, 위치가 바뀌면 가리키는 곳도 바뀌어요. 지금 위치에서 찾을 수 없는 폴더로 `cd`하면 'No such file or directory'(그런 파일이나 폴더가 없음) 오류가 나고 위치는 그대로예요.",code:`# ~/
# ├── music/  ← 지금 위치
# └── study/
#     └── week1/
cd study
cd ~/study
pwd
cd /home/mina/study/week1
pwd`,trace:["`cd study` → music 안에는 study가 없어 실패 → **bash: cd: study: No such file or directory**. 위치는 music 그대로예요","`cd ~/study` → 홈에서 출발하는 경로라 music에서도 찾아가요","`pwd` → **/home/mina/study**","`cd /home/mina/study/week1` → 맨 위에서 출발하는 절대 경로라 어디서든 같은 곳이에요","`pwd` → **/home/mina/study/week1**"],output:`bash: cd: study: No such file or directory
/home/mina/study
/home/mina/study/week1
`,mistake:"다른 폴더에서 쓰던 `cd study`를 아무 데서나 쓰기. 상대 경로는 지금 위치 안에서 찾으므로 위치가 다르면 같은 명령도 실패해요.",in_code:"AI가 알려 준 `cd` 명령이 'No such file or directory'를 내면, 그 경로가 어느 위치를 기준으로 쓰였는지부터 봐요. 어디서 실행할지 모르는 안내문에는 `~/`나 `/`로 시작하는 경로가 안전해요. macOS 기본 셸인 zsh에서는 같은 오류가 `cd: no such file or directory: study`처럼 조금 다르게 보이고, 뒤 강의의 몇몇 규칙은 결과까지 달라요. 이 강의대로 따라 해 보려면 터미널에 먼저 `bash`를 입력해 bash로 바꿔요(돌아갈 때는 `exit`)."},{type:`example`,id:`theory-sh-path-ex5`,kind:`line`,title:`오류가 나는 이동`,prompt:`아래 명령 중 No such file or directory 오류를 출력하는 줄을 고르세요.`,code:`# ~/
# ├── music/
# │   └── jazz/
# └── study/  ← 지금 위치
cd music
cd ~/music
cd jazz
cd ../jazz`,output:`bash: cd: music: No such file or directory
`,choices:[`5`,`6`,`7`,`8`],answer:`5`,check:{type:`prints`,target:`bash: cd: music: No such file or directory`},feedback:{6:`~/music도 지금 위치(study) 안에서 찾는 경로라고 생각했나요?`,7:`앞 줄의 이동이 이어지지 않아 cd jazz를 study 안에서 찾는다고 생각했나요?`,8:`..으로 올라간 다음에는 다시 아래 폴더로 내려가는 경로를 쓸 수 없다고 생각했나요?`},explanation:`5번 줄의 music은 지금 위치(study) 안에서 찾는 상대 경로라 실패해요. 6번 줄의 ~/music은 홈에서 출발해 성공하고, 그 위치가 이어져 7번 줄의 jazz도 찾아요. 8번 줄은 jazz에서 music으로 올라갔다가 다시 jazz로 내려와 성공해요.`,card:`absolute`},{type:`explain`,id:`home-quote`,title:`따옴표 안의 ~와 $HOME`,body:'`echo`는 뒤에 쓴 글자를 화면에 그대로 보여 주는 명령이라, 셸이 무엇을 무엇으로 바꾸는지 확인할 때 좋아요. `~`는 따옴표 밖에 있을 때만 홈 경로로 바뀌어요. `$HOME`은 홈 경로를 담아 둔 변수(이름을 붙여 저장해 둔 값)인데, 큰따옴표 `"…"` 안에서는 값으로 바뀌고 작은따옴표 `\'…\'` 안에서는 글자 그대로 남아요. 그래서 경로를 따옴표로 감쌀 때는 `"$HOME/study"`처럼 써요.',code:`# ~/  ← 지금 위치
echo ~
echo "~"
echo "$HOME"
echo '$HOME'`,trace:["`echo ~` → 따옴표 밖의 ~는 홈 경로로 바뀌어 → **/home/mina**",'`echo "~"` → 따옴표 안의 ~는 보통 글자 → **~**','`echo "$HOME"` → 큰따옴표 안의 변수는 값으로 바뀌어 → **/home/mina**',"`echo '$HOME'` → 작은따옴표 안은 모두 글자 그대로 → **$HOME**"],output:`/home/mina
~
/home/mina
$HOME
`,mistake:'`cd "~/study"`처럼 ~를 따옴표 안에 넣기. ~라는 이름의 폴더를 찾다가 \'No such file or directory\'가 나요. 따옴표가 필요하면 `"$HOME/study"`로 써요.',in_code:'AI가 쓴 스크립트에서 `cd "$HOME/projects"`처럼 `$HOME`을 큰따옴표로 감싼 줄을 자주 봐요. 폴더 이름에 띄어쓰기가 있어도 한 경로로 넘기려는 거예요(띄어쓰기와 따옴표는 다음 강의에서 더 배워요).'},{type:`example`,id:`theory-sh-path-ex6`,kind:`choice`,title:`작은따옴표로 감싼 경로`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/
# ├── music/
# └── study/  ← 지금 위치
cd '~/music'
pwd`,output:`bash: cd: ~/music: No such file or directory
/home/mina/study
`,choices:[`/home/mina/music`,`bash: cd: ~/music: No such file or directory
/home/mina/study`,`bash: cd: ~/music: No such file or directory
/home/mina/music`,`bash: cd: /home/mina/music: No such file or directory
/home/mina/study`],answer:`bash: cd: ~/music: No such file or directory
/home/mina/study`,feedback:{"/home/mina/music":`작은따옴표 안의 ~도 홈 경로로 바뀐다고 생각했나요?`,"bash: cd: ~/music: No such file or directory\n/home/mina/music":`cd가 실패해도 위치는 그 폴더로 바뀐다고 생각했나요?`,"bash: cd: /home/mina/music: No such file or directory\n/home/mina/study":`~가 홈 경로로 바뀐 뒤에 폴더를 찾지 못했다고 생각했나요?`},explanation:`따옴표 안의 ~는 홈으로 바뀌지 않아서 cd는 ~라는 이름의 폴더를 찾다가 실패해요. 실패한 cd는 위치를 바꾸지 않으니 pwd는 처음 위치인 /home/mina/study를 보여 줘요.`,card:`home-quote`},{type:`summary`,points:["터미널은 지금 위치(작업 폴더)를 기억하고, `pwd`는 그 위치를 맨 위 `/`부터 이어 쓴 전체 경로로 보여 줘요.","`cd 폴더`로 바뀐 위치는 다음 명령에도 이어지고, `ls`는 지금 위치나 뒤에 준 폴더 안에 든 이름만 보여 줘요.","`.`으로 시작하는 숨김 항목은 `ls -a`로 보고, 이때 `.`(지금 폴더)과 `..`(한 단계 위)도 나와요.","`..`은 하나에 한 단계씩 올라가고, `cd -`는 바로 전 위치로 돌아가며 그 경로를 출력해요.","`/`나 `~`로 시작하는 경로는 어디서나 같고, 상대 경로는 지금 위치에 따라 뜻이 바뀌어요.","`~`는 따옴표 밖에서만 홈이 되고, `$HOME`은 큰따옴표 안에서는 바뀌지만 작은따옴표 안에서는 글자 그대로예요."]}],covers:{"sh-path-01":[`terminal`,`cd-ls`],"sh-path-02":[`hidden`],"sh-path-03":[`dots`,`absolute`],"sh-path-04":[`dots`,`cd-ls`],"sh-path-05":[`absolute`,`dots`],"sh-path-06":[`dots`],"sh-path-07":[`home-quote`,`absolute`]}},{id:`theory-sh-words`,version:2,concept_id:`sh-words`,title:`띄어쓰기·따옴표·*`,minutes:16,steps:[{type:`explain`,id:`words`,title:`셸은 줄을 단어로 나눠요`,body:"셸은 명령 줄을 실행하기 전에 띄어쓰기를 기준으로 단어로 나눠요. 첫 단어는 실행할 명령이고, 나머지는 그 명령에 넘기는 인자(명령이 받는 값)예요. 띄어쓰기가 여러 칸이어도 단어를 나누는 역할만 하고 사라지지만, 따옴표로 감싼 부분은 칸이 있어도 한 단어가 되고 따옴표 자체는 셸이 지운 뒤 넘겨요. `printf '[%s]\\n' …`은 받은 인자를 하나씩 `[ ]`로 감싸 한 줄에 하나씩 보여 줘서, 단어가 어떻게 나뉘었는지 보기 좋아요.",code:`# ~/  ← 지금 위치
printf '[%s]\\n' 오늘 할 일
printf '[%s]\\n' "오늘 할" 일
echo 오늘   할 일
echo "오늘   할 일"`,trace:["`printf '[%s]\\n' 오늘 할 일` → 띄어쓰기로 나뉜 인자 세 개 → **[오늘]**, **[할]**, **[일]**",`\`printf '[%s]\\n' "오늘 할" 일\` → 따옴표가 오늘 할을 한 인자로 묶어 → **[오늘 할]**, **[일]**`,"`echo 오늘   할 일`(칸을 여러 개 띄운 줄) → 여러 칸은 사라지고 단어 셋을 echo가 한 칸씩 띄워 → **오늘 할 일**",'`echo "오늘   할 일"` → 따옴표가 칸까지 한 단어로 묶어 넘기니, 실행 결과 마지막 줄처럼 칸이 그대로 남아요'],output:`[오늘]
[할]
[일]
[오늘 할]
[일]
오늘 할 일
오늘   할 일
`,compare:`exact`,mistake:'AI가 준 명령에서 따옴표가 거추장스럽다고 지우기. `"월간 보고"`의 따옴표를 지우면 월간과 보고 두 단어가 되고, 칸 여러 개도 하나로 줄어요.',in_code:'AI가 주는 `git commit -m "첫 화면 수정"`처럼 띄어쓰기가 있는 값은 따옴표로 묶여 있어요. 따옴표가 있어야 첫 화면 수정 전체가 인자 하나로 넘어가요.'},{type:`example`,id:`theory-sh-words-ex1`,kind:`choice`,title:`묶인 단어 세기`,prompt:`아래 명령을 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
printf '[%s]\\n' "아침 운동" 저녁 독서`,output:`[아침 운동]
[저녁]
[독서]
`,choices:[`[아침 운동]
[저녁 독서]`,`[아침]
[운동]
[저녁]
[독서]`,`[아침 운동]
[저녁]
[독서]`,`["아침 운동"]
[저녁]
[독서]`],answer:`[아침 운동]
[저녁]
[독서]`,feedback:{"[아침 운동]\n[저녁 독서]":`따옴표 뒤에 이어진 단어들도 하나로 묶인다고 생각했나요?`,"[아침]\n[운동]\n[저녁]\n[독서]":`따옴표 안의 띄어쓰기도 단어를 나눈다고 생각했나요?`,'["아침 운동"]\n[저녁]\n[독서]':`셸이 따옴표를 지우지 않고 그대로 넘긴다고 생각했나요?`},explanation:`따옴표로 묶은 아침 운동은 인자 하나이고, 따옴표 밖의 저녁과 독서는 띄어쓰기에서 나뉘어 각각 인자가 돼요. 따옴표는 셸이 지운 뒤 넘기니 [ ] 안에 보이지 않아요.`,card:`words`},{type:`explain`,id:`space-names`,title:`이름에 칸이 있는 파일`,body:"`cat 파일`은 파일의 내용을 화면에 출력하는 명령이에요. 파일 이름에 띄어쓰기가 있는데 따옴표 없이 쓰면, 셸이 이름을 두 단어로 나눠 `cat`이 파일 두 개를 찾아요. 그런 파일은 없으니 나뉜 조각마다 'No such file or directory' 오류가 나와요. 이름을 `\"…\"`로 감싸거나 띄어쓰기 앞에 `\\`를 붙이면 한 이름으로 넘어가요. `cp`(복사)나 `mv`(옮기기·이름 바꾸기)처럼 파일 이름을 받는 다른 명령도 모두 같은 규칙이에요(다음 강의).",code:`# ~/recipe/  ← 지금 위치
# └── kimchi stew.txt
# kimchi stew.txt 내용:
#   돼지고기 200g
cat kimchi stew.txt
cat "kimchi stew.txt"
cat kimchi\\ stew.txt`,trace:["`# kimchi stew.txt 내용:` 아래 줄 → 그 파일에 든 내용이에요. 이 파일에는 돼지고기 200g 한 줄이 있어요","`cat kimchi stew.txt` → kimchi와 stew.txt 두 이름으로 나뉘어 → **cat: kimchi: No such file or directory**, **cat: stew.txt: No such file or directory**",'`cat "kimchi stew.txt"` → 한 이름으로 넘어가 → **돼지고기 200g**',"`cat kimchi\\ stew.txt` → `\\` 바로 뒤의 칸이 보통 글자가 되어 같은 결과 → **돼지고기 200g**"],output:`cat: kimchi: No such file or directory
cat: stew.txt: No such file or directory
돼지고기 200g
돼지고기 200g
`,mistake:`오류 메시지의 kimchi를 보고 그런 파일이 없다고만 생각하기. 이름이 잘려 보이면 띄어쓰기에서 이름이 나뉘었다는 신호예요.`,in_code:'AI가 준 명령을 내 파일에 쓸 때 이름에 띄어쓰기가 있으면 `"My Report.txt"`처럼 따옴표로 감싸요. 터미널에서 이름 앞부분을 치고 Tab 키를 누르면 셸이 `My\\ Report.txt`처럼 `\\`까지 붙여 이름을 채워 줘요.'},{type:`example`,id:`theory-sh-words-ex2`,kind:`line`,title:`가사 파일 열기`,prompt:`아래 명령 중 가사 첫 줄을 출력하는 줄을 고르세요.`,code:`# ~/music/  ← 지금 위치
# └── my song.txt
# my song.txt 내용:
#   가사 첫 줄
cat my song.txt
cat "my" "song.txt"
cat 'my song.txt'
cat my\\song.txt`,output:`cat: my: No such file or directory
cat: song.txt: No such file or directory
cat: my: No such file or directory
cat: song.txt: No such file or directory
가사 첫 줄
cat: mysong.txt: No such file or directory
`,choices:[`5`,`6`,`7`,`8`],answer:`7`,check:{type:`prints`,target:`가사 첫 줄`},feedback:{5:`cat이 띄어쓰기에서 나뉜 조각을 다시 한 이름으로 이어 준다고 생각했나요?`,6:`단어마다 따로 따옴표를 쳐도 한 이름으로 묶인다고 생각했나요?`,8:`\\가 띄어쓰기 대신 들어가도 칸이 있는 이름이 된다고 생각했나요?`},explanation:`7번 줄은 작은따옴표가 my song.txt를 한 이름으로 묶어요. 5번과 6번 줄은 my와 song.txt 두 이름이 되고, 8번 줄의 \\는 바로 뒤 글자 s를 보통 글자로 만들 뿐이라 mysong.txt를 찾아요.`,card:`space-names`},{type:`explain`,id:`glob`,title:`*는 실행 전에 이름으로 바뀌어요`,body:"`*`는 '아무 글자나 몇 개든'을 뜻하는 와일드카드(여러 이름에 맞는 패턴 글자)예요. 셸은 명령을 실행하기 전에 `*.md` 같은 패턴을 지금 위치에서 맞는 파일 이름들로 바꿔, 이름 순서대로 명령에 넘겨요(`.`으로 시작하는 숨김 항목에는 `*`가 맞지 않아요). `b*`처럼 앞글자를 붙이면 b로 시작하는 모든 이름을 골라요. 따옴표로 감싼 `\"*.md\"`는 바뀌지 않고 글자 그대로 넘어가요. `mv x.log y.log old/`처럼 이름을 여러 개 주면 마지막 폴더로 모두 옮기는데(다음 강의), `mv *.log old/`는 그 이름 목록을 셸이 대신 만들어 넘기는 셈이에요.",code:`# ~/notes/  ← 지금 위치
# ├── book.md
# ├── bus.txt
# └── cafe.md
echo *.md
echo b*
echo "*.md"`,trace:["`echo *.md` → 실행 전에 .md로 끝나는 이름들로 바뀌어 → **book.md cafe.md**","`echo b*` → b로 시작하는 이름이 확장자와 상관없이 모두 → **book.md bus.txt**",'`echo "*.md"` → 따옴표 안이라 바뀌지 않고 → `*.md`'],output:`book.md cafe.md
book.md bus.txt
*.md
`,mistake:"`b*`가 b로 시작하는 .md 파일만 고른다고 생각하기. `*`는 점과 확장자까지 어떤 글자에도 맞아서 bus.txt도 골라요.",in_code:"AI가 주는 `rm *.tmp`(`rm`은 파일을 지우는 명령, 다음 강의) 같은 명령은 실행하는 순간 지금 위치의 이름들로 펼쳐져요. 이름 앞에 `./`(지금 폴더)를 붙인 `./a.tmp`도 `a.tmp`와 같은 파일이에요. 실행 전에 같은 패턴을 `echo *.tmp`로 찍어 보면 대상이 미리 보여요."},{type:`example`,id:`theory-sh-words-ex3`,kind:`choice`,title:`고양이 사진만`,prompt:`아래 명령을 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/pics/  ← 지금 위치
# ├── cat1.png
# ├── cat2.jpg
# └── dog.png
echo cat*.png`,output:`cat1.png
`,choices:[`cat1.png`,`cat1.png cat2.jpg`,`cat1.png dog.png`,`cat*.png`],answer:`cat1.png`,feedback:{"cat1.png cat2.jpg":`cat*.png가 cat으로 시작하기만 하면 확장자와 상관없이 고른다고 생각했나요?`,"cat1.png dog.png":`뒤의 .png만 보고 .png 파일을 모두 고른다고 생각했나요?`,"cat*.png":`따옴표가 없어도 echo가 패턴을 글자 그대로 보여 준다고 생각했나요?`},explanation:`cat*.png는 cat으로 시작하고 .png로 끝나는 이름에만 맞아요. cat2.jpg는 끝이, dog.png는 시작이 달라서 cat1.png 하나로 바뀌어요.`,card:`glob`},{type:`explain`,id:`brace`,title:`중괄호는 여러 단어로 펼쳐져요`,body:"`{a,b}`처럼 중괄호 안에 쉼표로 늘어놓으면, 셸이 실행 전에 그 개수만큼 단어를 만들어요. `day{1,2}`는 `day1 day2` 두 단어가 되고, 쓴 순서 그대로예요. `*`와 달리 그 이름의 파일이 실제로 있는지 보지 않고 글자만 만들며, 따옴표 안의 중괄호는 펼쳐지지 않아요. `mkdir -p`는 폴더를 만들면서 중간 폴더가 없으면 함께 만들어 줘요.",code:`# ~/trip/  ← 지금 위치
echo day{1,2,3}
echo photo{,.bak}
mkdir -p pics/{sea,mountain}
ls pics`,trace:["`echo day{1,2,3}` → 세 단어로 펼쳐져 → **day1 day2 day3**","`echo photo{,.bak}` → 쉼표 앞이 비어 있어 아무것도 붙이지 않은 것과 .bak을 붙인 것 두 개라 → **photo photo.bak**","`mkdir -p pics/{sea,mountain}` → pics/sea와 pics/mountain 두 단어가 되고, 없던 pics까지 함께 만들어요","`ls pics` → **mountain  sea**"],output:`day1 day2 day3
photo photo.bak
mountain  sea
`,mistake:'`mkdir -p "pics/{sea,mountain}"`처럼 따옴표로 감싸기. 펼쳐지지 않아서 중괄호와 쉼표가 이름에 그대로 든 폴더 하나가 생겨요.',in_code:"AI가 주는 `cp config.yaml{,.bak}`은 `cp config.yaml config.yaml.bak`과 같아서, 원본 옆에 사본을 만드는 짧은 표기예요(`cp`는 다음 강의)."},{type:`example`,id:`theory-sh-words-ex4`,kind:`choice`,title:`있는 파일, 없는 파일`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/box/  ← 지금 위치
# └── red.css
echo {red,blue}.css
echo *.css`,output:`red.css blue.css
red.css
`,choices:[`red.css blue.css
red.css`,`red.css
red.css`,`blue.css red.css
red.css`,`{red,blue}.css
red.css`],answer:`red.css blue.css
red.css`,feedback:{"red.css\nred.css":`중괄호도 *처럼 실제로 있는 파일 이름만 남긴다고 생각했나요?`,"blue.css red.css\nred.css":`중괄호가 만든 단어도 *처럼 이름순으로 정렬된다고 생각했나요?`,"{red,blue}.css\nred.css":`따옴표가 없어도 중괄호는 글자 그대로 나온다고 생각했나요?`},explanation:`중괄호는 파일이 있는지 보지 않고 쓴 순서대로 red.css와 blue.css를 만들어요. *.css는 실제로 있는 파일에만 맞아서 red.css 하나로 바뀌어요.`,card:`brace`},{type:`explain`,id:`var-split`,title:`변수는 큰따옴표로 감싸요`,body:'`이름=값`처럼 쓰면 값을 변수에 담고, `$이름`으로 꺼내 써요. 큰따옴표 안의 `$doc`도 값으로 바뀌어요. 그런데 따옴표 없이 쓴 `$doc`는 값으로 바뀐 뒤 띄어쓰기에서 다시 단어로 나뉘어요. 그래서 칸이 있을 수 있는 파일 이름은 `"$doc"`처럼 큰따옴표로 감싸서 넘겨요.',code:`# ~/memo/  ← 지금 위치
# └── my list.txt
# my list.txt 내용:
#   우유
doc="my list.txt"
echo "파일: $doc"
cat $doc
cat "$doc"`,trace:['`doc="my list.txt"` → doc에 칸이 있는 이름을 통째로 담아요. 출력은 없어요','`echo "파일: $doc"` → 큰따옴표 안의 $doc가 값으로 바뀌어 → **파일: my list.txt**',"`cat $doc` → 값으로 바뀐 뒤 칸에서 다시 나뉘어 my와 list.txt 두 이름 → 오류 두 줄",'`cat "$doc"` → 한 이름 그대로 넘어가 → **우유**'],output:`파일: my list.txt
cat: my: No such file or directory
cat: list.txt: No such file or directory
우유
`,mistake:"담을 때 따옴표로 감쌌으니 `cat $doc`도 한 이름일 거라고 생각하기. 담을 때의 따옴표는 그때 쓰이고 사라져서, 꺼낼 때 다시 감싸야 해요.",in_code:'AI가 쓴 스크립트에서 `cp "$src" "$dst"`처럼 변수마다 큰따옴표를 두른 줄을 자주 봐요. 칸이 있는 이름이 들어와도 한 이름으로 넘기려는 습관이에요.'},{type:`example`,id:`theory-sh-words-ex5`,kind:`line`,title:`요일 두 개`,prompt:`아래 명령 중 [월 화] 한 줄을 출력하는 줄을 고르세요.`,code:`# ~/  ← 지금 위치
day="월 화"
printf '[%s]\\n' $day
printf '[%s]\\n' "$day"
printf '[%s]\\n' '$day'`,output:`[월]
[화]
[월 화]
[$day]
`,choices:[`3`,`4`,`5`],answer:`4`,check:{type:`prints`,target:`[월 화]`},feedback:{3:`따옴표 없는 $day도 담긴 값 그대로 한 단어로 넘어간다고 생각했나요?`,5:`작은따옴표 안의 $day도 값으로 바뀐다고 생각했나요?`},explanation:`3번 줄의 $day는 값으로 바뀐 뒤 칸에서 나뉘어 [월]과 [화] 두 줄이 돼요. 5번 줄은 작은따옴표 안이라 [$day]가 나오고, 큰따옴표로 감싼 4번 줄만 [월 화]를 출력해요.`,card:`var-split`},{type:`explain`,id:`for-loop`,title:`목록의 이름마다 되풀이하기`,body:'`for f in 목록; do 명령; done`은 목록의 값을 하나씩 f에 담아 `do`와 `done` 사이의 명령을 되풀이해요. 목록에 `*.md`를 쓰면 파일 이름이 칸이 있어도 한 값씩 그대로 f에 들어가요. 나뉘는 건 꺼내 쓸 때라서, 반복 안에서도 `"$f"`처럼 감싸요. 여러 줄로 쓰거나 `;`로 이어 한 줄로 써도 뜻은 같아요.',code:`# ~/memo/  ← 지금 위치
# ├── buy.md
# └── my list.md
for f in *.md; do
  echo "[$f]"
done`,trace:["`for f in *.md; do` → `*.md`가 buy.md와 my list.md로 바뀌고, 첫 값 buy.md를 f에 담아요",'`echo "[$f]"` → **[buy.md]**, 두 번째 차례에는 **[my list.md]**',"`done` → 반복의 끝이에요. 남은 값이 있으면 `do`로 돌아가요"],output:`[buy.md]
[my list.md]
`,mistake:"`for f in *.md`에서 이미 이름이 칸마다 나뉜다고 생각하기. `*`가 펼친 이름은 칸이 있어도 한 값이에요. 나뉘는 건 따옴표 없이 `$f`를 쓸 때예요.",in_code:'AI가 주는 `for f in *.md; do echo "$f"; done` 같은 한 줄 반복도 같은 뜻이에요. 줄바꿈 자리에 `;`를 넣었을 뿐이에요.'},{type:`example`,id:`theory-sh-words-ex6`,kind:`choice`,title:`동아리 파일 목록`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/class/  ← 지금 위치
# ├── art club.csv
# └── math.csv
for n in *.csv; do
  printf '[%s]\\n' $n
done`,output:`[art]
[club.csv]
[math.csv]
`,choices:[`[art club.csv]
[math.csv]`,`[art]
[club.csv]
[math.csv]`,`[art club.csv math.csv]`,`[*.csv]`],answer:`[art]
[club.csv]
[math.csv]`,feedback:{"[art club.csv]\n[math.csv]":`반복 안에서 따옴표 없이 쓴 $n도 이름 하나로 넘어간다고 생각했나요?`,"[art club.csv math.csv]":`for가 목록 전체를 한 번에 n에 담는다고 생각했나요?`,"[*.csv]":`for의 목록에 쓴 *.csv가 펼쳐지지 않고 글자 그대로 들어간다고 생각했나요?`},explanation:`*.csv는 art club.csv와 math.csv 두 값으로 펼쳐져 반복이 두 번 돌아요. 그런데 따옴표 없는 $n은 첫 차례에 칸에서 다시 나뉘어 [art]와 [club.csv] 두 줄이 되고, 둘째 차례는 [math.csv]예요.`,card:`for-loop`},{type:`summary`,points:[`셸은 줄을 띄어쓰기로 나눠 첫 단어는 명령, 나머지는 인자로 넘기고, 여러 칸은 한 칸처럼 사라져요.`,'따옴표로 감싼 부분은 칸이 있어도 한 단어이고 따옴표는 지워진 뒤 넘어가요. 칸이 있는 이름은 `"…"`나 `\\ `로 지켜요.',"`*`는 실행 전에 지금 위치의 맞는 이름들로 바뀌고(이름순), 따옴표 안에서는 그대로예요.","`{a,b}`는 파일이 있든 없든 쓴 순서대로 단어를 만들어요.",'따옴표 없는 `$이름`은 값이 칸에서 다시 나뉘니 변수는 `"$이름"`으로 감싸요. `for`의 목록에서 펼친 이름은 한 값씩 들어가요.']}],covers:{"sh-words-01":[`words`],"sh-words-02":[`glob`],"sh-words-03":[`space-names`,`words`],"sh-words-04":[`glob`,`space-names`],"sh-words-05":[`brace`],"sh-words-06":[`for-loop`,`var-split`]}},{id:`theory-sh-files`,version:1,concept_id:`sh-files`,title:`파일과 폴더 다루기`,minutes:15,steps:[{type:`explain`,id:`mkdir-cp`,title:`폴더 만들고 사본 넣기`,body:"`mkdir 이름`은 지금 위치에 빈 폴더를 만들어요(make directory). `cp 원본 대상`은 원본의 사본을 만들고(copy) 원본은 그대로 둬요. 대상이 이미 있는 폴더면 그 안에 같은 이름의 사본이 들어가고, 없는 이름이면 그 이름의 새 파일이 생겨요. `ls`는 이름만 보여 줄 뿐 경로를 붙이지 않아요.",code:`# ~/diary/  ← 지금 위치
# └── mon.txt
cp mon.txt tue.txt
mkdir old
cp mon.txt old/
ls
ls old`,trace:["`cp mon.txt tue.txt` → tue.txt라는 이름은 없으니 그 이름의 사본이 새로 생겨요","`mkdir old` → 빈 폴더 old를 만들어요","`cp mon.txt old/` → old는 있는 폴더라 그 안에 mon.txt 사본이 들어가요. 끝의 `/`는 '폴더 안으로'라는 표시예요","`ls` → 원본도 그대로라 → **mon.txt  old  tue.txt**","`ls old` → **mon.txt**"],output:`mon.txt  old  tue.txt
mon.txt
`,mistake:"`cp`를 하면 원본이 옮겨 간다고 생각하기. 사본을 만들 뿐이라 원본도 그대로 남아요. 원본을 옮기는 명령은 `mv`예요.",in_code:"AI가 설정 파일을 고치기 전에 `cp settings.json settings.json.bak`처럼 사본부터 만들라고 하는 줄을 자주 봐요. 잘못되면 사본으로 되돌릴 수 있어요."},{type:`example`,id:`theory-sh-files-ex1`,kind:`choice`,title:`국 레시피 복사`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/cook/  ← 지금 위치
# ├── menu/
# └── soup.txt
cp soup.txt menu
cp soup.txt rice.txt
ls
ls menu`,output:`menu  rice.txt  soup.txt
soup.txt
`,choices:[`menu  rice.txt
soup.txt`,`menu  rice.txt  soup.txt
soup.txt`,`menu  rice.txt  soup.txt
rice.txt  soup.txt`,`menu  rice.txt  soup.txt
menu/soup.txt`],answer:`menu  rice.txt  soup.txt
soup.txt`,feedback:{"menu  rice.txt\nsoup.txt":`cp가 원본을 옮겨서 soup.txt가 지금 위치에서 사라진다고 생각했나요?`,"menu  rice.txt  soup.txt\nrice.txt  soup.txt":`두 번째 cp도 앞에서 쓴 menu 폴더 안에 사본을 만든다고 생각했나요?`,"menu  rice.txt  soup.txt\nmenu/soup.txt":`ls가 폴더 안의 이름에 폴더 경로를 붙여 보여 준다고 생각했나요?`},explanation:`menu는 있는 폴더라 첫 cp는 그 안에 soup.txt 사본을 넣고, rice.txt는 없는 이름이라 지금 위치에 새 사본이 생겨요. 원본은 그대로 남으니 지금 위치에는 세 이름이, menu 안에는 soup.txt가 있어요.`,card:`mkdir-cp`},{type:`explain`,id:`mv`,title:`mv는 옮기거나 이름을 바꿔요`,body:"`mv 원본 대상`은 원본을 옮기고(move) 원래 자리에는 남기지 않아요. 대상이 이미 있는 폴더면 그 안으로 옮기고, 없는 이름이면 그 이름으로 바꿔요. 폴더도 같은 규칙이라, 이미 있는 폴더를 대상으로 주면 두 폴더가 합쳐지지 않고 그 안으로 폴더째 들어가요. `mv a.txt b.txt docs/`처럼 여러 개를 주면 마지막 폴더로 모두 옮겨요.",code:`# ~/pics/  ← 지금 위치
# ├── album/
# └── raw/
#     └── img1.png
mv raw/img1.png sea.png
mv raw album
ls
ls album`,trace:["`mv raw/img1.png sea.png` → sea.png는 없는 이름이라, raw 안의 img1.png가 지금 위치로 오면서 이름이 sea.png로 바뀌어요","`mv raw album` → album은 있는 폴더라 raw가 폴더째 album 안으로 들어가요","`ls` → raw는 옮겨져 사라졌어요 → **album  sea.png**","`ls album` → **raw**"],output:`album  sea.png
raw
`,mistake:"`mv raw album`이 두 폴더의 내용을 합친다고 생각하기. album이 이미 있으면 raw가 그 안에 들어가 album/raw가 돼요. 안의 파일만 옮기려면 `mv raw/* album/`처럼 써요.",in_code:"AI가 주는 `mv old_name.py new_name.py`는 이름 바꾸기, `mv report.pdf docs/`는 폴더로 옮기기예요. 마지막 이름이 폴더로 있는지 `ls`로 먼저 확인하면 헷갈리지 않아요."},{type:`example`,id:`theory-sh-files-ex2`,kind:`choice`,title:`끝낸 일 정리`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/work/  ← 지금 위치
# ├── done/
# └── task.txt
mv task.txt done
mv done finished
ls
ls finished`,output:`finished
task.txt
`,choices:[`finished  task.txt
task.txt`,`done  finished
task.txt`,`finished
task.txt`,`finished
done`],answer:`finished
task.txt`,feedback:{"finished  task.txt\ntask.txt":`mv가 원본을 남기고 사본을 옮긴다고 생각했나요?`,"done  finished\ntask.txt":`폴더를 새 이름으로 mv하면 원래 폴더도 남는다고 생각했나요?`,"finished\ndone":`없는 이름 finished로 mv하면 done이 그 이름의 새 폴더 안으로 들어간다고 생각했나요?`},explanation:`done은 있는 폴더라 task.txt가 그 안으로 옮겨져요. finished는 없는 이름이라 done 폴더의 이름이 finished로 바뀌고, 안의 task.txt도 함께 따라가요.`,card:`mv`},{type:`explain`,id:`overwrite`,title:`같은 이름은 묻지 않고 덮어써요`,body:"`cp`와 `mv`는 대상 자리에 같은 이름의 파일이 이미 있으면 확인 없이 덮어쓰고, 덮어쓴 옛 내용은 되돌릴 수 없어요. 그래서 파일을 바꿀 때는 옛 파일의 사본을 먼저 남겨 두고 바꿔요. `cp 파일 keep/`처럼 대상 끝에 `/`를 붙였는데 그 폴더가 아직 없으면 복사가 실패하니, 사본을 넣을 폴더부터 만들어요.",code:`# ~/game/  ← 지금 위치
# ├── easy.cfg
# └── hard.cfg
# easy.cfg 내용:
#   level=2
# hard.cfg 내용:
#   level=9
mv easy.cfg hard.cfg
ls
cat hard.cfg`,trace:["`mv easy.cfg hard.cfg` → hard.cfg가 이미 있지만 묻지 않고 그 자리를 easy.cfg로 덮어써요","`ls` → **hard.cfg** 하나만 남아요","`cat hard.cfg` → 옛 내용 level=9는 사라지고 → **level=2**"],output:`hard.cfg
level=2
`,mistake:"같은 이름이 있으면 터미널이 물어보거나 오류를 낼 거라고 생각하기. `cp`와 `mv`는 아무 말 없이 덮어써요.",in_code:"AI가 '이 파일로 교체하세요'라며 `mv new.json config.json`을 주면 옛 config.json은 그 순간 사라져요. 그 전에 `cp config.json config.json.bak`으로 사본을 남겨 두면 되돌릴 수 있어요."},{type:`example`,id:`theory-sh-files-ex3`,kind:`choice`,title:`점수 파일 복사`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/team/  ← 지금 위치
# ├── a/
# │   └── score.txt
# └── score.txt
# a/score.txt 내용:
#   9:1
# score.txt 내용:
#   3:2
cp score.txt a/
cat a/score.txt`,output:`3:2
`,choices:[`9:1`,`3:2`,`9:1
3:2`,`3:2
9:1`],answer:`3:2`,feedback:{"9:1":`같은 이름이 이미 있으면 cp가 복사하지 않고 건너뛴다고 생각했나요?`,"9:1\n3:2":`cp가 같은 이름의 파일 끝에 새 내용을 덧붙인다고 생각했나요?`,"3:2\n9:1":`cp가 새 내용을 앞에 넣고 옛 내용을 뒤에 남긴다고 생각했나요?`},explanation:`a 안에 같은 이름의 score.txt가 있어도 cp는 묻지 않고 덮어써요. 그래서 a/score.txt에는 새로 복사한 3:2만 남아요.`,card:`overwrite`},{type:`explain`,id:`cp-r`,title:`폴더를 복사할 때는 -r`,body:"`cp`는 그냥 쓰면 파일만 복사하고, 폴더를 주면 오류를 내고 건너뛰어요(문구는 macOS와 Linux가 조금 달라요). `cp -r 폴더 대상`의 `-r`은 폴더 안의 내용까지 통째로 복사하라는 옵션이에요. 대상이 없는 이름이면 그 이름의 새 폴더가 생기고, 이미 있는 폴더면 그 안에 폴더째 들어가요. `src/*`처럼 여러 파일을 한 번에 복사할 때는 대상이 이미 있는 폴더여야 해서, `mkdir keep && cp src/* keep/`처럼 먼저 만들어요(`&&`는 앞 명령이 성공하면 다음을 실행).",code:`# ~/site/  ← 지금 위치
# ├── css/
# │   ├── base.css
# │   └── dark.css
# └── old/
cp -r css new
cp -r css old
ls new
ls old`,trace:["`cp -r css new` → new는 없는 이름이라 css를 통째로 복사한 새 폴더 new가 생겨요","`cp -r css old` → old는 이미 있는 폴더라 그 안에 css가 폴더째 들어가요","`ls new` → css의 내용이 그대로 → **base.css  dark.css**","`ls old` → **css**"],output:`base.css  dark.css
css
`,mistake:"`cp css new`처럼 `-r` 없이 폴더를 복사하기. 폴더는 복사되지 않고 오류 메시지만 나와요.",in_code:"AI가 주는 `cp -r project project_backup`은 프로젝트 폴더 전체를 백업하는 흔한 명령이에요. 같은 명령을 두 번 실행하면 두 번째에는 project_backup 안에 project가 들어가니 주의해요."},{type:`example`,id:`theory-sh-files-ex4`,kind:`choice`,title:`글 폴더 백업`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/blog/  ← 지금 위치
# └── posts/
#     ├── a.md
#     └── b.md
mkdir drafts
cp -r posts drafts
ls drafts`,output:`posts
`,choices:[`a.md  b.md`,`posts`,`a.md  b.md  posts`],answer:`posts`,feedback:{"a.md  b.md":`이미 있는 폴더를 대상으로 주면 cp -r이 안의 파일만 꺼내 넣는다고 생각했나요?`,"a.md  b.md  posts":`cp -r이 폴더째 복사와 안의 파일 복사를 함께 한다고 생각했나요?`},explanation:`mkdir로 drafts를 먼저 만들었으니 cp -r의 대상은 이미 있는 폴더예요. 그래서 posts가 폴더째 drafts 안으로 들어가 ls drafts에는 posts가 나와요.`,card:`cp-r`},{type:`explain`,id:`rm`,title:`지우기: rm, rm -r, rmdir`,body:"`rm 파일`은 파일을 지우는데, 휴지통을 거치지 않아 되돌릴 수 없어요. 폴더는 `rm -r 폴더`로 안의 내용까지 통째로 지워요(-r은 안쪽까지). `rmdir 폴더`는 비어 있는 폴더만 지우고, 안에 무엇이 있으면 오류를 내고 남겨 둬요. 그래서 폴더를 비운 뒤 정리할 때 `rmdir`을 쓰면, 실수로 남은 파일까지 지우는 일을 막을 수 있어요.",code:`# ~/box/  ← 지금 위치
# ├── cache/
# │   └── x.tmp
# ├── empty/
# ├── hello.txt
# └── note.txt
rm note.txt
rmdir empty
rm -r cache
ls`,trace:["`rm note.txt` → note.txt를 바로 지워요. 휴지통으로 가지 않아요","`rmdir empty` → 비어 있는 폴더라 지워져요","`rm -r cache` → 안의 x.tmp까지 폴더째 지워요","`ls` → **hello.txt**만 남아요"],output:`hello.txt
`,mistake:"`rmdir`로 파일이 든 폴더를 지우려 하기. 비어 있지 않으면 'Directory not empty' 오류를 내고 그대로 둬요. 안의 파일을 먼저 옮기거나 지운 뒤에 써요.",in_code:"AI가 주는 `rm -rf node_modules`의 `-f`는 확인 없이, 없어도 오류 없이 지우라는 옵션이에요. 실행 전에 `pwd`로 지금 위치가 맞는지 꼭 확인해요."},{type:`example`,id:`theory-sh-files-ex5`,kind:`choice`,title:`책상 정리`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/desk/  ← 지금 위치
# ├── a/
# │   └── x.txt
# ├── b/
# └── c.txt
mv a/x.txt .
rmdir a
rm -r b
ls`,output:`c.txt  x.txt
`,choices:[`c.txt  x.txt`,`a  c.txt  x.txt`,`b  c.txt  x.txt`,`a  b  c.txt  x.txt`],answer:`c.txt  x.txt`,feedback:{"a  c.txt  x.txt":`파일을 꺼낸 뒤에도 rmdir이 a 폴더를 지우지 못한다고 생각했나요?`,"b  c.txt  x.txt":`rm에 -r을 붙여도 폴더는 지워지지 않는다고 생각했나요?`,"a  b  c.txt  x.txt":`rmdir과 rm -r이 폴더 안만 비우고 폴더는 남긴다고 생각했나요?`},explanation:`mv a/x.txt .은 x.txt를 지금 폴더(.)로 꺼내 a를 비워요. 그래서 rmdir a가 성공하고, rm -r b는 폴더째 지우니 c.txt와 x.txt만 남아요.`,card:`rm`},{type:`explain`,id:`keep-going`,title:`오류가 나도 다음 줄은 실행돼요`,body:"터미널은 한 줄이 실패해도 멈추지 않고 다음 줄을 실행해요. `cd`가 오타로 실패하면 위치는 그대로라, 다음 명령은 원래 있던 폴더에서 실행돼요. 이때 `rm -r *`처럼 지우는 명령이 이어지면 원래 폴더의 이름이 모두 대상이 돼요. 지우기 전에는 `pwd`로 위치를 확인하거나, `cd 폴더 && rm …`처럼 이동이 성공했을 때만 지우게 묶어요.",code:`# ~/web/  ← 지금 위치
# ├── dist/
# │   └── a.js
# └── index.html
cd dsit
pwd
echo *`,trace:["`cd dsit` → dist의 오타라 실패 → **bash: cd: dsit: No such file or directory**","`pwd` → 오류가 나도 다음 줄은 실행되고 위치는 그대로 → **/home/mina/web**","`echo *` → `*`가 web 안의 이름으로 펼쳐져 → **dist index.html**. 이 자리에 `rm -r *`가 있었다면 이 둘이 모두 지워졌어요"],output:`bash: cd: dsit: No such file or directory
/home/mina/web
dist index.html
`,mistake:`앞 줄에서 오류가 났으니 뒤 줄도 실행되지 않을 거라고 생각하기. 줄마다 따로 실행돼서, 실패한 줄 뒤의 명령도 원래 위치에서 그대로 실행돼요.`,in_code:"AI가 주는 정리 명령에 `cd build && rm -r *`처럼 `&&`가 있으면 '이동이 성공해야 지운다'는 안전장치예요. 두 줄로 나눠 입력하면 이 장치가 사라져요."},{type:`example`,id:`theory-sh-files-ex6`,kind:`choice`,title:`책 폴더에 그림 폴더 만들기`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/book/  ← 지금 위치
# ├── ch1/
# └── cover.png
cd ch2
mkdir img
ls`,output:`bash: cd: ch2: No such file or directory
ch1  cover.png  img
`,choices:[`bash: cd: ch2: No such file or directory`,`bash: cd: ch2: No such file or directory
ch1  cover.png  img`,`img`,`ch1  cover.png  img`],answer:`bash: cd: ch2: No such file or directory
ch1  cover.png  img`,feedback:{"bash: cd: ch2: No such file or directory":`앞 줄이 실패하면 그 뒤의 줄은 실행되지 않는다고 생각했나요?`,img:`cd가 없는 폴더를 새로 만들고 들어간다고 생각했나요?`,"ch1  cover.png  img":`실패한 cd는 아무 메시지 없이 넘어간다고 생각했나요?`},explanation:`ch2가 없어 cd는 오류를 내고 위치는 book 그대로예요. 다음 줄은 그대로 실행돼 book 안에 img가 생기고, ls에 ch1, cover.png, img가 나와요.`,card:`keep-going`},{type:`summary`,points:["`mkdir`은 폴더를 만들고, `cp`는 원본을 남긴 채 사본을, `mv`는 원본을 옮기거나 이름을 바꿔요.",`대상이 이미 있는 폴더면 그 안으로 들어가고, 없는 이름이면 그 이름이 돼요. 폴더도 같아서 합쳐지지 않아요.`,"`cp`와 `mv`는 같은 이름을 묻지 않고 덮어써요. 바꾸기 전에 사본을 남겨요.","폴더 복사는 `cp -r`이고, 여러 파일을 한 번에 넣을 대상은 이미 있는 폴더여야 해요.","`rm`은 되돌릴 수 없고, `rm -r`은 폴더째, `rmdir`은 빈 폴더만 지워요.","한 줄이 실패해도 다음 줄은 원래 위치에서 실행되니, 지우기 전에 위치를 확인하거나 `&&`로 묶어요."]}],covers:{"sh-files-01":[`mkdir-cp`],"sh-files-02":[`mv`],"sh-files-03":[`overwrite`,`mkdir-cp`,`rm`],"sh-files-04":[`keep-going`,`rm`],"sh-files-05":[`cp-r`,`mv`],"sh-files-06":[`mv`,`rm`,`cp-r`]}},{id:`theory-sh-redirect`,version:2,concept_id:`sh-redirect`,title:`출력 저장과 파이프`,minutes:15,steps:[{type:`explain`,id:`write`,title:`>는 새로 쓰고 >>는 덧붙여요`,body:"명령은 보통 결과를 화면에 출력하지만, 뒤에 `> 파일`을 붙이면 화면 대신 그 파일에 써요(리다이렉트, 출력 방향 바꾸기). `>`는 파일이 없으면 만들고, 있으면 먼저 비운 뒤 써요. `>>`는 비우지 않고 파일 끝에 덧붙여요. 파일로 보낸 내용은 화면에 나오지 않으니 `cat`으로 확인해요.",code:`# ~/  ← 지금 위치
echo "1일차" >> study.txt
echo "2일차" >> study.txt
cat study.txt
echo "새 기록" > study.txt
cat study.txt`,trace:['`echo "1일차" >> study.txt` → study.txt가 없어 새로 만들고 1일차를 써요. 화면에는 아무것도 나오지 않아요','`echo "2일차" >> study.txt` → 비우지 않고 끝에 덧붙여요',"`cat study.txt` → **1일차**, **2일차** 두 줄",'`echo "새 기록" > study.txt` → `>`라서 먼저 파일을 비우고 써요',"`cat study.txt` → **새 기록**"],output:`1일차
2일차
새 기록
`,mistake:"`>`도 끝에 덧붙인다고 생각하기. `>`는 쓰기 전에 파일을 통째로 비워서, 그때까지 쌓인 기록이 사라져요.",in_code:'AI가 주는 `echo "DEBUG=1" >> .env`처럼 설정 파일에 한 줄을 더하는 명령은 `>>`인지 꼭 확인해요. `>`로 잘못 쓰면 원래 있던 설정이 모두 지워져요.'},{type:`example`,id:`theory-sh-redirect-ex1`,kind:`choice`,title:`화면과 파일`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
echo "하나" > n.txt
echo "둘" >> n.txt
echo "셋"
cat n.txt`,output:`셋
하나
둘
`,choices:[`하나
둘
셋
하나
둘`,`셋
하나
둘`,`셋
둘`,`하나
둘
셋`],answer:`셋
하나
둘`,feedback:{"하나\n둘\n셋\n하나\n둘":`> 나 >> 로 파일에 보낸 내용도 화면에 함께 나온다고 생각했나요?`,"셋\n둘":`>> 도 파일을 비우고 새로 쓴다고 생각했나요?`,"하나\n둘\n셋":`앞 줄들처럼 echo "셋"도 n.txt에 들어간다고 생각했나요?`},explanation:`앞의 두 줄은 화면 대신 n.txt에 쓰고, > 가 없는 echo "셋"만 화면에 나와요. 그다음 cat이 파일에 쌓인 하나와 둘을 보여 줘요.`,card:`write`},{type:`explain`,id:`pipe`,title:`파이프로 이어 거르기`,body:"`grep 단어 파일`은 파일에서 그 단어가 든 줄만 골라 출력해요. `|`(파이프)는 왼쪽 명령의 출력을 화면 대신 오른쪽 명령의 입력으로 넘겨요. `head -n 2`는 받은 줄 중 앞의 2줄만, `tail -n 2`는 끝의 2줄만 남겨요. 그래서 `grep … | tail -n 1`은 '걸러진 줄 중 마지막 줄'이에요.",code:`# ~/  ← 지금 위치
# └── pay.log
# pay.log 내용:
#   OK 1200원
#   FAIL 카드 거절
#   OK 800원
#   FAIL 잔액 부족
grep OK pay.log
grep FAIL pay.log | tail -n 1`,trace:["`grep OK pay.log` → OK가 든 줄만 → **OK 1200원**, **OK 800원**","`grep FAIL pay.log | tail -n 1` → FAIL 두 줄이 tail로 넘어가 끝의 한 줄만 → **FAIL 잔액 부족**"],output:`OK 1200원
OK 800원
FAIL 잔액 부족
`,mistake:"파이프 뒤의 `tail -n 1`이 파일의 마지막 줄을 보여 준다고 생각하기. 파이프 뒤의 명령은 파일이 아니라 앞 명령이 넘긴 줄만 받아요.",in_code:"AI가 로그를 보라며 주는 `grep error server.log | tail -n 20`은 'error가 든 줄 중 마지막 20줄'이에요. 가장 최근 오류부터 보려는 조합이에요."},{type:`example`,id:`theory-sh-redirect-ex2`,kind:`choice`,title:`남은 할 일`,prompt:`아래 명령을 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# └── tasks.txt
# tasks.txt 내용:
#   완료 빨래
#   할일 청소
#   할일 장보기
#   완료 운동
grep 할일 tasks.txt | tail -n 1`,output:`할일 장보기
`,choices:[`완료 운동`,`할일 장보기`,`할일 청소`,`할일 청소
할일 장보기`],answer:`할일 장보기`,feedback:{"완료 운동":`tail이 grep의 결과가 아니라 파일 전체의 마지막 줄을 본다고 생각했나요?`,"할일 청소":`tail -n 1이 받은 줄 중 첫 줄을 남긴다고 생각했나요?`,"할일 청소\n할일 장보기":`파이프 뒤의 tail -n 1이 받은 줄의 수를 줄이지 않는다고 생각했나요?`},explanation:`grep이 할일이 든 두 줄만 골라 넘기고, tail -n 1은 그 둘 중 마지막 줄을 남겨요. 그래서 할일 장보기가 나와요.`,card:`pipe`},{type:`explain`,id:`stderr`,title:`결과와 오류는 다른 통로예요`,body:"명령은 정상 결과를 표준 출력으로, 오류 메시지를 표준 오류라는 다른 통로로 내보내요. 둘 다 화면에 보이지만, `>`는 표준 출력만 파일로 보내서 오류는 그대로 화면에 남아요. `>`는 `1>`과 같고, `2>`는 표준 오류만 파일로 보내요. `2> /dev/null`의 `/dev/null`은 받은 것을 버리는 특별한 곳이라 오류를 숨겨요.",code:`# ~/  ← 지금 위치
# └── fruit.txt
# fruit.txt 내용:
#   사과
cat fruit.txt no.txt > ok.txt
cat ok.txt
cat no.txt 2> /dev/null`,trace:["`cat fruit.txt no.txt > ok.txt` → 사과는 ok.txt로 가고, no.txt가 없다는 오류만 화면에 → **cat: no.txt: No such file or directory**","`cat ok.txt` → 파일에는 정상 결과만 → **사과**","`cat no.txt 2> /dev/null` → 오류를 버려서 화면에 아무것도 나오지 않아요"],output:`cat: no.txt: No such file or directory
사과
`,mistake:"`> 파일`로 보냈는데 화면에 글자가 남으면 저장이 안 됐다고 생각하기. 화면에 남은 건 대개 표준 오류라서 `>`가 옮기지 않은 거예요.",in_code:"AI가 주는 명령 끝의 `2>/dev/null`은 오류 메시지를 버려요. 명령이 왜 실패하는지 찾을 때는 이 부분을 빼고 다시 실행해야 오류가 보여요."},{type:`example`,id:`theory-sh-redirect-ex3`,kind:`choice`,title:`노래 파일 두 개`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# └── song.txt
# song.txt 내용:
#   라라라
cat song.txt nosong.txt 2> e.txt
cat e.txt`,output:`라라라
cat: nosong.txt: No such file or directory
`,choices:[`cat: nosong.txt: No such file or directory
라라라`,`라라라`,`라라라
cat: nosong.txt: No such file or directory`],answer:`라라라
cat: nosong.txt: No such file or directory`,feedback:{"cat: nosong.txt: No such file or directory\n라라라":`2> 가 정상 결과를 파일로 보내고 오류를 화면에 남긴다고 생각했나요?`,라라라:`2> 로 보낸 오류는 파일에도 남지 않고 버려진다고 생각했나요?`},explanation:`2> 는 표준 오류만 e.txt로 보내서 첫 줄에서는 라라라만 화면에 나와요. 그다음 cat e.txt가 파일에 담긴 오류 문장을 보여 줘요.`,card:`stderr`},{type:`explain`,id:`merge`,title:`2>&1은 오류를 출력과 같은 곳으로`,body:"`2>&1`은 '표준 오류를 지금 표준 출력이 가는 곳으로 보내라'는 뜻이에요. 리다이렉트는 왼쪽부터 차례로 적용돼서, `> both.txt 2>&1`은 출력을 파일로 옮긴 다음 오류도 그 파일로 보내요. 거꾸로 `2>&1 > one.txt`는 오류를 먼저 그때의 출력인 화면으로 보내고 출력만 파일로 옮겨서, 오류는 화면에 남아요. `> a.txt >> b.txt`처럼 같은 통로를 두 번 돌리면 마지막 곳으로만 가요.",code:`# ~/  ← 지금 위치
# └── fruit.txt
# fruit.txt 내용:
#   사과
cat fruit.txt no.txt > both.txt 2>&1
cat both.txt
cat fruit.txt no.txt 2>&1 > one.txt`,trace:["`cat fruit.txt no.txt > both.txt 2>&1` → 출력을 both.txt로 옮긴 다음 오류도 그곳으로 보내서, 화면에는 아무것도 나오지 않아요","`cat both.txt` → 둘 다 들어 있어 → **사과**, **cat: no.txt: No such file or directory**","`cat fruit.txt no.txt 2>&1 > one.txt` → 오류는 먼저 그때의 출력인 화면으로 가고, 출력만 one.txt로 → **cat: no.txt: No such file or directory**"],output:`사과
cat: no.txt: No such file or directory
cat: no.txt: No such file or directory
`,mistake:"`2>&1`은 어디에 붙여도 같다고 생각하기. 왼쪽부터 적용되므로 `> 파일` 뒤에 둬야 오류도 그 파일에 들어가요.",in_code:"AI가 주는 `python3 train.py > run.log 2>&1`은 결과와 오류를 모두 run.log에 남기는 흔한 형태예요. `2>&1`의 위치까지 그대로 따라 써요."},{type:`example`,id:`theory-sh-redirect-ex4`,kind:`choice`,title:`오류부터 나는 순서`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# └── song.txt
# song.txt 내용:
#   라라라
cat x.txt song.txt > saved.txt 2>&1
echo "화면 끝"
cat saved.txt`,output:`화면 끝
cat: x.txt: No such file or directory
라라라
`,choices:[`cat: x.txt: No such file or directory
화면 끝
라라라`,`화면 끝
라라라`,`화면 끝
cat: x.txt: No such file or directory
라라라`,`화면 끝
라라라
cat: x.txt: No such file or directory`],answer:`화면 끝
cat: x.txt: No such file or directory
라라라`,feedback:{"cat: x.txt: No such file or directory\n화면 끝\n라라라":`> saved.txt 뒤에 둔 2>&1도 오류를 화면으로 보낸다고 생각했나요?`,"화면 끝\n라라라":`2>&1이 오류를 버린다고 생각했나요?`,"화면 끝\n라라라\ncat: x.txt: No such file or directory":`파일에는 정상 결과가 늘 오류보다 먼저 들어간다고 생각했나요?`},explanation:`> saved.txt 다음의 2>&1이라 결과와 오류가 모두 saved.txt로 가서 화면에는 화면 끝만 나와요. cat은 x.txt부터 읽다 오류를 먼저 쓰고 그다음 라라라를 쓰니, 파일에도 그 순서로 들어가요.`,card:`merge`},{type:`explain`,id:`same-file`,title:`읽는 파일에 바로 덮어쓰면 비어요`,body:"`sort 파일`은 줄을 글자 순서로 정렬해 출력해요. 그런데 `sort menu.txt > menu.txt`처럼 읽을 파일에 `>`로 되돌려 쓰면, 셸이 명령을 실행하기 전에 `>`부터 처리해 menu.txt를 먼저 비워요. 그러면 sort는 빈 파일을 읽어 결과도 비어요. `sort -o menu.txt menu.txt`는 sort가 끝까지 읽은 뒤 저장하니 안전하고, 다른 파일에 쓴 뒤 `mv`로 바꿔 넣어도 돼요.",code:`# ~/  ← 지금 위치
# └── menu.txt
# menu.txt 내용:
#   라면
#   김밥
sort -o menu.txt menu.txt
cat menu.txt
sort menu.txt > menu.txt
cat menu.txt`,trace:["`sort -o menu.txt menu.txt` → 끝까지 읽고 정렬한 뒤 같은 파일에 저장해요","`cat menu.txt` → 가나다 순서로 → **김밥**, **라면**","`sort menu.txt > menu.txt` → 셸이 실행 전에 `>`부터 처리해 파일을 비우고, sort는 빈 파일을 읽어요","`cat menu.txt` → 아무것도 나오지 않아요. 내용이 사라졌어요"],output:`김밥
라면
`,mistake:"`sort f > f`가 정렬해서 같은 자리에 저장해 줄 거라고 생각하기. `>`가 먼저 파일을 비워서 무엇을 하든 빈 결과가 남아요. `grep`·`head` 등 어떤 명령이든 같아요.",in_code:"AI가 같은 파일을 고쳐 저장할 때는 결과를 `> new.txt`처럼 다른 파일에 먼저 쓰고, 확인한 뒤 `mv new.txt 원래이름`으로 바꿔 넣는 형태를 자주 써요."},{type:`example`,id:`theory-sh-redirect-ex5`,kind:`choice`,title:`순위 앞부분만 남기기`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# └── top.txt
# top.txt 내용:
#   1위 민
#   2위 준
#   3위 서
head -n 2 top.txt > top.txt
cat top.txt
echo "끝"`,output:`끝
`,choices:[`1위 민
2위 준
끝`,`끝`,`1위 민
2위 준
3위 서
끝`],answer:`끝`,feedback:{"1위 민\n2위 준\n끝":`head가 앞의 두 줄을 다 읽은 뒤에 파일이 새로 써진다고 생각했나요?`,"1위 민\n2위 준\n3위 서\n끝":`읽는 중인 파일에는 > 가 아무것도 쓰지 않는다고 생각했나요?`},explanation:`셸이 head를 실행하기 전에 > top.txt부터 처리해 파일을 비워요. head는 빈 파일을 읽어 아무것도 쓰지 않으니 cat에는 아무것도 나오지 않고 끝만 나와요.`,card:`same-file`},{type:`explain`,id:`tee`,title:`tee는 화면과 파일에 함께 써요`,body:"`tee 파일`은 파이프로 받은 내용을 화면에 그대로 보여 주면서 같은 내용을 파일에도 써요. 결과를 보면서 기록도 남기고 싶을 때 써요. 그냥 쓰면 `>`처럼 파일을 비우고 쓰고, `-a`(append, 덧붙이기)를 붙이면 `>>`처럼 끝에 덧붙여요.",code:`# ~/  ← 지금 위치
# └── pay.log
# pay.log 내용:
#   OK 1200원
#   FAIL 카드 거절
#   OK 800원
grep OK pay.log | tee ok.txt
cat ok.txt`,trace:["`grep OK pay.log | tee ok.txt` → 거른 두 줄을 화면에 보여 주면서 ok.txt에도 써요 → **OK 1200원**, **OK 800원**","`cat ok.txt` → 파일에도 같은 두 줄 → **OK 1200원**, **OK 800원**"],output:`OK 1200원
OK 800원
OK 1200원
OK 800원
`,mistake:"`tee`를 여러 번 쓰면서 `-a`를 빼기. 매번 파일을 비우고 써서 마지막 결과만 남아요.",in_code:"AI가 '설치 기록을 남기세요'라며 주는 `bash install.sh | tee install.log`는 진행 상황을 화면으로 보면서 같은 내용을 파일로 남겨요. 파이프로는 표준 출력만 넘어가니, 오류 메시지까지 남기려면 `bash install.sh 2>&1 | tee install.log`처럼 써요."},{type:`example`,id:`theory-sh-redirect-ex6`,kind:`choice`,title:`점검 기록`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
echo "점검 시작" | tee -a check.txt
echo "점검 끝" | tee check.txt
cat check.txt`,output:`점검 시작
점검 끝
점검 끝
`,choices:[`점검 시작
점검 끝
점검 시작
점검 끝`,`점검 시작
점검 끝
점검 끝`,`점검 끝`],answer:`점검 시작
점검 끝
점검 끝`,feedback:{"점검 시작\n점검 끝\n점검 시작\n점검 끝":`-a 없이 쓴 tee도 파일 끝에 덧붙인다고 생각했나요?`,"점검 끝":`tee로 보낸 내용은 화면에 나오지 않고 파일에만 들어간다고 생각했나요?`},explanation:`tee는 받은 줄을 화면에 보여 주니 점검 시작과 점검 끝이 차례로 나와요. 두 번째 tee에는 -a가 없어 check.txt를 비우고 쓰므로, cat에는 점검 끝만 남아요.`,card:`tee`},{type:`summary`,points:["`> 파일`은 비우고 쓰고, `>> 파일`은 끝에 덧붙여요. 파일로 보낸 내용은 화면에 나오지 않아요.","`|`는 앞 명령의 출력을 뒤 명령의 입력으로 넘겨요. `grep`으로 거르고 `head`·`tail`로 앞뒤를 잘라요.","정상 결과는 표준 출력, 오류는 표준 오류예요. `>`는 표준 출력만, `2>`는 표준 오류만 옮기고, `/dev/null`은 버리는 곳이에요.","리다이렉트는 왼쪽부터 적용돼서, 둘 다 파일에 담으려면 `> 파일 2>&1` 순서로 써요.","읽는 파일에 `>`로 바로 쓰면 먼저 비워지니 `sort -o`나 다른 파일과 `mv`를 써요.","`tee`는 화면과 파일에 함께 쓰고, `-a`를 붙여야 덧붙여요."]}],covers:{"sh-redirect-01":[`write`],"sh-redirect-02":[`pipe`],"sh-redirect-03":[`stderr`,`merge`],"sh-redirect-04":[`same-file`],"sh-redirect-05":[`tee`],"sh-redirect-06":[`merge`]}},{id:`theory-sh-chain`,version:2,concept_id:`sh-chain`,title:`종료 코드와 명령 연결`,minutes:13,steps:[{type:`explain`,id:`exit-code`,title:`모든 명령은 종료 코드를 남겨요`,body:"명령은 끝날 때 종료 코드라는 숫자를 남겨요. 0은 성공이고, 1처럼 0이 아닌 수는 실패예요. `$?`에는 바로 앞 명령의 종료 코드가 들어 있어서 `echo $?`로 볼 수 있어요. 다른 명령을 하나 실행하면 `$?`는 그 명령의 결과로 바뀌어요.",code:`# ~/  ← 지금 위치
# └── music/
cd music
echo $?
cd film
echo $?
echo $?`,trace:["`cd music` → 있는 폴더라 성공. 출력은 없어요","`echo $?` → 앞 명령이 성공했으니 → **0**","`cd film` → music 안에는 film이 없어 → **bash: cd: film: No such file or directory**","`echo $?` → 실패했으니 → **1**","`echo $?` → 이번에는 바로 앞의 `echo`가 성공했으니 → **0**"],output:`0
bash: cd: film: No such file or directory
1
0
`,mistake:`Python처럼 1이 참(성공)이라고 생각하기. 셸의 종료 코드는 0이 성공이고 0이 아니면 실패예요.`,in_code:"AI가 쓴 스크립트 끝의 `exit 1`은 '실패로 끝낸다'는 뜻이에요. 다음 명령이나 다른 프로그램이 이 숫자를 보고 성공·실패를 판단해요."},{type:`example`,id:`theory-sh-chain-ex1`,kind:`choice`,title:`인사 파일 두 개`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# └── hi.txt
# hi.txt 내용:
#   안녕
cat hi.txt
cat bye.txt
echo $?`,output:`안녕
cat: bye.txt: No such file or directory
1
`,choices:[`안녕
cat: bye.txt: No such file or directory
0`,`안녕
cat: bye.txt: No such file or directory
1`,`안녕
1`],answer:`안녕
cat: bye.txt: No such file or directory
1`,feedback:{"안녕\ncat: bye.txt: No such file or directory\n0":`앞에서 cat hi.txt가 성공했으니 $?도 0이라고 생각했나요?`,"안녕\n1":`실패한 명령의 오류 메시지는 화면에 나오지 않는다고 생각했나요?`},explanation:`$?는 바로 앞 명령인 cat bye.txt의 결과예요. bye.txt가 없어 오류 문장이 나오고 실패했으니 1이에요.`,card:`exit-code`},{type:`explain`,id:`and-semi`,title:`&&는 성공할 때만, ;는 언제나`,body:"`A && B`는 A가 성공(종료 코드 0)했을 때만 B를 실행해요. `A ; B`는 성공·실패와 상관없이 A 다음에 B를 실행하고, 줄을 바꿔 쓴 것과 같아요. 어느 쪽이든 실패한 명령의 오류 메시지는 화면에 그대로 나와요. `&&`가 막는 것은 같은 줄에서 이어진 명령뿐이라, 다음 줄은 따로 실행돼요.",code:`# ~/  ← 지금 위치
# └── menu.txt
# menu.txt 내용:
#   국수
cat menu.txt && echo "읽기 성공"
cat memo.txt && echo "읽기 성공"
cat memo.txt ; echo "다음 단계"`,trace:['`cat menu.txt && echo "읽기 성공"` → cat이 성공해 echo도 실행 → **국수**, **읽기 성공**','`cat memo.txt && echo "읽기 성공"` → memo.txt가 없어 실패하니 echo는 건너뛰고 오류만 → **cat: memo.txt: No such file or directory**','`cat memo.txt ; echo "다음 단계"` → 실패해도 `;` 뒤는 실행 → 오류 다음에 **다음 단계**'],output:`국수
읽기 성공
cat: memo.txt: No such file or directory
cat: memo.txt: No such file or directory
다음 단계
`,mistake:"`;`도 앞 명령이 성공해야 다음을 실행한다고 생각하기. `;`는 차례만 정할 뿐이라 실패해도 다음 명령이 실행돼요.",in_code:"AI가 주는 `cd my-app && npm install`이나 `mkdir out && cd out`은 앞 단계가 실패하면 거기서 멈추려는 거예요. `&&`를 지우고 두 줄로 나눠 입력하면 실패한 뒤에도 다음 줄이 실행돼요. 여러 줄이 `>`(새로 쓰기)·`>>`(덧붙이기)로 한 파일에 쌓는 명령이어도 같아서, 실패한 줄의 내용만 빠지고 다음 줄은 계속 실행돼요."},{type:`example`,id:`theory-sh-chain-ex2`,kind:`choice`,title:`없는 폴더로 가는 줄`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
cd nowhere && echo "도착"
echo "다음 줄"`,output:`bash: cd: nowhere: No such file or directory
다음 줄
`,choices:[`bash: cd: nowhere: No such file or directory
다음 줄`,`bash: cd: nowhere: No such file or directory
도착
다음 줄`,`bash: cd: nowhere: No such file or directory`,`다음 줄`],answer:`bash: cd: nowhere: No such file or directory
다음 줄`,feedback:{"bash: cd: nowhere: No such file or directory\n도착\n다음 줄":`&&가 앞 명령의 성공·실패와 상관없이 뒤를 실행한다고 생각했나요?`,"bash: cd: nowhere: No such file or directory":`&&로 막힌 뒤에는 다음 줄도 실행되지 않는다고 생각했나요?`,"다음 줄":`&&로 이은 줄에서는 실패한 명령의 오류 메시지가 숨겨진다고 생각했나요?`},explanation:`cd가 실패해 오류 문장이 나오고, &&는 같은 줄의 echo "도착"만 건너뛰어요. 다음 줄은 따로 실행되니 다음 줄이 나와요.`,card:`and-semi`},{type:`explain`,id:`or`,title:`||는 실패할 때만`,body:"`A || B`는 A가 실패했을 때만 B를 실행해서, 실패를 알리거나 대신할 일을 붙일 때 써요. `true`는 늘 성공하고 `false`는 늘 실패하는 명령이라 규칙을 확인하기 좋아요. `A && B || C`는 보통 'A가 성공하면 B, 실패하면 C'로 읽지만, `||`는 바로 앞까지의 결과를 봐서 A가 성공해도 B가 실패하면 C까지 실행돼요. 줄 끝에 `&&`나 `||`를 두면 명령이 다음 줄로 이어진다는 뜻이에요.",code:`# ~/  ← 지금 위치
# └── pen.txt
# pen.txt 내용:
#   파랑
cat ink.txt || echo "못 읽음"
cat pen.txt > /dev/null || echo "못 읽음"
true && echo "B" || echo "C"
true && false || echo "C"`,trace:['`cat ink.txt || echo "못 읽음"` → cat이 실패해 뒤도 실행 → 오류 다음에 **못 읽음**','`cat pen.txt > /dev/null || echo "못 읽음"` → 내용은 `/dev/null`(받은 것을 버리는 곳)로 버려지고, 성공했으니 뒤는 건너뛰어 아무것도 나오지 않아요','`true && echo "B" || echo "C"` → true 성공 → B를 출력하고 성공 → C는 건너뛰어 → **B**','`true && false || echo "C"` → 성공 뒤의 false가 실패해서 → **C**'],output:`cat: ink.txt: No such file or directory
못 읽음
B
C
`,mistake:"`A && B || C`를 'A만 보고 B나 C 중 하나'로 읽기. B가 실패하면 C도 실행돼요.",in_code:"AI가 쓴 스크립트의 `cd \"$dir\" || exit 1`은 '이동에 실패하면 스크립트를 실패로 끝내라'는 뜻이에요. 긴 한 줄은 `&&`나 `||` 뒤에서 줄을 바꿔 두 줄로 쓰기도 해요."},{type:`example`,id:`theory-sh-chain-ex3`,kind:`choice`,title:`같은 이름 폴더로 두 번`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# └── docs/
cd docs || echo "실패1"
cd docs || echo "실패2"
pwd`,output:`bash: cd: docs: No such file or directory
실패2
/home/mina/docs
`,choices:[`bash: cd: docs: No such file or directory
실패2
/home/mina/docs`,`/home/mina/docs`,`실패1
bash: cd: docs: No such file or directory
실패2
/home/mina/docs`,`bash: cd: docs: No such file or directory
/home/mina/docs`],answer:`bash: cd: docs: No such file or directory
실패2
/home/mina/docs`,feedback:{"/home/mina/docs":`두 번째 cd docs도 처음처럼 홈에서 docs를 찾는다고 생각했나요?`,"실패1\nbash: cd: docs: No such file or directory\n실패2\n/home/mina/docs":`||가 앞 명령이 성공했을 때도 뒤를 실행한다고 생각했나요?`,"bash: cd: docs: No such file or directory\n/home/mina/docs":`오류 메시지가 나오면 || 뒤의 명령은 건너뛴다고 생각했나요?`},explanation:`첫 줄의 cd는 성공해 실패1이 나오지 않고 위치가 docs로 바뀌어요. 둘째 줄은 docs 안에서 또 docs를 찾다 실패하니 오류와 실패2가 나오고, 위치는 docs 그대로예요.`,card:`or`},{type:`explain`,id:`guard`,title:`이동이 실패하면 지우지 않게`,body:"`cd 폴더`가 실패하면 위치는 그대로라, 그 뒤에 `;`나 줄바꿈으로 이어진 명령은 원래 위치에서 실행돼요. 지우는 명령이었다면 `*`가 원래 위치의 이름으로 펼쳐져 엉뚱한 파일이 지워져요. `cd 폴더 && rm *.log`는 이동이 실패하면 rm을 건너뛰어 안전해요. 한편 `*`가 맞는 이름을 하나도 못 찾으면 펼쳐지지 않고 `*.log`라는 글자 그대로 넘어가요. `echo`로 보면 그 글자가 그대로 나오고, `cat`이나 `rm`이 받으면 그런 이름의 파일이 없다는 오류가 나요.",code:`# ~/web/  ← 지금 위치
# └── old.log
cd logs && echo *.log
cd logs ; echo *.log
echo logs/*.log`,trace:["`cd logs && echo *.log` → 이동이 실패해 echo는 건너뛰고 오류만 → **bash: cd: logs: No such file or directory**","`cd logs ; echo *.log` → 실패해도 echo가 실행되고, 지금 위치(web)에서 펼쳐져 → 오류 다음에 **old.log**. echo 대신 rm이었다면 old.log가 지워졌어요","`echo logs/*.log` → logs가 없어 맞는 이름이 없으니 펼쳐지지 않고 글자 그대로 → **logs/*.log**"],output:`bash: cd: logs: No such file or directory
bash: cd: logs: No such file or directory
old.log
logs/*.log
`,mistake:"`;`로 이은 `cd` 뒤의 명령은 새 폴더에서 실행된다고 믿기. `cd`가 실패하면 원래 위치에서 실행돼요.",in_code:"AI가 주는 정리 명령 `cd build && rm -rf *`의 `&&`는 지우지 말고 그대로 둬요. 지우기 전에 `rm`을 `echo`로 바꿔 실행해 보면 무엇이 대상인지 미리 볼 수 있어요."},{type:`example`,id:`theory-sh-chain-ex4`,kind:`choice`,title:`없는 사진 찾기`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/cam/  ← 지금 위치
# ├── a.jpg
# └── b.jpg
cat *.png 2>/dev/null && echo "끝"
echo *.png *.jpg`,output:`*.png a.jpg b.jpg
`,choices:[`끝
*.png a.jpg b.jpg`,`*.png a.jpg b.jpg`,`a.jpg b.jpg`,`끝
a.jpg b.jpg`],answer:`*.png a.jpg b.jpg`,feedback:{"끝\n*.png a.jpg b.jpg":`&&가 실패한 cat 뒤에도 echo를 실행한다고 생각했나요?`,"a.jpg b.jpg":`맞는 이름이 없는 *.png는 사라진다고 생각했나요?`,"끝\na.jpg b.jpg":`맞는 이름이 없으면 *.png가 사라지고 cat이 성공한다고 생각했나요?`},explanation:`.png로 끝나는 파일이 없어 cat은 글자 *.png를 열려다 실패하고, 오류는 2>/dev/null로 버려져 보이지 않아요. 그래서 &&가 echo "끝"을 건너뛰어요. 다음 줄의 echo에서 *.png는 글자 그대로 남고 *.jpg는 두 이름으로 펼쳐져요.`,card:`guard`},{type:`explain`,id:`if-pipe`,title:`if는 종료 코드를, 파이프는 출력을`,body:"`if 명령; then …; fi`도 `&&`처럼 명령의 종료 코드를 보고, 0(성공)일 때만 `then`과 `fi` 사이를 실행해요. `python3 파일.py`는 Python 파일을 실행하는 명령인데, 프로그램이 `sys.exit(2)`로 끝나면 그 숫자가 종료 코드가 되고, 오류 없이 끝까지 실행되면 0이 돼요. 반면 `A | B`는 조건이 아니라 두 명령을 함께 실행해 A의 출력을 B로 넘길 뿐이라, A가 실패해도 B는 실행돼요. 이때 A의 출력은 화면 대신 B로 가요.",code:`# ~/  ← 지금 위치
# └── ping.py
# ping.py 내용:
#   import sys
#   print("응답 없음")
#   sys.exit(2)
python3 ping.py
echo $?
if python3 ping.py; then
  echo "정상"
fi`,trace:["`python3 ping.py` → 응답 없음을 출력하고 `sys.exit(2)`로 끝나요 → **응답 없음**","`echo $?` → **2**. 0이 아니니 실패예요","`if python3 ping.py; then` → 다시 실행해 **응답 없음**이 나오고, 종료 코드가 0이 아니라서",'`echo "정상"` → 건너뛰어요',"`fi` → if의 끝이에요"],output:`응답 없음
2
응답 없음
`,mistake:"`A | B`도 `&&`처럼 A가 성공해야 B를 실행한다고 생각하기. 파이프는 두 명령을 함께 실행해서, A가 실패해도 B가 실행돼요.",in_code:"AI가 쓴 스크립트의 `if pytest; then git push; fi`는 테스트가 모두 통과(0)했을 때만 올린다는 뜻이에요. 테스트 도구는 실패한 테스트가 있으면 0이 아닌 코드로 끝나요."},{type:`example`,id:`theory-sh-chain-ex5`,kind:`choice`,title:`통과한 뒤에`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# └── ok.py
# ok.py 내용:
#   print("통과")
if python3 ok.py; then
  echo "다음"
fi`,output:`통과
다음
`,choices:[`통과
다음`,`다음`,`통과`],answer:`통과
다음`,feedback:{다음:`if 뒤에 쓴 명령은 조건만 확인하고 출력은 보이지 않는다고 생각했나요?`,통과:`sys.exit를 쓰지 않고 끝난 프로그램은 성공(0)이 아니라고 생각했나요?`},explanation:`if 뒤의 python3 ok.py도 실제로 실행돼 통과가 출력돼요. 오류 없이 끝까지 실행된 프로그램은 종료 코드 0이라 then 안의 다음까지 출력돼요.`,card:`if-pipe`},{type:`summary`,points:["명령은 종료 코드를 남기고 0이 성공, 0이 아니면 실패예요. `$?`는 바로 앞 명령의 코드예요.","`&&`는 앞이 성공할 때만, `;`와 줄바꿈은 언제나 다음을 실행하고, 오류 메시지는 어느 쪽이든 나와요.","`||`는 앞이 실패할 때만 실행하고, `A && B || C`는 B가 실패해도 C가 실행돼요.","`cd`가 실패하면 위치는 그대로라 `cd 폴더 && …`로 묶어야 안전해요. 맞는 이름이 없는 `*`는 글자 그대로 넘어가요.","`if 명령; then …; fi`는 종료 코드를 보고, `|`는 조건 없이 두 명령을 함께 실행해요."]}],covers:{"sh-chain-01":[`and-semi`],"sh-chain-02":[`exit-code`,`or`],"sh-chain-03":[`and-semi`],"sh-chain-04":[`guard`,`and-semi`,`or`],"sh-chain-05":[`or`],"sh-chain-06":[`if-pipe`,`and-semi`,`or`]}},{id:`theory-sh-env`,version:2,concept_id:`sh-env`,title:`환경 변수와 PATH`,minutes:16,steps:[{type:`explain`,id:`vars`,title:`변수 만들고 꺼내기`,body:"`이름=값`으로 변수를 만들어요. `=` 양옆에 띄어쓰기가 있으면 셸이 이름을 명령으로 읽어 'command not found' 오류가 나요. 꺼낼 때는 `$이름`이고, 큰따옴표 안에서는 값으로 바뀌지만 작은따옴표 안에서는 글자 그대로예요. 만든 적 없는 변수는 오류 없이 빈 값이 돼서 이름 오타를 알아채기 어려워요. 이름의 대문자와 소문자도 다른 이름으로 봐요.",code:`# ~/  ← 지금 위치
city=busan
echo "도시: $city"
echo "도시: $ctiy"
city = seoul
echo "$city"`,trace:["`city=busan` → city라는 변수에 busan을 담아요. 출력은 없어요",'`echo "도시: $city"` → 큰따옴표 안의 $city가 값으로 바뀌어 → **도시: busan**','`echo "도시: $ctiy"` → 철자가 다른 ctiy는 만든 적 없어 빈 값 → **도시:**',"`city = seoul` → 띄어쓰기 때문에 city를 명령으로 실행하려다 → **bash: city: command not found**",'`echo "$city"` → 값은 그대로 → **busan**'],output:`도시: busan
도시: 
bash: city: command not found
busan
`,mistake:"`city = seoul`처럼 `=` 양옆을 띄우기. 셸은 띄어쓰기로 단어를 나누니 city를 명령 이름으로 읽어요.",in_code:'AI가 준 스크립트 맨 위의 `OUT_DIR=build` 같은 줄은 변수를 만들고, 아래의 `"$OUT_DIR"`이 그 값을 꺼내 써요. 이름이 한 글자라도 다르면 빈 값이 되니 철자를 맞춰 봐요.'},{type:`example`,id:`theory-sh-env-ex1`,kind:`line`,title:`고양이가 나오는 줄`,prompt:`아래 명령 중 고양이를 출력하는 줄을 고르세요.`,code:`# ~/  ← 지금 위치
pet=고양이
echo pet
echo '$pet'
echo "$Pet"
echo "$pet"`,output:`pet
$pet

고양이
`,choices:[`2`,`3`,`4`,`5`,`6`],answer:`6`,check:{type:`prints`,target:`고양이`},feedback:{2:`변수에 값을 담는 줄도 그 값을 화면에 보여 준다고 생각했나요?`,3:`$ 없이 이름만 써도 변수의 값이 나온다고 생각했나요?`,4:`작은따옴표 안의 $pet도 값으로 바뀐다고 생각했나요?`,5:`셸이 변수 이름의 대문자와 소문자를 같게 본다고 생각했나요?`},explanation:`2번 줄은 담기만 하고 출력하지 않아요. 3번 줄은 pet이라는 글자, 4번 줄은 작은따옴표 안이라 $pet 그대로이고, 5번 줄의 Pet은 만든 적 없는 다른 이름이라 빈 줄이에요. 6번 줄만 고양이를 출력해요.`,card:`vars`},{type:`explain`,id:`export`,title:`프로그램에 넘기려면 export`,body:'`이름=값`으로 만든 변수는 지금 셸 안에서만 쓰여요. `python3` 같은 프로그램을 실행하면 셸이 새 프로그램을 띄우는데, 이 프로그램은 export된 변수만 환경 변수로 물려받아요. `export 이름=값`이나, 이미 만든 변수에 `export 이름`을 쓰면 그 뒤에 실행하는 프로그램이 값을 읽을 수 있어요. Python에서는 `os.getenv("이름", 기본값)`이나 같은 뜻의 `os.environ.get("이름", 기본값)`으로 환경 변수를 읽고, 없으면 기본값을 써요.',code:`# ~/  ← 지금 위치
# └── who.py
# who.py 내용:
#   import os
#   print(os.getenv("ROLE", "모름"))
ROLE=admin
python3 who.py
export ROLE=guest
python3 who.py`,trace:["`ROLE=admin` → 셸 안에만 있는 변수를 만들어요","`python3 who.py` → 새로 띄운 Python은 export되지 않은 변수를 못 받아 → **모름**","`export ROLE=guest` → 값을 guest로 바꾸면서, 앞으로 실행할 프로그램에 넘기도록 표시해요","`python3 who.py` → 이제 환경 변수로 받아 → **guest**"],output:`모름
guest
`,mistake:"셸의 `echo`에서 값이 보이니 프로그램도 받을 거라고 생각하기. `echo`는 셸이 직접 값을 넣어 주는 것이고, 새로 실행한 프로그램은 export된 변수만 받아요.",in_code:"AI가 '환경 변수를 설정하세요'라며 주는 `export MY_API_KEY=…` 같은 줄은 그 터미널에서 실행하는 프로그램에 값을 넘겨요. 터미널을 닫으면 사라지니 새 터미널에서는 다시 설정해요."},{type:`example`,id:`theory-sh-env-ex2`,kind:`choice`,title:`시간대 변수`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# └── tz.py
# tz.py 내용:
#   import os
#   print(os.getenv("ZONE", "UTC"))
ZONE=KST
python3 tz.py
echo "$ZONE"`,output:`UTC
KST
`,choices:[`KST
KST`,`UTC
KST`,`UTC`],answer:`UTC
KST`,feedback:{"KST\nKST":`셸에서 만든 변수를 새로 실행한 프로그램도 그대로 받는다고 생각했나요?`,UTC:`export하지 않으면 셸의 echo에서도 값이 비어 있다고 생각했나요?`},explanation:`ZONE=KST는 셸 안에만 있는 변수라 python3 tz.py는 받지 못하고 기본값 UTC를 출력해요. 셸이 직접 바꾸는 echo "$ZONE"에는 KST가 나와요.`,card:`export`},{type:`explain`,id:`one-shot`,title:`명령 앞에 붙인 변수는 그 명령에만`,body:"`이름=값 명령`처럼 명령 바로 앞에 붙이면, 그 값은 그 명령 하나에만 환경 변수로 전달되고 끝나요. 이미 export한 값이 있어도 그 명령에는 붙인 값이 쓰이고, 셸의 변수는 바뀌지 않아서 다음 명령은 붙이기 전의 값을 받아요(없었다면 받지 못해요). 계속 쓰려면 `export 이름=값`을 먼저 실행해요.",code:`# ~/  ← 지금 위치
# └── who.py
# who.py 내용:
#   import os
#   print(os.getenv("ROLE", "모름"))
ROLE=admin python3 who.py
ROLE=guest python3 who.py
python3 who.py`,trace:["`ROLE=admin python3 who.py` → 이 실행에만 ROLE이 admin → **admin**","`ROLE=guest python3 who.py` → 이번 실행에만 guest → **guest**","`python3 who.py` → 앞에 붙인 값은 남지 않아 → **모름**"],output:`admin
guest
모름
`,mistake:"명령 앞에 붙여 한 번 실행하면 그 뒤에도 값이 남는다고 생각하기. 그 명령이 끝나면 사라지고, 셸의 `$ROLE`도 비어 있어요.",in_code:"AI가 주는 `DEBUG=1 python3 app.py`나 `CUDA_VISIBLE_DEVICES=0 python3 train.py`가 이 형식이에요. 그 실행에만 설정을 바꿔요."},{type:`example`,id:`theory-sh-env-ex3`,kind:`choice`,title:`export한 값과 한 번 붙인 값`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# └── tz.py
# tz.py 내용:
#   import os
#   print(os.getenv("ZONE", "UTC"))
export ZONE=JST
ZONE=KST python3 tz.py
python3 tz.py`,output:`KST
JST
`,choices:[`KST
KST`,`JST
JST`,`KST
JST`,`KST
UTC`],answer:`KST
JST`,feedback:{"KST\nKST":`명령 앞에 붙인 값이 셸의 ZONE까지 바꾼다고 생각했나요?`,"JST\nJST":`export한 값이 있으면 명령 앞에 붙인 값은 무시된다고 생각했나요?`,"KST\nUTC":`명령 앞에 붙인 값이 끝나면서 export한 값까지 지운다고 생각했나요?`},explanation:`ZONE=KST는 그 실행 한 번에만 KST를 넘겨요. 그 뒤의 python3 tz.py는 export해 둔 JST를 그대로 받아요.`,card:`one-shot`},{type:`explain`,id:`env-file`,title:`.env 파일은 저절로 읽히지 않아요`,body:"`.env`는 `이름=값` 줄을 모아 둔 설정 파일인데, 셸도 Python도 저절로 읽지 않아요. `source .env`는 파일의 줄을 지금 셸에서 실행해 변수를 만들지만 export하지는 않으니, 프로그램은 여전히 받지 못해요. `set -a`를 먼저 켜면 그 뒤에 만드는 변수가 모두 자동으로 export되고, `set +a`로 다시 꺼요. `export $(cat .env)`도 쓰는데, `$( )` 자리가 파일 내용으로 바뀌어 `export 이름=값`이 되는 방식이에요(명령 결과 이어 쓰기 강의).",code:`# ~/  ← 지금 위치
# ├── .env
# └── db.py
# .env 내용:
#   DB_NAME=blog_dev
# db.py 내용:
#   import os
#   print(os.getenv("DB_NAME"))
source .env
echo "셸: $DB_NAME"
python3 db.py
set -a; source .env; set +a
python3 db.py`,trace:["`source .env` → 파일 속 `DB_NAME=blog_dev` 줄을 지금 셸에서 실행해 변수를 만들어요",'`echo "셸: $DB_NAME"` → 셸에는 있으니 → **셸: blog_dev**',"`python3 db.py` → export되지 않아 Python은 받지 못하고, 기본값도 없으니 → **None**","`set -a; source .env; set +a` → 자동 export를 켠 채로 다시 읽고 꺼요","`python3 db.py` → 이제 받아서 → **blog_dev**"],output:`셸: blog_dev
None
blog_dev
`,mistake:"`source .env`만 하면 프로그램도 값을 받을 거라고 생각하기. 셸 변수만 생길 뿐이라 `python3`는 None을 출력해요.",in_code:"AI가 만든 Python 코드에 `from dotenv import load_dotenv`와 `load_dotenv()`가 있으면 코드가 직접 .env를 읽어요. 그런 줄이 없다면 실행 전에 값을 내보내야 해요."},{type:`example`,id:`theory-sh-env-ex4`,kind:`choice`,title:`색 설정 파일`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# ├── .env
# └── paint.py
# .env 내용:
#   COLOR=red
# paint.py 내용:
#   import os
#   print(os.getenv("COLOR", "기본색"))
python3 paint.py
source .env
python3 paint.py
echo "$COLOR"`,output:`기본색
기본색
red
`,choices:[`red
red
red`,`기본색
red
red`,`기본색
기본색
red`,`기본색
기본색`],answer:`기본색
기본색
red`,feedback:{"red\nred\nred":`Python이 같은 폴더의 .env를 저절로 읽는다고 생각했나요?`,"기본색\nred\nred":`source로 읽은 변수가 자동으로 프로그램에 넘어간다고 생각했나요?`,"기본색\n기본색":`source .env가 셸에도 변수를 만들지 않는다고 생각했나요?`},explanation:`.env는 저절로 읽히지 않아 첫 실행은 기본색이에요. source .env는 셸 변수만 만들고 export하지 않으니 두 번째 실행도 기본색이고, 셸의 echo에만 red가 나와요.`,card:`env-file`},{type:`explain`,id:`path`,title:`이름만 쓴 명령은 PATH에서 찾아요`,body:'`ls`처럼 이름만 쓴 명령은 지금 폴더가 아니라 PATH라는 환경 변수에 적힌 폴더들에서 찾아요. PATH는 폴더 경로를 `:`로 이어 둔 목록이고, 앞에서부터 찾아 처음 나온 것을 실행해요. 지금 폴더는 보통 PATH에 없어서 지금 폴더의 프로그램은 `./hi`처럼 경로로 실행하고, `/`가 든 이름은 PATH를 보지 않고 그 경로의 파일을 바로 실행해요. 폴더를 더할 때는 `export PATH="새폴더:$PATH"`처럼 원래 목록을 뒤에 붙여야 기본 명령이 사라지지 않고, `which 이름`은 PATH에서 찾은 파일의 경로를 보여 줘요.',code:`# ~/  ← 지금 위치
# └── bin/
#     └── hi*
# bin/hi 내용:
#   #!/bin/bash
#   echo "안녕하세요"
cd bin
hi
./hi
export PATH="$HOME/bin:$PATH"
which hi`,trace:["`# └── hi*` → 이름 뒤의 `*`는 실행 권한이 있는 파일이라는 표시이고, 첫 줄의 `#!/bin/bash`는 bash로 실행할 명령 파일이라는 뜻이에요(스크립트 강의)","`cd bin` → hi가 있는 폴더로 들어가요","`hi` → 지금 폴더는 PATH에 없어 → **bash: hi: command not found**","`./hi` → 지금 폴더(.)의 hi라고 경로로 알려 줘 → **안녕하세요**",'`export PATH="$HOME/bin:$PATH"` → 홈의 bin을 목록 맨 앞에 넣고 원래 목록은 뒤에 그대로 둬요',"`which hi` → 이제 PATH에서 찾아 → **/home/mina/bin/hi**"],output:`bash: hi: command not found
안녕하세요
/home/mina/bin/hi
`,mistake:'`export PATH="$HOME/bin"`처럼 `:$PATH`를 빼기. 원래 목록이 사라져 `ls`·`cat` 같은 기본 명령까지 command not found가 돼요.',in_code:`AI가 설치 안내 끝에 '\`export PATH="$HOME/.local/bin:$PATH"\`를 추가하세요'라고 하는 건, 새로 설치한 도구가 든 폴더를 찾을 목록에 넣으라는 뜻이에요.`},{type:`example`,id:`theory-sh-env-ex5`,kind:`line`,title:`켜짐이 나오는 줄`,prompt:`아래 명령 중 켜짐을 출력하는 줄을 고르세요.`,code:`# ~/  ← 지금 위치
# └── apps/
#     └── yo*
# apps/yo 내용:
#   #!/bin/bash
#   echo "켜짐"
yo
apps/yo
cd apps
yo`,output:`bash: yo: command not found
켜짐
bash: yo: command not found
`,choices:[`7`,`8`,`10`],answer:`8`,check:{type:`prints`,target:`켜짐`},feedback:{7:`이름만 써도 홈 아래 폴더까지 뒤져 찾는다고 생각했나요?`,10:`프로그램이 있는 폴더로 들어가면 이름만으로 실행된다고 생각했나요?`},explanation:`8번 줄의 apps/yo는 /가 든 경로라 PATH를 보지 않고 그 파일을 바로 실행해요. 7번과 10번 줄의 yo는 PATH에서만 찾는데 apps는 PATH에 없어서, 둘 다 command not found예요.`,card:`path`},{type:`explain`,id:`default`,title:`비어 있을 때 쓸 기본값`,body:"`${이름}`은 `$이름`과 같은데, 중괄호로 이름의 끝을 분명히 하고 뒤에 규칙을 붙일 수 있어요. `${user:-손님}`은 user가 없거나 비어 있으면 손님을, 값이 있으면 그 값을 쓰고, `${user:=손님}`은 같은 값을 쓰면서 비어 있던 user에 손님을 넣어 두기까지 해요. 콜론 없는 `${user-손님}`은 변수가 아예 없을 때만 기본값이라 빈 값은 그대로 두고, `${user:+회원}`은 반대로 값이 있을 때만 회원으로 바꿔요. 중괄호 없는 `$nick:-손님`은 값 뒤에 `:-손님`이라는 글자가 붙을 뿐이에요.",code:`# ~/  ← 지금 위치
user=
echo "[\${user:-손님}] [\${user-손님}]"
echo "[\${user:=손님}] [$user]"
echo "[\${user:+회원}]"
echo "[$nick:-손님]"`,trace:["`user=` → user를 만들되 값은 비워 둬요",'`echo "[${user:-손님}] [${user-손님}]"` → 앞은 비어 있으니 손님, 뒤는 콜론이 없어 빈 값 그대로 → **[손님] []**','`echo "[${user:=손님}] [$user]"` → 손님을 쓰면서 user에 넣어 두니 다음 `$user`도 → **[손님] [손님]**','`echo "[${user:+회원}]"` → 이제 값이 있으니 회원으로 바꿔 → **[회원]**','`echo "[$nick:-손님]"` → 중괄호가 없어 빈 $nick 뒤에 글자가 그대로 붙어 → **[:-손님]**'],output:`[손님] []
[손님] [손님]
[회원]
[:-손님]
`,mistake:"`${user-손님}`도 빈 값이면 기본값을 쓴다고 생각하기. 콜론이 없으면 변수가 아예 없을 때만이에요. 빈 값까지 바꾸려면 `:-`를 써요.",in_code:"AI가 쓴 스크립트의 `LEVEL=\"${LOG_LEVEL:-info}\"`는 'LOG_LEVEL 환경 변수가 있으면 그 값, 없거나 비어 있으면 info'라는 뜻이에요. 실행할 때 `LOG_LEVEL=debug bash run.sh`처럼 바꿔 줄 수 있게 해 둔 거예요."},{type:`example`,id:`theory-sh-env-ex6`,kind:`choice`,title:`색 기본값`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
color=
echo "1:\${color:-흰색}"
color=검정
echo "2:\${color:-흰색}"
echo "3:\${shade-회색}"`,output:`1:흰색
2:검정
3:회색
`,choices:[`1:흰색
2:검정
3:회색`,`1:
2:검정
3:회색`,`1:흰색
2:흰색
3:회색`,`1:흰색
2:검정
3:`],answer:`1:흰색
2:검정
3:회색`,feedback:{"1:\n2:검정\n3:회색":`:-가 변수가 아예 없을 때만 기본값을 쓴다고 생각했나요?`,"1:흰색\n2:흰색\n3:회색":`:-가 값이 있어도 늘 기본값을 쓴다고 생각했나요?`,"1:흰색\n2:검정\n3:":`콜론 없는 -는 기본값을 쓰지 않는다고 생각했나요?`},explanation:`color가 비어 있을 때 :-는 흰색을, 검정을 담은 뒤에는 그 값을 써요. shade는 만든 적 없는 변수라 콜론 없는 -도 회색을 써요.`,card:`default`},{type:`summary`,points:["`이름=값`(띄어쓰기 없이)으로 만들고 `$이름`으로 꺼내요. 없는 이름은 오류 없이 빈 값이에요.","새로 실행한 프로그램은 export된 환경 변수만 받아요. `export 이름=값`으로 내보내요.","`이름=값 명령`은 그 명령 하나에만 값을 넘기고 셸에는 남지 않아요.","`.env`는 저절로 읽히지 않고 `source`만으로는 export되지 않아요. `set -a; source .env; set +a`처럼 내보내요.","이름만 쓴 명령은 PATH의 폴더에서 앞부터 찾고, 지금 폴더의 것은 `./이름`으로 실행해요. PATH를 바꿀 때는 `:$PATH`를 남겨요.","`${이름:-기본}`은 없거나 비어 있을 때 기본값, `:=`는 넣어 두기까지, 콜론 없는 `-`는 아예 없을 때만이에요."]}],covers:{"sh-env-01":[`vars`],"sh-env-02":[`export`],"sh-env-03":[`path`],"sh-env-04":[`env-file`,`export`],"sh-env-05":[`one-shot`],"sh-env-06":[`default`]}},{id:`theory-sh-script`,version:2,concept_id:`sh-script`,title:`스크립트 실행`,minutes:15,steps:[{type:`explain`,id:`bash-file`,title:`파일에 적은 명령을 bash로 실행`,body:"명령 여러 줄을 파일에 적어 두고 한 번에 실행하는 것을 스크립트라고 해요(보통 이름이 `.sh`로 끝나요). `bash 파일.sh`는 그 파일의 줄을 위에서부터 bash로 실행해요. 파일 이름 뒤에 띄어 쓴 단어는 인자로 넘어가고, 스크립트 안에서 `$1`은 첫 번째, `$2`는 두 번째 인자예요. 인자를 주지 않으면 그 자리는 오류 없이 빈 값이고, 실행할 때마다 새로 받아요.",code:`# ~/  ← 지금 위치
# └── order.sh
# order.sh 내용:
#   echo "$1 $2잔 주문"
bash order.sh 라떼 2
bash order.sh 녹차`,trace:["`# order.sh 내용:` → order.sh에는 echo 한 줄이 들어 있어요","`bash order.sh 라떼 2` → $1은 라떼, $2는 2 → **라떼 2잔 주문**","`bash order.sh 녹차` → 두 번째 인자가 없어 $2는 빈 값 → **녹차 잔 주문**"],output:`라떼 2잔 주문
녹차 잔 주문
`,mistake:`앞 실행에서 준 인자가 다음 실행에도 남는다고 생각하기. 실행할 때마다 새로 받아서, 주지 않은 자리는 비어요.`,in_code:"AI가 'bash deploy.sh staging처럼 실행하세요'라고 하면 staging이 스크립트 안의 `$1`로 들어가요. 스크립트 위쪽의 `env=$1` 같은 줄이 그 값을 받아 써요."},{type:`example`,id:`theory-sh-script-ex1`,kind:`choice`,title:`순서 바꾸기`,prompt:`아래 명령을 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# └── swap.sh
# swap.sh 내용:
#   echo "$2-$1"
bash swap.sh 하나 둘 셋`,output:`둘-하나
`,choices:[`하나-둘`,`둘-하나`,`셋-둘`,`둘-하나 셋`],answer:`둘-하나`,feedback:{"하나-둘":`$1과 $2가 스크립트 안에 쓴 순서대로 인자를 받는다고 생각했나요?`,"셋-둘":`$1과 $2가 한 칸씩 밀려 두 번째 인자 둘과 세 번째 인자 셋을 가리킨다고 생각했나요?`,"둘-하나 셋":`스크립트가 쓰지 않은 남는 인자도 끝에 붙어 출력된다고 생각했나요?`},explanation:`$1은 첫 번째 인자 하나, $2는 두 번째 인자 둘이에요. echo "$2-$1"은 둘-하나가 되고, 쓰지 않은 셋은 출력되지 않아요.`,card:`bash-file`},{type:`explain`,id:`all-args`,title:`인자 개수와 모든 인자`,body:'스크립트 안에서 `$#`은 받은 인자의 개수, `"$@"`는 받은 인자 전부예요. 따옴표로 묶어 넘긴 `"New York"`은 칸이 있어도 인자 하나로 세요. `"$@"`처럼 큰따옴표로 감싸면 인자를 나뉜 그대로 하나씩 펼치지만, 따옴표 없는 `$@`는 칸에서 다시 나뉘어요. 그래서 인자마다 되풀이할 때는 `for a in "$@"; do …; done`처럼 써요.',code:`# ~/  ← 지금 위치
# └── pick.sh
# pick.sh 내용:
#   echo "$#개"
#   printf '<%s>\\n' "$@"
#   printf '<%s>\\n' $@
bash pick.sh "New York" Paris`,trace:['`bash pick.sh "New York" Paris` → 따옴표로 묶은 New York이 인자 하나, Paris가 하나예요','`echo "$#개"` → 인자 개수 → **2개**',`\`printf '<%s>\\n' "$@"\` → 인자를 나뉜 그대로 → **<New York>**, **<Paris>**`,"`printf '<%s>\\n' $@` → 따옴표가 없어 칸에서 다시 나뉘어 → **<New>**, **<York>**, **<Paris>**"],output:`2개
<New York>
<Paris>
<New>
<York>
<Paris>
`,mistake:"따옴표 없는 `$@`도 받은 인자를 그대로 넘긴다고 생각하기. 칸이 있는 인자가 쪼개져 개수가 달라져요.",in_code:'AI가 쓴 감싸기 스크립트의 `python3 main.py "$@"`는 받은 인자를 그대로 Python에 넘겨요. 큰따옴표가 있어야 칸이 있는 파일 이름도 하나로 넘어가요.'},{type:`example`,id:`theory-sh-script-ex2`,kind:`choice`,title:`인자 세기`,prompt:`아래 명령을 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# └── count.sh
# count.sh 내용:
#   echo "$# $1"
bash count.sh "a b" c 'd e'`,output:`3 a b
`,choices:[`5 a`,`3 a b`,`4 a b`,`3 "a b"`],answer:`3 a b`,feedback:{"5 a":`따옴표로 묶은 값도 칸마다 다른 인자로 센다고 생각했나요?`,"4 a b":`작은따옴표로 감싼 'd e'는 하나로 묶이지 않는다고 생각했나요?`,'3 "a b"':`셸이 따옴표를 지우지 않고 스크립트에 넘긴다고 생각했나요?`},explanation:`큰따옴표의 a b와 작은따옴표의 d e가 각각 인자 하나라 c까지 세 개예요. $1은 첫 인자 a b이고, 따옴표는 셸이 지운 뒤 넘겨요.`,card:`all-args`},{type:`explain`,id:`exec`,title:`./로 바로 실행하려면 실행 권한`,body:"`./tick.sh`처럼 파일을 프로그램처럼 바로 실행하려면 실행 권한이 있어야 하고, 없으면 'Permission denied'(권한 없음)가 나요. `chmod +x 파일`이 실행 권한을 주고, 스크립트 첫 줄의 `#!/bin/bash`는 바로 실행할 때 이 파일을 bash로 돌리라는 표시예요. `bash tick.sh`처럼 bash에게 파일을 읽히면 실행 권한이 없어도 돼요. 이름만 쓴 `tick.sh`는 PATH에서만 찾으니 지금 폴더에 있어도 'command not found'예요.",code:`# ~/  ← 지금 위치
# └── tick.sh
# tick.sh 내용:
#   #!/bin/bash
#   echo "똑딱"
./tick.sh
bash tick.sh
chmod +x tick.sh
./tick.sh`,trace:["`./tick.sh` → 실행 권한이 없어 → **bash: ./tick.sh: Permission denied**","`bash tick.sh` → bash가 파일을 읽어 실행하니 권한이 없어도 → **똑딱**","`chmod +x tick.sh` → 실행 권한을 줘요. 시작 상태 그림에서는 이름 뒤의 `*`로 표시해요","`./tick.sh` → 이제 첫 줄의 `#!/bin/bash`를 보고 bash로 실행 → **똑딱**"],output:`bash: ./tick.sh: Permission denied
똑딱
똑딱
`,mistake:"Permission denied를 보고 파일이 망가졌다고 생각하기. 실행 권한만 없는 거라 내용을 확인한 뒤 `chmod +x`를 주거나 `bash 파일`로 실행하면 돼요.",in_code:"AI가 'chmod +x install.sh 다음 ./install.sh'라고 안내하는 것이 이 두 단계예요. macOS의 zsh에서는 같은 오류가 `zsh: permission denied: ./tick.sh`처럼 보여요."},{type:`example`,id:`theory-sh-script-ex3`,kind:`line`,title:`B 실행이 나오는 줄`,prompt:`아래 명령 중 B 실행을 출력하는 줄을 고르세요.`,code:`# ~/
# └── kit/  ← 지금 위치
#     └── b.sh
# kit/b.sh 내용:
#   #!/bin/bash
#   echo "B 실행"
b.sh
./b.sh
bash b.sh`,output:`bash: b.sh: command not found
bash: ./b.sh: Permission denied
B 실행
`,choices:[`7`,`8`,`9`],answer:`9`,check:{type:`prints`,target:`B 실행`},feedback:{7:`지금 폴더에 있는 스크립트는 이름만 써도 실행된다고 생각했나요?`,8:`./로 실행할 때는 실행 권한이 없어도 된다고 생각했나요?`},explanation:`7번 줄은 PATH에서만 찾아 command not found, 8번 줄은 실행 권한이 없어 Permission denied예요. 9번 줄은 bash가 파일을 읽어 실행하니 권한 없이도 B 실행이 나와요.`,card:`exec`},{type:`explain`,id:`where-run`,title:`스크립트의 상대 경로는 실행한 위치 기준`,body:"스크립트 안의 `cat q.txt` 같은 상대 경로는 스크립트 파일이 있는 폴더가 아니라, 스크립트를 실행한 지금 위치에서 찾아요. `bash quiz/ask.sh`처럼 경로로 실행해도 지금 위치는 바뀌지 않아요. 그래서 스크립트가 같은 폴더의 파일을 쓴다면 먼저 그 폴더로 `cd`한 뒤 실행해요. 이때 `cd`가 성공하면 `&&`로 잇든 `;`로 잇든 결과는 같아요.",code:`# ~/  ← 지금 위치
# └── quiz/
#     ├── ask.sh
#     └── q.txt
# quiz/ask.sh 내용:
#   cat q.txt
# quiz/q.txt 내용:
#   1+1은?
bash quiz/ask.sh
cd quiz && bash ask.sh`,trace:["`bash quiz/ask.sh` → 홈에서 실행했으니 cat이 홈에서 q.txt를 찾다가 → **cat: q.txt: No such file or directory**","`cd quiz && bash ask.sh` → quiz로 옮긴 뒤 실행하니 → **1+1은?**"],output:`cat: q.txt: No such file or directory
1+1은?
`,mistake:`스크립트가 자기 파일이 있는 폴더에서 실행된다고 생각하기. 기준은 늘 터미널의 지금 위치예요.`,in_code:"AI가 만든 프로젝트 README의 '프로젝트 폴더에서 실행하세요'는 이 규칙 때문이에요. 스크립트가 'No such file or directory'를 내면 `pwd`부터 확인해요."},{type:`example`,id:`theory-sh-script-ex4`,kind:`choice`,title:`안쪽과 바깥 메시지`,prompt:`아래 명령을 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# ├── a/
# │   ├── go.sh
# │   └── msg.txt
# └── msg.txt
# a/go.sh 내용:
#   cat msg.txt
# a/msg.txt 내용:
#   안쪽
# msg.txt 내용:
#   바깥
bash a/go.sh`,output:`바깥
`,choices:[`안쪽`,`바깥`,`cat: msg.txt: No such file or directory`],answer:`바깥`,feedback:{안쪽:`스크립트 안의 상대 경로가 스크립트 파일이 있는 폴더를 기준으로 한다고 생각했나요?`,"cat: msg.txt: No such file or directory":`경로로 실행한 스크립트는 어떤 상대 경로 파일도 찾지 못한다고 생각했나요?`},explanation:`bash a/go.sh로 실행해도 지금 위치는 홈 그대로예요. 그래서 cat msg.txt는 홈의 msg.txt를 읽어 바깥을 출력해요.`,card:`where-run`},{type:`explain`,id:`source`,title:`source는 지금 셸에서 실행해요`,body:"`bash 파일`, `sh 파일`, `./파일`은 모두 새 셸(자식 셸)을 띄워 그 안에서 스크립트를 실행해요. 스크립트 안의 `cd`나 변수는 그 셸 안에서만 바뀌고, 스크립트가 끝나면 그 셸과 함께 사라져요. `source 파일`이나 `. 파일`은 지금 셸에서 줄을 하나씩 실행하므로 이동과 변수가 그대로 남아요. 가상환경을 켜는 `source .venv/bin/activate`가 source를 쓰는 이유예요.",code:`# ~/  ← 지금 위치
# ├── go.sh
# └── work/
# go.sh 내용:
#   cd work
#   STEP=2
bash go.sh
pwd
echo "[$STEP]"
source go.sh
pwd
echo "[$STEP]"`,trace:["`bash go.sh` → 자식 셸이 work로 이동하고 STEP을 만들지만, 끝나면 함께 사라져요","`pwd` → 내 셸은 그대로 → **/home/mina**",'`echo "[$STEP]"` → **[]**',"`source go.sh` → 지금 셸에서 두 줄을 실행해요","`pwd` → **/home/mina/work**",'`echo "[$STEP]"` → **[2]**'],output:`/home/mina
[]
/home/mina/work
[2]
`,mistake:"`bash go.sh`를 실행하면 스크립트 안의 `cd`가 내 터미널의 위치도 바꾼다고 생각하기. 자식 셸의 위치만 바뀌고 끝나면 사라져요.",in_code:"AI가 '`source ~/.bashrc`를 실행하세요'라고 하는 것도 설정 파일을 지금 셸에서 다시 읽어 바뀐 PATH를 바로 쓰려는 거예요. macOS의 zsh에서 `.` 명령은 `/`가 없는 이름을 PATH에서만 찾으니 `. ./go.sh`처럼 경로를 붙여요."},{type:`example`,id:`theory-sh-script-ex5`,kind:`choice`,title:`안과 밖의 변수`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# └── set.sh
# set.sh 내용:
#   LEVEL=high
#   echo "안: $LEVEL"
bash set.sh
echo "밖: $LEVEL"
. ./set.sh
echo "밖: $LEVEL"`,output:`안: high
밖: 
안: high
밖: high
`,choices:[`안: high
밖: high
안: high
밖: high`,`안: high
밖:
안: high
밖: high`,`안: high
밖:
안: high
밖:`],answer:`안: high
밖:
안: high
밖: high`,feedback:{"안: high\n밖: high\n안: high\n밖: high":`bash로 실행한 스크립트의 변수도 지금 셸에 남는다고 생각했나요?`,"안: high\n밖:\n안: high\n밖:":`. ./set.sh도 bash처럼 새 셸에서 실행된다고 생각했나요?`},explanation:`bash set.sh는 자식 셸에서 실행돼 LEVEL이 끝나면 사라지니 첫 밖:은 비어 있어요. . ./set.sh는 source와 같아서 지금 셸에 LEVEL이 남아 둘째 줄에는 밖: high가 나와요.`,card:`source`},{type:`explain`,id:`exit-e`,title:`스크립트의 성공·실패와 -e`,body:"스크립트의 종료 코드는 마지막으로 실행한 명령의 종료 코드예요. 그래서 중간 줄이 실패해도 마지막 줄이 성공하면 스크립트는 성공(0)으로 끝나요. `bash -e 파일`로 실행하거나 스크립트 맨 위에 `set -e`를 두면, 명령이 실패하는 순간 멈추고 실패로 끝나요. 지금 셸에서 `set -e`를 켜도 새로 띄우는 스크립트에는 적용되지 않아요.",code:`# ~/  ← 지금 위치
# └── job.sh
# job.sh 내용:
#   cat none.txt
#   echo "마무리"
bash job.sh; echo "코드 $?"
bash -e job.sh; echo "코드 $?"`,trace:['`bash job.sh; echo "코드 $?"` → cat이 실패해도 다음 줄 마무리가 실행되고 그 echo가 성공해서 → 오류 다음에 **마무리**, **코드 0**','`bash -e job.sh; echo "코드 $?"` → cat이 실패하는 순간 멈춰 마무리는 건너뛰고 → 오류 다음에 **코드 1**'],output:`cat: none.txt: No such file or directory
마무리
코드 0
cat: none.txt: No such file or directory
코드 1
`,mistake:`중간에 오류 메시지가 나왔으니 스크립트도 실패로 끝났다고 생각하기. 마지막 명령이 성공하면 종료 코드는 0이에요.`,in_code:"AI가 만든 스크립트 맨 위의 `set -e`(또는 `set -euo pipefail`)는 한 단계라도 실패하면 바로 멈추라는 안전장치예요."},{type:`example`,id:`theory-sh-script-ex6`,kind:`choice`,title:`마지막 줄이 실패한 스크립트`,prompt:`아래 명령을 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# └── two.sh
# two.sh 내용:
#   echo "1번"
#   cat x.txt
bash two.sh && echo "다음"`,output:`1번
cat: x.txt: No such file or directory
`,choices:[`1번
cat: x.txt: No such file or directory
다음`,`1번
cat: x.txt: No such file or directory`,`1번`,`cat: x.txt: No such file or directory`],answer:`1번
cat: x.txt: No such file or directory`,feedback:{"1번\ncat: x.txt: No such file or directory\n다음":`스크립트 안에서 성공한 명령이 하나라도 있으면 스크립트가 성공한다고 생각했나요?`,"1번":`스크립트 안에서 난 오류 메시지는 화면에 나오지 않는다고 생각했나요?`,"cat: x.txt: No such file or directory":`실패하는 줄이 있으면 스크립트가 처음부터 실행되지 않는다고 생각했나요?`},explanation:`스크립트는 1번을 출력한 뒤 cat에서 실패하고, 그 cat이 마지막 명령이라 스크립트도 실패로 끝나요. 그래서 &&가 다음을 건너뛰어요.`,card:`exit-e`},{type:`summary`,points:["`bash 파일.sh 인자…`로 실행하면 `$1`, `$2`가 인자이고, 주지 않은 인자는 빈 값이에요.",'`$#`은 인자 개수, `"$@"`는 인자를 나뉜 그대로 전부예요. 따옴표 없는 `$@`는 칸에서 다시 나뉘어요.',"`./파일`로 바로 실행하려면 `chmod +x`가 필요하고, 이름만 쓰면 PATH에서만 찾아요.",`스크립트 안의 상대 경로는 스크립트를 실행한 지금 위치를 기준으로 해요.`,"`bash`·`sh`·`./`는 자식 셸에서, `source`·`.`은 지금 셸에서 실행해 이동과 변수가 남아요.","스크립트의 종료 코드는 마지막 명령의 코드이고, `bash -e`나 `set -e`는 첫 실패에서 멈춰요."]}],covers:{"sh-script-01":[`bash-file`],"sh-script-02":[`exec`],"sh-script-03":[`where-run`],"sh-script-04":[`source`],"sh-script-05":[`all-args`],"sh-script-06":[`exit-e`]}},{id:`theory-sh-python`,version:2,concept_id:`sh-python`,title:`Python 실행 환경`,minutes:14,steps:[{type:`explain`,id:`py-cwd`,title:`Python의 지금 위치는 터미널 위치예요`,body:'`python3 파일.py`는 그 Python 파일을 실행해요. 파일을 `tool/where.py`처럼 경로로 지정해도 Python이 일하는 지금 위치(작업 폴더)는 터미널의 지금 위치 그대로예요. `os.getcwd()`가 그 위치를 알려 주고, 코드 안의 `open("data.txt")` 같은 상대 경로도 거기서 찾아요. 그래서 상대 경로로 파일을 여는 코드는 어디서 실행하느냐에 따라 성공하기도 하고 실패하기도 해요.',code:`# ~/  ← 지금 위치
# └── tool/
#     ├── where.py
#     └── words.txt
# tool/where.py 내용:
#   import os
#   print(os.getcwd())
#   print(sorted(os.listdir(".")))
python3 tool/where.py
cd tool
python3 where.py`,trace:["`# tool/where.py 내용:` → 지금 위치와, 지금 위치(`.`)에 든 이름 목록을 정렬해 출력하는 코드예요","`python3 tool/where.py` → 홈에서 경로로 실행했으니 Python의 지금 위치도 홈 → **/home/mina**, **['tool']**","`cd tool` → 터미널이 tool로 옮겨요","`python3 where.py` → 이번에는 tool이 지금 위치 → **/home/mina/tool**, **['where.py', 'words.txt']**"],output:`/home/mina
['tool']
/home/mina/tool
['where.py', 'words.txt']
`,mistake:"스크립트 파일이 있는 폴더가 Python의 지금 위치라고 생각하기. `python3 tool/where.py`로 실행해도 기준은 터미널의 지금 위치예요.",in_code:'AI가 만든 코드의 `pd.read_csv("data/input.csv")`가 FileNotFoundError를 내면 코드보다 실행 위치를 먼저 의심해요. 안내된 폴더로 `cd`한 뒤 실행하거나 `pwd`로 위치를 확인해요.'},{type:`example`,id:`theory-sh-python-ex1`,kind:`choice`,title:`두 개의 n.txt`,prompt:`아래 명령을 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# ├── lab/
# │   ├── calc.py
# │   └── n.txt
# └── n.txt
# lab/calc.py 내용:
#   print(open("n.txt").read())
# lab/n.txt 내용:
#   7
# n.txt 내용:
#   3
python3 lab/calc.py`,output:`3
`,choices:[`7`,`3`,`FileNotFoundError: [Errno 2] No such file or directory: 'n.txt'`],answer:`3`,feedback:{7:`Python이 스크립트 파일이 있는 lab 폴더에서 파일을 찾는다고 생각했나요?`,"FileNotFoundError: [Errno 2] No such file or directory: 'n.txt'":`경로로 실행한 Python은 상대 경로 파일을 하나도 찾지 못한다고 생각했나요?`},explanation:`python3 lab/calc.py로 실행해도 Python의 지금 위치는 홈이에요. 그래서 open("n.txt")는 홈의 n.txt를 열어 3을 출력해요.`,card:`py-cwd`},{type:`explain`,id:`argv`,title:`명령줄 인자는 sys.argv로`,body:'`python3 파일.py 값1 값2`처럼 파일 이름 뒤에 쓴 단어는 프로그램에 인자로 넘어가요. Python에서는 `sys.argv`가 그 목록이고, `sys.argv[0]`은 파일 이름, `sys.argv[1:]`이 인자들이에요. 셸이 먼저 띄어쓰기로 나누므로 칸이 있는 값은 `"…"`로 묶거나 `\\ `로 칸을 지켜야 한 인자가 돼요. 따옴표와 `\\`는 셸이 처리하고 지워서 프로그램에는 값만 넘어가요.',code:`# ~/  ← 지금 위치
# └── argv.py
# argv.py 내용:
#   import sys
#   for a in sys.argv[1:]:
#       print("인자:", a)
python3 argv.py 서울 "부산 해운대"
python3 argv.py 대구\\ 수성`,trace:["`# argv.py 내용:` → 파일 이름을 뺀 인자를 하나씩 '인자:'와 함께 출력해요",'`python3 argv.py 서울 "부산 해운대"` → 따옴표가 칸을 묶어 인자는 두 개 → **인자: 서울**, **인자: 부산 해운대**',"`python3 argv.py 대구\\ 수성` → `\\`가 칸을 보통 글자로 만들어 인자 하나 → **인자: 대구 수성**"],output:`인자: 서울
인자: 부산 해운대
인자: 대구 수성
`,mistake:'AI가 준 `--city "New York"`의 따옴표가 거추장스러워 지우기. 지우면 New와 York 두 인자로 나뉘어 프로그램이 값을 반만 받아요.',in_code:'AI가 만든 도구의 `python3 resize.py --width 800 "my photo.jpg"`처럼 옵션과 값도 모두 띄어쓰기로 나뉜 인자예요. 칸이 있는 파일 이름만 따옴표로 묶여 있어요.'},{type:`example`,id:`theory-sh-python-ex2`,kind:`choice`,title:`인자 개수 세기`,prompt:`아래 명령을 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# └── n.py
# n.py 내용:
#   import sys
#   print(len(sys.argv))
python3 n.py "a b" c\\ d e f`,output:`5
`,choices:[`4`,`5`,`6`,`7`],answer:`5`,feedback:{4:`sys.argv에 파일 이름은 들어가지 않는다고 생각했나요?`,6:`따옴표나 \\로 묶은 값 중 하나는 칸에서 두 인자로 나뉜다고 생각했나요?`,7:`따옴표로 묶은 a b와 \\로 이은 c d가 모두 칸마다 나뉜다고 생각했나요?`},explanation:`인자는 a b, c d, e, f 네 개이고, sys.argv에는 맨 앞에 파일 이름 n.py도 들어 있어요. len()은 목록에 든 값의 개수라 5예요.`,card:`argv`},{type:`explain`,id:`py-stderr`,title:`경고와 오류는 표준 오류로`,body:"`print()`는 기본으로 표준 출력에 쓰고, `print(…, file=sys.stderr)`는 표준 오류에 써요. 터미널 화면에는 둘 다 보이지만 `>`는 표준 출력만 파일로 보내요(출력 저장 강의). 그래서 파일로 저장했는데 화면에 글자가 남으면 대개 표준 오류예요. Python의 오류 정보(Traceback)도 표준 오류로 나와요.",code:`# ~/  ← 지금 위치
# └── step.py
# step.py 내용:
#   import sys
#   print("결과 42")
#   print("주의: 느림", file=sys.stderr)
python3 step.py > res.txt
cat res.txt
python3 step.py 2> /dev/null`,trace:["`python3 step.py > res.txt` → 결과는 파일로 가고 표준 오류인 경고만 화면에 → **주의: 느림**","`cat res.txt` → **결과 42**","`python3 step.py 2> /dev/null` → 표준 오류를 버리니 결과만 → **결과 42**"],output:`주의: 느림
결과 42
결과 42
`,mistake:"`> res.txt`로 저장했는데 화면에 '주의' 줄이 남으니 저장이 안 됐다고 생각하기. 표준 오류는 `>`가 옮기지 않아요. 함께 저장하려면 `> res.txt 2>&1`이에요.",in_code:"AI가 만든 학습 코드는 진행 막대나 경고를 표준 오류로 쓰는 경우가 많아요. `python3 train.py > out.txt`를 해도 화면에 진행 상황이 계속 보이는 이유예요."},{type:`example`,id:`theory-sh-python-ex3`,kind:`choice`,title:`중간에 멈춘 프로그램`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# └── bad.py
# bad.py 내용:
#   print("시작")
#   print(int("일"))
python3 bad.py 2> err.txt
tail -n 1 err.txt`,output:`시작
ValueError: invalid literal for int() with base 10: '일'
`,choices:[`ValueError: invalid literal for int() with base 10: '일'`,`시작`,`시작
ValueError: invalid literal for int() with base 10: '일'`],answer:`시작
ValueError: invalid literal for int() with base 10: '일'`,feedback:{"ValueError: invalid literal for int() with base 10: '일'":`오류가 나면 그 앞에서 print한 줄도 출력되지 않는다고 생각했나요?`,시작:`2> 로 보낸 오류 정보가 파일에 남지 않고 사라진다고 생각했나요?`},explanation:`시작은 표준 출력이라 화면에 나오고, int("일")에서 난 오류 정보(Traceback)는 표준 오류라 err.txt로 가요. tail -n 1이 그 마지막 줄인 ValueError 줄을 보여 줘요.`,card:`py-stderr`},{type:`explain`,id:`venv`,title:`가상환경을 켜면 python이 바뀌어요`,body:"`python3 -m venv env`는 지금 폴더에 이 프로젝트 전용 Python 환경(가상환경)을 env라는 폴더로 만들어요(흔히 `.venv`라는 숨김 이름도 써요). `source env/bin/activate`는 `env/bin`을 PATH 맨 앞에 넣어, 그 뒤 이름만 쓴 `python`·`python3`와 `pip`가 이 환경의 것을 가리키게 해요(그래서 켠 뒤의 `pip install`은 이 환경에만 설치돼요). `which`로 어느 파일이 실행되는지 확인할 수 있고, `deactivate`로 끄면 원래대로 돌아가요. 켜져 있는 동안 `$VIRTUAL_ENV`에는 환경 폴더의 경로가 들어 있고, Python 안에서는 `sys.prefix`가 지금 쓰는 환경의 위치예요.",code:`# ~/proj/  ← 지금 위치
python3 -m venv env
source env/bin/activate
echo "켜짐: $VIRTUAL_ENV"
which python3
deactivate
echo "꺼짐: $VIRTUAL_ENV"`,trace:["`python3 -m venv env` → proj 안에 가상환경 폴더 env를 만들어요. 그 안의 bin에 python, python3, pip가 들어가요","`source env/bin/activate` → 지금 셸의 PATH 맨 앞에 env/bin을 넣어요. 지금 셸을 바꿔야 해서 source로 실행해요",'`echo "켜짐: $VIRTUAL_ENV"` → **켜짐: /home/mina/proj/env**',"`which python3` → 이름만 쓴 python3가 이제 가상환경 안의 것 → **/home/mina/proj/env/bin/python3**. python과 pip도 같은 폴더의 것이에요","`deactivate` → 가상환경을 꺼요",'`echo "꺼짐: $VIRTUAL_ENV"` → 비어서 → **꺼짐:**'],output:`켜짐: /home/mina/proj/env
/home/mina/proj/env/bin/python3
꺼짐:
`,mistake:"가상환경을 만들기만 하면 켜진다고 생각하기. `python3 -m venv`는 폴더를 만들 뿐이고, `source …/activate`를 실행해야 지금 셸의 python이 바뀌어요.",in_code:"AI 안내대로 패키지를 설치했는데 ModuleNotFoundError가 나면 `which python`으로 가상환경이 켜져 있는지부터 봐요. 새 터미널을 열면 가상환경은 꺼진 상태로 시작해요."},{type:`example`,id:`theory-sh-python-ex4`,kind:`choice`,title:`켠 뒤의 pip`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/web/  ← 지금 위치
python3 -m venv venv
source venv/bin/activate
which pip3`,output:`/home/mina/web/venv/bin/pip3
`,choices:[`venv/bin/pip3`,`/home/mina/web/venv/bin/pip3`,`/usr/bin/pip3`,`/home/mina/web/venv/pip3`],answer:`/home/mina/web/venv/bin/pip3`,feedback:{"venv/bin/pip3":`which가 지금 위치에서 본 상대 경로로 보여 준다고 생각했나요?`,"/usr/bin/pip3":`가상환경을 켜도 pip3는 원래 시스템의 것이 실행된다고 생각했나요?`,"/home/mina/web/venv/pip3":`가상환경 폴더 바로 아래에 pip3가 있다고 생각했나요?`},explanation:`activate가 venv/bin을 PATH 맨 앞에 넣어서 이름만 쓴 pip3는 가상환경 안의 것이 먼저 찾아져요. which는 그 파일을 맨 위 /부터의 전체 경로로 보여 줘요.`,card:`venv`},{type:`explain`,id:`module`,title:`python3 -m으로 패키지 실행`,body:"`python3 calc/cli.py`처럼 파일 경로로 실행하면, Python은 그 파일이 있는 폴더(calc)를 모듈(가져다 쓰는 Python 파일)을 찾는 첫 자리로 써요. 그래서 그 파일 안의 `from calc import tax`는 calc 안에서 또 calc를 찾다가 ModuleNotFoundError를 내요. `python3 -m calc.cli`는 지금 위치를 찾는 자리로 쓰고, 점(.)으로 패키지(모듈을 모은 폴더) 안의 모듈을 가리켜요. 빈 `__init__.py`는 패키지라는 표시일 뿐 찾는 자리를 바꾸지 않고, `touch 파일`은 그런 빈 파일을 만드는 명령이에요.",code:`# ~/  ← 지금 위치
# └── calc/
#     ├── cli.py
#     └── tax.py
# calc/cli.py 내용:
#   from calc import tax
#   print(tax.rate)
# calc/tax.py 내용:
#   rate = 0.1
touch calc/__init__.py
python3 calc/cli.py
python3 -m calc.cli`,trace:["`touch calc/__init__.py` → 빈 `__init__.py`를 만들어요. 출력은 없어요","`python3 calc/cli.py` → 찾는 첫 자리가 calc 폴더라 그 안에서 calc를 찾지 못해 → 마지막 줄 **ModuleNotFoundError: No module named 'calc'**","`python3 -m calc.cli` → 지금 위치(홈)에서 calc 패키지의 cli를 찾아 실행 → **0.1**"],output:`Traceback (most recent call last):
  File "/home/mina/calc/cli.py", line 1, in <module>
    from calc import tax
ModuleNotFoundError: No module named 'calc'
0.1
`,mistake:"내 프로젝트 폴더의 패키지를 못 찾는 ModuleNotFoundError가 나면 `__init__.py`만 만들면 된다고 생각하기. 찾는 자리는 실행 방식이 정하므로 `python3 -m`으로 실행해야 해요.",in_code:"AI가 만든 프로젝트의 README에 `python -m src.cli`나 `python -m pytest`처럼 `-m`이 있으면 이 방식으로 실행해야 해요. `-m` 뒤에는 `.py`를 빼고 경로의 `/`를 `.`으로 바꿔 써요."},{type:`example`,id:`theory-sh-python-ex5`,kind:`choice`,title:`같은 폴더의 모듈`,prompt:`아래 명령을 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# └── kit/
#     ├── a.py
#     └── b.py
# kit/a.py 내용:
#   import b
#   print(b.n)
# kit/b.py 내용:
#   n = 5
python3 kit/a.py`,output:`5
`,choices:[`5`,`ModuleNotFoundError: No module named 'b'`,`ModuleNotFoundError: No module named 'kit'`],answer:`5`,feedback:{"ModuleNotFoundError: No module named 'b'":`파일 경로로 실행해도 그 파일이 있는 kit 폴더에서는 모듈을 찾지 않는다고 생각했나요?`,"ModuleNotFoundError: No module named 'kit'":`import b가 kit 패키지부터 찾는다고 생각했나요?`},explanation:`파일 경로로 실행하면 그 파일이 있는 kit 폴더가 모듈을 찾는 첫 자리예요. 그래서 import b는 kit 안의 b.py를 찾아 5를 출력해요.`,card:`module`},{type:`summary`,points:["`python3 파일.py`의 지금 위치는 터미널의 지금 위치라서, 코드 속 상대 경로도 거기서 찾아요.","파일 이름 뒤의 단어는 `sys.argv[1:]`로 들어오고, 칸이 있는 값은 따옴표나 `\\ `로 한 인자로 묶어요.","`print(…, file=sys.stderr)`와 Traceback은 표준 오류라 `>`로 저장해도 화면에 남아요.","가상환경은 `python3 -m venv`로 만들고 `source …/bin/activate`로 켜면 python·pip가 그 환경의 것이 되며, `deactivate`로 꺼요.","파일 경로로 실행하면 그 파일의 폴더에서 모듈을 찾고, `python3 -m 패키지.모듈`은 지금 위치에서 찾아요."]}],covers:{"sh-python-01":[`py-cwd`],"sh-python-02":[`venv`],"sh-python-03":[`module`],"sh-python-04":[`argv`],"sh-python-05":[`py-stderr`],"sh-python-06":[`venv`]}},{id:`theory-sh-text`,version:1,concept_id:`sh-text`,title:`로그·텍스트 걸러 읽기`,minutes:11,steps:[{type:`explain`,id:`grep-opts`,title:`grep으로 줄 고르기`,body:"`grep 패턴 파일`은 패턴이 든 줄을 모두 보여 줘요(출력 저장 강의에서 본 명령). `-n`을 붙이면 줄 앞에 원래 파일에서의 줄 번호를 붙이는데, 번호는 1부터 세요. `-i`는 대소문자를 가리지 않고, `-c`는 맞는 줄의 개수만, `-v`는 반대로 패턴이 없는 줄만 보여 줘요. 옵션은 `-in`처럼 붙여 쓸 수도 있어요.",code:`# ~/  ← 지금 위치
# └── login.log
# login.log 내용:
#   ok minsu
#   FAIL jiho
#   ok sora
#   fail jiho
grep -n FAIL login.log
grep -in fail login.log
grep -c ok login.log
grep -v ok login.log`,trace:["`grep -n FAIL login.log` → FAIL이 든 2번째 줄에 번호를 붙여 → **2:FAIL jiho**. 소문자 fail인 4번째 줄은 빠져요","`grep -in fail login.log` → 대소문자를 가리지 않아 두 줄 → **2:FAIL jiho**, **4:fail jiho**","`grep -c ok login.log` → 맞는 줄의 개수만 → **2**","`grep -v ok login.log` → ok가 없는 줄만 → **FAIL jiho**, **fail jiho**"],output:`2:FAIL jiho
2:FAIL jiho
4:fail jiho
2
FAIL jiho
fail jiho
`,mistake:"`-n`의 번호를 걸러진 결과 안에서 다시 센 순서라고 생각하기. 원래 파일의 줄 번호라서 1, 2가 아니라 2, 4처럼 나와요.",in_code:'AI가 오류 원인을 찾으라며 주는 `grep -n "Traceback" server.log`는 오류가 시작된 줄 번호를 알려 줘요. 그 번호 앞뒤를 보면 원인이 보여요.'},{type:`example`,id:`theory-sh-text-ex1`,kind:`choice`,title:`메뉴에서 커피 찾기`,prompt:`아래 명령을 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# └── menu.txt
# menu.txt 내용:
#   Coffee 4000
#   tea 3000
#   coffee bean
#   Juice 5000
grep -n coffee menu.txt`,output:`3:coffee bean
`,choices:[`1:Coffee 4000
3:coffee bean`,`3:coffee bean`,`1:coffee bean`,`coffee bean`],answer:`3:coffee bean`,feedback:{"1:Coffee 4000\n3:coffee bean":`grep이 대소문자를 가리지 않고 찾는다고 생각했나요?`,"1:coffee bean":`-n의 번호가 걸러진 줄 안에서 다시 센 순서라고 생각했나요?`,"coffee bean":`-n을 붙여도 줄 번호는 나오지 않는다고 생각했나요?`},explanation:`옵션 없는 grep은 대소문자를 가려서 Coffee가 든 1번째 줄은 맞지 않아요. 맞는 줄은 원래 파일의 3번째 줄이라 3:coffee bean이에요.`,card:`grep-opts`},{type:`explain`,id:`head-tail`,title:`앞뒤 줄 잘라 보기`,body:"`head -n 3 파일`은 앞의 3줄, `tail -n 3 파일`은 끝의 3줄을 보여 줘요. 파이프 `|`로 이으면 뒤 명령은 원본 파일이 아니라 앞 명령이 내보낸 줄만 받아요. 그래서 `tail -n 3 … | head -n 1`은 '끝의 세 줄 중 첫 줄', 즉 끝에서 세 번째 줄이에요. 긴 로그는 최근 기록이 끝에 쌓이므로 `tail`로 끝부분부터 보는 경우가 많아요.",code:`# ~/  ← 지금 위치
# └── steps.txt
# steps.txt 내용:
#   1 준비
#   2 빌드
#   3 시험
#   4 배포
#   5 정리
head -n 2 steps.txt
tail -n 3 steps.txt | head -n 1
head -n 4 steps.txt | tail -n 1`,trace:["`head -n 2 steps.txt` → 앞의 두 줄 → **1 준비**, **2 빌드**","`tail -n 3 steps.txt | head -n 1` → 끝의 세 줄(3·4·5) 중 첫 줄 → **3 시험**","`head -n 4 steps.txt | tail -n 1` → 앞의 네 줄 중 마지막 줄 → **4 배포**"],output:`1 준비
2 빌드
3 시험
4 배포
`,mistake:"파이프 뒤의 `head -n 1`이 파일 전체의 첫 줄을 보여 준다고 생각하기. 앞 명령이 넘긴 줄 중에서 고르니 결과가 달라져요.",in_code:"AI가 '로그 끝부분을 보여 주세요'라며 주는 `tail -n 50 server.log`는 마지막 50줄이에요. 실행 중에 계속 쌓이는 로그를 지켜볼 때는 `tail -f`를 쓰고, 멈출 때는 Ctrl+C를 눌러요."},{type:`example`,id:`theory-sh-text-ex2`,kind:`choice`,title:`순위 가운데 두 줄`,prompt:`아래 명령을 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# └── rank.txt
# rank.txt 내용:
#   1등 하늘
#   2등 바다
#   3등 들판
#   4등 숲
#   5등 강
tail -n 4 rank.txt | head -n 2`,output:`2등 바다
3등 들판
`,choices:[`1등 하늘
2등 바다`,`2등 바다
3등 들판`,`4등 숲
5등 강`],answer:`2등 바다
3등 들판`,feedback:{"1등 하늘\n2등 바다":`파이프 뒤의 head가 원본 파일의 앞 두 줄을 본다고 생각했나요?`,"4등 숲\n5등 강":`head -n 2가 받은 줄 중 마지막 두 줄을 남긴다고 생각했나요?`},explanation:`tail -n 4는 끝의 네 줄(2등~5등)을 넘기고, head -n 2는 그중 앞의 두 줄을 남겨요. 그래서 2등 바다와 3등 들판이 나와요.`,card:`head-tail`},{type:`explain`,id:`sort-uniq`,title:`정렬하고 같은 줄 합치기`,body:"`sort`는 줄을 글자 순서로 정렬하고, `uniq`는 바로 위 줄과 똑같은 줄만 하나로 합쳐요. 같은 내용이 떨어져 있으면 `uniq`가 합치지 못하니, 먼저 `sort`로 같은 줄끼리 붙여 놓아요. 줄 끝에 `|`가 있으면 명령이 다음 줄로 이어진다는 뜻이라, 긴 파이프를 여러 줄로 나눠 쓸 수 있어요. 이어 붙인 파이프 끝에 `tee 파일`을 두면 마지막 결과를 화면에 보이면서 파일에도 남겨요(출력 저장 강의).",code:`# ~/  ← 지금 위치
# └── votes.txt
# votes.txt 내용:
#   kiwi
#   plum
#   kiwi
uniq votes.txt
sort votes.txt |
  uniq`,trace:["`uniq votes.txt` → 두 kiwi가 떨어져 있어 합치지 못하고 그대로 → **kiwi**, **plum**, **kiwi**","`sort votes.txt |` → 정렬하면 kiwi, kiwi, plum이 되고, 줄 끝의 `|`라 다음 줄로 이어져요","`uniq` → 붙어 있는 kiwi 둘을 하나로 → **kiwi**, **plum**"],output:`kiwi
plum
kiwi
kiwi
plum
`,mistake:"`uniq`가 파일 전체에서 중복을 없앤다고 생각하기. 바로 붙은 같은 줄만 합치니 `sort`를 먼저 해요.",in_code:"AI가 로그에서 오류 종류를 추리라며 주는 `grep error server.log | sort | uniq -c`는 같은 줄을 모아 몇 번 나왔는지 세요(`-c`는 개수)."},{type:`example`,id:`theory-sh-text-ex3`,kind:`choice`,title:`태그 합치기`,prompt:`아래 명령을 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# └── tags.txt
# tags.txt 내용:
#   red
#   red
#   blue
#   red
uniq tags.txt`,output:`red
blue
red
`,choices:[`red
blue`,`red
blue
red`,`blue
red`,`red
red
blue
red`],answer:`red
blue
red`,feedback:{"red\nblue":`uniq가 파일 전체에서 같은 줄을 하나만 남긴다고 생각했나요?`,"blue\nred":`uniq가 먼저 정렬한 뒤 합친다고 생각했나요?`,"red\nred\nblue\nred":`uniq가 바로 붙은 같은 줄도 합치지 않는다고 생각했나요?`},explanation:`uniq는 바로 위 줄과 같은 줄만 합쳐요. 붙어 있는 두 red는 하나가 되지만, blue 뒤의 red는 떨어져 있어 그대로 남아요.`,card:`sort-uniq`},{type:`explain`,id:`cut-sortn`,title:`칸 잘라 내기와 숫자 정렬`,body:"`cut -d, -f2 파일`은 줄마다 쉼표(`,`)로 칸을 나눠 둘째 칸만 꺼내요(-d는 구분 글자, -f는 칸 번호). 옵션 없는 `sort`는 숫자도 글자로 보고 첫 글자부터 비교해서, 100이 9보다 앞에 와요. `sort -n`은 숫자 크기대로, `-r`을 더하면 거꾸로 정렬해요. 가장 큰 값은 `sort -n` 뒤의 `tail -n 1`로 구해요.",code:`# ~/  ← 지금 위치
# └── km.csv
# km.csv 내용:
#   mon,9
#   tue,12
#   wed,100
cut -d, -f2 km.csv | sort
cut -d, -f2 km.csv | sort -n`,trace:["`cut -d, -f2 km.csv | sort` → 둘째 칸 9·12·100을 글자 순서로 정렬해요. 첫 글자 1이 9보다 앞이고, 둘째 글자 0이 2보다 앞이라 → **100**, **12**, **9**","`cut -d, -f2 km.csv | sort -n` → 숫자 크기대로 → **9**, **12**, **100**"],output:`100
12
9
9
12
100
`,mistake:"`sort`가 숫자를 크기대로 정렬한다고 생각하기. 옵션이 없으면 글자 순서라 9가 100보다 뒤에 와요. 숫자 열에는 `-n`을 붙여요.",in_code:"AI가 '큰 순서로 보세요'라며 주는 `… | sort -nr | head -n 5`는 숫자 크기대로 거꾸로 정렬해 큰 값 다섯 개를 보여 줘요. 단계마다 `> 파일`로 저장하고 다음 명령이 그 파일을 읽게 나눠 써도, 파이프로 이은 것과 결과는 같아요."},{type:`example`,id:`theory-sh-text-ex4`,kind:`choice`,title:`나이 칸 정렬`,prompt:`아래 명령을 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# └── age.csv
# age.csv 내용:
#   하나,7
#   두리,30
#   세나,200
cut -d, -f2 age.csv | sort`,output:`200
30
7
`,choices:[`7
30
200`,`200
30
7`,`두리,30
세나,200
하나,7`],answer:`200
30
7`,feedback:{"7\n30\n200":`옵션 없는 sort가 숫자를 크기대로 정렬한다고 생각했나요?`,"두리,30\n세나,200\n하나,7":`cut이 칸을 나누지 않고 줄 전체를 넘긴다고 생각했나요?`},explanation:`cut이 둘째 칸 7, 30, 200을 꺼내고, 옵션 없는 sort는 첫 글자부터 비교해요. 2가 3보다, 3이 7보다 앞이라 200, 30, 7 순서가 돼요.`,card:`cut-sortn`},{type:`summary`,points:["`grep 패턴 파일`은 맞는 줄을 고르고, `-n`은 원래 줄 번호, `-i`는 대소문자 무시, `-c`는 개수, `-v`는 반대예요.","`head -n N`은 앞, `tail -n N`은 끝의 N줄이고, 파이프 뒤 명령은 앞 명령이 넘긴 줄만 받아요.","`uniq`는 바로 붙은 같은 줄만 합치니 `sort | uniq` 순서로 써요. 줄 끝의 `|`는 다음 줄로 이어져요.","`cut -d, -f2`는 쉼표로 나눈 둘째 칸을 꺼내고, 숫자 정렬은 `sort -n`이에요."]}],covers:{"sh-text-01":[`grep-opts`],"sh-text-02":[`head-tail`],"sh-text-03":[`sort-uniq`,`head-tail`],"sh-text-04":[`cut-sortn`,`head-tail`]}},{id:`theory-sh-errors`,version:2,concept_id:`sh-errors`,title:`오류 메시지 읽기`,minutes:12,steps:[{type:`explain`,id:`not-found`,title:`누가 무엇을 못 찾았나`,body:"'command not found'는 셸이 그 이름의 프로그램을 PATH에서 찾지 못했다는 뜻이고, 이때 종료 코드는 127이에요. 이름에 오타가 있거나 아직 설치하지 않은 경우가 대부분이고, 프로그램이 실행되지도 않았으니 뒤에 쓴 파일은 아직 문제가 아니에요. 반면 'python3: can't open file …'은 Python은 실행됐지만 실행할 파일을 찾지 못한 것이고(macOS에서는 맨 앞의 `python3:` 자리에 `/Library/…/python3:`처럼 Python의 긴 경로가 나오기도 해요), 메시지 속 파일 경로를 보면 어디서 찾았는지 알 수 있어요. `cat`처럼 파일을 못 찾은 명령은 보통 'No such file or directory'와 종료 코드 1을 남겨요.",code:`# ~/  ← 지금 위치
gerp 사과 list.txt
echo $?
python3 lsit.py
echo $?`,trace:["`gerp 사과 list.txt` → grep의 오타라 그런 프로그램이 없어 → **bash: gerp: command not found**","`echo $?` → 프로그램을 찾지 못하면 → **127**","`python3 lsit.py` → python3는 찾았지만 실행할 lsit.py가 홈에 없어 → `python3: can't open file '/home/mina/lsit.py': …`","`echo $?` → Python이 파일을 열지 못하면 → **2**"],output:`bash: gerp: command not found
127
python3: can't open file '/home/mina/lsit.py': [Errno 2] No such file or directory
2
`,mistake:"command not found를 보고 파일 이름이 틀렸다고 생각하기. 문제는 맨 앞의 명령 이름이에요. 오류 줄의 `bash: 이름:` 부분이 셸이 찾지 못한 이름이에요.",in_code:"AI가 준 `python` 명령이 command not found면 그 컴퓨터에는 `python3`라는 이름만 있을 수 있어요. 설치 안내를 따랐는데도 그렇다면 PATH에 그 폴더가 들어 있는지 확인해요(환경 변수 강의)."},{type:`example`,id:`theory-sh-errors-ex1`,kind:`choice`,title:`cat 오타와 이름 오타`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# └── memo.txt
# memo.txt 내용:
#   우유 사기
cta memo.txt
echo $?
cat memo
echo $?`,output:`bash: cta: command not found
127
cat: memo: No such file or directory
1
`,choices:[`bash: cta: command not found
1
cat: memo: No such file or directory
1`,`bash: memo.txt: command not found
127
cat: memo: No such file or directory
1`,`bash: cta: command not found
127
cat: memo: No such file or directory
1`,`bash: cta: command not found
127
cat: memo: No such file or directory
127`],answer:`bash: cta: command not found
127
cat: memo: No such file or directory
1`,feedback:{"bash: cta: command not found\n1\ncat: memo: No such file or directory\n1":`프로그램을 찾지 못한 경우도 파일이 없을 때처럼 1로 끝난다고 생각했나요?`,"bash: memo.txt: command not found\n127\ncat: memo: No such file or directory\n1":`셸이 찾지 못한 이름이 뒤의 파일 이름이라고 생각했나요?`,"bash: cta: command not found\n127\ncat: memo: No such file or directory\n127":`파일이 없을 때도 command not found와 같은 127이 나온다고 생각했나요?`},explanation:`cta는 cat의 오타라 셸이 프로그램을 찾지 못해 127이에요. cat memo는 cat은 실행됐지만 memo라는 파일이 없어 No such file or directory와 1이에요.`,card:`not-found`},{type:`explain`,id:`traceback`,title:`Traceback은 마지막 줄부터`,body:'Python 프로그램이 오류로 멈추면 Traceback(오류가 난 길을 보여 주는 기록)을 출력하고 종료 코드 1로 끝나요. 위쪽의 `File "…", line 2` 줄은 어느 파일 몇 번째 줄에서 났는지, 그 아래 줄은 그 코드예요. 맨 마지막 줄이 `오류종류: 이유` 형태로 무엇이 잘못됐는지 알려 줘요. Python 3.11부터는 문제 부분 아래에 `^`·`~` 표시를 붙여 짚어 주기도 해요.',code:`# ~/  ← 지금 위치
# └── score.py
# score.py 내용:
#   scores = [90, 85]
#   print(scores[2])
python3 score.py
echo $?`,trace:["`python3 score.py` → 2번 줄의 `scores[2]`(세 번째 값)를 꺼내려다 멈춰요. 값은 두 개뿐이라 마지막 줄 → **IndexError: list index out of range**","`echo $?` → 오류로 멈춘 Python은 → **1**"],output:`Traceback (most recent call last):
  File "/home/mina/score.py", line 2, in <module>
    print(scores[2])
          ~~~~~~^^^
IndexError: list index out of range
1
`,mistake:"Traceback의 첫 줄(`Traceback (most recent call last):`)에서 원인을 찾기. 그 줄은 기록이 시작된다는 머리말이고, 원인은 맨 마지막 줄에 있어요.",in_code:"AI에게 오류를 물어볼 때는 Traceback 전체를 붙여 주되, 혼자 읽을 때는 마지막 줄의 오류 종류(TypeError, FileNotFoundError 등)부터 봐요. 바로 위의 `line N`이 오류가 난 곳이고, 그 파일이 내 코드가 아니면 위쪽으로 올라가며 내 파일의 줄을 찾아요."},{type:`example`,id:`theory-sh-errors-ex2`,kind:`choice`,title:`수량 바꾸기`,prompt:`아래 명령을 실행했을 때 화면에 나오는 출력의 마지막 줄을 고르세요.`,code:`# ~/  ← 지금 위치
# └── qty.py
# qty.py 내용:
#   n = int("3천")
#   print(n * 2)
python3 qty.py`,output:`Traceback (most recent call last):
  File "/home/mina/qty.py", line 1, in <module>
    n = int("3천")
        ^^^^^^^^^^
ValueError: invalid literal for int() with base 10: '3천'
`,compare:`last-line`,choices:[`Traceback (most recent call last):`,`    n = int("3천")`,`ValueError: invalid literal for int() with base 10: '3천'`,`6`],answer:`ValueError: invalid literal for int() with base 10: '3천'`,feedback:{"Traceback (most recent call last):":`오류 기록의 머리말이 맨 마지막 줄에 나온다고 생각했나요?`,'    n = int("3천")':`오류가 난 코드 줄이 맨 마지막에 나온다고 생각했나요?`,6:`int()가 글자 속의 숫자만 골라 정수로 바꾼다고 생각했나요?`},explanation:`int("3천")은 3천을 정수로 바꿀 수 없어 멈춰요. Traceback의 맨 마지막 줄이 오류 종류와 이유인 ValueError 줄이에요.`,card:`traceback`},{type:`explain`,id:`first-error`,title:`오류가 여럿이면 맨 위부터`,body:"여러 줄을 실행했는데 오류가 여러 개 나오면 맨 위의 오류부터 봐요. 앞 단계가 실패하면 뒤 단계는 빠진 파일이나 엉뚱한 위치 때문에 연달아 실패하기 쉬워서, 첫 오류를 고치면 뒤의 오류도 함께 사라지는 경우가 많아요. 오류 줄의 맨 앞은 누가 낸 오류인지 알려 줘서, `bash:`는 셸, `cat:`은 cat, `python3:`는 Python이 낸 거예요. 셸은 `>`로 저장할 파일은 만들어도 없는 폴더는 만들지 않아서, 그럴 때는 `bash:`로 시작하는 오류가 나요.",code:`# ~/  ← 지금 위치
# ├── make.py
# └── read.py
# make.py 내용:
#   open("d.txt", "w").write("7")
# read.py 내용:
#   print(open("d.txt").read())
pyton3 make.py
python3 read.py`,trace:["`pyton3 make.py` → python3의 오타라 → **bash: pyton3: command not found**. d.txt를 만드는 단계가 실행되지 않았어요","`python3 read.py` → 만들어졌어야 할 d.txt가 없어 → 마지막 줄 **FileNotFoundError: [Errno 2] No such file or directory: 'd.txt'**"],output:`bash: pyton3: command not found
Traceback (most recent call last):
  File "/home/mina/read.py", line 1, in <module>
    print(open("d.txt").read())
          ^^^^^^^^^^^^^
FileNotFoundError: [Errno 2] No such file or directory: 'd.txt'
`,mistake:`마지막에 보인 FileNotFoundError부터 고치려 하기. 그 오류는 첫 줄의 오타 때문에 생긴 결과라, 오타를 고치면 함께 사라져요.`,in_code:`AI에게 오류를 보여 줄 때도 맨 위의 오류부터 함께 줘요. 마지막 오류만 주면 엉뚱한 곳을 고치라는 답을 받기 쉬워요.`},{type:`example`,id:`theory-sh-errors-ex3`,kind:`choice`,title:`없는 폴더에 저장`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# └── in.txt
# in.txt 내용:
#   5
cat in.txt > out/copy.txt
cat out/copy.txt`,output:`bash: out/copy.txt: No such file or directory
cat: out/copy.txt: No such file or directory
`,choices:[`5`,`bash: out/copy.txt: No such file or directory
cat: out/copy.txt: No such file or directory`,`cat: in.txt: No such file or directory
cat: out/copy.txt: No such file or directory`,`bash: out/copy.txt: No such file or directory
5`],answer:`bash: out/copy.txt: No such file or directory
cat: out/copy.txt: No such file or directory`,feedback:{5:`> 가 없는 out 폴더를 만들어 파일을 써 준다고 생각했나요?`,"cat: in.txt: No such file or directory\ncat: out/copy.txt: No such file or directory":`첫 오류가 읽으려던 in.txt 때문이라고 생각했나요?`,"bash: out/copy.txt: No such file or directory\n5":`첫 줄이 실패해도 copy.txt는 만들어진다고 생각했나요?`},explanation:`out 폴더가 없어 셸이 > out/copy.txt를 열지 못하고 bash: 오류를 내요. 그 탓에 copy.txt가 없으니 둘째 줄의 cat도 실패하는데, 원인은 첫 오류예요.`,card:`first-error`},{type:`explain`,id:`quiet-fail`,title:`조용한 실패와 숨긴 오류`,body:"`grep`은 찾는 줄이 없으면 아무것도 출력하지 않고 종료 코드 1로 끝나요. 오류 문장이 없어 실패한 것을 알아채기 어려운데, `&&`로 이은 다음 명령은 조용히 건너뛰어져요. `> /dev/null`이나 `2> /dev/null`은 화면에 보일 글자만 버릴 뿐, 종료 코드는 그대로예요. 그래서 메시지가 없을 때는 `echo $?`로 성공인지 확인해요.",code:`# ~/  ← 지금 위치
# └── list.txt
# list.txt 내용:
#   빵
#   우유
grep 쌀 list.txt
echo $?
grep 빵 list.txt > /dev/null
echo $?
cat no.txt 2> /dev/null
echo $?`,trace:["`grep 쌀 list.txt` → 쌀이 든 줄이 없어 아무것도 출력하지 않아요","`echo $?` → 못 찾으면 → **1**","`grep 빵 list.txt > /dev/null` → 찾은 줄은 버려져 안 보이지만 찾기는 성공했어요","`echo $?` → **0**","`cat no.txt 2> /dev/null` → 오류 문장만 버려지고 실패는 그대로예요","`echo $?` → **1**"],output:`1
0
1
`,mistake:"화면에 아무 오류가 없으니 성공했다고 생각하기. `grep`처럼 조용히 실패하는 명령도 있고, `/dev/null`로 오류를 숨겼을 수도 있어요.",in_code:'AI가 주는 `grep -q DONE status.txt && echo "끝남"`의 `-q`는 아무것도 출력하지 말고 종료 코드로만 알려 달라는 옵션이에요. 찾으면 0이라 뒤의 echo가 실행돼요.'},{type:`example`,id:`theory-sh-errors-ex4`,kind:`choice`,title:`금붕어 찾기`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# └── pets.txt
# pets.txt 내용:
#   고양이
#   강아지
grep 금붕어 pets.txt && echo "있음"
echo "끝 $?"`,output:`끝 1
`,choices:[`있음
끝 0`,`끝 1`,`grep: 금붕어: not found
끝 1`,`끝 0`],answer:`끝 1`,feedback:{"있음\n끝 0":`grep이 못 찾아도 오류 문장이 없으니 성공으로 끝난다고 생각했나요?`,"grep: 금붕어: not found\n끝 1":`grep이 못 찾으면 오류 문장을 출력한다고 생각했나요?`,"끝 0":`&& 뒤가 건너뛰어지면 종료 코드가 0으로 돌아간다고 생각했나요?`},explanation:`grep은 금붕어를 못 찾아 아무것도 출력하지 않고 1로 끝나서, &&가 echo "있음"을 건너뛰어요. 다음 줄의 $?에는 그 1이 남아 있어 끝 1이 나와요.`,card:`quiet-fail`},{type:`summary`,points:[`command not found는 명령 이름을 못 찾은 것(종료 코드 127)이고, No such file or directory는 파일이나 폴더가 없는 것이에요.`,"`python3: can't open file`은 실행할 .py 파일을 못 찾은 것이라, 메시지 속 경로로 어디서 찾았는지 봐요.","Traceback은 마지막 줄의 오류 종류와 이유부터 읽고, 위의 `line N`에서 위치를 찾아요.","오류가 여럿이면 맨 위부터 봐요. 오류 줄 맨 앞의 `bash:`·`cat:`·`python3:`가 누가 낸 오류인지 알려 줘요.","`grep`은 못 찾으면 조용히 1로 끝나고, `/dev/null`로 숨긴 오류도 종료 코드는 남아요."]}],covers:{"sh-errors-01":[`not-found`],"sh-errors-02":[`traceback`],"sh-errors-03":[`first-error`,`not-found`],"sh-errors-04":[`quiet-fail`,`not-found`]}},{id:`theory-sh-find`,version:2,concept_id:`sh-find`,title:`파일 찾기`,minutes:11,steps:[{type:`explain`,id:`find-name`,title:`find는 아래 폴더까지 뒤져요`,body:'`find 시작위치 -name "패턴"`은 시작 위치부터 그 아래 모든 폴더를 뒤져, 이름이 패턴에 맞는 항목을 찾아요. 결과는 이름만이 아니라 시작 위치에서부터의 경로로 한 줄에 하나씩 나와요(`.`에서 시작하면 `./`로 시작해요). 패턴은 `"*.md"`처럼 따옴표로 감싸야 셸이 먼저 펼치지 않고 find에 그대로 넘어가요. find가 내놓는 순서는 정해져 있지 않아서, 순서를 맞춰 보려면 `| sort`로 정렬해요.',code:`# ~/notes/  ← 지금 위치
# ├── a.md
# ├── b.txt
# └── old/
#     └── c.md
find . -name "*.md" | sort
find old -name "*.md"`,trace:['`find . -name "*.md" | sort` → 지금 폴더(.)부터 old 안까지 뒤져 → **./a.md**, **./old/c.md**','`find old -name "*.md"` → old에서 시작하니 경로도 old로 시작 → **old/c.md**'],output:`./a.md
./old/c.md
old/c.md
`,mistake:"find가 `ls`처럼 지금 폴더만 본다고 생각하기. 아래 폴더까지 모두 뒤지고, 찾은 것마다 경로를 붙여 보여 줘요.",in_code:`AI가 '설정 파일이 어디 있는지 찾아보세요'라며 주는 \`find ~ -name "*.yaml"\`은 홈 아래 전체에서 .yaml 파일을 찾아요. 범위가 넓으면 오래 걸리니 시작 위치를 좁혀요.`},{type:`example`,id:`theory-sh-find-ex1`,kind:`choice`,title:`자바스크립트 파일 찾기`,prompt:`아래 명령을 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/web/  ← 지금 위치
# ├── css/
# │   └── main.css
# ├── index.html
# └── js/
#     └── app.js
find . -name "*.js"`,output:`./js/app.js
`,choices:[`app.js`,`./js/app.js`,`js/app.js`,`./app.js`],answer:`./js/app.js`,feedback:{"app.js":`find가 경로 없이 이름만 보여 준다고 생각했나요?`,"js/app.js":`시작 위치를 .으로 줘도 결과 앞에 ./가 붙지 않는다고 생각했나요?`,"./app.js":`find가 찾은 파일을 시작 위치 바로 아래 있는 것처럼 보여 준다고 생각했나요?`},explanation:`find는 시작 위치 .부터 js 폴더 안까지 뒤져 app.js를 찾아요. 결과는 시작 위치에서부터의 경로라 ./js/app.js예요.`,card:`find-name`},{type:`explain`,id:`find-type`,title:`폴더만, 파일만 고르기`,body:'`-type d`는 폴더(directory)만, `-type f`는 파일(file)만 고르는 조건이고, 조건 없이 쓰면 폴더와 파일을 모두 내놓아요. find는 시작 위치 자신도 검사하므로, `-type d`로 찾으면 시작 위치도 한 줄로 나와요(`.`에서 시작했다면 `.`). `-type f -name "*.md"`처럼 조건을 이어 쓰면 모두 맞는 것만 골라요.',code:`# ~/  ← 지금 위치
# └── notes/
#     ├── a.md
#     └── old/
#         └── c.md
find notes -type d | sort
find notes -type f | sort`,trace:["`find notes -type d | sort` → 시작 위치 notes 자신도 폴더라 함께 → **notes**, **notes/old**","`find notes -type f | sort` → 파일만 → **notes/a.md**, **notes/old/c.md**"],output:`notes
notes/old
notes/a.md
notes/old/c.md
`,mistake:`시작 위치는 결과에 나오지 않는다고 생각하기. find는 시작 위치도 검사해서, 조건에 맞으면 첫 줄에 나와요.`,in_code:'AI가 주는 `find . -type f -name "*.pyc" -delete`처럼 `-type f`를 함께 쓰면 이름이 맞는 폴더는 건드리지 않고 파일만 골라요.'},{type:`example`,id:`theory-sh-find-ex2`,kind:`choice`,title:`웹 폴더의 폴더들`,prompt:`아래 명령을 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# └── web/
#     ├── css/
#     ├── index.html
#     └── js/
#         └── app.js
find web -type d | sort`,output:`web
web/css
web/js
`,choices:[`web/css
web/js`,`web
web/css
web/js`,`css
js`,`web
web/css
web/index.html
web/js
web/js/app.js`],answer:`web
web/css
web/js`,feedback:{"web/css\nweb/js":`시작 위치 web은 결과에 나오지 않는다고 생각했나요?`,"css\njs":`find가 경로 없이 폴더 이름만 보여 준다고 생각했나요?`,"web\nweb/css\nweb/index.html\nweb/js\nweb/js/app.js":`-type d를 붙여도 파일까지 모두 나온다고 생각했나요?`},explanation:`-type d는 폴더만 골라요. 시작 위치 web 자신도 폴더라 첫 줄에 나오고, 그 아래 css와 js가 경로와 함께 나와요.`,card:`find-type`},{type:`explain`,id:`find-act`,title:`찾은 것을 지우거나 넘기기`,body:"find 뒤에 `-delete`를 붙이면 찾은 것을 바로 지우고, `-exec 명령 {} +`는 찾은 경로들을 `{}` 자리에 넣어 그 명령을 실행해요. 둘 다 아래 폴더 속의 파일까지 처리해요. 반면 `rm 폴더/*.tmp`의 `*`는 그 폴더 바로 아래만 펼쳐서 더 안쪽 폴더의 파일은 남고, `rm -r 폴더`는 폴더째 지워서 남길 파일까지 사라져요. 지우기 전에는 `-delete`나 `-exec` 없이 find만 먼저 실행해 대상을 눈으로 확인해요.",code:`# ~/cam/  ← 지금 위치
# ├── a.tmp
# ├── pic.jpg
# └── sub/
#     └── b.tmp
find . -name "*.tmp" | sort
find . -name "*.tmp" -exec rm {} +
find . | sort`,trace:['`find . -name "*.tmp" | sort` → 지우기 전에 대상부터 확인 → **./a.tmp**, **./sub/b.tmp**','`find . -name "*.tmp" -exec rm {} +` → 찾은 두 경로를 `{}` 자리에 넣어 `rm ./a.tmp ./sub/b.tmp`를 실행해요. `-delete`를 붙여도 결과는 같아요',"`find . | sort` → 조건 없이 모두 → **.**, **./pic.jpg**, **./sub**. sub 안의 b.tmp도 지워졌어요"],output:`./a.tmp
./sub/b.tmp
.
./pic.jpg
./sub
`,mistake:"`rm *.tmp`도 아래 폴더까지 지운다고 생각하기. `*`는 지금 폴더 바로 아래 이름만 펼쳐서 sub/b.tmp는 남아요.",in_code:'AI가 주는 `find . -name "__pycache__" -type d -exec rm -r {} +`는 곳곳의 캐시 폴더를 한 번에 지워요. 실행 전에 `-exec` 부분을 빼고 돌려 목록부터 확인해요.'},{type:`example`,id:`theory-sh-find-ex3`,kind:`choice`,title:`빌드 찌꺼기 지우기`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/build/  ← 지금 위치
# ├── a.o
# ├── lib/
# │   └── b.o
# └── main.c
rm *.o
find . -name "*.o"
echo "끝"`,output:`./lib/b.o
끝
`,choices:[`끝`,`./lib/b.o
끝`,`./a.o
./lib/b.o
끝`,`lib/b.o
끝`],answer:`./lib/b.o
끝`,feedback:{끝:`*.o가 아래 폴더의 .o 파일까지 펼쳐져 모두 지워진다고 생각했나요?`,"./a.o\n./lib/b.o\n끝":`rm이 지운 파일도 find가 찾아낸다고 생각했나요?`,"lib/b.o\n끝":`.에서 시작한 find의 결과에는 ./가 붙지 않는다고 생각했나요?`},explanation:`rm *.o의 *는 지금 폴더 바로 아래의 a.o만 펼쳐서 그것만 지워요. 아래 폴더까지 뒤지는 find는 남은 ./lib/b.o를 찾아요.`,card:`find-act`},{type:`explain`,id:`find-quote`,title:`find의 패턴은 따옴표로 감싸요`,body:'`find . -name *.md`처럼 따옴표 없이 쓰면, find가 실행되기 전에 셸이 지금 폴더에서 `*.md`를 먼저 펼쳐요. 지금 폴더에 맞는 파일이 a.md 하나뿐이면 명령이 `find . -name a.md`가 되어, 아래 폴더에서도 이름이 a.md인 것만 찾아요. 지금 폴더에 맞는 파일이 없으면 우연히 잘 동작하고 여러 개면 오류가 나서, 실수를 알아채기 어려워요. 그래서 find의 패턴은 늘 `"*.md"`처럼 감싸요.',code:`# ~/notes/  ← 지금 위치
# ├── a.md
# └── old/
#     ├── a.md
#     └── c.md
find . -name *.md | sort
find . -name "*.md" | sort`,trace:["`find . -name *.md | sort` → 셸이 먼저 `*.md`를 지금 폴더의 a.md로 바꿔 `find . -name a.md`가 돼요 → **./a.md**, **./old/a.md**. c.md는 못 찾아요",'`find . -name "*.md" | sort` → 패턴이 그대로 넘어가 → **./a.md**, **./old/a.md**, **./old/c.md**'],output:`./a.md
./old/a.md
./a.md
./old/a.md
./old/c.md
`,mistake:"따옴표가 없어도 find가 `*`를 알아서 해석한다고 생각하기. find가 받기 전에 셸이 먼저 바꿔 버려요. `echo *.md`로 찍어 보면 셸이 무엇으로 바꾸는지 보여요.",in_code:'AI가 준 `find . -name *.log -delete`처럼 따옴표가 빠진 명령은 지금 폴더 상태에 따라 일부 파일만 지우거나, 오류를 내고 아무것도 지우지 못할 수 있어요. `"*.log"`로 감싸서 실행해요.'},{type:`example`,id:`theory-sh-find-ex4`,kind:`line`,title:`y/z.csv가 나오는 줄`,prompt:`아래 명령 중 y/z.csv 한 줄을 출력하는 줄을 고르세요.`,code:`# ~/
# └── box/  ← 지금 위치
#     ├── memo.md
#     ├── x.csv
#     └── y/
#         └── z.csv
find y -name *.csv
find y -name "*.csv"
find . -name "*.csv" | sort`,output:`y/z.csv
./x.csv
./y/z.csv
`,choices:[`7`,`8`,`9`],answer:`8`,check:{type:`prints`,target:`y/z.csv`},feedback:{7:`따옴표가 없어도 *.csv가 find에 패턴 그대로 넘어간다고 생각했나요?`,9:`find가 시작 위치와 상관없이 같은 모양의 경로를 보여 준다고 생각했나요?`},explanation:`7번 줄의 *.csv는 셸이 먼저 지금 폴더의 x.csv로 바꿔서, y 안에서 x.csv를 찾다 아무것도 나오지 않아요. 9번 줄은 .에서 시작해 ./x.csv와 ./y/z.csv 두 줄이 나오고, 8번 줄만 y/z.csv 한 줄이에요.`,card:`find-quote`},{type:`summary`,points:['`find 위치 -name "패턴"`은 아래 폴더까지 뒤져 시작 위치부터의 경로로 보여 주고, 순서를 맞추려면 `| sort`를 붙여요.',"`-type d`는 폴더만, `-type f`는 파일만 고르고, 시작 위치 자신도 결과에 들어가요.","`-delete`와 `-exec 명령 {} +`는 아래 폴더의 것까지 처리하고, `rm 폴더/*`의 `*`는 바로 아래만 펼쳐요.",'패턴을 따옴표 없이 쓰면 셸이 먼저 지금 폴더에서 펼치니 늘 `"*.txt"`처럼 감싸요.']}],covers:{"sh-find-01":[`find-name`],"sh-find-02":[`find-type`],"sh-find-03":[`find-act`,`find-type`],"sh-find-04":[`find-quote`,`find-type`]}},{id:`theory-sh-subst`,version:1,concept_id:`sh-subst`,title:`명령 결과 이어 쓰기`,minutes:10,steps:[{type:`explain`,id:`subst`,title:`$( )는 명령의 출력으로 바뀌어요`,body:"`$(명령)`을 쓰면 셸이 먼저 괄호 안의 명령을 실행하고, 그 자리를 그 명령이 출력한 내용으로 바꿔요(명령 치환). 그래서 `v=$(cat 파일)`은 파일 내용을 변수 v에 담고, 출력 끝의 줄바꿈은 빼고 담아요. 큰따옴표 안에서도 바뀌지만, 작은따옴표 안에서는 `$( )`도 글자 그대로예요.",code:`# ~/  ← 지금 위치
# └── ver.txt
# ver.txt 내용:
#   1.4.2
v=$(cat ver.txt)
echo "버전 $v 배포"
mkdir "v$(cat ver.txt)"
ls
echo '그대로: $(cat ver.txt)'`,trace:["`v=$(cat ver.txt)` → 괄호 안의 cat을 먼저 실행해 나온 1.4.2를 v에 담아요(끝의 줄바꿈은 빠져요)",'`echo "버전 $v 배포"` → **버전 1.4.2 배포**','`mkdir "v$(cat ver.txt)"` → 그 자리가 1.4.2로 바뀌어 v1.4.2라는 폴더를 만들어요',"`ls` → **v1.4.2  ver.txt**","`echo '그대로: $(cat ver.txt)'` → 작은따옴표 안이라 실행하지 않고 → **그대로: $(cat ver.txt)**"],output:`버전 1.4.2 배포
v1.4.2  ver.txt
그대로: $(cat ver.txt)
`,mistake:"`v=cat ver.txt`처럼 `$( )` 없이 쓰기. 셸은 `v=cat`을 명령 앞에 붙인 변수로 보고 ver.txt를 명령으로 실행하려다 command not found를 내요. 명령의 출력을 담으려면 `$( )`로 감싸요.",in_code:'AI가 주는 `cp server.log "server_$(date +%F).log"`는 오늘 날짜(예: 2026-11-11)를 이름에 넣어 사본을 만들어요. `$( )` 안의 date가 날짜를 출력하고 그 자리를 채워요.'},{type:`example`,id:`theory-sh-subst-ex1`,kind:`choice`,title:`숫자 뒤에 0 붙이기`,prompt:`아래 명령을 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# └── n.txt
# n.txt 내용:
#   12
echo "합: $(cat n.txt)0"`,output:`합: 120
`,choices:[`합: 12
0`,`합: 120`,`합: $(cat n.txt)0`,`합: cat n.txt0`],answer:`합: 120`,feedback:{"합: 12\n0":`$( )가 출력 끝의 줄바꿈까지 그대로 넣는다고 생각했나요?`,"합: $(cat n.txt)0":`큰따옴표 안에서는 $( )가 실행되지 않는다고 생각했나요?`,"합: cat n.txt0":`$( )가 명령을 실행하지 않고 명령 글자를 그대로 넣는다고 생각했나요?`},explanation:`$(cat n.txt)는 파일 내용 12로 바뀌고 끝의 줄바꿈은 빠져요. 그래서 바로 뒤의 0이 붙어 합: 120이 돼요.`,card:`subst`},{type:`example`,id:`theory-sh-subst-ex2`,kind:`line`,title:`하늘이 나오는 줄`,prompt:`아래 명령 중 하늘을 출력하는 줄을 고르세요.`,code:`# ~/  ← 지금 위치
# └── name.txt
# name.txt 내용:
#   하늘
echo '$(cat name.txt)'
echo "$(cat name.txt)"
echo "(cat name.txt)"
echo "$cat name.txt"`,output:`$(cat name.txt)
하늘
(cat name.txt)
 name.txt
`,choices:[`5`,`6`,`7`,`8`],answer:`6`,check:{type:`prints`,target:`하늘`},feedback:{5:`작은따옴표 안의 $( )도 실행된다고 생각했나요?`,7:`$ 없이 괄호만 써도 명령이 실행된다고 생각했나요?`,8:`$cat처럼 쓰면 cat 명령을 실행한다고 생각했나요?`},explanation:`6번 줄만 큰따옴표 안의 $( )가 cat을 실행해 하늘로 바뀌어요. 5번 줄은 작은따옴표라 글자 그대로, 7번 줄은 $가 없어 괄호까지 글자 그대로예요. 8번 줄의 $cat은 만든 적 없는 변수라 빈 값이 되고 name.txt만 남아요.`,card:`subst`},{type:`explain`,id:`args-pipe`,title:`파이프는 내용, 인자는 대상`,body:"파이프 `|`는 앞 명령의 출력을 뒤 명령의 입력(내용)으로 넘기고, 인자는 명령에게 무엇을 처리할지 알려 줘요. `cat`은 인자로 받은 파일을 열어 보여 주지만, 파이프로 받은 글자는 그 글자 자체를 출력할 뿐이에요. 그래서 이름 목록을 파일로 다루려면 `cat $(ls *.txt)`처럼 `$( )`로 인자에 넣거나, `xargs`로 받은 글자를 인자로 바꿔 넘겨요. 이름에 칸이 있으면 이 둘은 이름이 나뉘니, 셸이 직접 펼치는 `cat *.txt`가 가장 안전해요.",code:`# ~/  ← 지금 위치
# ├── p1.txt
# └── p2.txt
# p1.txt 내용:
#   봄
# p2.txt 내용:
#   여름
ls p*.txt | cat
ls p*.txt | xargs cat
cat $(ls p*.txt)`,trace:["`ls p*.txt | cat` → cat은 파이프로 받은 이름 글자를 그대로 출력할 뿐 → **p1.txt**, **p2.txt**","`ls p*.txt | xargs cat` → xargs가 받은 이름들을 cat의 인자로 붙여 `cat p1.txt p2.txt`를 실행 → **봄**, **여름**","`cat $(ls p*.txt)` → `$( )` 자리가 두 이름으로 바뀌어 같은 명령 → **봄**, **여름**"],output:`p1.txt
p2.txt
봄
여름
봄
여름
`,mistake:"`ls | cat`이 목록의 파일을 열어 준다고 생각하기. 파이프는 글자(내용)를 넘길 뿐, 열 파일을 알려 주지 않아요. `echo *.txt | cat`도 이름 글자만 나와요.",in_code:'AI가 주는 `find . -name "*.log" | xargs rm`은 찾은 경로들을 rm의 인자로 넘겨 지워요. 이름에 칸이 있으면 잘못 나뉘니 `find … -exec rm {} +`가 더 안전해요.'},{type:`example`,id:`theory-sh-subst-ex3`,kind:`choice`,title:`목록 파일 속 이름`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# ├── fruit.txt
# └── list.txt
# fruit.txt 내용:
#   사과
# list.txt 내용:
#   fruit.txt
cat list.txt | cat
cat list.txt | xargs cat`,output:`fruit.txt
사과
`,choices:[`사과
사과`,`fruit.txt
사과`,`fruit.txt
fruit.txt`],answer:`fruit.txt
사과`,feedback:{"사과\n사과":`파이프로 받은 글자가 파일 이름이면 cat이 그 파일을 연다고 생각했나요?`,"fruit.txt\nfruit.txt":`xargs가 받은 글자를 인자로 바꾸지 않고 내용으로 그대로 넘긴다고 생각했나요?`},explanation:`첫 줄의 뒤쪽 cat은 파이프로 받은 글자 fruit.txt를 그대로 출력해요. 둘째 줄은 xargs가 그 글자를 인자로 바꿔 cat fruit.txt를 실행하니 사과가 나와요.`,card:`args-pipe`},{type:`explain`,id:`subst-err`,title:`$( )는 표준 출력만 담아요`,body:"`$( )`가 담는 것은 명령의 표준 출력뿐이에요. 명령이 실패하며 낸 오류 문장은 표준 오류라서 변수에 들어가지 않고, 그 자리에서 바로 화면에 나와요. 오류 문장까지 담으려면 괄호 안에 `2>&1`을 붙여 표준 오류를 표준 출력으로 합쳐요(출력 저장 강의).",code:`# ~/  ← 지금 위치
r=$(cat gone.txt)
echo "담긴 값: [$r]"
r=$(cat gone.txt 2>&1)
echo "담긴 값: [$r]"`,trace:["`r=$(cat gone.txt)` → 오류 문장은 표준 오류라 담기지 않고 화면에 바로 → **cat: gone.txt: No such file or directory**",'`echo "담긴 값: [$r]"` → r은 비어 있어 → **담긴 값: []**',"`r=$(cat gone.txt 2>&1)` → 괄호 안에서 오류를 출력 쪽으로 합쳐 담아요. 화면에는 안 나와요",'`echo "담긴 값: [$r]"` → **담긴 값: [cat: gone.txt: No such file or directory]**'],output:`cat: gone.txt: No such file or directory
담긴 값: []
담긴 값: [cat: gone.txt: No such file or directory]
`,mistake:"명령이 실패하면 `$( )`에 오류 문장이 담길 거라고 생각하기. 담기는 건 표준 출력뿐이라, 실패하면 대개 빈 값이에요.",in_code:"AI가 쓴 스크립트의 `out=$(python3 test.py 2>&1)`은 결과와 오류를 모두 변수에 담아 나중에 함께 보여 주려는 거예요."},{type:`example`,id:`theory-sh-subst-ex4`,kind:`choice`,title:`하나는 있고 하나는 없을 때`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 내용을 고르세요.`,code:`# ~/  ← 지금 위치
# └── ok.txt
# ok.txt 내용:
#   하나
x=$(cat ok.txt no.txt)
echo "[$x]"`,output:`cat: no.txt: No such file or directory
[하나]
`,choices:[`[하나
cat: no.txt: No such file or directory]`,`cat: no.txt: No such file or directory
[]`,`cat: no.txt: No such file or directory
[하나]`,`[하나]`],answer:`cat: no.txt: No such file or directory
[하나]`,feedback:{"[하나\ncat: no.txt: No such file or directory]":`$( )가 오류 문장까지 함께 담는다고 생각했나요?`,"cat: no.txt: No such file or directory\n[]":`명령 중 하나라도 실패하면 정상 출력도 담기지 않는다고 생각했나요?`,"[하나]":`$( ) 안에서 난 오류는 화면에 나오지 않는다고 생각했나요?`},explanation:`cat은 ok.txt의 하나를 표준 출력으로 내고 no.txt의 오류는 표준 오류로 내요. $( )는 표준 출력만 담으니 x는 하나이고, 오류 문장은 바로 화면에 먼저 나와요.`,card:`subst-err`},{type:`summary`,points:["`$(명령)`은 명령의 출력으로 바뀌고 끝의 줄바꿈은 빠져요. 큰따옴표 안에서도 바뀌지만 작은따옴표 안에서는 글자 그대로예요.","파이프는 내용을, 인자는 처리할 대상을 넘겨요. 이름 목록을 인자로 바꾸려면 `$( )`나 `xargs`를 쓰고, 칸이 있는 이름에는 `cat *.txt`처럼 셸이 직접 펼치게 해요.","`$( )`는 표준 출력만 담아요. 오류까지 담으려면 괄호 안에 `2>&1`을 붙여요."]}],covers:{"sh-subst-01":[`subst`],"sh-subst-02":[`subst`],"sh-subst-03":[`args-pipe`],"sh-subst-04":[`subst-err`]}}]};export{e as default};