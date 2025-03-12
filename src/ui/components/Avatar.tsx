interface AvatarProps {
    name: string,
    img: string,
    displayName?: boolean,
    date?: string,
    imgSize?: string
}

export const Avatar = ({ displayName = false, img, name, date, imgSize = 'max-w-8' }: AvatarProps) => {
    return (
        <div className="flex items-center gap-2">
            <img className={`${imgSize} rounded-full`} src={img} alt={name} />
            {displayName &&
                <div>
                    <p>{name}</p>
                    {date && <p className="text-xs text-dark-11">{date}</p>}
                </div>}
        </div>
    )
}