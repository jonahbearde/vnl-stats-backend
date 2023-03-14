import { KzMap, KzMapWithId, KzMaps } from './maps.model'
import { OptionalUnlessRequiredId, InsertOneOptions, FindOptions, FindOneAndDeleteOptions, FindOneAndUpdateOptions, MatchKeysAndValues } from 'mongodb';



export async function createMap(doc: OptionalUnlessRequiredId<KzMap>, options?: InsertOneOptions) {
	return KzMaps.insertOne(doc, { ...options });
}

export async function findAllMaps(options?: FindOptions) {
	return KzMaps.find({}, { ...options });
}

export async function findMapByName(name: string, options?: FindOptions) {
	return KzMaps.findOne({ name }, { ...options });
}

export async function findMapsLikeName(name: string, options?: FindOptions) {
	// console.log('search the name', name);
	return KzMaps.find({
		name: {
			$regex: new RegExp(name)
		}
	}, { ...options })
}

export async function updateMap(id: number, updateFilter: MatchKeysAndValues<KzMap>, options?: FindOneAndUpdateOptions) {
	return KzMaps.findOneAndUpdate({ id }, { $set: { ...updateFilter } }, { ...options })
}

export async function deleteMap(id: number, options?: FindOneAndDeleteOptions) {
	return KzMaps.findOneAndDelete({ id }, { ...options })
}
