import { WithId } from 'mongodb';
import * as z from 'zod';
import {db} from '../../utils/connect';

export const Resource = z.object({
	id: z.number(),
	name: z.string(),
	link: z.string(),
	desc: z.string(),
	category: z.string(),
})

export type Resource = z.infer<typeof Resource>;

export type ResourceWithId = WithId<Resource>;

export const Resources = db.collection<Resource>('resources');