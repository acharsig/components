// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import useBaseComponent from '../../internal/hooks/use-base-component';
import { applyDisplayName } from '../../internal/utils/apply-display-name';
import { TopNavigationProps } from './interfaces';
import InternalTopNavigation from './internal';

export { TopNavigationProps };

/**
 * @beta
 * @version 1.0-beta
 * @deprecated The beta version is unsupported. Use the stable version of the component instead.
 */
export default function TopNavigation({ utilities = [], ...restProps }: TopNavigationProps) {
  const baseComponentProps = useBaseComponent('TopNavigation');
  return <InternalTopNavigation {...baseComponentProps} utilities={utilities} {...restProps} />;
}

applyDisplayName(TopNavigation, 'TopNavigation');
