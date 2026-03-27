// Type shim for react-router-dom
// This project uses @tanstack/react-router but some files import from react-router-dom
// These declarations satisfy TypeScript while Vite resolves the actual module
declare module "react-router-dom" {
  export function useNavigate(): (path: string) => void;
  export function useLocation(): { pathname: string };
  export function useParams<T extends Record<string, string>>(): T;
  export function Navigate(props: { to: string; replace?: boolean }): null;
  export function BrowserRouter(props: {
    children: React.ReactNode;
  }): React.ReactElement;
  export function Routes(props: {
    children: React.ReactNode;
  }): React.ReactElement;
  export function Route(props: {
    path: string;
    element: React.ReactElement;
  }): React.ReactElement;
  export function Link(props: {
    to: string;
    children: React.ReactNode;
    className?: string;
  }): React.ReactElement;
}
