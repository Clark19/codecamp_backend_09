/**
 * @swagger
 * /Starbucks:
 *   get:
 *     summary: 커피 메뉴 리스트 가져오기
 *     tags: [Starbucks]
 *     parameters:
 *       - in: query
 *         name: itemsPerPage
 *         description: 한번에 전송 받을 커피 메뉴 갯수를 명시. 입력 없을시 30개.
 *         schema:
 *          type: int
 *          example: 30
 *       - in: query
 *         name: page
 *         description: 전체 커피 메뉴 중 몇번째 페이지를 가져올지 명시. 입력 없을시 1페이지.
 *         schema:
 *          type: int
 *          example: 1
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
 *                     example: 6320ccaa2e9520afb2542ff7
 *                   name:
 *                     type: string
 *                     example: 아메리카노
 *                   img:
 *                     type: string
 *                     example: https://image.istarbucks.co.kr/upload/store/skuimg/2021/04/[9200000002487]_20210426091745467.jpg

 */
