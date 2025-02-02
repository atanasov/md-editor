import type { TreeItemData } from "@/types/types";
import { getParentFolder } from "@/utils/helper";

export class Tree {
    tree: TreeItemData[] = $state([]);
    rootPath: string = $state('');
    selectedPath: string = $state('');
    selectedItemPath: string = $state('');
    addNode(node: any) {
        this.tree.push(node);
    }

    unselectNodes() {
        const unselect = (nodes: TreeItemData[]) => {
            nodes.forEach(node => {
                node.selected = false;
                if (node.children) {
                    unselect(node.children);
                }
            });
        };
        unselect(this.tree);
    }

    toggleNodeByPath(path: string) {
        const toggle = (nodes: TreeItemData[], path: string) => {
            for (const node of nodes) {
                if (node.path === path) {
                    node.expanded = !node.expanded;
                    return;
                }
                if (node.children) {
                    toggle(node.children, path);
                }
            }
        };
        toggle(this.tree, path);
    }

    removeNodeByPath(path: string) {
        const remove = (nodes: TreeItemData[], path: string) => {
            for (let i = 0; i < nodes.length; i++) {
                if (nodes[i].path === path) {
                    nodes.splice(i, 1);
                    return;
                }
                if (nodes[i].children) {
                    remove(nodes[i].children, path);
                }
            }
        };
        remove(this.tree, path);
    }

    renameNodeByPath(path: string, name: string) {
        const rename = (nodes: TreeItemData[], path: string, name: string) => {
            for (const node of nodes) {
                if (node.path === path) {
                    node.name = name;
                    node.path = getParentFolder(path) + '/' + name;
                    return;
                }
                if (node.children) {
                    rename(node.children, path, name);
                }
            }
        };
        rename(this.tree, path, name);
    }

    findNodeByPath(path: string): TreeItemData | undefined {
        const find = (nodes: TreeItemData[], path: string): TreeItemData | undefined => {
            for (const node of nodes) {
                if (node.path === path) {
                    return node;
                }
                if (node.children) {
                    const found = find(node.children, path);
                    if (found) {
                        return found;
                    }
                }
            }
            return undefined;
        };
        return find(this.tree, path);
    }

    updateNodeByPath(path: string, node: TreeItemData) {
        const update = (nodes: TreeItemData[], path: string, node: TreeItemData) => {
            for (const n of nodes) {
                if (n.path === path) {
                    Object.assign(n, node);
                    return;
                }
                if (n.children) {
                    update(n.children, path, node);
                }
            }
        };
        update(this.tree, path, node);
    }

    addNodeToParentPath(path: string, type: 'file' | 'folder') {
        const timeStamp = new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate() + '-' + new Date().getHours() + '-' + new Date().getMinutes() + '-' + new Date().getSeconds();
        let node: TreeItemData = {
            path: (type == 'file') ? path + '/' + timeStamp + '.md' : path + '/' + timeStamp,
            name: timeStamp.toString(),
            type: type, 
            file: (type == 'file') ? timeStamp+'.md' : timeStamp,
            parentPath: path,
            children: [],
            editable: true,
            expanded: false,
            selected: false
        };

        const add = (nodes: TreeItemData[], path: string, node: TreeItemData) => {
            // check if path is root - parent of other nodes paths
            if (path === this.rootPath) {
                nodes.push(node);
                return;
            }
            // else find path and add node to it
            for (const n of nodes) {
                if (n.path === path) {
                    if (!n.children) {
                        n.children = [];
                    }
                    n.children.push(node);
                    return;
                }
                if (n.type == 'folder' && n.children) {
                    add(n.children, path, node);
                }
            }
        };
        add(this.tree, path, node);
    }

    selectNodeByPath(path: string) {
        this.unselectNodes();
        const select = (nodes: TreeItemData[], path: string) => {
            for (const node of nodes) {
                if (node.path === path) {
                    node.selected = true;
                    if (node.type === 'file') {
                        this.selectedPath = getParentFolder(path);
                    } else {
                        this.selectedPath = path;
                    }
                    this.selectedItemPath = path;
                    return true;
                }
                if (node.children && select(node.children, path)) {
                    return true;
                }
            }
            return false;
        };
        select(this.tree, path);
    }
}