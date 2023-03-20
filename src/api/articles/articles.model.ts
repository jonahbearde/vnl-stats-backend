import { WithId } from 'mongodb';
import * as z from 'zod';
import { db } from '../../utils/connect';

// interface Comment {
// 	content: string,
// 	user_id: number,
// 	user_name: string,
// 	updated_on: string
// }

export const Comment = z.object({
	content: z.string(),
	user_id: z.number(),
	user_name: z.string(),
	updated_on: z.string()
})

export type Comment = z.infer<typeof Comment>;

export const Article = z.object({
	id: z.number(),
	published_by: z.string(),
	updated_on: z.string(),
	header: z.string(),
	content: z.string(),
	comments: Comment.array(),
	tag: z.string(),
})

export type Article = z.infer<typeof Article>;

export type ArticleWithId = WithId<Article>;

export const Articles = db.collection<Article>('articles');