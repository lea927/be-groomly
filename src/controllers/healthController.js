const healthController = {
  getHealth: (req, res) => {
    res.json({
      success: true,
      message: 'Server is running',
      data: {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version || '1.0.0',
      },
    });
  },

  getRoot: (req, res) => {
    res.json({
      success: true,
      message: 'Welcome to be-groomly API!',
      data: {
        version: '1.0.0',
        documentation: '/api/docs',
        health: '/api/health',
      },
    });
  },
};

module.exports = healthController;
