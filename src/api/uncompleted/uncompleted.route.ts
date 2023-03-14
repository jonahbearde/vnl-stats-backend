import { Router } from "express";
import { ParamId } from "../../interfaces/ParamId";
import { ParamUncType } from "../../interfaces/ParamUncType";
import { requireUser, validateRequest } from "../../middlewares";
import * as UncompletedsHandlers from "./uncompleted.controller";
import { Uncompleted } from "./uncompleted.model";

const router = Router();

router.post(
	'/',
	requireUser('Admin'),
	validateRequest({
		body: Uncompleted
	}),
	UncompletedsHandlers.createUncompletedHandler
)

router.get(
	'/',
	UncompletedsHandlers.getAllUncompletedsHandler
)

router.get(
	'/type/:type',
	validateRequest({
		params: ParamUncType
	}),
	UncompletedsHandlers.getUncompletedsOfTypeHandler
)

router.put(
	'/:id',
	requireUser('Admin'),
	validateRequest({
		params: ParamId,
		body: Uncompleted
	}),
	UncompletedsHandlers.updateUncompletedHandler
)

router.delete(
	'/:id',
	requireUser('Admin'),
	validateRequest({
		params: ParamId
	}),
	UncompletedsHandlers.deleteUncompletedHandler
)

export default router;