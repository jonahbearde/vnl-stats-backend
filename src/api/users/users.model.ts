import * as z from 'zod';
import {db} from '../../utils/connect';

export const User = z.object({
	id: z.number(),
	name: z.string(),
	password: z.string(),
	role: z.union([z.literal('Admin'), z.literal('User'), z.literal('Elon')])
})

export type User = z.infer<typeof User>;

export const Users = db.collection<User>('users');

