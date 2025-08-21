// Global type declarations to resolve TypeScript module issues

// React types
declare module 'react' {
  import * as React from 'react';
  export = React;
  export as namespace React;
}

declare module 'react-dom' {
  import * as ReactDOM from 'react-dom';
  export = ReactDOM;
  export as namespace ReactDOM;
}

// Next.js types
declare module 'next' {
  export * from 'next';
}

declare module 'next/font/google' {
  export * from 'next/font/google';
}

declare module 'next/navigation' {
  export * from 'next/navigation';
}

declare module 'next/link' {
  export * from 'next/link';
}

declare module 'next/dynamic' {
  export * from 'next/dynamic';
}

declare module 'next/image' {
  export * from 'next/image';
}

// Lucide React types
declare module 'lucide-react' {
  export * from 'lucide-react';
}

// Chess.js types
declare module 'chess.js' {
  export * from 'chess.js';
}

// React-chessboard types
declare module 'react-chessboard' {
  export * from 'react-chessboard';
}

// Sonner types
declare module 'sonner' {
  export * from 'sonner';
}

// Framer Motion types
declare module 'framer-motion' {
  export * from 'framer-motion';
}

// React Hook Form types
declare module 'react-hook-form' {
  export * from 'react-hook-form';
}

// SWR types
declare module 'swr' {
  export * from 'swr';
}

// Recharts types
declare module 'recharts' {
  export * from 'recharts';
}

// React JSX types
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Global React types
declare global {
  namespace React {
    interface ReactNode {
      // Add any additional ReactNode properties if needed
    }
  }
}

// Additional React type exports
declare module 'react' {
  export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }

  export interface ReactNode {
    // ReactNode definition
  }

  export interface ComponentProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> {
    // ComponentProps definition
  }

  export interface ComponentPropsWithoutRef<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> {
    // ComponentPropsWithoutRef definition
  }

  export interface ElementRef<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> {
    // ElementRef definition
  }

  export function forwardRef<T, P = {}>(
    render: (props: P, ref: ForwardedRef<T>) => ReactElement | null
  ): ForwardRefExoticComponent<P & RefAttributes<T>>;

  export function createContext<T>(
    defaultValue: T,
    calculateChangedBits?: ((prev: T, next: T) => number) | null
  ): Context<T>;

  export function useState<T>(
    initialState: T | (() => T)
  ): [T, Dispatch<SetStateAction<T>>];

  export function useEffect(
    effect: () => void | (() => void | undefined),
    deps?: DependencyList
  ): void;

  export function useContext<T>(context: Context<T>): T;

  export type ForwardedRef<T> = ((instance: T | null) => void) | MutableRefObject<T | null> | null;
  export type RefAttributes<T> = { ref?: ForwardedRef<T> };
  export type ForwardRefExoticComponent<P> = ExoticComponent<P & RefAttributes<any>>;
  export type ExoticComponent<P> = {
    readonly $$typeof: symbol;
    (props: P): (ReactElement | null);
  };
  export type MutableRefObject<T> = { current: T };
  export type DependencyList = ReadonlyArray<any>;
  export type SetStateAction<S> = S | ((prevState: S) => S);
  export type Dispatch<A> = (value: A) => void;
  export type Key = string | number;
  export type JSXElementConstructor<P> = ((props: P) => ReactElement | null) | (new (props: P) => Component<P, any>);
  export interface Component<P = {}, S = {}, SS = any> extends ComponentLifecycle<P, S, SS> {}
  export interface ComponentLifecycle<P, S, SS = any> {}
  export interface Context<T> {
    Provider: Provider<T>;
    Consumer: Consumer<T>;
    displayName?: string;
  }
  export interface Provider<T> {
    (props: ProviderProps<T>): ReactElement | null;
  }
  export interface Consumer<T> {
    (props: ConsumerProps<T>): ReactElement | null;
  }
  export interface ProviderProps<T> {
    value: T;
    children?: ReactNode;
  }
  export interface ConsumerProps<T> {
    children: (value: T) => ReactNode;
  }
} 