import Link from 'next/form';

export default function Home() {
    return(
        <main>
            <h1>Esto es un ejemplo de Pagina Principal con Next</h1>
            <p>
                <Link href="/practica/1">Ir a Practica 1</Link>

            </p>
        </main>
    );
}