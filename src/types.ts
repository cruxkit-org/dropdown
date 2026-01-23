// src/types.ts
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import type { JSXElement }          from '@minejs/jsx';
    import type { IconProps, IconName } from '@cruxkit/icon';
import { ContainerGap } from '@cruxkit/container';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TYPE ════════════════════════════════════════╗
    
    export type DropdownSize            = 'sm' | 'md' | 'lg';
    export type DropdownPosition        = 'start' | 'center' | 'end';
    export type DropdownDirection       = 'down' | 'up' | 'side';
    export type DropdownTriggerMode     = 'click' | 'hover' | 'both';
    export type DropdownTriggerDisplay  = 'label-only' | 'label-icon' | 'icon-only' | 'icon-label';
    export type DropdownStyleMode       = 'classic' | 'arrow' | 'partof';

    export interface DropdownOption {
        label                           : string;
        value                           : string | number;
        icon?                           : IconProps | IconName;
        divider?                        : boolean;
        disabled?                       : boolean;
    }

    export interface DropdownProps {
        id?                             : string;
        className?                      : string;
        buttonClassName?                : string;
        gap?                            : ContainerGap;
        parentId?                       : string | null;

        options                         : DropdownOption[];
        variant?                        : 'solid' | 'outline' | 'ghost' | 'link';
        size?                           : DropdownSize;
        position?                       : DropdownPosition;
        direction?                      : DropdownDirection;
        color?                          : 'brand' | 'success' | 'warning' | 'error' | 'neutral';

        labelArrow?                     : boolean;
        autoDivider?                    : boolean;
        styleMode?                      : DropdownStyleMode;
        hoverDelay?                     : number;

        trigger                         : JSXElement | string;
        triggerIcon?                    : IconProps | IconName;
        triggerDisplay?                 : DropdownTriggerDisplay;
        triggerMode?                    : DropdownTriggerMode;
        
        onSelect?                       : (value: string | number) => void;
        onOpenChange?                   : (open: boolean) => void;
    }

    export interface DropdownInstance {
        id                              : string;
        parentId?                       : string | null;
        close                           : () => void;
        level                           : number;
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝
