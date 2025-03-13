import { ReactElement, useMemo } from "react";
import { Boxes, Code, Folder } from "lucide-react";
import { useLocation } from "react-router-dom";

interface SidebarSubOption {
  label: string;
  icon: ReactElement;
  redirect: string;
  active: boolean;
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
      active: currentPath.includes("/collection"),
      redirect: "/collection",
      subOptions: [
        {
          label: 'Snippets',
          icon: <Folder size={16} />,
          redirect: '/collection',
          active: currentPath === '/collection'
        },
        {
          label: 'Contribuir',
          icon: <Code size={16} />,
          redirect: '/collection/new',
          active: currentPath.includes('/collection/new')
        },

      ]
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