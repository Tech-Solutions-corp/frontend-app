import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Svg, { Path, Rect, Line } from 'react-native-svg';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { COLORS } from '../constants/theme';

export function VoiceInput({
  value,
  onChangeText,
  placeholder = 'Digite ou use o microfone',
  multiline = false,
  style,
  ...props
}) {
  const { isListening, error, start, stop } = useVoiceInput(onChangeText);

  return (
    <View>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, style]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          multiline={multiline}
          {...props}
        />
        <TouchableOpacity
          style={[styles.btn, isListening && styles.btnActive]}
          onPress={isListening ? stop : start}
        >
          {isListening ? (
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <Rect x="6" y="6" width="12" height="12" rx="2" fill="#fff" />
            </Svg>
          ) : (
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z" />
              <Path d="M19 11a7 7 0 0 1-14 0" />
              <Line x1="12" y1="17" x2="12" y2="21" />
              <Line x1="8" y1="21" x2="16" y2="21" />
            </Svg>
          )}
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { flex: 1, borderWidth: 1, borderRadius: 8, padding: 10, borderColor: '#ccc' },
  btn: { padding: 12, backgroundColor: COLORS.indigo, borderRadius: 8 },
  btnActive: { backgroundColor: '#e53e3e' },
  error: { color: 'red', marginTop: 4, fontSize: 12 },
});