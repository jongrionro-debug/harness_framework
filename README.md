# harness_framework

이 프로젝트는 아래 순서대로 따라 하면 실행할 수 있습니다.

## 1. Git 저장소 받기

터미널에서 아래 명령어를 실행합니다.

```bash
git clone <저장소 주소>
cd harness_framework
```

이 단계는 프로젝트 코드를 내 컴퓨터로 가져오는 단계입니다.

## 2. Node.js와 npm 준비하기

먼저 `Node.js`가 설치되어 있어야 합니다.  
설치 후 아래 명령어로 확인합니다.

```bash
node -v
npm -v
```

버전이 나오면 정상입니다.  
그다음 아래 명령어로 필요한 패키지를 설치합니다.

```bash
npm install
```

## 3. `.env.local` 환경변수 만들기

프로젝트 루트에서 아래 명령어를 실행합니다.

```bash
cp .env.example .env.local
```

그다음 `.env.local` 파일을 열고 아래 값들을 넣습니다.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/harness_framework
```

앞의 3개 값은 팀에서 공유받은 `Supabase` 값이고,  
`DATABASE_URL`은 그대로 사용하면 됩니다.

## 4. PostgreSQL 실행하기

우리 프로젝트에서는 `PostgreSQL`을 팀원 모두 같은 환경으로 맞추기 위해 `Docker`를 사용합니다.

먼저 Docker를 켠 뒤 아래 명령어를 실행합니다.

```bash
npm run db:up
```

이 명령어는 로컬에서 PostgreSQL을 실행합니다.

## 5. DB 테이블 만들기

아래 명령어를 실행합니다.

```bash
npm run db:migrate
```

이 단계는 프로젝트에 필요한 테이블을 DB에 만드는 단계입니다.

## 6. 앱 실행하기

마지막으로 아래 명령어를 실행합니다.

```bash
npm run dev
```

그다음 브라우저에서 아래 주소로 들어가면 됩니다.

```txt
http://localhost:3000
```

## 왜 Docker를 쓰는가

우리 프로젝트에서 Docker를 쓰는 이유는 프로젝트 전체를 Docker로 돌리기 위해서가 아닙니다.  
팀원마다 PostgreSQL 설치 방식이 달라지지 않게 하고, 모두 같은 DB 환경에서 개발하게 만들기 위해 사용합니다.
