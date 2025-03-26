"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { Role } from "@/data/@types/models/roles/entities/role.entity"
import { User } from "@/data/@types/models/users/entities/user.entity"
import { userService } from "@/data/services/users/users.service"
import { rolesService } from "@/data/services/roles/roles.service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card"
import { Label } from "@radix-ui/react-label"
import { Input } from "@/components/input"
import { Textarea } from "@/components/textarea"
import { Checkbox } from "@/components/checkbox"
import { Button } from "@/components/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { Badge } from "@/components/badge"

interface RolesManagerProps {

}

export default function RolesManager({ }: RolesManagerProps) {
    const { toast } = useToast()

    const [roles, setRoles] = useState<Role[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [selectedRole, setSelectedRole] = useState<Role | null>(null)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    const [newRole, setNewRole] = useState({
        name: "",
        description: "",
        permissions: [] as string[],
    })

    const [isCreatingRole, setIsCreatingRole] = useState(false)
    const [isAssigningRole, setIsAssigningRole] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // const availablePermissions = [
    //     "read:users",
    //     "write:users",
    //     "delete:users",
    //     "read:roles",
    //     "write:roles",
    //     "delete:roles",
    //     "read:dashboard",
    //     "write:dashboard"
    // ]

    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true)
            const response = await userService.find({ requiresAuth: true, subEndpoint: '/roles' })
            setUsers(response.data.data)
            console.log(response.data)
            fetchRoles()
        } catch (error) {
            toast({
                title: "Erro ao carregar usuários",
                description: "Não foi possível carregar a lista de usuários.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }, [])

    const fetchRoles = useCallback(async () => {
        const response = await rolesService.find({ requiresAuth: true })
        setRoles(response.data.data)
    }, [])

    const handleCreateRole = async (e: React.FormEvent) => {
        e.preventDefault()

        if (newRole.name.trim() === "") {
            toast({
                title: "Erro de Validação",
                description: "Nome e descrição do papel são obrigatórios.",
                variant: "destructive"
            })
            return
        }

        try {
            setIsCreatingRole(true)
            const createdRole = await rolesService.create({
                name: newRole.name,
            }, { requiresAuth: true })

            console.log(createdRole)

            toast({
                title: "Papel Criado",
                description: `Papel "${newRole.name}" criado com sucesso.`,
                variant: "default"
            })
            setNewRole({ name: "", description: "", permissions: [] })
        } catch (error) {
            toast({
                title: "Erro ao Criar Papel",
                description: "Não foi possível criar o novo papel.",
                variant: "destructive"
            })
        } finally {
            setIsCreatingRole(false)
        }
    }

    const handleAssignRole = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedUser || !selectedRole) {
            toast({
                title: "Erro de Seleção",
                description: "Selecione um usuário e um papel.",
                variant: "destructive"
            })
            return
        }

        try {
            setIsAssigningRole(true)
            await userService.update(selectedUser.id, { roleId: selectedRole.id }, { requiresAuth: true, subEndpoint: `/${selectedUser.id}/roles` })
            toast({
                title: "Papel Atribuído",
                description: `Papel "${selectedRole.name}" atribuído a ${selectedUser.username}.`,
                variant: "default"
            })

            await fetchUsers()
            setSelectedUser(null)
            setSelectedRole(null)
        } catch (error) {
            toast({
                title: "Erro ao Atribuir Papel",
                description: "Não foi possível atribuir o papel ao usuário.",
                variant: "destructive"
            })
        } finally {
            setIsAssigningRole(false)
        }
    }

    const handleRemoveRole = async (userId: number, roleId: number) => {

        if (!userId) {
            toast({
                title: "Erro de Seleção",
                description: "Selecione um usuário",
                variant: "destructive"
            })
            return
        }

        if (!roleId) {
            toast({
                title: "Erro de Seleção",
                description: "Selecione uma role",
                variant: "destructive"
            })
            return
        }

        try {
            const response = await userService.delete(userId, { requiresAuth: true, subEndpoint: `/${userId}/${roleId}` })
            console.log(response)
            toast({
                title: "Papel Removido",
                description: "Papel removido do usuário com sucesso.",
                variant: "default"
            })
            await fetchUsers()
        } catch (error) {
            toast({
                title: "Erro ao Remover Papel",
                description: "Não foi possível remover o papel do usuário.",
                variant: "destructive"
            })
        }
    }

    const handleDeleteRole = async (roleId: number) => {
        try {
            await rolesService.delete(roleId)

            toast({
                title: "Papel Excluído",
                description: "Papel excluído com sucesso.",
                variant: "default"
            })

            // Potentially refresh roles list or remove from local state
        } catch (error) {
            toast({
                title: "Erro ao Excluir Papel",
                description: "Não foi possível excluir o papel.",
                variant: "destructive"
            })
        }
    }

    const togglePermission = (permission: string) => {
        setNewRole(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
                ? prev.permissions.filter(p => p !== permission)
                : [...prev.permissions, permission]
        }))
    }

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    useEffect(() => {
        fetchRoles()
    }, [fetchRoles])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Create Role Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Criar Novo Papel</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateRole} className="space-y-4">
                        <div>
                            <Label htmlFor="role-name">Nome do Papel *</Label>
                            <Input
                                id="role-name"
                                value={newRole.name}
                                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                                required
                                placeholder="Digite o nome do papel"
                            />
                        </div>

                        {/* <div>
                            <Label htmlFor="role-description">Descrição *</Label>
                            <Textarea
                                id="role-description"
                                value={newRole.description}
                                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                                required
                                placeholder="Descrição do papel"
                            />
                        </div> */}

                        {/* <div>
                            <Label>Permissões</Label>
                            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded-md p-3">
                                {availablePermissions.map((permission) => (
                                    <div key={permission} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`permission-${permission}`}
                                            checked={newRole.permissions.includes(permission)}
                                            onCheckedChange={() => togglePermission(permission)}
                                        />
                                        <Label
                                            htmlFor={`permission-${permission}`}
                                            className="text-sm"
                                        >
                                            {permission}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div> */}

                        <Button disabled={isCreatingRole} type="submit" className="w-full">
                            Criar Papel
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Assign Role Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Atribuir Papel a Usuário</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAssignRole} className="space-y-4">
                        <div>
                            <Label>Selecionar Usuário *</Label>
                            <Select
                                onValueChange={(value) => {
                                    const user = users.find(u => u.id === Number(value));
                                    setSelectedUser(user || null);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um usuário" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((user) => (
                                        <SelectItem key={user.id} value={String(user.id)}>
                                            {user.username}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Selecionar Papel *</Label>
                            <Select
                                onValueChange={(value) => {
                                    const role = roles.find(r => r.id === Number(value));
                                    setSelectedRole(role || null);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um papel" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={String(role.id)}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button disabled={isAssigningRole} onClick={handleAssignRole} type="submit" className="w-full">
                            Atribuir Papel
                        </Button>

                        {selectedUser && (
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Papéis Atuais de {selectedUser.username}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {selectedUser.roles && selectedUser.roles.length > 0 ? (
                                        <div className="space-y-2">
                                            {selectedUser.roles.map((ro) => {
                                                const role = roles.find((r) => r.id === ro.id);
                                                return role ? (
                                                    <div
                                                        key={ro.id}
                                                        className="flex items-center justify-between p-3 rounded-md"
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <p className="capitalize">{role.name}</p>
                                                        </div>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleRemoveRole(selectedUser.id, ro.id)}
                                                        >
                                                            Remover
                                                        </Button>
                                                    </div>
                                                ) : null;
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-center">
                                            Este usuário não possui papéis atribuídos.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}