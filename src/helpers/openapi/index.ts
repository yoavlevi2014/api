export default {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Drawdojo",
      version: "0.0.1",
    },
  },
  apis: ["./src/controller/**/*.ts", "./src/schemas/**/*.ts"],
  servers: [
    {
      url: "https://api.operce.net/",
      description: "Main server",
    },
  ],
};
