import { UserRepo } from "../repo/user";
import User, { IUser } from "../../models/Users";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";

export class UserStorage implements UserRepo {
    private scope = "storage.user"

    async find(query: Object): Promise<IUser[]> {
        try {
            let users = await User.find(query);

            return users;
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`);
            throw error;
        }
    }

    async findOne(query: Object): Promise<IUser> {
        try {
            let user = await User.findOne(query)

            if(!user) {
                logger.warn(`${this.scope}.get failed to findOne`);
                throw new AppError(404, "User is not found");
            }

            return user;
        } catch (error){
            logger.error(`${this.scope}.find: finished with error: ${error}`);
            throw error;
        }
    }

    async create(payload: IUser): Promise<IUser> {
        try {
            let user = await User.create(payload);

            return user;
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`);
            throw error;
        }
    }

    async update(id: string, payload: IUser | Object): Promise<IUser> {
        try {
            let user = await User.findByIdAndUpdate(id, payload);

            if(!user) {
                logger.warn(`${this.scope}.get failed to Update`);
                throw new AppError(404, "User is not found");
            }
            
            return user;
        }catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`);
            throw error;
        }
    }

    async delete(id: string): Promise<IUser> {
        try {
            let user = await User.findByIdAndDelete(id);

            if(!user) {
                logger.warn(`${this.scope}.get failed to Delete`);
                throw new AppError(404, "User is not found");
            }

            return user;
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`);
            throw error;
        }
    }
}