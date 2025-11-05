import type { RegisterUser,LoginUser } from './Storagelocal';
import { setUserStorage } from './Storagelocal';
// api/Register.ts
interface ApiError {
  message?: string;
}



export async function RegisterUserApi(
{  firstName,
  lastName,
  email,
  password,
  }:RegisterUser
) {
  try {
    const res = await fetch("https://api-password-manager.onrender.com/register/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Erreur lors de l’inscription");
    }

    return { success: true, data };
    
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error("Erreur dans RegisterUserApi :", err);
    return { success: false, message: err.message || "Erreur serveur" };
  }
}


export async function LoginUserApi(
  {email,
  password}:LoginUser
) {
  try {
    const res = await fetch("https://api-password-manager.onrender.com/login/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({  email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Erreur lors de la connexion");
    }
    if(data.profile)setUserStorage(data.profile)
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error("Erreur dans RegisterUserApi :", err);
    return { success: false, message: err.message || "Erreur serveur" };
  }
}

export function logout(){
  localStorage.removeItem('user')
  window.location.reload();
}

