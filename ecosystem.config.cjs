/** PM2: pm2 start ecosystem.config.cjs */
module.exports = {
  apps: [
    {
      name: "iasv-quiz",
      cwd: "/var/www/iasv-quiz",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      env_file: "/var/www/iasv-quiz/.env.local",
      env: {
        NODE_ENV: "production",
        PORT: "3012",
      },
    },
  ],
};
