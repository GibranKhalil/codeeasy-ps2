import { useNavigate } from "react-router-dom"
import type { SnippetCardProps } from "./@types/props"
import SmallViewContent from "./views/smallView"
import NormalViewContent from "./views/normalView"

export const SnippetCard = ({
  title,
  description,
  likes,
  views,
  last_update,
  last_modifier,
  engine,
  pid,
  smallerView
}: SnippetCardProps) => {
  const navigateTo = useNavigate()

  const handleCardClick = () => {
    navigateTo(`/snippet/${pid}`)
  }

  return (
    <article
      onClick={handleCardClick}
      className="bg-dark-2 relative rounded-lg cursor-pointer flex flex-col justify-between overflow-hidden group border border-dark-6"
    >
      {smallerView ? (
        <SmallViewContent
          title={title}
          views={views}
          last_update={last_update}
          last_modifier={last_modifier}
        />
      ) : (
        <NormalViewContent
          description={description}
          title={title}
          views={views}
          likes={likes}
          last_update={last_update}
          last_modifier={last_modifier}
          engine={engine}
        />
      )}
    </article>
  )
}