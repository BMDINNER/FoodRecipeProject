const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) =>{
  //Check bearer token if it exists

  const authHeader = req.headers.authorization || req.headers.Authorization;

  if(!authHeader?.startsWith('Bearer')){
    return res.status(401).json({'message': 'Unauthorized'});
  }
  
  const token = authHeader.split(' ')[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if(err){
        console.error('JWT verification error', {
          error: err.name,
          message: err.message,
          receivedToken: token
        });
        return res.status(403).json({'message':'Forbidden - Invalid Token'});
      }

      //Attach User data to request
      req.user = decoded.UserInfo.username;
      req.roles = decoded.UserInfo.roles;
      next();
    }
  );
};

module.exports = verifyJWT;

