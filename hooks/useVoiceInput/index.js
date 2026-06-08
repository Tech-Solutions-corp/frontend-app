import { Platform } from 'react-native';
import { useNativeVoice } from './useNativeVoice';
import { useWebSpeech } from './useWebSpeech';

export function useVoiceInput(onResult) {
  if (Platform.OS === 'web') {
    return useWebSpeech(onResult);
  }
  return useNativeVoice(onResult);
}