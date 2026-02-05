import React from 'react';
import { useUserContext } from './UserContext.tsx';

const Content = () => {
  const { userData, userLoading, userError } = useUserContext();

  if (userError) return <div>Erro na API</div>;
  if (userLoading) return <div>Carregando Dados</div>;
  if (userData)
    return (
      <section className="detalhes content-animation">
        <header className="detalhes-header">
          <h2 className="user-title">{userData.nome}</h2>
          <span className="user-id">Aluno ID: #{userData.id}</span>
        </header>

        <div className="info-section">
          <h3>Dados Pessoais</h3>
          <p>
            Este aluno tem <strong>{userData.idade} anos</strong> e está ativo
            no sistema.
          </p>
        </div>

        <hr />

        <div className="info-section">
          <h3>Preferências de Experiência</h3>
          <dl className="prefs-list">
            <div className="pref-item">
              <dt>Velocidade</dt>
              <dd>{userData.preferencias.playback}x</dd>
            </div>

            <div className="pref-item">
              <dt>Volume</dt>
              <dd>{(userData.preferencias.volume * 100).toFixed(0)}%</dd>
            </div>

            <div className="pref-item">
              <dt>Qualidade</dt>
              <dd className="badge-qualidade">
                {userData.preferencias.qualidade}
              </dd>
            </div>
          </dl>
        </div>
      </section>
    );
};

export default Content;
