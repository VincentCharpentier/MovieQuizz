import { createContext, useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'settings';
const DEFAULT_STATE = {
  soundActive: true,
  soundVolume: 1,
};
const FIRST_RENDER_STATE = {
  ...DEFAULT_STATE,
  soundActive: false,
};

function restoreSettings() {
  const json = localStorage.getItem(STORAGE_KEY) ?? '{}';
  return Object.assign({}, DEFAULT_STATE, JSON.parse(json));
}

function saveSettings(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const Context = createContext({});

export const Provider = ({ children }) => {
  const [state, setState] = useState(FIRST_RENDER_STATE);

  useEffect(() => setState(restoreSettings()), []);

  const partialSet = useCallback((v) => setState((s) => ({ ...s, ...v })), [
    setState,
  ]);

  useEffect(() => saveSettings(state), [state]);

  const setSoundActive = useCallback(
    (soundActive) => partialSet({ soundActive }),
    [partialSet],
  );
  const setSoundVolume = useCallback(
    (soundVolume) => partialSet({ soundVolume }),
    [partialSet],
  );

  const ctxValue = {
    ...state,
    setSoundActive,
    setSoundVolume,
  };

  return <Context.Provider value={ctxValue}>{children}</Context.Provider>;
};

export default Context;
