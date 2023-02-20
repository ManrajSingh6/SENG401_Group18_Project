import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

export default function Layout(){
    return(
        <main>
            <Navbar />
            <Outlet />
            {/* <Footer /> */}
        </main>
    );
}