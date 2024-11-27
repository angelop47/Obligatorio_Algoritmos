// src/components/App.js

import React, { useState, useEffect } from 'react';
import SearchForm from './components/SearchForm';
import Tree from './components/Tree';
import Modal from './components/Modal';
import Auth from './components/Auth';
import './App.css'; // Importar el CSS


const App = () => {
  const [currentTreeId, setCurrentTreeId] = useState(null); // Inicializar sin valor
  const [treeData, setTreeData] = useState(null);
  const [modalData, setModalData] = useState({
    isOpen: false,
    userId: null,
    type: 'family', // 'family' o 'spouse'
  });
  const [loggedInUser, setLoggedInUser] = useState(null); // Estado para el usuario logueado

  // Función para obtener los datos del árbol desde la API por ID
  const fetchTreeDataById = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${id}/tree`);

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setTreeData(data);
    } catch (error) {
      console.error('Error al obtener los datos del árbol por ID:', error);
      setTreeData(null);
      alert('Hubo un error al buscar el árbol por ID. Por favor, intenta nuevamente.');
    }
  };

  // Función para obtener los datos del árbol desde la API por Nombre
  const fetchTreeDataByName = async (name) => {
    try {
      const encodedName = encodeURIComponent(name);
      const response = await fetch(`http://localhost:8080/api/users/name/${encodedName}/tree`);

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setTreeData(data);
      setCurrentTreeId(null); // Limpiar el ID actual si se buscó por nombre
    } catch (error) {
      console.error('Error al obtener los datos del árbol por Nombre:', error);
      setTreeData(null);
      alert('Hubo un error al buscar el árbol por Nombre. Por favor, intenta nuevamente.');
    }
  };

  // useEffect para buscar por ID cuando currentTreeId cambia
  useEffect(() => {
    if (currentTreeId !== null) {
      fetchTreeDataById(currentTreeId);
    }
  }, [currentTreeId]);

  // Función para manejar la búsqueda por nombre
  const setTreeByName = (name) => {
    fetchTreeDataByName(name);
  };

  // Función para manejar la apertura del modal
  const openModal = (userId, type) => {
    setModalData({
      isOpen: true,
      userId,
      type,
    });
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalData({
      isOpen: false,
      userId: null,
      type: 'family',
    });
  };

  // Función para actualizar el árbol después de agregar, eliminar o confirmar un usuario
  const refreshTree = () => {
    if (currentTreeId !== null) {
      fetchTreeDataById(currentTreeId);
    } else if (treeData && treeData.nombre) { // Asumiendo que treeData tiene un campo 'nombre' cuando se busca por nombre
      fetchTreeDataByName(treeData.nombre);
    }
  };

  // Función para manejar el login exitoso
  const handleLogin = (user) => {
    setLoggedInUser(user);
    setCurrentTreeId(user.id); // Asignar el ID del usuario logueado para mostrar su árbol
  };

  // Si no hay usuario logueado, mostrar el componente Auth
  if (!loggedInUser) {
    return (
      <div className="App">
        <h1>Bienvenido al Árbol Familiar</h1>
        <Auth onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Árbol Familiar de {loggedInUser.nombre}</h1>
      <SearchForm
        setCurrentTreeId={setCurrentTreeId}
        setTreeByName={setTreeByName}
      />
      <Tree
        data={treeData}
        openModal={openModal}
        refreshTree={refreshTree}
        confirmerId={loggedInUser.id} // Pasar el confirmerId al componente Tree
      />
      {modalData.isOpen && (
        <Modal
          userId={modalData.userId}
          type={modalData.type}
          onClose={closeModal}
          refreshTree={refreshTree}
        />
      )}
    </div>
  );
};

export default App;