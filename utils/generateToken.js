const jwt = require("jsonwebtoken");

const generateToken = (userId, res) => {
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );

  // For cross-domain cookies (Netlify to Render), we need:
  // - secure: true (HTTPS required)
  // - sameSite: 'none' (allow cross-site)
  const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER;
  
  const option = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: isProduction, // HTTPS only in production/Render
    sameSite: isProduction ? 'none' : 'lax' // Allow cross-site in production
  }

  res.cookie("token", token, option)

  return token;
};

module.exports = generateToken;
