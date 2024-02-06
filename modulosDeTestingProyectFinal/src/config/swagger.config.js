export const swaggerOptions = {
    definition: {
      openapi: "3.0.1",
      info: {
        title: "BLKY Pets API Documentation",
        description:
          "How to use endpoints along with their parameters.",
        version: "1.0.0",
      },
    },
    apis: [`./src/docs/**/*.yaml`],
  };