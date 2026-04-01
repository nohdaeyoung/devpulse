import type { ProjectMeta, DailyEntry, OverviewStats } from "./types";

function isFirebaseConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
}

async function getFirestore() {
  const { db } = await import("./firebase");
  return db;
}

export async function getOverviewStats(): Promise<OverviewStats | null> {
  if (!isFirebaseConfigured()) return null;
  const db = await getFirestore();
  const { doc, getDoc } = await import("firebase/firestore");
  const snap = await getDoc(doc(db, "stats", "overview"));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    totalProjects: data.totalProjects || 0,
    totalCommits: data.totalCommits || 0,
    totalSessions: data.totalSessions || 0,
    activeProjects: data.activeProjects || [],
    lastUpdated: data.lastUpdated?.toDate?.()?.toISOString() || "",
  };
}

export async function getAllProjects(): Promise<ProjectMeta[]> {
  if (!isFirebaseConfigured()) return [];
  const db = await getFirestore();
  const { collection, getDocs } = await import("firebase/firestore");
  const snap = await getDocs(collection(db, "projects"));
  const projects: ProjectMeta[] = [];
  snap.forEach((d) => {
    const data = d.data();
    projects.push({
      slug: d.id,
      name: data.name || d.id,
      techStack: data.techStack || [],
      url: data.url || undefined,
      lastActivity: data.lastActivity?.toDate?.()?.toISOString() || "",
      totalCommits: data.totalCommits || 0,
      totalSessions: data.totalSessions || 0,
      recentActivity: data.recentActivity || [],
    });
  });
  projects.sort(
    (a, b) =>
      new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
  );
  return projects;
}

export async function getProject(slug: string): Promise<ProjectMeta | null> {
  if (!isFirebaseConfigured()) return null;
  const db = await getFirestore();
  const { doc, getDoc } = await import("firebase/firestore");
  const snap = await getDoc(doc(db, "projects", slug));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    slug: snap.id,
    name: data.name || snap.id,
    techStack: data.techStack || [],
    url: data.url || undefined,
    lastActivity: data.lastActivity?.toDate?.()?.toISOString() || "",
    totalCommits: data.totalCommits || 0,
    totalSessions: data.totalSessions || 0,
    recentActivity: data.recentActivity || [],
  };
}

export async function getProjectDailyEntries(
  slug: string,
  maxEntries = 30
): Promise<DailyEntry[]> {
  if (!isFirebaseConfigured()) return [];
  const db = await getFirestore();
  const { collection, getDocs, query, orderBy, limit } = await import("firebase/firestore");
  const q = query(
    collection(db, "projects", slug, "daily"),
    orderBy("date", "desc"),
    limit(maxEntries)
  );
  const snap = await getDocs(q);
  const entries: DailyEntry[] = [];
  snap.forEach((d) => {
    const data = d.data();
    entries.push({
      date: data.date,
      commits: data.commits || [],
      stats: data.stats || {
        filesChanged: 0,
        linesAdded: 0,
        linesRemoved: 0,
        commitCount: 0,
      },
      claudeSession: data.claudeSession || { sessionCount: 0, totalSizeKB: 0 },
      summary: data.summary || undefined,
    });
  });
  return entries;
}

export async function getDailyEntry(
  slug: string,
  date: string
): Promise<DailyEntry | null> {
  if (!isFirebaseConfigured()) return null;
  const db = await getFirestore();
  const { doc, getDoc } = await import("firebase/firestore");
  const snap = await getDoc(doc(db, "projects", slug, "daily", date));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    date: data.date,
    commits: data.commits || [],
    stats: data.stats || {
      filesChanged: 0,
      linesAdded: 0,
      linesRemoved: 0,
      commitCount: 0,
    },
    claudeSession: data.claudeSession || { sessionCount: 0, totalSizeKB: 0 },
    summary: data.summary || undefined,
  };
}
