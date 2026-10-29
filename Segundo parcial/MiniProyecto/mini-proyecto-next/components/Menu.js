import Link from 'next/link';

export default function Menu() {
  return (
    <nav className="navegacion">
      <Link href="/">Inicio</Link>
      <Link href="/talleres">Talleres</Link>
      <Link href="/perfil">Mi perfil</Link>
    </nav>
  );
}
