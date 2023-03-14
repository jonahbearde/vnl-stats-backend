import * as z from 'zod';

export const QueryGetWrMaps = z.object({
	steamid64: z.string().length(17),
	has_teleports: z.string()
})


export type QueryGetWrMaps = z.infer<typeof QueryGetWrMaps>;