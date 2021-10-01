import { OTPRepo } from "../repo/otp";
import OTP, { IOTP } from "../../models/OTP";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";


export class OTPStorage implements OTPRepo {
    private scope = "storage.otp";

    async create(payload: IOTP): Promise<IOTP> {
        try {
            let otp = await OTP.create(payload);

            return otp;
        }catch (error){
            logger.error(`${this.scope}.find: finished with error: ${error}`);
            throw error;
        }
    }

    async findOne(query: Object): Promise<IOTP> {
        try {
            let otps = await OTP.find(query);

            return otps[0]
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`);
            throw error;
        }
    }
}