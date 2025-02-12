import { createContext, useMemo, useReducer } from "react";
import { PsbtV2 } from "@caravan/psbt";
import { Network } from "@caravan/bitcoin";

interface IPageState {
  psbt: PsbtV2;
  encoding: "hex" | "base64" | null;
  network: Exclude<Network, Network.SIGNET>;
  containsTpubs: boolean;
  convertedFromV0: boolean;
  serializeAsV0: "true" | "false";
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
  psbt: new PsbtV2(),
  encoding: "base64",
  network: Network.TESTNET,
  containsTpubs: false,
  convertedFromV0: false,
  serializeAsV0: "false",
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
