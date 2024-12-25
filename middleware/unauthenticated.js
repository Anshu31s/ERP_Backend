// Purpose: Middleware to check if user is unauthenticated.
const unauthenticated = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        return res.status(401).json({ error: 'token provided already' });
        
    }
    next();
};

export default unauthenticated;
