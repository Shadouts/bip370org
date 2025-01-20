import React from 'react';
import { createRoot } from 'react-dom/client';

import { Navbar } from './Navbar';
import { Page } from './Page';

document.body.innerHTML = '<div id="app"></div>';

const root = createRoot(document.getElementById('app') as Element);
root.render(
  <>
    <Navbar />
    <br />
    <Page />
  </>
);