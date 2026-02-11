import { getAllPosts, getAllTags } from "../data";
import { truncateStr } from "../utils";

export interface ChartSegment {
  name: string;
  percent: number;
  dashArray: string;
  dashOffset: number;
}

export interface StatsData {
  totalPosts: number;
  totalTopics: number;
  lastUpdate: string;
  latestPost: string;
  chartSegments: ChartSegment[];
  radius: number;
  genTime: string;
}

export async function getStatsData(): Promise<StatsData> {
  const allPosts = await getAllPosts();
  const uniqueTopics = await getAllTags();

  // 1. Totals
  const totalPosts = allPosts.length;
  const totalTopics = uniqueTopics.length;

  // 2. Latest Post
  const latestPostObj = allPosts[0];
  const latestPostTitle = latestPostObj
    ? truncateStr(latestPostObj.data.title, 15)
    : "No posts yet";

  // 3. Last Update (Relative Time)
  let lastUpdate = "N/A";
  if (latestPostObj) {
    const diff = Math.ceil(
      (latestPostObj.data.date.getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    lastUpdate = rtf.format(diff, "day");
  }

  // 4. Chart Data (Top 3 + Others)
  const allTags = allPosts.flatMap((post) => post.data.tags);
  const totalTagCount = allTags.length;

  const tagCounts = allTags.reduce(
    (acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const sortedTags = Object.entries(tagCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .map(([name, count]) => ({
      name,
      percent: Math.round((count / totalTagCount) * 100),
    }));

  const top3 = sortedTags.slice(0, 3);
  const othersPercent = sortedTags
    .slice(3)
    .reduce((sum, item) => sum + item.percent, 0);

  const topTags = [
    ...top3,
    ...(othersPercent > 0 ? [{ name: "Others", percent: othersPercent }] : []),
  ];

  // 5. Chart Geometry Logic
  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  const chartSegments = topTags.map((tag) => {
    const arcLength = ((tag.percent || 0) / 100) * circumference;
    const dashArray = `${arcLength} ${circumference}`;
    const dashOffset = -currentOffset;
    currentOffset += arcLength;
    return { ...tag, dashArray, dashOffset };
  });

  // 6. Get compiled execution time
  const now = new Date();
  const shortTime =
    now.toISOString().replace("T", " ").substring(0, 16) + " UTC";

  return {
    totalPosts,
    totalTopics,
    lastUpdate,
    latestPost: latestPostTitle,
    chartSegments,
    radius,
    genTime: shortTime,
  };
}
