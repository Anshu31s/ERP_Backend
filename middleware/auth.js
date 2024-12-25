import jwt from 'jsonwebtoken';

const isauthenticated = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token is Invalid or expired' });

        req.user = user;
        
        next();
    });
};

export default isauthenticated;
