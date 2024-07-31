module.exports = {
  apps: [
    {
      name: "FE",
      script: "npm",
      args: "run preview",
      instances: "1",
      exec_mode: "cluster", // if there is only one instance, use cluster otherwise
    },
  ],
};
