import { useState } from 'react'
import axios from 'axios'
import './App.css'

/**
 * THOTH ORACLE - Versão para Portfólio (Mock Auth)
 * Projeto em Português - Localização: São Paulo, Brasil [2026-01-22]
 */

function App() {
  const [user, setUser] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [escolhendo, setEscolhendo] = useState(false)

  // URL do Backend no Render
  const BACKEND_URL = 'https://thoth-oracle.onrender.com';

  const baralho = Array.from({ length: 22 }, (_, i) => i + 1)

  // Função de Mock Login para evitar erros de OAuth no portfólio
  const handleMockLogin = () => {
    const mockUser = {
      name: "Visitante Zen",
      email: "visitante@exemplo.com"
    };
    setUser(mockUser);
    setEscolhendo(true);
    console.log("Login simulado: Acesso concedido ao Templo.");
  }

  const selecionarCarta = async () => {
    if (carregando) return;
    setCarregando(true)
    try {
      const response = await axios.post(`${BACKEND_URL}/api/consultar`, {})
      setResultado(response.data)
      setEscolhendo(false)
      
      // Scroll automático para o resultado
      setTimeout(() => {
        document.getElementById('resultado-anchor')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      alert("A conexão com o Templo falhou. Verifique se o backend está ativo.")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="App">
      
      {/* --- MENU DE NAVEGAÇÃO --- */}
      <nav className="navbar-oracle">
        <div className="nav-brand">THOTH ORACLE</div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#sobre">O Livro</a>
          <a href="#oraculo">Consultar</a>
          <a href="#contato">Contato</a>
        </div>
        {user && (
          <button className="logout-btn" onClick={() => window.location.reload()}>Sair</button>
        )}
      </nav>

      {/* --- SEÇÃO 1: HOME / HERO --- */}
      <header id="home" className="hero-section">
        <div className="hero-content fade-in">
          <h1>Thoth Oracle</h1>
          <p>Mestre da Sabedoria e Escriba Divino</p>
          {!user && (
            <div className="login-box-hero">
              <button className="btn-login-mock" onClick={handleMockLogin}>
                Entrar no Templo
              </button>
              <p className="login-hint">Acesso livre para consulta</p>
            </div>
          )}
        </div>
      </header>

{/* --- SEÇÃO 2: SOBRE THOTH & CROWLEY --- */}
      <section id="sobre" className="section-padding fade-in">
        <div className="container">
          <h2 className="section-title">O Espelho da Alma</h2>
          <div className="sobre-grid">
            <div className="sobre-text">
              <p>
                O Tarot de Thoth foi concebido pelo mestre <strong>Aleister Crowley</strong> e imortalizado pela arte de Lady Frieda Harris. 
                Diferente dos baralhos tradicionais, ele mergulha profundamente na astrologia, na cabala e na geometria sagrada. 
                Baseado na obra <em>"Tarô: O Espelho da Alma"</em> de Gerd Ziegler, este oráculo, revela a verdade crua da sua psique sob a sabedoria do escriba divino Thoth.
              </p>
              
              <p>
                Desenvolvi este sistema para que os buscadores não permaneçam estagnados em seus dilemas, mas encontrem valor na jornada humana, 
                elevando sua consciência. Este Tarot não é para predições vazias, mas para <strong>abrir os olhos do coração</strong>, 
                já que nossos olhos físicos muitas vezes não conseguem distinguir entre a verdade e a ilusão.
              </p>
              
              <p>
                <strong>Instruções:</strong> Foque em sua consulta — seja sobre trabalho, família ou relacionamentos. 
                Abaixo, você escolherá uma lâmina entre os 22 Arcanos Maiores. Que este momento sirva como uma 
                virada de chave para o seu desenvolvimento pessoal.
              </p>
            </div>
            <div className="sobre-icon">𓁟</div>
          </div>
        </div>
      </section>

      {/* --- SEÇÃO 3: ORÁCULO (O JOGO) --- */}
      <section id="oraculo" className="section-padding oraculo-bg">
        <div className="container">
          {!user ? (
            <div className="lock-overlay">
              <h3>Acesso Restrito</h3>
              <p>Por favor, entre no templo no topo para consultar as lâminas.</p>
            </div>
          ) : (
            <div className="tabuleiro-area">
              {escolhendo && !resultado && (
                <div className="fade-in">
                  <h3 className="instrucao-mística">Foque na sua consulta e toque em uma lâmina:</h3>
                  <div className="fileira-cartas-reta">
                    {baralho.map((num, index) => (
                      <img 
                        key={num}
                        src={`${BACKEND_URL}/images/thoth-reverse-of-cards.jpg`} 
                        alt="Carta Virada"
                        className="carta-plana"
                        style={{ '--i': index }} 
                        onClick={selecionarCarta}
                      />
                    ))}
                  </div>
                </div>
              )}

              {carregando && <p className="status-ritual pulse">Invocando a sabedoria de Thoth...</p>}

              {resultado && (
                <article id="resultado-anchor" className="resultado-final fade-in">
                  <h2 className="nome-carta">{resultado.carta.nome}</h2>
                  <img src={`${BACKEND_URL}/${resultado.carta.imagem}`} className="imagem-revelada" alt={resultado.carta.nome} />
                  <div className="mensagem">
                    <p className="thoth-voz">Thoth profetiza:</p>
                    <div className="texto-ia">"{resultado.texto}"</div>
                    <button className="btn-retry" onClick={() => {setResultado(null); setEscolhendo(true);}}>
                      Nova Consulta
                    </button>
                  </div>
                </article>
              )}
            </div>
          )}
        </div>
      </section>

      {/* --- SEÇÃO 4: CONTATO & REFERÊNCIA --- */}
      <footer id="contato" className="footer-oracle">
        <div className="footer-content">
          <h3>Blanco Nimai</h3>
          <p>Desenvolvedor Full Stack | São Paulo, Brasil</p>
          <div className="social-links">
            <a href="https://nimaiblanco.github.io/Portafolio/" target="_blank" rel="noreferrer">Meu Portfólio</a>
            <a href="mailto:seu-email@exemplo.com">Contato</a>
          </div>
          <p className="copy">© 2026 Thoth Oracle - Sabedoria Artificial</p>
        </div>
      </footer>

    </div>
  )
}

export default App