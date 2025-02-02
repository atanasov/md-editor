- fix settings Open Update - DONE
- better theme sidebar/md editor - DONE
- Interface FileSystem - DONE
    - loadSettings - DONE
    - updateSettings - DONE
    - add currentFolder in settings - DONE
    - openFolder - DONE
    - openFile - DONE
    - mark active open note - DONE
    - add last open file in settings - DONE
    - split frontMatter - DONE
    - fix AutoScroll to top on switch files - DONE
    - add exanded: true/false for TreeView Items - DONE
    - load all expanded on initial load of TreeView - DONE
    - save file on update - DONE
    - add new file - DONE
    - rename File - DONE
    - delete file - DONE
    - add new folder - DONE
    - rename folder - DONE
    - delete folder - DONE
    - refactor contextMenu to configurable by trigger element DONE
    - treeView contextMenu - DONE
    - key mapping - DONE
    - font-size + - shortcodes - DONE
    - code highlights - DONE
    - treeView root folder cannot create files / folder no contextMenu - DONE
    - on open new folder clear editor - DONE
    - right click context menu fix bug

VERSION 2
    - modal window
    - search files and content
    - settings page
    - drag and drop file tree
    - tooltips for buttons
    - drop folder into editor and load it

API
```js
// Define rules for different APIs
const ankiRules = {
  getCards: { method: "GET", url: "/cards" },
  updateCard: { method: "POST", url: "/card/{id}" },
};

const googleRules = {
  search: { method: "GET", url: "/search?q={query}" },
};

// Initialize API client
const apiClient = new ApiClient("http://localhost:3000");

// Generate methods for Anki API
const ankiApi = apiClient.generateMethods(ankiRules);

// Generate methods for Google API
const googleApi = apiClient.generateMethods(googleRules);

// Example usage
(async () => {
  try {
    // Call Anki API
    const cards = await ankiApi.getCards();
    console.log(cards);

    const updatedCard = await ankiApi.updateCard({ id: 123 }, { front: "new content" });
    console.log(updatedCard);

    // Call Google API
    const results = await googleApi.search({ query: "Svelte 5" });
    console.log(results);
  } catch (err) {
    console.error(err.message);
  }
})();
```

TOOLS
- https://github.com/sibiraj-s/svelte-tiptap - 
- https://tabler.io/icons
- https://flyonui.com/ - UI library with many ready components not just css but js  as well working and simple based on daisyui
- https://github.com/iva2k/total-app
