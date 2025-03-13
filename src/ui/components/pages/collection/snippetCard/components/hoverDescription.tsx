import TextUtils from "../../../../../../utils/TextUtils"
import type { SnippetCardProps } from "../@types/props"

const HoverDescription = ({ description }: Pick<SnippetCardProps, "description">) => (
  <div className="absolute inset-0 bg-dark-2 bg-opacity-75 opacity-0 group-hover:opacity-100 flex items-center justify-center p-4 transition-opacity duration-300">
    <p className="text-dark-11 text-sm text-left">{TextUtils.truncatedText(description, 255)}</p>
  </div>
)

export default HoverDescription