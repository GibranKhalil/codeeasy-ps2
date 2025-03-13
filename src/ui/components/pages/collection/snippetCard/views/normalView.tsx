import { Eye, Heart } from "lucide-react"
import { InteractionCard } from "../../../../Interactions"
import Avatar from "../../../../Avatar"
import SnippetImage from "../components/snippetImage"
import HoverDescription from "../components/hoverDescription"
import type { SnippetCardProps } from "../@types/props"

const NormalViewContent = ({ description, title, views, likes, last_update, last_modifier, engine }: Pick<SnippetCardProps, "description" | "title" | "views" | "likes" | "last_update" | "last_modifier" | "engine">) => (
    <>
        <div className="relative max-h-48 overflow-hidden">
            <SnippetImage url="https://img.logo.dev/playstation.com" />
            <HoverDescription description={description} />
        </div>
        <footer className="px-4 py-3 border-t-dark-6 border-t bg-dark-2">
            <div className="flex items-center justify-between gap-2">
                <div className="w-9/12">
                    <Avatar
                        img={`${last_modifier.github}.png`}
                        name={title}
                        date={last_update}
                        displayName
                    />
                </div>
                <p className="text-dark-11 text-xs">{engine}</p>
            </div>
            <div className="flex items-center space-x-4 mt-2 h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 overflow-hidden">
                <InteractionCard icon={<Eye className="text-dark-12" size={16} />} value={Number(views)} />
                <InteractionCard icon={<Heart className="text-dark-12" size={16} />} value={Number(likes)} />
            </div>
        </footer>
    </>
)

export default NormalViewContent