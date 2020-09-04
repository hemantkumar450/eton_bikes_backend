const app = {
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || '8080',
  name: process.env.NAME || 'etonBikes',
  mode: process.env.SERVER || 'DEVELOPMENT',
  secret: 'ANJPV4070F',
  encryptionKey: process.env.ENCRYPTION_KEY || '-JaNdRgUkXn2r5u8x/A?D(G+KbPeShVmYq3s6v9y$B&E)H@McQfTjWnZr4u7w!z%',
  superSecretForAdmin: process.env.JWT_SECRET_ADMIN || '_QNxOvsAiEWoMnSGuxs66uFDjIRiZSfdmQ',
  superSecretForUser: process.env.JWT_SECRET_USER || 'NakJ5JQHWaTnz3GiXQl0kVPjsFYzdI8ClA',
  refreshTokenSecretForUser: process.env.REFRESH_TOKEN_FOR_USER || 'XdOSHqT2cmEPuma9aWzCvZsLzuZfPaQq',
  refreshTokenSecretForAdmin: process.env.REFRESH_TOKEN_FOR_ADMIN || 'FgqVbQNpMfgIalRAmRucS26hWOXMsP0z',
  tokenLife: 60000, /** 1 minute or 60 sec */
  refreshTokenLife: '20d', /** 20 days */
  base: process.env.BASE || 'http://0.0.0.0:4000',
  allowedExtensions: ['png', 'jpeg', 'jpg', 'pdf'],
  loginNumbers: ['8800365519', '9988899888']
};

export default app;
