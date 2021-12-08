

export const localsMiddleware = (req, res, next) => {
    // console.log(':::::: localsMiddleware ::::::');
    // console.log('Session ::', req.session);
    
    res.locals.siteName = 'wetube';
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedUser = req.session.user || {};

    // console.log('Locals ::', res.locals);

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

