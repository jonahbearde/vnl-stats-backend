import * as z from 'zod';

const reg = new RegExp('[0-9]+');
export const ParamId = z.object({
	id: z.string().regex(reg)
})

export type ParamId = z.infer<typeof ParamId>;