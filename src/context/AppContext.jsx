import { createContext, useContext, useEffect, useReducer } from "react";
import { seedTransactions } from "../data/seedTransactions";

const AppContext = createContext(null);

const STORAGE_KEYS = {
  theme: "zorvyn-theme",
  role: "zorvyn-role",
  transactions: "zorvyn-transactions",
};

const defaultFilters = {
  search: "",
  categoryGroup: "all",
  category: "all",
  type: "all",
  status: "all",
  startDate: "",
  endDate: "",
  sortBy: "date-desc",
  groupBy: "none",
};

function parseStoredValue(key, fallback) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function getInitialTransactions() {
  const storedTransactions = parseStoredValue(STORAGE_KEYS.transactions, []);

  if (!Array.isArray(storedTransactions) || storedTransactions.length === 0) {
    return seedTransactions;
  }

  const merged = new Map(seedTransactions.map((transaction) => [transaction.id, transaction]));

  for (const transaction of storedTransactions) {
    merged.set(transaction.id, transaction);
  }

  return [...merged.values()].sort(
    (left, right) => new Date(right.date) - new Date(left.date),
  );
}

function getInitialState() {
  return {
    theme: parseStoredValue(STORAGE_KEYS.theme, "dark"),
    role: parseStoredValue(STORAGE_KEYS.role, "admin"),
    transactions: getInitialTransactions(),
    filters: defaultFilters,
  };
}

function appReducer(state, action) {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "SET_ROLE":
      return { ...state, role: action.payload };
    case "SET_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    case "RESET_FILTERS":
      return {
        ...state,
        filters: defaultFilters,
      };
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((transaction) =>
          transaction.id === action.payload.id ? action.payload : transaction,
        ),
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== action.payload,
        ),
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, undefined, getInitialState);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.theme === "dark");
    document.documentElement.dataset.theme = state.theme;
    window.localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(state.theme));
  }, [state.theme]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.role, JSON.stringify(state.role));
  }, [state.role]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.transactions,
      JSON.stringify(state.transactions),
    );
  }, [state.transactions]);

  const value = {
    state,
    setTheme: (theme) => dispatch({ type: "SET_THEME", payload: theme }),
    setRole: (role) => dispatch({ type: "SET_ROLE", payload: role }),
    setFilters: (filters) => dispatch({ type: "SET_FILTERS", payload: filters }),
    resetFilters: () => dispatch({ type: "RESET_FILTERS" }),
    addTransaction: (transaction) =>
      dispatch({ type: "ADD_TRANSACTION", payload: transaction }),
    updateTransaction: (transaction) =>
      dispatch({ type: "UPDATE_TRANSACTION", payload: transaction }),
    deleteTransaction: (transactionId) =>
      dispatch({ type: "DELETE_TRANSACTION", payload: transactionId }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }

  return context;
}
