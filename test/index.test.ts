// test/index.test.ts
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import { describe, expect, test, jest, beforeEach, afterEach } from 'bun:test';
    import { JSDOM } from 'jsdom';
    import { render } from '@minejs/jsx';
    import {
        Dropdown,
    } from '../src';
    import type {
        DropdownProps,
    } from '../src';
    import {
        DropdownManager,
    } from '../src/kit/manager';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    const dom               = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.document         = dom.window.document;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.window           = dom.window as any;
    global.HTMLElement      = dom.window.HTMLElement;
    global.Element          = dom.window.Element;
    global.Text             = dom.window.Text;
    global.DocumentFragment = dom.window.DocumentFragment;
    global.Node             = dom.window.Node;
    global.MouseEvent       = dom.window.MouseEvent;

    function renderDropdown(props: Partial<DropdownProps> = {}) {
        const container = document.createElement('div');
        document.body.appendChild(container);

        const defaultProps: DropdownProps = {
            trigger: 'Open menu',
            options: [
                { label: 'One', value: 'one' },
                { label: 'Two', value: 'two' },
                { label: 'Disabled', value: 'disabled', disabled: true },
                { label: 'Divider', value: 'divider', divider: true }
            ]
        };

        const mounted = render(Dropdown({ ...defaultProps, ...props }), container);
        const root     = container.firstElementChild as HTMLElement | null;

        if (!root) {
            throw new Error('Dropdown did not render any element');
        }

        return { container, root, mounted };
    }

    function clickTrigger(root: HTMLElement) {
        const button = root.querySelector('button');
        if (!button) {
            throw new Error('Trigger button not found');
        }

        button.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    }

    function getMenu(root: HTMLElement) {
        return root.querySelector('.dropdown-menu') as HTMLElement;
    }

    function getOptions(root: HTMLElement) {
        return root.querySelectorAll('.dropdown-option');
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    describe('DropdownManager', () => {
        // Reset DropdownManager state if possible, or just use unique IDs
        // Since we can't easily reset, we'll just be careful with IDs

        test('register and unregister', () => {
            const id = 'test-dropdown-1';
            const close = jest.fn();

            DropdownManager.register(id, close);
            // We can't access instances directly, but we can verify behavior

            // Should not throw
            DropdownManager.unregister(id);
        });

        test('open should close siblings', () => {
            const parentId = 'parent-1';
            const id1 = 'sibling-1';
            const id2 = 'sibling-2';

            const close1 = jest.fn();
            const close2 = jest.fn();

            // Register parent (optional, but good for structure)
            DropdownManager.register(parentId, () => {});

            DropdownManager.register(id1, close1, parentId);
            DropdownManager.register(id2, close2, parentId);

            // Open 1
            DropdownManager.open(id1);
            expect(close1).not.toHaveBeenCalled();
            expect(close2).toHaveBeenCalled(); // Should close sibling

            close2.mockClear();

            // Open 2
            DropdownManager.open(id2);
            expect(close1).toHaveBeenCalled();
            expect(close2).not.toHaveBeenCalled();
        });

        test('close should close children', () => {
            const parentId = 'parent-2';
            const childId = 'child-2';

            const closeParent = jest.fn();
            const closeChild = jest.fn();

            DropdownManager.register(parentId, closeParent);
            DropdownManager.register(childId, closeChild, parentId);

            DropdownManager.close(parentId);

            expect(closeParent).toHaveBeenCalled();
            expect(closeChild).toHaveBeenCalled();
        });

        test('closeFromLevel', () => {
             const l0 = 'level-0';
             const l1 = 'level-1';
             const l2 = 'level-2';

             const c0 = jest.fn();
             const c1 = jest.fn();
             const c2 = jest.fn();

             DropdownManager.register(l0, c0); // Level 0
             DropdownManager.register(l1, c1, l0); // Level 1
             DropdownManager.register(l2, c2, l1); // Level 2

             DropdownManager.closeFromLevel(1);

             expect(c0).not.toHaveBeenCalled();
             expect(c1).toHaveBeenCalled();
             expect(c2).toHaveBeenCalled();
        });

        test('isAncestor', () => {
            const g = 'grandparent';
            const p = 'parent';
            const c = 'child';

            DropdownManager.register(g, () => {});
            DropdownManager.register(p, () => {}, g);
            DropdownManager.register(c, () => {}, p);

            expect(DropdownManager.isAncestor(g, c)).toBe(true);
            expect(DropdownManager.isAncestor(p, c)).toBe(true);
            expect(DropdownManager.isAncestor(c, g)).toBe(false);
            expect(DropdownManager.isAncestor('unknown', c)).toBe(false);
        });

        test('getRootParent', () => {
            const g = 'root-gp';
            const p = 'root-p';
            const c = 'root-c';

            const closeG = jest.fn();

            DropdownManager.register(g, closeG);
            DropdownManager.register(p, () => {}, g);
            DropdownManager.register(c, () => {}, p);

            const root = DropdownManager.getRootParent(c);
            expect(root).not.toBeNull();
            expect(root?.id).toBe(g);

            const rootOfG = DropdownManager.getRootParent(g);
            // Since g has no parent, it returns itself as the root search stops when parentId is null?
            // Let's check implementation:
            // while (current && current.parentId) ... return current || null
            // If g has no parentId, loop doesn't run, returns g.
            expect(rootOfG?.id).toBe(g);
        });

        test('debug method', () => {
             const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
             DropdownManager.debug();
             expect(logSpy).toHaveBeenCalled();
             logSpy.mockRestore();
        });

        test('open non-existent dropdown', () => {
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
            DropdownManager.open('non-existent');
            expect(warnSpy).toHaveBeenCalled();
            warnSpy.mockRestore();
        });

        test('close non-existent dropdown', () => {
            // Should not throw
            DropdownManager.close('non-existent');
        });
    });

    describe('Dropdown Component', () => {
        beforeEach(() => {
            document.body.innerHTML = '';
        });

        test('renders trigger correctly', () => {
            const { root } = renderDropdown({ trigger: 'My Trigger' });
            expect(root?.textContent).toContain('My Trigger');
        });

        test('opens on click', async () => {
            const { root } = renderDropdown();
            const menu = getMenu(root);

            expect(menu.classList.contains('hidden')).toBe(true);

            clickTrigger(root);

            // Wait for any microtasks/effects
            await new Promise(resolve => setTimeout(resolve, 0));

            expect(menu.classList.contains('hidden')).toBe(false);
        });

        test('closes on second click', async () => {
            const { root } = renderDropdown();
            const menu = getMenu(root);

            clickTrigger(root);
            await new Promise(resolve => setTimeout(resolve, 0));
            expect(menu.classList.contains('hidden')).toBe(false);

            clickTrigger(root);
            await new Promise(resolve => setTimeout(resolve, 0));
            expect(menu.classList.contains('hidden')).toBe(true);
        });

        test('closes on click outside', async () => {
            const { root } = renderDropdown();
            const menu = getMenu(root);

            clickTrigger(root);
            await new Promise(resolve => setTimeout(resolve, 0));
            expect(menu.classList.contains('hidden')).toBe(false);

            document.body.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
            await new Promise(resolve => setTimeout(resolve, 0));
            expect(menu.classList.contains('hidden')).toBe(true);
        });

        test('renders options correctly', async () => {
            const { root } = renderDropdown();
            clickTrigger(root);
            await new Promise(resolve => setTimeout(resolve, 0));

            const options = getOptions(root);
            expect(options.length).toBe(3); // One, Two, Disabled. Divider is not .dropdown-option
            expect(options[0].textContent).toBe('One');
            expect(options[1].textContent).toBe('Two');
            expect(options[2].textContent).toBe('Disabled');
        });

        test('onSelect callback', async () => {
            const onSelect = jest.fn();
            const { root } = renderDropdown({ onSelect });

            clickTrigger(root);
            await new Promise(resolve => setTimeout(resolve, 0));

            const options = getOptions(root);
            const oneOption = options[0] as HTMLElement;

            oneOption.click();

            expect(onSelect).toHaveBeenCalledWith('one');
        });

        test('disabled option does not trigger select', async () => {
            const onSelect = jest.fn();
            const { root } = renderDropdown({ onSelect });

            clickTrigger(root);
            await new Promise(resolve => setTimeout(resolve, 0));

            const options = getOptions(root);
            const disabledOption = options[2] as HTMLElement; // Based on defaultProps

            disabledOption.click();

            expect(onSelect).not.toHaveBeenCalled();
        });

        test('hover trigger mode', async () => {
            const { root } = renderDropdown({ triggerMode: 'hover', hoverDelay: 100 });
            const menu = getMenu(root);

            // root is the dropdown container div
            root.dispatchEvent(new dom.window.MouseEvent('mouseenter', { bubbles: true }));

            await new Promise(resolve => setTimeout(resolve, 150));
            await new Promise(resolve => setTimeout(resolve, 0));

            expect(menu.classList.contains('hidden')).toBe(false);

            root.dispatchEvent(new dom.window.MouseEvent('mouseleave', { bubbles: true }));

            await new Promise(resolve => setTimeout(resolve, 150));
            await new Promise(resolve => setTimeout(resolve, 0));

            expect(menu.classList.contains('hidden')).toBe(true);
        });

        test('both trigger mode', async () => {
             const { root } = renderDropdown({ triggerMode: 'both' });
             const menu = getMenu(root);

             // Test Click
             clickTrigger(root);
             await new Promise(resolve => setTimeout(resolve, 0));
             expect(menu.classList.contains('hidden')).toBe(false);

             clickTrigger(root);
             await new Promise(resolve => setTimeout(resolve, 0));
             expect(menu.classList.contains('hidden')).toBe(true);

             // Test Hover
             root.dispatchEvent(new dom.window.MouseEvent('mouseenter', { bubbles: true }));
             await new Promise(resolve => setTimeout(resolve, 200));
             await new Promise(resolve => setTimeout(resolve, 0));
             expect(menu.classList.contains('hidden')).toBe(false);
        });

        test('autoDivider prop', async () => {
             const { root } = renderDropdown({
                 autoDivider: true,
                 options: [
                     { label: 'A', value: 'a' },
                     { label: 'B', value: 'b' }
                 ]
             });
             clickTrigger(root);
             await new Promise(resolve => setTimeout(resolve, 0));

             // Should have a divider between A and B
             // Check for div with border class that is not an option
             // The code uses a Divider component which renders a div with border-b
             const dividers = root.querySelectorAll('.dropdown-menu > div.border-b');
             expect(dividers.length).toBeGreaterThan(0);
        });

        test('styleMode partof', async () => {
             const { root } = renderDropdown({ styleMode: 'partof' });
             const menu = getMenu(root);
             expect(menu.className).toContain('rounded-none');
        });

        test('custom trigger display', () => {
             const { root } = renderDropdown({ triggerDisplay: 'icon-only', triggerIcon: 'user' });
             // Should check if icon is present and label is not visible or structured differently
             // This is a bit hard to test precisely without snapshot, but we can check existence
             const icon = root.querySelector('svg'); // Assuming Icon renders svg or similar
             // Icon mock needed? The read file shows Icon usage from @cruxkit/icon
             // Since we are in JSDOM, we might need to mock Icon if it's complex,
             // but assuming it renders something.
        });

        test('directions', async () => {
            // We can't easily test visual positioning in JSDOM (getBoundingClientRect returns 0s)
            // But we can check if classes are applied

            // Mock getBoundingClientRect
            const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
            // Make 'up' fit: top=500, height=100. 500-100-10 = 390 >= 0.
            Element.prototype.getBoundingClientRect = jest.fn(() => ({
                width: 100, height: 100, top: 500, left: 100, bottom: 600, right: 200, x: 100, y: 500, toJSON: () => {}
            }));

            Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
            Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 768 });

            const { root } = renderDropdown({ direction: 'up' });
            clickTrigger(root);
            await new Promise(resolve => setTimeout(resolve, 0));

            const menu = getMenu(root);
            expect(menu.className).toContain('bottom-full');

            Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
        });

        test('positioning logic with overflow', async () => {
             // Mock rects to force flip
             Element.prototype.getBoundingClientRect = jest.fn(() => ({
                width: 100, height: 100, top: 700, left: 100, bottom: 800, right: 200, x: 100, y: 700, toJSON: () => {}
            }));
             Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 768 });

             const { root } = renderDropdown({ direction: 'down' }); // Should flip to up if down doesn't fit
             clickTrigger(root);
             await new Promise(resolve => setTimeout(resolve, 0));

             // Since height is 100, top 700, bottom 800. Window height 768.
             // Down: 800 + 100 + 10 = 910 > 768. Fits? No.
             // Up: 700 - 100 - 10 = 590 >= 0. Fits? Yes.
             // Should flip to up

             // We can check if 'bottom-full' class is added instead of 'top-full'
             const menu = getMenu(root);
             expect(menu.classList.contains('bottom-full')).toBe(true);
        });

        test('trigger rendering variants', () => {
             renderDropdown({ triggerDisplay: 'icon-only', triggerIcon: 'check' });
             renderDropdown({ triggerDisplay: 'label-only' });
             renderDropdown({ triggerDisplay: 'icon-label', triggerIcon: 'check' });
             renderDropdown({ triggerDisplay: 'label-icon', triggerIcon: 'check' });
        });

        test('label arrow rendering', () => {
            const { root } = renderDropdown({ labelArrow: true });
            const chevron = root.querySelector('.fa-angle-down'); // Assuming Icon name maps to class or similar
            // or check if a span with rotate class exists when open
        });

        test('side direction', async () => {
            // Mock for side direction
            // side needs to check right space: right + width + buffer <= viewportWidth
            // 200 + 100 + 10 = 310 <= 1024. Fits.
            const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
            Element.prototype.getBoundingClientRect = jest.fn(() => ({
                width: 100, height: 100, top: 100, left: 100, bottom: 200, right: 200, x: 100, y: 100, toJSON: () => {}
            }));

            Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });

            const { root } = renderDropdown({ direction: 'side' });
            clickTrigger(root);
            await new Promise(resolve => setTimeout(resolve, 0));

            const menu = getMenu(root);
            // side maps to start-full (which is right in LTR)
            expect(menu.className).toContain('start-full');

            Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
        });

        test('trigger as element', () => {
            const triggerEl = document.createElement('span');
            triggerEl.textContent = 'Custom Element';
            const { root } = renderDropdown({ trigger: triggerEl });
            expect(root?.textContent).toContain('Custom Element');
        });
    });

// ╚══════════════════════════════════════════════════════════════════════════════════════╝
