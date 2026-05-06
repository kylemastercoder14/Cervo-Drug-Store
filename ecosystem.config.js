module.exports = {
  apps: [
    {
      name: "main",
      script: "npm",
      args: "start",
      cwd: "/root/apps/Cervo-Drug-Store",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};