import { SampleStorage } from "./mongo/sample";
import { UserStorage } from "./mongo/user";
import { OTPStorage } from "./mongo/otp";

interface IStorage {
    sample: SampleStorage
    user: UserStorage
    otp: OTPStorage
}

export let storage: IStorage = {
    sample: new SampleStorage(),
    user: new UserStorage(),
    otp: new OTPStorage()
}
