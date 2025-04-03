import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar"
import { Button } from "@/components/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/dialog"
import { Label } from "@/components/label"
import { User } from "@/components/user"
import { userService } from "@/data/services/users/users.service"
import { useAuth } from "@/hooks/use-auth"
import { ImageIcon, Loader2, Save } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"

export interface EditProfileDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: VoidFunction;
    onOpenChange: (open: boolean) => void;
    initialData?: ProfileData;
}

export interface ProfileData {
    avatarFile: File | null;
    coverImageFile: File | null;
    bio: string;
    linkedin: string;
    website: string;
    github: string;
}

export const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
    onClose,
    onSave,
    open,
    onOpenChange,
    initialData
}) => {
    const [avatarUrl, setAvatarUrl] = useState<string>(initialData?.avatarFile ? URL.createObjectURL(initialData.avatarFile) : "");
    const [avatarFile, setAvatarFile] = useState<File | null>(initialData?.avatarFile || null);
    const [coverImageUrl, setCoverImageUrl] = useState<string>(initialData?.coverImageFile ? URL.createObjectURL(initialData.coverImageFile) : "");
    const [coverImageFile, setCoverImageFile] = useState<File | null>(initialData?.coverImageFile || null);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverImageInputRef = useRef<HTMLInputElement>(null);

    const { user } = useAuth()

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            if (avatarUrl) URL.revokeObjectURL(avatarUrl);
            setAvatarUrl(URL.createObjectURL(file));
        }
    };

    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImageFile(file);
            if (coverImageUrl) URL.revokeObjectURL(coverImageUrl);
            setCoverImageUrl(URL.createObjectURL(file));
        }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const formData = new FormData()
            formData.append('avatar', avatarFile as File)
            formData.append('coverImage', coverImageFile as File)
            const response = await userService.update(Number(user?.id), formData,
                {
                    requiresAuth: true,
                    customHeaders: { "Content-Type": "multipart/form-data" },
                    subEndpoint: `/profile/pictures/${Number(user?.id)}`
                })

            if (response.success === false) {
                console.log(response.error)
                return
            }

            onSave()
            onClose()

        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        return () => {
            if (avatarUrl) URL.revokeObjectURL(avatarUrl);
            if (coverImageUrl) URL.revokeObjectURL(coverImageUrl);
        };
    }, []);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle>Editar Perfil</DialogTitle>
                    <DialogDescription>Atualize suas informações incluindo sua bio e social links.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="avatar-upload">Imagem de Perfil</Label>
                        <div className="flex gap-4 items-center">
                            <div className="relative flex-1">
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    ref={avatarInputRef}
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="relative w-full pl-10 h-10 justify-start font-normal text-muted-foreground"
                                    onClick={() => avatarInputRef.current?.click()}
                                >
                                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                                    {avatarFile ? avatarFile.name : "Selecionar imagem de perfil"}
                                </Button>
                            </div>
                            <Avatar className="h-12 w-12 border border-border">
                                <AvatarImage src={avatarUrl} />
                                <AvatarFallback>
                                    <User className="h-6 w-6" />
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Selecione uma imagem para seu perfil (JPG, PNG)
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cover-image-upload">Imagem de Capa</Label>
                        <div className="relative">
                            <input
                                type="file"
                                id="cover-image-upload"
                                ref={coverImageInputRef}
                                accept="image/*"
                                onChange={handleCoverImageChange}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                className="relative w-full pl-10 h-10 justify-start font-normal text-muted-foreground"
                                onClick={() => coverImageInputRef.current?.click()}
                            >
                                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                                {coverImageFile ? coverImageFile.name : "Selecionar imagem de capa"}
                            </Button>
                        </div>
                        {coverImageUrl && (
                            <div className="mt-2 rounded-md overflow-hidden border border-border h-24 w-full bg-muted">
                                <img
                                    src={coverImageUrl}
                                    alt="Imagem de capa"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Selecione uma imagem para sua capa (JPG, PNG)
                        </p>
                    </div>
                </div>
                <DialogFooter className="flex-shrink-0 pt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Salvar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};