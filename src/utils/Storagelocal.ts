import { useState, useEffect } from "react";
export type RegisterUser = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password:string
  theme?: string;
};
export type LoginUser={
  email:string,
  password:string
}
  export type ApiLogin={
    _id: string,
    userId: string,
    firstName: string,
    lastName: string,
    sexe:string,
    bio: string,
    filiere: string,
    niveau: string,
    interests: [],
    isTutor: boolean,
    campus: string,
    photoUrl: string,
}



/**
*Modifie le theme
*
* Pour utiliser dans un composant
*  const [theme, setTheme] = React.useState(GetTheme());
*  const toggleTheme = () => setTheme(GetTheme()); 
*/
export const GetTheme =()=>{
  const theme =localStorage.getItem('theme')
  const newTheme = theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme',newTheme)
  
}
/**
 * Sauvegarde un utilisateur dans le localStorage
 * @param user types ApiLogin
 */
export  const setUserStorage = (user: ApiLogin) => {
  localStorage.setItem('user', JSON.stringify(user));
  GetTheme()
};


/**
 * Récupère un utilisateur depuis le localStorage
 * @returns un json
 */
export const getUserStorage = (): ApiLogin | null => {
  const data = localStorage.getItem("user");
  if (!data) return null;

  try {
    //Transforme le json en type ApiLogin
    const user: ApiLogin = JSON.parse(data);
    return user;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return null;
  }
};


/**
 * Supprime l'utilisateur du localStorage
 */
export const removeUserStorage = () => {
  localStorage.removeItem('user');
};

export const getUserStorageTuple = (): [
  string, string, string, string
] => {
  const data = localStorage.getItem("user");
  if (!data) return ["", "", "", ""];

  try {
    const { _id, userId, firstName, lastName, } = JSON.parse(data);
    return [_id, userId || "", firstName, lastName ];
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return ["", "", "", ""];
  }
};


/**
 * Récupère une info spécifique de l'utilisateur
 * @param info :Info souhaiter
 * @returns Tous les infos sinon l'info choisi
 */
export const InfoUser = (info?: string) => {
  const [
    _id,
    userId,
    firstName,
    lastName,
  ] = getUserStorageTuple(); // Assure-toi que getUserStorageTuple() retourne un tuple de 11 éléments

  if (!info) {
    return {
      _id,
      userId,
      firstName,
      lastName,

    };
  }
 switch (info.toLowerCase()) {
    case "id": return _id || null;
    case "userid": return userId || null;
    case "firstname": return firstName || null;
    case "lastname": return lastName || null;
    default: return null;
  }
};




/**
 * Regarde si l'utilisateur est connecté ou pas
 * @returns Renvoie l'utilisateur si connecter
 */
export const useUserStorage = (): ApiLogin | null => {
  const [user, setUser] = useState<ApiLogin | null>(getUserStorage());

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getUserStorage());
    };

    // Écoute les changements dans le localStorage (même depuis un autre onglet)
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return user;
};
