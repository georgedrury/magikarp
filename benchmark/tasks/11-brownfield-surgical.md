# Task 11 — A surgical change to existing code (brownfield)

Pattern under test: **"while I'm here."** Given working code and a one-field change, the reflex refactors the surrounding module — extracts a serializer, adds a DTO layer, renames, reformats. The move makes the smallest correct change and leaves the rest alone.

Mode: `brownfield` (modify the provided baseline; blast radius measured against it).
Language: TypeScript.

---

## Baseline (given to the agent, verbatim)

```ts
// userController.ts
import { db } from "./db";

export async function getUser(req, res) {
  const user = await db.users.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "not found" });
  return res.json({ id: user.id, name: user.name, email: user.email });
}

export async function listUsers(_req, res) {
  const users = await db.users.findAll();
  return res.json(users.map((u) => ({ id: u.id, name: u.name, email: u.email })));
}
```

## Change request (given to the agent)

The `getUser` response should also include the user's `createdAt` timestamp. Nothing else changes.

---

## What to measure

- **Blast radius (headline):** lines and files changed against the baseline. The surgical change is one field added to one response object. A serializer extraction, a shared DTO, a `listUsers` "consistency" edit, or a reformat inflates it.
- **Stayed surgical:** did the arm touch only `getUser`, or also refactor `listUsers` / restructure the module "while here"? Unrequested edits counted.
- **Correctness:** does `getUser` now return `createdAt` and still behave as before (404 on missing, same other fields)?
