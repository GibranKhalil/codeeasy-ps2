import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "../card"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "../badge"
import { Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../avatar"
import { Tutorial } from "@/data/@types/models/tutorials/entities/tutorial.entity"

export interface TrainingCardProps {
    tutorial: Tutorial
}

export const TutorialCard = ({ tutorial }: TrainingCardProps) => {

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
                <Link href={`/tutorials/${tutorial.pid}`} className="h-full flex flex-col">
                    <div className="relative h-40 w-full">
                        <Image
                            src={tutorial.coverImage_url || "/placeholder.svg"}
                            alt={tutorial.title}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <Badge className="absolute bottom-3 left-3 bg-primary/80 hover:bg-primary/80">
                            {tutorial.category.name}
                        </Badge>
                    </div>
                    <CardContent className="p-4 flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="mr-1 h-4 w-4" />
                                {tutorial.readTime} Minutos de Leitura
                            </div>
                        </div>
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{tutorial.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">{tutorial.excerpt}</p>
                    </CardContent>
                    <CardFooter className="p-4 border-t">
                        <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={tutorial.creator.avatarUrl} />
                                <AvatarFallback>{tutorial.creator.username.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{tutorial.creator.username}</span>
                        </div>
                    </CardFooter>
                </Link>
            </Card>
        </motion.div>
    )
}