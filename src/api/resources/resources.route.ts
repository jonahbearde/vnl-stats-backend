import { Router } from "express";
import { ParamId } from "../../interfaces/ParamId";
import { requireUser, validateRequest } from "../../middlewares";
import * as ResourcesHandlers from "./resources.controller";
import { Resource } from "./resources.model";

const router = Router();

router.post(
	'/',
	requireUser('Admin'),
	validateRequest({
		body: Resource
	}),
	ResourcesHandlers.createResourceHandler
)

router.get(
	'/',
	ResourcesHandlers.getAllResourcesHandler
)

router.put(
	'/:id',
	requireUser('Admin'),
	validateRequest({
		params: ParamId,
		body: Resource
	}),
	ResourcesHandlers.updateResourceHandler
)

router.delete(
	'/:id',
	requireUser('Admin'),
	validateRequest({
		params: ParamId
	}),
	ResourcesHandlers.deleteResourceHandler
)

export default router;