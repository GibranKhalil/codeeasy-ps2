import { Avatar } from "../ui/components/Avatar"
import { Button } from "../ui/components/Button"
import CodeViewer from "../ui/components/CodeViewer"
import { useCallback, useEffect, useState } from "react"

export default function SnippetPage() {
    const [code,setCode] = useState<string>('')

    const fetchCode = useCallback(async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/GibranKhalil/plataform-game-ps2/main/src/models/behaviors/ControllableEntity/index.js');
            
            if (!response.ok) {
                throw new Error(`Erro ao buscar o código: ${response.status} ${response.statusText}`);
            }
    
            const code = await response.text();
            setCode(code)
        } catch (error) {
            console.error("Erro ao buscar código:", error);
        }
    }, []);
    

    useEffect(() => {
        fetchCode()
    })

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
                    <p className="text-xs leading-5 text-neutral-gray">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </article>
            </section>
            <section className="min-h-full flex flex-col gap-4">
                <article className="bg-dark-secondary p-4 rounded-md">
                    <header className="mb-2">
                        <h3 className="font-semibold text-sm">Último Modificador</h3>
                    </header>
                    <Avatar name="Gibran Khalil" date="12/02/2025" imgSize="max-w-12" displayName img="https://github.com/gibranKhalil.png" />
                </article>
                <article className="bg-dark-secondary p-4 rounded-md">
                    <header className="mb-2">
                        <h3 className="font-semibold text-sm">Como Usar</h3>
                    </header>
                    <p className="text-xs leading-5 text-neutral-gray">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </article>
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
                <article className="bg-dark-secondary p-4 rounded-md flex justify-end">
                    <Button className="py-[8px]">
                        Modificar
                    </Button>
                </article>
            </section>
        </main>
    )
}