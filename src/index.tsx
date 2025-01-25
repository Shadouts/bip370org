import { createRoot } from "react-dom/client";

import { Navbar } from "./Navbar";
import { Page, withContext } from "./Page";

document.body.innerHTML = '<div id="app"></div>';

const RootComponent = withContext(() => (
  <>
    <Navbar />
    <br />
    <Page />
  </>
));

const root = createRoot(document.getElementById("app") as Element);
root.render(<RootComponent />);
