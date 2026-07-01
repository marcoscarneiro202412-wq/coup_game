import { useRef } from "react";
import styles from "./styles/AuthPage.module.css";
import { login, signup } from "../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import NavBar from "../components/ui/NavBar";
function Login({ isLoginPage }) {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passRef = useRef(null);
  const imgRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  if (isAuthenticated) return <Navigate to={"/game"} />;

  return (
    <>
      <div className={styles.auth}>
        <NavBar />
        <div className={styles.principal}>
          <h1>{isLoginPage ? "Login" : "Signup"}</h1>
          <form className={styles.form}>
            {!isLoginPage && (
              <input
                style={{ border: error ? `2px solid red` : "" }}
                disabled={isLoading}
                type="text"
                required
                placeholder="Nome do Jogador"
                ref={nameRef}
              />
            )}
            <input
              style={{ border: error ? `2px solid red` : "" }}
              disabled={isLoading}
              type="email"
              required
              placeholder={`${isLoginPage ? "Nome/" : ""}Email do Jogador`}
              ref={emailRef}
            />

            <input
              style={{ border: error ? `2px solid red` : "" }}
              disabled={isLoading}
              placeholder="Senha"
              type="password"
              required
              ref={passRef}
            />
            {!isLoginPage && (
              <input
                style={{ border: error ? `2px solid red` : "" }}
                disabled={isLoading}
                placeholder="Url da imagem do jogador"
                type="text"
                ref={imgRef}
              />
            )}
            <button
              disabled={isLoading}
              onClick={(e) => {
                e.preventDefault();
                if (isLoading) return;
                if (!emailRef.current?.value || !passRef.current?.value) {
                  alert("Preencha ambos os campos");
                  return;
                }

                if (isLoginPage) {
                  dispatch(
                    login({
                      name: emailRef.current?.value,
                      password: passRef.current?.value,
                    }),
                  );
                } else {
                  console.log(nameRef, emailRef, passRef, imgRef);
                  dispatch(
                    signup({
                      name: nameRef.current.value,
                      email: emailRef.current.value,
                      password: passRef.current.value,
                      avatar: imgRef.current.value,
                    }),
                  );
                }
              }}
            >
              {isLoginPage ? "Login" : "Signup"}
            </button>
            {
              <p
                style={{
                  textAlign: "center",
                  color: "red",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                {error}
              </p>
            }

            {!isLoading && (
              <p
                style={{
                  textAlign: "center",
                  color: "#fff",
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate(isLoginPage ? "/signup" : "/login");
                }}
              >
                {isLoginPage
                  ? "Não tem uma conta? Clique aqui para ir para signup"
                  : "Já tem uma conta? Clique aqui para ir para login"}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
