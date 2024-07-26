
function authenticateSession(req, res, next) {
    const sessionId = req.cookies.session_id; 
    
    const session = getSessionFromStore(sessionId);
    
    if (!session || !session.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    req.userId = session.userId; 
    next();
}

