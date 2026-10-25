"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

// The single cart state for the whole storefront: React Context + reducer
// persisted to one localStorage key. Both navigation bag icons, the product
// page's add-to-shop and the cart drawer consume this same provider — there
// is deliberately no second cart state.

export type CartSizing =
  | { type: "standard"; size: string }
  | { type: "custom"; measurements: Record<string, string> };

export interface CartLine {
  productId: string;
  name: string;
  imageSrc: string;
  imageAlt: string;
  unitPriceKobo: number;
  quantity: number;
  sizing: CartSizing;
}

export type CartLineKey = string;

/** Identical selections merge; any differing size or measurement set is a
 *  distinct line, so custom-measured pieces are never flattened together. */
export function makeCartLineKey(line: CartLine): CartLineKey {
  const sizing =
    line.sizing.type === "standard"
      ? `standard:${line.sizing.size}`
      : `custom:${JSON.stringify(line.sizing.measurements)}`;
  return `${line.productId}:${sizing}`;
}

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  loaded: boolean;
}

type CartAction =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "open" }
  | { type: "close" }
  | { type: "add"; line: CartLine }
  | { type: "setQuantity"; key: CartLineKey; quantity: number }
  | { type: "remove"; key: CartLineKey };

const STORAGE_KEY = "karanye-cart";

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { ...state, lines: action.lines, loaded: true };
    case "open":
      return { ...state, isOpen: true };
    case "close":
      return { ...state, isOpen: false };
    case "add": {
      const key = makeCartLineKey(action.line);
      const existing = state.lines.find((line) => makeCartLineKey(line) === key);
      const lines = existing
        ? state.lines.map((line) =>
            line === existing
              ? { ...line, quantity: line.quantity + action.line.quantity }
              : line,
          )
        : [...state.lines, action.line];
      return { ...state, lines };
    }
    case "setQuantity": {
      const lines = state.lines
        .map((line) =>
          makeCartLineKey(line) === action.key
            ? { ...line, quantity: action.quantity }
            : line,
        )
        // Removing is achieved by stepping down to zero.
        .filter((line) => line.quantity > 0);
      return { ...state, lines };
    }
    case "remove":
      return {
        ...state,
        lines: state.lines.filter((line) => makeCartLineKey(line) !== action.key),
      };
    default:
      return state;
  }
}

interface CartContextValue {
  lines: CartLine[];
  /** Total units across lines (the badge number everywhere). */
  count: number;
  subtotalKobo: number;
  isOpen: boolean;
  /** True after first client render; gates the badge to avoid hydration drift. */
  loaded: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (line: CartLine) => void;
  setQuantity: (key: CartLineKey, quantity: number) => void;
  removeItem: (key: CartLineKey) => void;
  keyOf: (line: CartLine) => CartLineKey;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    lines: [],
    isOpen: false,
    loaded: false,
  });

  useEffect(() => {
    // Load once on first client render; SSR HTML always shows the empty cart.
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const lines: unknown = JSON.parse(stored);
        if (Array.isArray(lines)) {
          dispatch({ type: "hydrate", lines: lines as CartLine[] });
          return;
        }
      }
    } catch {
      // Corrupt storage falls through to an empty cart.
    }
    dispatch({ type: "hydrate", lines: [] });
  }, []);

  useEffect(() => {
    if (!state.loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
  }, [state.lines, state.loaded]);

  const keyOf: (line: CartLine) => CartLineKey = useCallback(
    (line) => makeCartLineKey(line),
    [],
  );

  const value = useMemo<CartContextValue>(() => {
    const count = state.lines.reduce((sum, line) => sum + line.quantity, 0);
    const subtotalKobo = state.lines.reduce(
      (sum, line) => sum + line.unitPriceKobo * line.quantity,
      0,
    );
    return {
      lines: state.lines,
      count: state.loaded ? count : 0,
      subtotalKobo: state.loaded ? subtotalKobo : 0,
      isOpen: state.isOpen,
      loaded: state.loaded,
      openCart: () => dispatch({ type: "open" }),
      closeCart: () => dispatch({ type: "close" }),
      addItem: (line) => dispatch({ type: "add", line }),
      setQuantity: (key, quantity) => dispatch({ type: "setQuantity", key, quantity }),
      removeItem: (key) => dispatch({ type: "remove", key }),
      keyOf,
    };
  }, [state, keyOf]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

/** Drawer sizing summary, e.g. "Standard — Size 10". */
export function describeSizing(sizing: CartSizing): string {
  return sizing.type === "standard"
    ? `Standard — Size ${sizing.size}`
    : "Custom size";
}
