import Anthropic from "@anthropic-ai/sdk";
import type { DailyData } from "./extract";

const MAX_INPUT_TOKENS = 4000;

function buildPrompt(data: DailyData): string {
  const commitLines = data.commits
    .map((c) => `- ${c.hash} ${c.message}`)
    .join("\n");

  const statsLine = `파일 ${data.stats.filesChanged}개 변경, +${data.stats.linesAdded} -${data.stats.linesRemoved}`;
  const sessionLine =
    data.claudeSession.sessionCount > 0
      ? `Claude 세션 ${data.claudeSession.sessionCount}회 (${data.claudeSession.totalSizeKB}KB)`
      : "";

  let input = `프로젝트: ${data.name} (${data.slug})
날짜: ${data.date}
통계: ${statsLine}
${sessionLine ? `AI 협업: ${sessionLine}` : ""}

커밋 목록:
${commitLines}`;

  // Rough token estimate: 1 token ~= 3 chars for Korean
  if (input.length > MAX_INPUT_TOKENS * 3) {
    const truncatedCommits = data.commits
      .slice(0, 10)
      .map((c) => `- ${c.hash} ${c.message}`)
      .join("\n");
    input = `프로젝트: ${data.name} (${data.slug})
날짜: ${data.date}
통계: ${statsLine}
${sessionLine ? `AI 협업: ${sessionLine}` : ""}

커밋 목록 (상위 10개, 총 ${data.commits.length}개):
${truncatedCommits}`;
  }

  return input;
}

export async function summarizeDaily(
  data: DailyData,
  model: string = "claude-haiku-4-5-20251001"
): Promise<string | null> {
  if (data.commits.length === 0 && data.claudeSession.sessionCount === 0) {
    return null;
  }

  const client = new Anthropic();
  const input = buildPrompt(data);

  try {
    const response = await client.messages.create({
      model,
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `당신은 개발 블로그 작성자입니다. 아래 개발 활동 데이터를 바탕으로 2-3 문단의 한국어 개발 블로그 엔트리를 작성해주세요.

규칙:
- 무엇을 만들었고, 어떤 문제를 풀었고, 흥미로운 점이 무엇인지 서술
- 기술적 디테일을 포함하되, 읽기 쉬운 문체로
- AI와 협업한 부분이 있으면 자연스럽게 언급
- 제목이나 날짜는 포함하지 마세요 (본문만)

${input}`,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    return textBlock ? textBlock.text : null;
  } catch (err) {
    console.error(
      `❌ Summarize failed for ${data.slug}: ${err instanceof Error ? err.message : String(err)}`
    );
    return null; // Upload raw data without summary
  }
}

export async function summarizeAll(
  dailyDataList: DailyData[],
  model?: string
): Promise<DailyData[]> {
  const results: DailyData[] = [];

  for (let i = 0; i < dailyDataList.length; i++) {
    const data = dailyDataList[i];
    const progress = `[${i + 1}/${dailyDataList.length}]`;
    console.log(`${progress} Summarizing ${data.slug}...`);

    const summary = await summarizeDaily(data, model);
    results.push({ ...data, summary: summary ?? undefined });

    if (summary) {
      console.log(`${progress} ${data.slug}: summary generated (${summary.length} chars)`);
    } else {
      console.log(`${progress} ${data.slug}: no summary (raw data only)`);
    }
  }

  return results;
}
