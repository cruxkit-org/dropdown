// src/kit/dropdown.tsx
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import { signal } from '@minejs/signals';
    import type { DropdownInstance } from '../types';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ CORE ════════════════════════════════════════╗

    class DropdownManagerClass {
        private instances = signal<DropdownInstance[]>([]);

        register(id: string, close: () => void, parentId: string | null = null): void {
            const level = this.calculateLevel(parentId);
            const instance: DropdownInstance = { id, parentId, close, level };
            this.instances.update(list => [...list, instance]);
        }

        unregister(id: string): void {
            this.instances.update(list => list.filter(item => item.id !== id));
        }

        open(id: string): void {
            const instance = this.instances().find(item => item.id === id);
            if (!instance) {
                console.warn('[DropdownManager] Cannot open - dropdown not found:', id);
                return;
            }

            const siblings = this.instances().filter(item =>
                item.id !== id &&
                item.level === instance.level &&
                item.parentId === instance.parentId
            );

            siblings.forEach(sibling => {
                sibling.close();
            });
        }

        close(id: string): void {
            const instance = this.instances().find(item => item.id === id);
            if (!instance) return;

            const children = this.getChildren(id);

            children.forEach(child => {
                child.close();
            });

            instance.close();
        }

        closeFromLevel(level: number): void {
            const toClose = this.instances().filter(item => item.level >= level);

            toClose.forEach(item => {
                item.close();
            });
        }

        private getChildren(parentId: string): DropdownInstance[] {
            const directChildren = this.instances().filter(item => item.parentId === parentId);
            const allChildren: DropdownInstance[] = [...directChildren];

            directChildren.forEach(child => {
                allChildren.push(...this.getChildren(child.id));
            });

            return allChildren;
        }

        private calculateLevel(parentId: string | null): number {
            if (!parentId) return 0;

            const parent = this.instances().find(item => item.id === parentId);
            return parent ? parent.level + 1 : 0;
        }

        isAncestor(ancestorId: string, descendantId: string): boolean {
            let current = this.instances().find(item => item.id === descendantId);

            while (current && current.parentId) {
                if (current.parentId === ancestorId) return true;
                current = this.instances().find(item => item.id === current!.parentId!);
            }

            return false;
        }

        getRootParent(id: string): DropdownInstance | null {
            let current = this.instances().find(item => item.id === id);

            while (current && current.parentId) {
                current = this.instances().find(item => item.id === current!.parentId!);
            }

            return current || null;
        }

        debug(): void {
            console.log('[DropdownManager] Registered dropdowns:', this.instances());
        }
    }

    export const DropdownManager = new DropdownManagerClass();

// ╚══════════════════════════════════════════════════════════════════════════════════════╝

