import { WithId } from 'mongodb';
import * as z from 'zod';
import {db} from '../../utils/connect';

export const Uncompleted = z.object({
	map_id: z.number(),
	map_name: z.string(),
	kztTier: z.number(),
	notes: z.string(),
	type: z.number(),
	releaseDate: z.string()
})

export type Uncompleted = z.infer<typeof Uncompleted>;

export type UncompletedWithId = WithId<Uncompleted>;

export const Uncompleteds = db.collection<Uncompleted>('uncompleted');