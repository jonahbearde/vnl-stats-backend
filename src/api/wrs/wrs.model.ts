import * as z from 'zod';
import { db } from '../../utils/connect';
import {WithId} from 'mongodb';


export const Wr = z.object({
	map_id: z.number(),
	map_name: z.string().min(4),
	has_teleports: z.boolean(),
	time: z.number(),
	teleports: z.number(),
	player_name: z.string(),
	steamid: z.string(),
	steamid64: z.string(),
	created_on: z.string()
})

export type Wr = z.infer<typeof Wr>;
export type WrWithId = WithId<Wr>;
export const Wrs = db.collection<Wr>('worldrecords');


