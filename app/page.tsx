import { redirect } from 'next/navigation';

export default function Home() {
  // Redirigir al usuario a la página de login
  redirect('/login');
}
