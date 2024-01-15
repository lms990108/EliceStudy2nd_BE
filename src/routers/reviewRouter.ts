import { Router } from "express";
import asyncHandler from "../common/utils/asyncHandler";
import reviewController from "../controllers/reviewController";
import { authenticateUser } from "../middlewares/authUserMiddlewares";

/**
 * @swagger
 * /reviews/{showId}:
 *   post:
 *     tags: [Review]
 *     summary: 리뷰 등록
 *     parameters:
 *      - in: path
 *        name: showId
 *        required: true
 *        schema:
 *         type: string
 *         description: showId
 *         example: "PF227440"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            properties:
 *             content:
 *              type: string
 *              description: 리뷰 내용
 *              example: "재미있는 공연이에요!"
 *             rate:
 *              type: number
 *              description: 평점 (0~5)
 *              example: 5
 *     responses:
 *       201:
 *         description: 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                review:
 *                 type: obejct
 *                 description: 리뷰
 *                 example:
 *                   - _id: "65a39e03a0f46b46abc87a32"
 *                     user_id: "3246926995"
 *                     show_id: "PF233351"
 *                     content: "재미있는 공연이에요!"
 *                     rate: 5
 *                     created_at: "2024-01-14T08:40:35.440Z"
 *                     updated_at: "2024-01-14T08:40:35.440Z"
 *                     deleted_at: null
 */

/**
 * @swagger
 * /reviews/{reviewId}:
 *   patch:
 *     tags: [Review]
 *     summary: 리뷰 수정
 *     parameters:
 *      - in: path
 *        name: reviewId
 *        required: true
 *        schema:
 *         type: string
 *         description: reviewId
 *         example: "65a39e03a0f46b46abc87a32"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            properties:
 *             content:
 *              type: string
 *              description: 리뷰 내용
 *              example: "재미있는 공연이에요!"
 *             rate:
 *              type: number
 *              description: 평점 (0~5)
 *              example: 5
 *     responses:
 *       201:
 *         description: 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                review:
 *                 type: obejct
 *                 description: 리뷰
 *                 example:
 *                   - _id: "65a39e03a0f46b46abc87a32"
 *                     user_id: "3246926995"
 *                     show_id: "PF233351"
 *                     content: "재미있는 공연이에요!"
 *                     rate: 5
 *                     created_at: "2024-01-14T08:40:35.440Z"
 *                     updated_at: "2024-01-14T08:40:35.440Z"
 *                     deleted_at: null
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     tags: [Review]
 *     summary: 전체 리뷰 조회
 *     parameters:
 *      - in: query
 *        name: page
 *        schema:
 *         type: number
 *         description: 페이지 번호
 *      - in: query
 *        name: limit
 *        schema:
 *         type: number
 *         description: 페이지당 리뷰 개수
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                reviews:
 *                 type: array
 *                 description: 리뷰 목록
 *                 example:
 *                   - _id: "65a39e03a0f46b46abc87a32"
 *                     user_id: "3246926995"
 *                     show_id: "PF233351"
 *                     content: "재미있는 공연이에요!"
 *                     rate: 5
 *                     created_at: "2024-01-14T08:40:35.440Z"
 *                     updated_at: "2024-01-14T08:40:35.440Z"
 *                     deleted_at: null
 *                   - _id: "65a3932cb95752766c2f12c0"
 *                     user_id: "3246926995"
 *                     show_id: "PF185284"
 *                     content: "test2"
 *                     rate: 3
 *                     created_at: "2024-01-14T07:32:54.162Z"
 *                     updated_at: "2024-01-14T07:35:40.862Z"
 *                     deleted_at: null
 */

/**
 * @swagger
 * /reviews/user/{userId}:
 *   get:
 *     tags: [Review]
 *     summary: 유저별 리뷰 조회
 *     parameters:
 *      - in: query
 *        name: page
 *        schema:
 *         type: number
 *         description: 페이지 번호
 *      - in: query
 *        name: limit
 *        schema:
 *         type: number
 *         description: 페이지당 리뷰 개수
 *      - in: path
 *        name: userId
 *        schema:
 *         type: string
 *         description: 유저 아이디
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                reviews:
 *                 type: array
 *                 description: 리뷰 목록
 *                 example:
 *                   - _id: "65a39e03a0f46b46abc87a32"
 *                     user_id: "3246926995"
 *                     show_id: "PF233351"
 *                     content: "재미있는 공연이에요!"
 *                     rate: 5
 *                     created_at: "2024-01-14T08:40:35.440Z"
 *                     updated_at: "2024-01-14T08:40:35.440Z"
 *                     deleted_at: null
 *                   - _id: "65a3932cb95752766c2f12c0"
 *                     user_id: "3246926995"
 *                     show_id: "PF185284"
 *                     content: "test2"
 *                     rate: 3
 *                     created_at: "2024-01-14T07:32:54.162Z"
 *                     updated_at: "2024-01-14T07:35:40.862Z"
 *                     deleted_at: null
 */

/**
 * @swagger
 * /reviews/show/{showId}:
 *   get:
 *     tags: [Review]
 *     summary: 공연별 리뷰 조회
 *     parameters:
 *      - in: query
 *        name: page
 *        schema:
 *         type: number
 *         description: 페이지 번호
 *      - in: query
 *        name: limit
 *        schema:
 *         type: number
 *         description: 페이지당 리뷰 개수
 *      - in: path
 *        name: showId
 *        schema:
 *         type: string
 *         description: 공연 아이디
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                reviews:
 *                 type: array
 *                 description: 리뷰 목록
 *                 example:
 *                   - _id: "65a39e03a0f46b46abc87a32"
 *                     user_id: "3246926995"
 *                     show_id: "PF233351"
 *                     content: "재미있는 공연이에요!"
 *                     rate: 5
 *                     created_at: "2024-01-14T08:40:35.440Z"
 *                     updated_at: "2024-01-14T08:40:35.440Z"
 *                     deleted_at: null
 *                   - _id: "65a3932cb95752766c2f12c0"
 *                     user_id: "3246926995"
 *                     show_id: "PF233351"
 *                     content: "test2"
 *                     rate: 3
 *                     created_at: "2024-01-14T07:32:54.162Z"
 *                     updated_at: "2024-01-14T07:35:40.862Z"
 *                     deleted_at: null
 */

/**
 * @swagger
 * /reviews/{reviewId}:
 *   get:
 *     tags: [Review]
 *     summary: 리뷰 단건 조회
 *     parameters:
 *      - in: path
 *        name: reviewId
 *        required: true
 *        schema:
 *         type: string
 *         description: reviewId
 *         example: "65a39e03a0f46b46abc87a32"
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                review:
 *                 type: object
 *                 description: 리뷰 내용
 *                 example:
 *                   - _id: "65a39e03a0f46b46abc87a32"
 *                     user_id: "3246926995"
 *                     show_id: "PF233351"
 *                     content: "재미있는 공연이에요!"
 *                     rate: 5
 *                     created_at: "2024-01-14T08:40:35.440Z"
 *                     updated_at: "2024-01-14T08:40:35.440Z"
 *                     deleted_at: null
 */

/**
 * @swagger
 * /reviews/{reviewId}:
 *   delete:
 *     tags: [Review]
 *     summary: 리뷰 삭제
 *     parameters:
 *      - in: path
 *        name: reviewId
 *        required: true
 *        schema:
 *         type: string
 *         description: reviewId
 *         example: "65a39e03a0f46b46abc87a32"
 *     responses:
 *       200:
 *         description: 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                review:
 *                 type: object
 *                 description: 리뷰 내용
 *                 example:
 *                   - _id: "65a39e03a0f46b46abc87a32"
 *                     user_id: "3246926995"
 *                     show_id: "PF233351"
 *                     content: "test4"
 *                     rate: 5
 *                     created_at: "2024-01-14T08:40:35.440Z"
 *                     updated_at: "2024-01-14T08:40:35.440Z"
 *                     deleted_at: "2024-01-14T10:05:15.453Z"
 */

const reviewRouter = Router();

reviewRouter.post(
  "/:showId",
  authenticateUser,
  asyncHandler(reviewController.create),
);
reviewRouter.patch(
  "/:reviewId",
  authenticateUser,
  asyncHandler(reviewController.update),
);
reviewRouter.get("/", asyncHandler(reviewController.findAll));
reviewRouter.get("/:reviewId", asyncHandler(reviewController.findOne));
reviewRouter.get(
  "/user/:userId",
  asyncHandler(reviewController.findReviewsByUserId),
);
reviewRouter.get(
  "/show/:showId",
  asyncHandler(reviewController.findReviewsByShowId),
);
reviewRouter.delete("/:reviewId", asyncHandler(reviewController.deleteOne));

export default reviewRouter;
