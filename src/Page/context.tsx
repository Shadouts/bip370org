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
  psbt: PsbtV2.FromV0(
    "cHNidP8BAIkBAAAAASyJMLrrcdSqF8m6AK4dsCtO466fMLJcZm+uydcAEy/DAAAAAAD/////AoCEHgAAAAAAIgAgiJbwG5sSNH6ZbW25ZARhmCY34X5SSEmaLaQmw/TzOzwxEXoAAAAAACIAIFgsxXs5EtuxEMFT+wZWGVFHW1XIHv/wQ7jyweOHkOyLAAAAAAABAP2HAQEAAAAAAQFztkbJljwPbWUv6Vlt5yvOMMqWucjac7azBL5EMitcywEAAAAA/////wKAlpgAAAAAACIAIN75eIg68dIqV9Tp5R3/UE12kNF8IZRVcBLAs5oYVBaMsVK++QAAAAAiACB/BxtfKMJJcfu9zqkqyehCCMurya4T70crB/UmyLJlCAQARzBEAiAAyHoXqGYjlUTp7SC+j4EAUjjHeqatkv86uHJVDl/SywIgbRLW6VygJQyiIGClekDLkWj2lg92rHpdIp6ZsxxS7GgBRzBEAiAQB6bdyehDmIcIqL+vgOkjMFTPstST61l1Lp4hbTFzCAIgaqgcx+fEpym34I1oWc3SYVwCevkLhgMWXyuUnp8FfzoBaVIhAlZaOT24lzJRsXwDKUxDWXFzuWu378zHqIhQ5hfKut9eIQMwlbULmCHYFAalMjKnvjo9Ugf8/9uQdRgXTvV9WXeRaiEDfuLj6LvkH77GQHX+nnrW8LDtbxlfWx+y6WDz3+sFYrJTrgAAAAABASuAlpgAAAAAACIAIN75eIg68dIqV9Tp5R3/UE12kNF8IZRVcBLAs5oYVBaMIgIDuizNQIof+nJvi/SEeQIUX/MeZuAnfIku2mutEcsz5adHMEQCIGk34lYUo5200tmJKnnANts5ykdfiSSxW9TaZQMlFyoyAiAWxV6dx9kkqOIcBiTpOiXiPRb4pMhX/R0i8kJn86MTqQEBAwQBAAAAIgYDi9u1xPUUKLDmtJAe3bTxHZk5Etyg2Tb7uC34PGxHli0c094sqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACIGA7oszUCKH/pyb4v0hHkCFF/zHmbgJ3yJLtprrRHLM+WnHPcNa4gtAACAAQAAAAAAAAAAAAAAAAAAAAAAAAAiBgPdtGY4gfWJTy6qjWfd7v47V8IUiqO0R0Rh3iPX5EuThRxhHSAuLQAAgAEAAIALAACACAAAAAAAAAAAAAAAAQVpUiEDi9u1xPUUKLDmtJAe3bTxHZk5Etyg2Tb7uC34PGxHli0hA7oszUCKH/pyb4v0hHkCFF/zHmbgJ3yJLtprrRHLM+WnIQPdtGY4gfWJTy6qjWfd7v47V8IUiqO0R0Rh3iPX5EuThVOuAAAiAgJ/doK9Kf2hxTlKjDJjjrQIDIGuyI9TG5lg+0jX21B8vRzT3iyoAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAIgICeSL9a4y2B8ItZ0QhfxRYq+7S7ULeabsmdRJfdpk5izAc9w1riC0AAIABAAAAAAAAAAAAAAABAAAAAAAAACICAh2cqy9MC+g5Mlph/DzSfUdQVfZJ3AIJCmrQ5LRjIBTAHGEdIC4tAACAAQAAgAsAAIAIAAAAAQAAAAAAAAABAWlSIQIdnKsvTAvoOTJaYfw80n1HUFX2SdwCCQpq0OS0YyAUwCECeSL9a4y2B8ItZ0QhfxRYq+7S7ULeabsmdRJfdpk5izAhAn92gr0p/aHFOUqMMmOOtAgMga7Ij1MbmWD7SNfbUHy9U64A",
    true,
  ),
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
