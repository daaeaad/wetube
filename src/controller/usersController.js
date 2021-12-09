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
// 비밀번호변경 타이틀
const titleChangePassword = 'Change password';

// 상태코드 400
const status400 = (res) => {res.status(400)};


// 비밀번호 일치 확인
const hashMatching = (plainTxt, hashedTxt) => {
    const result = bcrypt.compare(plainTxt, hashedTxt);
    return result;
};



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

    const isMatchedPw = await bcrypt.compare(password, user.password)
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


///////////// CHALLENGE /////////////
// 내정보수정 수정 내용 업데이트
export const postEdit = async (req, res) => { 

    const renderEditPage = (errorMessage) => {res.render('edit-profile', { title:titleEditProfile, errorMessage});};
    let errorMessage = '';
    const { session: { user }, body, file } = req;

    console.log('file:::', file);
    file ? body.avatarUrl = file.path : body.avatarUrl = user.avatarUrl;
    console.log('body:::', body);

    // 현재 세션의 유저 정보와 폼 내용 비교
    // 1: 배열 메소드 사용을 위해 세션과 폼 객체 배열화
    const sessionArr= Object.entries(user);
    const bodyArr = Object.entries(body);

    // 2: 두 배열을 map으로 상이한 내용 있는지 비교 및 확인
    let newInfo = {}; // 변경된 내용이 들어갈 객체
    sessionArr.map((sessionItm) => {
        bodyArr.forEach(bodyItm => {
            if(bodyItm[0] === sessionItm[0] && bodyItm[1] !== sessionItm[1]) { // 세션 데이터와 폼 데이터 비교해서 변경된 내용 있으면
                let key = bodyItm[0]; 
                let val = bodyItm[1];
                newInfo[`${key}`] = val; // 객체에 넣음
            }
        });
    });


    console.log('new::::', newInfo);

    // 변경된 내용이 있는지 확인(= 빈객체인지 체크)
    const checkNewinfo = Object.keys(newInfo).length;
    // 업데이트 할게 있으면
    if(checkNewinfo) {
        // db에 이미 있는 내용인지 확인
        const isExists = await User.exists({ $or: [ newInfo ] });
        if(!isExists) { // 문제 없으면
            // 업데이트하고 리다이렉트
            const updateUser = await User.findByIdAndUpdate(
                user._id, 
                newInfo,
                { new: true } // 세션 업데이트를 위해 디비에 업데이트된 내용 다시 받아오기
            ); // db update
            req.session.user = updateUser; // session update

            console.log('db:::', updateUser);
            console.log('session:::', req.session.user);

        } else { // 문제 있으면
            // 상태코드 400, 에러메시지 리턴
            status400(res);
            errorMessage = '이미 사용중인 닉네임/이름/이메일 입니다.';
            return renderEditPage(errorMessage);
        }
    }

    return res.redirect('/users/edit');
};


export const getChagePassword = (req, res) => {
    if(req.session.user.snsOnly) {
        return res.redirect('/');
    }
    return res.render('change-password', {title: 'Change password'});
};


export const postChagePassword = async (req, res) => {

    const { 
        body: { oldPw, newPw, newPw2 }, 
        session: { user: { _id } } 
    } = req;
    const user = await User.findById(_id);

    const renderPage = (errorMessage) => {res.render('change-password', { title: titleChangePassword, errorMessage});};
    let errorMessage = '';

    // old pw 가 현재 비밀번호와 일치하는지 확인
    const isMatchedPw = await bcrypt.compare(oldPw, user.password);
    if(!isMatchedPw) {
        errorMessage = '현재 비밀번호를 다시 확인해주세요.';
        status400(res);
        return renderPage(errorMessage);
    }

    // new pw와 new pw2가 일치하는지 확인
    if(newPw !== newPw2) {
        errorMessage = '새 비밀번호가 서로 일치하지 않습니다.';
        status400(res);
        return renderPage(errorMessage);
    }

    // 모두 일치하면 new pw를 db랑 세션에 업데이트
    user.password = newPw;
    await user.save();

    return res.redirect('/users/logout');
};


