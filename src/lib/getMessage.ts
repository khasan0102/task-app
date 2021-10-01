const { data } = require("./messages.json");

export function getMessage(query: Object, language: string): string {
    for (let el of data) {
        let message = el as { [filedname: string]: string | number }
        let object = query as { [filedname: string]: string }
        let result = el as { text: { [filedname: string]: string } }
        let count = 0
        let counter = 0

        for (let key in query) {
            if (message[key] == object[key]) counter++
            count++
        }
        if (counter == count) return result.text[language]
    }

    return ""
}
