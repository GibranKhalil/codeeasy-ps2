import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export default function SidebarLayout() {
    return (
        <div className="flex gap-6 h-screen overflow-hidden">
            <Sidebar />
            <Outlet />
        </div>
    )
}