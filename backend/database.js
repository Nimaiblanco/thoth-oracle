/**
 * THOTH ORACLE - DATABASE CONNECTION
 * Configuração de Resiliência para MongoDB Atlas
 * Blanco Nimai - São Paulo, Brasil [2026-02-08]
 */

const mongoose = require('mongoose');

const conectarBanco = async () => {
  // Verifica se a variável de ambiente existe antes de tentar conectar
  if (!process.env.MONGODB_URI) {
    console.error("🚨 [Database] ERRO: A variável MONGODB_URI não foi definida no Render.");
    process.exit(1);
  }

  try {
    const connectionOptions = {
      serverSelectionTimeoutMS: 5000, // Tempo limite para encontrar o servidor do banco
      socketTimeoutMS: 45000,         // Mantém a conexão ativa durante processos longos
    };

    // Conectando usando a variável EXATA que está no seu painel do Render
    await mongoose.connect(process.env.MONGODB_URI, connectionOptions);
    
    console.log("🔌 [Database] Conexão com o MongoDB estabelecida com sucesso.");
  } catch (error) {
    console.error("🚨 [Database] Erro crítico na conexão:", error.message);
    
    // Explicação didática: O exit(1) mata o processo para o Render tentar 
    // reiniciar o servidor automaticamente em caso de falha temporária.
    process.exit(1);
  }
};

// Eventos de monitoramento para logs profissionais
mongoose.connection.on('error', err => {
  console.error("❌ [Database] Erro de conexão em tempo de execução:", err);
});

mongoose.connection.on('disconnected', () => {
  console.warn("⚠️ [Database] Conexão com MongoDB perdida. Verificando rede...");
});

module.exports = conectarBanco;