import User from '../models/User.js';
import bcrypt from 'bcrypt';
import session from 'express-session';


// 회원가입 페이지 타이틀
const titleJoin = 'Join';
// 로그인 페이지 타이틀
const titleLogin = 'Login';

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
    const user = await User.findOne({ userName });
    
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


export const edit = (req, res) => { res.send('Users Edit') };


export const remove = (req, res) => { res.send('Users Remove') };


