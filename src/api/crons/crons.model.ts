import * as z from 'zod';
import { db } from '../../utils/connect';
export const Cron = z.object({
	name: z.string(),
	timePattern: z.string(),
	lastRunDate: z.date()
})


export type Cron = z.infer<typeof Cron>;

export const Crons = db.collection<Cron>('crons');