import User from '../models/User.js';

// 회원가입 페이지 렌더링
export const getJoin = (req, res) => { 
    return res.render('join', { title: 'Join' });
};

// 회원 등록
export const postJoin = (req, res) => {
    const { name, email, password, userName, location } = req.body;
    User.create({
        name, email, password, userName, location
    });

    return res.redirect('/login');
};

export const login = (req, res) => { res.send('Users Login') };

export const edit = (req, res) => { res.send('Users Edit') };

export const remove = (req, res) => { res.send('Users Remove') };
