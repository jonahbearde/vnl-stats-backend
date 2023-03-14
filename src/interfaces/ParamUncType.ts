import * as z from 'zod';


export const ParamUncType = z.object({
	type: z.union([z.literal('0'), z.literal('1'), z.literal('2')])
})

export type ParamUncType = z.infer<typeof ParamUncType>;