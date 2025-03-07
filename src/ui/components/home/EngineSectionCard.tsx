interface EngineSectionCardProps{
    number: number
    title: string
    description: string
}

export const EngineSectionCard = ({description, number, title}: EngineSectionCardProps) => {
    return(
        <div className="bg-dark-secondary p-8 rounded-lg h-full">
        <div className="bg-primary-20 max-w-12 flex justify-center items-center aspect-square rounded-md font-bold mb-4">
        <p className="text-2xl text-primary">{number}</p>
        </div>
        <h3 className="text-light-gray text-xl font-semibold mb-4">{title}</h3>
        <p className="text-neutral-gray">{description}</p>
      </div>
    )
}