import * as admin from "firebase-admin";
import type { DailyData } from "./extract";

let db: admin.firestore.Firestore;

export function initFirebase() {
  if (admin.apps.length === 0) {
    const serviceAccountKey = process.env.DEVPULSE_FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
      throw new Error("DEVPULSE_FIREBASE_SERVICE_ACCOUNT_KEY env var is required");
    }
    const serviceAccount = JSON.parse(serviceAccountKey);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  db = admin.firestore();
}

export async function uploadDaily(data: DailyData): Promise<void> {
  const projectRef = db.collection("projects").doc(data.slug);
  const dailyRef = projectRef.collection("daily").doc(data.date);

  // Upsert daily data
  await dailyRef.set(
    {
      date: data.date,
      commits: data.commits,
      stats: data.stats,
      claudeSession: data.claudeSession,
      summary: data.summary || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

export async function updateProjectMeta(data: DailyData): Promise<void> {
  const projectRef = db.collection("projects").doc(data.slug);
  const doc = await projectRef.get();

  if (!doc.exists) {
    // Create project document
    const config = (await import("../devpulse.config")).projects.find(
      (p) => p.slug === data.slug
    );
    await projectRef.set({
      name: data.name,
      techStack: config?.techStack || [],
      url: config?.url || null,
      lastActivity: admin.firestore.Timestamp.fromDate(new Date(data.date)),
      totalCommits: data.stats.commitCount,
      totalSessions: data.claudeSession.sessionCount,
      recentActivity: [data.stats.commitCount],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } else {
    const existing = doc.data()!;
    const recentActivity: number[] = existing.recentActivity || [];
    recentActivity.push(data.stats.commitCount);
    // Keep only last 30 days
    while (recentActivity.length > 30) recentActivity.shift();

    const config = (await import("../devpulse.config")).projects.find(
      (p) => p.slug === data.slug
    );
    await projectRef.update({
      lastActivity: admin.firestore.Timestamp.fromDate(new Date(data.date)),
      totalCommits: admin.firestore.FieldValue.increment(data.stats.commitCount),
      totalSessions: admin.firestore.FieldValue.increment(data.claudeSession.sessionCount),
      recentActivity,
      ...(config?.url && { url: config.url }),
      ...(config?.techStack && { techStack: config.techStack }),
    });
  }
}

export async function updateOverviewStats(): Promise<void> {
  const projectsSnap = await db.collection("projects").get();
  let totalCommits = 0;
  let totalSessions = 0;
  const activeProjects: string[] = [];
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  projectsSnap.forEach((doc) => {
    const data = doc.data();
    totalCommits += data.totalCommits || 0;
    totalSessions += data.totalSessions || 0;
    if (data.lastActivity?.toDate() > sevenDaysAgo) {
      activeProjects.push(doc.id);
    }
  });

  await db
    .collection("stats")
    .doc("overview")
    .set(
      {
        totalProjects: projectsSnap.size,
        totalCommits,
        totalSessions,
        activeProjects,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
}

export async function uploadAll(dailyDataList: DailyData[]): Promise<void> {
  initFirebase();

  for (let i = 0; i < dailyDataList.length; i++) {
    const data = dailyDataList[i];
    const progress = `[${i + 1}/${dailyDataList.length}]`;
    console.log(`${progress} Uploading ${data.slug} (${data.date})...`);

    try {
      await uploadDaily(data);
      await updateProjectMeta(data);
      console.log(`${progress} ${data.slug}: uploaded`);
    } catch (err) {
      console.error(
        `${progress} ${data.slug}: UPLOAD ERROR - ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  console.log("Updating overview stats...");
  await updateOverviewStats();
  console.log("Done.");
}
