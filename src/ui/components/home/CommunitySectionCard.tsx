import { Button } from "../Button"

interface CommunitySectionCardProps{
    image: string,
    name: string,
    description: string
}

export const CommunitySectionCard = ({description, image, name}: CommunitySectionCardProps) => {
    return(
    <div className="bg-dark-secondary p-6 rounded-lg w-full h-full">
        <div className="flex flex-col justify-center items-center gap-4 h-full">
            <img src={image} alt={name} className="w-12 h-12 rounded-full" />
            <div className="text-center">
                <h3 className="text-light-gray font-semibold">{name}</h3>
                <p className="text-neutral-gray text-sm">{description}</p>
            </div>
            <Button className="w-full max-w-96 mt-6">
                Acessar Canal
            </Button>
        </div>
      </div>
    )
}