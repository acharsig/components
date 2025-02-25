// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

export interface TokenListProps<Item> {
  alignment: 'vertical' | 'horizontal' | 'inline' | 'horizontal-grid';
  items: readonly Item[];
  limit?: number;
  after?: React.ReactNode;
  renderItem: (item: Item, itemIndex: number) => React.ReactNode;
  i18nStrings?: I18nStrings;
  onExpandedClick?: (isExpanded: boolean) => void;
  limitShowFewerAriaLabel?: string;
  limitShowMoreAriaLabel?: string;
}

export interface I18nStrings {
  limitShowFewer?: string;
  limitShowMore?: string;
}
