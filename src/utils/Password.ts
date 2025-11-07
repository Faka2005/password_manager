import { InfoUser } from './Storagelocal';
export type Password={
    site:string,
    email:string,
    password:string,
    description?:string
}
interface ApiError {
  message?: string;
}
/**
 * Ajoute un mot de passe à la base de données
 * @param site -types Password
 * @param email -types Password
 * @param password -types Password
 * @param description -types Password
 */
export async function AddPassword({site, email,password,description}:Password){
    const userId =InfoUser('id')  
    try {
    const res = await fetch("https://api-password-manager.onrender.com/user/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId,site, email, password,description }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Erreur lors de l’inscription");
    }

    return { success: true, data };
    
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error("Erreur dans AddPassword :", err);
    return { success: false, message: err.message || "Erreur serveur" };
  }
}

/**
 * Ajoute un mot de passe à la base de données
 * @param userId - ID de l'utilisateur
 * @returns liste de mot de passe 
 */
export async function ListePassword(userId: string) {
  try {
    const res = await fetch(`https://api-password-manager.onrender.com/user/password/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Erreur lors de la récupération");
    }

    console.log("🔐 Données reçues :", data);

    // ✅ Correction ici : success avec deux "s"
    return { success: true, data: data.data || [] };

  } catch (error) {
    const err = error as ApiError;
    console.error("Erreur dans ListePassword :", err);
    return { success: false, message: err.message || "Erreur serveur" };
  }
}


/**
 * Supprime un mot de passe
 *@param id -Id du mot de passe à supprimer
 */
export async function DeletePassword(id: string) {
  try {
    const res = await fetch(`https://api-password-manager.onrender.com/user/password/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur lors de la suppression");

    return { success: true, message: data.message };
  } catch (error) {
    const err = error as ApiError;
    console.error("Erreur dans DeletePassword :", err);
    return { success: false, message: err.message || "Erreur serveur" };
  }
}

/**
 * Modifie un mot de passe
  *@param id -Id du mot de passe à modifier
 */
export async function ModifyPassword(id: string, password: string) {
  try {
    const res = await fetch(`https://api-password-manager.onrender.com/user/password/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur lors de la modification");

    return { success: true, message: data.message };
  } catch (error) {
    const err = error as ApiError;
    console.error("Erreur dans ModifyPassword :", err);
    return { success: false, message: err.message || "Erreur serveur" };
  }
}
