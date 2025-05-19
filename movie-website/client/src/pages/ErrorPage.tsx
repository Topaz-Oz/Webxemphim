// src/pages/ErrorPage.tsx
import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);
  return (
    <div style={{ padding: 20 }}>
      <h1>Oops!</h1>
      <p>Something went wrong.</p>
    </div>
  );
}
