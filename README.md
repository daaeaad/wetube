
# wetube
유튜브클론코딩 / nodejs, mongodb, es6

### ~ 211202
- DB 설치, 연결
- 게시물 등록/수정 기능 추가
- 해시태그 처리 로직 수정 필요함

### 211203
- 게시물 CRUD 기능 추가 및 수정
- 게시물 검색 기능 추가
- 회원 등록 기능 추가
- DB: users 테이블 추가
- bcrypt 설치

### 211206
- 설치: express-sessions, connect-mongo, dotenv
- DB: sessions 테이블 추가
- 회원 로그인 기능 추가
- 세션 설정
- 환경변수 파일 생성, db url과 session secret 변수로 만들어서 사용

### 211208_1
- github 로그인 기능 추가
- 로그인상태 확인 후, 비정상적 접근 방지하는 미들웨어 추가
- 회원정보 수정 페이지 템플릿 추가

### 211208_2
- 내정보 수정 기능 추가
    - [코딩챌린지 과제] 변경된 내용만 확인해서 디비에 있는지 체크 후 업데이트하기
        - 문제점 1: 디비에 있는지 체크하지 않아도 되는 location 같은 경우를 고려 못하고 완료함.
        - 문제점 2: exists 를 $or 쿼리로 여러개를 한번에 체크해서 사용자한테 어떤 입력정보가 잘못된건지 제대로 못 알려 주고 잇음.

### 211209
- 비밀번호 변경 기능 추가
- sns 로그인 구별 후 접근 막는 미들웨어 추가

