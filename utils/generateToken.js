const jwt = require("jsonwebtoken");

const generateToken = (userId, res) => {
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );

  const option = ({
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true
  })

  res.cookie("token", token, option)

  return token;
};

module.exports = generateToken;
