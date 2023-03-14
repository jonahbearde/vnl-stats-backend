import * as z from 'zod';

export const ParamMapSearch = z.object({
	name: z.string().min(1)
})

export type ParamMapSearch = z.infer<typeof ParamMapSearch>;