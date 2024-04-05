import React, { useEffect, useState } from "react";
import GradientButton from "../GradientButton/GradientButton";
import Logo from "./BarterHub.png";
import styles from "./Nav.module.css";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import ConfirmationModal from '../../UI/BootstrapModal/ConfirmationModal';

const Nav = () => {
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode token and set user data
      const decoded = jwtDecode(token);
      setUser({
        ...decoded,
        token // Store the token if needed for further requests
      });
    }
  }, []);

  const handleLogout = async () => {
    setConfirmMessage("Are you sure you want to logout?");
    setConfirmAction(() => () => {
      fetch('http://localhost:8000/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
      })
        .then(response => {
          if (response) {
            setUser(null);
            localStorage.removeItem('token');
            toast.success(response.message);
            setModalOpen(false)
          } else {
            toast.error('Logout failed!');
            setModalOpen(false)
          }
        })
        .catch(error => { console.error("Error during logout:", error) });
      setModalOpen(false)
    })
    setModalOpen(true)
  };
  return (
    <>
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmAction}
        message={confirmMessage}
        />
      <nav className={styles.Nav}>
        <img className={styles.Logo} src={Logo} alt="logo of barter hub" />
        <div className={styles["search-container"]}>
          <input
            className={styles.searchBox}
            type="text"
            placeholder="Type to search"
          ></input>
        </div>
        <ul className={styles.items}>
          <li><a href="/">Home</a></li>
          <li><a href="/productListings">Listing</a></li>
          <li>{/* Default: Render login */}
            {user && (
              <>
                {user.userType === "admin" ? (
                  <>
                    {/* Render admin-specific components */}
                    <div className="d-flex gap-2">
                      <a href="/admin">
                        <GradientButton rounded={true} text="Admin Panel" />
                      </a>
                      <button style={{ border: 0, background: 'white' }} onClick={handleLogout}>
                        <i class={`fa fa-sign-out border ${styles.logout}`}></i>
                      </button>
                    </div>
                  </>
                ) : user.userType === "user" ? (
                  <>
                    {/* Render user-specific components */}
                    <a href="/user">
                      <GradientButton rounded={true} text="User Profile" />
                    </a>
                    <button style={{ border: 0, background: 'white' }} onClick={handleLogout}>
                        <i class={`fa fa-sign-out border ${styles.logout}`}></i>
                    </button>
                  </>
                ) : (
                  <a href="/login">
                    <GradientButton rounded={true} text="Login" />
                  </a>
                )}
              </>
            )}
            {!user && ( /* Render login if user is not defined */
              <a href="/login">
                <GradientButton rounded={true} text="Login" />
              </a>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Nav;
