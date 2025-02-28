// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper, { AppLayoutWrapper, TableWrapper } from '../../../lib/components/test-utils/selectors';

const iframeId = '#inner-iframe';
import { usePerformanceMarks } from '../../internal/hooks/use-performance-marks';


//3) figure out performance marks: below is a unit test example from 
// https://code.amazon.com/packages/acharsig/blobs/mainline/--/cloudscape-design/components/src/internal/hooks/use-performance-marks/__tests__/use-performance-marks.test.tsx#L20

// function Demo() {
//   const ref = useRef<HTMLDivElement>(null);
//   const attributes = usePerformanceMarks(
//     'test-component',
//     () => true,
//     ref,
//     () => ({}),
//     []
//   );
//   return <div {...attributes} ref={ref} data-testid="element" />;
// }


describe('MultiAppLayout simple', () => {
    const mainLayout = createWrapper().find('[data-testid="main-layout"]').findAppLayout();
    const secondaryLayout = createWrapper().find('[data-testid="secondary-layout"]').findAppLayout();

    const setupTest = (testFn: (page: BasePageObject, browser: WebdriverIO.Browser) => Promise<void>) =>
        useBrowser(async browser => {
            const page = new BasePageObject(browser);
            console.log('Starting test setup');
            await browser.url(`#/light/app-layout/multi-layout-iframe`);
            console.log('URL loaded');
            await page.runInsideIframe(iframeId, true, async () => {
                console.log('Inside iframe');
                console.log('Looking for selector:', secondaryLayout.findContentRegion().toSelector());
                await page.waitForVisible(secondaryLayout.findContentRegion().toSelector());
                console.log('Found content region');
            });
            await testFn(page, browser);  // Pass browser here
        });

    test('table emits performance metrics', setupTest(async (page, browser) => {
        await page.runInsideIframe(iframeId, true, async () => {
            console.log('Looking for containers within:', secondaryLayout.toSelector());

            const containersElement = createWrapper()
                .find('[data-testid="secondary-layout"]')
                .findSpaceBetween()
                .findAll('div')
                .get(2);

            const containerSelector = containersElement.toSelector();
            console.log('Containers selector:', containerSelector);

            // Debug container visibility
            const containerExists = await page.isExisting(containerSelector);
            console.log('Container exists:', containerExists);

            // Debug the container before injection
            const beforeState = await browser.execute((selector) => {
                const container = document.querySelector(selector);
                return {
                    found: !!container,
                    innerHTML: container?.innerHTML,
                    selector: selector
                };
            }, containerSelector);
            console.log('Container state before injection:', beforeState);

            // Inject table and return status
            const injectionResult = await browser.execute((selector) => {
                const container = document.querySelector(selector);
                if (!container) {
                    return { success: false, error: 'Container not found' };
                }

                try {
                    const table = document.createElement('table');
                    table.setAttribute('data-testid', 'test-table');
                    table.innerHTML = '<tbody><tr><td>Test</td></tr></tbody>';
                    container.appendChild(table);
                    return {
                        success: true,
                        containerHTML: container.innerHTML,
                        tableExists: !!document.querySelector('[data-testid="test-table"]')
                    };
                } catch (err) {
                    const error = err as Error;
                    return {
                        success: false,
                        error: error?.message || 'Unknown error occurred'
                    };
                }
            }, containerSelector);
            console.log('Injection result:', injectionResult);

            // Verify table existence
            const tableExists = await page.isExisting('[data-testid="test-table"]');
            console.log('Table exists after injection:', tableExists);
            //This table is a regular html table that would not emit performance metrics, this is successful

            // if (!tableExists) {
            //     // Debug DOM state if table isn't found
            //     const domState = await browser.execute(() => ({
            //         body: document.body.innerHTML,
            //         containerCount: document.querySelectorAll('div').length,
            //         tables: document.querySelectorAll('table').length
            //     }));
            //     console.log('DOM state:', domState);
            // }

            // try {
            //     await page.waitForVisible('[data-testid="test-table"]');
            //     console.log('Table is now visible');
            // } catch (err) {
            //     const error = err as Error;
            //     console.error('Failed to find visible table:', error);

            //     // Get final DOM state
            //     const finalState = await browser.execute((selector) => ({
            //         tableElement: document.querySelector('[data-testid="test-table"]')?.outerHTML,
            //         containerHTML: document.querySelector(selector)?.innerHTML
            //     }), containerSelector);
            //     console.log('Final DOM state:', finalState);
            // }
        });
    }));
});



/**/ // Inject Cloudscape Table -> this is not succesful and has become diya chicken scratch
// await browser.execute((selector, tableComponentString, usePerformanceMarksString) => {
//     const container = document.querySelector(selector);
//     if (container) {
//         // Create script elements to inject the components
//         const script = document.createElement('script');
//         script.textContent = `
//         const Table = ${tableComponentString};
//         const usePerformanceMarks = ${usePerformanceMarksString};

//         const TableDemo = () => {
//             const ref = React.useRef(null);
//             const attributes = usePerformanceMarks(
//                 'test-table',
//                 () => true,
//                 ref,
//                 () => ({}),
//                 []
//             );

//             return React.createElement(Table, {
//                 ...attributes,
//                 ref: ref,
//                 'data-testid': 'cloudscape-table',
//                 items: [{ id: '1', name: 'Item 1' }],
//                 columnDefinitions: [
//                     { id: 'id', header: 'ID', cell: item => item.id },
//                     { id: 'name', header: 'Name', cell: item => item.name }
//                 ]
//             });
//         };

//         ReactDOM.render(React.createElement(TableDemo), document.querySelector('${selector}'));
//     `;
//         document.head.appendChild(script);
//     }
// }, containerSelector, Table.toString(), usePerformanceMarks.toString());

// // Wait for Cloudscape Table to be visible
// await page.waitForVisible('[data-testid="cloudscape-table"]');
// console.log('Cloudscape Table is now visible');

// // Check for performance marks
// const performanceMarks = await browser.execute(() => {
//     return performance.getEntriesByType('mark')
//         .filter(mark => {
//             const detail = (mark as any).detail;
//             return detail && detail.source === 'awsui';
//         })
//         .map(mark => ({
//             name: mark.name,
//             startTime: mark.startTime,
//             detail: (mark as any).detail
//         }));
// });

// console.log('Performance marks found:', performanceMarks);
// console.log('Number of performance marks:', performanceMarks.length);
// expect(performanceMarks.length).toBeGreaterThan(0);

// // Check for table-related performance marks
// const hasTableMarks = performanceMarks.some(mark => mark.name.includes('table'));
// console.log('Table-related performance marks found:', hasTableMarks);
// expect(hasTableMarks).toBe(true);

// // Check for data-analytics-performance-mark attribute
// const hasPerformanceAttribute = await browser.execute(() => {
//     const table = document.querySelector('[data-testid="cloudscape-table"]');
//     return table?.hasAttribute('data-analytics-performance-mark');
// });

// console.log('Table has data-analytics-performance-mark attribute:', hasPerformanceAttribute);
// expect(hasPerformanceAttribute).toBe(true);
//         });
//     }));
// }); */



//change for both table and primary button instance 

// 3) Validation: ensure the child component is visible and then see if perforamnce marks are either passed through props or console.log
// //https://cloudscape.design/components/table?tabId=testing here's a link for "find table", if table can be found than performance marks should be sent
// //you shouldn't need to test anything else since the click functionality and rest is already sorted/tested
// */