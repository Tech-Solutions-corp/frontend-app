import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useVoiceInput } from '../hooks/useVoiceInput';

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
          <Text style={styles.icon}>{isListening ? '⏹' : '🎤'}</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { flex: 1, borderWidth: 1, borderRadius: 8, padding: 10, borderColor: '#ccc' },
  btn: { padding: 12, backgroundColor: '#3182ce', borderRadius: 8 },
  btnActive: { backgroundColor: '#e53e3e' },
  icon: { fontSize: 18 },
  error: { color: 'red', marginTop: 4, fontSize: 12 },
});