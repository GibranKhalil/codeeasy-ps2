"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { Submission } from "@/data/@types/models/submissions/entities/submission.entity"
import { format, formatDate } from "date-fns"
import { Label } from "@/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { Card, CardContent, CardHeader } from "@/components/card"
import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { Check, Eye, Loader2, X } from "lucide-react"
import { submissionService } from "@/data/services/submissions/submissions.service"
import { Snippet } from "@/data/@types/models/snippet/entities/snippet.entity"
import { Separator } from "@/components/separator"
import { Tutorial } from "@/data/@types/models/tutorials/entities/tutorial.entity"
import { Tag } from "@/data/@types/models/tags/entities/tag.entity"
import { Game } from "@/data/@types/models/games/entities/game.entity"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/dialog"
import { Textarea } from "@/components/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar"

export default function SubmissionsManager() {
    const { toast } = useToast()

    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [loading, setLoading] = useState(false)
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("pending")
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
    const [feedback, setFeedback] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [modalMode, setModalMode] = useState<"view" | "feedback">("view")

    const fetchSubmissions = useCallback(async () => {
        const response = await submissionService.find({ requiresAuth: true })
        console.log(response.data.data)
        setSubmissions(response.data.data)
    }, [])

    useEffect(() => {
        fetchSubmissions()
    }, [fetchSubmissions])

    const openViewModal = (submission: Submission) => {
        setSelectedSubmission(submission)
        setModalMode("view")
        setShowModal(true)
    }

    const openFeedbackModal = (submission: Submission, action: "approve" | "reject") => {
        setSelectedSubmission(submission)
        setFeedback(submission.comment || "")
        setModalMode("feedback")
        setShowModal(true)
    }

    const processSubmission = async (action: "approve" | "reject") => {

    }

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

    const renderSubmissionContent = (submission: Submission) => {
        switch (submission.type) {
            case "snippet":
                const snippet = submission.snippet as Snippet;
                return (
                    <Card className="mt-4 w-full">
                        <CardHeader>
                            {/* Pode adicionar um CardTitle ou CardDescription se fizer sentido */}
                            {/* <CardTitle>Snippet de Código</CardTitle> */}
                        </CardHeader>
                        <CardContent>
                            <h3 className="text-lg font-semibold mb-1">Descrição:</h3>
                            <p className="text-sm text-muted-foreground mb-4">{snippet.pid}</p>

                            <Separator className="my-4" /> {/* Divisória opcional */}

                            <h3 className="text-lg font-semibold mb-1">Código ({snippet.language}):</h3>
                            <div className="rounded-md border bg-muted p-4 overflow-x-auto">
                                <pre className="text-sm font-mono">
                                    <code>{snippet.code}</code>
                                </pre>
                            </div>
                        </CardContent>
                    </Card>
                );

            case "tutorial":
                const tutorial = submission.tutorial as Tutorial;
                return (
                    <Card className="mt-4 w-full">
                        <CardHeader>
                            {/* <CardTitle>Tutorial</CardTitle> Optional */}
                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="outline">{tutorial.category?.name}</Badge>
                                <span>|</span>
                                <span>Tempo de leitura: {tutorial.readTime} min</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <h3 className="text-lg font-semibold mb-1">Resumo:</h3>
                            <p className="text-sm text-muted-foreground mb-4">{tutorial.excerpt}</p>

                            <Separator className="my-4" />

                            <h3 className="text-lg font-semibold mb-1">Conteúdo:</h3>
                            {/* Usando `prose` do Tailwind Typography (se instalado) pode ser bom para renderizar markdown/html */}
                            <div className="mt-1 p-4 border rounded-md overflow-y-auto max-h-96 text-sm prose dark:prose-invert max-w-none">
                                {/* Idealmente, renderize o conteúdo HTML/Markdown aqui */}
                                {tutorial.content}
                            </div>

                            {tutorial.tags && tutorial.tags.length > 0 && (
                                <>
                                    <Separator className="my-4" />
                                    <div className="flex flex-wrap gap-2">
                                        {tutorial.tags.map((tag: Tag, index: number) => (
                                            <Badge key={index} variant="secondary">
                                                {tag.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                );

            case "game":
                const game = submission.game as Game;
                return (
                    <Card className="mt-4 w-full">
                        <CardHeader>
                            {/* <CardTitle>Game</CardTitle> Optional */}
                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="outline">{game.category.name}</Badge>
                                <span>|</span>
                                <span>Versão: {game.version}</span>
                                <span>|</span>
                                <span>Tamanho: {game.fileSize} MB</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <h3 className="text-lg font-semibold mb-1">Descrição:</h3>
                            <p className="text-sm text-muted-foreground mb-4">{game.description}</p>

                            <Separator className="my-4" />

                            <h3 className="text-lg font-semibold mb-1">Detalhes/Conteúdo:</h3>
                            {/* Similar ao tutorial, considere usar `prose` */}
                            <div className="mt-1 p-4 border rounded-md overflow-y-auto max-h-96 text-sm prose dark:prose-invert max-w-none">
                                {game.description}
                            </div>

                            {game.screenshots && game.screenshots.length > 0 && (
                                <>
                                    <Separator className="my-4" />
                                    <h3 className="text-lg font-semibold mb-2">Screenshots:</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {game.screenshots.map((screenshot: string, index: number) => (
                                            <img
                                                key={index}
                                                src={screenshot || "/placeholder.svg"} // Mantenha o placeholder
                                                alt={`Screenshot ${index + 1}`}
                                                className="rounded-md border w-full h-auto object-cover aspect-video" // Adicionado aspect-video para consistência
                                            />
                                        ))}
                                    </div>
                                </>
                            )}


                            {game.tags && game.tags.length > 0 && (
                                <>
                                    <Separator className="my-4" />
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {game.tags.map((tag: Tag, index: number) => (
                                            <Badge key={index} variant="secondary">
                                                {tag.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                );

            default:
                // Pode usar um Alert ou AlertDescription do Shadcn para erros/avisos
                return (
                    <Card className="mt-4 w-full">
                        <CardContent className="pt-6"> {/* pt-6 para padding quando não há header */}
                            <p className="text-destructive">Tipo de conteúdo não suportado ou dados ausentes.</p>
                        </CardContent>
                    </Card>
                );
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 space-y-2">
                    <Label htmlFor="type-filter">Tipo de Submissão</Label>
                    <Select
                        value={typeFilter}
                        onValueChange={setTypeFilter}
                    >
                        <SelectTrigger id="type-filter">
                            <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os tipos</SelectItem>
                            <SelectItem value="snippet">Snippets de Código</SelectItem>
                            <SelectItem value="tutorial">Tutoriais</SelectItem>
                            <SelectItem value="game">Jogos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex-1 space-y-2">
                    <Label htmlFor="status-filter">Status</Label>
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger id="status-filter">
                            <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os status</SelectItem>
                            <SelectItem value="pending">Pendentes</SelectItem>
                            <SelectItem value="approved">Aprovados</SelectItem>
                            <SelectItem value="rejected">Rejeitados</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                </div>
            ) : submissions.length === 0 ? (
                <div className="text-center py-12 rounded-lg">
                    <p className="text-lg text-muted-foreground">
                        Nenhuma submissão encontrada com os filtros selecionados
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {submissions && submissions.map((submission) => (
                        <Card key={submission.id} className="overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="text-2xl">{getTypeIcon(submission.type)}</div>
                                        <div>
                                            <h2 className="text-xl font-semibold">{submission.title}</h2>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                <span className="hidden sm:inline">•</span>
                                                <span>
                                                    Enviado em {format(new Date(submission.submittedAt), "d/MM/y")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Badge
                                        variant="outline"
                                        className={getStatusColor(submission.status)}
                                    >
                                        {submission.status === "pending"
                                            ? "Pendente"
                                            : submission.status === "approved"
                                                ? "Aprovado"
                                                : "Rejeitado"}
                                    </Badge>
                                </div>

                                {submission.submittedAt && (
                                    <div className="mt-4 text-sm text-muted-foreground">
                                        <p>Revisado em: {format(new Date(submission.submittedAt), "d/MM/y")}</p>
                                        {submission.comment && (
                                            <div className="mt-2 p-3 bg-secondary/50 rounded-md">
                                                <p className="font-medium">Feedback:</p>
                                                <p className="mt-1">{submission.comment}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="mt-4 flex flex-wrap gap-3">
                                    <Button
                                        onClick={() => openViewModal(submission)}
                                        size="sm"
                                    >
                                        <Eye className="mr-2 h-4 w-4" />
                                        Ver Detalhes
                                    </Button>

                                    {submission.status === "pending" && (
                                        <>
                                            <Button
                                                onClick={() => openFeedbackModal(submission, "approve")}
                                                variant="default"
                                                size="sm"
                                            >
                                                <Check className="mr-2 h-4 w-4" />
                                                Aprovar
                                            </Button>

                                            <Button
                                                onClick={() => openFeedbackModal(submission, "reject")}
                                                variant="destructive"
                                                size="sm"
                                            >
                                                <X className="mr-2 h-4 w-4" />
                                                Rejeitar
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {selectedSubmission && (
                <Dialog open={showModal} onOpenChange={setShowModal}>
                    <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">
                                {modalMode === "view"
                                    ? `Detalhes: ${selectedSubmission.title}`
                                    : selectedSubmission.status === "pending"
                                        ? "Revisar Submissão"
                                        : "Atualizar Feedback"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="flex-grow overflow-y-auto pr-6 pl-6 -mr-6 -ml-6"> {/* Adiciona scroll ao corpo se o conteúdo for grande */}
                            {modalMode === "view" ? (
                                <div>
                                    <div className="mb-4 flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={selectedSubmission.creator.avatarUrl || undefined} alt={`@${selectedSubmission.creator.username}`} />
                                            <AvatarFallback>{selectedSubmission.creator.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{selectedSubmission.creator.username}</p>
                                            <p className="text-sm text-muted-foreground">Enviado em {formatDate(selectedSubmission.submittedAt, 'dd/MM/Y')}</p>
                                        </div>
                                    </div>
                                    <Separator className="my-4" />

                                    {renderSubmissionContent(selectedSubmission)}
                                </div>
                            ) : (
                                <div className="py-4 space-y-4">
                                    <div className="mb-4 flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={selectedSubmission.creator.avatarUrl || undefined} alt={`@${selectedSubmission.creator.username}`} />
                                            <AvatarFallback>{selectedSubmission.creator.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{selectedSubmission.creator.username}</p>
                                            <p className="text-sm text-muted-foreground">Enviado em {formatDate(selectedSubmission.submittedAt, 'dd/MM/Y')}</p>
                                        </div>
                                    </div>
                                    <Separator className="my-4" />
                                    {renderSubmissionContent(selectedSubmission)}
                                    <div className="space-y-2 pt-4">
                                        <Label htmlFor="feedback">Feedback para o autor</Label>
                                        <Textarea
                                            id="feedback"
                                            rows={5}
                                            placeholder="Explique o motivo da aprovação ou rejeição..."
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            className="resize-y"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <DialogFooter className="mt-auto pt-4"> {/* mt-auto para fixar no fundo se usar flex-col */}
                            {modalMode === "view" ? (
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">
                                        Fechar
                                    </Button>
                                </DialogClose>
                            ) : (
                                <>
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline">
                                            Cancelar
                                        </Button>
                                    </DialogClose>

                                    {selectedSubmission.status === "pending" && (
                                        <Button
                                            type="button"
                                            variant="destructive" // Botão de rejeição
                                            onClick={() => processSubmission("reject")}
                                            disabled={!feedback} // Opcional: Desabilitar se feedback for obrigatório para rejeitar
                                        >
                                            Rejeitar
                                        </Button>
                                    )}

                                    <Button
                                        type="button"
                                        // variant="default" // Botão primário (padrão)
                                        onClick={() =>
                                            processSubmission(
                                                selectedSubmission.status === "pending" ? "approve" : (selectedSubmission.status as any),
                                            )
                                        }
                                        // Opcional: Desabilitar se feedback for obrigatório para aprovar/atualizar
                                        disabled={selectedSubmission.status === "pending" && !feedback}
                                    >
                                        {selectedSubmission.status === "pending" ? "Aprovar" : "Atualizar"}
                                    </Button>
                                </>
                            )}
                        </DialogFooter>

                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

