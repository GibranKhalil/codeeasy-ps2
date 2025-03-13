import type { SnippetCardProps } from "../@types/props"

const ViewsInfo = ({ views, last_update }: Pick<SnippetCardProps, "views" | "last_update">) => (
    <div className="flex items-center text-dark-11 text-xs">
        <span>{views} visualizações</span>
        <span className="mx-1">•</span>
        <span>{last_update}</span>
    </div>
)

export default ViewsInfo