/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom"
import Avatar from "../ui/components/Avatar"
import { Button } from "../ui/components/Button/Button"
import CodeViewer from "../ui/components/CodeViewer"
import { useCallback, useEffect, useState } from "react"
import snippets from '../data/snippets.json' with { type: 'json' }
import { Snippet } from "../@types/collection"
import { Copy, Eye, Heart, Maximize, Minimize } from "lucide-react"
import { InteractionCard } from "../ui/components/Interactions"
import { TabComponent } from "../ui/components/Tabs"
import { SnippetCard } from "../ui/components/pages/collection/snippetCard"
import Spinner from "../ui/components/Spinner"

export default function SnippetPage() {
    const { pid } = useParams()

    const [code, setCode] = useState<string>('')
    const [snippet, setSnippet] = useState<Snippet>()

    const [isFullScreen, setFullScreen] = useState<boolean>(false)
    const [isLoading, setLoading] = useState<boolean>(true)

    const fetchCode = useCallback(async () => {
        try {
            setLoading(true)
            console.log("executando")
            const snippet = snippets.filter((snippet) => snippet.pid === pid)[0]
            setSnippet(snippet)

            const url = snippet.link
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Erro ao buscar o código: ${response.status} ${response.statusText}`);
            }

            const code = await response.text();
            setCode(code)
        } catch (error) {
            console.error("Erro ao buscar código:", error);
        }
        finally {
            setLoading(false)
        }
    }, [pid]);

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code)
    }

    function openFullscreen(elem: HTMLElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if ((elem as any).webkitRequestFullscreen) {
            (elem as any).webkitRequestFullscreen();
        } else if ((elem as any).msRequestFullscreen) {
            (elem as any).msRequestFullscreen();
        }
    }

    function closeFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
            (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
            (document as any).msExitFullscreen();
        }
    }

    function toggleFullscreen() {
        const elem = document.getElementById("codeViewer") as HTMLElement;
        if (!document.fullscreenElement) {
            openFullscreen(elem);
            setFullScreen(true)
        } else {
            setFullScreen(false)
            closeFullscreen();
        }
    }

    useEffect(() => {
        fetchCode()
    }, [fetchCode])

    if (!snippet) {
        return <p>Não encontrado</p>
    }

    if (isLoading) {
        return <main className="h-screen w-full absolute inset-0 z-[100] bg-dark-1 items-center justify-center flex"><Spinner /></main>
    }

    const tabs = [
        {
            id: 'tab1',
            label: 'Descrição',
            content: (<div><p className="text-dark-11 text-sm leading-6">{snippet.description}</p></div>),
        },
        {
            id: 'tab2',
            label: 'Como Usar',
            content: (<div>
                <p className="text-sm leading-6 text-dark-11">{snippet.how_to_use_description}</p>
                <ol className="mt-6 flex flex-col gap-4">
                    {snippet.how_to_use_steps.map((step, index) => (
                        <li key={index}>
                            <div className="flex gap-1 text-sm font-medium text-dark-12 mb-1">
                                <p>{step.step}{")"}</p>
                                <p>{step.title}</p>
                            </div>
                            <p className="text-dark-11 text-xs leading-5">{step.description}</p>
                        </li>
                    ))}
                </ol>
            </div>
            ),
        },
    ];

    return (
        <main className="text-dark-12 lg:px-6 py-9 flex gap-4 h-fit">
            <section className="w-[70%] min-h-full flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                    <article id="codeViewer" className={`bg-dark-1 h-4/5 max-h-[500px] ${!isFullScreen && 'rounded-md border-dark-6 border'} flex flex-col overflow-hidden`}>
                        <div className="flex justify-end p-4 bg-dark-2 border-b border-dark-6 sticky top-0">
                            <ul className="flex gap-2">
                                <li onClick={() => copyCode(code)} className="text-dark-11 cursor-pointer hover:text-white transition-colors">
                                    <Copy size={18} />
                                </li>
                                <li onClick={() => toggleFullscreen()} className="text-dark-11 cursor-pointer hover:text-white transition-colors">
                                    {!isFullScreen ? <Maximize size={18} /> : <Minimize size={18} />}
                                </li>
                            </ul>
                        </div>
                        <div className="h-full overflow-hidden pt-2 px-2">
                            <CodeViewer
                                customStyle={{
                                    height: '100%',
                                    width: '100%',
                                    overflow: 'auto',
                                }}
                                language="javascript"
                                code={code}
                            />
                        </div>
                    </article>
                    <article>
                        <div className="flex w-full justify-between items-center">
                            <hgroup>
                                <h1 className="text-2xl font-bold mb-1">{snippet.title}</h1>
                                <h2 className="text-sm text-dark-11">Desenvolvido Inicialmente por <mark className="text-primary-9--dark font-bold bg-transparent">Gibran Khalil</mark></h2>
                            </hgroup>
                            <Button variant="contained" color="primary" className="rounded-lg">
                                Modificar
                            </Button>
                        </div>
                        <ul className="flex items-center gap-2 mt-4">
                            <li>
                                <InteractionCard className={"px-3 py-[8px] cursor-pointer rounded-lg text-[14px] font-medium gap-2"} icon={<Heart className="text-dark-12" size={20} />} value={Number(32)} />
                            </li>
                            <li>
                                <InteractionCard className={"px-3 py-[8px] cursor-pointer rounded-lg text-[14px] font-medium gap-2"} icon={<Eye className="text-dark-12" size={20} />} value={Number(22)} />
                            </li>
                        </ul>
                    </article>
                </div>
                <div>
                    <TabComponent tabs={tabs} />
                </div>
            </section>
            <section className="min-h-full w-[30%] flex flex-col gap-4">
                <article className="bg-dark-2 p-4 rounded-md border border-dark-6">
                    <header className="mb-2">
                        <h3 className="font-semibold text-sm">Último Modificador</h3>
                    </header>
                    <Avatar name={snippet.last_modifier.name} date={snippet.last_update} imgSize="max-w-12" displayName img={`${snippet.last_modifier.github}.png`} />
                </article>
                <article className="bg-dark-2 p-4 rounded-md border border-dark-6">
                    <header className="mb-2">
                        <h3 className="font-semibold text-sm">Colaboradores</h3>
                    </header>
                    <ul className="gap-4 flex flex-col p-1">
                        <li><Avatar img="https://github.com/user1.png" name="Usuário 1" displayName date={new Date().toLocaleDateString()} /></li>
                        <li><Avatar img="https://github.com/user2.png" name="Usuário 2" displayName date={new Date().toLocaleDateString()} /></li>
                        <li><Avatar img="https://github.com/user3.png" name="Usuário 3" displayName date={new Date().toLocaleDateString()} /></li>
                        <li><Avatar img="https://github.com/user7.png" name="Usuário 4" displayName date={new Date().toLocaleDateString()} /></li>
                        <li><Avatar img="https://github.com/user5.png" name="Usuário 5" displayName date={new Date().toLocaleDateString()} /></li>
                    </ul>
                </article>
                {snippet.can_use_with && snippet.can_use_with.length > 0 &&
                    <article className="h-[10%] min-h-fit bg-dark-2 p-4 rounded-md border border-dark-6">
                        <header className="mb-2">
                            <h3 className="font-semibold text-sm">Funciona bem com:</h3>
                        </header>
                        <ul className="flex flex-col gap-4">
                            {snippet.can_use_with.map((link, index) => (
                                <li className="flex gap-2 items-center" key={index}>
                                    <SnippetCard smallerView pid={link.pid} description={link.description} last_modifier={link.last_modifier} last_update={link.last_update} title={link.title} engine={link.engine} views={20} likes={20} />
                                </li>
                            ))}
                        </ul>
                    </article>}
            </section>
        </main>
    )
}