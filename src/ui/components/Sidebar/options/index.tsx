import { ReactElement, useMemo } from "react";
import { Boxes } from "lucide-react";
import { useLocation } from "react-router-dom";

interface SidebarSubOption {
  label: string;
  icon: ReactElement;
  redirect: string;
}

interface SidebarOptions {
  label: string;
  icon: ReactElement;
  active: boolean;
  redirect: string;
  subOptions?: SidebarSubOption[];
}

const SidebarOptions = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const sidebarOptions: SidebarOptions[] = useMemo(() => [
    {
      label: "Coleção",
      icon: <Boxes size={18} />,
      active: currentPath === "/collection",
      redirect: "/collection"
    }
    // {
    //   label: "Ranking",
    //   icon: <Trophy size={18} />,
    //   active: currentPath === "/ranking",
    //   redirect: "/ranking",
    // },
    // {
    //   label: "Jogos",
    //   icon: <Gamepad2 size={18} />,
    //   active: currentPath === "/games",
    //   redirect: "/games",
    // },
    // {
    //   label: "Tutoriais",
    //   icon: <Blocks size={18} />,
    //   active: currentPath === "/tutorials",
    //   redirect: "/tutorials",
    // },
    // {
    //   label: "Doações",
    //   icon: <HeartHandshake size={18} />,
    //   active: currentPath === "/donations",
    //   redirect: "/donations"
    // },
  ], [currentPath]);

  return sidebarOptions;
};

export default SidebarOptions;