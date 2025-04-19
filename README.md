# 🧠 Lokales Setup – AI Assistant Projekt

Mit dieser Anleitung kannst du das Projekt lokal starten, inklusive Supabase & Ollama für RAG (Retrieval Augmented Generation).
Die vollständige .env-Datei sowie weitere Konfigurationen sind in diesem Repository nicht enthalten.
Wenn Sie das Projekt verwenden möchten, kontaktieren Sie uns bitte direkt, um Zugang zu den notwendigen Umgebungsvariablen und Einstellungen zu erhalten.

⚠️ **Hinweis zur Kompatibilität:** Das Projekt wurde primär für MacOS entwickelt und getestet. Die Funktionalität unter Windows kann eingeschränkt sein oder zusätzliche Konfigurationen erfordern.

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

## 📚 Schritt 6: Lokale Datenbank einrichten

Um die lokale Datenbank einzurichten, folge bitte den folgenden Schritten:

1. Öffne deinen Webbrowser und gehe zu [http://localhost:3000](http://localhost:3000), um auf die Supabase-Webseite zuzugreifen.

2. Klicke auf "SQL Editor", um den SQL-Editor zu öffnen.

3. Füge den folgenden Befehl ein, um die "pgvector" Erweiterung zu aktivieren und mit Einbettungsvektoren zu arbeiten:

```sql
-- Aktiviere die pgvector-Erweiterung, um mit Einbettungsvektoren zu arbeiten
create extension vector;
```

4. Erstelle eine Tabelle, um deine Dokumente zu speichern:

```sql
-- Erstelle eine Tabelle, um deine Dokumente zu speichern
create table documents (
    id bigserial primary key,
    content text, -- entspricht Document.pageContent
    metadata jsonb, -- entspricht Document.metadata
    embedding vector(1024) -- 1024 funktioniert für Ollama-Einbettungen, ändere es bei Bedarf
);
```

5. Erstelle eine Funktion, um nach Dokumenten zu suchen:

```sql
-- Erstelle eine Funktion, um nach Dokumenten zu suchen
create function match_documents (
    query_embedding vector(1024),
    match_count int DEFAULT null,
    filter jsonb DEFAULT '{}'
) returns table (
    id bigint,
    content text,
    metadata jsonb,
    embedding jsonb,
    similarity float
)
language plpgsql
as $$
#variable_conflict use_column
begin
    return query
    select
        id,
        content,
        metadata,
        (embedding::text)::jsonb as embedding,
        1 - (documents.embedding <=> query_embedding) as similarity
    from documents
    where metadata @> filter
    order by documents.embedding <=> query_embedding
    limit match_count;
end;
$$;
```

Damit ist deine lokale Datenbank eingerichtet und bereit für die Verwendung.

Und somit kannst du Upload funktionalitäten benutzen
