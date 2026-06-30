const login = async (email, password) => {
  const res = await fetch("https://users-api-coup.onrender.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  const user = await res.json();
  if (res.ok) {
    return user;
  } else if (res.status == 401) {
    throw new Error("Credenciais Inválidas");
  } else {
    throw new Error("Ocorreu um erro inesperado");
  }
};

const signup = async (name, email, password, avatar) => {
  const userSchema = {
    name,
    email,
    password,
    avatar:
      avatar ??
      "https://i.pinimg.com/236x/02/72/35/02723528ae01d17bbf67ccf6b8da8a6b.jpg",
  };

  const res = await fetch("https://users-api-coup.onrender.com/auth/signup", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(userSchema),
  });
  const user = await res.json();
  if (res.ok) {
    return user;
  } else {
    throw new Error("Ocorreu um erro inesperado");
  }
};

export { login, signup };
