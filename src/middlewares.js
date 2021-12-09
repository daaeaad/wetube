import multer from "multer";


export const localsMiddleware = (req, res, next) => {
    // console.log(':::::: localsMiddleware ::::::');
    // console.log('Session ::', req.session);
    
    res.locals.siteName = 'wetube';
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedUser = req.session.user || {};

    // console.log('Locals ::', res.locals);
    // console.log(req.session);

    next(); 
};


// 로그인 된 상태가 아니면 접근 못하게
export const protectorMiddleware = (req, res, next) => {
    if(!req.session.loggedIn) {
        return res.redirect('/login');
    }
    return next();
};


// 로그인 된 상태면 접근 못하게
export const publicOnlyMiddleware = (req, res, next) => {
    if(req.session.loggedIn) {
        return res.redirect('/');
    }
    return next();
};


// sns로그인 상태면 접근 못하게
export const normalLoginOnlyMiddleware = (req, res, next) => {
    const { 
        headers: { referer },
        session: { user: { snsOnly } }
    } =  req;

    if(snsOnly) {
        return res.redirect(referer);
    }
    next();
};


// file upload: avatar
export const avatarFileMiddleware = multer({ dest: 'uploads/avatar', limits: { fileSize: 1048576 } });


// file upload: video
export const videoFileMiddleware = multer({ dest: 'uploads/video', limits: { fileSize: 20971520 } });


