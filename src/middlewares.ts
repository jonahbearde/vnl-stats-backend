import { NextFunction, Request, Response } from 'express';
import RequestValidators from './interfaces/RequestValidators';
import ErrorResponse from './interfaces/ErrorResponse';
import { ZodError } from 'zod';
import { Role } from './interfaces/Role';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function notFound(req: Request, res: Response, next: NextFunction) {
	res.status(404);
	const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
	next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// if you pass err to next function, this handler is gonna be called?
export function errorHandler(err: Error, req: Request, res: Response<ErrorResponse>, next: NextFunction) {
	const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
	res.status(statusCode);
	res.json({
		message: err.message,
		stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
	});
}



export function validateRequest(validators: RequestValidators) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			// console.log('at least show up in here');
			// put it back on to body when validation is done
			if (validators.body) {
				// parse an object from json?
				req.body = await validators.body.parseAsync(req.body);
			}
			if (validators.params) {
				req.params = await validators.params.parseAsync(req.params);
			}
			if (validators.query) {
				req.query = await validators.query.parseAsync(req.query);
			}
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				//unprocessable error
				console.log('zod error?', error.message);
				res.status(422);
			}
			next(error);
		}
	}
}

export function deserializeUser(req: Request, res: Response, next: NextFunction) {
	const header = req.headers.authorization ?? ' '
	const [tokenType, token] = header.split(' ')

	if (tokenType !== 'Bearer') {
		return next();
	}

	if (!token) {
		return next();
	}
	const user = jwt.verify(token, process.env.SECRET as string);

	if (user) {
		res.locals.user = user;
		return next();
	}

	return next();
};


export const requireUser = (requiredRole: Role) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const user = res.locals.user;
		
		if (!user) {
			res.sendStatus(403);
			return;
		}

		if (user.role === 'Elon') return next();

		if (user.role === 'Admin') {
			if (requiredRole === 'Elon') {
				res.sendStatus(403);
				return;
			} else {
				return next();
			}
		}

		if (user.role === 'User') {
			if (requiredRole === user.role) {
				return next();
			} else {
				res.sendStatus(403);
				return;
			}
		}
	}
}


