import { Request, Response, NextFunction } from "express";
import { createUser, findUserByName } from "./users.service";
import { User } from "./users.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from "axios";
import dotenv from 'dotenv';

dotenv.config()

export async function getSteamUserHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const { steamid } = req.query;

		const result = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2?key=${process.env.STEAM_API_KEY}&steamids=${steamid}`);

		res.json(result.data)

	} catch (error) {
		next(error)
	}
}

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

