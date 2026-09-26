const testLang = async () => {
  try {
    const API_URL = "http://localhost:3000/api";

    // Create Dossier
    const dossierRes = await fetch(`${API_URL}/dossiers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Test de langue IA",
        description: "Vérification des instructions linguistiques"
      })
    });
    const dossier = await dossierRes.json();

    // Add Source (in English to test if it translates the answer to French based on question)
    await fetch(`${API_URL}/dossiers/${dossier.id}/sources`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Climate Report",
        content: "Global warming is causing sea levels to rise by 3.2 mm per year. This affects coastal cities significantly."
      })
    });

    // Test French Question
    console.log("--- TEST QUESTION EN FRANÇAIS ---");
    const resFR = await fetch(`${API_URL}/dossiers/${dossier.id}/research`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: "De combien les niveaux de la mer augmentent-ils par an ?"
      })
    });
    
    const dataFR = await resFR.json();
    console.log(JSON.stringify(dataFR, null, 2));

  } catch (error) {
    console.error("Error:", error.message);
  }
};

testLang();
