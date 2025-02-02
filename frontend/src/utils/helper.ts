  export function getFileNameFromPath(filePath: string): string {
    return filePath.split('/').pop() || '';
  }

  export function getParentFolder(filePath: string): string {
    return filePath.split('/').slice(0, -1).join('/');
  }

  export function decodeHtmlEntities(html:string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    let decoded = doc.documentElement.textContent?.toString() || '';
    decoded = decoded.replace(/&39;/g, "'"); // Manually handle &#39;
    return decoded;
  }