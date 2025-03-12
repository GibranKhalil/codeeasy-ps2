import type { EngineSectionCardProps } from "./@types/props"

export const EngineSectionCard = ({ description, number, title }: EngineSectionCardProps) => {
    return (
        <div className="bg-dark-2 p-8 rounded-lg h-full">
            <div className="bg-primary-3--dark max-w-12 flex justify-center items-center aspect-square rounded-md font-bold mb-4">
                <p className="text-2xl text-primary-9--dark">{number}</p>
            </div>
            <h3 className="text-dark-12 text-xl font-semibold mb-4">{title}</h3>
            <p className="text-dark-11">{description}</p>
        </div>
    )
}