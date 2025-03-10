import { Modifier } from "../modifier"

interface HowToUseSteps{
    step: number,
    title: string,
    description: string
}

interface CanUseWith{
    link: string,
    name: string
}

export interface Snippet{
    id: number,
    pid: string, //**md5(title+id=${id}) */
    title: string,
    description: string
    link: string
    last_update: string,
    last_modifier: Modifier,
    modifiers: Modifier[],
    how_to_use_description: string
    how_to_use_steps: HowToUseSteps[],
    engine?: string,
    tags: string[]
    can_use_with?: CanUseWith[] 
}