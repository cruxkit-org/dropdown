// src/kit/dropdown.tsx
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import type { JSXProps, JSXElement }        from '@minejs/jsx';
    import { signal, effect, type Signal }      from '@minejs/signals';
    import { DropdownManager }                  from './manager';
    import { Button }                           from '@cruxkit/button';
    import { Icon, type IconProps, type IconName } from '@cruxkit/icon';
    import type { DropdownProps, DropdownSize, DropdownPosition, DropdownDirection } from '../types';

    // Local Components
    const Divider = ({ className }: { className?: string }) => (
        <div className={`w-full border-b border-border-1 opacity-50 ${className || ''}`} />
    );

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    const sizeMap: Record<DropdownSize, { text: 'sm' | 'md' | 'lg'; paddingX: 3 | 4 | 5; paddingY: 1 | 2 | 3 }> = {
        sm          : { text: 'sm', paddingX: 3, paddingY: 1 },
        md          : { text: 'md', paddingX: 4, paddingY: 2 },
        lg          : { text: 'lg', paddingX: 5, paddingY: 3 }
    };

    const positionMap: Record<DropdownPosition, string> = {
        start       : 'start-0',
        center      : 'start-1/2 -translate-x-1/2',
        end         : 'end-0'
    };

    const directionMap: Record<DropdownDirection, { menu: string; arrow: string }> = {
        down: {
            menu    : 'top-full',
            arrow   : 'bottom-full mb-1'
        },
        up: {
            menu    : 'bottom-full',
            arrow   : 'top-full mt-1'
        },
        side: {
            menu    : 'top-0 start-full ms-2',
            arrow   : 'top-1/2 end-full me-1 -translate-y-1/2'
        }
    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ CORE ════════════════════════════════════════╗

    const MenuContainer = 'div' as unknown as (props: JSXProps) => JSXElement;

    const getArrowStyle = (dir: DropdownDirection) => {
        const arrowSize = 6;
        if (dir === 'up') {
            return {
                width: '0',
                height: '0',
                borderLeft: `${arrowSize}px solid transparent`,
                borderRight: `${arrowSize}px solid transparent`,
                borderBottom: `${arrowSize}px solid var(--border-1)`,
                borderTop: '0',
                top: ''
            };
        } else if (dir === 'side') {
            return {
                width: '0',
                height: '0',
                borderTop: `${arrowSize}px solid transparent`,
                borderBottom: `${arrowSize}px solid transparent`,
                borderInlineStart: `${arrowSize}px solid var(--border-1)`,
                borderInlineEnd: '0',
                top: ''
            };
        } else {
            return {
                width: '0',
                height: '0',
                borderLeft: `${arrowSize}px solid transparent`,
                borderRight: `${arrowSize}px solid transparent`,
                borderTop: `${arrowSize}px solid var(--border-1)`,
                borderBottom: '0',
                top: '-7px'
            };
        }
    };

    /**
     * Dropdown component that renders a customizable dropdown menu.
     *
     * @param props - Configuration object for the dropdown.
     * @returns Rendered dropdown JSX element.
     *
     * @example
     * ```tsx
     * <Dropdown
     *   trigger="Options"
     *   options={[
     *     { label: 'Edit', value: 'edit' },
     *     { label: 'Delete', value: 'delete', disabled: true },
     *     { divider: true },
     *     { label: 'Export', value: 'export' }
     *   ]}
     *   onSelect={(value) => console.log(value)}
     * />
     * ```
     */
    export function Dropdown(props: DropdownProps): JSXElement {
        const size = props.size || 'md';
        const position = props.position || 'end';
        const initialDirection = props.direction || 'down';
        const triggerMode = props.triggerMode || 'click';
        const triggerDisplay = props.triggerDisplay || 'label-icon';
        const hoverDelay = props.hoverDelay || 150;
        const styleMode = props.styleMode || 'arrow';
        const variant = props.variant || 'ghost';
        const color = props.color || 'neutral';

        const dropdownId = props.id || `dropdown-${Math.random().toString(36).substr(2, 9)}`;
        const parentId = props.parentId || null;

        const isOpen = signal(false);
        const currentDirection = signal(initialDirection);
        let hoverTimeout: ReturnType<typeof setTimeout> | null = null;
        const chevronElement = signal<HTMLSpanElement | null>(null);
        const dropdownContainer = signal<HTMLDivElement | null>(null);
        const dropdownMenu = signal<HTMLDivElement | null>(null);
        const arrowPopup = signal<HTMLDivElement | null>(null);

        effect(() => {
            props.onOpenChange?.(isOpen());
        });

        // Initial Arrow Style (for SSR/first render if needed, though we update dynamically)
        const arrowStyle = getArrowStyle(initialDirection);

        DropdownManager.register(
            dropdownId,
            () => {
                isOpen.set(false);
            },
            parentId
        );

        effect(() => {
            return () => {
                DropdownManager.unregister(dropdownId);
                if (hoverTimeout) clearTimeout(hoverTimeout);
            };
        });

        effect(() => {
            const isCurrentlyOpen = isOpen();
            if (!isCurrentlyOpen) return;

            const handleClickOutside = (e: MouseEvent) => {
                const container = dropdownContainer();
                if (container && !container.contains(e.target as Node)) {
                    DropdownManager.close(dropdownId);
                }
            };

            document.addEventListener('click', handleClickOutside);

            return () => {
                document.removeEventListener('click', handleClickOutside);
            };
        });

        const updatePosition = () => {
            const menuEl = dropdownMenu();
            const containerEl = dropdownContainer();
            if (!menuEl || !containerEl) return;

            const triggerRect = containerEl.getBoundingClientRect();
            // Ensure menu is rendered for measurement
            const wasHidden = menuEl.classList.contains('hidden');
            if (wasHidden) {
                menuEl.style.visibility = 'hidden';
                menuEl.classList.remove('hidden');
                menuEl.classList.add('flex');
            }

            const menuRect = menuEl.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            if (wasHidden) {
                menuEl.classList.remove('flex');
                menuEl.classList.add('hidden');
                menuEl.style.visibility = '';
            }

            const checkSpace = (dir: DropdownDirection): boolean => {
                // Buffer for aesthetics
                const buffer = 10;
                if (dir === 'down') {
                    return triggerRect.bottom + menuRect.height + buffer <= viewportHeight;
                } else if (dir === 'up') {
                    return triggerRect.top - menuRect.height - buffer >= 0;
                } else if (dir === 'side') {
                    // Check right side primarily (as 'side' usually implies right/end)
                    // If RTL is supported, this might need adjustment, but 'start-full' is usually right in LTR.
                    // Assuming LTR for simplicity or 'side' maps to 'end'.
                    // If 'side' maps to 'start', we need to check left.
                    // The CSS for side is 'start-full', which means it goes to the END (Right in LTR).
                    return triggerRect.right + menuRect.width + buffer <= viewportWidth;
                }
                return false;
            };

            let bestDirection = initialDirection;

            // Priority: Requested -> Down -> Up -> Side
            // Or Requested -> Flip -> Side

            if (!checkSpace(bestDirection)) {
                if (checkSpace('down')) bestDirection = 'down';
                else if (checkSpace('up')) bestDirection = 'up';
                else if (checkSpace('side')) bestDirection = 'side';
                // If none fit, we stick to 'down' or requested (could add logic to pick 'most' space)
            }

            currentDirection.set(bestDirection);
        };

        const toggleDropdown = (e: Event) => {
            e.stopPropagation();
            const newState = !isOpen();

            if (newState) {
                updatePosition(); // Calculate position before opening
                DropdownManager.open(dropdownId);
                isOpen.set(true);
            } else {
                DropdownManager.close(dropdownId);
            }
        };

        const openDropdown = () => {
            if (hoverTimeout) clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(() => {
                updatePosition(); // Calculate position before opening
                DropdownManager.open(dropdownId);
                isOpen.set(true);
            }, hoverDelay);
        };

        const closeDropdown = () => {
            if (hoverTimeout) clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(() => {
                DropdownManager.close(dropdownId);
            }, hoverDelay);
        };

        const handleSelect = (value: string | number, disabled?: boolean) => {
            if (disabled) return;

            props.onSelect?.(value);
            DropdownManager.close(dropdownId);
        };

        effect(() => {
            const isCurrentlyOpen = isOpen();
            const menuEl = dropdownMenu();

            if (menuEl) {
                if (isCurrentlyOpen) {
                    menuEl.classList.remove('hidden');
                    menuEl.classList.add('flex');
                } else {
                    menuEl.classList.remove('flex');
                    menuEl.classList.add('hidden');
                }
            }
        });

        effect(() => {
            const dir = currentDirection();
            const menuEl = dropdownMenu();
            if (!menuEl) return;

            // Remove all direction classes
            Object.values(directionMap).forEach(d => {
                d.menu.split(' ').forEach(c => menuEl.classList.remove(c));
            });

            // Add new direction classes
            directionMap[dir].menu.split(' ').forEach(c => menuEl.classList.add(c));

            // Update arrow
            const arrowEl = arrowPopup();
            if (arrowEl && styleMode === 'arrow' && props.labelArrow) {
                // Remove old arrow classes
                Object.values(directionMap).forEach(d => {
                    d.arrow.split(' ').forEach(c => arrowEl.classList.remove(c));
                });
                // Add new arrow classes
                directionMap[dir].arrow.split(' ').forEach(c => arrowEl.classList.add(c));

                // Update arrow style
                const newStyle = getArrowStyle(dir);
                Object.assign(arrowEl.style, newStyle);

                // Clear potentially conflicting styles if they were set directly (though we use classes mostly)
                if (dir !== 'down') arrowEl.style.top = '';
                if (dir === 'down') arrowEl.style.top = '-7px';
            }
        });

        effect(() => {
            const isCurrentlyOpen = isOpen();
            const chevronEl = chevronElement();

            if (!chevronEl) return;

            if (isCurrentlyOpen) {
                chevronEl.classList.add('rotate-180');
            } else {
                chevronEl.classList.remove('rotate-180');
            }
        });

        const renderTriggerContent = () => {
            const iconElement = props.triggerIcon
                ? typeof props.triggerIcon === 'string'
                    ? <Icon name={props.triggerIcon as IconName} size="md" />
                    : <Icon {...props.triggerIcon} />
                : null;

            const renderChevron = () => {
                if (!props.labelArrow) return null;

                return (
                    <span
                        ref={chevronElement}
                        className="transition-transform duration-200 flex items-center"
                    >
                        <Icon name={'angle-down' as IconName} size="xxs" />
                    </span>
                );
            };

            const label =
                typeof props.trigger === 'string'
                    ? (
                        <div as="span" w="full" justify="between" display="inline-flex" textSize={sizeMap[size].text}>
                            {props.trigger}
                        </div>
                    )
                    : props.trigger;

            switch (triggerDisplay) {
                case 'icon-only':
                    return (
                        <div as="span" w={'full'} justify='between' display="inline-flex" align="center" gap={props.gap ?? 2}>
                            {iconElement || renderChevron()}
                        </div>
                    );

                case 'label-only':
                    return (
                        <div as="span" w={'full'} justify='between' display="inline-flex" align="center" gap={props.gap ?? 2}>
                            {label}
                            {renderChevron()}
                        </div>
                    );

                case 'icon-label':
                    return (
                        <div as="span" w={'full'} justify='between' display="inline-flex" align="center" gap={props.gap ?? 2}>
                            {label}
                            {iconElement}
                            {renderChevron()}
                        </div>
                    );

                case 'label-icon':
                default:
                    return (
                        <div as="span" w={'full'} justify='between' display="inline-flex" align="center" gap={props.gap ?? 2}>
                            {iconElement}
                            {label}
                            {renderChevron()}
                        </div>
                    );
            }
        };

        const getTriggerHandlers = () => {
            switch (triggerMode) {
                case 'hover':
                    return {
                        onMouseEnter: openDropdown,
                        onMouseLeave: closeDropdown
                    };

                case 'both':
                    return {
                        onClick: toggleDropdown,
                        onMouseEnter: openDropdown,
                        onMouseLeave: closeDropdown
                    };

                case 'click':
                default:
                    return {
                        onClick: toggleDropdown
                    };
            }
        };

        const triggerHandlers = getTriggerHandlers();

        const sizeConf = sizeMap[size];

        return (
            <div
                ref={dropdownContainer}
                className="dropdown relative inline-block"
                {...(triggerMode === 'hover' || triggerMode === 'both'
                    ? {
                        onMouseEnter: openDropdown,
                        onMouseLeave: closeDropdown
                    }
                    : {})}
            >
                <Button
                    variant={variant}
                    color={color}
                    size={size}
                    className={`${props.className || ''} ${props.buttonClassName || ''} w-full`}
                    {...triggerHandlers}
                    fullWidth
                    labelFullWidth
                >
                    {typeof props.trigger === 'string'
                        ? renderTriggerContent()
                        : (
                            <div
                                as="span" w={'full'} justify='between'
                                display="inline-flex"
                                align="center"
                                gap={props.gap ?? 2}
                            >
                                {props.trigger}
                            </div>
                        )}
                </Button>

                <MenuContainer
                    as="div"
                    display="flex"
                    direction="column"
                    className={`
                        dropdown-menu
                        absolute
                        ${directionMap[initialDirection].menu}
                        ${positionMap[position]}
                        hidden
                        bg-surface
                        shadow-lg
                        z-50
                        py-1
                        ${styleMode === 'partof'
                            ? 'w-full min-w-fit rounded-none border-x border-b border-1 mt-0'
                            : `w-full min-w-fit rounded-md border border-1 ${initialDirection === 'down' ? 'mt-2' : ''} ${initialDirection === 'up' ? 'mb-2' : ''}`}
                    `}
                    ref={dropdownMenu}
                    children={
                        <>
                            {styleMode === 'arrow' && props.labelArrow && (
                                <div
                                    ref={arrowPopup}
                                    className={`
                                        absolute
                                        ${directionMap[initialDirection].arrow}
                                    `}
                                    style={arrowStyle}
                                />
                            )}

                            {props.options.flatMap((option, idx) => {
                                const elements = [];

                                if (option.divider) {
                                    elements.push(
                                        <Divider
                                            className="my-1"
                                        />
                                    );
                                } else {
                                    elements.push(
                                        <Button
                                            variant="ghost"
                                            color={color}
                                            size={size}
                                            fullWidth
                                            className={`
                                                dropdown-option
                                                justify-start
                                                text-base
                                                text-1
                                                whitespace-nowrap
                                                ${option.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
                                            `}
                                            onClick={() => handleSelect(option.value, option.disabled)}
                                            disabled={option.disabled}
                                            leftIcon={option.icon as IconProps | IconName | undefined}
                                            type="button"
                                        >
                                            {option.label}
                                        </Button>
                                    );
                                }

                                const next = props.options[idx + 1];
                                if (
                                    props.autoDivider &&
                                    idx < props.options.length - 1 &&
                                    !option.divider &&
                                    (!next || !next.divider)
                                ) {
                                    elements.push(
                                        <Divider
                                            className="my-1"
                                        />
                                    );
                                }

                                return elements;
                            })}
                        </>
                    }
                />
            </div>
        );
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝
