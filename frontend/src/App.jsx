import { useState } from 'react'
import axios from 'axios'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [escolhendo, setEscolhendo] = useState(false)

  const baralho = Array.from({ length: 22 }, (_, i) => i + 1)

  const handleLoginSuccess = (credentialResponse) => {
    setUser(credentialResponse)
    setEscolhendo(true)
  }

  const selecionarCarta = async () => {
    if (carregando) return;
    setCarregando(true)
    try {
      const response = await axios.post('https://thoth-oracle.onrender.com/api/consultar', {})
      setResultado(response.data)
      setEscolhendo(false)
      // Scroll automático para o resultado
      setTimeout(() => {
        document.getElementById('resultado-anchor')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      alert("A conexão com o Templo falhou.")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <GoogleOAuthProvider clientId="407047362832-42t593eufe408s854vmjtqkp8ltc77pf.apps.googleusercontent.com">
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
                <GoogleLogin onSuccess={handleLoginSuccess} onError={() => {}} />
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
                  O Tarot de Thoth foi criado pelo mestre <strong>Aleister Crowley</strong> e pintado por Lady Frieda Harris. 
                  Diferente dos baralhos tradicionais, ele mergulha profundamente na astrologia, na cabala e na geometria sagrada.
                </p>
                <p>
                  Baseado no livro <em>"Tarô: O Espelho da Alma"</em> de Gerd Ziegler, este oráculo não apenas prevê, 
                  mas revela a verdade crua da sua psique e o conselho prático do escriba divino Thoth.
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
                <p>Por favor, faça login no topo para consultar as lâminas.</p>
              </div>
            ) : (
              <div className="tabuleiro-area">
                {escolhendo && !resultado && (
                  <div className="fade-in">
                    <h3 className="instrucao-mística">Foque na sua consulta enquanto desliza pelas lâminas:</h3>
                    <div className="fileira-cartas-reta">
                      {baralho.map((num, index) => (
                        <img 
                          key={num}
                          src="http://localhost:5000/images/thoth-reverse-of-cards.jpg" 
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
                    <img src={`http://localhost:5000/${resultado.carta.imagem}`} className="imagem-revelada" />
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
    </GoogleOAuthProvider>
  )
}

export default App