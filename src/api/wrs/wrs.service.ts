import { Wr, Wrs } from './wrs.model'
import { MatchKeysAndValues, FindOneAndUpdateOptions, FindCursor, Filter, FindOptions } from 'mongodb';

export async function createWr(run: Wr) {
	return Wrs.insertOne(run);
}

export async function updateWr(map_id: number, has_teleports: boolean, updateFilter: MatchKeysAndValues<Wr>, options?: FindOneAndUpdateOptions) {
	return Wrs.findOneAndUpdate({
		map_id,
		has_teleports
	}, {
		$set: {
			...updateFilter
		}
	})
}

export async function findPlayersWrs(steamid64: string, has_teleports: boolean) {
	return Wrs.find({ steamid64, has_teleports });
}

export async function findAllWrs() {
	return Wrs.find({}, { projection: { _id: 0 } });
}

export async function findAllWrsOfType(has_teleports: boolean) {
	return Wrs.find({ has_teleports });
}

export async function findMapWrs(mapName: string) {
	return Wrs.find({ map_name: mapName });
}

