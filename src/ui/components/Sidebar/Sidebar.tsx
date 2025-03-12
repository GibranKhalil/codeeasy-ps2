import { ChevronRight } from "lucide-react";
import SidebarOptions from "./options";

export const Sidebar = () => {
    const options = SidebarOptions();

    return (
        <aside className="w-fit bg-dark-2 h-screen sticky top-0 left-0 p-6 flex flex-col justify-between">
            <nav>
                <ul className="flex flex-col gap-2">
                    {options.map((option, index) => (
                        <li>
                            <a className="flex items-center justify-between" href={option.redirect} key={index}>
                                <div className={
                                    `flex gap-2 px-4 py-2 rounded-md cursor-pointer text-dark-12 items-center font-medium text-sm
                                ${option.active ? 'bg-primary-3--dark' : 'hover:bg-dark-3 transition-colors'}
                                `}>
                                    <i>{option.icon}</i>
                                    <p>{option.label}</p>
                                </div>
                                {option.subOptions && option.subOptions.length > 0 && <i><ChevronRight /></i>}
                            </a>

                        </li>
                    ))}
                </ul>
            </nav>
            {/* <div className="flex gap-2 px-4 py-2 rounded-md cursor-pointer text-accent-red-10 items-center font-medium text-sm">
                <i><LogOut size={18} /></i>
                <p>Sair da sua conta</p>
            </div> */}
        </aside>
    )
}