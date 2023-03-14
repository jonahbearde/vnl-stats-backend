import { Request, Response, NextFunction } from "express";
import { ParamId } from "../../interfaces/ParamId";
import { ParamMapName } from "../../interfaces/ParamMapName";
import { ParamUncType } from "../../interfaces/ParamUncType";
import { Uncompleted, UncompletedWithId } from "./uncompleted.model";
import { createUncompleted, deleteUncompleted, findAllUncompleteds, findUncompletedsOfType, findUncompletedByName, updateUncompleted } from "./uncompleted.service";

export async function createUncompletedHandler(req: Request<{}, UncompletedWithId, Uncompleted>, res: Response<UncompletedWithId>, next: NextFunction) {
	try {
		const body = req.body;
		const createResult = await createUncompleted({...body});
		if(!createResult.acknowledged) throw new Error('error creating an uncompleted map');
		res.status(201);
		res.json({
			_id: createResult.insertedId,
			...body
		})
	} catch (error) {
		next(error);
	}	
}


export async function getAllUncompletedsHandler(req: Request<{}, Uncompleted[]>, res: Response<Uncompleted[]>, next: NextFunction){
	try {
		const cursor = await findAllUncompleteds();
		const results = await cursor.toArray();
		if(results.length === 0){
			res.status(404);
			throw new Error('error finding all uncompleted maps');
		}
		res.json(results);
	} catch (error) {
		next(error);
	}
}

export async function getUncompletedsOfTypeHandler(req: Request<ParamUncType, Uncompleted[], {}>, res: Response<Uncompleted[]>, next: NextFunction){
	try {
		const type = parseInt(req.params.type);
		const cursor = await findUncompletedsOfType(type);
		const results = await cursor.toArray();
		if(results.length === 0){
			res.json([]);
		}
		res.json(results);
	} catch (error) {
		console.log(error);
	}
}

export async function getUncompletedByNameHandler(req: Request<ParamMapName, Uncompleted>, res: Response<Uncompleted>, next: NextFunction){
	try {
		const result = await findUncompletedByName(req.params.name);
		if(!result){
			res.sendStatus(404);
			return
		}
		res.json(result);
	} catch (error) {
		next(error);
	}
}

export async function updateUncompletedHandler(req: Request<ParamId, Uncompleted, Uncompleted>, res: Response<Uncompleted>, next: NextFunction){
	try {
		const id = parseInt(req.params.id);
		const result = await updateUncompleted(id, {...req.body}, {returnDocument: 'after', upsert: true});
		if(!result.value){
			res.sendStatus(404);
			return;
		}
		res.json(result.value);
	} catch (error) {
		next(error);
	}
}

export async function deleteUncompletedHandler(req: Request<ParamId, {}, Uncompleted>, res: Response<{}>, next: NextFunction){
	try {
		const id = parseInt(req.params.id);
		const result = await deleteUncompleted(id);
		if(!result.value){
			res.sendStatus(404);
			return;
		}
		res.json(result);
	} catch (error) {
		next(error);
	}
}


