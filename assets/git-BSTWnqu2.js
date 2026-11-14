var e={schema_version:1,track_id:`git`,lang:`bash`,lessons:[{id:`theory-git-status`,version:2,concept_id:`git-status`,title:`저장소와 상태`,minutes:18,steps:[{type:`explain`,id:`terminal`,title:`터미널 명령과 시작 상태`,body:"터미널은 글자로 명령을 입력해 컴퓨터를 다루는 창이고, 명령은 언제나 '지금 위치'(지금 들어가 있는 폴더)에서 실행돼요. 코드 맨 위의 `#` 줄은 실행되지 않는 시작 상태 그림이에요. `~`는 내 홈 폴더이고, `└──` 줄은 폴더 안의 파일, `내용:` 아래 줄은 그 파일에 든 글이에요. `pwd`는 지금 위치를, `ls`는 파일 목록을, `cat 파일`은 파일 내용을 보여 줘요. `echo \"글\" > 파일`은 그 글로 파일을 새로 쓰고, `>>`는 파일 끝에 한 줄을 더해요.",code:`# ~/trip/  ← 지금 위치
# └── route.txt
# route.txt 내용:
#   부산
pwd
echo "경주" >> route.txt
echo "KTX 9시" > ticket.txt
ls
cat route.txt`,trace:["`# ~/trip/  ← 지금 위치`와 아래 세 줄 → 실행되지 않는 시작 상태예요. 홈 폴더의 trip 폴더 안에서 시작하고, route.txt에는 부산 한 줄이 있어요","`pwd` → 지금 위치의 전체 경로를 보여 줘요. 이 강의의 홈 폴더 `~`는 /home/mina라서 → **/home/mina/trip**",'`echo "경주" >> route.txt` → `>>`라서 route.txt 끝에 경주 한 줄을 더해요. 화면에는 아무것도 나오지 않아요','`echo "KTX 9시" > ticket.txt` → `>`라서 ticket.txt를 이 글 한 줄로 새로 써요. 없던 파일이라 새로 생겨요',"`ls` → 지금 폴더의 파일 목록 → **route.txt  ticket.txt**","`cat route.txt` → 파일 내용을 그대로 보여 줘요 → **부산**과 **경주** 두 줄"],output:`/home/mina/trip
route.txt  ticket.txt
부산
경주
`,mistake:"`>`와 `>>`를 헷갈리기. 이미 있는 파일에 `>`를 쓰면 원래 내용이 모두 지워지고 새 글 한 줄만 남아요.",in_code:'AI가 "설정 파일 끝에 이 줄을 추가하세요"라며 `echo "…" >> 파일`을 주는 경우가 많아요. 화살표가 하나(`>`)면 파일 전체를 덮어쓰는 명령이니 실행하기 전에 개수를 꼭 확인해요.'},{type:`example`,id:`theory-git-status-ex1`,kind:`choice`,title:`짐 목록 파일`,prompt:`아래 명령을 차례로 실행했을 때 화면에 나오는 출력을 고르세요.`,code:`# ~/camp/  ← 지금 위치
# └── bag.txt
# bag.txt 내용:
#   수건
echo "랜턴" >> bag.txt
echo "모기약" > bag.txt
cat bag.txt`,choices:[`모기약`,`수건
랜턴
모기약`,`랜턴
모기약`,`수건
모기약`],answer:`모기약`,feedback:{"수건\n랜턴\n모기약":`화살표 하나(>)도 두 개(>>)처럼 파일 끝에 한 줄을 더한다고 생각했나요?`,"랜턴\n모기약":`화살표 하나(>)와 두 개(>>)의 뜻을 서로 바꿔 생각했나요?`,"수건\n모기약":`화살표 하나(>)가 바로 앞에 더한 줄만 바꿔 쓴다고 생각했나요?`},explanation:"`>>`는 수건 아래에 랜턴을 더하지만, 이어지는 `>`는 bag.txt 전체를 모기약 한 줄로 새로 써요. 그래서 cat에는 모기약만 나와요.",card:`terminal`,output:`모기약
`},{type:`explain`,id:`repo`,title:`Git과 저장소`,body:"Git은 폴더 속 파일이 어떻게 바뀌어 왔는지 기록해 두는 프로그램이에요. Git이 기록을 맡은 폴더를 저장소(repository)라고 하고, `git init`이 지금 폴더를 저장소로 만들어요. 기록은 이때 생기는 숨김 폴더 `.git` 안에 쌓여요. 이름이 `.`으로 시작하는 항목은 숨김이라 `ls`에는 안 보이고 `ls -a`(all, 모두)에서만 보여요.",code:`# ~/trip/  ← 지금 위치
# └── route.txt
git init
ls
ls -a`,trace:["`git init` → trip 폴더를 저장소로 만들고, 빈 저장소를 만들었다고 영어로 알려 줘요 → **Initialized empty Git repository in /home/mina/trip/.git/**. 따로 설정하지 않은 Git은 이 줄 앞에 기록 줄기의 기본 이름을 master로 쓴다는 `hint:` 안내를 여러 줄 더 보여 주는데, 오류가 아니에요","`ls` → 숨김 항목은 빼고 보여 줘서 → **route.txt**","`ls -a` → 숨김까지 모두 보여 줘요. `.`은 지금 폴더, `..`은 한 단계 위 폴더를 뜻하는 이름이고, 기록을 담을 `.git`이 새로 생겼어요 → **.  ..  .git  route.txt**"],output:`Initialized empty Git repository in /home/mina/trip/.git/
route.txt
.  ..  .git  route.txt
`,mistake:"`.git`을 지워도 되는 설정 폴더로 생각하기. 모든 기록이 그 안에 있어서, 지우면 저장소의 기록이 전부 사라지고 평범한 폴더로 돌아가요.",in_code:'`git init`은 `.git`만 만들고 다른 파일은 건드리지 않아요. 무시할 파일 목록인 `.gitignore`도 만들지 않으니 필요하면 직접 만들어요. AI가 "저장소를 처음부터 다시 만들자"며 `.git`을 지우라고 하면 지금까지의 기록을 버리자는 뜻이에요.'},{type:`explain`,id:`stage`,title:`add로 담고 commit으로 남겨요`,body:'커밋(commit)은 그 순간 파일들의 모습을 메시지와 함께 남긴 기록 한 장이에요. 커밋은 두 단계로 만들어요. `git add 파일`이 다음 커밋에 넣을 파일을 스테이지(커밋 대기 목록)에 올리고, `git commit -m "메시지"`가 스테이지에 올라간 것만 커밋으로 남겨요. 그래서 순서는 init → add → commit이고, add하지 않은 파일은 커밋에 들어가지 않아요. `git ls-files`는 Git이 관리(추적)하는 파일 목록이에요.',code:`# ~/trip/  ← 지금 위치
# ├── budget.txt
# └── route.txt
# route.txt 내용:
#   부산
git init
git add route.txt
git commit -m "경로 기록"
git ls-files; ls`,trace:["`git init` → trip 폴더를 저장소로 만들어요","`git add route.txt` → route.txt만 스테이지에 올려요. 화면에는 아무것도 나오지 않아요",'`git commit -m "경로 기록"` → 스테이지의 route.txt로 첫 커밋을 만들어요 → **[main (root-commit) …] 경로 기록**. main은 기록의 줄기 이름(따로 설정하지 않은 Git에서는 master로 나와요), root-commit은 첫 커밋이라는 뜻이고, 그 뒤 7자리 번호(해시)는 커밋마다 붙는 이름이라 컴퓨터마다 달라요. 아래 두 줄은 파일 1개에 1줄이 더해졌다는 요약과, 새 파일이 기록됐다는 표시(create mode)예요',"`git ls-files; ls` → `;`는 두 명령을 차례로 실행해요. Git의 관리 목록에는 **route.txt**만, 폴더에는 **budget.txt  route.txt**가 있어요. add하지 않은 budget.txt는 커밋에 들어가지 않았어요"],output:`Initialized empty Git repository in /home/mina/trip/.git/
[main (root-commit) 3eec89b] 경로 기록
 1 file changed, 1 insertion(+)
 create mode 100644 route.txt
route.txt
budget.txt  route.txt
`,mistake:"add 없이 바로 commit하기. 스테이지가 비어 있으면 `nothing added to commit`이라며 커밋이 만들어지지 않아요. `git init` 전에 add하면 저장소가 아니라는 `fatal: not a git repository` 오류가 나요.",in_code:'처음 쓰는 컴퓨터에서는 커밋 전에 `git config --global user.name "이름"`과 `git config --global user.email "메일"`로 작성자를 정해요. 정하지 않으면 commit이 `Please tell me who you are` 오류로 멈춰요.'},{type:`example`,id:`theory-git-status-ex2`,kind:`line`,title:`저장소가 아니라는 오류`,prompt:`아래 명령 중 fatal: not a git repository (or any of the parent directories): .git 오류를 출력하는 줄을 고르세요.`,code:`# ~/photo/  ← 지금 위치
# └── list.txt
# list.txt 내용:
#   제주
git add list.txt
git init
git add list.txt
git commit -m "사진 목록"`,choices:[`5`,`6`,`7`,`8`],answer:`5`,check:{type:`prints`,target:`fatal: not a git repository (or any of the parent directories): .git`},feedback:{6:`이미 파일이 있는 폴더에서는 git init이 실패한다고 생각했나요?`,7:`git init을 한 뒤에도 아직 저장소가 아니라고 생각했나요?`,8:`add는 저장소 없이도 되고 commit만 저장소가 필요하다고 생각했나요?`},explanation:`add·commit 같은 명령은 저장소 안에서만 동작해요. 5번 줄의 add는 아직 git init 전이라 저장소를 찾지 못해 이 오류를 내고, 6번 줄에서 저장소가 생긴 뒤의 add와 commit은 정상으로 실행돼요.`,card:`stage`,output:`fatal: not a git repository (or any of the parent directories): .git
Initialized empty Git repository in /home/mina/photo/.git/
[main (root-commit) c138f80] 사진 목록
 1 file changed, 1 insertion(+)
 create mode 100644 list.txt
`},{type:`explain`,id:`short`,title:`status --short의 두 칸`,body:"`git status --short`는 바뀐 파일만 한 줄씩 보여 주고, 이름 앞의 두 칸에 상태를 적어요. 첫째 칸은 스테이지, 둘째 칸은 작업 폴더(내가 파일을 고치는 실제 폴더)의 상태예요. `M`은 고친 파일(modified), `A`는 새로 올린 파일(added), `??`는 Git이 아직 추적하지 않는(untracked) 새 파일이고, 바뀌지 않은 파일은 나오지 않아요. 시작 상태의 `커밋됨` 줄은 그림 속 파일이 모두 커밋돼 이미 추적 중이라는 뜻이에요.",code:`# ~/trip/  ← 지금 위치
# ├── budget.txt
# └── route.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "여행 준비"로 커밋됨
echo "기차표" > ticket.txt
git status --short
git add ticket.txt
echo "경주" >> route.txt
git status --short
git add route.txt; git status -s`,compare:`exact`,trace:['`echo "기차표" > ticket.txt` → Git이 처음 보는 새 파일을 만들어요',"`git status --short` → 추적하지 않는 새 파일 → **?? ticket.txt**. 그대로인 budget.txt와 route.txt는 나오지 않아요","`git add ticket.txt` → 새 파일을 스테이지에 올려요",'`echo "경주" >> route.txt` → 이미 추적 중인 route.txt를 고쳐요',"`git status --short` → route.txt는 add 전이라 첫째 칸이 비고 둘째 칸에 **M**, ticket.txt는 첫째 칸에 **A**","`git add route.txt; git status -s` → route.txt의 M이 첫째 칸으로 옮겨 가요. `-s`는 `--short`를 줄여 쓴 것이에요"],output:`?? ticket.txt
 M route.txt
A  ticket.txt
M  route.txt
A  ticket.txt
`,mistake:`M만 보고 커밋에 들어간다고 생각하기. 첫째 칸이 비고 둘째 칸에만 M이 있으면 아직 add 전이라, 이대로 커밋하면 그 수정은 빠져요.`,in_code:"AI가 파일을 고쳐 준 뒤에는 먼저 `git status --short`로 무엇이 바뀌었는지 확인해요. ??로 보이는 파일은 AI가 새로 만든 파일이라 add하지 않으면 커밋에 들어가지 않아요."},{type:`example`,id:`theory-git-status-ex3`,kind:`choice`,title:`고친 파일만 올렸을 때`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/camp/  ← 지금 위치
# ├── food.txt
# └── tent.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "캠핑 준비"로 커밋됨
echo "버너" > gear.txt
echo "라면" >> food.txt
git add food.txt
git status --short`,compare:`exact`,choices:[`M  food.txt
?? gear.txt`,`M  food.txt
A  gear.txt`,`A  food.txt
?? gear.txt`,`MM food.txt
?? gear.txt`],answer:`M  food.txt
?? gear.txt`,feedback:{"M  food.txt\nA  gear.txt":`다른 파일을 add하면 add하지 않은 새 파일도 함께 A로 표시된다고 생각했나요?`,"A  food.txt\n?? gear.txt":`이미 추적 중인 파일도 add하면 새 파일처럼 A로 표시된다고 생각했나요?`,"MM food.txt\n?? gear.txt":`add한 파일은 스테이지와 작업 폴더 두 칸에 모두 M이 붙는다고 생각했나요?`},explanation:`food.txt는 고친 뒤 add까지 해서 첫째 칸에 M이 붙어요. gear.txt는 add하지 않은 새 파일이라 ??로 남고, 바뀌지 않은 tent.txt는 나오지 않아요.`,card:`short`,output:`M  food.txt
?? gear.txt
`},{type:`example`,id:`theory-git-status-ex4`,kind:`choice`,title:`커밋 뒤의 관리 목록`,prompt:`아래 명령을 차례로 실행했을 때 마지막 줄의 출력을 고르세요.`,code:`# ~/photo/  ← 지금 위치
# ├── list.txt
# └── memo.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "사진 목록"으로 커밋됨
echo "보정" > edit.txt
echo "바다" >> list.txt
git add edit.txt
git commit -m "보정 메모"
git status --short; git ls-files`,capture:`last`,compare:`exact`,choices:[` M list.txt
edit.txt
list.txt
memo.txt`,`edit.txt
list.txt
memo.txt`,` M list.txt
list.txt
memo.txt`,` M list.txt
?? edit.txt
list.txt
memo.txt`],answer:` M list.txt
edit.txt
list.txt
memo.txt`,feedback:{"edit.txt\nlist.txt\nmemo.txt":`commit이 add하지 않은 수정까지 함께 기록한다고 생각했나요?`," M list.txt\nlist.txt\nmemo.txt":`새로 만든 파일은 커밋해도 관리 목록에 들어가지 않는다고 생각했나요?`," M list.txt\n?? edit.txt\nlist.txt\nmemo.txt":`커밋한 새 파일도 계속 ??로 남는다고 생각했나요?`},explanation:`커밋에는 add로 올린 edit.txt만 들어가서 관리 목록에 edit.txt가 더해져요. add하지 않은 list.txt의 수정은 커밋에서 빠져 여전히 M으로 남아요.`,card:`stage`,output:` M list.txt
edit.txt
list.txt
memo.txt
`},{type:`explain`,id:`snapshot`,title:`add는 그 순간의 내용을 담아요`,body:"`git add`는 파일 이름을 적어 두는 게 아니라, 실행한 순간의 내용을 스테이지에 복사해 둬요. 그 뒤에 파일을 또 고치면 스테이지에는 옛 내용, 작업 폴더에는 새 내용이 있어 두 칸 모두에 글자가 붙어요. 이미 추적하던 파일이면 `MM`, add로 처음 올린 새 파일이면 `AM`이에요. `git add .`의 `.`은 지금 폴더라서 그 안의 고친 파일과 새 파일을 한 번에 올려요. 고친 내용까지 커밋하려면 다시 add해요.",code:`# ~/trip/  ← 지금 위치
# └── route.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "여행 준비"로 커밋됨
echo "경주" >> route.txt
echo "기차표" > ticket.txt
git add .
echo "포항" >> route.txt
echo "왕복" >> ticket.txt
git status --short`,compare:`exact`,trace:['`echo "경주" >> route.txt` → 커밋된 파일을 고쳐요','`echo "기차표" > ticket.txt` → 새 파일을 만들어요',"`git add .` → 지금 폴더의 변경을 모두 올려요. 이 순간의 내용(경주까지 쓴 route.txt, 기차표 한 줄인 ticket.txt)이 스테이지에 복사돼요",'`echo "포항" >> route.txt` → 작업 폴더의 route.txt에만 포항이 더해져요','`echo "왕복" >> ticket.txt` → 작업 폴더의 ticket.txt에만 왕복이 더해져요',"`git status --short` → 두 칸이 모두 차서 → **MM route.txt**, 새 파일은 → **AM ticket.txt**"],output:`MM route.txt
AM ticket.txt
`,mistake:`add한 파일은 그 뒤의 수정도 따라간다고 생각하기. 이대로 커밋하면 포항과 왕복은 빠지고 add한 순간의 내용만 기록돼요.`,in_code:"AI에게 커밋을 맡기기 직전에 파일을 또 고쳤다면 `git status --short`에서 두 칸이 모두 찼는지 확인해요. MM이나 AM이면 다시 `git add`해야 마지막 수정까지 들어가요."},{type:`example`,id:`theory-git-status-ex5`,kind:`line`,title:`AM이 나오는 줄`,prompt:`아래 명령 중 AM gear.txt를 출력하는 줄을 고르세요.`,code:`# ~/camp/  ← 지금 위치
# └── food.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "캠핑 준비"로 커밋됨
echo "버너" > gear.txt
git status --short
git add gear.txt
git status --short
echo "가스" >> gear.txt
git status --short`,choices:[`6`,`8`,`10`],answer:`10`,check:{type:`prints`,target:`AM gear.txt`},feedback:{6:`새로 만든 파일이 처음부터 A와 M 두 표시를 함께 받는다고 생각했나요?`,8:`add하자마자 스테이지와 작업 폴더 두 칸에 모두 표시가 붙는다고 생각했나요?`},explanation:`6번 줄은 아직 add 전이라 ?? gear.txt, 8번 줄은 add한 순간의 내용만 있어 첫째 칸에만 A가 붙어요. 9번 줄에서 add 뒤에 또 고쳐 작업 폴더가 스테이지와 달라졌으니 10번 줄에서 AM gear.txt가 나와요.`,card:`snapshot`,output:`?? gear.txt
A  gear.txt
AM gear.txt
`},{type:`explain`,id:`add-scope`,title:`add로 올릴 범위 고르기`,body:"`git add` 뒤에 쓴 이름만 스테이지에 올라가요. `*.txt`의 `*`는 '아무 글자나'라는 뜻이라, Git이 실행되기 전에 셸(명령을 읽는 프로그램)이 이름이 .txt로 끝나는 파일들로 바꿔 넣어요. `git add -A`는 `git add .`처럼 새 파일까지 올리되 저장소 전체를 올려요. 잘못 올린 파일은 `git restore --staged 파일`로 스테이지에서만 내리고, 고친 내용은 그대로 남아요. `A && B`는 A가 성공했을 때만 B를 이어서 실행해요.",code:`# ~/trip/  ← 지금 위치
# └── route.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "여행 준비"로 커밋됨
echo "경주" >> route.txt
echo "숙소" > hotel.txt
echo "임시" > draft.tmp
git add *.txt && git status --short
git restore --staged hotel.txt
git status --short`,compare:`exact`,trace:['`echo "경주" >> route.txt` → 추적 중인 파일을 고쳐요','`echo "숙소" > hotel.txt` → 새 파일 hotel.txt를 만들어요','`echo "임시" > draft.tmp` → 이름이 .tmp로 끝나는 새 파일을 만들어요',"`git add *.txt && git status --short` → 셸이 `*.txt`를 hotel.txt route.txt로 바꿔 두 파일만 올리고, add가 성공했으니 이어서 status를 보여 줘요 → **A  hotel.txt**, **M  route.txt**, **?? draft.tmp**","`git restore --staged hotel.txt` → hotel.txt를 스테이지에서만 내려요. 파일과 내용은 그대로예요","`git status --short` → 내려온 새 파일은 다시 **?? hotel.txt**, route.txt는 그대로 스테이지에 있어요"],output:`A  hotel.txt
M  route.txt
?? draft.tmp
M  route.txt
?? draft.tmp
?? hotel.txt
`,mistake:"`git add .`이나 `-A`가 고친 파일만 올린다고 생각하기. 새로 만든 파일까지 모두 올라가서, 로그나 메모처럼 커밋하면 안 되는 파일이 함께 들어갈 수 있어요.",in_code:"AI는 `git add .`이나 `git add -A`로 한 번에 올리라고 안내할 때가 많아요. 그 뒤 `git status --short`에서 올리면 안 되는 파일이 첫째 칸에 보이면 `git restore --staged 파일`로 그 파일만 내리면 돼요."},{type:`example`,id:`theory-git-status-ex6`,kind:`choice`,title:`이름으로 고른 파일만`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/camp/  ← 지금 위치
# └── food.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "캠핑 준비"로 커밋됨
echo "라면" >> food.txt
echo "버너" > gear.txt
echo "지도" > map.md
git add *.txt
git status --short`,compare:`exact`,choices:[`M  food.txt
A  gear.txt
?? map.md`,`M  food.txt
?? gear.txt
?? map.md`,`?? map.md`,`M  food.txt
A  gear.txt
A  map.md`],answer:`M  food.txt
A  gear.txt
?? map.md`,feedback:{"M  food.txt\n?? gear.txt\n?? map.md":`*.txt가 이미 추적 중인 파일에만 맞는다고 생각했나요?`,"?? map.md":`스테이지에 올린 파일은 status에서 사라진다고 생각했나요?`,"M  food.txt\nA  gear.txt\nA  map.md":`*.txt의 *가 확장자까지 아무 이름에나 맞는다고 생각했나요?`},explanation:`셸이 *.txt를 food.txt gear.txt로 바꿔 넣어서 두 파일만 스테이지에 올라가요. 이름이 .md로 끝나는 map.md는 맞지 않아 ??로 남아요.`,card:`add-scope`,output:`M  food.txt
A  gear.txt
?? map.md
`},{type:`summary`,points:["명령은 지금 위치에서 실행돼요. `ls`는 목록, `ls -a`는 숨김까지, `cat`은 내용, `>`는 새로 쓰기, `>>`는 끝에 더하기예요.","`git init`은 지금 폴더를 저장소로 만들고, 기록을 담을 숨김 폴더 `.git`을 만들어요.","커밋은 init → `git add` → `git commit -m` 순서로 만들고, 스테이지에 올린 것만 기록돼요. `git ls-files`는 Git이 관리하는 파일 목록이에요.","`git status --short`의 첫째 칸은 스테이지, 둘째 칸은 작업 폴더예요. `??`는 추적하지 않는 새 파일, `A`는 새로 올린 파일, `M`은 고친 파일이에요.","add는 그 순간의 내용을 담아서, 그 뒤에 또 고치면 `MM`이나 `AM`이 돼요.","`git add .`과 `-A`는 새 파일까지 올리고, `*.txt`는 셸이 파일 이름으로 펼쳐요. 잘못 올린 파일은 `git restore --staged`로 내려요."]}],covers:{"git-status-01":[`repo`,`stage`],"git-status-02":[`terminal`,`short`],"git-status-03":[`stage`,`snapshot`,`add-scope`],"git-status-04":[`terminal`,`stage`,`short`],"git-status-05":[`repo`],"git-status-06":[`short`,`snapshot`],"git-status-07":[`short`,`snapshot`,`add-scope`]}},{id:`theory-git-commit`,version:2,concept_id:`git-commit`,title:`커밋과 기록`,minutes:17,steps:[{type:`explain`,id:`log`,title:`git log는 최신 커밋부터`,body:"`git log`는 커밋 기록을 가장 최근 것부터 거꾸로 보여 줘요. 그냥 쓰면 커밋마다 고유 번호(해시), 작성자(Author), 날짜(Date), 메시지가 여러 줄로 나와요. `--oneline`은 짧은 해시와 메시지를 한 줄씩, `--format=%s`는 메시지만 보여 줘요. `-1`, `-2`처럼 숫자를 붙이면 최근 커밋을 그 개수만큼만 보여 줘요. 해시는 내용·작성자·시각으로 만든 번호라 컴퓨터마다 달라요.",code:`# ~/recipe/  ← 지금 위치
# └── soup.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "국 레시피"로 커밋됨
echo "소금 조금" >> soup.txt
git add soup.txt
git commit -m "간 맞추기"
git log -1
git log --oneline
git log --format=%s`,trace:['`echo "소금 조금" >> soup.txt` → soup.txt를 고쳐요',"`git add soup.txt` → 고친 내용을 스테이지에 올려요",'`git commit -m "간 맞추기"` → 두 번째 커밋을 만들어요. 출력의 7자리 해시는 컴퓨터마다 달라요',"`git log -1` → 최근 커밋 1개를 자세히 → `commit` 뒤의 긴 해시, 작성자 **Author: mina**, 날짜, 들여 쓴 메시지 **간 맞추기**","`git log --oneline` → 커밋마다 짧은 해시와 메시지 한 줄. 맨 위가 방금 만든 **간 맞추기**, 맨 아래가 처음 커밋한 **국 레시피**. 실제 터미널에서는 맨 위 줄 해시 뒤에 지금 위치를 알리는 `(HEAD -> main)` 표시도 붙어요","`git log --format=%s` → 메시지(subject)만 최신순으로 → **간 맞추기**, **국 레시피**"],output:`[main e3bce8d] 간 맞추기
 1 file changed, 1 insertion(+)
commit e3bce8db7478a0482e5729321e6eb9a8f6ed7421
Author: mina <mina@example.com>
Date:   Thu Oct 29 09:00:00 2026 +0900

    간 맞추기
e3bce8d 간 맞추기
a5c705f 국 레시피
간 맞추기
국 레시피
`,mistake:`맨 위 줄을 가장 오래된 커밋으로 읽기. log는 최신순이라 맨 위가 방금 만든 커밋이고 맨 아래가 첫 커밋이에요.`,in_code:'AI가 "직전 커밋"이나 "마지막 커밋"이라고 하면 `git log --oneline`의 맨 위 줄을 가리켜요. 커밋을 해시로 가리킬 때는 앞 7자리만 써도 되지만, 그 번호는 꼭 내 컴퓨터의 출력에서 읽어요.'},{type:`example`,id:`theory-git-commit-ex1`,kind:`choice`,title:`최근 두 커밋`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/recipe/  ← 지금 위치
# └── soup.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "국 레시피"로 커밋됨
echo "두부" >> soup.txt
git add soup.txt
git commit -m "두부 넣기"
echo "버섯" >> soup.txt
git add soup.txt
git commit -m "버섯 넣기"
git log --format=%s -2`,capture:`last`,choices:[`버섯 넣기
두부 넣기`,`두부 넣기
버섯 넣기`,`국 레시피`,`버섯 넣기
두부 넣기
국 레시피`],answer:`버섯 넣기
두부 넣기`,feedback:{"두부 넣기\n버섯 넣기":`log가 오래된 커밋부터 차례로 보여 준다고 생각했나요?`,"국 레시피":`-2가 최근 커밋 두 개를 건너뛰고 나머지를 보여 준다고 생각했나요?`,"버섯 넣기\n두부 넣기\n국 레시피":`-2를 붙여도 기록 전체가 나온다고 생각했나요?`},explanation:`커밋은 국 레시피, 두부 넣기, 버섯 넣기 순서로 쌓였어요. log는 최신순이고 -2는 최근 두 개만 보여 주니 버섯 넣기, 두부 넣기가 나와요.`,card:`log`,output:`버섯 넣기
두부 넣기
`},{type:`explain`,id:`head-file`,title:`HEAD와 커밋:파일`,body:"HEAD는 지금 브랜치(1강에서 본 main 같은 기록의 줄기)의 가장 최근 커밋을 가리키는 이름이에요. `git show HEAD:파일`은 그 커밋에 기록된 파일 내용을 그대로 보여 주고, 작업 폴더는 건드리지 않아요. 커밋은 바뀐 줄만이 아니라 그 순간 파일 전체의 모습을 기록해요. 1강에서 본 것처럼 add는 그 순간의 내용을 담으니, add한 뒤나 커밋한 뒤에 고친 줄은 이 명령에 나오지 않아요.",code:`# ~/recipe/  ← 지금 위치
# └── soup.txt
# soup.txt 내용:
#   물 3컵
# 지금 위치는 git 저장소입니다.
# 위 파일은 "국 레시피"로 커밋됨
echo "소금 조금" >> soup.txt
git add soup.txt
git commit -m "간 맞추기"
echo "후추 약간" >> soup.txt
git show HEAD:soup.txt
cat soup.txt`,trace:['`echo "소금 조금" >> soup.txt` → soup.txt에 한 줄을 더해요',"`git add soup.txt` → 물 3컵, 소금 조금 두 줄인 지금 내용을 스테이지에 복사해요",'`git commit -m "간 맞추기"` → 스테이지의 내용으로 커밋해요(해시는 컴퓨터마다 달라요). 이제 HEAD는 이 커밋이에요','`echo "후추 약간" >> soup.txt` → 작업 폴더의 파일에만 한 줄을 더해요',"`git show HEAD:soup.txt` → HEAD에 기록된 soup.txt 전체 → **물 3컵**, **소금 조금**","`cat soup.txt` → 작업 폴더의 지금 파일 → 후추 약간까지 세 줄"],output:`[main 3f3fe67] 간 맞추기
 1 file changed, 1 insertion(+)
물 3컵
소금 조금
물 3컵
소금 조금
후추 약간
`,mistake:"커밋에는 그때 더한 줄만 들어 있다고 생각하기. `git show HEAD:soup.txt`로 보면 처음부터 있던 물 3컵까지 파일 전체가 나와요.",in_code:"AI가 파일을 망가뜨린 것 같을 때 `git show HEAD:파일`로 마지막 커밋의 내용을 먼저 확인할 수 있어요. 화면에 보여 주기만 하고 파일을 바꾸지 않으니 안전해요."},{type:`example`,id:`theory-git-commit-ex2`,kind:`choice`,title:`커밋한 뒤에 바꾼 파일`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/recipe/  ← 지금 위치
# └── tea.txt
# tea.txt 내용:
#   녹차 1봉
# 지금 위치는 git 저장소입니다.
# 위 파일은 "차 레시피"로 커밋됨
echo "꿀 1스푼" >> tea.txt
git add tea.txt
git commit -m "꿀 추가"
echo "레몬 1조각" > tea.txt
git show HEAD:tea.txt`,capture:`last`,choices:[`녹차 1봉
꿀 1스푼`,`레몬 1조각`,`꿀 1스푼`,`녹차 1봉`],answer:`녹차 1봉
꿀 1스푼`,feedback:{"레몬 1조각":`HEAD:파일이 작업 폴더의 지금 파일을 보여 준다고 생각했나요?`,"꿀 1스푼":`커밋에는 그때 더한 줄만 기록된다고 생각했나요?`,"녹차 1봉":`HEAD가 맨 처음 커밋을 가리킨다고 생각했나요?`},explanation:`HEAD는 마지막 커밋인 꿀 추가이고, 그 커밋에는 녹차 1봉과 꿀 1스푼 두 줄이 기록됐어요. 그 뒤 >로 바꾼 레몬 1조각은 작업 폴더에만 있어요.`,card:`head-file`,output:`녹차 1봉
꿀 1스푼
`},{type:`explain`,id:`commit-a`,title:`commit -a는 추적 중인 파일만`,body:'`git commit -a`는 이미 추적 중인 파일의 수정을 자동으로 add한 뒤 커밋해요. `-am "메시지"`는 `-a`와 `-m`을 붙여 쓴 것이에요. 한 번도 add한 적 없는 새 파일은 `-a`가 건드리지 않아서 커밋 뒤에도 ??로 남아요. `git show --name-only --format= HEAD`는 마지막 커밋이 바꾼 파일 이름만 보여 줘요(`--format=` 뒤를 비우면 커밋 정보 줄이 빠져요).',code:`# ~/recipe/  ← 지금 위치
# └── soup.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "국 레시피"로 커밋됨
echo "소금 조금" >> soup.txt
echo "밥 1공기" > rice.txt
git commit -am "소금 넣기"
git show --name-only --format= HEAD
git status --short`,trace:['`echo "소금 조금" >> soup.txt` → 추적 중인 파일을 고쳐요','`echo "밥 1공기" > rice.txt` → 새 파일을 만들어요','`git commit -am "소금 넣기"` → 추적 중인 soup.txt의 수정만 자동으로 add해 커밋해요 → **1 file changed**(해시는 컴퓨터마다 달라요)',"`git show --name-only --format= HEAD` → 마지막 커밋이 바꾼 파일 → **soup.txt**뿐이에요","`git status --short` → rice.txt는 커밋에서 빠져 → **?? rice.txt**"],output:`[main 7a4e725] 소금 넣기
 1 file changed, 1 insertion(+)
soup.txt
?? rice.txt
`,mistake:"`-a`가 새 파일까지 올린다고 생각하기. `-a`는 Git이 이미 아는 파일만 다뤄서, 새 파일은 먼저 `git add`로 올려야 해요.",in_code:'AI가 "`git commit -am`으로 한 번에 커밋하세요"라고 안내해도, AI가 새로 만든 파일이 있다면 먼저 `git add`해야 해요. 커밋 뒤 `git status --short`에 ??가 남았는지 보면 빠진 파일을 찾을 수 있어요.'},{type:`example`,id:`theory-git-commit-ex3`,kind:`choice`,title:`마지막 커밋에 담긴 파일`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/recipe/  ← 지금 위치
# ├── soup.txt
# └── tea.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "레시피 모음"으로 커밋됨
echo "얼음" >> tea.txt
echo "식초 1스푼" > salad.txt
git commit -am "아이스티"
git show --name-only --format= HEAD`,capture:`last`,choices:[`tea.txt`,`salad.txt
tea.txt`,`soup.txt
tea.txt`,`salad.txt`],answer:`tea.txt`,feedback:{"salad.txt\ntea.txt":`-a가 새로 만든 파일까지 자동으로 add한다고 생각했나요?`,"soup.txt\ntea.txt":`커밋에 바뀌지 않은 파일 이름까지 모두 나온다고 생각했나요?`,"salad.txt":`-a가 새 파일만 골라 커밋한다고 생각했나요?`},explanation:`-a는 이미 추적 중인 tea.txt의 수정만 자동으로 add해요. 새로 만든 salad.txt는 add한 적이 없어 커밋에 들어가지 않고, 바뀌지 않은 soup.txt도 나오지 않아요.`,card:`commit-a`,output:`tea.txt
`},{type:`explain`,id:`log-path`,title:`한 파일을 바꾼 커밋만 보기`,body:"`git log` 뒤에 파일 경로를 주면 그 파일을 바꾼 커밋만 최신순으로 보여 줘요. 파일을 처음 기록한 커밋도 그 파일을 바꾼 커밋에 들어가요. 경로 앞의 `--`는 '여기부터는 파일 경로'라는 표시라, 지금 있는 파일이면 빼도 결과가 같지만 지워진 파일이나 브랜치와 이름이 같은 파일에는 꼭 필요해요. `-2` 같은 숫자는 파일과 상관없이 최근 커밋의 개수만 정해요.",code:`# ~/recipe/  ← 지금 위치
# ├── rice.txt
# └── soup.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "레시피 모음"으로 커밋됨
echo "물 2컵" >> rice.txt
git commit -am "밥 물"
echo "소금" >> soup.txt
git commit -am "국 간"
git log --format=%s -- rice.txt
git log --format=%s -2`,trace:['`echo "물 2컵" >> rice.txt` → rice.txt를 고쳐요','`git commit -am "밥 물"` → rice.txt를 바꾼 커밋 **밥 물**(해시는 컴퓨터마다 달라요)','`echo "소금" >> soup.txt` → 이번에는 soup.txt를 고쳐요','`git commit -am "국 간"` → soup.txt만 바꾼 커밋 **국 간**',"`git log --format=%s -- rice.txt` → rice.txt를 바꾼 커밋만 → **밥 물**과, 파일을 처음 기록한 **레시피 모음**","`git log --format=%s -2` → 파일과 상관없이 최근 두 개 → **국 간**, **밥 물**"],output:`[main db8d415] 밥 물
 1 file changed, 1 insertion(+)
[main 2ba711d] 국 간
 1 file changed, 1 insertion(+)
밥 물
레시피 모음
국 간
밥 물
`,mistake:"`-2`가 그 파일의 최근 커밋 두 개를 고른다고 생각하기. 숫자는 개수만 정하고, 파일로 고르려면 경로를 줘야 해요.",in_code:"AI가 고친 파일이 언제 어떻게 바뀌었는지 볼 때 `git log --oneline -- 파일경로`가 첫 단계예요. 두 방법을 합친 `git log -3 -- 파일`은 그 파일을 바꾼 최근 커밋 세 개예요."},{type:`example`,id:`theory-git-commit-ex4`,kind:`choice`,title:`차 파일의 기록`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/recipe/  ← 지금 위치
# ├── soup.txt
# └── tea.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "레시피 모음"으로 커밋됨
echo "얼음" >> tea.txt
git commit -am "아이스티"
echo "두부" >> soup.txt
git commit -am "두부 넣기"
git log --format=%s -- tea.txt`,capture:`last`,choices:[`아이스티
레시피 모음`,`아이스티`,`두부 넣기
아이스티
레시피 모음`,`레시피 모음
아이스티`],answer:`아이스티
레시피 모음`,feedback:{아이스티:`파일을 처음 기록한 커밋은 그 파일을 바꾼 커밋에서 빠진다고 생각했나요?`,"두부 넣기\n아이스티\n레시피 모음":`경로를 줘도 모든 커밋이 나온다고 생각했나요?`,"레시피 모음\n아이스티":`경로를 주면 오래된 커밋부터 보여 준다고 생각했나요?`},explanation:`tea.txt는 처음 기록한 레시피 모음과 얼음을 더한 아이스티에서 바뀌었어요. 두부 넣기는 soup.txt만 바꿔서 빠지고, 순서는 최신순이에요.`,card:`log-path`,output:`아이스티
레시피 모음
`},{type:`explain`,id:`amend`,title:`마지막 커밋 고쳐 쓰기`,body:'`git commit`은 실행할 때마다 새 커밋을 하나 더 쌓아요. 방금 만든 커밋에 빠뜨린 파일을 합치려면 그 파일을 add한 뒤 `git commit --amend --no-edit`를 써요. `--amend`는 마지막 커밋을 스테이지의 내용까지 합친 새 커밋으로 바꾸고, `--no-edit`는 메시지를 그대로 둬요. 메시지를 바꾸려면 `--no-edit` 대신 `-m "새 메시지"`를 줘요.',code:`# ~/recipe/  ← 지금 위치
# └── soup.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "국 레시피"로 커밋됨
echo "소금" >> soup.txt
git commit -am "국 간"
echo "김" > side.txt
git add side.txt
git commit --amend --no-edit
git log --format=%s`,trace:['`echo "소금" >> soup.txt` → soup.txt를 고쳐요','`git commit -am "국 간"` → 커밋 **국 간**을 만들어요','`echo "김" > side.txt` → 빠뜨린 새 파일을 만들어요',"`git add side.txt` → 새 파일을 스테이지에 올려요","`git commit --amend --no-edit` → 마지막 커밋을 바꿔 써요. 해시가 새로 바뀌고 **2 files changed**, 두 파일이 한 커밋에 담겨요. `Date:` 줄은 처음 커밋한 시각을 그대로 쓴다는 뜻이에요","`git log --format=%s` → 커밋 수는 그대로 → **국 간**, **국 레시피**"],output:`[main f848c23] 국 간
 1 file changed, 1 insertion(+)
[main d46922b] 국 간
 Date: Thu Oct 29 09:00:00 2026 +0900
 2 files changed, 2 insertions(+)
 create mode 100644 side.txt
국 간
국 레시피
`,mistake:"빠뜨린 파일을 합치려고 `git commit -m`을 다시 실행하기. 같은 메시지의 커밋이 하나 더 쌓이고, 마지막 커밋에는 새 파일만 담겨요.",in_code:'`--amend`는 마지막 커밋을 새 커밋으로 바꾸기 때문에 이미 다른 사람과 공유한(서버에 올린) 커밋에는 쓰지 않아요. AI가 "커밋 메시지를 고치려면 `git commit --amend -m`"이라고 안내하면 아직 올리지 않은 커밋인지 먼저 확인해요.'},{type:`example`,id:`theory-git-commit-ex5`,kind:`choice`,title:`메시지만 바꾸기`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/recipe/  ← 지금 위치
# └── soup.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "국 레시피"로 커밋됨
echo "두부" >> soup.txt
git commit -am "두부 넣기"
git commit --amend -m "두부 반 모"
git log --format=%s`,capture:`last`,choices:[`두부 반 모
국 레시피`,`두부 반 모
두부 넣기
국 레시피`,`두부 넣기
국 레시피`,`두부 반 모`],answer:`두부 반 모
국 레시피`,feedback:{"두부 반 모\n두부 넣기\n국 레시피":`--amend가 마지막 커밋 위에 새 커밋을 하나 더 쌓는다고 생각했나요?`,"두부 넣기\n국 레시피":`--amend에 -m을 줘도 메시지는 바뀌지 않는다고 생각했나요?`,"두부 반 모":`--amend가 그 전 기록까지 모두 하나로 합친다고 생각했나요?`},explanation:`--amend는 마지막 커밋 두부 넣기를 메시지가 두부 반 모인 새 커밋으로 바꿔 써요. 커밋 수는 그대로라 국 레시피 위에 하나만 있어요.`,card:`amend`,output:`두부 반 모
국 레시피
`},{type:`explain`,id:`split`,title:`한 번에 고친 파일 나눠 커밋하기`,body:"`git commit`은 그 순간 스테이지에 담긴 것을 모두 한 커밋으로 만들어요. 그래서 여러 파일을 한 번에 고쳤어도 add와 commit을 번갈아 실행하면 파일마다 따로 커밋할 수 있어요. 둘 다 먼저 add하면 첫 커밋에 함께 들어가고, 이어지는 commit은 담을 것이 없어 만들어지지 않아요. log는 최신순이라 나중에 만든 커밋이 위에 와요.",code:`# ~/recipe/  ← 지금 위치
# ├── rice.txt
# └── soup.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "레시피 모음"으로 커밋됨
echo "소금" >> soup.txt
echo "물 2컵" >> rice.txt
git add soup.txt
git commit -m "국 간"
git add rice.txt
git commit -m "밥 물"`,trace:['`echo "소금" >> soup.txt` → 첫 번째 파일을 고쳐요','`echo "물 2컵" >> rice.txt` → 두 번째 파일도 고쳐요',"`git add soup.txt` → soup.txt만 스테이지에 올려요",'`git commit -m "국 간"` → 스테이지에 있던 soup.txt만 커밋 → **1 file changed**',"`git add rice.txt` → 이번에는 rice.txt를 올려요",'`git commit -m "밥 물"` → rice.txt만 담긴 두 번째 커밋 → **1 file changed**. log에서는 이 커밋이 맨 위예요'],output:`[main 1b8e6fc] 국 간
 1 file changed, 1 insertion(+)
[main 4ed6242] 밥 물
 1 file changed, 1 insertion(+)
`,mistake:"두 파일을 먼저 모두 add한 뒤 커밋을 두 번 하기. 첫 커밋에 두 파일이 함께 들어가고, 두 번째 commit은 `nothing to commit`(담을 것이 없음)이라며 만들어지지 않아요.",in_code:"AI가 한 번에 여러 파일을 고쳤다면 이렇게 나눠 커밋해 두어야 나중에 한 가지 변경만 되돌리기 쉬워요. 나눈 뒤에는 `git log --format=%s`로 커밋이 원하는 순서로 쌓였는지 확인해요."},{type:`example`,id:`theory-git-commit-ex6`,kind:`choice`,title:`두 파일을 함께 올린 뒤`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/recipe/  ← 지금 위치
# ├── soup.txt
# └── tea.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "레시피 모음"으로 커밋됨
echo "두부" >> soup.txt
echo "얼음" >> tea.txt
git add soup.txt tea.txt
git commit -m "두부 넣기"
git commit -m "아이스티"
git log --format=%s`,capture:`last`,choices:[`두부 넣기
레시피 모음`,`아이스티
두부 넣기
레시피 모음`,`아이스티
레시피 모음`],answer:`두부 넣기
레시피 모음`,feedback:{"아이스티\n두부 넣기\n레시피 모음":`첫 커밋이 파일 하나만 담고 나머지는 다음 커밋으로 넘긴다고 생각했나요?`,"아이스티\n레시피 모음":`같은 스테이지로 다시 커밋하면 앞 커밋의 메시지가 바뀐다고 생각했나요?`},explanation:`add로 두 파일을 모두 올렸으니 첫 commit 두부 넣기에 soup.txt와 tea.txt가 함께 들어가요. 이어지는 commit은 스테이지에 담을 것이 없어 만들어지지 않아요.`,card:`split`,output:`두부 넣기
레시피 모음
`},{type:`summary`,points:["`git log`는 최신 커밋부터 보여 줘요. `--oneline`은 짧은 해시와 메시지, `--format=%s`는 메시지만, `-2`는 최근 두 개예요. 해시는 컴퓨터마다 달라요.","HEAD는 가장 최근 커밋이에요. `git show HEAD:파일`은 그 커밋에 기록된 파일 전체를 보여 줘요.","`git commit -am`은 추적 중인 파일의 수정만 담아요. 새 파일은 먼저 `git add`해요.","`git log -- 파일`은 그 파일을 바꾼 커밋만, 처음 기록한 커밋까지 보여 줘요.","`git commit --amend`는 마지막 커밋을 바꿔 쓰고(`--no-edit`는 메시지 유지), 공유한 커밋에는 쓰지 않아요.",`commit은 스테이지에 담긴 것을 모두 한 커밋으로 만들어서, 나누려면 add와 commit을 번갈아 실행해요.`]}],covers:{"git-commit-01":[`log`],"git-commit-02":[`head-file`],"git-commit-03":[`commit-a`],"git-commit-04":[`log`,`log-path`],"git-commit-05":[`commit-a`,`amend`],"git-commit-06":[`log`,`split`]}},{id:`theory-git-diff`,version:2,concept_id:`git-diff`,title:`바뀐 내용(diff) 읽기`,minutes:16,steps:[{type:`explain`,id:`read-diff`,title:`diff 한 덩어리 읽기`,body:"diff는 바뀌기 전과 후를 줄 단위로 비교한 표시예요. `git diff`는 아직 add하지 않은 수정을 이 모양으로 보여 줘요. `---`는 바뀌기 전(a), `+++`는 바뀐 뒤(b)의 파일 이름이고, `@@ -1,3 +1,3 @@`는 바뀌기 전 1번 줄부터 3줄이 바뀐 뒤 1번 줄부터 3줄이 된다는 범위예요. 그 아래 `-`로 시작하는 줄은 지워진 줄, `+`로 시작하는 줄은 들어간 줄, 앞이 빈칸인 줄은 그대로인 주변 줄(문맥)이에요.",code:`# ~/market/  ← 지금 위치
# └── list.txt
# list.txt 내용:
#   우유
#   식빵
#   달걀
# 지금 위치는 git 저장소입니다.
# 위 파일은 "장보기 목록"으로 커밋됨
cat > list.txt <<'EOF'
우유
호밀빵
달걀
EOF
git diff`,trace:["`cat > list.txt <<'EOF'` → 다음 줄부터 `EOF` 줄 앞까지를 list.txt의 새 내용으로 써요. 식빵이 호밀빵으로 바뀌어요","`git diff` → 출력의 첫 두 줄 `diff --git`과 `index`는 비교하는 파일과 Git 내부 번호라 읽을 때 건너뛰어요","출력의 `--- a/list.txt`, `+++ b/list.txt` → 바뀌기 전과 후의 파일 이름을 알리는 머리글이에요","출력의 `@@ -1,3 +1,3 @@` → 바뀌기 전 1번 줄부터 3줄이, 바뀐 뒤 1번 줄부터 3줄이 돼요","출력의 `-식빵`, `+호밀빵` → 식빵 줄이 지워지고 그 자리에 호밀빵이 들어가요. 앞이 빈칸인 **우유**와 **달걀**은 그대로예요"],output:`diff --git a/list.txt b/list.txt
index 42070aa..10f0a68 100644
--- a/list.txt
+++ b/list.txt
@@ -1,3 +1,3 @@
 우유
-식빵
+호밀빵
 달걀
`,mistake:"`-`줄과 `+`줄을 둘 다 남는 줄로 읽기. `-`줄은 지워지고 `+`줄은 diff에 적힌 자리에 들어가서, 바뀐 뒤의 파일에는 `-`줄이 남지 않아요.",in_code:"AI가 코드 수정을 diff로 보여 주면 `-`줄과 `+`줄만 짝지어 읽어도 무엇이 바뀌는지 알 수 있어요. 한 줄을 고친 것은 옛 줄 삭제 하나와 새 줄 추가 하나로 나타나요."},{type:`explain`,id:`apply`,title:`diff 적용하기와 거절`,body:"`git apply 파일`은 diff 파일에 적힌 변경을 실제 파일에 적용해요. 적용한 뒤의 파일은 문맥 줄과 `+`줄을 위에서부터 차례로 이은 것이고 `-`줄은 남지 않아요. `-`줄과 `+`줄의 개수가 같을 필요는 없어서 `@@ -1,2 +1,3 @@`처럼 2줄이 3줄이 되기도 해요. 적용할 때 Git은 문맥 줄과 `-`줄이 지금 파일에 그대로 있는 자리를 찾고, 못 찾으면 파일을 건드리지 않고 `patch does not apply`로 거절해요.",code:`# ~/market/  ← 지금 위치
# ├── fix.diff
# └── list.txt
# list.txt 내용:
#   우유
#   식빵
# fix.diff 내용:
#   --- a/list.txt
#   +++ b/list.txt
#   @@ -1,2 +1,3 @@
#   -우유
#   +두유
#   +바나나
#    식빵
git apply fix.diff
cat list.txt
git apply fix.diff`,trace:["`# fix.diff 내용:` 아래 → 우유를 지우고 두유와 바나나를 넣는 diff예요. `@@ -1,2 +1,3 @@`대로 2줄이 3줄이 돼요","`git apply fix.diff` → diff를 list.txt에 적용해요. 성공하면 아무것도 출력하지 않아요","`cat list.txt` → 문맥 줄과 `+`줄을 이은 결과 → **두유**, **바나나**, **식빵**","`git apply fix.diff` → 같은 diff를 한 번 더 적용하면 지울 줄 우유가 지금 파일에 없어서 거절 → **error: list.txt: patch does not apply**. 파일은 그대로예요"],output:`두유
바나나
식빵
error: patch failed: list.txt:1
error: list.txt: patch does not apply
`,mistake:"diff가 줄 번호만 보고 그 자리를 바꾼다고 생각하기. Git은 문맥 줄과 `-`줄의 내용이 지금 파일과 똑같은지 확인하고, 다르면 적용하지 않아요.",in_code:"AI가 예전 파일을 보고 만든 diff는 그사이 내가 고친 파일과 어긋날 수 있어요. 적용이 거절되면 diff의 문맥 줄과 `-`줄부터 지금 파일과 하나씩 대조해요."},{type:`example`,id:`theory-git-diff-ex1`,kind:`choice`,title:`맨 앞 줄을 지우는 diff`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/market/  ← 지금 위치
# ├── list.txt
# └── new.diff
# list.txt 내용:
#   귤
#   배
#   감
# new.diff 내용:
#   --- a/list.txt
#   +++ b/list.txt
#   @@ -1,3 +1,3 @@
#   -귤
#    배
#    감
#   +포도
git apply new.diff
cat list.txt`,choices:[`배
감
포도`,`귤
배
감
포도`,`포도
배
감`,`배
감`],answer:`배
감
포도`,feedback:{"귤\n배\n감\n포도":`-로 시작하는 줄도 파일에 그대로 남는다고 생각했나요?`,"포도\n배\n감":`+줄이 지워진 -줄의 자리에 들어간다고 생각했나요?`,"배\n감":`+줄은 diff에만 있고 파일에는 들어가지 않는다고 생각했나요?`},explanation:`-귤은 지워지고 앞이 빈칸인 배와 감은 그대로 남아요. +포도는 diff에 적힌 자리인 감 다음에 들어가서 배, 감, 포도가 돼요.`,card:`read-diff`,output:`배
감
포도
`},{type:`example`,id:`theory-git-diff-ex2`,kind:`choice`,title:`그사이 바뀐 파일`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/market/  ← 지금 위치
# ├── list.txt
# └── up.diff
# list.txt 내용:
#   귤
#   감
# up.diff 내용:
#   --- a/list.txt
#   +++ b/list.txt
#   @@ -1,2 +1,2 @@
#    귤
#   -배
#   +포도
git apply up.diff
cat list.txt`,capture:`last`,choices:[`귤
감`,`귤
포도`,`귤
감
포도`],answer:`귤
감`,feedback:{"귤\n포도":`diff가 줄 내용이 아니라 줄 번호만 보고 2번째 줄을 바꾼다고 생각했나요?`,"귤\n감\n포도":`지울 줄을 찾지 못하면 그 줄만 건너뛰고 +줄은 더한다고 생각했나요?`},explanation:`이 diff는 귤 다음에 배가 있다고 적혀 있지만 지금 파일에는 배가 없어서 git apply가 거절해요. 거절되면 파일은 전혀 바뀌지 않아 귤과 감이 그대로 나와요.`,card:`apply`,output:`귤
감
`},{type:`explain`,id:`compare`,title:`어디와 어디를 비교할까`,body:"변경은 마지막 커밋, 스테이지, 작업 폴더 세 곳에 나뉘어 있을 수 있어요. `git diff`는 작업 폴더를 스테이지와 비교해 아직 add하지 않은 변경만 보여 주고, `git diff --staged`(같은 뜻의 `--cached`)는 스테이지를 마지막 커밋과 비교해 다음 커밋에 들어갈 변경을 보여 줘요. `git diff HEAD`는 마지막 커밋과 작업 폴더를 바로 비교해 두 가지를 모두 보여 줘요. `--name-only`를 붙이면 바뀐 줄 대신 파일 이름만 나와요.",code:`# ~/market/  ← 지금 위치
# └── list.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "장보기 목록"으로 커밋됨
echo "쿠폰" > coupon.txt
git add coupon.txt
echo "두부" >> list.txt
git diff --name-only
git diff --staged --name-only
git diff HEAD --name-only`,trace:['`echo "쿠폰" > coupon.txt` → 새 파일을 만들어요',"`git add coupon.txt` → 새 파일을 스테이지에 올려요",'`echo "두부" >> list.txt` → 추적 중인 list.txt를 고치고 add하지 않아요',"`git diff --name-only` → 스테이지와 다른, 아직 add하지 않은 파일 → **list.txt**","`git diff --staged --name-only` → 다음 커밋에 들어갈 파일 → **coupon.txt**. 새 파일도 add하면 여기에 나와요","`git diff HEAD --name-only` → 마지막 커밋과 다른 파일 모두 → **coupon.txt**, **list.txt**"],output:`list.txt
coupon.txt
coupon.txt
list.txt
`,mistake:"add한 뒤 `git diff`에 아무것도 안 나오면 변경이 사라졌다고 생각하기. add한 변경은 스테이지로 옮겨 갔을 뿐이라 `git diff --staged`로 보여요.",in_code:'AI에게 커밋을 맡기기 전에 `git diff --staged`로 실제로 담긴 내용을 확인해요. AI가 "변경 사항을 보여 줘"라는 요청에 `git diff`만 실행했다면 add한 변경은 빠진 결과일 수 있어요.'},{type:`example`,id:`theory-git-diff-ex3`,kind:`choice`,title:`add한 뒤 또 고친 파일`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/market/  ← 지금 위치
# ├── list.txt
# └── memo.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "장보기 목록"으로 커밋됨
echo "두부" >> list.txt
git add list.txt
echo "파" >> list.txt
echo "쿠폰" >> memo.txt
git diff --cached --name-only`,choices:[`list.txt`,`memo.txt`,`list.txt
memo.txt`,`(출력 없음)`],answer:`list.txt`,feedback:{"memo.txt":`--cached가 아직 add하지 않은 변경을 보여 준다고 생각했나요?`,"list.txt\nmemo.txt":`--cached가 마지막 커밋 뒤의 모든 변경을 보여 준다고 생각했나요?`,"(출력 없음)":`add한 뒤에 다시 고친 파일은 스테이지에서 빠진다고 생각했나요?`},explanation:`--cached는 --staged와 같아서 스테이지를 마지막 커밋과 비교해요. 스테이지에는 두부를 더한 list.txt만 있고, 뒤에 더한 파와 memo.txt의 쿠폰은 아직 작업 폴더에만 있어요.`,card:`compare`,output:`list.txt
`},{type:`explain`,id:`stat`,title:`--stat으로 범위 훑기`,body:"`git diff --stat`은 줄 내용 대신 파일마다 바뀐 줄 수를 요약해요. `+`는 더한 줄, `-`는 지운 줄의 수만큼 붙고(줄이 많으면 비율로 줄여 그려요), 한 줄을 고친 것은 지운 줄 하나와 더한 줄 하나로 세요. 마지막 줄은 바뀐 파일 수와 더한·지운 줄 수의 합계예요. `git diff`는 Git이 추적하는 파일만 비교해서, 한 번도 add하지 않은 새 파일은 나오지 않아요. `printf '줄1\\n줄2\\n' > 파일`은 `\\n`(줄바꿈) 자리에서 줄을 나눠 파일을 새로 써요.",code:`# ~/market/  ← 지금 위치
# └── list.txt
# list.txt 내용:
#   우유
#   식빵
#   달걀
# 지금 위치는 git 저장소입니다.
# 위 파일은 "장보기 목록"으로 커밋됨
printf '두유\\n식빵\\n' > list.txt
echo "영수증" > bill.txt
git diff --stat
git status --short`,compare:`exact`,trace:["`printf '두유\\n식빵\\n' > list.txt` → list.txt를 두유, 식빵 두 줄로 새로 써요. 우유는 두유로 바뀌고 달걀 줄은 없어져요",'`echo "영수증" > bill.txt` → add하지 않은 새 파일을 만들어요',"`git diff --stat` → 우유→두유는 지운 줄 하나와 더한 줄 하나, 달걀은 지운 줄 하나라 list.txt는 **3 +--**(더한 1, 지운 2)예요. 합계는 **1 file changed, 1 insertion(+), 2 deletions(-)**이고 새 파일 bill.txt는 나오지 않아요","`git status --short` → 새 파일은 status에서 따로 보여요 → **?? bill.txt**"],output:` list.txt | 3 +--
 1 file changed, 1 insertion(+), 2 deletions(-)
 M list.txt
?? bill.txt
`,mistake:"한 줄을 고치면 1줄 바뀐 것으로 세기. `--stat`은 옛 줄 삭제와 새 줄 추가를 따로 세서, 한 줄만 고쳐도 `2 +-`로 보여요.",in_code:"AI가 여러 파일을 고쳤다면 `git diff --stat`으로 범위를 먼저 훑고, 예상보다 크게 바뀐 파일만 `git diff 파일`로 자세히 봐요. 새 파일은 `git status --short`로 따로 확인해요."},{type:`example`,id:`theory-git-diff-ex4`,kind:`line`,title:`새 파일 요약이 나오는 줄`,prompt:`아래 명령 중 cart.txt | 1 + 요약을 출력하는 줄을 고르세요.`,code:`# ~/market/  ← 지금 위치
# └── list.txt
# list.txt 내용:
#   우유
#   식빵
# 지금 위치는 git 저장소입니다.
# 위 파일은 "장보기 목록"으로 커밋됨
printf '우유\\n호밀빵\\n' > list.txt
echo "쿠폰" > cart.txt
git diff --stat
git add cart.txt
git diff --stat
git diff --staged --stat`,choices:[`10`,`12`,`13`],answer:`13`,check:{type:`prints`,target:` cart.txt | 1 +
 1 file changed, 1 insertion(+)`},feedback:{10:`add하지 않은 새 파일도 git diff에 나온다고 생각했나요?`,12:`add한 새 파일은 옵션 없는 git diff에 나온다고 생각했나요?`},explanation:`10번과 12번 줄의 git diff는 스테이지와 작업 폴더를 비교해 list.txt의 2 +-만 보여 줘요. cart.txt는 add로 스테이지에 올라간 뒤, 마지막 커밋과 스테이지를 비교하는 13번 줄에서만 나와요.`,card:`compare`,output:` list.txt | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
 list.txt | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
 cart.txt | 1 +
 1 file changed, 1 insertion(+)
`},{type:`explain`,id:`show-grep`,title:`git show와 파이프로 줄 고르기`,body:'`git show`는 마지막 커밋(HEAD)의 정보와 그 커밋이 바꾼 내용을 diff로 보여 줘요. `명령 | 명령`의 `|`(파이프)는 앞 명령의 출력을 뒤 명령에 넘겨요. `grep "^+"`는 `+`로 시작하는 줄만 남기고(`^`는 줄의 맨 앞), `grep -v`는 반대로 맞는 줄을 빼요. `grep -c`는 맞는 줄의 개수를 세고, `-x`를 함께 쓰면 줄 전체가 그 글과 똑같은 줄만 세요.',code:`# ~/market/  ← 지금 위치
# └── list.txt
# list.txt 내용:
#   우유
# 지금 위치는 git 저장소입니다.
# 위 파일은 "장보기 목록"으로 커밋됨
echo "두부" >> list.txt
git commit -am "두부 추가"
git show | grep "^+"
git show | grep "^+" | grep -v "^+++"
grep -c -x "두부" list.txt
grep -c -x "두" list.txt`,trace:['`echo "두부" >> list.txt` → 한 줄을 더해요','`git commit -am "두부 추가"` → 커밋해요(해시는 컴퓨터마다 달라요)','`git show | grep "^+"` → git show의 출력 중 `+`로 시작하는 줄만 → 머리글 **+++ b/list.txt**와 **+두부**','`git show | grep "^+" | grep -v "^+++"` → 거기서 `+++`로 시작하는 머리글을 빼서 → **+두부**만','`grep -c -x "두부" list.txt` → 두부와 똑같은 줄의 개수 → **1**','`grep -c -x "두" list.txt` → `-x`는 줄 전체가 같아야 해서 두부 줄은 맞지 않아 → **0**'],output:`[main b62a563] 두부 추가
 1 file changed, 1 insertion(+)
+++ b/list.txt
+두부
+두부
1
0
`,mistake:'`grep "^+"`만으로 더한 줄만 남는다고 생각하기. 파일 이름 머리글 `+++ b/…`도 +로 시작해서 `grep -v "^+++"`로 따로 빼야 해요.',in_code:"AI가 방금 만든 커밋이 무엇을 바꿨는지 볼 때 `git show`가 가장 빨라요. 출력이 길면 `| grep`으로 필요한 줄만 고르는 방법을 함께 안내하는 경우가 많아요."},{type:`example`,id:`theory-git-diff-ex5`,kind:`choice`,title:`커밋 뒤에 또 고쳤을 때`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/market/  ← 지금 위치
# ├── bill.txt
# └── list.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "장보기 목록"으로 커밋됨
echo "김" >> list.txt
git commit -am "김 추가"
echo "카드" >> bill.txt
git show --name-only --format=`,capture:`last`,choices:[`list.txt`,`bill.txt`,`bill.txt
list.txt`,`(출력 없음)`],answer:`list.txt`,feedback:{"bill.txt":`git show가 아직 커밋하지 않은 수정을 보여 준다고 생각했나요?`,"bill.txt\nlist.txt":`git show가 마지막 커밋과 작업 폴더의 차이를 모두 보여 준다고 생각했나요?`,"(출력 없음)":`커밋한 변경은 git show에도 나오지 않는다고 생각했나요?`},explanation:`git show는 마지막 커밋 김 추가가 바꾼 것만 보여 줘서 list.txt가 나와요. 커밋한 뒤에 고친 bill.txt는 아직 작업 폴더에만 있어요.`,card:`show-grep`,output:`list.txt
`},{type:`summary`,points:["diff에서 `---`·`+++`는 파일 이름 머리글, `@@ -1,3 +1,3 @@`는 줄 범위, `-`는 지운 줄, `+`는 넣은 줄, 앞이 빈칸인 줄은 그대로인 문맥이에요.","적용한 뒤의 파일은 문맥 줄과 `+`줄을 위에서부터 이은 것이에요. `git apply`는 문맥과 `-`줄이 지금 파일과 다르면 거절하고 파일을 그대로 둬요.","`git diff`는 아직 add하지 않은 변경, `--staged`(`--cached`)는 다음 커밋에 들어갈 변경, `git diff HEAD`는 둘 다예요.","`--stat`은 파일마다 바뀐 줄 수를 세고, 한 줄 고침은 `+-` 두 개로 세요. 추적하지 않는 새 파일은 `git diff`에 나오지 않아요.",'`git show`는 마지막 커밋이 바꾼 내용이에요. `| grep "^+"`로 더한 줄을 고를 때는 `+++` 머리글을 `grep -v`로 빼요.']}],covers:{"git-diff-01":[`read-diff`,`apply`],"git-diff-02":[`compare`],"git-diff-03":[`apply`,`show-grep`],"git-diff-04":[`read-diff`,`apply`],"git-diff-05":[`read-diff`,`apply`],"git-diff-06":[`stat`],"git-diff-07":[`compare`,`show-grep`]}},{id:`theory-git-undo`,version:1,concept_id:`git-undo`,title:`되돌리기`,minutes:16,steps:[{type:`explain`,id:`restore`,title:`고친 내용 버리기: restore`,body:"`git restore 파일`은 작업 폴더에서 고친 내용을 버리고 그 파일을 스테이지의 내용으로 되돌려요. add한 적이 없으면 스테이지는 마지막 커밋과 같으니 마지막 커밋의 내용으로 돌아가요. 이름 대신 `.`을 준 `git restore .`은 지금 폴더의 추적 중인 파일을 모두 되돌리지만, 한 번도 add하지 않은 새 파일은 Git이 모르는 파일이라 건드리지 않아요. 예전 방식의 `git checkout -- 파일`도 같은 일을 하고, 버린 수정은 Git이 보관한 적이 없어 다시 살릴 수 없어요.",code:`# ~/blog/  ← 지금 위치
# ├── about.txt
# └── post.txt
# post.txt 내용:
#   제목: 봄 산책
# 지금 위치는 git 저장소입니다.
# 위 파일은 "블로그 시작"으로 커밋됨
echo "사진 3장" >> post.txt
git add post.txt
echo "댓글 허용" >> post.txt
git restore post.txt
cat post.txt
git status --short`,compare:`exact`,trace:['`echo "사진 3장" >> post.txt` → post.txt를 고쳐요',"`git add post.txt` → 사진 3장까지 쓴 지금 내용을 스테이지에 복사해요",'`echo "댓글 허용" >> post.txt` → 작업 폴더에만 한 줄을 더해요',"`git restore post.txt` → 작업 폴더의 수정을 버리고 스테이지의 내용으로 되돌려요","`cat post.txt` → add한 사진 3장은 남고 댓글 허용만 사라져 → **제목: 봄 산책**, **사진 3장**","`git status --short` → 스테이지에 올린 수정은 그대로라 첫째 칸에 **M**"],output:`제목: 봄 산책
사진 3장
M  post.txt
`,mistake:`restore를 '잠시 치워 두기'로 생각하기. 버린 수정은 어디에도 보관되지 않아서 다시 꺼낼 수 없어요.`,in_code:'AI가 "변경을 취소하려면 `git restore 파일`"이라고 안내하면 먼저 `git diff 파일`로 버릴 내용을 확인해요. `git restore .`처럼 범위가 넓은 명령이면 `git status --short`로 버려질 파일이 무엇인지도 함께 봐요.'},{type:`example`,id:`theory-git-undo-ex1`,kind:`choice`,title:`폴더 전체를 되돌리면`,prompt:`아래 명령을 차례로 실행했을 때 마지막 줄의 출력을 고르세요.`,code:`# ~/blog/  ← 지금 위치
# ├── about.txt
# └── post.txt
# post.txt 내용:
#   제목: 첫눈
# 지금 위치는 git 저장소입니다.
# 위 파일은 "겨울 글"로 커밋됨
echo "장소: 공원" >> post.txt
echo "취미: 스키" >> about.txt
echo "초안" > sketch.txt
git restore .
git status --short; cat post.txt`,capture:`last`,compare:`exact`,choices:[`?? sketch.txt
제목: 첫눈`,`제목: 첫눈`,` M about.txt
?? sketch.txt
제목: 첫눈`],answer:`?? sketch.txt
제목: 첫눈`,feedback:{"제목: 첫눈":`git restore .이 추적하지 않는 새 파일까지 지운다고 생각했나요?`," M about.txt\n?? sketch.txt\n제목: 첫눈":`git restore .이 파일 하나만 되돌린다고 생각했나요?`},explanation:`git restore .은 추적 중인 post.txt와 about.txt의 수정을 모두 버려요. 새 파일 sketch.txt는 Git이 모르는 파일이라 그대로 남아 ??로 보여요.`,card:`restore`,output:`?? sketch.txt
제목: 첫눈
`},{type:`explain`,id:`unstage`,title:`스테이지에서만 내리기`,body:"`git restore --staged 파일`은 그 파일을 스테이지에서만 내려요. 작업 폴더의 내용은 그대로라 고친 것을 잃지 않아요. 고친 파일은 다시 add 전 상태(둘째 칸 M)가 되고, 처음 add했던 새 파일은 다시 추적하지 않는 파일(??)이 돼요. `--staged`가 없는 `git restore`는 수정을 버리는 명령이라 둘을 꼭 구분해요.",code:`# ~/blog/  ← 지금 위치
# ├── about.txt
# └── post.txt
# post.txt 내용:
#   제목: 봄 산책
# 지금 위치는 git 저장소입니다.
# 위 파일은 "블로그 시작"으로 커밋됨
echo "사진 3장" >> post.txt
echo "임시 메모" > memo.txt
git add .
git restore --staged post.txt
git status --short
cat post.txt`,compare:`exact`,trace:['`echo "사진 3장" >> post.txt` → post.txt를 고쳐요','`echo "임시 메모" > memo.txt` → 새 파일을 만들어요',"`git add .` → 두 파일을 모두 스테이지에 올려요","`git restore --staged post.txt` → post.txt만 스테이지에서 내려요","`git status --short` → memo.txt는 그대로 스테이지에 있어 첫째 칸에 **A**, post.txt는 add 전처럼 둘째 칸에 **M**","`cat post.txt` → 고친 내용은 그대로 → **제목: 봄 산책**, **사진 3장**"],output:`A  memo.txt
 M post.txt
제목: 봄 산책
사진 3장
`,mistake:"`--staged`를 빼먹기. `git restore post.txt`는 스테이지가 아니라 작업 폴더를 되돌려서 고친 내용을 버려요.",in_code:'AI가 "실수로 add한 파일은 `git restore --staged 파일`로 빼세요"라고 하면 수정은 잃지 않아요. 예전 안내의 `git reset 파일`도 같은 일을 해요.'},{type:`example`,id:`theory-git-undo-ex2`,kind:`choice`,title:`새 파일을 내리면`,prompt:`아래 명령을 차례로 실행했을 때 마지막 줄의 출력을 고르세요.`,code:`# ~/blog/  ← 지금 위치
# └── post.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "겨울 글"로 커밋됨
echo "눈사람" > photo.txt
git add photo.txt
git restore --staged photo.txt
git status --short; ls`,output:`?? photo.txt
photo.txt  post.txt
`,choices:[`?? photo.txt
photo.txt  post.txt`,`post.txt`,`A  photo.txt
photo.txt  post.txt`,`photo.txt  post.txt`],answer:`?? photo.txt
photo.txt  post.txt`,feedback:{"post.txt":`restore --staged가 새 파일을 폴더에서 지운다고 생각했나요?`,"A  photo.txt\nphoto.txt  post.txt":`restore --staged 뒤에도 새 파일이 스테이지에 남는다고 생각했나요?`,"photo.txt  post.txt":`스테이지에서 내리면 바뀐 것이 없는 파일처럼 status에 나오지 않는다고 생각했나요?`},explanation:`restore --staged는 photo.txt를 스테이지에서만 내려요. 처음 add했던 새 파일이라 다시 ??가 되고, 파일은 그대로 남아 ls에 보여요.`,card:`unstage`},{type:`explain`,id:`reset`,title:`커밋 취소하기: reset의 세 가지`,body:"`HEAD~1`은 HEAD의 바로 전 커밋이에요. `git reset --soft HEAD~1`은 브랜치만 한 커밋 전으로 옮겨 커밋을 취소하고, 커밋에 담겼던 수정은 스테이지에 남겨요(첫째 칸 M). 옵션 없는 `git reset`(`--mixed`)은 스테이지까지 비워 수정이 add 전 상태(둘째 칸 M)로 남고, `--hard`는 작업 폴더까지 덮어써 수정이 사라져요. 커밋을 쓰지 않으면 HEAD를 기준으로 하고, 세 옵션 모두 추적하지 않는 새 파일은 건드리지 않아요.",code:`# ~/blog/  ← 지금 위치
# ├── about.txt
# └── post.txt
# post.txt 내용:
#   제목: 봄 산책
# 지금 위치는 git 저장소입니다.
# 위 파일은 "블로그 시작"으로 커밋됨
echo "사진 3장" >> post.txt
git commit -am "사진 추가"
git reset --soft HEAD~1
git reset
git reset --hard
cat post.txt`,compare:`exact`,trace:['`echo "사진 3장" >> post.txt` → post.txt를 고쳐요','`git commit -am "사진 추가"` → 커밋해요(해시는 컴퓨터마다 달라요)',"`git reset --soft HEAD~1` → 브랜치를 블로그 시작으로 옮겨 사진 추가 커밋을 취소해요. 수정은 스테이지에 남고 출력은 없어요","`git reset` → 커밋을 쓰지 않아 HEAD 기준의 --mixed예요. 스테이지를 비워 수정이 작업 폴더에만 남았다고 알려 줘요 → **Unstaged changes after reset:**, **M post.txt**","`git reset --hard` → 작업 폴더까지 HEAD로 덮어써요 → **HEAD is now at … 블로그 시작**(해시는 컴퓨터마다 달라요)","`cat post.txt` → 사진 3장은 사라져 → **제목: 봄 산책**"],output:`[main 61ca748] 사진 추가
 1 file changed, 1 insertion(+)
Unstaged changes after reset:
M	post.txt
HEAD is now at 2d5957c 블로그 시작
제목: 봄 산책
`,mistake:"`--hard`를 커밋만 지우는 명령으로 생각하기. 아직 커밋하지 않은 다른 파일의 수정까지 덮어써서, 그 수정은 되살릴 수 없어요.",in_code:"AI가 reset을 권하면 어느 옵션인지부터 확인해요. 커밋 메시지만 잘못됐거나 커밋을 다시 묶고 싶다면 `--soft`가 안전하고, `--hard`가 들어 있으면 먼저 `git status`로 커밋하지 않은 수정이 있는지 봐요."},{type:`example`,id:`theory-git-undo-ex3`,kind:`choice`,title:`취소하고 다시 커밋하기`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/blog/  ← 지금 위치
# └── post.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "겨울 글"로 커밋됨
echo "장소: 공원" >> post.txt
git commit -am "장소 추가"
git reset --soft HEAD~1
git commit -m "장소와 날짜"
git log --format=%s`,capture:`last`,choices:[`장소와 날짜
겨울 글`,`장소와 날짜
장소 추가
겨울 글`,`겨울 글`,`장소 추가
겨울 글`],answer:`장소와 날짜
겨울 글`,feedback:{"장소와 날짜\n장소 추가\n겨울 글":`reset --soft가 커밋을 취소하지 않고 그대로 둔다고 생각했나요?`,"겨울 글":`--soft로 취소하면 수정까지 사라져 다시 커밋할 것이 없다고 생각했나요?`,"장소 추가\n겨울 글":`reset 뒤의 commit이 새 메시지 대신 취소한 커밋의 메시지를 다시 쓴다고 생각했나요?`},explanation:`--soft는 장소 추가 커밋만 취소하고 수정은 스테이지에 남겨요. 그래서 바로 commit하면 같은 수정이 새 메시지 장소와 날짜로 다시 커밋돼요.`,card:`reset`,output:`장소와 날짜
겨울 글
`},{type:`explain`,id:`revert`,title:`기록을 남기며 되돌리기: revert`,body:'`git revert HEAD`는 마지막 커밋을 거꾸로 적용한 새 커밋을 하나 더 만들어요. 기록을 지우지 않고 되돌린 사실을 `Revert "…"` 커밋으로 남기므로, 이미 다른 사람과 공유한 커밋에도 안전해요. 되돌리는 커밋과 상관없는 파일의 커밋하지 않은 수정은 그대로 남아요. `--no-edit`는 메시지 편집 창을 건너뛰고 기본 메시지를 써요.',code:`# ~/blog/  ← 지금 위치
# ├── about.txt
# └── post.txt
# post.txt 내용:
#   제목: 봄 산책
# 지금 위치는 git 저장소입니다.
# 위 파일은 "블로그 시작"으로 커밋됨
echo "사진 3장" >> post.txt
git commit -am "사진 추가"
echo "취미: 등산" >> about.txt
git revert --no-edit HEAD
git log --format=%s
git status --short; cat post.txt`,compare:`exact`,trace:['`echo "사진 3장" >> post.txt` → post.txt를 고쳐요','`git commit -am "사진 추가"` → 되돌리고 싶은 커밋을 만들어요','`echo "취미: 등산" >> about.txt` → 커밋하지 않은 다른 수정이 생겨요','`git revert --no-edit HEAD` → 사진 추가를 거꾸로 적용한 새 커밋 → **Revert "사진 추가"**, 1줄 삭제(해시는 컴퓨터마다 달라요)','`git log --format=%s` → 기록은 지워지지 않고 하나 늘어요 → **Revert "사진 추가"**, **사진 추가**, **블로그 시작**',"`git status --short; cat post.txt` → about.txt의 수정은 그대로 둘째 칸에 M, post.txt는 → **제목: 봄 산책**"],output:`[main 61ca748] 사진 추가
 1 file changed, 1 insertion(+)
[main 62fcf4f] Revert "사진 추가"
 Date: Thu Oct 29 09:00:00 2026 +0900
 1 file changed, 1 deletion(-)
Revert "사진 추가"
사진 추가
블로그 시작
 M about.txt
제목: 봄 산책
`,mistake:"잘못된 커밋을 없애려고 `git reset --hard HEAD~1`부터 쓰기. 커밋은 사라지지만 커밋하지 않은 about.txt의 수정까지 함께 지워져요.",in_code:"이미 서버에 올린 커밋을 되돌릴 때 AI는 보통 `git revert`를 권해요. reset으로 기록을 지우면 같은 커밋을 받은 다른 사람의 기록과 어긋나기 때문이에요."},{type:`example`,id:`theory-git-undo-ex4`,kind:`choice`,title:`되돌린 뒤의 기록`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/blog/  ← 지금 위치
# └── post.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "겨울 글"로 커밋됨
echo "장소: 공원" >> post.txt
git commit -am "장소 추가"
git revert --no-edit HEAD
git log --format=%s`,capture:`last`,choices:[`Revert "장소 추가"
장소 추가
겨울 글`,`겨울 글`,`장소 추가
겨울 글`,`Revert "장소 추가"
겨울 글`],answer:`Revert "장소 추가"
장소 추가
겨울 글`,feedback:{"겨울 글":`revert가 reset처럼 마지막 커밋을 기록에서 지운다고 생각했나요?`,"장소 추가\n겨울 글":`revert가 기록은 그대로 두고 파일만 되돌린다고 생각했나요?`,'Revert "장소 추가"\n겨울 글':`revert가 되돌린 커밋을 새 커밋으로 바꿔 끼운다고 생각했나요?`},explanation:`revert는 장소 추가를 거꾸로 적용한 새 커밋 Revert "장소 추가"를 맨 위에 더해요. 원래 커밋도 그대로 남아 세 줄이 나와요.`,card:`revert`,output:`Revert "장소 추가"
장소 추가
겨울 글
`},{type:`explain`,id:`restore-source`,title:`파일 하나만 예전 커밋으로`,body:"`git restore --source=HEAD~1 파일`은 그 파일만 바로 전 커밋의 내용으로 작업 폴더에 가져오고, 커밋 기록과 다른 파일은 건드리지 않아요. `git show HEAD~1:파일 > 파일`도 옛 내용을 그 파일에 덮어써 결과가 같아요(`명령 > 파일`은 명령이 화면에 낼 글을 그 파일에 대신 써요). 예전 방식의 `git checkout HEAD~1 -- 파일`은 같은 내용을 스테이지에도 올려 둬요. `--source` 없이 `git restore 파일`만 쓰면 스테이지의 내용으로 되돌려서, 방금 커밋한 파일에는 바뀌는 것이 없어요.",code:`# ~/blog/  ← 지금 위치
# ├── about.txt
# └── post.txt
# post.txt 내용:
#   제목: 봄 산책
# 지금 위치는 git 저장소입니다.
# 위 파일은 "블로그 시작"으로 커밋됨
echo "제목: 여름 바다" > post.txt
echo "취미: 수영" >> about.txt
git commit -am "여름 글"
git restore --source=HEAD~1 post.txt
git show HEAD~1:about.txt > about.txt
git status --short; cat post.txt`,compare:`exact`,trace:['`echo "제목: 여름 바다" > post.txt` → post.txt를 새 제목으로 바꿔요','`echo "취미: 수영" >> about.txt` → about.txt에도 한 줄을 더해요','`git commit -am "여름 글"` → 두 파일의 수정을 한 커밋으로 남겨요(해시는 컴퓨터마다 달라요)',"`git restore --source=HEAD~1 post.txt` → post.txt만 바로 전 커밋(블로그 시작)의 내용으로 가져와요","`git show HEAD~1:about.txt > about.txt` → 바로 전 커밋의 about.txt를 화면 대신 파일에 써서 덮어써요","`git status --short; cat post.txt` → 두 파일 모두 마지막 커밋과 달라져 둘째 칸에 **M**, 기록은 그대로이고 post.txt는 → **제목: 봄 산책**"],output:`[main 5f08d94] 여름 글
 2 files changed, 2 insertions(+), 1 deletion(-)
 M about.txt
 M post.txt
제목: 봄 산책
`,mistake:"파일 하나를 되돌리려고 `git revert`나 `git reset --hard HEAD~1`을 쓰기. revert는 커밋에 든 모든 파일을, reset --hard는 커밋 자체를 되돌려 필요 없는 것까지 바뀌어요.",in_code:"AI가 한 파일을 망가뜨렸을 때는 `git show HEAD~1:파일`로 옛 내용을 먼저 보고, 맞으면 `git restore --source=HEAD~1 파일`로 가져와요. 가져온 뒤에는 평소처럼 add와 commit으로 새 커밋을 남겨요."},{type:`example`,id:`theory-git-undo-ex5`,kind:`choice`,title:`두 번 바꾼 제목`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/blog/  ← 지금 위치
# └── post.txt
# post.txt 내용:
#   제목: 첫눈
# 지금 위치는 git 저장소입니다.
# 위 파일은 "겨울 글"로 커밋됨
echo "제목: 눈꽃" > post.txt
git commit -am "제목 변경"
echo "제목: 함박눈" > post.txt
git commit -am "제목 재변경"
git restore --source=HEAD~1 post.txt
cat post.txt`,capture:`last`,choices:[`제목: 눈꽃`,`제목: 첫눈`,`제목: 함박눈`],answer:`제목: 눈꽃`,feedback:{"제목: 첫눈":`HEAD~1이 맨 처음 커밋을 가리킨다고 생각했나요?`,"제목: 함박눈":`--source를 줘도 restore가 스테이지의 내용으로 되돌린다고 생각했나요?`},explanation:`HEAD는 마지막 커밋 제목 재변경이고 HEAD~1은 그 바로 전인 제목 변경이에요. --source=HEAD~1은 그 커밋의 post.txt를 가져오니 제목: 눈꽃이 나와요.`,card:`restore-source`,output:`제목: 눈꽃
`},{type:`summary`,points:["`git restore 파일`은 고친 내용을 버리고 스테이지의 내용(add 전이면 마지막 커밋)으로 되돌려요. `git restore .`은 추적 중인 파일 전부이고, 새 파일은 건드리지 않아요.","`git restore --staged 파일`은 스테이지에서만 내려요. 내용은 남고, 새 파일은 다시 ??가 돼요.","`git reset --soft HEAD~1`은 수정을 스테이지에, 옵션 없는 reset은 작업 폴더에 남기고, `--hard`는 커밋하지 않은 수정까지 지워요.","`git revert --no-edit HEAD`는 거꾸로 적용한 새 커밋을 더해 기록을 남기며 되돌려요.","파일 하나만 옛 커밋으로 돌릴 때는 `git restore --source=HEAD~1 파일`, `git checkout HEAD~1 -- 파일`, `git show HEAD~1:파일 > 파일`을 써요."]}],covers:{"git-undo-01":[`restore`],"git-undo-02":[`unstage`],"git-undo-03":[`restore`,`unstage`,`reset`],"git-undo-04":[`reset`,`revert`],"git-undo-05":[`reset`],"git-undo-06":[`restore`,`reset`,`revert`,`restore-source`]}},{id:`theory-git-branch`,version:2,concept_id:`git-branch`,title:`브랜치와 병합`,minutes:17,steps:[{type:`explain`,id:`branch`,title:`브랜치는 기록의 갈래`,body:"브랜치(branch)는 커밋 기록에 붙인 이름표이자 기록의 갈래예요. 처음에는 기본 브랜치 main 하나이고, `git branch`가 브랜치 목록을 보여 주며 지금 있는 브랜치 앞에 `*`를 붙여요. `git switch -c 이름`은 지금 커밋에서 갈라지는 새 브랜치를 만들어 그리로 옮겨 가고, 그 뒤의 커밋은 지금 브랜치에만 쌓여요. `git switch main`으로 돌아오면 Git이 작업 폴더의 파일을 main의 마지막 커밋 내용으로 바꿔 줘요.",code:`# ~/poster/  ← 지금 위치
# └── color.txt
# color.txt 내용:
#   배경: 흰색
# 지금 위치는 git 저장소입니다.
# 위 파일은 "포스터 초안"으로 커밋됨
git switch -c dark
echo "배경: 검정" > color.txt
git commit -am "어두운 배경"
git switch main
cat color.txt
git branch`,trace:["`git switch -c dark` → dark 브랜치를 만들어 옮겨 가요 → **Switched to a new branch 'dark'**",'`echo "배경: 검정" > color.txt` → 배경을 바꿔요','`git commit -am "어두운 배경"` → 커밋이 dark 브랜치에 쌓여요. 출력 맨 앞의 **[dark …]**가 커밋된 브랜치 이름이에요(해시는 컴퓨터마다 달라요)',"`git switch main` → main으로 돌아와요 → **Switched to branch 'main'**","`cat color.txt` → 파일이 main의 마지막 커밋 내용으로 바뀌어 → **배경: 흰색**","`git branch` → 브랜치 목록 → dark와 main이 있고, 지금 있는 main 앞에 `*`가 붙어요"],output:`Switched to a new branch 'dark'
[dark dc31021] 어두운 배경
 1 file changed, 1 insertion(+), 1 deletion(-)
Switched to branch 'main'
배경: 흰색
  dark
* main
`,mistake:"브랜치를 폴더 사본으로 생각하기. dark의 커밋은 사라진 게 아니라 dark에 남아 있어서, `git switch dark`로 가면 다시 배경: 검정이 보여요.",in_code:'AI가 "새 브랜치에서 실험하세요"라고 하면 main을 건드리지 않고 시도해 보라는 뜻이에요. 예전 안내의 `git checkout -b 이름`도 같은 일을 하고, Git 설정에 따라 기본 브랜치가 master일 수 있으니 `git branch`로 이름을 먼저 확인해요.'},{type:`example`,id:`theory-git-branch-ex1`,kind:`choice`,title:`다른 브랜치에서 만든 커밋`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/game/  ← 지금 위치
# └── rules.txt
# rules.txt 내용:
#   목숨 3개
# 지금 위치는 git 저장소입니다.
# 위 파일은 "규칙 초안"으로 커밋됨
git switch -c hard
echo "목숨 1개" > rules.txt
git commit -am "어려움 모드"
git switch main
git log --format=%s`,capture:`last`,choices:[`규칙 초안`,`어려움 모드
규칙 초안`,`어려움 모드`],answer:`규칙 초안`,feedback:{"어려움 모드\n규칙 초안":`다른 브랜치에서 만든 커밋도 main의 기록에 함께 쌓인다고 생각했나요?`,"어려움 모드":`브랜치를 옮기면 그 전 기록이 사라지고 마지막 커밋만 남는다고 생각했나요?`},explanation:`어려움 모드 커밋은 hard 브랜치에 있을 때 만들어서 hard에만 쌓여요. main으로 돌아온 뒤의 git log는 main의 기록이라 규칙 초안만 나와요.`,card:`branch`,output:`규칙 초안
`},{type:`explain`,id:`carry`,title:`커밋하지 않은 수정은 따라와요`,body:"브랜치는 커밋을 가리키는 이름이라, 아직 커밋하지 않은 수정은 어느 브랜치에도 속하지 않고 작업 폴더에 남아요. 그래서 수정한 채로 브랜치를 옮기면 그 수정도 그대로 따라와요. 수정을 한 브랜치에만 두려면 옮기기 전에 커밋해요. 옮길 브랜치의 내용과 겹쳐 수정을 잃을 수 있을 때는 Git이 `git switch`를 거절하고 커밋이나 stash(잠시 치워 두기)를 하라고 알려 줘요.",code:`# ~/poster/  ← 지금 위치
# ├── color.txt
# └── title.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "포스터 초안"으로 커밋됨
git switch -c dark
echo "부제: 밤" >> title.txt
echo "별 그림" > stars.txt
git switch main
cat title.txt; ls`,capture:`last`,trace:["`git switch -c dark` → dark를 만들어 옮겨 가요",'`echo "부제: 밤" >> title.txt` → 추적 중인 파일을 고치고 커밋하지 않아요','`echo "별 그림" > stars.txt` → 새 파일도 만들어요',"`git switch main` → 수정이 main의 내용과 겹치지 않아 그대로 옮겨 가요. 수정된 파일 이름을 알려 준 뒤 **Switched to branch 'main'**을 보여 줘요(실행 결과에는 마지막 줄의 출력만 담았어요)","`cat title.txt; ls` → main에서도 고친 내용이 그대로 → **부제: 밤**, 새 파일도 따라와 → **color.txt  stars.txt  title.txt**"],output:`부제: 밤
color.txt  stars.txt  title.txt
`,mistake:`브랜치를 옮기면 커밋하지 않은 수정이 원래 브랜치에 남는다고 생각하기. 수정은 작업 폴더에 있어서 어느 브랜치로 가든 따라다녀요.`,in_code:"AI가 브랜치를 옮기라고 안내하면 먼저 `git status --short`로 남은 수정이 있는지 봐요. 옮긴 뒤 커밋하면 그 수정은 옮겨 간 브랜치에 쌓여요."},{type:`example`,id:`theory-git-branch-ex2`,kind:`choice`,title:`옮긴 뒤의 파일들`,prompt:`아래 명령을 차례로 실행했을 때 마지막 줄의 출력을 고르세요.`,code:`# ~/game/  ← 지금 위치
# └── rules.txt
# rules.txt 내용:
#   목숨 3개
# 지금 위치는 git 저장소입니다.
# 위 파일은 "규칙 초안"으로 커밋됨
git switch -c hard
echo "목숨 1개" > rules.txt
git commit -am "어려움 모드"
echo "적 2배" > enemy.txt
git switch main
ls; cat rules.txt`,capture:`last`,output:`enemy.txt  rules.txt
목숨 3개
`,choices:[`enemy.txt  rules.txt
목숨 3개`,`rules.txt
목숨 3개`,`enemy.txt  rules.txt
목숨 1개`,`rules.txt
목숨 1개`],answer:`enemy.txt  rules.txt
목숨 3개`,feedback:{"rules.txt\n목숨 3개":`커밋하지 않은 새 파일도 hard 브랜치에 남는다고 생각했나요?`,"enemy.txt  rules.txt\n목숨 1개":`main으로 옮겨도 파일 내용은 hard의 커밋을 따른다고 생각했나요?`,"rules.txt\n목숨 1개":`브랜치를 옮기면 작업 폴더는 그대로이고 새 파일만 사라진다고 생각했나요?`},explanation:`커밋한 목숨 1개는 hard에 남아서 main으로 오면 rules.txt가 목숨 3개로 돌아가요. 커밋하지 않은 새 파일 enemy.txt는 어느 브랜치에도 속하지 않아 그대로 따라와요.`,card:`carry`},{type:`explain`,id:`merge`,title:`merge는 가져와서 지금 브랜치에`,body:"`git merge 이름`은 그 이름의 브랜치에 있는 커밋을 지금 브랜치로 가져와요. 그래서 받는 쪽 브랜치로 먼저 옮긴 다음 merge해요. 지금 브랜치에 그사이 새 커밋이 없으면 Git은 지금 브랜치를 가져올 브랜치의 커밋까지 그대로 앞으로 옮기는데, 이것을 fast-forward(빨리 감기)라고 해요. 가져올 것이 없으면 `Already up to date.`(이미 최신)만 나오고 아무것도 바뀌지 않아요.",code:`# ~/poster/  ← 지금 위치
# └── color.txt
# color.txt 내용:
#   배경: 흰색
# 지금 위치는 git 저장소입니다.
# 위 파일은 "포스터 초안"으로 커밋됨
git switch -c dark
echo "배경: 검정" > color.txt
git commit -am "어두운 배경"
git merge dark
git switch main
git merge dark`,trace:["`git switch -c dark` → dark를 만들어 옮겨 가요",'`echo "배경: 검정" > color.txt` → 배경을 바꿔요','`git commit -am "어두운 배경"` → dark에 커밋해요',"`git merge dark` → 지금 브랜치가 dark라서 자기 자신을 가져오는 셈 → **Already up to date.**","`git switch main` → 받는 쪽인 main으로 옮겨요","`git merge dark` → main에 새 커밋이 없으니 main을 dark의 커밋까지 앞으로 옮겨요 → **Updating …**, **Fast-forward**와 바뀐 줄 요약(Updating 뒤의 두 해시는 컴퓨터마다 달라요)"],output:`Switched to a new branch 'dark'
[dark dc31021] 어두운 배경
 1 file changed, 1 insertion(+), 1 deletion(-)
Already up to date.
Switched to branch 'main'
Updating 0dc1de8..dc31021
Fast-forward
 color.txt | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
`,mistake:"main에서 `git merge main`을 실행하기. 가져올 브랜치 자리에 지금 브랜치를 쓰면 `Already up to date.`만 나오고 아무것도 들어오지 않아요.",in_code:"AI의 안내가 \"main에 dark를 병합하세요\"라면 main에서 `git merge dark`를 실행한다는 뜻이에요. `git merge X`는 'X를 지금 브랜치로 가져온다'고 읽으면 방향을 헷갈리지 않아요."},{type:`example`,id:`theory-git-branch-ex3`,kind:`line`,title:`이미 최신이라는 줄`,prompt:`아래 명령 중 Already up to date.를 출력하는 줄을 고르세요.`,code:`# ~/game/  ← 지금 위치
# └── rules.txt
# rules.txt 내용:
#   목숨 3개
# 지금 위치는 git 저장소입니다.
# 위 파일은 "규칙 초안"으로 커밋됨
git switch -c hard
echo "목숨 1개" > rules.txt
git commit -am "어려움 모드"
git merge main
git switch main
git merge hard`,choices:[`10`,`11`,`12`],answer:`10`,check:{type:`prints`,target:`Already up to date.`},feedback:{11:`main으로 옮기는 명령이 병합할 것이 없다고 알려 준다고 생각했나요?`,12:`10번 줄에서 hard의 커밋이 main으로 이미 들어갔다고 생각했나요?`},explanation:`10번 줄은 hard에서 main을 가져오는데, main에는 hard에 없는 커밋이 없어 Already up to date.만 나와요. hard의 커밋은 main으로 옮긴 뒤 12번 줄에서야 fast-forward로 들어와요.`,card:`merge`,output:`Switched to a new branch 'hard'
[hard 5aa60ac] 어려움 모드
 1 file changed, 1 insertion(+), 1 deletion(-)
Already up to date.
Switched to branch 'main'
Updating 45a9f69..5aa60ac
Fast-forward
 rules.txt | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
`},{type:`explain`,id:`merge-commit`,title:`양쪽에 커밋이 있으면 병합 커밋`,body:"두 브랜치에 각자 새 커밋이 있으면 앞으로 옮기기만 할 수 없어서, Git이 두 갈래를 잇는 병합 커밋(merge commit)을 새로 만들어요. 이때 Git은 메시지를 쓰는 편집 창을 여는데, `--no-edit`를 붙이면 `Merge branch 'dark'` 같은 기본 메시지로 바로 커밋해요. 서로 다른 파일이나 떨어진 줄을 고쳤다면 두 브랜치의 변경이 모두 들어오지만, 바로 붙은 줄을 고치거나 같은 자리에 줄을 더하면 같은 줄이 아니어도 합치지 못하고 멈춰요. 거꾸로 작업 브랜치에서 `git merge main`을 하면 main의 새 커밋을 작업 브랜치로 먼저 받아 올 수 있어요.",code:`# ~/poster/  ← 지금 위치
# ├── color.txt
# └── title.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "포스터 초안"으로 커밋됨
git switch -c dark
echo "배경: 검정" > color.txt
git commit -am "어두운 배경"
git switch main
echo "부제: 밤" >> title.txt
git commit -am "부제"
git merge --no-edit dark`,capture:`last`,trace:["`git switch -c dark` → dark를 만들어 옮겨 가요",'`echo "배경: 검정" > color.txt` → dark에서 color.txt를 바꿔요','`git commit -am "어두운 배경"` → dark에 커밋해요',"`git switch main` → main으로 돌아와요",'`echo "부제: 밤" >> title.txt` → main에서는 title.txt를 고쳐요','`git commit -am "부제"` → main에도 새 커밋이 생겨 두 브랜치가 갈라져요(실행 결과에는 마지막 명령의 출력만 담았어요)',"`git merge --no-edit dark` → 앞으로 옮길 수 없어 병합 커밋을 만들어요 → **Merge made by the 'ort' strategy.**(ort는 Git이 합치는 방법의 이름)와 dark에서 들어온 color.txt 변경 요약"],output:`Merge made by the 'ort' strategy.
 color.txt | 1 +
 1 file changed, 1 insertion(+)
`,mistake:`병합 커밋이 생기면 가져온 브랜치가 지금 브랜치의 커밋을 덮어쓴다고 생각하기. 병합 커밋은 두 갈래를 잇기만 해서 두 브랜치의 커밋과 변경이 모두 남아요.`,in_code:'AI가 "main의 최신 변경을 먼저 받으세요"라고 하면 작업 브랜치에서 `git merge main`을 하라는 뜻이에요. 그렇게 받아 두면 충돌이 생겨도 작업 브랜치에서 해결할 수 있어 main이 안전하고, 나중에 main에서 작업 브랜치를 합칠 때도 쉬워요.'},{type:`example`,id:`theory-git-branch-ex4`,kind:`choice`,title:`병합 뒤의 두 파일`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/game/  ← 지금 위치
# ├── map.txt
# └── rules.txt
# rules.txt 내용:
#   목숨 3개
# 지금 위치는 git 저장소입니다.
# 위 파일은 "규칙 초안"으로 커밋됨
git switch -c hard
echo "목숨 1개" > rules.txt
git commit -am "어려움 모드"
git switch main
echo "동굴" >> map.txt
git commit -am "지도 확장"
git merge --no-edit hard
cat rules.txt map.txt`,capture:`last`,choices:[`목숨 1개
동굴`,`목숨 3개
동굴`,`목숨 1개`],answer:`목숨 1개
동굴`,feedback:{"목숨 3개\n동굴":`병합해도 가져온 브랜치의 변경은 들어오지 않는다고 생각했나요?`,"목숨 1개":`병합하면 파일이 모두 가져온 브랜치의 내용으로 바뀐다고 생각했나요?`},explanation:`두 브랜치가 서로 다른 파일을 고쳐서 충돌 없이 병합 커밋이 만들어져요. main에는 hard의 목숨 1개와 main의 동굴이 모두 들어 있어요.`,card:`merge-commit`,output:`목숨 1개
동굴
`},{type:`explain`,id:`conflict`,title:`같은 줄을 고치면 충돌`,body:"두 브랜치가 같은 줄을 서로 다르게 고친 뒤 합치면 Git은 어느 쪽을 남길지 정하지 못해 병합을 멈춰요. 그 파일에는 두 내용이 표시와 함께 적혀요. `<<<<<<< HEAD`부터 `=======`까지는 지금 브랜치(ours, 우리 쪽), `=======`부터 `>>>>>>> dark`까지는 가져오는 브랜치(theirs, 상대 쪽)의 내용이에요. 파일을 원하는 내용으로 고쳐 쓰거나 `git checkout --ours 파일`·`git checkout --theirs 파일`로 한쪽을 고른 뒤 add와 commit으로 마무리하고, 병합을 없던 일로 하려면 `git merge --abort`를 써요.",code:`# ~/poster/  ← 지금 위치
# └── color.txt
# color.txt 내용:
#   배경: 흰색
# 지금 위치는 git 저장소입니다.
# 위 파일은 "포스터 초안"으로 커밋됨
git switch -c dark
echo "배경: 검정" > color.txt
git commit -am "어두운 배경"
git switch main
echo "배경: 빨강" > color.txt
git commit -am "빨간 배경"
git merge dark; cat color.txt`,capture:`last`,trace:["`git switch -c dark` → dark를 만들어 옮겨 가요",'`echo "배경: 검정" > color.txt` → dark에서 첫 줄을 검정으로 바꿔요','`git commit -am "어두운 배경"` → dark에 커밋해요',"`git switch main` → main으로 돌아와요",'`echo "배경: 빨강" > color.txt` → main에서는 같은 줄을 빨강으로 바꿔요','`git commit -am "빨간 배경"` → main에 커밋해요(실행 결과에는 마지막 줄의 출력만 담았어요)',"`git merge dark; cat color.txt` → 같은 줄이 부딪쳐 **CONFLICT (content): Merge conflict in color.txt**와 자동 병합에 실패했다는 안내가 나와요. 파일에는 위쪽에 HEAD(main)의 **배경: 빨강**, 아래쪽에 dark의 **배경: 검정**이 표시와 함께 적혀요"],output:`Auto-merging color.txt
CONFLICT (content): Merge conflict in color.txt
Automatic merge failed; fix conflicts and then commit the result.
<<<<<<< HEAD
배경: 빨강
=======
배경: 검정
>>>>>>> dark
`,mistake:"표시를 지우지 않고 `git add`하기. add는 '이 파일은 해결했다'고 알리는 명령일 뿐이라 `<<<<<<<` 줄까지 그대로 커밋돼요.",in_code:"`git checkout --theirs 파일`은 가져오는 쪽(dark), `--ours`는 지금 브랜치(main)의 파일로 바꿔요. AI에게 충돌을 맡긴 뒤에는 커밋하기 전에 `cat`이나 `git diff`로 `<<<<<<<` 표시가 남았는지 꼭 확인해요."},{type:`example`,id:`theory-git-branch-ex5`,kind:`choice`,title:`상대 쪽 고르기`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/game/  ← 지금 위치
# └── rules.txt
# rules.txt 내용:
#   목숨 3개
# 지금 위치는 git 저장소입니다.
# 위 파일은 "규칙 초안"으로 커밋됨
git switch -c hard
echo "목숨 1개" > rules.txt
git commit -am "어려움 모드"
git switch main
echo "목숨 5개" > rules.txt
git commit -am "쉬움 모드"
git merge hard
git checkout --theirs rules.txt
cat rules.txt`,capture:`last`,choices:[`목숨 1개`,`목숨 5개`,`목숨 3개`,`<<<<<<< HEAD
목숨 5개
=======
목숨 1개
>>>>>>> hard`],answer:`목숨 1개`,feedback:{"목숨 5개":`theirs가 지금 브랜치 main 쪽을 가리킨다고 생각했나요?`,"목숨 3개":`--theirs가 두 브랜치가 갈라지기 전의 내용을 되살린다고 생각했나요?`,"<<<<<<< HEAD\n목숨 5개\n=======\n목숨 1개\n>>>>>>> hard":`--theirs가 파일을 바꾸지 않고 충돌 표시를 그대로 둔다고 생각했나요?`},explanation:`main에서 hard를 병합하고 있으니 ours는 지금 브랜치 main, theirs는 가져오는 hard예요. --theirs는 hard 쪽 파일로 바꿔서 목숨 1개만 남아요.`,card:`conflict`,output:`목숨 1개
`},{type:`summary`,points:["브랜치는 기록의 갈래예요. `git switch -c 이름`으로 만들어 옮기고, 커밋은 지금 브랜치에만 쌓여요. `git branch`는 지금 브랜치 앞에 `*`를 붙여요.",`브랜치를 옮기면 파일은 그 브랜치의 마지막 커밋 내용이 되고, 커밋하지 않은 수정과 새 파일은 그대로 따라와요.`,"`git merge X`는 X를 지금 브랜치로 가져와요. 받는 쪽으로 먼저 옮기고, 가져올 것이 없으면 `Already up to date.`예요.","지금 브랜치에 새 커밋이 없으면 fast-forward, 양쪽에 있으면 병합 커밋이 생겨요. `--no-edit`는 기본 메시지로 바로 커밋해요.","같은 줄을 다르게 고치면 충돌해요. `<<<<<<< HEAD` 아래는 지금 브랜치(ours), `=======` 아래는 가져오는 브랜치(theirs)예요."]}],covers:{"git-branch-01":[`branch`],"git-branch-02":[`branch`,`carry`,`merge`],"git-branch-03":[`branch`,`merge`],"git-branch-04":[`conflict`],"git-branch-05":[`carry`],"git-branch-06":[`merge`,`merge-commit`]}},{id:`theory-git-remote`,version:2,concept_id:`git-remote`,title:`원격 저장소와 .gitignore`,minutes:18,steps:[{type:`explain`,id:`ignore`,title:`.gitignore로 무시하기`,body:"`.gitignore`는 Git이 못 본 척할 파일 이름을 한 줄에 하나씩 적는 파일이에요. `*`는 '아무 글자나'라서 `*.tmp`는 이름이 .tmp로 끝나는 모든 파일에 맞고, 끝에 `/`를 붙인 `cache/`는 그 폴더 안 전체에 맞아요. 규칙은 적는 순간부터 적용돼 무시된 파일은 `git status`에 나오지 않아요. `.gitignore` 자신은 평범한 새 파일이라 ??로 보이고, 커밋해야 다른 컴퓨터의 저장소에도 같은 규칙이 적용돼요.",code:`# ~/club/  ← 지금 위치
# └── members.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "명단 시작"으로 커밋됨
printf '*.tmp\\ncache/\\n' > .gitignore
mkdir cache
echo "임시" > cache/page.txt
echo "메모" > draft.tmp
echo "회비" > fee.txt
git status --short`,trace:["`printf '*.tmp\\ncache/\\n' > .gitignore` → 규칙 두 줄(`*.tmp`, `cache/`)로 .gitignore를 만들어요","`mkdir cache` → cache 폴더를 새로 만들어요",'`echo "임시" > cache/page.txt` → cache 폴더 안에 파일을 만들어요','`echo "메모" > draft.tmp` → .tmp로 끝나는 파일을 만들어요','`echo "회비" > fee.txt` → 규칙에 맞지 않는 새 파일을 만들어요',"`git status --short` → 규칙에 맞는 cache 폴더와 draft.tmp는 빠지고 → **?? .gitignore**, **?? fee.txt**"],output:`?? .gitignore
?? fee.txt
`,mistake:"`.gitignore`를 만들면 그 파일 자신도 숨겨진다고 생각하기. 보통 파일이라 ??로 보이고, 함께 커밋해야 규칙이 공유돼요.",in_code:"AI가 비밀 값을 `.env` 파일에 넣으라고 하면 첫 커밋 전에 `.gitignore`에 `.env`가 있는지 확인해요. AI가 만들어 준 프로젝트에는 `node_modules/`나 `__pycache__/` 같은 폴더 규칙이 미리 들어 있는 경우가 많아요."},{type:`example`,id:`theory-git-remote-ex1`,kind:`choice`,title:`규칙을 나중에 적으면`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/club/  ← 지금 위치
# └── members.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "명단 시작"으로 커밋됨
echo "사진" > photo.bak
echo "식당" > menu.md
echo "*.bak" > .gitignore
git status --short`,choices:[`?? .gitignore
?? menu.md`,`?? .gitignore
?? menu.md
?? photo.bak`,`?? menu.md`,`(출력 없음)`],answer:`?? .gitignore
?? menu.md`,feedback:{"?? .gitignore\n?? menu.md\n?? photo.bak":`규칙을 적기 전에 만든 파일에는 .gitignore가 적용되지 않는다고 생각했나요?`,"?? menu.md":`.gitignore 파일 자신도 무시된다고 생각했나요?`,"(출력 없음)":`*.bak 규칙이 모든 새 파일을 숨긴다고 생각했나요?`},explanation:`.gitignore의 규칙은 적는 순간부터 적용돼서, 먼저 만든 photo.bak도 status에서 빠져요. .gitignore 자신과 규칙에 맞지 않는 menu.md는 새 파일로 보여요.`,card:`ignore`,output:`?? .gitignore
?? menu.md
`},{type:`explain`,id:`untrack`,title:`이미 추적 중인 파일은 무시되지 않아요`,body:"`.gitignore`는 아직 추적하지 않는 새 파일에만 효과가 있어요. 이미 커밋된 파일은 이름을 적어도 계속 추적돼서 고치면 M으로 보여요. 그 파일을 Git의 관리에서만 빼려면 `git rm --cached 파일`을 쓰고 커밋해요. 그러면 내 컴퓨터의 파일은 남고, 그 뒤로는 .gitignore가 적용돼요. `--cached` 없이 `git rm 파일`을 쓰면 내 컴퓨터의 파일까지 지워져요.",code:`# ~/club/  ← 지금 위치
# ├── members.txt
# └── token.txt
# token.txt 내용:
#   TOKEN=abc
# 지금 위치는 git 저장소입니다.
# 위 파일은 "명단 시작"으로 커밋됨
echo "token.txt" > .gitignore
echo "TOKEN=xyz" > token.txt
git status --short
git rm --cached token.txt
git status --short
ls`,trace:['`echo "token.txt" > .gitignore` → token.txt를 무시하라는 규칙을 적어요','`echo "TOKEN=xyz" > token.txt` → 이미 커밋된 token.txt를 고쳐요',"`git status --short` → 규칙이 있어도 추적 중인 파일이라 둘째 칸에 **M**이 보여요","`git rm --cached token.txt` → 다음 커밋에서 token.txt를 관리 대상에서 빼요 → **rm 'token.txt'**","`git status --short` → 첫째 칸의 **D**(deleted)는 다음 커밋에서 Git의 기록에서 빠진다는 뜻이에요","`ls` → 내 컴퓨터의 파일은 그대로 → **members.txt  token.txt**"],output:` M token.txt
?? .gitignore
rm 'token.txt'
D  token.txt
?? .gitignore
members.txt  token.txt
`,mistake:"`.gitignore`에 적기만 하면 이미 커밋한 파일도 무시된다고 생각하기. 추적 중인 파일은 `git rm --cached`로 빼고 커밋해야 무시돼요.",in_code:"이미 커밋한 비밀 값은 `git rm --cached`로 빼도 예전 커밋의 기록에 남아 있어요. 실제 키를 올렸다면 키를 새로 바꾸는 것이 안전하다고 AI도 함께 안내해요."},{type:`example`,id:`theory-git-remote-ex2`,kind:`choice`,title:`관리 목록에서 뺀 뒤`,prompt:`아래 명령을 차례로 실행했을 때 마지막 줄의 출력을 고르세요.`,code:`# ~/club/  ← 지금 위치
# ├── key.txt
# └── members.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "명단 시작"으로 커밋됨
echo "key.txt" > .gitignore
git rm --cached key.txt
git add .gitignore
git commit -m "키 빼기"
git ls-files; ls`,capture:`last`,output:`.gitignore
members.txt
key.txt  members.txt
`,choices:[`.gitignore
members.txt
key.txt  members.txt`,`.gitignore
members.txt
members.txt`,`.gitignore
key.txt
members.txt
key.txt  members.txt`,`members.txt
key.txt  members.txt`],answer:`.gitignore
members.txt
key.txt  members.txt`,feedback:{".gitignore\nmembers.txt\nmembers.txt":`--cached를 붙여도 내 컴퓨터의 파일까지 지워진다고 생각했나요?`,".gitignore\nkey.txt\nmembers.txt\nkey.txt  members.txt":`git rm --cached가 관리 목록에서는 빼지 않는다고 생각했나요?`,"members.txt\nkey.txt  members.txt":`커밋한 .gitignore는 관리 목록에 들어가지 않는다고 생각했나요?`},explanation:`git rm --cached로 key.txt를 관리 목록에서 빼고 .gitignore를 함께 커밋해서, ls-files에는 .gitignore와 members.txt만 남아요. 내 컴퓨터의 key.txt는 그대로라 ls에는 보여요.`,card:`untrack`},{type:`explain`,id:`clone`,title:`clone은 기록까지 통째로 복사`,body:"`git clone 원본 새폴더`는 저장소를 새 폴더로 통째로 복사해요. 파일뿐 아니라 모든 커밋 기록이 함께 오고, 복사본은 원본의 위치를 origin(원격 저장소의 기본 이름)으로 기억해요. `git remote`는 기억한 원격 저장소의 이름을, `git remote -v`는 이름과 주소를 보여 줘요. 실제로는 GitHub 같은 서버의 주소를 clone하지만, 여기서는 네트워크 없이 내 컴퓨터 안의 폴더를 원본으로 써요. `cd 폴더`는 지금 위치를 그 폴더로 옮기고, `cd ~`는 홈 폴더로 가요.",code:`# ~/
# └── club/  ← 지금 위치
#     └── members.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "명단 시작"으로 커밋됨
cd ~
git clone club laptop
cd laptop
git log --format=%s
git remote -v`,trace:["`# ~/` 아래 그림 → 홈 폴더 안의 club 폴더가 저장소이고, 거기서 시작해요","`cd ~` → 홈 폴더로 옮겨요","`git clone club laptop` → club을 laptop이라는 새 폴더로 복사해요 → **Cloning into 'laptop'...**, **done.**","`cd laptop` → 복사본 안으로 들어가요","`git log --format=%s` → 원본의 기록까지 함께 왔어요 → **명단 시작**","`git remote -v` → 원본을 **origin**이라는 이름으로 기억해요. 받아 올 때(fetch)와 올릴 때(push) 쓰는 주소 /home/mina/club이 한 줄씩 나와요"],output:`Cloning into 'laptop'...
done.
명단 시작
origin	/home/mina/club (fetch)
origin	/home/mina/club (push)
`,mistake:"clone이 파일만 복사한다고 생각하기. 커밋 기록 전체가 함께 와서 복사본에서도 `git log`로 예전 커밋을 볼 수 있어요.",in_code:'AI가 "저장소를 clone하세요"라며 `git clone`과 GitHub 주소를 주면 그 서버의 저장소가 새 폴더로 복사돼요. 받은 폴더 안에서 `git log`와 `git remote -v`로 기록과 원본 주소를 확인할 수 있어요.'},{type:`example`,id:`theory-git-remote-ex3`,kind:`choice`,title:`복사본이 기억하는 원본`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/
# └── club/  ← 지금 위치
#     └── members.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "명단 시작"으로 커밋됨
cd ~
git clone club backup
cd backup
git remote`,capture:`last`,choices:[`origin`,`club`,`backup`,`(출력 없음)`],answer:`origin`,feedback:{club:`원격 저장소의 이름이 원본 폴더 이름을 따른다고 생각했나요?`,backup:`원격 저장소의 이름이 복사본 폴더 이름이라고 생각했나요?`,"(출력 없음)":`복사한 저장소는 원본을 기억하지 않는다고 생각했나요?`},explanation:`git clone은 복사한 원본을 origin이라는 기본 이름으로 기억해요. 폴더 이름이 club이든 backup이든 원격 저장소의 이름은 origin이에요.`,card:`clone`,output:`origin
`},{type:`explain`,id:`push`,title:`push로 서버에 올리기`,body:"여러 컴퓨터나 사람이 함께 쓰는 서버의 저장소를 원격 저장소라고 하고, 서버에는 작업 폴더 없이 기록만 담은 bare 저장소를 둬요. 여기서는 `git clone --bare . ~/hub.git`으로 지금 저장소(`.`)의 기록만 복사해 서버 역할을 맡겨요. `git remote add origin 주소`는 그 저장소를 origin으로 등록하고, `git push -u origin main`은 main을 올리면서 앞으로 main이 origin/main(내 저장소가 기억하는 서버의 main)을 따라가게 정해요. `git status -sb`의 첫 줄은 내 브랜치와 서버 브랜치의 차이이고, `[ahead 1]`은 아직 올리지 않은 내 커밋이 1개라는 뜻이에요.",code:`# ~/
# └── club/  ← 지금 위치
#     └── members.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "명단 시작"으로 커밋됨
git clone --bare . ~/hub.git
git remote add origin ~/hub.git
git push -u origin main
echo "서연" >> members.txt
git commit -am "서연 가입"
git status -sb; git push`,capture:`last`,trace:["`git clone --bare . ~/hub.git` → 지금 저장소의 기록만 홈 폴더의 hub.git으로 복사해 서버 역할을 맡겨요","`git remote add origin ~/hub.git` → hub.git을 origin이라는 이름으로 등록해요","`git push -u origin main` → main을 올리고 origin/main을 따라가게 정해요. 이미 같은 기록이라 올릴 커밋은 없어요",'`echo "서연" >> members.txt` → 명단에 한 줄을 더해요','`git commit -am "서연 가입"` → 내 저장소에만 커밋이 생겨요(실행 결과에는 마지막 줄의 출력만 담았어요)',"`git status -sb; git push` → 올리기 전에는 **## main...origin/main [ahead 1]**이고, push가 커밋을 올리면 **To /home/mina/hub.git**과 `main -> main` 줄이 나와요. 그 줄 앞의 두 해시는 컴퓨터마다 달라요"],output:`## main...origin/main [ahead 1]
To /home/mina/hub.git
   f61bb11..b7d7fbf  main -> main
`,mistake:`commit만 하면 서버에도 올라간다고 생각하기. 커밋은 내 저장소에만 쌓이고, push를 해야 서버에 올라가요.`,in_code:'AI가 "원격 저장소를 연결하세요"라며 `git remote add origin 주소`와 `git push -u origin main`을 차례로 주는 경우가 많아요. 내 브랜치 이름이 master라면 `src refspec main does not match any` 오류가 나니 `git branch`로 이름을 먼저 확인해요. `-u`는 처음 한 번만 쓰면 되고, 그 뒤로는 `git push`만 써도 같은 곳에 올라가요.'},{type:`example`,id:`theory-git-remote-ex4`,kind:`choice`,title:`올리기 전의 표시`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/
# └── club/  ← 지금 위치
#     └── members.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "명단 시작"으로 커밋됨
git clone --bare . ~/hub.git
git remote add origin ~/hub.git
git push -u origin main
echo "도윤" >> members.txt
git commit -am "도윤 가입"
echo "지아" >> members.txt
git commit -am "지아 가입"
git status -sb`,capture:`last`,choices:[`## main...origin/main [ahead 2]`,`## main...origin/main [behind 2]`,`## main...origin/main`,`## main...origin/main [ahead 1]`],answer:`## main...origin/main [ahead 2]`,feedback:{"## main...origin/main [behind 2]":`ahead와 behind의 뜻을 서로 바꿔 생각했나요?`,"## main...origin/main":`commit만 해도 서버에 올라가 차이가 없어진다고 생각했나요?`,"## main...origin/main [ahead 1]":`커밋을 여러 번 해도 올릴 것은 마지막 커밋 하나뿐이라고 생각했나요?`},explanation:`push -u 뒤에 커밋을 두 개 더 만들고 아직 올리지 않았어요. 그래서 내 main이 origin/main보다 커밋 2개 앞서 [ahead 2]로 보여요.`,card:`push`,output:`## main...origin/main [ahead 2]
`},{type:`explain`,id:`fetch`,title:`fetch는 받아만 와요`,body:"`git fetch`는 원격 저장소의 새 커밋을 내려받아 origin/main만 앞으로 옮기고, 내 main 브랜치와 작업 폴더는 그대로 둬요. `git status -sb`는 마지막으로 받아 온 origin/main과 비교하므로, 서버에 새 커밋이 생겨도 fetch하기 전에는 차이가 보이지 않아요. fetch한 뒤에는 `[behind 1]`(서버보다 커밋 1개 뒤처짐)이 보이고, 양쪽에 새 커밋이 있으면 `[ahead 1, behind 1]`처럼 둘 다 보여요. 파일까지 받으려면 `git pull`(fetch와 합치기를 한 번에)이나 `git merge origin/main`이 더 필요해요.",code:`# ~/
# └── club/  ← 지금 위치
#     └── members.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "명단 시작"으로 커밋됨
git clone ~/club ~/laptop
echo "회장: 하준" >> members.txt
git commit -am "회장 정함"
cd ~/laptop
git status -sb; git fetch
git status -sb`,trace:["`git clone ~/club ~/laptop` → 지금 저장소를 laptop으로 복사해요. 이번에는 club이 원본(서버) 역할을 해요 → **Cloning into '/home/mina/laptop'...**",'`echo "회장: 하준" >> members.txt` → 원본에서 명단을 고쳐요','`git commit -am "회장 정함"` → 원본에 새 커밋이 생겨요. laptop은 아직 몰라요',"`cd ~/laptop` → 복사본으로 옮겨요","`git status -sb; git fetch` → fetch 전에는 서버의 새 커밋을 몰라서 차이가 없다고 나와요 → **## main...origin/main**. 이어서 fetch가 새 커밋을 받아 origin/main을 옮겨요 → **From /home/mina/club** 아래 `main -> origin/main` 줄(해시는 컴퓨터마다 달라요)","`git status -sb` → 내 main은 그대로라 이제 → **## main...origin/main [behind 1]**"],output:`Cloning into '/home/mina/laptop'...
done.
[main f3975f6] 회장 정함
 1 file changed, 1 insertion(+)
## main...origin/main
From /home/mina/club
   f61bb11..f3975f6  main       -> origin/main
## main...origin/main [behind 1]
`,mistake:`fetch를 하면 파일까지 바뀐다고 생각하기. fetch는 서버의 기록만 받아 와서, 작업 폴더의 파일은 pull이나 merge를 해야 바뀌어요.`,in_code:"AI가 작업 전에 `git fetch`를 권하는 까닭은 파일을 건드리지 않고 서버와의 차이부터 볼 수 있기 때문이에요. behind가 보이면 받을 커밋이, ahead가 보이면 아직 올리지 않은 커밋이 있다는 뜻이에요."},{type:`explain`,id:`sync`,title:`갈라진 기록 합치고 올리기`,body:"서버에 내가 받지 않은 커밋이 있으면 `git push`는 `! [rejected] … (fetch first)`로 거절돼요. push는 서버 기록의 끝에 내 커밋을 이어 붙일 수 있을 때만 받아들여지기 때문이에요. 이때는 `git pull --rebase`로 서버의 커밋을 받아 그 위에 내 커밋을 다시 쌓거나, `git pull --no-rebase`로 병합 커밋을 만들어 합친 뒤 push해요. 커밋하지 않은 수정이 있으면 `pull --rebase`가 시작하지 않으니 먼저 커밋해요. 방식을 정하지 않은 `git pull`은 기록이 갈라져 있으면 `Need to specify how to reconcile divergent branches`라며 멈춰요.",code:`# ~/
# └── club/  ← 지금 위치
#     ├── fee.txt
#     └── members.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "명단 시작"으로 커밋됨
git clone ~/club ~/laptop
echo "회장: 하준" >> members.txt
git commit -am "회장 정함"
cd ~/laptop
echo "5000원" >> fee.txt
git commit -am "회비 기록"
git pull --rebase
git log --format=%s`,capture:`last`,trace:["`git clone ~/club ~/laptop` → club을 laptop으로 복사해요. club이 서버 역할이에요",'`echo "회장: 하준" >> members.txt` → club에서 명단을 고쳐요','`git commit -am "회장 정함"` → 서버 쪽에 새 커밋이 생겨요',"`cd ~/laptop` → 내 복사본으로 옮겨요",'`echo "5000원" >> fee.txt` → laptop에서는 회비 파일을 고쳐요','`git commit -am "회비 기록"` → 내 쪽에도 새 커밋이 생겨 두 기록이 갈라져요. 아직 fetch 전이라 `git status -sb`에는 `[ahead 1]`만 보이고, fetch하면 `[ahead 1, behind 1]`이 돼요',"`git pull --rebase` → pull이 fetch까지 함께 해서 서버의 회장 정함을 받고, 그 위에 내 회비 기록을 다시 쌓아요(실행 결과에는 마지막 명령의 출력만 담았어요)","`git log --format=%s` → 한 줄로 이어진 기록 → **회비 기록**, **회장 정함**, **명단 시작**. 서버 기록 끝에 내 커밋이 이어진 모양이라, 실제 서버(bare 저장소)라면 이제 push가 받아들여져요. 작업 폴더가 있는 club 같은 저장소는 지금 쓰는 브랜치로 오는 push를 거절해요"],output:`회비 기록
회장 정함
명단 시작
`,mistake:"push가 거절됐다고 `git push --force`를 쓰기. 서버의 기록을 내 기록으로 덮어써서, 내가 받지 않은 다른 사람의 커밋이 서버에서 사라져요.",in_code:"AI가 `git pull`만 안내했는데 갈라진 기록 때문에 멈췄다면 `--rebase`나 `--no-rebase`를 정해 다시 실행해요. `git fetch` 뒤의 `git reset --hard origin/main`은 서버 기록에 맞추면서 아직 올리지 않은 내 커밋을 지우니 조심해요."},{type:`example`,id:`theory-git-remote-ex5`,kind:`choice`,title:`병합으로 합치면`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/
# └── club/  ← 지금 위치
#     ├── fee.txt
#     └── members.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "명단 시작"으로 커밋됨
git clone ~/club ~/laptop
echo "총무: 서연" >> members.txt
git commit -am "총무 정함"
cd ~/laptop
echo "3000원" >> fee.txt
git commit -am "간식비"
git pull --no-rebase --no-edit
git log --format=%s -1`,capture:`last`,choices:[`Merge branch 'main' of /home/mina/club`,`간식비`,`총무 정함`],answer:`Merge branch 'main' of /home/mina/club`,feedback:{간식비:`--no-rebase도 --rebase처럼 내 커밋을 맨 위에 다시 쌓는다고 생각했나요?`,"총무 정함":`pull이 내 커밋을 버리고 서버의 마지막 커밋으로 맞춘다고 생각했나요?`},explanation:`--no-rebase는 서버의 총무 정함과 내 간식비를 병합 커밋으로 합쳐요. 그래서 맨 위 커밋은 원본 주소가 들어간 병합 메시지이고, 실제 서버라면 그 자리에 서버 주소가 들어가요.`,card:`sync`,output:`Merge branch 'main' of /home/mina/club
`},{type:`summary`,points:["`.gitignore`에 적은 이름과 패턴(`*.tmp`, `cache/`)에 맞는 새 파일은 status에 나오지 않아요. `.gitignore` 자신은 커밋해요.","이미 추적 중인 파일은 .gitignore로 무시되지 않아요. `git rm --cached 파일`로 관리에서만 빼고 커밋해요.","`git clone`은 파일과 기록을 통째로 복사하고 원본을 origin으로 기억해요.","`git push`는 내 커밋을 서버에 올려요. `git status -sb`의 ahead는 올리지 않은 내 커밋, behind는 받지 않은 서버 커밋의 수예요.","`git fetch`는 서버 기록만 받아 origin/main을 옮기고, 파일은 pull이나 merge로 받아요.","기록이 갈라지면 push가 거절돼요. `git pull --rebase`나 `--no-rebase`로 합친 뒤 올리고, `--force`는 다른 사람의 커밋을 지우니 쓰지 않아요."]}],covers:{"git-remote-01":[`ignore`],"git-remote-02":[`clone`],"git-remote-03":[`untrack`],"git-remote-04":[`push`,`sync`],"git-remote-05":[`push`,`fetch`],"git-remote-06":[`fetch`,`sync`]}},{id:`theory-git-stash`,version:2,concept_id:`git-stash`,title:`잠시 치워 두기(stash)`,minutes:13,steps:[{type:`explain`,id:`stash`,title:`stash로 수정 맡겨 두기`,body:"`git stash`는 아직 커밋하지 않은 수정을 Git 안의 별도 보관함에 맡기고, 작업 폴더를 마지막 커밋 상태로 돌려놓아요. 맡긴 수정은 사라진 게 아니라서 `git stash pop`으로 다시 꺼내요. 하던 일을 커밋하기에는 이른데 브랜치를 옮기거나 급한 일을 먼저 해야 할 때 써요. add로 스테이지에 올린 수정도 함께 맡겨져요.",code:`# ~/essay/  ← 지금 위치
# └── intro.txt
# intro.txt 내용:
#   서론 초안
# 지금 위치는 git 저장소입니다.
# 위 파일은 "글 시작"으로 커밋됨
echo "예시 문단" >> intro.txt
git stash
git status --short
git stash pop
cat intro.txt`,trace:['`echo "예시 문단" >> intro.txt` → 커밋하지 않은 수정을 만들어요',"`git stash` → 수정을 보관함에 맡겨요 → **Saved working directory and index state WIP on main: … 글 시작**. WIP는 하던 일(work in progress)이라는 뜻이고, 뒤는 맡긴 자리의 커밋이에요(해시는 컴퓨터마다 달라요)","`git status --short` → 작업 폴더가 마지막 커밋과 같아져 아무것도 나오지 않아요","`git stash pop` → 맡긴 수정을 다시 꺼내고 `git status`와 같은 안내(**modified: intro.txt**)를 보여 준 뒤, 보관함에서 그 항목을 지웠다는 **Dropped …** 줄을 보여 줘요(괄호 안 번호는 컴퓨터마다 달라요)","`cat intro.txt` → 수정이 돌아와 → **서론 초안**, **예시 문단**"],output:`Saved working directory and index state WIP on main: 7a240c0 글 시작
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   intro.txt

no changes added to commit (use "git add" and/or "git commit -a")
Dropped refs/stash@{0} (fecf61c96ae12b0a2128d348951b061231183543)
서론 초안
예시 문단
`,mistake:`stash를 수정 취소로 생각하기. 수정은 보관함에 있어서 pop으로 언제든 되찾을 수 있어요. 반대로 꺼내는 것을 잊으면 수정이 보관함에만 남아 있어요.`,in_code:'AI가 "먼저 stash 하세요"라고 안내하면 수정을 잠시 맡겨 두라는 뜻이에요. 급한 일을 마친 뒤 `git stash pop`으로 꺼내는 것까지가 한 세트예요.'},{type:`example`,id:`theory-git-stash-ex1`,kind:`choice`,title:`add한 수정도 맡기면`,prompt:`아래 명령을 차례로 실행했을 때 마지막 줄의 출력을 고르세요.`,code:`# ~/essay/  ← 지금 위치
# └── intro.txt
# intro.txt 내용:
#   서론 초안
# 지금 위치는 git 저장소입니다.
# 위 파일은 "글 시작"으로 커밋됨
echo "인용문" >> intro.txt
git add intro.txt
git stash
git status --short; cat intro.txt`,capture:`last`,choices:[`서론 초안`,`M  intro.txt
서론 초안
인용문`,`?? intro.txt
서론 초안`,`서론 초안
인용문`],answer:`서론 초안`,feedback:{"M  intro.txt\n서론 초안\n인용문":`add해서 스테이지에 올린 수정은 stash가 맡기지 않는다고 생각했나요?`,"?? intro.txt\n서론 초안":`stash 뒤에 파일이 추적되지 않는 상태가 된다고 생각했나요?`,"서론 초안\n인용문":`stash가 스테이지만 비우고 작업 폴더의 파일은 그대로 둔다고 생각했나요?`},explanation:`git stash는 스테이지에 올린 수정까지 함께 맡기고 작업 폴더를 마지막 커밋 상태로 돌려요. 그래서 status에는 아무것도 없고 intro.txt는 서론 초안 한 줄이에요.`,card:`stash`,output:`서론 초안
`},{type:`explain`,id:`untracked`,title:`새 파일은 그대로 남아요`,body:"옵션 없는 `git stash`는 Git이 이미 추적 중인 파일의 수정(스테이지에 올린 것 포함)만 맡겨요. 한 번도 add한 적 없는 새 파일은 그대로 남아 ??로 보이고, 맡길 것이 새 파일뿐이면 `No local changes to save`(맡길 수정 없음)라고 알려 줘요. 새 파일까지 함께 맡기려면 `git stash -u`(untracked 포함)를 써요. 꺼낼 때는 맡긴 새 파일도 함께 돌아와요.",code:`# ~/essay/  ← 지금 위치
# └── intro.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "글 시작"으로 커밋됨
echo "참고 자료" > refs.txt
git stash
git stash -u
ls`,trace:['`echo "참고 자료" > refs.txt` → 새 파일만 만들고, 추적 중인 파일은 고치지 않아요',"`git stash` → 맡길 수정이 없다고 알려 줘요 → **No local changes to save**. 새 파일은 옵션 없는 stash가 맡기지 않아요","`git stash -u` → 새 파일까지 맡겨요 → **Saved working directory and index state WIP on main: … 글 시작**(해시는 컴퓨터마다 달라요)","`ls` → refs.txt도 보관함으로 들어가 → **intro.txt**만 남아요"],output:`No local changes to save
Saved working directory and index state WIP on main: b62d7bb 글 시작
intro.txt
`,mistake:"stash 뒤에 새 파일이 남아 있으면 stash가 실패했다고 생각하기. 새 파일은 원래 맡기지 않으니 `-u`를 붙여요.",in_code:`AI가 만든 새 파일이 stash 뒤에도 남아 있어 놀랐다면 이 경우예요. 그 새 파일은 브랜치를 옮겨도 작업 폴더에 남아 따라다녀요.`},{type:`example`,id:`theory-git-stash-ex2`,kind:`choice`,title:`-u로 맡긴 뒤의 폴더`,prompt:`아래 명령을 차례로 실행했을 때 마지막 줄의 출력을 고르세요.`,code:`# ~/essay/  ← 지금 위치
# └── intro.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "글 시작"으로 커밋됨
echo "인용문" >> intro.txt
echo "개요" > outline.txt
git stash -u
git status --short; ls`,capture:`last`,output:`intro.txt
`,choices:[`intro.txt`,`?? outline.txt
intro.txt  outline.txt`,` M intro.txt
intro.txt`,`outline.txt`],answer:`intro.txt`,feedback:{"?? outline.txt\nintro.txt  outline.txt":`-u를 붙여도 새 파일은 맡기지 않는다고 생각했나요?`," M intro.txt\nintro.txt":`-u가 새 파일만 맡기고 고친 파일은 남긴다고 생각했나요?`,"outline.txt":`stash가 추적 중인 파일까지 폴더에서 치운다고 생각했나요?`},explanation:`-u는 추적 중인 파일의 수정과 새 파일 outline.txt를 함께 보관함에 맡겨요. 그래서 status에는 아무것도 없고, 폴더에는 커밋된 intro.txt만 남아요.`,card:`untracked`},{type:`explain`,id:`list-drop`,title:`보관함 목록과 꺼내는 방법`,body:'`git stash list`는 보관함의 항목을 최근 것부터 보여 주고, 맨 위 `stash@{0}`이 가장 최근에 맡긴 것이에요. `git stash push -m "메모"`처럼 메모를 붙여 맡기면 목록에서 알아보기 쉬워요. 항목을 다루는 방법은 세 가지예요. `pop`은 수정을 작업 폴더로 꺼내고 목록에서 지우고, `apply`는 꺼내되 목록에 남기고, `drop`은 꺼내지 않고 지워 버려요. 보관함은 브랜치를 옮기거나 커밋해도 그대로 남아요.',code:`# ~/essay/  ← 지금 위치
# └── intro.txt
# intro.txt 내용:
#   서론 초안
# 지금 위치는 git 저장소입니다.
# 위 파일은 "글 시작"으로 커밋됨
echo "예시 문단" >> intro.txt
git stash push -m "예시 쓰는 중"
git stash list
git stash drop
git stash list
cat intro.txt`,trace:['`echo "예시 문단" >> intro.txt` → 수정을 만들어요','`git stash push -m "예시 쓰는 중"` → 메모를 붙여 맡겨요 → **Saved working directory and index state On main: 예시 쓰는 중**',"`git stash list` → 맡긴 항목 → **stash@{0}: On main: 예시 쓰는 중**","`git stash drop` → 꺼내지 않고 지워요 → **Dropped refs/stash@{0} (…)**(괄호 안 번호는 컴퓨터마다 달라요)","`git stash list` → 목록이 비어 아무것도 나오지 않아요","`cat intro.txt` → 예시 문단은 돌아오지 않았어요 → **서론 초안**"],output:`Saved working directory and index state On main: 예시 쓰는 중
stash@{0}: On main: 예시 쓰는 중
Dropped refs/stash@{0} (0c9043d1127730d6fd845385b0e09a14c29fa4f6)
서론 초안
`,mistake:"drop을 꺼내기로 생각하기. drop은 맡긴 수정을 작업 폴더로 꺼내지 않고 목록에서 지워서, `Dropped` 줄 괄호 안의 번호로 `git stash apply 번호`를 하지 않는 한 되찾기 어려워요.",in_code:"AI가 알려 준 명령에 `git stash drop`이나 `git stash clear`(전부 지우기)가 있으면 맡긴 수정을 지우는 명령이니 실행 전에 꼭 확인해요. 꺼낼 때는 `pop`이나 `apply`를 써요."},{type:`example`,id:`theory-git-stash-ex3`,kind:`choice`,title:`apply 뒤에 drop하면`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/essay/  ← 지금 위치
# └── intro.txt
# intro.txt 내용:
#   서론 초안
# 지금 위치는 git 저장소입니다.
# 위 파일은 "글 시작"으로 커밋됨
echo "인용문" >> intro.txt
git stash push -m "인용"
git stash apply
git stash drop
cat intro.txt`,capture:`last`,choices:[`서론 초안
인용문`,`서론 초안`,`서론 초안
인용문
인용문`],answer:`서론 초안
인용문`,feedback:{"서론 초안":`drop이 apply로 되돌린 수정까지 지운다고 생각했나요?`,"서론 초안\n인용문\n인용문":`apply와 drop이 수정을 한 번씩 되돌려 두 번 더한다고 생각했나요?`},explanation:`apply가 수정을 작업 폴더로 되돌리고 항목은 목록에 남겨 둬요. 이어지는 drop은 목록의 항목만 지우니, 이미 돌아온 인용문은 그대로예요.`,card:`list-drop`,output:`서론 초안
인용문
`},{type:`explain`,id:`switch-stash`,title:`브랜치를 옮기기 전에 맡기기`,body:"커밋하지 않은 수정이 옮겨 갈 브랜치의 내용과 겹치면 Git은 수정을 잃을 수 있다며 `git switch`를 거절해요. 이때 `git stash`로 수정을 맡기면 작업 폴더가 깨끗해져 옮길 수 있어요. 급한 일을 마치고 원래 브랜치로 돌아온 뒤 `git stash pop`을 해야 수정이 원래 자리로 돌아와요. 다른 브랜치에서 pop하면 그 브랜치의 파일과 충돌할 수 있어요.",code:`# ~/essay/  ← 지금 위치
# └── intro.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "글 시작"으로 커밋됨
git switch -c typo
echo "서론 수정" > intro.txt
git commit -am "오타 고침"
echo "추가 문장" >> intro.txt
git switch main
git stash; git switch main`,trace:["`git switch -c typo` → typo 브랜치를 만들어 옮겨 가요",'`echo "서론 수정" > intro.txt` → 파일을 고쳐요','`git commit -am "오타 고침"` → typo에만 커밋해요(해시는 컴퓨터마다 달라요)','`echo "추가 문장" >> intro.txt` → 커밋하지 않은 수정을 더해요',"`git switch main` → main의 intro.txt는 내용이 달라 수정을 덮어쓸 수 있어서 거절 → **error: Your local changes to the following files would be overwritten by checkout:**, 커밋이나 stash를 하라는 안내, **Aborting**(중단)","`git stash; git switch main` → 수정을 맡기니 → **Saved … WIP on typo: … 오타 고침**, 이번에는 **Switched to branch 'main'**"],output:`Switched to a new branch 'typo'
[typo 976b423] 오타 고침
 1 file changed, 1 insertion(+)
error: Your local changes to the following files would be overwritten by checkout:
	intro.txt
Please commit your changes or stash them before you switch branches.
Aborting
Saved working directory and index state WIP on typo: 976b423 오타 고침
Switched to branch 'main'
`,mistake:"급한 일을 마친 뒤 main에서 바로 `git stash pop`하기. 맡긴 수정은 typo의 내용 위에서 만든 것이라 main의 파일과 충돌할 수 있어요. typo로 돌아간 뒤에 꺼내요.",in_code:"급한 수정을 끼워 넣을 때 AI가 안내하는 흐름은 대부분 stash → 다른 브랜치에서 작업과 커밋 → 원래 브랜치로 돌아와 `git stash pop` 순서예요."},{type:`example`,id:`theory-git-stash-ex4`,kind:`choice`,title:`다른 브랜치에서 본 목록`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/essay/  ← 지금 위치
# └── intro.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "글 시작"으로 커밋됨
git switch -c typo
echo "추가 문장" >> intro.txt
git stash push -m "추가"
git switch main
git stash list`,capture:`last`,choices:[`stash@{0}: On typo: 추가`,`stash@{0}: On main: 추가`,`(출력 없음)`],answer:`stash@{0}: On typo: 추가`,feedback:{"stash@{0}: On main: 추가":`목록의 브랜치 이름이 지금 있는 브랜치로 바뀐다고 생각했나요?`,"(출력 없음)":`맡긴 항목은 그 브랜치를 떠나면 목록에서 보이지 않는다고 생각했나요?`},explanation:`보관함은 브랜치마다 따로 있지 않아서 main에서도 같은 목록이 보여요. 항목에는 맡긴 곳이 typo였다는 것이 On typo로 남아요.`,card:`list-drop`,output:`stash@{0}: On typo: 추가
`},{type:`summary`,points:["`git stash`는 커밋하지 않은 수정(스테이지 포함)을 보관함에 맡기고 작업 폴더를 마지막 커밋 상태로 돌려요. `git stash pop`으로 다시 꺼내요.","새 파일은 그대로 남아요. 함께 맡기려면 `git stash -u`를 써요.","`git stash list`의 `stash@{0}`이 가장 최근 항목이에요. `pop`은 꺼내고 지우고, `apply`는 꺼내고 남기고, `drop`은 꺼내지 않고 지워요.","겹치는 수정이 있으면 `git switch`가 거절돼요. stash로 맡기고 옮긴 뒤, 원래 브랜치로 돌아와서 pop해요."]}],covers:{"git-stash-01":[`stash`],"git-stash-02":[`untracked`],"git-stash-03":[`stash`,`switch-stash`],"git-stash-04":[`stash`,`list-drop`]}},{id:`theory-git-conflict`,version:2,concept_id:`git-conflict`,title:`충돌 읽고 해결하기`,minutes:15,steps:[{type:`explain`,id:`markers`,title:`충돌 표시와 병합 안내 읽기`,body:"5강에서 본 것처럼 두 브랜치가 같은 줄을 서로 다르게 고친 뒤 합치면 충돌이 나요. Git은 `CONFLICT (content): Merge conflict in 파일`로 충돌한 파일을 알리고 병합을 멈춰요. 파일에는 `<<<<<<< HEAD`부터 `=======`까지 지금 브랜치의 내용이, `=======`부터 `>>>>>>> 브랜치이름`까지 가져오는 브랜치의 내용이 적혀요. HEAD는 언제나 merge를 실행한 지금 브랜치라서, main이 아닌 브랜치에서 merge하면 위쪽이 그 브랜치의 내용이에요. 이 표시는 파일의 실제 내용이라 지우지 않으면 프로그램이 오류를 내거나 표시째 커밋돼요.",code:`# ~/party/  ← 지금 위치
# └── time.txt
# time.txt 내용:
#   시작: 7시
# 지금 위치는 git 저장소입니다.
# 위 파일은 "모임 계획"으로 커밋됨
git switch -c early
echo "시작: 6시" > time.txt
git commit -am "일찍 시작"
git switch main
echo "시작: 8시" > time.txt
git commit -am "늦게 시작"
git merge early; cat time.txt`,capture:`last`,trace:["`git switch -c early` → early를 만들어 옮겨 가요",'`echo "시작: 6시" > time.txt` → early에서 시작 시각을 6시로 고쳐요','`git commit -am "일찍 시작"` → early에 커밋해요',"`git switch main` → main으로 돌아와요",'`echo "시작: 8시" > time.txt` → main에서는 같은 줄을 8시로 고쳐요','`git commit -am "늦게 시작"` → main에 커밋해요. 이제 두 브랜치가 같은 줄을 다르게 고친 상태예요(실행 결과에는 마지막 줄의 출력만 담았어요)',"`git merge early; cat time.txt` → **Auto-merging time.txt**(자동 병합 시도), **CONFLICT (content): Merge conflict in time.txt**(내용 충돌), **Automatic merge failed; fix conflicts and then commit the result.**(충돌을 고친 뒤 커밋하라는 안내). 파일의 위쪽은 HEAD인 main의 **시작: 8시**, 아래쪽은 early의 **시작: 6시**예요"],output:`Auto-merging time.txt
CONFLICT (content): Merge conflict in time.txt
Automatic merge failed; fix conflicts and then commit the result.
<<<<<<< HEAD
시작: 8시
=======
시작: 6시
>>>>>>> early
`,mistake:`위쪽이 언제나 main의 내용이라고 생각하기. 위쪽은 HEAD, 즉 merge를 실행한 지금 브랜치의 내용이에요.`,in_code:`AI가 고친 코드와 내 코드가 충돌했다면 먼저 두 영역이 각각 어느 쪽인지 읽어요. VS Code 같은 편집기는 위쪽을 Current Change(지금 쪽), 아래쪽을 Incoming Change(들어오는 쪽)라고 표시해요.`},{type:`example`,id:`theory-git-conflict-ex1`,kind:`choice`,title:`작업 브랜치에서 합칠 때`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/party/  ← 지금 위치
# └── place.txt
# place.txt 내용:
#   장소: 공원
# 지금 위치는 git 저장소입니다.
# 위 파일은 "장소 후보"로 커밋됨
git switch -c cafe
echo "장소: 카페" > place.txt
git commit -am "카페로"
git switch main
echo "장소: 강변" > place.txt
git commit -am "강변으로"
git switch cafe
git merge main
cat place.txt`,capture:`last`,choices:[`<<<<<<< HEAD
장소: 카페
=======
장소: 강변
>>>>>>> main`,`<<<<<<< HEAD
장소: 강변
=======
장소: 카페
>>>>>>> main`,`장소: 카페`,`장소: 강변`],answer:`<<<<<<< HEAD
장소: 카페
=======
장소: 강변
>>>>>>> main`,feedback:{"<<<<<<< HEAD\n장소: 강변\n=======\n장소: 카페\n>>>>>>> main":`HEAD 쪽에는 언제나 main의 내용이 온다고 생각했나요?`,"장소: 카페":`충돌하면 지금 브랜치의 내용이 자동으로 남는다고 생각했나요?`,"장소: 강변":`충돌하면 가져오는 브랜치의 내용이 자동으로 이긴다고 생각했나요?`},explanation:`merge를 실행한 곳이 cafe라서 HEAD는 cafe예요. 위쪽에 cafe의 장소: 카페, ======= 아래에 가져오는 main의 장소: 강변이 적혀요.`,card:`markers`,output:`<<<<<<< HEAD
장소: 카페
=======
장소: 강변
>>>>>>> main
`},{type:`explain`,id:`unmerged`,title:`충돌 중인 파일의 상태: UU`,body:"충돌한 파일은 `git status --short`에서 `UU`로 보여요. U는 unmerged(아직 합쳐지지 않음)라는 뜻이고, 충돌 중에는 두 칸이 스테이지와 작업 폴더가 아니라 병합하는 양쪽 브랜치의 변경을 가리켜요. UU가 남아 있는 동안 병합은 끝나지 않은 채로 멈춰 있고 `git commit`도 거절돼요. 파일 내용을 고친 것만으로는 UU가 사라지지 않고, `git add`로 '해결했다'고 알려야 사라져요. add까지 함께 하는 `git commit -am`은 표시가 남은 파일도 그대로 커밋해 버리니 충돌 중에는 쓰지 않아요.",code:`# ~/party/  ← 지금 위치
# └── time.txt
# time.txt 내용:
#   시작: 7시
# 지금 위치는 git 저장소입니다.
# 위 파일은 "모임 계획"으로 커밋됨
git switch -c early
echo "시작: 6시" > time.txt
git commit -am "일찍 시작"
git switch main
echo "시작: 8시" > time.txt
git commit -am "늦게 시작"
git merge early
git status --short; git status`,capture:`last`,compare:`exact`,trace:["`git switch -c early` → early를 만들어 옮겨 가요",'`echo "시작: 6시" > time.txt` → early에서 시작 시각을 6시로 고쳐요','`git commit -am "일찍 시작"` → early에 커밋해요',"`git switch main` → main으로 돌아와요",'`echo "시작: 8시" > time.txt` → main에서는 같은 줄을 8시로 고쳐요','`git commit -am "늦게 시작"` → main에 커밋해요. 이제 두 브랜치가 같은 줄을 다르게 고친 상태예요(실행 결과에는 마지막 줄의 출력만 담았어요)',"`git merge early` → 충돌로 병합이 멈춰요","`git status --short; git status` → 짧게는 **UU time.txt**. 길게는 **You have unmerged paths.**(합쳐지지 않은 파일이 있음), 해결한 뒤 `git add`로 표시하라는 안내, **both modified: time.txt**(양쪽이 모두 고침)가 나오고, 병합을 그만두는 `git merge --abort`도 알려 줘요"],output:`UU time.txt
On branch main
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)
	both modified:   time.txt

no changes added to commit (use "git add" and/or "git commit -a")
`,mistake:"파일을 고쳤으니 바로 `git commit`하기. UU가 남아 있으면 `Committing is not possible because you have unmerged files`라며 커밋이 거절돼요. 고친 뒤 `git add 파일`을 먼저 해요.",in_code:"AI에게 충돌 해결을 맡긴 뒤에는 `git status --short`에 UU가 남아 있지 않은지와 파일에 `<<<<<<<` 표시가 없는지를 함께 확인해요."},{type:`example`,id:`theory-git-conflict-ex2`,kind:`choice`,title:`고치기만 한 파일`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/party/  ← 지금 위치
# └── place.txt
# place.txt 내용:
#   장소: 공원
# 지금 위치는 git 저장소입니다.
# 위 파일은 "장소 후보"로 커밋됨
git switch -c cafe
echo "장소: 카페" > place.txt
git commit -am "카페로"
git switch main
echo "장소: 강변" > place.txt
git commit -am "강변으로"
git merge cafe
echo "장소: 도서관" > place.txt
git status --short`,capture:`last`,compare:`exact`,choices:[`UU place.txt`,`M  place.txt`,`(출력 없음)`],answer:`UU place.txt`,feedback:{"M  place.txt":`파일을 고쳐 쓰기만 해도 충돌이 해결된 것으로 표시된다고 생각했나요?`,"(출력 없음)":`파일을 고치면 병합이 저절로 끝난다고 생각했나요?`},explanation:`파일 내용을 고쳐 써도 git add로 해결했다고 알리기 전까지 Git은 이 파일을 합쳐지지 않은 상태로 봐요. 그래서 여전히 UU place.txt가 나와요.`,card:`unmerged`,output:`UU place.txt
`},{type:`explain`,id:`resolve`,title:`고치고, add하고, 커밋해요`,body:"충돌을 푼다는 것은 파일에서 표시를 없애고 원하는 내용만 남기는 일이에요. 직접 고쳐 써도 되고, `git checkout --ours 파일`(지금 브랜치)이나 `git checkout --theirs 파일`(가져오는 브랜치)로 한쪽을 골라도 돼요(새 방식의 `git restore --ours 파일`·`--theirs 파일`도 같아요). 그다음 `git add 파일`로 해결했다고 알리면 UU가 사라지고(내용이 마지막 커밋과 다르면 첫째 칸에 M), `git commit`으로 병합을 마쳐요. `git add`는 표시를 지워 주지 않아서, 표시가 남은 채 add하면 `<<<<<<<` 줄까지 그대로 커밋돼요.",code:`# ~/party/  ← 지금 위치
# └── time.txt
# time.txt 내용:
#   시작: 7시
# 지금 위치는 git 저장소입니다.
# 위 파일은 "모임 계획"으로 커밋됨
git switch -c early
echo "시작: 6시" > time.txt
git commit -am "일찍 시작"
git switch main
echo "시작: 8시" > time.txt
git commit -am "늦게 시작"
git merge early
echo "시작: 7시 반" > time.txt
git add time.txt; git status -s`,capture:`last`,compare:`exact`,trace:["`git switch -c early` → early를 만들어 옮겨 가요",'`echo "시작: 6시" > time.txt` → early에서 시작 시각을 6시로 고쳐요','`git commit -am "일찍 시작"` → early에 커밋해요',"`git switch main` → main으로 돌아와요",'`echo "시작: 8시" > time.txt` → main에서는 같은 줄을 8시로 고쳐요','`git commit -am "늦게 시작"` → main에 커밋해요. 이제 두 브랜치가 같은 줄을 다르게 고친 상태예요(실행 결과에는 마지막 줄의 출력만 담았어요)',"`git merge early` → 충돌로 병합이 멈춰요",'`echo "시작: 7시 반" > time.txt` → 표시와 두 값을 모두 지우고, 합의한 한 줄로 파일을 새로 써요',"`git add time.txt; git status -s` → add로 해결했다고 알리니 UU가 사라지고 첫째 칸에 M → **M  time.txt**(`-s`는 `--short`를 줄여 쓴 것). 이제 `git commit`을 하면 병합 커밋이 만들어져요"],output:`M  time.txt
`,mistake:"충돌 표시를 그대로 둔 채 `git add`하기. UU는 사라져 해결된 것처럼 보이지만 `<<<<<<<`와 `=======` 줄이 파일에 남은 채로 커밋돼요.",in_code:"AI가 충돌을 풀었다고 하면 커밋 전에 `cat 파일`이나 `git diff --staged`로 표시가 남았는지 봐요. 마무리한 뒤에는 `git log -1 --format=%s`(마지막 커밋 하나의 메시지)와 `cat 파일`로 결과를 확인해요."},{type:`example`,id:`theory-git-conflict-ex3`,kind:`choice`,title:`고치지 않고 add하면`,prompt:`아래 명령을 차례로 실행했을 때 마지막 줄의 출력을 고르세요.`,code:`# ~/party/  ← 지금 위치
# └── place.txt
# place.txt 내용:
#   장소: 공원
# 지금 위치는 git 저장소입니다.
# 위 파일은 "장소 후보"로 커밋됨
git switch -c cafe
echo "장소: 카페" > place.txt
git commit -am "카페로"
git switch main
echo "장소: 강변" > place.txt
git commit -am "강변으로"
git merge cafe
git add place.txt
git status -s; cat place.txt`,capture:`last`,compare:`exact`,choices:[`M  place.txt
<<<<<<< HEAD
장소: 강변
=======
장소: 카페
>>>>>>> cafe`,`M  place.txt
장소: 강변`,`UU place.txt
<<<<<<< HEAD
장소: 강변
=======
장소: 카페
>>>>>>> cafe`,`M  place.txt
장소: 카페`],answer:`M  place.txt
<<<<<<< HEAD
장소: 강변
=======
장소: 카페
>>>>>>> cafe`,feedback:{"M  place.txt\n장소: 강변":`git add가 충돌 표시를 지우고 지금 브랜치의 내용을 남긴다고 생각했나요?`,"UU place.txt\n<<<<<<< HEAD\n장소: 강변\n=======\n장소: 카페\n>>>>>>> cafe":`표시가 남아 있으면 add해도 UU가 그대로라고 생각했나요?`,"M  place.txt\n장소: 카페":`git add가 충돌 표시를 지우고 가져오는 브랜치의 내용을 남긴다고 생각했나요?`},explanation:`git add는 파일을 해결된 것으로 올릴 뿐이라 UU가 M으로 바뀌어요. 표시는 지우지 않아서 파일에는 두 값과 표시가 그대로 남아 있어요.`,card:`resolve`,output:`M  place.txt
<<<<<<< HEAD
장소: 강변
=======
장소: 카페
>>>>>>> cafe
`},{type:`explain`,id:`abort`,title:`병합을 없던 일로: --abort`,body:"병합을 지금은 하지 않기로 했다면 `git merge --abort`로 병합을 시작하기 전 상태로 돌아가요. `git reset --hard HEAD`도 스테이지와 작업 폴더를 마지막 커밋으로 덮어써 병합 상태를 없애지만, 다른 파일의 커밋하지 않은 수정까지 지우므로 `--abort`가 더 안전해요. `git checkout --ours 파일`은 파일 내용만 고를 뿐 병합은 끝내지 않아 UU가 남고, 합쳐지지 않은 파일에 `git restore 파일`을 쓰면 오류로 멈춰요. `git merge -X theirs 브랜치`처럼 merge할 때 한쪽을 미리 고르는 옵션도 있지만, 두 쪽 어디에도 없는 새 내용은 만들 수 없어요.",code:`# ~/party/  ← 지금 위치
# └── time.txt
# time.txt 내용:
#   시작: 7시
# 지금 위치는 git 저장소입니다.
# 위 파일은 "모임 계획"으로 커밋됨
git switch -c early
echo "시작: 6시" > time.txt
git commit -am "일찍 시작"
git switch main
echo "시작: 8시" > time.txt
git commit -am "늦게 시작"
git merge early
git merge --abort; cat time.txt`,capture:`last`,trace:["`git switch -c early` → early를 만들어 옮겨 가요",'`echo "시작: 6시" > time.txt` → early에서 시작 시각을 6시로 고쳐요','`git commit -am "일찍 시작"` → early에 커밋해요',"`git switch main` → main으로 돌아와요",'`echo "시작: 8시" > time.txt` → main에서는 같은 줄을 8시로 고쳐요','`git commit -am "늦게 시작"` → main에 커밋해요. 이제 두 브랜치가 같은 줄을 다르게 고친 상태예요(실행 결과에는 마지막 줄의 출력만 담았어요)',"`git merge early` → 충돌로 병합이 멈춰요","`git merge --abort; cat time.txt` → 병합을 취소해 merge 전으로 돌아가요(출력 없음). 파일은 main의 마지막 커밋 내용 → **시작: 8시**. 이때 `git status --short`도 아무것도 보이지 않아요"],output:`시작: 8시
`,mistake:"충돌이 꼬였다고 `git reset --hard`부터 쓰기. 병합 상태는 없어지지만 커밋하지 않은 다른 수정까지 함께 사라져요.",in_code:"AI의 충돌 해결이 꼬였다면 일단 `git merge --abort`로 처음으로 돌아갈 수 있다는 것을 기억해요. 긴 `git status`의 안내에도 `git merge --abort`가 나와요."},{type:`example`,id:`theory-git-conflict-ex4`,kind:`choice`,title:`병합을 취소한 뒤`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/party/  ← 지금 위치
# └── place.txt
# place.txt 내용:
#   장소: 공원
# 지금 위치는 git 저장소입니다.
# 위 파일은 "장소 후보"로 커밋됨
git switch -c cafe
echo "장소: 카페" > place.txt
git commit -am "카페로"
git switch main
echo "장소: 강변" > place.txt
git commit -am "강변으로"
git merge cafe
git merge --abort
cat place.txt`,capture:`last`,choices:[`장소: 강변`,`장소: 카페`,`장소: 공원`,`<<<<<<< HEAD
장소: 강변
=======
장소: 카페
>>>>>>> cafe`],answer:`장소: 강변`,feedback:{"장소: 카페":`--abort가 가져오던 브랜치의 내용을 남긴다고 생각했나요?`,"장소: 공원":`--abort가 두 브랜치가 갈라지기 전으로 되돌린다고 생각했나요?`,"<<<<<<< HEAD\n장소: 강변\n=======\n장소: 카페\n>>>>>>> cafe":`--abort가 병합 상태만 끝내고 파일은 그대로 둔다고 생각했나요?`},explanation:`--abort는 merge를 실행하기 직전, 즉 main의 마지막 커밋 상태로 돌아가요. 그래서 place.txt는 main이 커밋한 장소: 강변이에요.`,card:`abort`,output:`장소: 강변
`},{type:`summary`,points:["충돌하면 `CONFLICT (content)` 안내와 함께 병합이 멈추고, 파일에 두 내용이 표시와 함께 적혀요.","`<<<<<<< HEAD` 아래는 merge를 실행한 지금 브랜치, `=======` 아래는 가져오는 브랜치의 내용이에요.","충돌한 파일은 `UU`로 보이고, UU가 있는 동안에는 커밋할 수 없어요.","표시를 없애고 원하는 내용으로 고친 뒤 `git add`로 해결을 알리고 커밋해요. add는 표시를 지워 주지 않아요.","`git merge --abort`는 병합 전으로 돌아가요. `--ours`·`--theirs`는 내용만 고르고, `reset --hard`는 다른 수정까지 지워요."]}],covers:{"git-conflict-01":[`markers`],"git-conflict-02":[`unmerged`],"git-conflict-03":[`resolve`,`abort`],"git-conflict-04":[`unmerged`,`resolve`,`abort`]}},{id:`theory-git-history`,version:1,concept_id:`git-history`,title:`기록 따라가기`,minutes:13,steps:[{type:`explain`,id:`show`,title:`git show로 커밋 하나 보기`,body:"`git show`는 커밋 하나의 정보와 그 커밋이 바꾼 내용을 보여 주고, 커밋을 쓰지 않으면 마지막 커밋(HEAD)을 보여 줘요. `--stat`을 붙이면 diff 대신 바뀐 파일과 줄 수만 요약하고, `--format=%s`는 맨 위 정보를 메시지 한 줄로 줄여요. 그 커밋에서 바뀌지 않은 파일은 나오지 않아요. 4강의 `HEAD~1`(바로 전 커밋)처럼 커밋을 지정하면 그 커밋을 보여 줘요.",code:`# ~/song/  ← 지금 위치
# ├── chords.txt
# └── lyrics.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "곡 시작"으로 커밋됨
echo "2절" >> lyrics.txt
git commit -am "2절 가사"
echo "C G Am F" >> chords.txt
git commit -am "코드 진행"
git show --stat --format=%s
git show --stat --format=%s HEAD~1`,trace:['`echo "2절" >> lyrics.txt` → 가사를 더해요','`git commit -am "2절 가사"` → 첫 번째 커밋(해시는 컴퓨터마다 달라요)','`echo "C G Am F" >> chords.txt` → 코드 파일에 한 줄을 더해요','`git commit -am "코드 진행"` → 두 번째 커밋. 이제 이 커밋이 HEAD예요',"`git show --stat --format=%s` → HEAD 하나만 → 메시지 **코드 진행**, 빈 줄, **chords.txt | 1 +**와 합계","`git show --stat --format=%s HEAD~1` → 바로 전 커밋 → **2절 가사**와 **lyrics.txt | 1 +**"],output:`[main ced3384] 2절 가사
 1 file changed, 1 insertion(+)
[main d386508] 코드 진행
 1 file changed, 1 insertion(+)
코드 진행

 chords.txt | 1 +
 1 file changed, 1 insertion(+)
2절 가사

 lyrics.txt | 1 +
 1 file changed, 1 insertion(+)
`,mistake:"git show가 log처럼 기록 전체를 보여 준다고 생각하기. 커밋 하나만 보여 줘서, 여러 커밋을 보려면 `git log`를 써요.",in_code:"AI가 방금 커밋한 내용이 무엇인지 확인할 때 `git show --stat`이 가장 빨라요. 파일 이름이 예상과 다르면 `git show`로 바뀐 줄까지 봐요."},{type:`example`,id:`theory-git-history-ex1`,kind:`choice`,title:`커밋 뒤에 또 고쳤을 때`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/song/  ← 지금 위치
# ├── chords.txt
# └── lyrics.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "곡 시작"으로 커밋됨
echo "2절" >> lyrics.txt
git commit -am "2절 가사"
echo "Am" >> chords.txt
git show --stat --format=%s`,capture:`last`,choices:[`2절 가사

 lyrics.txt | 1 +
 1 file changed, 1 insertion(+)`,`2절 가사

 chords.txt | 1 +
 lyrics.txt | 1 +
 2 files changed, 2 insertions(+)`,`2절 가사
곡 시작`,` chords.txt | 1 +
 1 file changed, 1 insertion(+)`],answer:`2절 가사

 lyrics.txt | 1 +
 1 file changed, 1 insertion(+)`,feedback:{"2절 가사\n\n chords.txt | 1 +\n lyrics.txt | 1 +\n 2 files changed, 2 insertions(+)":`git show가 아직 커밋하지 않은 수정까지 함께 보여 준다고 생각했나요?`,"2절 가사\n곡 시작":`git show가 log처럼 기록 전체의 메시지를 보여 준다고 생각했나요?`," chords.txt | 1 +\n 1 file changed, 1 insertion(+)":`git show가 마지막 커밋이 아니라 지금 작업 폴더의 변경을 보여 준다고 생각했나요?`},explanation:`git show는 마지막 커밋 2절 가사 하나만 보여 줘요. 그 커밋은 lyrics.txt만 바꿨고, 커밋한 뒤에 고친 chords.txt는 아직 작업 폴더에만 있어요.`,card:`show`,output:`2절 가사

 lyrics.txt | 1 +
 1 file changed, 1 insertion(+)
`},{type:`explain`,id:`rev-file`,title:`커밋:파일로 예전 내용 보기`,body:"`HEAD~1`은 HEAD의 바로 전, `HEAD~2`는 그 전 커밋이에요. `git show 커밋:파일`은 그 커밋에 저장된 파일 내용을 화면에만 보여 주고, 작업 폴더나 기록은 바꾸지 않아요. 그래서 되돌리기 전에 옛 내용을 먼저 확인하는 안전한 방법이에요. 커밋은 그 순간 파일 전체를 기록하니 바뀐 줄만이 아니라 파일 전체가 나와요.",code:`# ~/song/  ← 지금 위치
# └── lyrics.txt
# lyrics.txt 내용:
#   1절
# 지금 위치는 git 저장소입니다.
# 위 파일은 "곡 시작"으로 커밋됨
echo "2절" >> lyrics.txt
git commit -am "2절 가사"
echo "3절" >> lyrics.txt
git commit -am "3절 가사"
git show HEAD~1:lyrics.txt
git show HEAD~2:lyrics.txt`,trace:['`echo "2절" >> lyrics.txt` → 2절을 더해요','`git commit -am "2절 가사"` → 커밋해요(해시는 컴퓨터마다 달라요)','`echo "3절" >> lyrics.txt` → 3절을 더해요','`git commit -am "3절 가사"` → 커밋해요. 이제 HEAD는 3절 가사, HEAD~1은 2절 가사, HEAD~2는 곡 시작이에요',"`git show HEAD~1:lyrics.txt` → 2절 가사 커밋의 파일 → **1절**, **2절**","`git show HEAD~2:lyrics.txt` → 곡 시작 커밋의 파일 → **1절**. 지금 파일은 그대로 세 줄이에요"],output:`[main f24a467] 2절 가사
 1 file changed, 1 insertion(+)
[main b8f09e6] 3절 가사
 1 file changed, 1 insertion(+)
1절
2절
1절
`,mistake:"`HEAD~1`을 '1번째 커밋'으로 읽기. 숫자는 지금 커밋에서 몇 개 거슬러 올라가는지라서, `HEAD~1`은 바로 전 커밋이에요.",in_code:"AI가 파일을 망가뜨린 것 같을 때 `git show HEAD~1:파일`로 이전 내용을 보고 비교할 수 있어요. `git log --oneline`에서 읽은 해시를 써서 `git show 해시:파일`처럼 볼 수도 있어요."},{type:`example`,id:`theory-git-history-ex2`,kind:`line`,title:`C와 G가 나오는 줄`,prompt:`아래 명령 중 C와 G 두 줄을 출력하는 줄을 고르세요.`,code:`# ~/song/  ← 지금 위치
# └── chords.txt
# chords.txt 내용:
#   C
# 지금 위치는 git 저장소입니다.
# 위 파일은 "코드 초안"으로 커밋됨
echo "G" >> chords.txt
git commit -am "G 추가"
echo "Am" >> chords.txt
git show HEAD:chords.txt
git show HEAD~1:chords.txt
cat chords.txt`,choices:[`10`,`11`,`12`],answer:`10`,check:{type:`prints`,target:`C
G`},feedback:{11:`HEAD~1이 마지막 커밋을 가리킨다고 생각했나요?`,12:`cat이 작업 폴더가 아니라 마지막 커밋의 내용을 보여 준다고 생각했나요?`},explanation:`HEAD는 G 추가 커밋이라 10번 줄이 C와 G를 보여 줘요. 11번 줄의 HEAD~1은 그 전 커밋이라 C만, 12번 줄의 cat은 커밋하지 않은 Am까지 보여 줘요.`,card:`rev-file`,output:`[main 93e80f3] G 추가
 1 file changed, 1 insertion(+)
C
G
C
C
G
Am
`},{type:`explain`,id:`graph`,title:`--graph로 갈래 읽기`,body:"`git log --graph`는 커밋 사이의 관계를 왼쪽에 기호로 그려 줘요. `*`는 커밋 하나, `|`는 이어지는 줄기, `/`와 `\\`는 갈라지거나 모이는 곳이에요. 맨 아래가 가장 오래된 커밋이라 아래에서 위로 읽으면 시간 순서이고, 병합 커밋은 맨 위에서 두 줄기를 하나로 모아요. 왼쪽 줄기에는 merge를 실행한 지금 브랜치의 커밋이, 오른쪽 줄기에는 병합해 들어온 브랜치의 커밋이 그려져요. 나란한 두 줄기 사이의 위아래는 만든 순서와 다를 수 있어요.",code:`# ~/song/  ← 지금 위치
# ├── chords.txt
# └── lyrics.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "곡 시작"으로 커밋됨
git switch -c chorus
echo "후렴" >> lyrics.txt
git commit -am "후렴 초안"
git switch main
echo "C G" >> chords.txt
git commit -am "코드 진행"
git switch chorus
git merge --no-edit main
git log --graph --format=%s`,capture:`last`,trace:["`git switch -c chorus` → chorus를 만들어 옮겨 가요",'`echo "후렴" >> lyrics.txt` → 가사를 더해요','`git commit -am "후렴 초안"` → chorus에 커밋해요',"`git switch main` → main으로 돌아와요",'`echo "C G" >> chords.txt` → main에서는 코드 파일을 고쳐요','`git commit -am "코드 진행"` → main에도 커밋이 생겨 두 줄기로 갈라져요',"`git switch chorus` → 작업 브랜치 chorus로 돌아와요","`git merge --no-edit main` → main의 코드 진행을 chorus로 받아 병합 커밋 **Merge branch 'main' into chorus**가 생겨요(실행 결과에는 마지막 명령의 출력만 담았어요)","`git log --graph --format=%s` → 아래에서 위로 읽어요. **곡 시작**에서 `|/` 자리를 지나 두 줄기로 갈라져, 왼쪽 줄기에 지금 브랜치 chorus의 **후렴 초안**, 오른쪽 줄기에 들어온 main의 **코드 진행**이 있고, `|\\` 자리에서 맨 위 병합 커밋으로 모여요"],output:`*   Merge branch 'main' into chorus
|\\  
| * 코드 진행
* | 후렴 초안
|/  
* 곡 시작
`,mistake:`그래프를 위에서 아래로 시간 순서라고 읽기. log는 최신순이라 맨 위가 가장 최근의 병합 커밋이고 맨 아래가 가장 오래된 커밋이에요.`,in_code:"AI가 브랜치를 여러 번 합친 뒤 기록이 헷갈릴 때 `git log --oneline --graph`를 권해요. 모든 브랜치를 함께 보려면 `--all`을 붙여요."},{type:`example`,id:`theory-git-history-ex3`,kind:`choice`,title:`새 커밋이 한쪽에만 있을 때`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/song/  ← 지금 위치
# └── lyrics.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "곡 시작"으로 커밋됨
git switch -c outro
echo "끝맺음" >> lyrics.txt
git commit -am "아웃트로"
git switch main
git merge outro
git log --graph --format=%s`,capture:`last`,choices:[`* 아웃트로
* 곡 시작`,`*   Merge branch 'outro'
|\\  
| * 아웃트로
|/  
* 곡 시작`,`* 곡 시작
* 아웃트로`,`* 아웃트로`],answer:`* 아웃트로
* 곡 시작`,feedback:{"*   Merge branch 'outro'\n|\\  \n| * 아웃트로\n|/  \n* 곡 시작":`main에 새 커밋이 없어도 병합하면 갈래와 병합 커밋이 생긴다고 생각했나요?`,"* 곡 시작\n* 아웃트로":`그래프가 오래된 커밋부터 위에 그려진다고 생각했나요?`,"* 아웃트로":`fast-forward하면 그 전 커밋이 기록에서 빠진다고 생각했나요?`},explanation:`main에 새 커밋이 없어서 git merge가 fast-forward로 main을 아웃트로까지 옮기기만 해요. 갈래도 병합 커밋도 없으니 그래프는 한 줄기예요.`,card:`graph`,output:`* 아웃트로
* 곡 시작
`},{type:`explain`,id:`range`,title:`A..B로 한쪽에만 있는 커밋 찾기`,body:"`git log A..B`는 B에 있고 A에는 없는 커밋만 보여 줘요. 그래서 `main..chorus`는 chorus에만 있고 아직 main에 합치지 않은 커밋이에요. `^main chorus`와 `chorus --not main`도 'main에 있는 커밋은 빼라'는 같은 뜻이에요. 방향을 바꾼 `chorus..main`은 main에만 있는 커밋이고, 범위 없이 `git log chorus`처럼 브랜치 이름만 쓰면 그 브랜치의 기록 전체가 처음 커밋까지 나와요.",code:`# ~/song/  ← 지금 위치
# └── lyrics.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "곡 시작"으로 커밋됨
git switch -c chorus
echo "후렴" >> lyrics.txt
git commit -am "후렴 초안"
echo "후렴 2" >> lyrics.txt
git commit -am "후렴 다듬기"
git switch main
git log --format=%s main..chorus`,capture:`last`,trace:["`git switch -c chorus` → chorus를 만들어 옮겨 가요",'`echo "후렴" >> lyrics.txt` → 가사를 더해요','`git commit -am "후렴 초안"` → chorus에 커밋해요','`echo "후렴 2" >> lyrics.txt` → 한 줄 더 고쳐요','`git commit -am "후렴 다듬기"` → chorus에 두 번째 커밋을 만들어요',"`git switch main` → main으로 돌아와요. main에는 곡 시작만 있어요(실행 결과에는 마지막 명령의 출력만 담았어요)","`git log --format=%s main..chorus` → chorus에는 있고 main에는 없는 커밋만 최신순 → **후렴 다듬기**, **후렴 초안**. 두 브랜치에 모두 있는 곡 시작은 빠져요"],output:`후렴 다듬기
후렴 초안
`,mistake:"`A..B`를 A에만 있는 커밋으로 읽기. 점 두 개 뒤에 쓴 B 쪽에만 있는 커밋이라서, 방향을 바꾸면 결과도 바뀌어요.",in_code:"AI가 만든 브랜치를 합치기 전에 `git log --oneline main..브랜치`로 어떤 커밋이 들어올지 확인해요. 아무것도 나오지 않으면 합칠 커밋이 없다는 뜻이에요."},{type:`example`,id:`theory-git-history-ex4`,kind:`choice`,title:`방향을 바꾼 범위`,prompt:`아래 명령을 차례로 실행했을 때 마지막 명령의 출력을 고르세요.`,code:`# ~/song/  ← 지금 위치
# ├── chords.txt
# └── lyrics.txt
# 지금 위치는 git 저장소입니다.
# 위 파일은 "곡 시작"으로 커밋됨
git switch -c chorus
echo "후렴" >> lyrics.txt
git commit -am "후렴 초안"
git switch main
echo "C G" >> chords.txt
git commit -am "코드 진행"
git log --format=%s chorus..main`,capture:`last`,choices:[`코드 진행`,`후렴 초안`,`코드 진행
곡 시작`,`(출력 없음)`],answer:`코드 진행`,feedback:{"후렴 초안":`A..B가 A에만 있는 커밋을 보여 준다고 생각했나요?`,"코드 진행\n곡 시작":`두 브랜치에 모두 있는 커밋도 범위에 들어간다고 생각했나요?`,"(출력 없음)":`지금 있는 브랜치를 범위에 쓰면 아무것도 나오지 않는다고 생각했나요?`},explanation:`chorus..main은 main에는 있고 chorus에는 없는 커밋이라 코드 진행만 나와요. 두 브랜치가 함께 가진 곡 시작은 빠져요.`,card:`range`,output:`코드 진행
`},{type:`summary`,points:["`git show`는 커밋 하나(기본은 HEAD)만 보여 줘요. `--stat`은 바뀐 파일과 줄 수, `--format=%s`는 메시지 한 줄이에요.","`HEAD~1`은 바로 전, `HEAD~2`는 그 전 커밋이에요. `git show 커밋:파일`은 그 커밋의 파일 전체를 화면에만 보여 줘요.","`--graph`는 아래에서 위로 읽어요. `|/`에서 갈라지고 `|\\`에서 병합 커밋으로 모이며, fast-forward한 기록은 한 줄기예요.","`A..B`는 B에만 있는 커밋이에요. `^A B`, `B --not A`도 같고, 방향을 바꾸면 결과도 바뀌어요."]}],covers:{"git-history-01":[`show`],"git-history-02":[`rev-file`],"git-history-03":[`graph`],"git-history-04":[`range`]}}]};export{e as default};