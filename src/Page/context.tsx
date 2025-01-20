import { createContext, useMemo, useReducer } from "react";
import { PsbtV2 } from "@caravan/psbt";

interface IPageState {
  psbt: PsbtV2;
  encoding: "hex" | "base64" | null;
}

export interface IPageContext extends IPageState {
  setState: (state: Partial<IPageState>) => void;
}

const stateReducer = (
  oldState: IPageState,
  newState: Partial<IPageState>,
): IPageState => {
  return {
    ...oldState,
    ...newState,
  };
};

const defaultState: IPageState = {
  psbt: new PsbtV2(
    "cHNidP8B+wQCAAAAAQIEAgAAAAEEAQEBBQEBAQMEAAAAAAEGAQNPAQQ1h88C2j/QCIAAAACXBIsa0ERbHsgnVRdyfIe05OvBiiA/+g+UwBVmvTjpAANRt0OIfuHUDcMqYENyTy1kWbO1pNc9rsj7rgRy87xD4gzZDGpPrgAAgAAAAIBPAQQ1h88C2j/QCIAAAAG5BFJCcTnNeMLP8kRL41PNWGBePlEyheUotAf64/YXNQPTCl6XyK28VX2sKtmn45wXIuusaeZotvJmfMHWccg8qwzZDGpPrgAAgAEAAIAAAQ4gnfxmKMJsWJn+G9PcM4Zlv9VdetoQ9iIJc98tOG3sEnYBDwQBAAAAARAE/////wEBKwBlzR0AAAAAIgAgLFSGEmxJeAeagU4TcV1l82RZ5NbMre0mbQUIZFuvpjIBBUdSIQKdoSzbWyNWkrkVNq/v5ckcOrlHPY5DtTODarRWKZyIcSEDNys0I07Xz5wf6l0F1EFVeSe+lUKxYusC4ass6AIkwAtSriIGAp2hLNtbI1aSuRU2r+/lyRw6uUc9jkO1M4NqtFYpnIhxENkMak+uAACAAAAAgAAAAAAiBgM3KzQjTtfPnB/qXQXUQVV5J76VQrFi6wLhqyzoAiTACxDZDGpPrgAAgAEAAIAAAAAAAAEDCPA9zR0AAAAAAQQWABR7OgC/3BTSd5XCt0kB0J2m7xM1eSICA57/H1R6HV+S36K6evaslxpL0DukpzSwMVaiVritOh75EO3kXMUAAACAAAAAgAEAAIAA",
  ),
  encoding: "base64",
};

export const PageContext = createContext<IPageContext>({
  ...defaultState,
  setState: () => {},
});

export const withContext = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
  const ComponentWithContext = (props: P) => {
    const [state, setState] = useReducer(stateReducer, defaultState);
    const context = useMemo<IPageContext>(
      () => ({
        ...state,
        setState,
      }),
      [state],
    );

    return (
      <PageContext.Provider value={context}>
        <WrappedComponent {...props} />
      </PageContext.Provider>
    );
  };

  return ComponentWithContext;
};
