import { Router } from "express";
import { requireUser, validateRequest } from "../../middlewares";
import { User } from "./users.model";
import * as UserHandlers from './users.controller';

const router = Router();

router.post(
	'/',
	requireUser('Elon'),
	validateRequest({
		body: User
	}),
	UserHandlers.createUserHandler
)

router.post(
	'/signup',
	UserHandlers.signUpHandler
)

router.post(
	'/login',
	UserHandlers.loginHandler
)

router.get(
	'/:name',
	UserHandlers.getUserByNameHandler
)

// router.get(
// 	'/steamid/:id',
// 	UserHandlers.validateSteamIdHandler
// )

export default router;