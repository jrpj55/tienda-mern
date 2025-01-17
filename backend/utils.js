const jwt = require('jsonwebtoken');

const generarToken = (userToken) => {
  return jwt.sign(
    {
      _id: userToken._id,
      name: userToken.name,
      email: userToken.email,
      isAdmin: userToken.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Token invalido' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};
module.exports = { generarToken, isAuth };
