const mongoose = require('mongoose');

/**
 * Função assíncrona para estabelecer conexão com o MongoDB Atlas.
 * Configurada com timeouts para garantir a resiliência do Templo.
 */
const conectarBanco = async () => {
  try {
    // Opções de conexão para maior estabilidade em produção
    const connectionOptions = {
      serverSelectionTimeoutMS: 5000, // Falha após 5 segundos se o banco estiver fora
      socketTimeoutMS: 45000,         // Fecha sockets inativos
    };

    await mongoose.connect(process.env.MONGODB_URI, connectionOptions);
    
    console.log("🔌 [Database] Conexão com o MongoDB estabelecida com sucesso.");
  } catch (error) {
    console.error("🚨 [Database] Erro crítico na conexão:", error.message);
    
    // Na entrevista, explique que o exit(1) evita que o servidor 
    // responda rotas sem ter os dados das cartas prontos.
    process.exit(1);
  }
};

// Monitoramento de eventos da conexão (Opcional, mas muito profissional)
mongoose.connection.on('disconnected', () => {
  console.warn("⚠️ [Database] Conexão com MongoDB perdida. Tentando reconectar...");
});

module.exports = conectarBanco;