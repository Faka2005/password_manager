import * as React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import PasswordInput from "../components/Inputs/PasswordInput";
import BasicAlerts from "../components/Alerts";
import "../css/inputs.css";
import { RegisterUserApi } from "../utils/Auth";
import Link from "@mui/material/Link";



export default function RegisterScreen() {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");


  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation simple
    if (!firstName || !lastName || !email || !password) {
      setAlert({ type: "error", message: "Tous les champs sont obligatoires" });
      return;
    }
    if (password !== confirmPassword) {
      setAlert({ type: "error", message: "Les mots de passe ne correspondent pas" });
      return;
    }

    // Appel à ton API
    setLoading(true);
    const result = await RegisterUserApi({ firstName, lastName, email, password });
    setLoading(false);

    if (result.success) {
      setAlert({ type: "success", message: result.message||"" });
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } else {
      setAlert({ type: "error", message: "Erreur" });
    }
  };

  return (
    <div className="auth-page">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          width: "300px",
          alignItems: "center",
          margin: "auto",
          marginTop: "50px",
        }}
      >
        <TextField
          label="Prénom"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <TextField
          label="Nom"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <PasswordInput
          label="Mot de passe"
          value={password}
          onChange={setPassword}
          required
        />
        <PasswordInput
          label="Confirmez le mot de passe"
          value={confirmPassword}
          onChange={setConfirmPassword}
          required
        />

        {alert && <BasicAlerts type={alert.type} message={alert.message} />}

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Chargement..." : "S'inscrire"}
        </Button>
        <Link href='/login'>Vous avez un compte?Connectez-vous</Link>
      </Box>
    </div>
  );
}
