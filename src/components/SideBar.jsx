import { Outlet } from "react-router-dom";
import AppNav from "./AppNav";
import Footer from "./Footer";
import Logo from "./Logo";
import styles from "./Sidebar.module.css";
import City from "./City";
function SideBar() {
  return (
    <nav className={styles.sidebar}>
      <Logo />
      <AppNav />
      {/* <City /> */}
      <Outlet />
      <Footer />
    </nav>
  );
}

export default SideBar;
