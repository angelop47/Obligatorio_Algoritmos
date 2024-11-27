import React from 'react';

const TreeNode = ({ node, openModal, refreshTree, confirmerId }) => {
  const handleAddFamily = (e) => {
    e.preventDefault();
    openModal(node.id, 'family');
  };

  const handleAddSpouse = (e) => {
    e.preventDefault();
    openModal(node.id, 'spouse');
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

    try {
      const response = await fetch(`http://localhost:8080/api/users/${node.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      // Actualizar el árbol después de eliminar
      refreshTree();
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      alert('Hubo un error al eliminar el usuario. Por favor, intenta nuevamente.');
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!window.confirm('¿Estás seguro de que deseas confirmar este usuario?')) return;

    try {
      const response = await fetch(`http://localhost:8080/api/users/${node.id}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmerId: confirmerId, 
        }),
      });

      if (response.ok) {
        // Verificar si la respuesta contiene JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json();
          console.log('Usuario confirmado:', result);
        } else {
          console.log('Usuario confirmado');
        }

        // Actualizar el árbol después de confirmar
        refreshTree();
      } else {
        // Intentar obtener el mensaje de error del backend
        let errorMessage = `Error en la solicitud: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (jsonError) {
          // Si no hay JSON, mantener el mensaje de error predeterminado
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error al confirmar el usuario:', error);
      alert('Hubo un error al confirmar el usuario. Por favor, intenta nuevamente.');
    }
  };

  // Construir el nombre completo incluyendo los cónyuges si existen
  let fullName = node.nombre;

  if (node.conyuges && node.conyuges.length > 0) {
    const conyugeNombres = node.conyuges.map(conyuge => conyuge.nombre).join(' + ');
    fullName += ` + ${conyugeNombres}`;
  }

  // Agregar estado de confirmación solo usando confirmationStatus
  let confirmationStatusLabel = '';
  if (node.confirmationStatus) {
    confirmationStatusLabel = (
      <h5 className={`confirmation-status ${node.confirmationStatus}`}>
        {node.confirmationStatus}
      </h5>
    );
  }

  return (
    <li>
      <a href="#">
        <span>{fullName}</span>
        {confirmationStatusLabel}
        <div className="buttons">
          <button className="add-family-btn" onClick={handleAddFamily}>Agregar Familiar</button>
          <button className="add-spouse-btn" onClick={handleAddSpouse}>Agregar Cónyuge</button>
          <button className="delete-user-btn" onClick={handleDeleteUser}>Eliminar Usuario</button>
          {node.confirmationStatus === 'PENDING' && (
            <button className="confirm-btn" onClick={handleConfirm}>Confirmar</button>
          )}
        </div>
      </a>
      {node.hijos && node.hijos.length > 0 && (
        <ul>
          {node.hijos.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              openModal={openModal}
              refreshTree={refreshTree}
              confirmerId={confirmerId} 
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default TreeNode;
