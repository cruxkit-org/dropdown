// src/kit/dropdown.tsx
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import type { JSXElement }                  from '@minejs/jsx';
    import { signal, effect }                   from '@minejs/signals';
    import { DropdownManager }                  from './manager';
    import { Container, type ContainerProps }   from '@cruxkit/container';
    import { Button }                           from '@cruxkit/button';
    import { Text }                             from '@cruxkit/text';
    import { Icon, type IconProps, type IconName, IconConfig } from '@cruxkit/icon';
    import type { DropdownProps, DropdownSize, DropdownPosition, DropdownDirection } from '../types';

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

    type ContainerWithRefProps = ContainerProps & { ref?: (el: HTMLDivElement | null) => void };

    const MenuContainer = Container as (props: ContainerWithRefProps) => JSXElement;

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
        const direction = props.direction || 'down';
        const triggerMode = props.triggerMode || 'click';
        const triggerDisplay = props.triggerDisplay || 'label-icon';
        const hoverDelay = props.hoverDelay || 150;
        const styleMode = props.styleMode || 'arrow';
        const variant = props.variant || 'ghost';
        const color = props.color || 'neutral';

        const dropdownId = props.id || `dropdown-${Math.random().toString(36).substr(2, 9)}`;
        const parentId = props.parentId || null;

        const isOpen = signal(false);
        let hoverTimeout: ReturnType<typeof setTimeout> | null = null;
        let chevronElement: HTMLSpanElement | null = null;
        let dropdownContainer: HTMLDivElement | null = null;
        let dropdownMenu: HTMLDivElement | null = null;

        effect(() => {
            props.onOpenChange?.(isOpen());
        });

        const arrowSize = 6;
        let arrowStyle: Record<string, string> = {
            width: '0',
            height: '0'
        };

        if (direction === 'up') {
            arrowStyle = {
                width: '0',
                height: '0',
                borderLeft: `${arrowSize}px solid transparent`,
                borderRight: `${arrowSize}px solid transparent`,
                borderBottom: `${arrowSize}px solid var(--bg-surface)`,
                borderTop: '0'
            };
        } else if (direction === 'side') {
            arrowStyle = {
                width: '0',
                height: '0',
                borderTop: `${arrowSize}px solid transparent`,
                borderBottom: `${arrowSize}px solid transparent`,
                borderInlineStart: `${arrowSize}px solid var(--bg-surface)`,
                borderInlineEnd: '0'
            };
        } else {
            arrowStyle = {
                width: '0',
                height: '0',
                borderLeft: `${arrowSize}px solid transparent`,
                borderRight: `${arrowSize}px solid transparent`,
                borderTop: `${arrowSize}px solid var(--bg-surface)`,
                borderBottom: '0'
            };
        }

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
                if (dropdownContainer && !dropdownContainer.contains(e.target as Node)) {
                    DropdownManager.close(dropdownId);
                }
            };

            document.addEventListener('click', handleClickOutside);

            return () => {
                document.removeEventListener('click', handleClickOutside);
            };
        });

        const toggleDropdown = (e: Event) => {
            e.stopPropagation();
            const newState = !isOpen();

            if (newState) {
                DropdownManager.open(dropdownId);
                isOpen.set(true);
            } else {
                DropdownManager.close(dropdownId);
            }
        };

        const openDropdown = () => {
            if (hoverTimeout) clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(() => {
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

            if (dropdownMenu) {
                if (isCurrentlyOpen) {
                    dropdownMenu.classList.remove('hidden');
                    dropdownMenu.classList.add('flex');
                } else {
                    dropdownMenu.classList.remove('flex');
                    dropdownMenu.classList.add('hidden');
                }
            }
        });

        effect(() => {
            const isCurrentlyOpen = isOpen();

            if (!chevronElement) return;

            if (isCurrentlyOpen) {
                chevronElement.classList.add('rotate-180');
            } else {
                chevronElement.classList.remove('rotate-180');
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
                        ref={(el: HTMLSpanElement | null) => {
                            chevronElement = el;
                        }}
                        className="transition-transform duration-200"
                    >
                        <Icon name={'chevron-down' as IconName} size="sm" />
                    </span>
                );
            };

            const label =
                typeof props.trigger === 'string'
                    ? (
                        <Text as="span" size={sizeMap[size].text}>
                            {props.trigger}
                        </Text>
                    )
                    : props.trigger;

            switch (triggerDisplay) {
                case 'icon-only':
                    return (
                        <Container as="span" display="inline-flex" align="center" gap={1}>
                            {iconElement || renderChevron()}
                        </Container>
                    );

                case 'label-only':
                    return (
                        <Container as="span" display="inline-flex" align="center" gap={2}>
                            {label}
                            {renderChevron()}
                        </Container>
                    );

                case 'label-icon':
                default:
                    return (
                        <Container as="span" display="inline-flex" align="center" gap={2}>
                            {iconElement}
                            {label}
                            {renderChevron()}
                        </Container>
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
                ref={(el: HTMLDivElement | null) => {
                    dropdownContainer = el;
                }}
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
                    className={props.className}
                    {...triggerHandlers}
                >
                    <Container
                        as="span"
                        display="inline-flex"
                        align="center"
                        gap={sizeConf.text === 'sm' ? 1 : 2}
                    >
                        {typeof props.trigger === 'string'
                            ? renderTriggerContent()
                            : props.trigger}
                    </Container>
                </Button>

                <MenuContainer
                    as="div"
                    display="flex"
                    direction="column"
                    className={`
                        dropdown-menu
                        absolute
                        ${directionMap[direction].menu}
                        ${positionMap[position]}
                        hidden
                        bg-surface
                        shadow-lg
                        z-50
                        py-1
                        ${styleMode === 'partof'
                            ? 'w-full min-w-fit rounded-none border-x border-b border-1 mt-0'
                            : `w-full min-w-fit rounded-md border border-1 ${direction === 'down' ? 'mt-2' : ''} ${direction === 'up' ? 'mb-2' : ''}`}
                    `}
                    ref={(el: HTMLDivElement | null) => {
                        dropdownMenu = el;
                        if (el) {
                            setTimeout(() => {
                                if (isOpen()) {
                                    el.classList.remove('hidden');
                                    el.classList.add('flex');
                                } else {
                                    el.classList.remove('flex');
                                    el.classList.add('hidden');
                                }
                            }, 0);
                        }
                    }}
                    children={
                        <>
                            {styleMode === 'arrow' && props.labelArrow && (
                                <div
                                    className={`
                                        absolute
                                        ${directionMap[direction].arrow}
                                    `}
                                    style={arrowStyle}
                                />
                            )}

                            {props.options.map((option, idx) =>
                                option.divider ? (
                                    <div
                                        key={'divider-' + idx}
                                        className="h-px bg-1 opacity-20 my-1"
                                        role="separator"
                                    />
                                ) : (
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
                                )
                            )}
                        </>
                    }
                />
            </div>
        );
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝
