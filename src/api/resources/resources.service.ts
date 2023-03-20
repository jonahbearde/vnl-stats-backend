import { Resource, Resources } from "./resources.model";
import { FindOneAndUpdateOptions, FindOptions, InsertOneOptions, OptionalUnlessRequiredId, MatchKeysAndValues, FindOneAndDeleteOptions } from "mongodb";

export async function createResource(doc: OptionalUnlessRequiredId<Resource>, options?: InsertOneOptions) {
	return Resources.insertOne(doc, { ...options });
}

export async function findAllResources(options?: FindOptions) {
	return Resources.find({}, { ...options });
}

export async function updateResource(id: number, updateFilter: MatchKeysAndValues<Resource>, options?: FindOneAndUpdateOptions) {
	return Resources.findOneAndUpdate({ id }, { $set: updateFilter }, { ...options });
}

export async function deleteResource(id: number, options?: FindOneAndDeleteOptions) {
	return Resources.findOneAndDelete({ id }, { ...options });
}