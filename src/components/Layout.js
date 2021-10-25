import { useContext } from "react";
import { ThemeContext, ThemeProvider } from '../context/ThemeContext';

function Layout({ startingTheme, children }) {
    return (
        <ThemeProvider startingTheme={startingTheme}>
            <LayoutNoThemeProvider>{children}</LayoutNoThemeProvider>
        </ThemeProvider>
    );
}

//theme is not defined error => separate function called in Layout, where starting theme is defined
function LayoutNoThemeProvider({ children }) {

    const { theme } = useContext(ThemeContext);

    return (
        <div className={
            theme === "light" ? "container-fluid light" :
                "container-fluid dark"
        }>
            {children}
        </div>
    );
}

export default Layout;