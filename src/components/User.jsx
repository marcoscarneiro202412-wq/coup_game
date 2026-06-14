import { useNavigate } from "react-router-dom";
import styles from "./User.module.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

function User() {
  const navigate = useNavigate();

  const user = useSelector((st) => st.auth.user);
  const dispatch = useDispatch();

  const [src, setSrc] = useState(user.avatar ?? "https://i.pinimg.com/236x/02/72/35/02723528ae01d17bbf67ccf6b8da8a6b.jpg");

  function handleClick(e) {
    e.preventDefault();
    dispatch(logout());
    navigate("/");
  }

  return (
    <div className={styles.user}>
      <img
        onError={() => {
          setSrc(
            "https://i.pinimg.com/236x/02/72/35/02723528ae01d17bbf67ccf6b8da8a6b.jpg",
          )}
        }
        src={src}
        alt={user.name}
      />
      <span>Welcome, {user.name}</span>
      <button onClick={handleClick}>Logout</button>
    </div>
  );
}

export default User;
