//this is in src so i can pull in 
// performance marks and resize oberser, 
// but I will need to inject a cloudscape table 
// and table specifically to see performance mark trigger

import React, { useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render } from '@testing-library/react';
import { usePerformanceMarks } from '../../internal/hooks/use-performance-marks';

import Button, { ButtonProps } from '../../../lib/components/button';
import createWrapper, { ButtonWrapper } from '../../../lib/components/test-utils/dom';

//Consider updating code to iframe wrapper
//check button first

function renderWrappedButton(props: ButtonProps = {}) {
    const onClickSpy = jest.fn();
    const renderResult = render(
        <div onClick={onClickSpy}>
            <Button {...props} />
        </div>
    );
    const wrapper = createWrapper(renderResult.container).findButton()!;
    //find a way to make wrapper specific to iframe
    return { onClickSpy, wrapper };
}

function Demo() {
    const ref = useRef<HTMLDivElement>(null);
    const attributes = usePerformanceMarks(
        'test-component',
        () => true,
        ref,
        () => ({}),
        []
    );
    return <div {...attributes} ref={ref} data-testid="element" />;
}

//render iframe (pull other examples)
//inject button/table into container
//mock resize observer + performance marks
//check they're beings sent