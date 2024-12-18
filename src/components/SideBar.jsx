import { Outlet } from "react-router-dom";
import AppNav from "./AppNav";
import Footer from "./Footer";
import Logo from "./Logo";
import styles from "./Sidebar.module.css";

function SideBar() {
  return (
    <nav className={styles.sidebar}>
      <Logo />
      <AppNav />
      <Outlet />
      <Footer />
    </nav>
  );
}

export default SideBar;
