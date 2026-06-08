import { useState, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Voice from '@react-native-voice/voice';

export function useNativeVoice(onResult) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechError = (e) => {
      setError(e.error?.message || 'Erro no reconhecimento');
      setIsListening(false);
    };
    Voice.onSpeechResults = (e) => {
      const text = e.value?.[0];
      if (text) onResult(text);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const start = async () => {
    setError('');
    const ok = await requestPermission();
    if (!ok) return setError('Permissão de microfone negada');
    try {
      await Voice.start('pt-BR');
    } catch (e) {
      setError('Não foi possível iniciar');
    }
  };

  const stop = async () => {
    try {
      await Voice.stop();
    } catch (e) {}
  };

  return { isListening, error, start, stop };
}