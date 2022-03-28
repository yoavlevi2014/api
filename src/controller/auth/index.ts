export { login } from "@controller/auth/login";
export { register } from "@controller/auth/register";
export { verifyToken } from "@controller/auth/verify";
// export { refresh } from "@contoller/auth/refresh";

/**
 * @openapi
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         message:
 *           type: string
 *       required:
 *         - code
 *         - message
 */
