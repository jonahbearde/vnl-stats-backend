import { WithId } from 'mongodb';
import * as z from 'zod';
import {db} from '../../utils/connect';

export const Bonus = z.object({
	id: z.number(),
	map_id: z.number(),
	map_name: z.string(),
	bonus_number: z.number(),
	tpTier: z.number(),
	proTier: z.number(),
	notes: z.string()
})

export type Bonus = z.infer<typeof Bonus>;

export type BonusWithId = WithId<Bonus>;

export const Bonuses = db.collection<Bonus>('bonus');