import { AvatarProps } from "./@types/props"

export const Avatar = ({ displayName = false, img, name, date, imgSize = 'max-w-8' }: AvatarProps) => {
    return (
        <div className="flex items-center gap-2 w-full">
            <img className={`${imgSize} rounded-full`} src={img} alt={name} />
            {displayName &&
                <div className="w-full">
                    <p title={name} className="text-dark-12 font-medium leading-5 truncate max-w-[72%]">{name}</p>
                    {date && <p className="text-xs text-dark-11">{date}</p>}
                </div>}
        </div>
    )
}