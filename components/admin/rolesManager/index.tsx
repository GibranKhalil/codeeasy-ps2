"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Role } from "@/data/@types/models/roles/entities/role.entity"
import { User } from "@/data/@types/models/users/entities/user.entity"

export default function RolesManager() {
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
    const [isLoading, setIsLoading] = useState(true)

    const handleCreateRole = async (e: React.FormEvent) => {
        e.preventDefault()
    }

    const handleAssignRole = async (e: React.FormEvent) => {
        e.preventDefault()
    }

    const handleRemoveRole = async (userId: number, roleId: number) => {

    }

    const handleDeleteRole = async (roleId: number) => {

    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Seção de Criação de Papéis */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Criar Novo Papel</h2>

                    <form onSubmit={handleCreateRole}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="role-name">
                                Nome do Papel *
                            </label>
                            <input
                                id="role-name"
                                type="text"
                                className="w-full p-2 border rounded-md"
                                value={newRole.name}
                                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="role-description">
                                Descrição *
                            </label>
                            <textarea
                                id="role-description"
                                className="w-full p-2 border rounded-md"
                                value={newRole.description}
                                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Permissões</label>
                            <div className="max-h-60 overflow-y-auto border rounded-md p-3">
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                            disabled={isCreatingRole}
                        >
                            {isCreatingRole ? "Criando..." : "Criar Papel"}
                        </button>
                    </form>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Atribuir Papel a Usuário</h2>

                    <form onSubmit={handleAssignRole}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="select-user">
                                Selecionar Usuário *
                            </label>
                            <select
                                id="select-user"
                                className="w-full p-2 border rounded-md"
                                value={selectedUser?.id || ""}
                                required
                            >
                                <option value="">Selecione um usuário</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.username}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="select-role">
                                Selecionar Papel *
                            </label>
                            <select
                                id="select-role"
                                className="w-full p-2 border rounded-md"
                                value={selectedRole?.id || ""}
                                required
                            >
                                <option value="">Selecione um papel</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                            disabled={isAssigningRole}
                        >
                            {isAssigningRole ? "Atribuindo..." : "Atribuir Papel"}
                        </button>
                    </form>

                    {selectedUser && (
                        <div className="mt-6">
                            <h3 className="text-lg font-medium mb-2">Papéis Atuais de {selectedUser.username}</h3>
                            {selectedUser.roles && selectedUser.roles.length > 0 ? (
                                <ul className="list-disc pl-5">
                                    {selectedUser.roles.map((ro) => {
                                        const role = roles.find((r) => r.id === ro.id)
                                        return role ? (
                                            <li key={ro.id} className="mb-1 flex items-center justify-between">
                                                <span>{role.name}</span>
                                                <button
                                                    onClick={() => handleRemoveRole(selectedUser.id, ro.id)}
                                                    className="text-red-600 text-sm hover:text-red-800"
                                                >
                                                    Remover
                                                </button>
                                            </li>
                                        ) : null
                                    })}
                                </ul>
                            ) : (
                                <p className="text-gray-500">Este usuário não possui papéis atribuídos.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Papéis Existentes</h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Descrição
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Permissões
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {roles.map((role) => (
                                <tr key={role.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{role.name}</div>
                                        <div className="text-xs text-gray-500">ID: {role.id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{role.name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Lista de Usuários e seus Papéis */}
            <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Usuários e seus Papéis</h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Usuário
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Papéis
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img
                                                    className="h-10 w-10 rounded-full"
                                                    src={user.avatarUrl || "/placeholder.svg"}
                                                    alt={user.username}
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="font-medium text-gray-900">{user.username}</div>
                                                <div className="text-xs text-gray-500">ID: {user.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles && user.roles.length > 0 ? (
                                                user.roles.map((roleId) => {
                                                    const role = roles.find((r) => r.id === roleId.id)
                                                    return role ? (
                                                        <span key={roleId.id} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                                                            {role.name}
                                                        </span>
                                                    ) : null
                                                })
                                            ) : (
                                                <span className="text-gray-500">Nenhum papel</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onClick={() => setSelectedUser(user)} className="text-blue-600 hover:text-blue-900">
                                            Gerenciar Papéis
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

