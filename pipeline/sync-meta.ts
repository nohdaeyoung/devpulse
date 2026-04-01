import { config } from "dotenv";
config({ path: ".env.local" });
import * as admin from "firebase-admin";
import { projects } from "../devpulse.config";

const serviceAccountKey = process.env.DEVPULSE_FIREBASE_SERVICE_ACCOUNT_KEY;
if (!serviceAccountKey) {
  console.error("DEVPULSE_FIREBASE_SERVICE_ACCOUNT_KEY is required");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccountKey)),
});

const db = admin.firestore();

async function syncMeta() {
  console.log("Syncing project metadata to Firestore...\n");

  for (const project of projects) {
    const ref = db.collection("projects").doc(project.slug);
    const doc = await ref.get();

    if (!doc.exists) {
      console.log(`  ${project.slug}: not in Firestore (skip)`);
      continue;
    }

    const updates: Record<string, unknown> = {
      name: project.name,
      techStack: project.techStack,
    };
    if (project.url) updates.url = project.url;

    await ref.update(updates);
    console.log(`  ${project.slug}: ${project.url || "(no url)"}`);
  }

  console.log("\nDone.");
}

syncMeta();
