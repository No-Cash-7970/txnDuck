import { notFound } from 'next/navigation';

/** For each supported language, make Next JS generate a static page for the language when building
 * the project.
 * @returns List of languages as parameters
 */
export function generateStaticParams() {
  return [{catchAll: ['catch-all']}];
}

/** Catch-all route that directs to the 404 Not-Found page */
export default function CatchAll() {
  return notFound();
}
