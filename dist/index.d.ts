import { JSXElement } from '@minejs/jsx';
import { IconProps, IconName } from '@cruxkit/icon';

type DropdownSize = 'sm' | 'md' | 'lg';
type DropdownPosition = 'start' | 'center' | 'end';
type DropdownDirection = 'down' | 'up' | 'side';
type DropdownTriggerMode = 'click' | 'hover' | 'both';
type DropdownTriggerDisplay = 'label-only' | 'label-icon' | 'icon-only';
type DropdownStyleMode = 'classic' | 'arrow' | 'partof';
interface DropdownOption {
    label: string;
    value: string | number;
    icon?: IconProps | IconName;
    divider?: boolean;
    disabled?: boolean;
}
interface DropdownProps {
    id?: string;
    className?: string;
    parentId?: string | null;
    options: DropdownOption[];
    variant?: 'solid' | 'outline' | 'ghost' | 'link';
    size?: DropdownSize;
    position?: DropdownPosition;
    direction?: DropdownDirection;
    color?: 'brand' | 'success' | 'warning' | 'error' | 'neutral';
    labelArrow?: boolean;
    styleMode?: DropdownStyleMode;
    hoverDelay?: number;
    trigger: JSXElement | string;
    triggerIcon?: IconProps | IconName;
    triggerDisplay?: DropdownTriggerDisplay;
    triggerMode?: DropdownTriggerMode;
    onSelect?: (value: string | number) => void;
    onOpenChange?: (open: boolean) => void;
}
interface DropdownInstance {
    id: string;
    parentId?: string | null;
    close: () => void;
    level: number;
}

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
declare function Dropdown(props: DropdownProps): JSXElement;

export { Dropdown, type DropdownDirection, type DropdownInstance, type DropdownOption, type DropdownPosition, type DropdownProps, type DropdownSize, type DropdownStyleMode, type DropdownTriggerDisplay, type DropdownTriggerMode };
