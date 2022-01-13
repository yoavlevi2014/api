/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register endpoint
 *     description: Create user information, generate an access token and a refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's first name.
 *                 example: Leanne
 *               surname:
 *                 type: string
 *                 description: User's last name.
 *                 example: Graham
 *               email:
 *                 type: string
 *                 description: User's email.
 *                 example: test@gmail.com
 *               username:
 *                 type: string
 *                 description: User's username(ASCII only).
 *                 example: Hello
 *               password:
 *                 type: string
 *                 description: User's password.
 *                 example: "IlOveT0b3tR1cky"
 *             required:
 *               - name
 *               - surname
 *               - email
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Register successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                    type: object
 *                    properties:
 *                     at:
 *                       type: string
 *                       description: Access token.
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *                     rt:
 *                       type: string
 *                       description: Refresh token.
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *                    required:
 *                      - at
 *                      - rt
 *               required:
 *                 - user
 *                 - tokens
 */
