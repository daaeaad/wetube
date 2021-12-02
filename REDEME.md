# Wetube 

### --------------------------------------------------------------- ###

## URL 구조

#### 글로벌: globalRouter
/ -> 홈
/join -> 회원가입
/login -> 로그인
/search -> 검색

#### 회원: userRouter
/useres/:id -> 회원정보 상세
/useres/:id/logout -> 로그아웃
/useres/:id/edit -> 회원정보 수정
/useres/:id/delete -> 회원정보 삭제

#### 영상: videoRouter
/video/:id -> 영상게시물 상세
/video/:id/edit -> 영상게시물 수정
/video/:id/delete -> 영상게시물 삭제
/video/upload -> 영상게시물 등록

### --------------------------------------------------------------- ###