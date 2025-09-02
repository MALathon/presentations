import React from 'react';
import ReactDOM from 'react-dom/client';
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';
import Presentation from './Presentation';

// Filter out props that shouldn't be passed to DOM elements
const shouldForwardProp = (prop) => {
  // Don't forward these props to DOM elements
  const blockedProps = ['textAlign', 'padding', 'margin', 'backgroundColor', 'backgroundImage', 
                        'backgroundOpacity', 'backgroundPosition', 'backgroundRepeat', 'backgroundSize',
                        'scaleRatio', 'transition', 'template'];
  return !blockedProps.includes(prop) && isPropValid(prop);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <Presentation />
    </StyleSheetManager>
  </React.StrictMode>
);