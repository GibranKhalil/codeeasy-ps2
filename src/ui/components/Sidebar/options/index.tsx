import { ReactElement } from "react";
import { Trophy, Gamepad2, HeartHandshake, Blocks, Boxes } from "lucide-react";

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

const sidebarOptions: SidebarOptions[] = [
  {
    label: "Coleção",
    icon: <Boxes size={18} />,
    active: false,
    redirect: "/collection"
  },
  {
    label: "Ranking",
    icon: <Trophy size={18} />,
    active: false,
    redirect: "/ranking",
  },
  {
    label: "Jogos",
    icon: <Gamepad2 size={18} />,
    active: false,
    redirect: "/games",
  },
  {
    label: "Tutoriais",
    icon: <Blocks size={18} />,
    active: false,
    redirect: "/tutorials",
  },
  {
    label: "Doações",
    icon: <HeartHandshake size={18} />,
    active: false,
    redirect: "/donations"
  },
];

export default sidebarOptions;