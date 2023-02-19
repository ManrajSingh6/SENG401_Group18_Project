import React from "react";
import "./footer.css";

const currentYear = new Date().getFullYear();

export default function Footer(){
    return(
        <footer>
            <h4 className="footer">© {currentYear} The Loop</h4>
        </footer>
    );
}