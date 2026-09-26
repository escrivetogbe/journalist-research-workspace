const testDelete = async () => {
  const API_URL = "http://localhost:3000/api";
  
  try {
    // 1. Create Dossier 1 and Source
    const resD1 = await fetch(`${API_URL}/dossiers`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Dossier 1 (To Delete)" })
    });
    const d1 = await resD1.json();
    await fetch(`${API_URL}/dossiers/${d1.id}/sources`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Source D1", content: "..." })
    });

    // 2. Create Dossier 2 and Source
    const resD2 = await fetch(`${API_URL}/dossiers`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Dossier 2 (To Keep)" })
    });
    const d2 = await resD2.json();
    await fetch(`${API_URL}/dossiers/${d2.id}/sources`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Source D2", content: "..." })
    });

    console.log(`Created D1: ${d1.id}, D2: ${d2.id}`);

    // 3. Delete Dossier 1
    const delRes = await fetch(`${API_URL}/dossiers/${d1.id}`, { method: 'DELETE' });
    if (!delRes.ok) throw new Error("Delete failed");
    console.log("Deleted D1 successfully");

    // 4. Verify D1 is gone, D2 is there
    const listRes = await fetch(`${API_URL}/dossiers`);
    const dossiers = await listRes.json();
    const d1Exists = dossiers.some(d => d.id === d1.id);
    const d2Exists = dossiers.some(d => d.id === d2.id);
    console.log(`D1 exists: ${d1Exists} (Expected: false)`);
    console.log(`D2 exists: ${d2Exists} (Expected: true)`);

    // 5. Verify sources
    const s1Res = await fetch(`${API_URL}/dossiers/${d1.id}/sources`);
    const s1Sources = await s1Res.json();
    // if D1 is deleted, this might return 500 or empty array depending on implementation
    // Actually the API /api/dossiers/[id]/sources doesn't check if dossier exists, just where: { dossierId }
    console.log(`D1 sources count: ${s1Sources.length || 0} (Expected: 0)`);

    const s2Res = await fetch(`${API_URL}/dossiers/${d2.id}/sources`);
    const s2Sources = await s2Res.json();
    console.log(`D2 sources count: ${s2Sources.length} (Expected: 1)`);

  } catch (error) {
    console.error("Test failed:", error);
  }
};
testDelete();
