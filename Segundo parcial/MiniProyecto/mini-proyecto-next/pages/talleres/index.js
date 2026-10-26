import { useState, useEffect } from 'react';
import { pedirJSON } from '../../lib/api';
import TarjetaTaller from '../../components/TarjetaTaller';
import estilos from '../../styles/Talleres.module.css';

export default function Talleres() {
  const [talleres, setTalleres] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // 1. Estado para guardar lo que el usuario escribe en la caja de texto
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarTalleres();
  }, []);

  async function cargarTalleres() {
    try {
      setTalleres(await pedirJSON('/talleres'));
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  // 2. Filtra el arreglo 'talleres' según el texto escrito en la caja de texto
  const texto = busqueda.trim().toLowerCase();
  const visibles = talleres.filter((t) =>
    `${t.nombre} ${t.instructor || ''}`.toLowerCase().includes(texto)
  );

  return (
    <main>
      <h1>Talleres</h1>

      {/* 3. AQUÍ ESTÁ LA CAJA DE TEXTO (EL BUSCADOR) */}
      <input
        type="text"
        placeholder="Buscar por nombre o instructor"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className={estilos.buscador}
      />

      {cargando && <p>Cargando talleres…</p>}
      {error && <p className="error">{error}</p>}

      {/* Si la base de datos está totalmente vacía */}
      {!cargando && !error && talleres.length === 0 && (
        <p>No hay talleres registrados.</p>
      )}

      {/* Si escribes en la caja de texto algo que no coincide con ningún taller */}
      {!cargando && !error && talleres.length > 0 && visibles.length === 0 && (
        <p>No hay talleres que coincidan con la búsqueda.</p>
      )}

      {/* La rejilla ahora recorre 'visibles' en lugar de 'talleres' */}
      <div className={estilos.rejilla}>
        {visibles.map((t) => (
          <TarjetaTaller key={t.id} taller={t} />
        ))}
      </div>
    </main>
  );
}