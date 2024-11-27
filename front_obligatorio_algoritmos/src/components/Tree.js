// src/components/Tree.js

import React from 'react';
import TreeNode from './TreeNode';

const Tree = ({ data, openModal, refreshTree, confirmerId }) => {
  if (!data) {
    return <div className="tree"><p>Cargando árbol...</p></div>;
  }

  return (
    <div className="tree">
      <ul>
        <TreeNode
          node={data}
          openModal={openModal}
          refreshTree={refreshTree}
          confirmerId={confirmerId}
        />
      </ul>
    </div>
  );
};

export default Tree;
