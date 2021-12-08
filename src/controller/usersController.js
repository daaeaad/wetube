import User from '../models/User.js';
import bcrypt from 'bcrypt';
import session from 'express-session';
import fetch from 'node-fetch';


// 회원가입 페이지 타이틀
const titleJoin = 'Join';
// 로그인 페이지 타이틀
const titleLogin = 'Login';
// 내정보수정 타이틀
const titleEditProfile = 'Edit Profile';

// 상태코드 400
const status400 = (res) => {res.status(400)};


// 회원가입 페이지 렌더링
export const getJoin = (req, res) => { 
    return res.render('join', { title:titleJoin });
};


// 회원 등록
export const postJoin = async (req, res) => {
    const { name, email, password, password_confirm, userName, location } = req.body;
    const renderJoinPage = () => {res.render('join', { title:titleJoin, errorMessage});};
    let errorMessage = '';
        
    // 이미 등록된 정보인지 확인
    const isAleadyTaken = await User.exists({ $or: [ { email }, { userName } ] });

    // 비밀번호 일치 확인
    if(password !== password_confirm) {
        errorMessage = '입력하신 비밀번호가 일치하지 않습니다.';
        status400(res);
        return renderJoinPage();
    }
    if(isAleadyTaken) {
        errorMessage = '입력하신 이메일/닉네임은 이미 사용중입니다.'
        status400(res);
        return renderJoinPage();
    }

    if(!errorMessage) {
    // 에러메시지 띄울거 없으면
        // 회원정보 등록하고 로그인페이지로 이동
        try{
            await User.create({ name, email, password, userName, location });
            return res.redirect('/login');
        } catch(error){
            status400();
            return renderJoinPage();
        } 
    }
};


export const getLogin = (req, res) => { 
    return res.render('login', { title:titleLogin });
};


export const postLogin = async (req, res) => {
    const { userName, password } = req.body;
    let errorMessage = '';
    const renderLoginPage = () => { res.render('login', { title: titleLogin, errorMessage }); };
    const user = await User.findOne({ userName, snsOnly: false });
    
    if(!user) { //db에 없는 userName이면,
        errorMessage = '아이디 혹은 비밀번호가 잘못 되었습니다.';
        status400(res);
        return renderLoginPage();
    }

    const isMatchedPw = await bcrypt.compare(password, user.password);
    if(!isMatchedPw) { // 비밀번호가 일치하지 않으면,
        //상태코드 반환과 현재페이지 다시 렌더링
        errorMessage = '아이디 혹은 비밀번호가 잘못 되었습니다.'
        status400(res);
        renderLoginPage();
    }

    console.log('✅ Loged in');

    // 로그인 성공시 세션에 로그인 상태와 회원정보 저장
    console.log(req.session);
    req.session.loggedIn = true;
    req.session.user = user;

    return res.redirect('/');
}


// github 로그인 url로 리다이렉트
export const githubLoginStart = (req, res) => {
    const baseUrl = 'https://github.com/login/oauth/authorize';
    const config = {
        client_id: process.env.GITHUB_CLIENT,
        allow_signup: false,
        scope: 'read:user user:email'
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;

    res.redirect(finalUrl);
};

export const githubLoginFinish = async (req, res) => {
    const baseUrl = 'https://github.com/login/oauth/access_token';
    const code = req.query.code;
    const config = {
        client_id: process.env.GITHUB_CLIENT,
        client_secret: process.env.GITHUB_SECRET,
        code
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    
    // github에 액세스 토큰 요청
    const tokenRequest = await (
        await fetch(finalUrl, { // 파라미터는 url에 넣음
            method: 'POST',
            headers: {
                Accept: 'application/json'
            }
        })
    ).json();

    // 받은 액세스 토큰으로 api 요청,토큰은 headers에 들어간다.
    if('access_token' in tokenRequest) {
    // github로 부터 받은 데이터에 access_token이 잘 있으면,
        const { access_token } = tokenRequest;

        const apiUrl = 'https://api.github.com';
        const headers = { Authorization: `token ${access_token}` };

        // api에 토큰 전달과 함께 사용자 정보를 요청한다.
        // 데이터: 사용자 정보
        const userData = await(
            await fetch(`${apiUrl}/user`, {
                method: 'GET',
                headers: headers
            })
        ).json();
        // 데이터: 사용자 이메일
        const emailData = await(
            await fetch(`${apiUrl}/user/emails`, {
                method: 'GET',
                headers: headers
            })
        ).json();

        // 사용자 이메일 중에 primary와 verified가 모두 true인 (즉, 사용 가능한) 이메일 주소가 있는지 확인
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        // 만약 없으면 다시 로그인 페이지로,
        if(!emailObj) {
            return res.redirect('/login');
        }
        // 사용 가능한 이메일 주소가 있으먼,
        // db에 동일한 이메일이 있는지 확인
        let user = await User.findOne({ email: emailObj.email });
        if(!user) {  // 없으면
            // github에서 받아온 정보로 회원 등록
            user = await User.create({ 
                name: userData.login,
                userName: userData.login, 
                email: emailObj.email,
                password: '',
                location: userData.location,
                snsOnly: true,
                avatarUrl: userData.avatar_url
            });
        }
        console.log('✅ Loged in');
        req.session.loggedIn = true;
        req.session.user = user;
        
        return res.redirect('/');

    } else {
    // 만료 등의 이유로 데이터에 access_token이 없으면,
        return res.redirect('/login');
    }
};


// 로그아웃
export const logout = (req, res) => {
    req.session.destroy();
    console.log('Logout');
    return res.redirect('/');
};


// 내정보수정 페이지 렌더링
export const getEdit = (req, res) => { 
    return res.render('edit-profile', { title: titleEditProfile });
};


// 내정보수정 페이지 post
export const postEdit = (req, res) => { 
    return res.render('edit-profile', { title: titleEditProfile });
};


export const remove = (req, res) => { res.send('Users Remove') };


