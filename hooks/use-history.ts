import { useState, useCallback, useRef } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export function useHistory<T>(initialState: T, maxHistorySize = 50) {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const updateState = useCallback(
    (newState: T) => {
      setHistory((current) => {
        const newPast = [...current.past, current.present].slice(-maxHistorySize);
        return {
          past: newPast,
          present: newState,
          future: [], // Clear future when new action is performed
        };
      });
    },
    [maxHistorySize]
  );

  const undo = useCallback(() => {
    if (!canUndo) return;

    setHistory((current) => {
      const previous = current.past[current.past.length - 1];
      const newPast = current.past.slice(0, -1);
      const newFuture = [current.present, ...current.future];

      return {
        past: newPast,
        present: previous,
        future: newFuture,
      };
    });
  }, [canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    setHistory((current) => {
      const next = current.future[0];
      const newFuture = current.future.slice(1);
      const newPast = [...current.past, current.present];

      return {
        past: newPast,
        present: next,
        future: newFuture,
      };
    });
  }, [canRedo]);

  const reset = useCallback((newState: T) => {
    setHistory({
      past: [],
      present: newState,
      future: [],
    });
  }, []);

  return {
    state: history.present,
    updateState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
  };
}

