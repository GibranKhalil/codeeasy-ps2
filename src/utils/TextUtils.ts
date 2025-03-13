export default class TextUtils{

    static truncatedText(text: string, length: number){
        if(text.length > length){
            return `${text.substring(0, length)}...`
        }
        return text
    }
}