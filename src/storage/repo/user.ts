import { IUser } from "../../models/Users";

export interface IUserAllResponse {
    payloads: IUser[],
    count: number
}

export interface UserRepo {
    create(payload: IUser): Promise<IUser>
    update(id: string, payload: IUser | Object, lang: string): Promise<IUser>
    delete(id: string, lang: string): Promise<IUser>
    findOne(query: Object, lang: string): Promise<IUser>
    find(query: Object): Promise<IUser[]>
}