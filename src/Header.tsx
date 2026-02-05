import React from 'react';
import { useUserContext } from './UserContext.tsx';

const Header = () => {
  const { data, loading, error, fetchUser } = useUserContext();

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro</div>;
  if (!data) return <div>Nenhum usuário encontrado.</div>;
  return (
    <aside className="sidebar">
      {data.map((user) => (
        <button
          key={user.id}
          className="user-button"
          onClick={() => fetchUser(user.id)}
        >
          <span className="user-name-mini">{user.nome}</span>
          <div className="user-stats-mini">
            <span>Aulas: {user.aulas}</span>
            <span>Cursos: {user.cursos}</span>
          </div>
        </button>
      ))}
    </aside>
  );
};

export default Header;
