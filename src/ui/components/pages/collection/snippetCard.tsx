import { useNavigate } from "react-router-dom"
import { Avatar } from "../../Avatar"
import { SnippetCardProps } from "./@types/props"
import { InteractionCard } from "../../Interactions"
import { Eye, Heart } from "lucide-react"

export const SnippetCard = ({ title, description, likes, views, last_update, last_modifier, engine, pid }: SnippetCardProps) => {
  const navigateTo = useNavigate()
  return (
    <article
      onClick={() => navigateTo(`/snippet/${pid}`)}
      className="bg-dark-2 relative rounded-lg cursor-pointer flex flex-col justify-between overflow-hidden group border border-dark-6"
    >
      <div className="relative max-h-48 overflow-hidden">
        <img loading="lazy" className="object-center object-cover w-full group-hover:brightness-50 duration-300" src={`https://img.logo.dev/playstation.com`} alt="picture" />
        <div className="absolute inset-0 bg-dark-2 bg-opacity-75 opacity-0 group-hover:opacity-100 flex items-center justify-center p-4 transition-opacity duration-300">
          <p className="text-dark-11 text-sm text-left">{description}</p>
        </div>
      </div>

      <footer className="px-4 py-3 border-t-dark-6 border-t bg-dark-2">
        <div className="flex items-center justify-between gap-2">
          <div className="w-9/12">
            <Avatar img={`${last_modifier.github}.png`} name={title} date={last_update} displayName />
          </div>
          <p className="text-dark-11 text-xs">{engine}</p>
        </div>

        <div className="flex items-center space-x-4 mt-2 h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 overflow-hidden">
          <InteractionCard icon={<Eye className="text-dark-12" size={16} fillRule="evenodd" />} value={Number(views)} />
          <InteractionCard icon={<Heart fill="#d63941" className="text-accent-red-10" size={16} fillRule="evenodd" />} value={Number(likes)} />
        </div>
      </footer>
    </article>
  )
}
