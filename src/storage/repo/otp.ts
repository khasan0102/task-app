import { IOTP } from "../../models/OTP";

export interface IOPTAllReponse {
    payloads: IOTP[],
    count: number 
}

export interface OTPRepo {
    create(payload: IOTP): Promise<IOTP>
    findOne(query: IOTP): Promise<IOTP>
}