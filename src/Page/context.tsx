import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import { getPsbtVersionNumber, PsbtV2 } from "@caravan/psbt";
import { Network } from "@caravan/bitcoin";
import { getEncoding } from "../functions";

interface IPageState {
  // psbt: PsbtV2;
  encoding: "hex" | "base64" | null;
  network: Exclude<Network, Network.SIGNET>;
  containsTpubs: boolean;
  serializeAsV0: "true" | "false";
  // Most recent oldest.
  history: string[];
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
  // psbt: new PsbtV2(),
  encoding: "base64",
  network: Network.TESTNET,
  containsTpubs: false,
  serializeAsV0: "false",
  history: [new PsbtV2().serialize()],
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

export const useUpdatePsbt = () => {
  const { setState, encoding, history } = useContext(PageContext);

  const updatePsbt = useCallback(
    (psbt: PsbtV2 | string) => {
      let newPsbt: PsbtV2;
      let newEncoding = encoding;
      let newHistory = [...history];

      // This validates the psbt
      if (typeof psbt === "string") {
        newEncoding = getEncoding(psbt);
        const version = getPsbtVersionNumber(psbt);
        if (version === 2) {
          newPsbt = new PsbtV2(psbt);
        } else {
          newPsbt = PsbtV2.FromV0(psbt, true);
        }
        newHistory.push(psbt);
      } else {
        newPsbt = new PsbtV2(psbt.serialize());
        newHistory.push(psbt.serialize());
      }
      setState({
        history: newHistory,
        encoding: newEncoding,
      });
    },
    [setState, history, encoding],
  );

  return updatePsbt;
};

export const usePsbt = () => {
  const { history } = useContext(PageContext);

  const psbt = history.at(-1);
  if (!psbt) {
    // This shouldn't happen, but doing this keeps things type safe.
    return new PsbtV2();
  }

  const version = getPsbtVersionNumber(psbt);
  if (version === 2) {
    return new PsbtV2(psbt);
  } else {
    return PsbtV2.FromV0(psbt, true);
  }
};

export const usePopHistory = () => {
  const { history, setState } = useContext(PageContext);
  return useCallback(() => {
    const newHistory = [...history];
    const previousPsbt = newHistory.pop();
    if (previousPsbt === undefined) {
      // Don't remove initial state
      return;
    }
    setState({ history: newHistory });
  }, [history, setState]);
};

export const useCurrentPsbtTransactionVersion = () => {
  const { history } = useContext(PageContext);
  return getPsbtVersionNumber(history.at(-1) || "");
};
