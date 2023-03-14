import { Request, Response, NextFunction } from "express";
import { ParamId } from "../../interfaces/ParamId";
import { Comment, CommentWithId } from "./comments.model";
import { createComment, deleteComment, findAllComments, findComment, findComments, updateComment } from "./comments.service";

export async function createCommentHandler(req: Request<{}, CommentWithId, Comment>, res: Response<CommentWithId>, next: NextFunction) {
	try {
		const body = req.body;
		const createResult = await createComment({ ...body });
		if (!createResult.acknowledged) throw new Error('error creating an comment');
		res.status(201);
		res.json({
			_id: createResult.insertedId,
			...body
		})
	} catch (error) {
		next(error);
	}
}

export async function getAllCommentsHandler(req: Request<{}, Comment[]>, res: Response<Comment[]>, next: NextFunction){
	try {
		const cursor = await findAllComments();
		const results = await cursor.toArray();
		if(results.length === 0) throw new Error('error finding all comments');
		res.json(results);
	} catch (error) {
		next(error);
	}
}


export async function getCommentsHandler(req: Request<ParamId, Comment[]>, res: Response<Comment[]>, next: NextFunction) {
	try {
		const articleId = parseInt(req.params.id);
		const cursor = await findComments(articleId);
		const results = await cursor.toArray();
		if (results.length === 0) {
			res.send([]);
			return;
		}
		res.json(results);
	} catch (error) {
		next(error);
	}
}


export async function updateCommentHandler(req: Request<ParamId, Comment, Comment>, res: Response<Comment>, next: NextFunction) {
	try {
		const id = parseInt(req.params.id);
		const result = await updateComment(id, { ...req.body }, { returnDocument: 'after', upsert: true });
		if (!result.value) {
			res.sendStatus(404);
			return;
		}
		res.json(result.value);
	} catch (error) {
		next(error);
	}
}

export async function deleteCommentHandler(req: Request<ParamId, {}, Comment>, res: Response<{}>, next: NextFunction) {
	try {
		const id = parseInt(req.params.id);
		const comment = await findComment(id);
		const user = res.locals.user;
		if (!comment) {
			res.sendStatus(404);
			return;
		} else if (comment.user_id !== user.id) {
			res.sendStatus(403);
			return;
		} else {
			const result = await deleteComment(id);
			res.json(result);
		}
	} catch (error) {
		next(error);
	}
}


