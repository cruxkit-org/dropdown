<!-- ╔══════════════════════════════ BEG ══════════════════════════════╗ -->

<br>
<div align="center">
    <p>
        <img src="./assets/img/logo.png" alt="logo" style="" height="60" />
    </p>
</div>

<div align="center">
    <img src="https://img.shields.io/badge/v-0.2.7-black"/>
    <a href="https://github.com/cruxkit-org"><img src="https://img.shields.io/badge/🔥-@cruxkit-black"/></a>
    <br>
    <img src="https://img.shields.io/badge/coverage-99.59%25-brightgreen" alt="Test Coverage" />
    <img src="https://img.shields.io/github/issues/cruxkit-org/dropdown?style=flat" alt="Github Repo Issues" />
    <img src="https://img.shields.io/github/stars/cruxkit-org/dropdown?style=social" alt="GitHub Repo stars" />
</div>
<br>

<!-- ╚═════════════════════════════════════════════════════════════════╝ -->



<!-- ╔══════════════════════════════ DOC ══════════════════════════════╗ -->

- ## Overview 👀

    - #### Why ?
        > A lightweight, reactive dropdown kit, built for [`@cruxjs`](https://github.com/cruxjs-org) ecosystem.

    - #### When ?
        > When you need a flexible, theme-ready dropdown that adapts to any design system and integrates seamlessly with your existing components.

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

        ```jsx
        export function BasicDropdown() {
            return (
                <Dropdown
                    trigger="Open menu"
                    options={[
                        { label: 'Profile',  value: 'profile'  },
                        { label: 'Settings', value: 'settings' },
                        { label: 'Sign out', value: 'signout'  }
                    ]}
                />
            );
        }
        ```

    - ### With options

        ```jsx
        <Dropdown
            variant         = 'outline'
            color           = "neutral"
            className       = "justify-start w-full"
            gap             = {4}
            trigger         = {t("common.docs")!}
            triggerIcon     = {{name: 'book-open', size: 'sm', class: 'opacity-50'}}
            triggerDisplay  = "label-icon"
            options         = {[
                { label: 'Core', value: 'core' },
                { label: 'Text', value: 'text' }
            ]}
            styleMode       = 'classic'
            autoDivider     = {true}
            labelArrow
        />
        ```

    <br>
    <br>

- ## Documentation 📑


    - ### API ⛓️

        - #### Functions

            ```tsx
            export function Dropdown(props: DropdownProps): JSXElement
            ```

        - #### Types

            ```tsx
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
            ```

        <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> </div>
        <br>

    - ### Related 🔗

        - ##### [@minejs/jsx](https://github.com/minejs-org/jsx)

        - ##### [@mineui/utils](https://github.com/mineui-org/utils)

        - ##### [@cruxkit/icon](https://github.com/cruxkit-org/icon)

        - ##### [@cruxkit/button](https://github.com/cruxkit-org/button)


<!-- ╚═════════════════════════════════════════════════════════════════╝ -->



<!-- ╔══════════════════════════════ END ══════════════════════════════╗ -->

<br>
<br>

---

<div align="center">
    <a href="https://github.com/maysara-elshewehy"><img src="https://img.shields.io/badge/by-Maysara-black"/></a>
</div>

<!-- ╚═════════════════════════════════════════════════════════════════╝ -->
