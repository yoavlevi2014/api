import db from "@db";

export const mochaHooks = {
  beforeAll: [
    async function () {
      await db();
    },
  ],
};
