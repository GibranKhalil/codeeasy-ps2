import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/card"
import { ArrowRight, Bitcoin, CreditCard, Github, Heart } from "lucide-react"
import { useState } from "react"

const PlataformSupportCard = () => {

    const [donationAmount, setDonationAmount] = useState("10")

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "credit-card":
                return <CreditCard className="h-5 w-5" />
            case "github":
                return <Github className="h-5 w-5" />
            case "bitcoin":
                return <Bitcoin className="h-5 w-5" />
            case "heart":
                return <Heart className="h-5 w-5" />
            default:
                return <CreditCard className="h-5 w-5" />
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Doe para o PS2 Hub</CardTitle>
                <CardDescription>
                    Sua contribuição nos ajuda a manter o site, hospedar arquivos, desenvolver novos recursos e organizar
                    eventos comunitários.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <h3 className="text-sm font-medium">Selecione um valor</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {["5", "10", "25", "50"].map((amount) => (
                            <Button
                                key={amount}
                                variant={donationAmount === amount ? "default" : "outline"}
                                onClick={() => setDonationAmount(amount)}
                            >
                                R$ {amount}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-sm font-medium">Métodos de pagamentos</h3>
                    <div className="grid gap-4">
                        {/* {mockDonationMethods.map((method) => (
                            <Card key={method.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                                <CardContent className="p-4 flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                                        {getIcon(method.icon)}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium">{method.name}</h4>
                                        <p className="text-sm text-muted-foreground">{method.description}</p>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))} */}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start space-y-4 border-t pt-6">
                <h3 className="text font-semibold">Para onde vai sua doação</h3>
                <div className="grid gap-3 w-full">
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Custos do Servidor</span>
                        <Badge variant="secondary">40%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Desenvolvimento e Manutenção</span>
                        <Badge variant="secondary">30%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Eventos da Comunidade</span>
                        <Badge variant="secondary">20%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Documentação</span>
                        <Badge variant="secondary">10%</Badge>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

export default PlataformSupportCard