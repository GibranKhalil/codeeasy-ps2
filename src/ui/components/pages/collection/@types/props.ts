import { Snippet } from "../../../../../@types/collection";

export type SnippetCardProps = Pick<Snippet, 'title' | 'description' | 'last_modifier' | 'last_update' | 'engine' | 'pid' | 'views' | 'likes'>