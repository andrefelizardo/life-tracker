module.exports = {
  apps: [
    {
      name: "habits-api",
      cwd: "./backend",
      script: "pnpm",
      args: "start",
      watch: true,
    },
    {
      name: "habits-web",
      cwd: "./app",
      script: "pnpm",
      args: "dev",
      watch: true,
    },
  ],
};
