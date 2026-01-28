import React from 'react';
import { type User, userSchemaValidation } from './userSchema.ts';
import useFetch from './useFetch.tsx';

const PRODUTOS_URL = 'https://data.origamid.dev/produtos';

const App = () => {
  const [produtosValidados, setProdutosValidados] = React.useState<
    null | User[]
  >(null);

  const produtos = useFetch<User[]>(PRODUTOS_URL);

  React.useEffect(() => {
    if (!produtos.data || produtos.error) return;

    const result = produtos.data.every((prod) => {
      const resultado = userSchemaValidation.parse(prod);
      return resultado.success;
    });
    if (!result) return;

    setProdutosValidados(produtos.data);
  }, [produtos]);

  return (
    <div className="flex">
      <div>
        {produtosValidados &&
          produtosValidados.map((item) => {
            return (
              <div key={item.id} className="produto-card">
                <ul>
                  <li>{item.nome}</li>
                  <li>{item.preco}</li>
                  <li>{item.quantidade}</li>
                  <li>{item.descricao}</li>
                  <li>
                    {item.internacional
                      ? 'Compra Internacional'
                      : 'Envio Nacional'}
                  </li>
                </ul>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default App;
