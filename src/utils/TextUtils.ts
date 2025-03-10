export class TextUtils{

    static truncatedText(text: string, length: number){
        return `${text.substring(0, length)}...`
    }
}