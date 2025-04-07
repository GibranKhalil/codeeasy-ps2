import { Button } from "@/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card"
import { Input } from "@/components/input"
import { Textarea } from "@/components/textarea"
import { User as UserEntity } from "@/data/@types/models/users/entities/user.entity"
import { userService } from "@/data/services/users/users.service"
import { Label } from "@radix-ui/react-label"
import { Separator } from "@radix-ui/react-separator"
import { CodeXml, CodeXmlIcon, Github, Globe, Linkedin, Loader2, Mail, Save, Twitter, User } from "lucide-react"
import { useReducer, useState } from "react"

interface SettingsPageProps {
    id: number,
    email: string,
    username: string,
    profile: Pick<UserEntity, "bio"> & { website?: string, linkedin?: string, github?: string, dailyDev?: string, twitter?: string }
}

export const SettingsPage = ({ id, email, profile, username }: SettingsPageProps) => {

    const profileSettingsInitialData: typeof profile = profile
    type ProfileSettingsAction =
        | { type: "SET_FIELD"; field: keyof typeof profileSettingsInitialData; value: string }
        | { type: "RESET" };

    const profileSettingsReducer = (state: typeof profileSettingsInitialData, action: ProfileSettingsAction): typeof profileSettingsInitialData => {
        switch (action.type) {
            case "SET_FIELD":
                return { ...state, [action.field]: action.value };
            case "RESET":
                return profileSettingsInitialData;
            default:
                return state;
        }
    };

    const [profileSettings, setProfileSettings] = useReducer(profileSettingsReducer, profileSettingsInitialData)
    const [isSaving, setIsSaving] = useState<boolean>(false)

    const handleSaveProfile = async () => {
        setIsSaving(true)
        const response = await userService.update(id, { ...profileSettings }, { requiresAuth: true })
        setIsSaving(false)
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Configurações de Perfil</CardTitle>
                    <CardDescription>Atualizar as informações e preferências do seu perfil</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="bio">Biografia</Label>
                        <Textarea
                            id="bio"
                            value={profileSettings.bio || ""}
                            onChange={(e) => setProfileSettings({ field: "bio", type: "SET_FIELD", value: e.target.value })}
                            className="min-h-[100px]"
                            placeholder="Conte-nos sobre você e seus projetos homebrew PS2"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="website"
                                    value={profileSettings.website || ""}
                                    onChange={(e) => setProfileSettings({ field: "website", type: "SET_FIELD", value: e.target.value })}
                                    className="pl-10"
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <div className="relative">
                                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="linkedin"
                                    value={profileSettings.linkedin || ""}
                                    onChange={(e) => setProfileSettings({ field: "linkedin", type: "SET_FIELD", value: e.target.value })}
                                    className="pl-10"
                                    placeholder="https://www.linkedin.com/in/example"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="github">GitHub</Label>
                            <div className="relative">
                                <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="github"
                                    value={profileSettings.github || ""}
                                    onChange={(e) => setProfileSettings({ field: "github", type: "SET_FIELD", value: e.target.value })}
                                    className="pl-10"
                                    placeholder="https://github.com/example"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="twitter">Twitter</Label>
                            <div className="relative">
                                <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="twitter"
                                    value={profileSettings.twitter || ""}
                                    onChange={(e) => setProfileSettings({ field: "twitter", type: "SET_FIELD", value: e.target.value })}
                                    className="pl-10"
                                    placeholder="https://x.com/example"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dailyDev">Daily.Dev</Label>
                            <div className="relative">
                                <CodeXml className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="dailyDev"
                                    value={profileSettings.dailyDev || ""}
                                    onChange={(e) => setProfileSettings({ field: "dailyDev", type: "SET_FIELD", value: e.target.value })}
                                    className="pl-10"
                                    placeholder="https://app.daily.dev/example"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={handleSaveProfile} disabled={isSaving}>
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Salvar
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setProfileSettings({ type: "RESET" })}
                            disabled={isSaving}
                        >
                            Cancelar
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Configurações da Conta</CardTitle>
                    <CardDescription>Gerenciar as preferências e a segurança da sua conta</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="email" type="email" value={email} disabled className="pl-10" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Para alterar seu endereço de e-mail, entre em contato com o suporte
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="username">Usuário</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="username" value={username} disabled className="pl-10" />
                        </div>
                        <p className="text-xs text-muted-foreground">O nome de usuário não pode ser alterado após a criação da conta</p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">Zona Perigosa</h3>
                        <p className="text-sm text-muted-foreground">
                            Essas ações são irreversíveis. Por favor, proceda com cautela.
                        </p>
                        <Button variant="destructive">Excluir Conta</Button>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}