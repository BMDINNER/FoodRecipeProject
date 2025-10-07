const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/Users');


const loginUser = async (req, res) =>{
  const {username, password} = req.body;

  if(!username || !password){
    return res.status(400).json({message: 'Username and password are required!'});
  }

  try{
    const foundUser = await User.findOne({username}).exec();

    if(!foundUser){
      return res.status(401).json({message: 'Invalid credentials, please try again!'});
    }

    const match = await bcrypt.compare(password, foundUser.password);
    
    if(!match){
      return res.status(401).json({message: 'Invalid user!'});
    }



    //Create JWT 
    const accessToken = jwt.sign(
      {
      username: foundUser.username,
      roles: foundUser.roles
      },
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn: '10m'}
  );

  const refreshToken = jwt.sign(
    {
    username: foundUser.username
  },
  process.env.REFRESH_TOKEN_SECRET,
  {expiresIn: '7d'}
);


  foundUser.refreshToken = refreshToken;
  await foundUser.save();

  res.cookie('jwt', refreshToken,{
    httpOnly:true,
    secure:true,
    sameSite: 'none',
    maxAge: 7*24*60*60*1000
  });

  res.json({
    accessToken,
    username: foundUser.username,
    roles:foundUser.roles
  });
  }catch(err){
    console.error('Login error:', err);
    res.status(500).json({message: 'Internal server error!'});
  }
}

module.exports = {loginUser};