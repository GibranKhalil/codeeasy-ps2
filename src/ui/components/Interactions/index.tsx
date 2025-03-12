import { InteractionCardProps } from "./@types/props"

export const InteractionCard = ({ icon, value }: InteractionCardProps) => {
    return (
        <article className="bg-dark-3 flex items-center gap-1 px-1 py-[2px] rounded-sm">
            <i>{icon}</i>
            <p className="text-dark-12 text-xs">{value}</p>
        </article>
    )
}