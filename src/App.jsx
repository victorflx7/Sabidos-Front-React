// App.jsx - CORRIGIDO
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/routes";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContexts"; // ✅ IMPORTAR

function App() {
  return (
    <ThemeProvider>
      <AuthProvider> {/* ✅ DEVE ENVOLVER TUDO */}
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>

  );
}
export default App;
