import { parse, stringify } from 'yaml';

type FrontmatterAndMarkdown = {
	frontmatter: string;
	markdown: string;
  };
  
  /**
   * Splits the frontmatter and markdown from a file content.
   * Handles missing frontmatter or markdown gracefully.
   * 
   * @param content - The content of the file (frontmatter + markdown).
   * @returns An object containing `frontmatter` and `markdown`.
   */
  export function splitFrontmatter(content: string): FrontmatterAndMarkdown {
	// Check if the file starts with frontmatter
	if (content.startsWith('---')) {
	  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	  if (match) {
		const [, frontmatter, markdown] = match;
		return { frontmatter, markdown };
	  }
	  // Handle case where closing `---` is missing
	  const partialMatch = content.match(/^---\n([\s\S]*?)\n---\n?/);
	  if (partialMatch) {
		const [, frontmatter] = partialMatch;
		return { frontmatter, markdown: '' };
	  }
	}
  
	// If no valid frontmatter is found, treat everything as markdown
	return { frontmatter: '', markdown: content };
  }

// Function to parse frontmatter into an array of key-value pairs
export function parseFrontmatter (frontmatter: string): null | Record<string, any> {
	try {
		return parse(frontmatter);
	  } catch (error) {
		console.error('Error parsing YAML:', error);
		return null; // Return a default value or handle the error appropriately
	}
}

// Function to convert an object back to YAML frontmatter string
export function stringifyFrontmatter (data: Record<string, any>): null | string {
	const frontmatter = stringify(data);
	try {
		return `---\n${frontmatter}---\n`;
	} catch (error) {
		console.error('Error parsing YAML:', error);
		return null; // Return a default value or handle the error appropriately
	}
}

