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
 *                   _id:
 *                     type: string
 *                     example: 6320c59e3302dcfa497d5e75
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
 *                   og:
 *                     type: object
 *                     example: { "title": "네이버", "image": "https://s.pstatic.net/static/www/mobile/edit/2016/0705/mobile_212852414260.png", "description": "네이버 메인에서 다양한 정보와 유용한 컨텐츠를 만나 보세요." }
 *
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: 회원 가입하기
 *     tags: [User]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:      # Request body contents
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               personal:
 *                 type: string
 *               prefer:
 *                 type: string
 *               pwd:
 *                 type: string
 *               phone:
 *                 type: string
 *             example:   # Sample object
 *               name: 홍길동
 *               email: mail1@mail.com
 *               personal: 200101-1234567
 *               prefer: https://www.naver.com
 *               pwd: 1234
 *               phone: "01011112222"
 *     responses:
 *       200:
 *        description: 회원 가입 성공. return A user object id
 *        content:
 *         application/json:
 *          schema:
 *           type: object
 *           properties:
 *            id:
 *            type: string
 *           example: 6320eccca7ae7df5799f3035
 *
 */
