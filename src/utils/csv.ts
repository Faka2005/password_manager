import Papa from "papaparse";
import { saveAs } from "file-saver";
import type { Password } from "./Password";
import { InfoUser } from "./Storagelocal";

export async function exportToCsv(userId: string) {
  try {
    const response = await fetch(
      `https://api-password-manager.onrender.com/user/password/${userId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Erreur lors de la récupération des mots de passe");
    }

    const data: Password[] = result.data || [];

    if (data.length === 0) {
      console.warn("Aucun mot de passe à exporter");
      return;
    }

    // 🔹 Conversion en CSV
    const csv = Papa.unparse(data);

    // 🔹 Création du fichier
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    // 🔹 Nom du fichier exporté
    const filename = `Mots_de_passe_${InfoUser('firstname')}.csv`;

    // 🔹 Téléchargement
    saveAs(blob, filename);

    console.log("✅ Export CSV réussi :", filename);
  } catch (error) {
    console.error("❌ Erreur lors de l'exportation des mots de passe :", error);
  }
}

/**
 * Importe des mots de passe depuis un fichier CSV
 * @param file - Fichier CSV à importer
 * @return Liste des mots de passe importés
 */
export function importFromCsv(file: File): Promise<Password[]> {
    return new Promise((resolve, reject) => {
        Papa.parse<Password>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length) {
                    console.error("❌ Erreurs lors de l'importation CSV :", results.errors);
                    reject(results.errors);
                } else {
                    console.log("✅ Import CSV réussi :", results.data);
                    resolve(results.data);
                }
            },
            error: (error) => {
                console.error("❌ Erreur lors de la lecture du fichier CSV :", error);
                reject(error);
            }
        });
    });

}