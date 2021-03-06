const app = {
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || '5200',
  name: process.env.NAME || 'etonBikes',
  mode: process.env.SERVER || 'DEVELOPMENT',
  secret: 'ANJPV4070F',
  encryptionKey: process.env.ENCRYPTION_KEY || '-JaNdRgUkXn2r5u8x/A?D(G+KbPeShVmYq3s6v9y$B&E)H@McQfTjWnZr4u7w!z%',
  superSecretForAdmin: process.env.JWT_SECRET_ADMIN || '_QNxOvsAiEWoMnSGuxs66uFDjIRiZSfdmQ',
  superSecretForUser: process.env.JWT_SECRET_USER || 'NakJ5JQHWaTnz3GiXQl0kVPjsFYzdI8ClA',
  refreshTokenSecretForUser: process.env.REFRESH_TOKEN_FOR_USER || 'XdOSHqT2cmEPuma9aWzCvZsLzuZfPaQq',
  refreshTokenSecretForAdmin: process.env.REFRESH_TOKEN_FOR_ADMIN || 'FgqVbQNpMfgIalRAmRucS26hWOXMsP0z',
  tokenLife: '20d', /** 1 minute or 60 sec */
  refreshTokenLife: '20d', /** 20 days */
  base: process.env.BASE || 'http://0.0.0.0:4000',
  allowedExtensions: ['png', 'jpeg', 'jpg', 'pdf'],
  verificationSecret: process.env.VERIFICATION_SECRET || 'FgqVbQNpMfgIalRAmRucS26hWOXMsP0z',
  frontEndUrl: process.env.FRONT_END_URL || 'https://etonbikes.com/validate-email',
  etonEmailForVerificationId: process.env.VERIFICATION_EMAIL,
  etonEmailForVerificationPassword: process.env.VERIFICATION_EMAIL_PASSWORD,
  razerPay: {
    key: process.env.RAZER_PAY_KEY || 'rzp_test_Z8LqVx1MG0AMZO',
    secret: process.env.RAZER_PAY_SECRET || '3ALN1mWBUEnzg3tCizDHcShh',
    webHookSecretKey: process.env.RAZER_PAY_WEB_HOOK_SECRET || 'EtonBikeRazerWebHook'
  },
};

export default app;
