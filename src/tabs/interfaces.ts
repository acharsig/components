// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ButtonProps } from '../button/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface TabsProps extends BaseComponentProps {
  /**
   * Specifies the tabs to display. Each tab object has the following properties:
   *
   * - `id` (string) - The tab identifier. This value needs to be passed to the Tabs component as `activeTabId` to select this tab.
   * - `label` (ReactNode) - Tab label shown in the UI.
   * - `content` (ReactNode) - (Optional) Tab content to render in the container.
   * - `disabled` (boolean) - (Optional) Specifies if this tab is disabled.
   * - `disabledReason` (string) - (Optional) Displays tooltip near the tab when disabled. Use to provide additional context.
   * - `dismissible` (boolean) - (Optional) Determines whether the tab includes a dismiss icon button. By default, the dismiss button is not included.
   * - `dismissLabel` (boolean) - (Optional) Specifies an aria-label for the dismiss icon button.
   * - `dismissDisabled` (boolean) - (Optional) Determines whether the dismiss button is disabled.
   * - `action` (ReactNode) - (Optional) Action for the tab, rendered next to its corresponding label.
   *    Although it is technically possible to insert any content, our UX guidelines only allow you to add
   *    an icon button or icon button dropdown.
   * - `onDismiss` (ButtonProps['onClick']) - (Optional) Called when a user clicks on the dismiss button.
   * - `href` (string) - (Optional) You can use this parameter to change the default `href` of the internal tab anchor. The
   *    `click` event default behavior is prevented, unless the user clicks the tab with a key modifier (that is, CTRL,
   *    ALT, SHIFT, META). This enables the user to open new browser tabs with an initially selected component tab,
   *    if your application routing can handle such deep links. You can manually update routing on the current page
   *    using the `activeTabHref` property of the `change` event's detail.
   * - `contentRenderStrategy` (string) - (Optional) Determines when tab content is rendered:
       - `'active'`: (Default) Only render content when the tab is active.
   *   - `'eager'`: Always render tab content (hidden when the tab is not active).
   *   - `'lazy'`: Like 'eager', but content is only rendered after the tab is first activated.
   */
  tabs: ReadonlyArray<TabsProps.Tab>;

  /**
   * Actions for the tabs header, displayed next to the list of tabs.
   * Use this to add a button or button dropdown that performs actions on the
   * entire tab list. We recommend a maximum of one interactive element to
   * minimize the number of keyboard tab stops between the tab list and content.
   */
  actions?: React.ReactNode;

  /**
   * The possible visual variants of tabs are the following:
   * * `default` - Use in any context.
   * * `container` - Use this variant to have the tabs displayed within a container header.
   * * `stacked` - Use this variant directly adjacent to other stacked containers (such as a container, table).
   * @visualrefresh `stacked` variant
   */
  variant?: TabsProps.Variant;

  /**
   * Called whenever the user selects a different tab.
   * The event's `detail` contains the new `activeTabId`.
   */
  onChange?: NonCancelableEventHandler<TabsProps.ChangeDetail>;

  /**
   * The `id` of the currently active tab.
   * * If you don't set this property, the component activates the first tab and switches tabs automatically when a tab header is clicked (that is, uncontrolled behavior).
   * * If you explicitly set this property, you must set define an `onChange` handler to update the property when a tab header is clicked (that is, controlled behavior).
   */
  activeTabId?: string;

  /**
   * Provides an `aria-label` to the tab container.
   * Don't use `ariaLabel` and `ariaLabelledby` at the same time.
   */
  ariaLabel?: string;

  /**
   * Sets the `aria-labelledby` property on the tab container.
   * If there's a visible label element that you can reference, use this instead of `ariaLabel`.
   * Don't use `ariaLabel` and `ariaLabelledby` at the same time.
   */
  ariaLabelledby?: string;

  /**
   * Determines whether the tab content has padding. If `true`, removes the default padding from the tab content area.
   */
  disableContentPaddings?: boolean;

  /**
   * An object containing all the necessary localized strings required by the component.
   * @i18n
   */
  i18nStrings?: TabsProps.I18nStrings;
  /**
   * Enabling this property makes the tab content fit to the available height.
   * If the tab content is too short, it will stretch. If the tab content is too long, a vertical scrollbar will be shown.
   */
  fitHeight?: boolean;
  /**
   * Determines how the active tab is switched when navigating using
   * the keyboard. The options are:
   * - 'automatic' (default): the active tab is switched using the arrow keys.
   * - 'manual': a tab must be explicitly activated using the enter/space key.
   * We recommend using 'automatic' in most situations to provide consistent
   * and quick switching between tabs. Use 'manual' only if there is a specific
   * need to introduce friction to the switching of tabs.
   */
  keyboardActivationMode?: 'automatic' | 'manual';
}
export namespace TabsProps {
  export type Variant = 'default' | 'container' | 'stacked';

  export interface Tab {
    /**
     * The tab id. This value will be need to be passed to the Tabs component as `activeTabId` to select this tab.
     */
    id: string;
    /**
     * Tab label shown in the UI.
     */
    label: React.ReactNode;
    /**
     * Tab content to render in the container.
     */
    content?: React.ReactNode;
    /**
     * Whether this tab is disabled.
     */
    disabled?: boolean;
    /**
     * Provides a reason why this tab is disabled.
     */
    disabledReason?: string;
    /**
     * (Optional) Determines whether the tab includes a dismiss icon button. By default, the dismiss button is not included.
     * When a user clicks on this button the onDismiss handler is called.
     */
    dismissible?: boolean;
    /**
     * (Optional) Specifies an aria-label for the dismiss icon button.
     */
    dismissLabel?: string;
    /**
     * (Optional) Determines whether the dismiss button is disabled.
     */
    dismissDisabled?: boolean;
    /**
     * (Optional) Action for the tab, rendered next to its corresponding label.
     * Although it is technically possible to insert any content, our UX guidelines only allow you to add
     * an icon button or icon button dropdown.
     */
    action?: React.ReactNode;
    /**
     * (event => void) Called when a user clicks on the dismiss button.
     */
    onDismiss?: ButtonProps['onClick'];
    /**
     * You can use this parameter to change the default `href` of the internal tab anchor. The
     * `click` event default behavior is prevented, unless the user clicks the tab with a key modifier (CTRL,
     * ALT, SHIFT, META). This allows to open new browser tabs with an initially selected component tab,
     * when the routing can handle such deep links. You can manually update routing on the current page
     * using the `activeTabHref` property of the `change` event's detail.
     */
    href?: string;
    /**
     * Determines when tab content is rendered:
     * - 'active' (default): Only render content when the tab is active.
     * - 'eager': Always render tab content (hidden when the tab is not active).
     * - 'lazy': Like 'eager', but content is only rendered after the tab is first activated.
     */
    contentRenderStrategy?: 'active' | 'eager' | 'lazy';
  }

  export interface ChangeDetail {
    /**
     * The ID of the clicked tab.
     */
    activeTabId: string;
    /**
     * The `href` attribute of the clicked tab, if defined.
     */
    activeTabHref?: string;
  }

  export interface I18nStrings {
    /**
     * ARIA label for the scroll left button that appears when the tab header is wider than the container.
     */
    scrollLeftAriaLabel?: string;
    /**
     * ARIA label for the scroll right button that appears when the tab header is wider than the container.
     */
    scrollRightAriaLabel?: string;
    /**
     * ARIA role description for the Tabs component when an action or dismissible prop is in use. This is used
     * with role="application" to provide further information on the purpose of this component
     */
    tabsWithActionsAriaRoleDescription?: string;
  }
}
