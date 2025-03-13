import { Snippet } from "../../../../../../@types/collection";

export interface SnippetCardProps extends Pick<Snippet, 'title' | 'description' | 'last_modifier' | 'last_update' | 'engine' | 'pid' | 'views' | 'likes'>{
    smallerView?: boolean
}