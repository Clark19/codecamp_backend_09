/**
 * @swagger
 * /Starbucks:
 *   get:
 *     summary: 커피 메뉴 리스트 가져오기
 *     tags: [Starbucks]
 *     parameters:
 *       - in: query
 *         name: number
 *         type: int
 *         description: 전송 받을 커피 메뉴 갯수를 명시. 입력 없을시 10개. 임시 Mock 데이터임.
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: 아메리카노
 *                   kcal:
 *                     type: int
 *                     example: 50

 */
