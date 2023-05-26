import { Bonus, Bonuses } from "./bonus.model";
import { FindOneAndUpdateOptions, FindOptions, InsertOneOptions, OptionalUnlessRequiredId, MatchKeysAndValues, FindOneAndDeleteOptions } from "mongodb";

export async function createBonus(doc: OptionalUnlessRequiredId<Bonus>, options?: InsertOneOptions) {
	return Bonuses.insertOne(doc, { ...options });
}

export async function findAllBonuses(options?: FindOptions) {
	return Bonuses.find({}, { ...options }).sort({ bonou_number: 1 });
}

export async function findBonusesByName(name: string, options?: FindOptions) {
	return Bonuses.find({ map_name: name }, { ...options });
}

export async function updateBonus(id: number, updateFilter: MatchKeysAndValues<Bonus>, options?: FindOneAndUpdateOptions) {
	return Bonuses.findOneAndUpdate({ id }, { $set: updateFilter }, { ...options });
}

export async function deleteBonus(id: number, options?: FindOneAndDeleteOptions) {
	return Bonuses.findOneAndDelete({ id }, { ...options });
}