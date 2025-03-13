const SnippetImage = ({ url, isSmall = false }: { url: string, isSmall?: boolean }) => (
    <div className={isSmall ? "w-1/3 mr-4" : "relative max-h-48 overflow-hidden"}>
        <img
            loading="lazy"
            className={`object-center object-cover w-full ${isSmall ? "h-24 rounded-l-md" : "group-hover:brightness-50 duration-300"}`}
            src={url}
            alt="snippet preview"
        />
    </div>
)

export default SnippetImage
