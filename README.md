# Journalist Research Workspace

Un prototype d'application web pour permettre aux journalistes de gérer des dossiers documentaires et d'interroger leurs sources grâce à l'intelligence artificielle. Ce projet a été conçu pour un entretien technique.

## Fonctionnalités

*   **Gestion des dossiers** : Créez et organisez vos dossiers journalistiques.
*   **Ajout de sources** : Ajoutez manuellement du contenu textuel (articles, rapports, notes).
*   **Recherche IA** : Posez des questions sur le contenu du dossier. L'IA analyse *uniquement* les sources fournies pour formuler une réponse.
*   **Traçabilité** : Chaque réponse générée par l'IA est accompagnée de citations précises renvoyant aux sources.
*   **Anti-hallucination** : L'IA est instruite pour indiquer clairement si les sources ne permettent pas de répondre à la question.

## Stack technique

*   **Frontend** : Next.js 15 (App Router), React, Tailwind CSS, TypeScript
*   **Backend** : Next.js API Routes, Prisma ORM
*   **Base de données** : PostgreSQL
*   **IA** : OpenAI API (GPT-4o), Zod (Validation structurée)

## Installation et démarrage local

1.  **Cloner ou ouvrir le projet**
2.  **Installer les dépendances**
    ```bash
    npm install
    ```
3.  **Configurer les variables d'environnement**
    Copiez le fichier `.env.example` vers `.env.local` et `.env` :
    ```bash
    cp .env.example .env
    ```
    Remplissez les valeurs :
    *   `DATABASE_URL`: Chaîne de connexion à votre base PostgreSQL (ex: `postgresql://user:password@localhost:5432/journalism?schema=public`).
    *   `OPENAI_API_KEY`: Votre clé secrète OpenAI.
4.  **Initialiser la base de données**
    ```bash
    npx prisma db push
    ```
5.  **Lancer le serveur de développement**
    ```bash
    npm run dev
    ```
    Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Architecture

Le flux de la recherche IA est le suivant :
1.  Le frontend envoie la question au backend (`/api/dossiers/[id]/research`).
2.  Le backend récupère toutes les sources du dossier via Prisma.
3.  Le backend construit un contexte textuel structuré contenant la question et les sources.
4.  La requête est envoyée à l'API OpenAI avec des instructions strictes (`system prompt`) et une attente de réponse au format JSON (Structured Outputs).
5.  La réponse est validée côté serveur avec **Zod**.
6.  Le frontend affiche la réponse et les citations au journaliste.

## Évolution future (Vers le RAG)

Pour ce prototype, l'intégralité du texte des sources est envoyée à OpenAI à chaque question. Cela fonctionne bien pour un MVP avec quelques articles.

Pour un passage à l'échelle (des milliers de documents ou des PDF de 500 pages), l'architecture devra évoluer vers le **RAG (Retrieval-Augmented Generation)** :
1.  **Découpage et Vectorisation** : Lors de l'ajout d'une source, le texte sera découpé en segments (*chunks*), transformé en vecteurs via un modèle d'embedding (ex: `text-embedding-3-small`), puis stocké dans une base vectorielle (ex: `pgvector` sur PostgreSQL).
2.  **Recherche sémantique** : Lors d'une question, on comparera le vecteur de la question aux vecteurs de la base pour ne récupérer que les 5-10 segments les plus pertinents.
3.  **Génération** : Seuls ces segments pertinents seront envoyés à l'IA pour générer la réponse.
