import { Outlet } from "react-router-dom";
import "./AccountLayout.css";
import Footer from "../Components/Footer/Footer";

export default function AccountLayout() {
  return (
    <div className="account-layout">
      <main className="account-content-area">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
