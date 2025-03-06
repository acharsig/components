// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState, useRef } from 'react';

import { useModalContext } from '../../context/modal-context';
import { useDOMAttribute } from '../use-dom-attribute';
import { useEffectOnUpdate } from '../use-effect-on-update';
import { useRandomId } from '../use-unique-id';

const EVALUATE_COMPONENT_VISIBILITY_EVENT = 'awsui-evaluate-component-visibility';

/**
 * This hook manages a boolean state (`evaluateComponentVisibility`) that toggles
 * whenever a custom DOM event (`EVALUATE_COMPONENT_VISIBILITY_EVENT`) is triggered.
 *
 * @returns
 */
// const useEvaluateComponentVisibility = () => {
//   const [evaluateComponentVisibility, setEvaluateComponentVisibility] = useState(false);

//   useEffect(() => {
//     const handleEvaluateComponentVisibility = () => {
//       setEvaluateComponentVisibility(prev => !prev);
//     };

//     document.addEventListener(EVALUATE_COMPONENT_VISIBILITY_EVENT, handleEvaluateComponentVisibility);

//     return () => {
//       document.removeEventListener(EVALUATE_COMPONENT_VISIBILITY_EVENT, handleEvaluateComponentVisibility);
//     };
//   }, []);

//   return evaluateComponentVisibility;
// };


//TODO:: change this for a function into resize Observer -> fired = true; then sset that evaluate componrent viosibility portion to true.
//the resize iobersever should always be on, there shouldn't be a conditional thing for it to observe
/**
 * This function returns an object that needs to be spread onto the same
 * element as the `elementRef`, so that the data attribute is applied
 * correctly.
 */
export function usePerformanceMarks(
  name: string,
  enabled: () => boolean,
  elementRef: React.RefObject<HTMLElement>,
  getDetails: () => Record<string, string | boolean | number | undefined>,
  dependencies: React.DependencyList
) {
  const id = useRandomId();
  const { isInModal } = useModalContext();
  const attributes = useDOMAttribute(elementRef, 'data-analytics-performance-mark', id);
  const [isComponentVisible, setIsComponentVisible] = useState(false);

  useEffect(() => {
    if (!elementRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        const isVisible = entry.contentRect.width > 0 && entry.contentRect.height > 0;
        setIsComponentVisible(isVisible);
      }
    });

    resizeObserver.observe(elementRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [elementRef]);

  useEffect(() => {
    if (!enabled() || !elementRef.current || isInModal || !isComponentVisible) {
      return;
    }

    const renderedMarkName = `${name}Rendered`;
    performance.mark(renderedMarkName, {
      detail: {
        source: 'awsui',
        instanceIdentifier: id,
        ...getDetails(),
      },
    });
  }, [enabled, isInModal, isComponentVisible, name, id, elementRef, getDetails]);

  useEffectOnUpdate(() => {
    if (!enabled() || !elementRef.current || isInModal || !isComponentVisible) {
      return;
    }
    const updatedMarkName = `${name}Updated`;
    performance.mark(updatedMarkName, {
      detail: {
        source: 'awsui',
        instanceIdentifier: id,
        ...getDetails(),
      },
    });
  }, [isComponentVisible, ...dependencies]);

  return attributes;
}