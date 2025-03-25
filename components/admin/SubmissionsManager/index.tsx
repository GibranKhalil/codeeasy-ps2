"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Submission } from "@/data/@types/models/submissions/entities/submission.entity"
import { format } from "date-fns"

export default function SubmissionsManager() {
    const { toast } = useToast()

    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [loading, setLoading] = useState(true)
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("pending")
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
    const [feedback, setFeedback] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [modalMode, setModalMode] = useState<"view" | "feedback">("view")


    const openViewModal = (submission: Submission) => {
        setSelectedSubmission(submission)
        setModalMode("view")
        setShowModal(true)
    }

    // Função para abrir o modal de feedback
    const openFeedbackModal = (submission: Submission, action: "approve" | "reject") => {
        setSelectedSubmission(submission)
        setFeedback(submission.comment || "")
        setModalMode("feedback")
        setShowModal(true)
    }

    // Função para processar a submissão (aprovar/rejeitar)
    const processSubmission = async (action: "approve" | "reject") => {

    }

    // Função para obter o ícone do tipo de submissão
    const getTypeIcon = (type: string) => {
        switch (type) {
            case "snippet":
                return "💻"
            case "tutorial":
                return "📚"
            case "game":
                return "🎮"
            default:
                return "📄"
        }
    }

    // Função para obter a cor do status
    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "approved":
                return "bg-green-100 text-green-800"
            case "rejected":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    // Renderizar o conteúdo da submissão
    const renderSubmissionContent = (submission: Submission) => {
        switch (submission.type) {
            case "snippet":
                const snippet = submission.snippet as any
                return (
                    <div className="mt-4">
                        <h3 className="text-lg font-medium">Descrição:</h3>
                        <p className="mt-1 mb-3">{snippet.description}</p>

                        <h3 className="text-lg font-medium">Código ({snippet.language}):</h3>
                        <pre className="mt-1 p-4 bg-gray-100 rounded-md overflow-x-auto">
                            <code>{snippet.code}</code>
                        </pre>
                    </div>
                )

            case "tutorial":
                const tutorial = submission.tutorial as any
                return (
                    <div className="mt-4">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{tutorial.category}</span>
                            <span className="text-sm text-gray-500">Tempo de leitura: {tutorial.read_time} min</span>
                        </div>

                        <h3 className="text-lg font-medium">Resumo:</h3>
                        <p className="mt-1 mb-3">{tutorial.excerpt}</p>

                        <h3 className="text-lg font-medium">Conteúdo:</h3>
                        <div className="mt-1 p-4 bg-gray-100 rounded-md overflow-y-auto max-h-96">{tutorial.content}</div>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {tutorial.tags.map((tag: string, index: number) => (
                                <span key={index} className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )

            case "game":
                const game = submission.game as any
                return (
                    <div className="mt-4">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">{game.category}</span>
                            <span className="text-sm text-gray-500">
                                Versão: {game.version} | {game.size_mb} MB
                            </span>
                        </div>

                        <h3 className="text-lg font-medium">Descrição:</h3>
                        <p className="mt-1 mb-3">{game.description}</p>

                        <h3 className="text-lg font-medium">Conteúdo:</h3>
                        <div className="mt-1 p-4 bg-gray-100 rounded-md overflow-y-auto max-h-96">{game.content}</div>

                        <h3 className="text-lg font-medium mt-3">Screenshots:</h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {game.screenshots.map((screenshot: string, index: number) => (
                                <img
                                    key={index}
                                    src={screenshot || "/placeholder.svg"}
                                    alt={`Screenshot ${index + 1}`}
                                    className="rounded-md w-full h-auto object-cover"
                                />
                            ))}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {game.tags.map((tag: string, index: number) => (
                                <span key={index} className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )

            default:
                return <p>Tipo de conteúdo não suportado</p>
        }
    }

    return (
        <div>
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Submissão
                    </label>
                    <select
                        id="type-filter"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="all">Todos os tipos</option>
                        <option value="snippet">Snippets de Código</option>
                        <option value="tutorial">Tutoriais</option>
                        <option value="game">Jogos</option>
                    </select>
                </div>

                <div className="flex-1">
                    <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                    </label>
                    <select
                        id="status-filter"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Todos os status</option>
                        <option value="pending">Pendentes</option>
                        <option value="approved">Aprovados</option>
                        <option value="rejected">Rejeitados</option>
                    </select>
                </div>
            </div>

            {/* Lista de submissões */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : submissions.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-lg text-gray-600">Nenhuma submissão encontrada com os filtros selecionados</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {submissions.map((submission) => (
                        <div key={submission.id} className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                            <div className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="text-2xl">{getTypeIcon(submission.type)}</div>
                                        <div>
                                            <h2 className="text-xl font-semibold">{submission.id}</h2>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1 text-sm text-gray-600">
                                                {/* <div className="flex items-center gap-2">
                                                    <img
                                                        src={submission.avatar_url || "/placeholder.svg"}
                                                        alt={submission.author.username}
                                                        className="w-5 h-5 rounded-full"
                                                    />
                                                    <span>{submission.author.username}</span>
                                                </div> */}
                                                <span className="hidden sm:inline">•</span>
                                                <span>Enviado em {format(new Date(submission.submittedAt), "d/MM/y")}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                                            {submission.status === "pending"
                                                ? "Pendente"
                                                : submission.status === "approved"
                                                    ? "Aprovado"
                                                    : "Rejeitado"}
                                        </span>
                                    </div>
                                </div>

                                {submission.submittedAt && (
                                    <div className="mt-4 text-sm text-gray-600">
                                        <p>Revisado em: {format(new Date(submission.submittedAt), "d/MM/y")}</p>
                                        {submission.comment && (
                                            <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                                <p className="font-medium">Feedback:</p>
                                                <p className="mt-1">{submission.comment}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="mt-4 flex flex-wrap gap-3">
                                    <button
                                        onClick={() => openViewModal(submission)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Ver Detalhes
                                    </button>

                                    {submission.status === "pending" && (
                                        <>
                                            <button
                                                onClick={() => openFeedbackModal(submission, "approve")}
                                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                            >
                                                Aprovar
                                            </button>

                                            <button
                                                onClick={() => openFeedbackModal(submission, "reject")}
                                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                            >
                                                Rejeitar
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de visualização/feedback */}
            {showModal && selectedSubmission && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                {modalMode === "view" ? (
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-2xl font-bold">{selectedSubmission.id}</h3>
                                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                                                <span className="sr-only">Fechar</span>
                                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* <div className="mt-4 flex items-center gap-3">
                                            <img
                                                src={selectedSubmission.author.avatar_url || "/placeholder.svg"}
                                                alt={selectedSubmission.author.username}
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <div>
                                                <p className="font-medium">{selectedSubmission.author.username}</p>
                                                <p className="text-sm text-gray-500">Enviado em {formatDate(selectedSubmission.created_at)}</p>
                                            </div>
                                        </div> */}

                                        {renderSubmissionContent(selectedSubmission)}
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-2xl font-bold">
                                                {selectedSubmission.status === "pending" ? "Revisar Submissão" : "Atualizar Feedback"}
                                            </h3>
                                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                                                <span className="sr-only">Fechar</span>
                                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="mt-4">
                                            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                                                Feedback para o autor
                                            </label>
                                            <textarea
                                                id="feedback"
                                                rows={5}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Explique o motivo da aprovação ou rejeição..."
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                            ></textarea>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                {modalMode === "view" ? (
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Fechar
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                            onClick={() =>
                                                processSubmission(
                                                    selectedSubmission.status === "pending" ? "approve" : (selectedSubmission.status as any),
                                                )
                                            }
                                        >
                                            {selectedSubmission.status === "pending" ? "Aprovar" : "Atualizar"}
                                        </button>

                                        {selectedSubmission.status === "pending" && (
                                            <button
                                                type="button"
                                                className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                                onClick={() => processSubmission("reject")}
                                            >
                                                Rejeitar
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancelar
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

