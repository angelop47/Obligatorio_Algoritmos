import React, { useState } from 'react';

const Modal = ({ userId, type, onClose, refreshTree }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState(''); // Agregar estado para email
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [fechaFallecimiento, setFechaFallecimiento] = useState('');
  const [relationship, setRelationship] = useState('sucesor');

  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload = {};
    let apiUrl = '';

    if (type === 'family') {
      payload = {
        familyMember: {
          nombre,
          email, 
          fechaNacimiento,
          fechaFallecimiento: fechaFallecimiento || null,
        },
        relationship,
      };
      apiUrl = `http://localhost:8080/api/users/${userId}/family`;
    } else if (type === 'spouse') {
      payload = {
        nombre,
        email, 
        fechaNacimiento,
        fechaFallecimiento: fechaFallecimiento || null,
      };
      apiUrl = `http://localhost:8080/api/users/${userId}/spouse`;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Familiar/Cónyuge agregado:', result);

      // Cerrar el modal y actualizar el árbol
      onClose();
      refreshTree();
    } catch (error) {
      console.error('Error al agregar el familiar/cónyuge:', error);
      alert('Hubo un error al agregar el familiar/cónyuge. Por favor, intenta nuevamente.');
    }
  };

  const handleBackgroundClick = (e) => {
    if (e.target.className === 'modal') {
      onClose();
    }
  };

  return (
    <div className="modal" onClick={handleBackgroundClick}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{type === 'family' ? 'Agregar Familiar' : 'Agregar Cónyuge'}</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
          <input
            type="date"
            id="fechaNacimiento"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            required
          />

          <label htmlFor="fechaFallecimiento">Fecha de Fallecimiento:</label>
          <input
            type="date"
            id="fechaFallecimiento"
            value={fechaFallecimiento}
            onChange={(e) => setFechaFallecimiento(e.target.value)}
          />

          {type === 'family' && (
            <>
              <label htmlFor="relationship">Relación:</label>
              <select
                id="relationship"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                required
              >
                <option value="sucesor">Sucesor</option>
                <option value="antecesor">Antecesor</option>
              </select>
            </>
          )}

          <button type="submit">Agregar</button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
