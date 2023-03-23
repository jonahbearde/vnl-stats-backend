import { Router } from "express";
import { object, string } from 'zod';
import { ParamId } from "../../interfaces/ParamId";
import { ParamTag } from "../../interfaces/ParamTag";
import { requireUser, validateRequest } from "../../middlewares";
import * as ArticlesHandlers from "./articles.controller";
import { Article, Comment } from "./articles.model";

const router = Router();

router.post(
	'/',
	requireUser('Admin'),
	validateRequest({
		body: Article
	}),
	ArticlesHandlers.createArticleHandler
)

router.get(
	'/',
	ArticlesHandlers.getAllArticlesHandler
)

router.get(
	'/:tag',
	validateRequest({
		params: ParamTag
	}),
	ArticlesHandlers.getArticlesByTagHandler
)

router.put(
	'/:id',
	requireUser('Admin'),
	validateRequest({
		params: ParamId,
	}),
	ArticlesHandlers.updateArticleHandler
)

router.delete(
	'/:id',
	requireUser('Admin'),
	validateRequest({
		params: ParamId
	}),
	ArticlesHandlers.deleteArticleHandler
)

router.post(
	'/comments/:id',
	validateRequest({
		params: ParamId,
		body: Comment
	}),
	ArticlesHandlers.createCommentHandler
)

router.put(
	'/comments/:id',
	validateRequest({
		params: ParamId,
		body: Comment
	}),
	ArticlesHandlers.updateCommentHandler
)

router.delete(
	'/comments/:id/:comment_id',
	validateRequest({
		params: object({ id: string(), comment_id: string() }),
	}),
	ArticlesHandlers.deleteCommentHandler
)

export default router;