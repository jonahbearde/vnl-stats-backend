import { Request, Response, NextFunction } from "express";
import { ParamId } from "../../interfaces/ParamId";
import { ParamTag } from "../../interfaces/ParamTag";
import { Article, ArticleWithId, Comment } from "./articles.model";
import { createArticle, createComment, deleteArticle, deleteComment, findAllArticles, findArticlesByTag, updateArticle } from "./articles.service";

export async function createArticleHandler(req: Request<{}, ArticleWithId, Article>, res: Response<ArticleWithId>, next: NextFunction) {
	try {
		const body = req.body;
		const createResult = await createArticle({ ...body });
		if (!createResult.acknowledged) throw new Error('error creating an article');
		res.status(201);
		res.json({
			_id: createResult.insertedId,
			...body
		})
	} catch (error) {
		next(error);
	}
}


export async function getAllArticlesHandler(req: Request<{}, Article[]>, res: Response<Article[]>, next: NextFunction) {
	try {
		const cursor = await findAllArticles();
		const results = await cursor.toArray();
		if (results.length === 0) {
			res.status(404);
			throw new Error('error finding all maps');
		}
		res.json(results);
	} catch (error) {
		next(error);
	}
}

export async function getArticlesByTagHandler(req: Request<ParamTag, Article[]>, res: Response<Article[]>, next: NextFunction) {
	try {
		const cursor = await findArticlesByTag(req.params.tag);
		const results = await cursor.toArray();
		if (results.length === 0) {
			res.json([]);
		}
		res.json(results);
	} catch (error) {
		next(error);
	}
}

export async function updateArticleHandler(req: Request<ParamId, Article, {}>, res: Response<Article>, next: NextFunction) {
	try {
		const id = parseInt(req.params.id);
		const result = await updateArticle(id, { ...req.body }, { returnDocument: 'after'});
		if (!result.value) {
			res.sendStatus(404);
			return;
		}
		res.json(result.value);
	} catch (error) {
		next(error);
	}
}

export async function deleteArticleHandler(req: Request<ParamId, {}, Article>, res: Response<{}>, next: NextFunction) {
	try {
		const id = parseInt(req.params.id);
		const result = await deleteArticle(id);
		if (!result.value) {
			res.sendStatus(404);
			return;
		}
		res.json(result);
	} catch (error) {
		next(error);
	}
}

export async function createCommentHandler(req: Request<ParamId, ArticleWithId, Comment>, res: Response<Article>, next: NextFunction) {
	try {
		// the article id
		const id = parseInt(req.params.id);
		const createResult = await createComment(id, req.body, { returnDocument: 'after' });
		if (!createResult.value) {
			res.status(404);
			return;
		}
		res.json(createResult.value);
	} catch (error) {
		next(error);
	}
}

export async function deleteCommentHandler(req: Request<{ id: string, user_id: string }, {}, Comment>, res: Response<{}>, next: NextFunction) {
	try {
		const id = parseInt(req.params.id);
		const user_id = parseInt(req.params.user_id);
		const result = await deleteComment(id, user_id);
		if (!result.value) {
			res.sendStatus(404);
			return;
		}
		res.json(result);
	} catch (error) {
		next(error);
	}
}



