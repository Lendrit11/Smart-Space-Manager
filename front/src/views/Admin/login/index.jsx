import React, { useState } from "react";

function Auth() {
  const [isRegister, setIsRegister] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          alert("Password-at nuk përputhen!");
          return;
        }

        const res = await fetch(
          `https://localhost:7218/api/user/register_admin?` +
            `FirstName=${encodeURIComponent(firstName)}&` +
            `lastName=${encodeURIComponent(lastName)}&` +
            `email=${encodeURIComponent(email)}&` +
            `phonenumber=${encodeURIComponent(phoneNumber)}&` +
            `password=${encodeURIComponent(password)}`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (!res.ok) {
          const text = await res.text();
          alert(text);
          return;
        }

        const data = await res.json();
        localStorage.setItem("accessToken", data.accessToken);
        alert("Register sukses");
      } else {
        const res = await fetch(
          `https://localhost:7218/api/user/login?` +
            `email=${encodeURIComponent(email)}&` +
            `password=${encodeURIComponent(password)}`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (!res.ok) {
          const text = await res.text();
          alert(text);
          return;
        }

        const data = await res.json();
        localStorage.setItem("accessToken", data.accessToken);
        alert("Login sukses");
      }
    } catch (err) {
      alert("Gabim me server");
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          {isRegister ? "Krijo Llogari" : "Mirësevini"}
        </h2>

        <p style={styles.subtitle}>
          {isRegister
            ? "Regjistrohu për të vazhduar"
            : "Identifikohu për të vazhduar"}
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
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

          {isRegister && (
            <>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                style={styles.input}
              />

              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                style={styles.input}
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                style={styles.input}
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={styles.input}
              />
            </>
          )}

          <button type="submit" style={styles.button}>
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <div style={styles.footer}>
          <span style={styles.text}>
            {isRegister ? "Ke tashmë llogari?" : "Nuk ke llogari?"}
          </span>
          <button
            onClick={() => setIsRegister(!isRegister)}
            style={styles.link}
          >
            {isRegister ? "Login" : "Register"}
          </button>
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
    marginBottom: 10,
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
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
  },
  footer: {
    marginTop: 20,
  },
  text: {
    fontSize: 13,
    marginRight: 5,
  },
  link: {
    background: "none",
    border: "none",
    color: "#6e8efb",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: "bold",
  },
};

export default Auth;
