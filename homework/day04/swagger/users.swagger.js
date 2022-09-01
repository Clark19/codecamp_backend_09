/**
 * @swagger
 * /users:
 *   get:
 *     summary: 유저들의 정보 가져오기
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: number
 *         type: int
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 properties:
 *                   email:
 *                     type: string
 *                     example: user1@email.com
 *                   name:
 *                     type: string
 *                     example: 이름1
 *                   phone:
 *                     type: string
 *                     example: 010-1111-0001
 *                   personal:
 *                     type: string
 *                     example: 980402-0000000
 *                   prefer:
 *                     type: string
 *                     example: https://www.google1.com
 */
