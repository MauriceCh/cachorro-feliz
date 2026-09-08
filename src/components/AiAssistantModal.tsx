import React, { useState } from 'react';
import { Sparkles, X, MessageSquare, Send, Bot, RefreshCw } from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextData?: any;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  contextData
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleAskGemini = async (customPrompt?: string) => {
    const queryPrompt = customPrompt || prompt;
    if (!queryPrompt.trim()) return;

    setIsLoading(true);
    setResponse('');

    try {
      const systemInstruction = `Eres "Cachorro Bot", el asistente de inteligencia artificial exclusivo de Cachorro Feliz, una empresa artesanal de alimentos saludables para mascotas en Colombia.
Tu objetivo es ayudar con:
1. Redacción de mensajes de WhatsApp amigables, divertidos y persuasivos para clientes, cumpleaños de sus mascotas, confirmación de pedidos y fidelización.
2. Análisis de costos, mermas de alistamiento y merma de deshidratación/cocción en recetas para mascotas.
3. Consejos de optimización de producción de alimentos para perros y gatos.

Responde con un tono muy amable, profesional y enfocado en la nutrición saludable de mascotas.`;

      const fullPrompt = `${systemInstruction}\n\nPregunta o solicitud del usuario:\n${queryPrompt}\n\nDatos de contexto del sistema:\n${JSON.stringify(contextData || {})}`;

      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt })
      });

      const data = await res.json();
      if (data.text) {
        setResponse(data.text);
      } else if (data.error) {
        setResponse(`Error al comunicarse con la IA: ${data.error}`);
      }
    } catch (err: any) {
      setResponse(`Ocurrió un error al procesar la solicitud: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Redacta un saludo de cumpleaños para la perrita Maya que cumple años hoy, ofreciendo 15% de descuento.",
    "¿Cómo puedo reducir la merma en la preparación de las manzanas para las galletas?",
    "Escribe una plantilla de WhatsApp para confirmar el despacho de un pedido a domicilio."
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 border-b border-[#E0D7C6]/60 pb-3 mb-4">
          <div className="p-2 bg-[#2D463E] text-white rounded-xl shadow-xs">
            <Sparkles className="w-5 h-5 text-[#D4A373]" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-display text-[#2D463E]">Cachorro Feliz AI Assistant</h3>
            <p className="text-xs text-slate-500">Asistente Gemini para mensajes, recetas y asesoría de mermas</p>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="space-y-1.5 mb-4">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Sugerencias Rápidas:</span>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(qp);
                  handleAskGemini(qp);
                }}
                className="text-[11px] bg-[#F9F7F4] text-[#2D463E] hover:bg-[#E0D7C6]/30 border border-[#E0D7C6] px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-left font-medium"
              >
                ⚡ {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Response Box */}
        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-y-auto min-h-[160px] text-xs leading-relaxed space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-full space-x-2 text-[#EF8828]">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span className="font-bold">Consultando a Gemini AI...</span>
            </div>
          ) : response ? (
            <div className="whitespace-pre-wrap text-slate-800 font-medium">{response}</div>
          ) : (
            <div className="text-slate-400 text-center py-8 italic">
              Escribe tu consulta o selecciona una sugerencia rápida para generar textos de comunicación o consultar consejos sobre tus mermas.
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Escribe tu consulta o pide redactar un mensaje..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAskGemini()}
            className="flex-1 text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#EF8828] focus:outline-none"
          />
          <button
            onClick={() => handleAskGemini()}
            disabled={isLoading || !prompt.trim()}
            className="bg-[#EF8828] hover:bg-[#d6761f] disabled:bg-slate-300 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
