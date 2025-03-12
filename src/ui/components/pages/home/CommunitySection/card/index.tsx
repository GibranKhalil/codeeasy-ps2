import { Button } from "../../../../Button/Button"
import { CommunitySectionCardProps } from "./@types/props"

export const CommunitySectionCard = ({ description, image, name }: CommunitySectionCardProps) => {
    return (
        <div className="bg-dark-2 p-6 rounded-lg w-full h-full">
            <div className="flex flex-col justify-center items-center gap-4 h-full">
                <img src={image} alt={name} className="w-12 h-12 rounded-full" />
                <div className="text-center">
                    <h3 className="text-dark-12 font-semibold">{name}</h3>
                    <p className="text-dark-11 text-sm">{description}</p>
                </div>
                <Button variant='contained' color='primary' className="w-full max-w-96 mt-6">
                    Acessar Canal
                </Button>
            </div>
        </div>
    )
}