import nodemailer from 'nodemailer';



export function generateCode (): string {
    let result: string = ""
    let randomNum = Math.floor(Math.random() * 3)
    let simvol = Math.floor(Math.random() * (39 - 35) + 35);
    let bigLetter = Math.floor(Math.random() * (87 - 65) + 65);
    let smallLetter = Math.floor(Math.random() * (118 - 97) + 97);
    let number = Math.floor(Math.random() * (54 - 48) + 48);
    
    result = String.fromCharCode(bigLetter) + String.fromCharCode(smallLetter) + String.fromCharCode(simvol) + String.fromCharCode(number) + String.fromCharCode(bigLetter + randomNum) + String.fromCharCode(simvol + randomNum) + String.fromCharCode(number + randomNum) + String.fromCharCode(smallLetter + randomNum);

    return result
}



export async function sendMessage (email: string, message: string) {

    const transporter = nodemailer.createTransport({
        service: 'mail.ru',
        auth: {
            user: "donishmand23@mail.ru",
            pass: "~pY`H9%q(&3TRcP"
        }
    });

    const mailOptions = {
        from: "donishmand23@mail.ru",
        to: email,
        subject: "Verification Code",
        html: message
    }
    
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err)
        } 
    });
}




