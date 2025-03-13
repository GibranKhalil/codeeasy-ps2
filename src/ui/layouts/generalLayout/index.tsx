import { ReactElement } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

export default function GeneralLayout({ children }: { children: ReactElement }) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
}