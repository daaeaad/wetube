

export const localsMiddleware = (req, res, next) => {
    console.log(':::::: localsMiddleware ::::::');
    console.log('Session ::', req.session);
    
    res.locals.siteName = 'wetube';
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedUser = req.session.user;

    console.log('Locals ::', res.locals);

    next(); 
};

