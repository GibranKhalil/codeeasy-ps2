import { motion } from "framer-motion"
import { Download, User } from "lucide-react"
import { Card, CardContent, CardFooter } from "../card"
import { Badge } from "../badge"
import Link from "next/link"
import { Game } from "@/data/@types/models/games/entities/game.entity"
import Image from "next/image"

export interface GameCardProps {
    game: Game
}

export const GameCard = ({ game }: GameCardProps) => {

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    }

    return (
        <motion.div variants={cardVariants}>
            <Card className="overflow-hidden h-full flex flex-col cursor-pointer transition-all hover:shadow-md">
                <Link href={`/games/${game.pid}`} className="h-full flex flex-col">
                    <div className="relative h-40 w-full">
                        <Image
                            src={game.coverImage_url || "/placeholder.svg"}
                            alt={game.title}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <Badge className="absolute bottom-3 left-3 bg-primary/80 hover:bg-primary/80">
                            {game.category.name}
                        </Badge>
                    </div>
                    <CardContent className="p-4 flex-1">
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{game.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">{game.description}</p>
                        <div className="flex items-center justify-between mt-4 text-sm">
                            <div className="flex items-center text-muted-foreground">
                                <User className="mr-1 h-4 w-4" />
                                {game.creator.username}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <Download className="mr-1 h-4 w-4" />
                                {game.downloads.toLocaleString()}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="p-4 border-t">
                        <div className="flex items-center justify-between w-full">
                            <span className="text-xs text-muted-foreground">v{game.version}</span>
                            <span className="text-xs text-muted-foreground">{game.fileSize}MB</span>
                        </div>
                    </CardFooter>
                </Link>
            </Card>
        </motion.div>
    )
}