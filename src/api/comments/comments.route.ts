import {Router} from 'express';
import { ParamId } from '../../interfaces/ParamId';
import { requireUser, validateRequest } from '../../middlewares';
import * as CommentsHandlers from './comments.controller';
import { Comment } from './comments.model';

const router = Router();

router.post(
	'/',
	requireUser('User'),
	validateRequest({
		body: Comment
	}),
	CommentsHandlers.createCommentHandler
)

router.get(
	'/',
	CommentsHandlers.getAllCommentsHandler
)

router.get(
	'/:id',
	validateRequest({
		params: ParamId
	}),
	CommentsHandlers.getCommentsHandler
)

router.delete(
	'/:id',
	requireUser('User'),
	validateRequest({
		params: ParamId
	}),
	CommentsHandlers.deleteCommentHandler
)

export default router