import { Request, Response, NextFunction } from "express";
import { ParamId } from "../../interfaces/ParamId";
import { ParamTag } from "../../interfaces/ParamTag";
import { Article, ArticleWithId } from "./articles.model";
import { createArticle, deleteArticle, findAllArticles, findArticlesByTag, updateArticle } from "./articles.service";

export async function createArticleHandler(req: Request<{}, ArticleWithId, Article>, res: Response<ArticleWithId>, next: NextFunction) {
	try {
		const body = req.body;
		const createResult = await createArticle({...body});
		if(!createResult.acknowledged) throw new Error('error creating an article');
		res.status(201);
		res.json({
			_id: createResult.insertedId,
			...body
		})
	} catch (error) {
		next(error);
	}	
}


export async function getAllArticlesHandler(req: Request<{}, Article[]>, res: Response<Article[]>, next: NextFunction){
	try {
		const cursor = await findAllArticles();
		const results = await cursor.toArray();
		if(results.length === 0){
			res.status(404);
			throw new Error('error finding all maps');
		}
		res.json(results);
	} catch (error) {
		next(error);
	}
}

export async function getArticlesByTagHandler(req: Request<ParamTag, Article[]>, res: Response<Article[]>, next: NextFunction){
	try {
		const cursor = await findArticlesByTag(req.params.tag);
		const results = await cursor.toArray();
		if(results.length === 0){
			res.json([]);
		}
		res.json(results);
	} catch (error) {
		next(error);
	}
}

export async function updateArticleHandler(req: Request<ParamId, Article, Article>, res: Response<Article>, next: NextFunction){
	try {
		const id = parseInt(req.params.id);
		const result = await updateArticle(id, {...req.body}, {returnDocument: 'after', upsert: true});
		if(!result.value){
			res.sendStatus(404);
			return;
		}
		res.json(result.value);
	} catch (error) {
		next(error);
	}
}

export async function deleteArticleHandler(req: Request<ParamId, {}, Article>, res: Response<{}>, next: NextFunction){
	try {
		const id = parseInt(req.params.id);
		const result = await deleteArticle(id);
		if(!result.value){
			res.sendStatus(404);
			return;
		}
		res.json(result);
	} catch (error) {
		next(error);
	}
}


