import React, { createContext, useState } from 'react';

// Criação do contexto
export const CarrinhoContext = createContext();

// Componente provedor
export const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);

  // Função para adicionar um item ao carrinho
const adicionarAoCarrinho = (item) => {
  setCarrinho((prevCarrinho) => {
    const existingItem = prevCarrinho.find((produto) => produto._id  === item._id); // Use _id

    if (existingItem) {
      // Se o item já existir, apenas atualiza a quantidade
      return prevCarrinho.map((produto) =>
        produto._id === item._id
          ? { ...produto, quantidade: produto.quantidade + item.quantidade } // Incrementa a quantidade
          : produto
      );
    }

    // Se o item não existir, adiciona ao carrinho
    return [...prevCarrinho, { ...item, quantidade: item.quantidade }];
  });
};

  
  // Função para remover um item do carrinho
  const removerDoCarrinho = (_id) => {
    setCarrinho((prevCarrinho) => prevCarrinho.filter((item) => item._id !== _id));
  };

  const limparCarrinho = () => {
    setCarrinho([]); // Limpa o carrinho
  };

  return (
    <CarrinhoContext.Provider value={{ carrinho, adicionarAoCarrinho, removerDoCarrinho ,limparCarrinho}}>
      {children}
    </CarrinhoContext.Provider>
  );
};