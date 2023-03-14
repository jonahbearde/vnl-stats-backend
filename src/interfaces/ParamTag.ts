import * as z from 'zod';

export const ParamTag = z.object({
	tag: z.string().min(1)
})

export type ParamTag = z.infer<typeof ParamTag>;