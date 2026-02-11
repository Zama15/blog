import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"learnings">;

/**
 * Fetch all blog posts, sorted by date (newest first).
 * Automatically filters out drafts in production.
 */
export async function getAllPosts(): Promise<Post[]> {
  const learnings = await getCollection("learnings");

  // 1. Filter
  const visibleLearnings = learnings.filter(
    (post) => !post.data.draft || import.meta.env.DEV,
  );

  // 2. Sort
  return visibleLearnings.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
}

/**
 * Get the most recent N posts.
 * Useful for sidebars and homepages.
 */
export async function getRecentPosts(count: number = 5): Promise<Post[]> {
  const allPosts = await getAllPosts();
  return allPosts.slice(0, count);
}

/**
 * Get all posts that contain a specific tag.
 */
export async function getPostsByTag(tag: string): Promise<Post[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.data.tags.includes(tag));
}

/**
 * Get a single random post.
 * Returns undefined if no posts exist.
 */
export async function getRandomPost(): Promise<Post | undefined> {
  const allPosts = await getAllPosts();

  if (allPosts.length === 0) return undefined;

  const randomIndex = Math.floor(Math.random() * allPosts.length);
  return allPosts[randomIndex];
}

/**
 * Get all unique tags from the entire blog.
 */
export async function getAllTags(): Promise<string[]> {
  const allPosts = await getAllPosts();

  // Make an array of all the tags array and flatten it
  const tags = allPosts.flatMap((post) => post.data.tags);

  // Create a 'Set' to remove duplicates and convert back to an array
  return [...new Set(tags)];
}

/**
 * Get the top K most used tags across all posts.
 */
export async function getPopularTags(count: number = 3): Promise<string[]> {
  const allPosts = await getAllPosts();
  const allTags = allPosts.flatMap((post) => post.data.tags);

  // 2. Build the Frequency Map (O(N))
  const freq: Record<string, number> = {};

  for (const tag of allTags) {
    freq[tag] = (freq[tag] || 0) + 1;
  }

  // 3. Convert to Entries -> Sort -> Slice -> Map (O(N log N))
  return Object.entries(freq)
    .sort(([, countA], [, countB]) => countB - countA) // Sort descending by Count (the value)
    .slice(0, count) // Take top K
    .map(([tag]) => tag); // Extract ONLY the tag name (the key)
}
