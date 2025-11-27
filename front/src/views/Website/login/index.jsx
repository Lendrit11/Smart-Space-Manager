import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // këtu vendos logjikën e autentikimit
    alert(`Email: ${email}\nPassword: ${password}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Miresevini</h2>
        <p style={styles.subtitle}>Identifikohu për të vazhduar</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Login</button>
        </form>

        <div style={styles.footer}>
          <a href="#" style={styles.link}>Forgot password?</a>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "#fff",
    padding: "40px 30px",
    borderRadius: 15,
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    width: 350,
    textAlign: "center",
  },
  title: {
    margin: 0,
    marginBottom: 10,
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    margin: 0,
    marginBottom: 30,
    fontSize: 14,
    color: "#666",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  input: {
    padding: "12px 15px",
    borderRadius: 8,
    border: "1px solid #ddd",
    fontSize: 14,
    outline: "none",
    transition: "all 0.2s",
  },
  button: {
    padding: "12px",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(90deg, #6e8efb, #a777e3)",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  footer: {
    marginTop: 20,
  },
  link: {
    fontSize: 13,
    color: "#6e8efb",
    textDecoration: "none",
  },
};

export default Login;
