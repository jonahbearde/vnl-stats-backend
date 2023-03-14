import { Router } from "express";
import { ParamId } from "../../interfaces/ParamId";
import { ParamTag } from "../../interfaces/ParamTag";
import { requireUser, validateRequest } from "../../middlewares";
import * as ArticlesHandlers from "./articles.controller";
import { Article } from "./articles.model";

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
		body: Article
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

export default router;