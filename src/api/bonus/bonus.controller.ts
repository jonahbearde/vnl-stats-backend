import { Request, Response, NextFunction } from "express";
import { ParamId } from "../../interfaces/ParamId";
import { ParamMapName } from "../../interfaces/ParamMapName";
import { Bonus, BonusWithId } from "./bonus.model";
import { createBonus, deleteBonus, findAllBonuses, findBonusesByName, updateBonus } from "./bonus.service";

export async function createBonusHandler(req: Request<{}, BonusWithId, Bonus>, res: Response<BonusWithId>, next: NextFunction) {
	try {
		const body = req.body;
		const createResult = await createBonus({...body});
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


export async function getAllBonusesHandler(req: Request<{}, Bonus[]>, res: Response<Bonus[]>, next: NextFunction){
	try {
		const cursor = await findAllBonuses();
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

export async function getBonusesByNameHandler(req: Request<ParamMapName, Bonus[]>, res: Response<Bonus[]>, next: NextFunction){
	try {
		const cursor = await findBonusesByName(req.params.name);
		const results = await cursor.toArray();
		if(results.length === 0){
			res.json([]);
		}
		res.json(results);
	} catch (error) {
		next(error);
	}
}

export async function updateBonusHandler(req: Request<ParamId, Bonus, Bonus>, res: Response<Bonus>, next: NextFunction){
	try {
		const id = parseInt(req.params.id);
		const result = await updateBonus(id, {...req.body}, {returnDocument: 'after', upsert: true});
		if(!result.value){
			res.sendStatus(404);
			return;
		}
		res.json(result.value);
	} catch (error) {
		next(error);
	}
}

export async function deleteBonusHandler(req: Request<ParamId, {}, Bonus>, res: Response<{}>, next: NextFunction){
	try {
		const id = parseInt(req.params.id);
		const result = await deleteBonus(id);
		if(!result.value){
			res.sendStatus(404);
			return;
		}
		res.json(result);
	} catch (error) {
		next(error);
	}
}


