import React, { useState, useEffect } from "react";
import axios from "axios";

const LoginComponent: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        email,
        password,
      });

      //Przechowywanie tokena dostepu i odswiezania w localStorage
      localStorage.setItem("accessToken", response.data.accees);
      localStorage.setItem("refreshToken", response.data.refresh);

      //Reset stanu bledu
      setError("");

      //Tu dodac przekierowanie po udanym logowaniu
    } catch (err) {
      setError("Nie udalo sie zalogowac. Sprawdz swoje dane logowania");
    }
  };

  return (
    <div>
      <h2>Logowanie</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Hasło:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Zaloguj</button>
      </form>
    </div>
  );
};

export default LoginComponent;
