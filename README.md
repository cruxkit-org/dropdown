<!-- ╔══════════════════════════════ BEG ══════════════════════════════╗ -->

<br>
<div align="center">
    <p>
        <img src="./assets/img/logo.png" alt="logo" style="" height="60" />
    </p>
</div>

<div align="center">
    <img src="https://img.shields.io/badge/v-0.2.5-black"/>
    <a href="https://github.com/cruxkit-org"><img src="https://img.shields.io/badge/🔥-@cruxkit-black"/></a>
    <br>
    <img src="https://img.shields.io/badge/coverage-97.28%25-brightgreen" alt="Test Coverage" />
    <img src="https://img.shields.io/github/issues/cruxkit-org/dropdown?style=flat" alt="Github Repo Issues" />
    <img src="https://img.shields.io/github/stars/cruxkit-org/dropdown?style=social" alt="GitHub Repo stars" />
</div>
<br>

<!-- ╚═════════════════════════════════════════════════════════════════╝ -->



<!-- ╔══════════════════════════════ DOC ══════════════════════════════╗ -->

- ## Overview 👀
    - #### Why ?
        > A focused dropdown primitive built on the CruxKit stack. It combines
        > `@cruxkit/button`, `@cruxkit/container`, `@cruxkit/text`, and
        > `@cruxkit/icon` into a single, strongly‑typed API so you don’t have to
        > hand‑wire triggers, menus, icons, and nested dropdown behavior yourself.

    - #### When ?
        > Use it whenever you need a menu‑style interaction: user/profile menus,
        > “more actions” menus, dropdown filters, or nested contextual menus that
        > must share consistent sizing, variants, and behavior across an app.

    <br>
    <br>

- ## Quick Start 🔥

    > install [`hmm`](https://github.com/minejs-org/hmm) first.

    ```bash
    # in your terminal
    hmm i @cruxkit/dropdown
    ```

    ```ts
    // in your ts files
    import { Dropdown } from `@cruxkit/dropdown`;
    ```

    <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> </div>
    <br>


    - ### Basic usage

        ```tsx
        import { Dropdown } from '@cruxkit/dropdown';

        export function BasicDropdown() {
            return (
                <Dropdown
                    trigger="Open menu"
                    options={[
                        { label: 'Profile', value: 'profile' },
                        { label: 'Settings', value: 'settings' },
                        { label: 'Sign out', value: 'signout' }
                    ]}
                />
            );
        }
        ```

    - ### With options

        ```tsx
        import { Dropdown } from '@cruxkit/dropdown';

        export function AdvancedDropdown() {
            return (
                <Dropdown
                    variant="solid"
                    color="brand"
                    size="md"
                    direction="down"
                    position="end"
                    trigger="Actions"
                    triggerIcon="chevron-down"
                    triggerDisplay="label-icon"
                    labelArrow
                    styleMode="arrow"
                    options={[
                        { label: 'View', value: 'view', icon: 'eye' },
                        { label: 'Edit', value: 'edit', icon: 'edit-3' },
                        { label: 'Duplicate', value: 'duplicate', icon: 'copy' },
                        { label: 'Danger zone', value: 'danger', divider: true },
                        { label: 'Delete', value: 'delete', icon: 'trash-2', disabled: true }
                    ]}
                />
            );
        }
        ```

    <br>
    <br>

- ## Documentation 📑


    - ### API ⛓️

        - #### Functions

            ```tsx
            /**
             * Dropdown component that renders a customizable dropdown menu.
            *
            * @param props - Configuration object for the dropdown.
            * @returns Rendered dropdown JSX element.
            */
            export function Dropdown(props: DropdownProps): JSXElement
            ```

        - #### Types

            ```tsx
            export type DropdownSize            = 'sm' | 'md' | 'lg';
            export type DropdownPosition        = 'start' | 'center' | 'end';
            export type DropdownDirection       = 'down' | 'up' | 'side';
            export type DropdownTriggerMode     = 'click' | 'hover' | 'both';
            export type DropdownTriggerDisplay  = 'label-only' | 'label-icon' | 'icon-only';
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
            ```

        <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> </div>
        <br>

    - ### Related 🔗

        - ##### [@minejs/jsx](https://github.com/minejs-org/jsx)

        - ##### [@mineui/utils](https://github.com/mineui-org/utils)

        - ##### [@cruxkit/text](https://github.com/cruxkit-org/text)

        - ##### [@cruxkit/icon](https://github.com/cruxkit-org/icon)

        - ##### [@cruxkit/container](https://github.com/cruxkit-org/container)

        - ##### [@cruxkit/button](https://github.com/cruxkit-org/button)

        - ##### [@cruxkit/..](https://github.com/cruxkit-org)


<!-- ╚═════════════════════════════════════════════════════════════════╝ -->



<!-- ╔══════════════════════════════ END ══════════════════════════════╗ -->

<br>
<br>

---

<div align="center">
    <a href="https://github.com/maysara-elshewehy"><img src="https://img.shields.io/badge/by-Maysara-black"/></a>
</div>

<!-- ╚═════════════════════════════════════════════════════════════════╝ -->
