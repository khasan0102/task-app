import { ISample } from "../../models/Sample"

export interface ISampleAllResponse {
    payloads: ISample[]
    count: number
}

export interface SampleRepo {
    create(payload: ISample): Promise<ISample>
    update(id: string, payload: ISample): Promise<ISample>
    delete(id: string): Promise<any>
    find(query: Object): Promise<ISample[]>
    findOne(query: Object): Promise<ISample>
    findById(id: string): Promise<ISample>
}
