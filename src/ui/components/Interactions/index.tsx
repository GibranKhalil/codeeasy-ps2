import { InteractionCardProps } from "./@types/props"

export const InteractionCard = ({ icon, value, className }: InteractionCardProps) => {
    return (
        <article className={`bg-dark-3 text-dark-12 flex items-center gap-1 px-1 py-[2px] rounded-sm text-xs ${className}`}>
            <i>{icon}</i>
            <p>{value}</p>
        </article>
    )
}