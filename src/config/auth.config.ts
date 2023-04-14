export default () => ({
  auth: {
    expiresIn: '1h',
    secret: process.env.AUTH_SECRET || 'secret',
  },
});
