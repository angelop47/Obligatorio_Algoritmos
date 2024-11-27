import React, { useState } from 'react';

const SearchForm = ({ setCurrentTreeId, setTreeByName }) => {
  const [treeIdInput, setTreeIdInput] = useState('');
  const [treeNameInput, setTreeNameInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTreeId = treeIdInput.trim();
    const newTreeName = treeNameInput.trim();

    if (newTreeId && newTreeName) {
      alert('Por favor, utiliza solo un método de búsqueda a la vez.');
      return;
    }

    if (newTreeId) {
      // Validación básica del ID
      if (isNaN(newTreeId) || Number(newTreeId) < 1) {
        alert('Por favor, ingresa un ID válido (número entero positivo).');
        return;
      }
      setCurrentTreeId(Number(newTreeId));
      setTreeNameInput('');
    } else if (newTreeName) {
      // Validación básica del nombre
      if (newTreeName.length < 2) {
        alert('Por favor, ingresa un nombre válido.');
        return;
      }
      setTreeByName(newTreeName);
      setTreeIdInput('');
    } else {
      alert('Por favor, ingresa un ID o un nombre para buscar.');
    }
  };

  return (
    <div className="search-container" style={styles.searchContainer}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="treeId" style={styles.label}>Buscar por ID:</label>
          <input
            type="number"
            id="treeId"
            value={treeIdInput}
            onChange={(e) => setTreeIdInput(e.target.value)}
            placeholder="Ingrese el ID del árbol"
            min="1"
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="treeName" style={styles.label}>Buscar por Nombre:</label>
          <input
            type="text"
            id="treeName"
            value={treeNameInput}
            onChange={(e) => setTreeNameInput(e.target.value)}
            placeholder="Ingrese el Nombre del árbol"
            style={styles.input}
          />
        </div>
        <button
          type="submit"
          style={styles.button}
        >
          Buscar Árbol
        </button>
      </form>
    </div>
  );
};

const styles = {
  searchContainer: {
    marginBottom: '20px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    padding: '8px',
    fontSize: '16px',
    borderRadius: '3px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default SearchForm;
