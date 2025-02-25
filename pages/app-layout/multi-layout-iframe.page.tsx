// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import AppLayout from '~components/app-layout';
import Header from '~components/header';
import ScreenreaderOnly from '~components/internal/components/screenreader-only';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import { IframeWrapper } from '../utils/iframe-wrapper';
import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Containers, Navigation, Tools } from './utils/content-blocks';
import labels from './utils/labels';
import * as toolsContent from './utils/tools-content';

function InnerApp() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        console.log('ResizeObserver fired:', entry);
        // Here you can add any specific logic you need when a resize occurs
      }
    });

    const observeTargetElements = () => {
      if (containerRef.current) {
        const buttons = containerRef.current.querySelectorAll('button[variant="primary"]');
        const tables = containerRef.current.querySelectorAll('table');

        buttons.forEach(button => resizeObserver.observe(button));
        tables.forEach(table => resizeObserver.observe(table));
      }
    };

    observeTargetElements();

    const mutationObserver = new MutationObserver((mutations) => {
      let shouldReobserve = false;
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          shouldReobserve = true;
        }
      });

      if (shouldReobserve) {
        resizeObserver.disconnect();
        observeTargetElements();
      }
    });

    if (containerRef.current) {
      mutationObserver.observe(containerRef.current, { childList: true, subtree: true });
    }

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <AppLayout
      {...{ __disableRuntimeDrawers: true }}
      data-testid="secondary-layout"
      ariaLabels={labels}
      breadcrumbs={<Breadcrumbs />}
      navigationHide={true}
      content={
        <SpaceBetween size="s">
          <Header variant="h1" description="This page contains nested app layout instances with an iframe">
            Multiple app layouts with iframe
          </Header>

          <Link external={true} href="#">
            External link
          </Link>

          <div ref={containerRef}>
            <Containers />
          </div>
        </SpaceBetween>
      }
      tools={<Tools>{toolsContent.long}</Tools>}
    />
  );
}

export default function App() {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        data-testid="main-layout"
        ariaLabels={labels}
        navigation={<Navigation />}
        toolsHide={true}
        disableContentPaddings={true}
        content={
          <>
            <ScreenreaderOnly>
              <h1>Multiple app layouts with iframe</h1>
            </ScreenreaderOnly>
            <IframeWrapper id="inner-iframe" AppComponent={InnerApp} />

          </>

        }
      />
    </ScreenshotArea>
  );
}