import * as z from 'zod';
import { db } from '../../utils/connect';
import {WithId} from 'mongodb';

export const KzMap = z.object({
	// id: z.number({required_error: 'map id is required'}),
	name: z.string().min(4),
	id: z.number(),
	tpTier: z.number(),
	proTier: z.number(),
	kztTier: z.number(),
	notes: z.string(),
	workshopId: z.string(),
	mapperNames: z.string().array(),
	mapperIds: z.string().array(),
	releaseDate: z.string()
})


export type KzMap = z.infer<typeof KzMap>;

export type KzMapWithId = WithId<KzMap>;

export const KzMaps = db.collection<KzMap>('kzmaps');


