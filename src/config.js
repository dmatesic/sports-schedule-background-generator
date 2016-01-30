const config = {
  env: process.env.NODE_ENV || 'development',
  express: {
    port: process.env.PORT || 4000,
  },
  loggly: {
    token: '015cf025-66ab-4411-8b10-254b628f1146',
    subdomain: 'dmatesic',
  },
};

export default config;
