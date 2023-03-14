import * as z from 'zod';

export const ParamMapName = z.object({
	name: z.string().min(4)
})

export type ParamMapName = z.infer<typeof ParamMapName>;