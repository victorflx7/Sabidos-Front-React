import { BrowserRouter } from "react-router-dom";
import AppRoutes from './routes/routes';
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContexts"; // ✅ IMPORTAR


function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
export default App;
