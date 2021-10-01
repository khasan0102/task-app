import bcrypt from "bcrypt";

export const generateCrypt = (data: string) => {
    let salt = bcrypt.genSaltSync(10);
    let crypt = bcrypt.hashSync(data, salt);
    return crypt
}

export function checkCrypt(data: string, hash: string) {
    return bcrypt.compareSync(data, hash);
}