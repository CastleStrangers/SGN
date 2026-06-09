const { execSync } = require("child_process")

module.exports = {
  apps: [
    {
      name: "sy-nl",
      script: "./node_modules/next/dist/bin/next",
      args: "start -p 3001",
      cwd: __dirname,
      env: { NODE_ENV: "production" },
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
      error_file: "./pm2-error.log",
      out_file: "./pm2-out.log",
    },
    {
      name: "sy-nl-sync",
      script: "./node_modules/tsx/dist/cli.js",
      args: "scripts/sync.ts",
      cwd: __dirname,
      env: { NODE_ENV: "production" },
      watch: false,
      autorestart: false,
      cron_restart: "0 * * * *",
      error_file: "./pm2-sync-error.log",
      out_file: "./pm2-sync-out.log",
    },
  ],
}
