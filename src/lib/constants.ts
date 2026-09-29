export const SITE_TITLE = "Zama15 Blog";
export const SITE_DESCRIPTION =
  "All about me, portfolio, my learnings and notes throu all my career.";
export const SITE_KEYWORDS = "blog, portfolio, developer";
export const SITE_AUTHOR = "Zama15";

export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  ABOUT_RESUME: "/resume.pdf",
  BLOG: "/blog",
  BLOG_DAILY: "/blog/daily",
  TAGS: "/tags",
  STATS: "/stats",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
