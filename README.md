# 🧠 Lokales Setup – AI Assistant Projekt

Mit dieser Anleitung kannst du das Projekt lokal starten, inklusive Supabase & Ollama für RAG (Retrieval Augmented Generation).

---

## ✅ Voraussetzungen

Installiere bitte vorher:

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Node.js (empfohlen v18+)](https://nodejs.org)
- [Ollama](https://ollama.com)

---

## 🚀 Setup & Start (nur einmal ausführen)

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Supabase lokal starten (nur beim ersten Mal dauert das etwas)
npx supabase start

# 3. Docker-Setup starten (für Vector DB, Imgproxy etc.)
npm run docker:setup

# 4. Embedding-Modell für RAG laden
ollama pull mxbai-embed-large

# (Optional) LLM lokal laufen lassen, z. B. llama3
ollama run llama3.2:1b

# 5. Projekt starten
npm run dev
```
