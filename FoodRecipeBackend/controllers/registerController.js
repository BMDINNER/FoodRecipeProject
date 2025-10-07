const User = require('../model/Users');
const bcrypt = require('bcrypt');
const registerUser = async (req, res) => {
  const { username, password } = req.body;
  console.log('Registration attempt for username:', username); // Log attempt

  if (!username || !password) {
    console.log('Registration failed: Missing fields');
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const duplicate = await User.findOne({ username }).exec();
    if (duplicate) {
      console.log('Registration failed: Username already exists');
      return res.status(409).json({ message: 'Username already exists' });
    }

    const hashedPwd = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    const newUser = await User.create({
      username,
      password: hashedPwd,
      roles: { User: 2000 }
    });

    console.log('New user registered:', { 
      id: newUser._id, 
      username: newUser.username,
      roles: newUser.roles 
    });

    res.status(201).json({ 
      message: 'User registered successfully!',
      user: { id: newUser._id, username: newUser.username }
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {registerUser}