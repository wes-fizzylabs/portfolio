declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }

  interface Element {
    type: any;
    props: any;
    key: any;
  }

  interface ElementClass {
    render(): any;
  }

  interface ElementAttributesProperty {
    props: {};
  }

  interface ElementChildrenAttribute {
    children: {};
  }
}

declare namespace React {
  interface HTMLAttributes<T> {
    className?: string;
    id?: string;
    style?: any;
    onClick?: (event: any) => void;
    onMouseEnter?: (event: any) => void;
    onMouseLeave?: (event: any) => void;
    children?: ReactNode;
    [key: string]: any;
  }

  interface DetailedHTMLProps<E, T> extends E {
    ref?: any;
    key?: any;
  }

  interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {
    href?: string;
    target?: string;
  }

  interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    type?: string;
    disabled?: boolean;
  }

  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    type?: string;
    value?: string;
    placeholder?: string;
    onChange?: (event: any) => void;
  }

  interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
    onSubmit?: (event: any) => void;
  }

  interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
    htmlFor?: string;
  }

  interface LiHTMLAttributes<T> extends HTMLAttributes<T> {}

  interface OlHTMLAttributes<T> extends HTMLAttributes<T> {}

  interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    src?: string;
    alt?: string;
  }

  interface CanvasHTMLAttributes<T> extends HTMLAttributes<T> {
    width?: number;
    height?: number;
  }

  type ReactNode = any;
  type ReactElement<P = any, T = any> = any;
  interface Component<P = {}, S = {}> {}
}