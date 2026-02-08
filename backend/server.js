/**
 * THOTH ORACLE - BACKEND ENGINE
 * Professional Portfolio Version - Blanco Nimai
 * Localização: São Paulo, Brasil [2026-02-08]
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const { GoogleGenerativeAI } = require("@google/generative-ai");
const conectarBanco = require('./database');
const mongoose = require('mongoose');

const app = express();

// --- CORREÇÃO DE SEGURANÇA (CORS) ---
// Configurado para autorizar sua Vercel e evitar o erro de conexão
app.use(cors({
  origin: ['https://thoth-oracle.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json()); 

// --- SERVIR IMAGENS ESTÁTICAS ---
// path.resolve é mais estável para garantir que o Render encontre a pasta
app.use('/images', express.static(path.resolve(__dirname, 'images')));

/**
 * SCHEMA DAS CARTAS
 * Mantendo o padrão profissional para o MongoDB
 */
const CartaSchema = new mongoose.Schema({
  numero: Number,
  slug: String,
  nome: Object,
  imagem_url: String,
  tipo: String
}, { collection: 'cartas' });

const Carta = mongoose.model('Carta', CartaSchema);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * ROTA DE CONSULTA AO ORÁCULO
 */
app.post('/api/consultar', async (req, res) => {
  const { pergunta } = req.body;

  try {
    // 1. AUTODISCOVERY: Busca todos os modelos disponíveis (Mantido conforme solicitado)
    const urlDiscovery = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    const respDiscovery = await fetch(urlDiscovery);
    const dataDiscovery = await respDiscovery.json();
    
    const modelosDisponiveis = dataDiscovery.models
      ? dataDiscovery.models
          .filter(m => m.supportedGenerationMethods.includes("generateContent"))
          .map(m => m.name)
      : [];

    // 2. ORDEM DE PRIORIDADE (Fallback - Mantido conforme solicitado)
    const filaDeTentativas = [
      modelosDisponiveis.find(m => m.includes("gemini-2.5-flash")),
      modelosDisponiveis.find(m => m.includes("gemini-1.5-flash")),
      modelosDisponiveis.find(m => m.includes("gemini-pro")),
      modelosDisponiveis[0]
    ].filter(Boolean);

    // 3. SELEÇÃO DA CARTA NO BANCO
    const cartas = await Carta.find({ tipo: "Arcano Maior" });
    if (cartas.length === 0) throw new Error("Banco de dados de cartas vazio.");
    
    const cartaSorteada = cartas[Math.floor(Math.random() * cartas.length)];
    const nomeIdentificador = cartaSorteada.slug.replace(/-/g, ' ').toUpperCase();

    // 4. PROMPT ENGINEERING (Persona de Thoth)
    const prompt = `
      PERSONA: Você é Thoth, o escriba divino. Responda com sabedoria e autoridade.
      REFERÊNCIA: Baseie-se estritamente no livro "Tarô Espelho da Alma" (Gerd Ziegler/Aleister Crowley).
      CONTEXTO: O destino revelou a lâmina ${nomeIdentificador} para o buscador.

      REGRAS DE RESPOSTA (ESTRITAS):
      1. Responda em PORTUGUÊS (Brasil).
      2. Use no máximo 5 parágrafos curtos e impactantes.
      3. Não use introduções ou saudações.
      4. Foque no conselho prático da carta para o momento presente.
      5. Termine com uma frase de poder.
    `;

    // 5. SISTEMA DE RESILIÊNCIA (Retry Loop)
    let responseIA;
    let modeloQueFuncionou;

    for (const modelo of filaDeTentativas) {
      try {
        console.log(`📡 Invocando Thoth via: ${modelo}...`);
        const model = genAI.getGenerativeModel({ model: modelo });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        responseIA = response.text();
        
        if (responseIA) {
          modeloQueFuncionou = modelo;
          break; 
        }
      } catch (err) {
        console.warn(`❌ Falha no modelo ${modelo}: ${err.message}. Tentando próximo...`);
      }
    }

    if (!responseIA) throw new Error("Thoth permanece em silêncio. Cota esgotada.");

    // 6. RESPOSTA AO FRONTEND
    res.json({
      texto: responseIA.trim(),
      modelo_utilizado: modeloQueFuncionou,
      carta: {
        nome: nomeIdentificador,
        imagem: cartaSorteada.imagem_url, 
        numero: cartaSorteada.numero
      }
    });

  } catch (error) {
    console.error("❌ ERRO FINAL NO BACKEND:", error.message);
    res.status(500).json({ erro: "O Templo está em silêncio. Tente novamente em breve." });
  }
});

// Inicialização com conexão ao Banco
const PORT = process.env.PORT || 5000;
conectarBanco().then(() => {
  app.listen(PORT, () => {
    // Log profissional para o Render
    console.log(`🚀 Templo Ativo. Porta: ${PORT}`);
    console.log(`🔌 Banco de Dados Conectado.`);
  });
}).catch(err => {
  console.error("❌ FALHA CRÍTICA NO STARTUP:", err.message);
});