import { Request, Response, NextFunction } from "express";
import { ParamId } from "../../interfaces/ParamId";
import { Resource, ResourceWithId } from "./resources.model";
import { createResource, deleteResource, findAllResources, updateResource } from "./resources.service";

export async function createResourceHandler(req: Request<{}, ResourceWithId, Resource>, res: Response<ResourceWithId>, next: NextFunction) {
	try {
		const body = req.body;
		const createResult = await createResource({...body});
		if(!createResult.acknowledged) throw new Error('error creating a resource');
		res.status(201);
		res.json({
			_id: createResult.insertedId,
			...body
		})
	} catch (error) {
		next(error);
	}	
}


export async function getAllResourcesHandler(req: Request<{}, Resource[]>, res: Response<Resource[]>, next: NextFunction){
	try {
		const cursor = await findAllResources();
		const results = await cursor.toArray();
		if(results.length === 0){
			res.status(404);
			throw new Error('error finding all resources');
		}
		res.json(results);
	} catch (error) {
		next(error);
	}
}

export async function updateResourceHandler(req: Request<ParamId, Resource, Resource>, res: Response<Resource>, next: NextFunction){
	try {
		const id = parseInt(req.params.id);
		const result = await updateResource(id, {...req.body}, {returnDocument: 'after', upsert: true});
		if(!result.value){
			res.sendStatus(404);
			return;
		}
		res.json(result.value);
	} catch (error) {
		next(error);
	}
}

export async function deleteResourceHandler(req: Request<ParamId, {}, Resource>, res: Response<{}>, next: NextFunction){
	try {
		const id = parseInt(req.params.id);
		const result = await deleteResource(id);
		if(!result.value){
			res.sendStatus(404);
			return;
		}
		res.json(result);
	} catch (error) {
		next(error);
	}
}


