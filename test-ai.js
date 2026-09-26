const testAI = async () => {
  console.log("1. Creating dossier...");
  const dossierRes = await fetch("http://localhost:3000/api/dossiers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Impact de l'IA en entreprise",
      description: "Un test automatisé"
    })
  });
  const dossier = await dossierRes.json();
  console.log("Dossier created:", dossier.id);

  console.log("2. Adding source...");
  const sourceRes = await fetch(`http://localhost:3000/api/dossiers/${dossier.id}/sources`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Article tech 2026",
      url: "https://example.com/tech",
      content: "L'intelligence artificielle générative réduit le temps de codage de 40% en moyenne pour les tâches répétitives. Elle nécessite toutefois une supervision humaine pour valider les décisions architecturales complexes."
    })
  });
  const source = await sourceRes.json();
  console.log("Source added:", source.id);

  console.log("3. Testing Research AI...");
  const researchRes = await fetch(`http://localhost:3000/api/dossiers/${dossier.id}/research`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: "Combien de temps le codage est-il réduit grâce à l'IA ?"
    })
  });
  
  if (!researchRes.ok) {
    console.error("AI Research Error:", researchRes.status, await researchRes.text());
    return;
  }
  
  const result = await researchRes.json();
  console.log("\n--- AI Result ---");
  console.log(JSON.stringify(result, null, 2));
  console.log("-----------------\n");
  
  console.log("4. Testing Anti-Hallucination...");
  const fakeRes = await fetch(`http://localhost:3000/api/dossiers/${dossier.id}/research`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: "Quelle est la capitale de la France ?"
    })
  });
  const fakeResult = await fakeRes.json();
  console.log("\n--- Anti-Hallucination Result ---");
  console.log(JSON.stringify(fakeResult, null, 2));
  console.log("-----------------\n");
};

testAI().catch(console.error);
