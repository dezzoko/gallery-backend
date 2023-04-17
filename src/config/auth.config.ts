export default () => ({
  auth: {
    refreshTokenExpiresIn: '30d',
    secretRefreshToken: process.env.AUTH_SECRET || 'secret',
    accessTokenExpiresIn: '1h',
    secretAccessToken: process.env.AUTH_SECRET || 'secret',
  },
});
