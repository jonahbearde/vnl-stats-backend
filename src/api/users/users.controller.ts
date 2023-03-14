import { Request, Response, NextFunction } from "express";
import { createUser, findUserByName } from "./users.service";
import { User } from "./users.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

// import SteamID from "steamid";

// export async function validateSteamIdHandler(req: Request, res: Response, next: NextFunction) {
// 	const sid = new SteamID(req.params.id);

// 	if (sid.isValidIndividual()) {
// 		res.json({ steamid64: sid.getSteamID64() });
// 	} else {
// 		res.json(null);
// 	}
// }

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const { name, password } = req.body;
		const user = await findUserByName(name);
		if (!user) {
			res.status(400).send({ message: 'incorrect user or password' });
			return;
		}
		if (await bcrypt.compare(password, user.password)) {
			const token = jwt.sign(user, process.env.SECRET as string);
			res.json({
				token,
				id: user.id,
				name: user.name,
				role: user.role
			});
		} else {
			res.status(400).send({ message: 'incorrect user or password' });
		}
	} catch (error) {
		next(error);
	}
}


export async function createUserHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const user = req.body;
		const hashedPw = await bcrypt.hash(user.password, 10);
		user.password = hashedPw;
		const createResult = await createUser(user);
		if (!createResult.acknowledged) throw new Error('Error inserting a user');
		res.json({
			_id: createResult.insertedId,
			id: user.id,
			name: user.name,
			role: user.role,
		});
	} catch (error) {
		next(error);
	}
}

export async function signUpHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const { id, name, password } = req.body;
		const hashedPw = await bcrypt.hash(password, 10);
		const userToInsert: User = {
			id,
			name,
			password: hashedPw,
			role: "User"
		}
		const createResult = await createUser(userToInsert);
		if (!createResult.acknowledged) throw new Error('Error inserting a user');
		const token = jwt.sign(userToInsert, process.env.SECRET as string);
		res.json({
			_id: createResult.insertedId,
			token,
			id,
			name,
			role: userToInsert.role
		})
	} catch (error) {
		next(error);
	}
}

export async function getUserByNameHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const name = req.params.name;
		const user = await findUserByName(name);
		if (!user) {
			res.json(null);
			return;
		}
		res.json({ name: user.name })
	} catch (error) {
		next(error);
	}
}

