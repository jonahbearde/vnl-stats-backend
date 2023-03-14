import { Uncompleted, Uncompleteds } from "./uncompleted.model";
import { FindOneAndUpdateOptions, FindOptions, InsertOneOptions, OptionalUnlessRequiredId, MatchKeysAndValues, FindOneAndDeleteOptions } from "mongodb";

export async function createUncompleted(doc: OptionalUnlessRequiredId<Uncompleted>, options?: InsertOneOptions) {
	return Uncompleteds.insertOne(doc, { ...options });
}

export async function findAllUncompleteds(options?: FindOptions) {
	return Uncompleteds.find({}, { ...options });
}

export async function findUncompletedsOfType(type: number, options?: FindOptions) {
	return Uncompleteds.find({ type }, { ...options });
}

export async function findUncompletedByName(name: string, options?: FindOptions) {
	return Uncompleteds.findOne({ map_name: name }, { ...options });
}

export async function updateUncompleted(id: number, updateFilter: MatchKeysAndValues<Uncompleted>, options?: FindOneAndUpdateOptions) {
	return Uncompleteds.findOneAndUpdate({ map_id: id }, { $set: updateFilter }, { ...options });
}

export async function deleteUncompleted(id: number, options?: FindOneAndDeleteOptions) {
	return Uncompleteds.findOneAndDelete({ map_id: id }, { ...options });
}