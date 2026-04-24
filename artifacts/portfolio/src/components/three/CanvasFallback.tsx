import { Component, useEffect, useState, type ReactNode } from "react";

type Props = { children: ReactNode; fallback: ReactNode };
type State = { hasError: boolean };

export class CanvasErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.warn("3D canvas failed to render — falling back.", error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

let cachedSupport: boolean | null = null;
function detectWebGL(): boolean {
  if (cachedSupport !== null) return cachedSupport;
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    cachedSupport = !!gl;
  } catch {
    cachedSupport = false;
  }
  return cachedSupport;
}

export function WebGLGate({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(detectWebGL());
  }, []);

  if (supported === null) return fallback;
  if (!supported) return <>{fallback}</>;
  return <CanvasErrorBoundary fallback={fallback}>{children}</CanvasErrorBoundary>;
}
