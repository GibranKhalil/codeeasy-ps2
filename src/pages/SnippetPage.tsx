import { useNavigate, useParams } from "react-router-dom"
import { Avatar } from "../ui/components/Avatar"
import { Button } from "../ui/components/Button"
import CodeViewer from "../ui/components/CodeViewer"
import { useCallback, useEffect, useState } from "react"
import snippets from '../data/snippets.json' with { type: 'json' }
import { Snippet } from "../@types/collection"

export default function SnippetPage() {
    const { pid } = useParams()
    const navigateTo = useNavigate()

    const [code, setCode] = useState<string>('')
    const [snippet, setSnippet] = useState<Snippet>()

    const fetchCode = useCallback(async () => {
        try {
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
    }, [pid]);


    useEffect(() => {
        fetchCode()
    })

    if (!snippet) {
        return <p>Não encontrado</p>
    }

    return (
        <main className="text-neutral-50 lg:px-24 py-9 grid grid-cols-[minmax(600px,1.4fr)_minmax(300px,1fr)] gap-4 items-stretch">
            <section className="min-h-full flex flex-col gap-4">
                <article className="custom-scroll bg-dark-secondary-30 border-dark-gray border h-full max-h-[400px] rounded-xl p-4">
                    <CodeViewer language="javascript" code={code} />
                </article>
                <article className="bg-dark-secondary p-4 rounded-md h-full max-h-[300px]">
                    <header className="mb-2">
                        <h3 className="font-semibold text-sm">Descrição</h3>
                    </header>
                    <p className="text-xs leading-5 text-neutral-gray">{snippet.description}</p>
                </article>
                {snippet.can_use_with && snippet.can_use_with.length > 0 &&
                    <article className="bg-dark-secondary p-4 rounded-md h-full max-h-[300px]">
                        <header className="mb-2">
                            <h3 className="font-semibold text-sm">Funciona bem com:</h3>
                        </header>
                        <ul>
                            {snippet.can_use_with.map((link, index) => (
                                <li className="flex gap-2 items-center" key={index}>
                                    <p onClick={() => navigateTo(`${link.link}`)} className="text-sm leading-5 text-light-gray hover:text-primary transition underline cursor-pointer">{link.name}</p>
                                </li>
                            ))}
                        </ul>
                    </article>}
            </section>
            <section className="min-h-full flex flex-col gap-4">
                <article className="bg-dark-secondary p-4 rounded-md">
                    <header className="mb-2">
                        <h3 className="font-semibold text-sm">Último Modificador</h3>
                    </header>
                    <Avatar name={snippet.last_modifier.name} date={snippet.last_update} imgSize="max-w-12" displayName img={`${snippet.last_modifier.github}.png`} />
                </article>
                <article className="bg-dark-secondary p-4 rounded-md">
                    <header className="mb-2">
                        <h3 className="font-semibold text-sm">Como Usar</h3>
                    </header>
                    <div>
                        <p className="text-xs leading-5 text-neutral-gray">{snippet.how_to_use_description}</p>
                        <ol className="mt-2">
                            {snippet.how_to_use_steps.map((step, index) => (
                                <li key={index} className="mb-2">
                                    <div className="flex gap-1 text-sm text-light-gray mb-1">
                                        <p>{step.step}{")"}</p>
                                        <p>{step.title}</p>
                                    </div>
                                    <p className="text-neutral-gray text-xs">{step.description}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </article>
                {snippet.modifiers.length > 0 &&
                    <article className="bg-dark-secondary p-4 rounded-md">
                        <header className="mb-2">
                            <h3 className="font-semibold text-sm">Colaboradores</h3>
                        </header>
                        <ul className="flex gap-2">
                            <li><Avatar img="https://github.com/user1.png" name="Usuário" /></li>
                            <li><Avatar img="https://github.com/user1.png" name="Usuário" /></li>
                            <li><Avatar img="https://github.com/user1.png" name="Usuário" /></li>
                            <li><Avatar img="https://github.com/user1.png" name="Usuário" /></li>
                            <li><Avatar img="https://github.com/user1.png" name="Usuário" /></li>
                        </ul>
                    </article>
                }
                <article className="bg-dark-secondary p-4 rounded-md flex justify-end">
                    <Button className="py-[8px]">
                        Modificar
                    </Button>
                </article>
            </section>
        </main>
    )
}