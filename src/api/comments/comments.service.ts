import { Comment, Comments } from "./comments.model";
import { FindOneAndUpdateOptions, FindOptions, InsertOneOptions, OptionalUnlessRequiredId, MatchKeysAndValues, FindOneAndDeleteOptions } from "mongodb";

export async function createComment(doc: OptionalUnlessRequiredId<Comment>, options?: InsertOneOptions) {
	return Comments.insertOne(doc, { ...options });
}

export async function findAllComments(options?: FindOptions){
	return Comments.find({});
}

export async function findComments(articleId: number, options?: FindOptions) {
	return Comments.find({ article_id: articleId }, { ...options });
}

export async function findComment(id: number, options?: FindOptions) {
	return Comments.findOne({ id });
}


export async function updateComment(id: number, updateFilter: MatchKeysAndValues<Comment>, options?: FindOneAndUpdateOptions) {
	return Comments.findOneAndUpdate({ id }, { $set: updateFilter }, { ...options });
}

export async function deleteComment(id: number, options?: FindOneAndDeleteOptions) {
	return Comments.findOneAndDelete({ id }, { ...options });
}