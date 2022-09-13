/**
 * @swagger
 * /tokens/phone:
 *   post:
 *     summary: 핸드폰을 통한 문자(토큰) 인증 요청 API. 토큰을 생성하고, 생성한 토큰을 문자로 전송. 회원 가입 요청 전에 먼저 사용해야 함.
 *     tags: [Token]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:      # Request body contents
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *             example:   # Sample object
 *               phone: "01011112222"
 *     responses:
 *       200:
 *        description: 토큰 생성&문자 전송 성공
 *        content:
 *         application/json:
 *          schema:
 *           type: object
 *           properties:
 *            data:
 *            type: string
 *           example: 핸드폰으로 인증 문자가 전송되었습니다!
 *       400:
 *        description: 토큰 생성&문자 전송 실패
 *        content:
 *         application/json:
 *          schema:
 *           type: object
 *           properties:
 *            data:
 *            type: string
 *           example: 휴대폰 번호를 확인해주세요. 또는 토큰 생성에 실패했습니다.
 */

/**
 * @swagger
 * /tokens/phone:
 *   patch:
 *     summary: 핸드폰을 통한 문자(토큰) 인증 체크&완료 API. 클라이언트가 전달하는 토큰과 디비에 기입된 토큰을 비교하여 인증 여부를 기록. 회원 가입 요청 전에 먼저 사용해야 함.
 *     tags: [Token]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:      # Request body contents
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               token:
 *                 type: string
 *             example:   # Sample object
 *               phone: "01011112222"
 *               token: "123456"
 *     responses:
 *       200:
 *        description: 전화번호&토큰 인증 성공
 *        content:
 *         application/json:
 *          schema:
 *           type: object
 *           properties:
 *            data:
 *            type: boolean
 *           example: true
 *       400:
 *        description: 전화번호&토큰 인증 실패
 *        content:
 *         application/json:
 *          schema:
 *           type: object
 *           properties:
 *            data:
 *            type: boolean
 *           example: false
 */
