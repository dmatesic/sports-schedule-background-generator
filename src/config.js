const config = {
  env: process.env.NODE_ENV || 'development',
  express: {
    port: process.env.PORT || 4000,
  },
};

export default config;
