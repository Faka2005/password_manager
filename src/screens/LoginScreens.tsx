import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import PasswordInput from '../components/Inputs/PasswordInput';
import Link from '@mui/material/Link';
import BasicAlerts from '../components/Alerts';
import { LoginUserApi } from '../utils/Auth';
import "../css/inputs.css";
import { useNavigate } from 'react-router-dom';



export default function LoginForm() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [alert, setAlert] = React.useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [loading, setLoading] = React.useState(false);
    const navigate =useNavigate()
    const [error, setError] = React.useState({
        email: false,
        password: false,
    });

    const [helperText, setHelperText] = React.useState({
        email: '',
        password: '',
    });

    const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

    const handleSubmit =async (e: React.FormEvent) => {
        e.preventDefault();
        let valid = true;




        // Validation Email
        if (!validateEmail(email)) {
            setError((prev) => ({ ...prev, email: true }));
            setHelperText((prev) => ({ ...prev, email: 'Email invalide' }));
            valid = false;
        } else {
            setError((prev) => ({ ...prev, email: false }));
            setHelperText((prev) => ({ ...prev, email: '' }));
        }

        // Validation Mot de passe
        if (password.length < 6) {
            setError((prev) => ({ ...prev, password: true }));
            setHelperText((prev) => ({
                ...prev,
                password: 'Le mot de passe doit contenir au moins 6 caractères',
            }));
            valid = false;
        } else {
            setError((prev) => ({ ...prev, password: false }));
            setHelperText((prev) => ({ ...prev, password: '' }));
        }



        if (valid) {
    //    Appel à ton API
       setLoading(true);
       const result = await LoginUserApi({ email, password });
       setLoading(false);
   
       if (result.success) {
         setAlert({ type: "success", message: "" });
         setEmail("");
         setPassword("");
         navigate("/", { replace: true }); //Emmener à la page d'accceuil et empêcher de revenir en arriére avec les fléches

       } else {
         setAlert({ type: "error", message: "Erreur" });
       }
        }
    };

    return (
        <div className="auth-page">
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 4, width: '300px' }}
        >
            <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error.email}
                helperText={helperText.email}
                required
            />
            <PasswordInput
                label="Mot de passe"
                value={password}
                onChange={setPassword}
                error={error.password}
                helperText={helperText.password}
                required
            />
            {alert && <BasicAlerts type={alert.type} message={alert.message} />}
            <Link href=''></Link>
            <Button type="submit" variant="contained" disabled={loading}>
                Valider
            </Button>
            <Link href='/register'>Pas de compte?Inscrivez-vous</Link>
        </Box>
        </div>
    );
}
