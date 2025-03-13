import TextUtils from "../../../../../../utils/TextUtils"
import type { SnippetCardProps } from "../@types/props"
import SnippetImage from "../components/snippetImage"
import ViewsInfo from "../components/viewsInfo"

const SmallViewContent = ({ title, views, last_update, last_modifier }: Pick<SnippetCardProps, "title" | "views" | "last_update" | "last_modifier">) => (
    <div className="flex items-center">
        <SnippetImage url="https://img.logo.dev/playstation.com" isSmall={true} />
        <div className="w-2/3 flex flex-col gap-1">
            <h3 className="text-dark-12 font-medium text-sm">{TextUtils.truncatedText(title, 45)}</h3>
            <div className="flex flex-col gap-1">
                <div className="flex items-center text-xs text-dark-11">
                    <p>{last_modifier.name}</p>
                </div>
                <ViewsInfo views={views} last_update={last_update} />
            </div>
        </div>
    </div>
)

export default SmallViewContent