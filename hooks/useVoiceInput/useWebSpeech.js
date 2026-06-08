import { useState, useRef } from 'react';

export function useWebSpeech(onResult) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  const start = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return setError('Seu navegador não suporta reconhecimento de voz');
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (e) => {
      setError(e.error || 'Erro no reconhecimento');
      setIsListening(false);
    };
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      onResult(text);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setError('');
  };

  const stop = () => {
    recognitionRef.current?.stop();
  };

  return { isListening, error, start, stop };
}