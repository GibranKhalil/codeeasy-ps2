import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar"
import { Button } from "@/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/card"
import { ArrowRight, ExternalLink, Heart } from "lucide-react"
import Link from "next/link"

const DevelopersSupportCard = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Doe para nossos PS2 Developers</CardTitle>
                <CardDescription>
                    Apoie diretamente os desenvolvedores talentosos que criam jogos, ferramentas e recursos para o PS2.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <h3 className="text-sm font-medium mb-4">Desenvolvedores em destaque</h3>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* {mockFeaturedDevelopers.map((developer) => (
                        <Card key={developer.id} className="overflow-hidden">
                            <CardHeader className="pb-2">
                                <div className="flex items-center space-x-3">
                                    <Avatar>
                                        <AvatarImage src={developer.avatar_url} />
                                        <AvatarFallback>{developer.username.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg">{developer.username}</CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-2">
                                <p className="text-sm text-muted-foreground line-clamp-2">{developer.bio}</p>
                                <h4 className="text-xs font-medium mt-3 mb-1">Projetos notáveis:</h4>
                                <ul className="text-xs space-y-1 ml-4 list-disc">
                                    {developer.projects.map((project, index) => (
                                        <li key={index}>{project}</li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter className="pt-2">
                                <Button variant="outline" className="w-full" asChild>
                                    <a href={developer.donation_url} target="_blank" rel="noopener noreferrer">
                                        <Heart className="h-4 w-4 mr-2 text-red-500" />
                                        Suporte
                                        <ExternalLink className="h-3 w-3 ml-1" />
                                    </a>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))} */}
                </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-6">
                <Button variant="link" asChild>
                    <Link href="/ranking">
                        Veja todos os desenvolvedores de nossa comunidade
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default DevelopersSupportCard