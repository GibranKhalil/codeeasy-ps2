import { ChevronRight, LogOut } from "lucide-react";
import SidebarOptions from "./options";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "../Avatar";

export const Sidebar = () => {
    const options = SidebarOptions();
    const navigateTo = useNavigate();
    const [openedItem, setOpenedItem] = useState<number | null>(null);

    return (
        <motion.aside
            className="bg-dark-2 h-screen sticky top-0 left-0 p-6 flex flex-col justify-between overflow-hidden"
            animate={{ minWidth: openedItem !== null ? "240px" : "240px" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <nav>
                <div className="border-b border-b-dark-6 mb-6 py-3 w-full">
                    <Avatar img="https://github.com/gibrankhalil.png" name="Gibran Khalil" imgSize="max-w-12" displayName date="Desenvolvedor" />
                </div>
                <motion.ul transition={{ duration: 0.3, ease: "easeInOut" }} className="flex flex-col gap-2">
                    {options.map((option, index) => (
                        <li
                            onClick={() => {
                                if (option.subOptions) {
                                    setOpenedItem(openedItem === index ? null : index);
                                } else {
                                    navigateTo(option.redirect);
                                }
                            }}
                            key={index}
                            className="w-full"
                        >
                            <div
                                className={`flex items-center rounded-md px-3 min-w-36 py-2 cursor-pointer flex-1 text-dark-12 justify-between w-full transition-colors ${option.active ? "bg-primary-3--dark" : "hover:bg-dark-3"
                                    }`}
                            >
                                <div className="flex gap-2 items-center text-sm">
                                    <i className="flex items-center justify-center">{option.icon}</i>
                                    <p>{option.label}</p>
                                </div>
                                {option.subOptions && (
                                    <motion.i
                                        className="flex items-center justify-center"
                                        animate={{ rotate: openedItem === index ? 90 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronRight size={16} />
                                    </motion.i>
                                )}
                            </div>

                            <AnimatePresence>
                                {option.subOptions && openedItem === index && (
                                    <motion.ul
                                        className="pl-3 py-2"
                                        initial={{ opacity: 0, height: 0, y: -10 }}
                                        animate={{ opacity: 1, height: "auto", y: 0 }}
                                        exit={{ opacity: 0, height: 0, y: -10 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        {option.subOptions.map((subOption, subIndex) => (
                                            <motion.li
                                                className={`py-1 hover:bg-dark-3 border-l border-l-dark-6 ${subOption.active ? "text-primary-9--dark" : "text-dark-12"
                                                    }`}
                                                key={subIndex}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.25, ease: "easeOut" }}
                                            >
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigateTo(subOption.redirect);
                                                    }}
                                                    className="flex items-center rounded-md px-3 min-w-36 py-2 cursor-pointer flex-1"
                                                >
                                                    <div className="flex gap-2 items-center font-medium text-sm">
                                                        <i className="flex items-center justify-center">{subOption.icon}</i>
                                                        <p className="text-xs">{subOption.label}</p>
                                                    </div>
                                                </div>
                                            </motion.li>
                                        ))}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </li>
                    ))}
                </motion.ul>
            </nav>
            <div className="flex gap-2 px-4 py-2 rounded-md cursor-pointer text-accent-red-10 items-center font-medium text-sm">
                <i><LogOut size={18} /></i>
                <p>Sair da sua conta</p>
            </div>
        </motion.aside>
    );
};
