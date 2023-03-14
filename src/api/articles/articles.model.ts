import { WithId } from 'mongodb';
import * as z from 'zod';
import {db} from '../../utils/connect';

export const Article = z.object({
	id: z.number(),
	published_by: z.string(),
	updated_on: z.string(),
	header: z.string(),
	content: z.string(),
	tag: z.string(),
})

export type Article = z.infer<typeof Article>;

export type ArticleWithId = WithId<Article>;

export const Articles = db.collection<Article>('articles');