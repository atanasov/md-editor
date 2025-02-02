import type { EditorData } from "@/types/types";
import { getFileNameFromPath } from "@/utils/helper";
import { parseFrontmatter, splitFrontmatter } from "@/utils/transformers";

export class Editor {
    content: EditorData = $state({name: "", markdown: "", frontmatter: {}});

    resetContent() {
      this.content.name = '';
      this.content.markdown = '';
      this.content.frontmatter = {};
    }

    setContent(path:string, data: string | null) {
      if (!data) {
        this.content.name = getFileNameFromPath(path);
        this.content.markdown = ' ';
        this.content.frontmatter = {};
        return;
      }
      this.content.name = getFileNameFromPath(path);
      let resultData = splitFrontmatter(data);
      let markdown = resultData.markdown;
      this.content.markdown = markdown;
      let frontmatter = resultData.frontmatter;
      if (frontmatter != '') {
        let result = parseFrontmatter(frontmatter);
        if (result) {
          this.content.frontmatter = result;
        } else {
          this.content.markdown = data;
          this.content.frontmatter = {};
        }
      } else {
          this.content.frontmatter = {};
      }
    }
}