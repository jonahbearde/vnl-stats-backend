import { WithId } from 'mongodb';
import * as z from 'zod';
import {db} from '../../utils/connect'

export const Comment = z.object({
	id: z.number(),
	article_id: z.number(),
	content: z.string(),
	user_id: z.number(),
	user_name: z.string(),
	updated_on: z.string()
})

export type Comment = z.infer<typeof Comment>;

export type CommentWithId = WithId<Comment>

export const Comments = db.collection<Comment>('comments');