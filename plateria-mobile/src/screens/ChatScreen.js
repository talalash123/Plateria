import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello! Is my order being prepared?', sender: 'user', time: '2:30 PM' },
    { id: '2', text: 'Hi! Yes, we are preparing your order. It will be ready in 15 mins.', sender: 'kitchen', time: '2:32 PM' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), text: input, sender: 'user', time: '2:35 PM' }]);
    setInput('');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={[styles.msgBox, item.sender === 'user' ? styles.userMsg : styles.kitchenMsg]}>
            <Text style={[styles.msgText, item.sender === 'user' && { color: '#111827' }]}>{item.text}</Text>
            <Text style={styles.timeTxt}>{item.time}</Text>
          </View>
        )}
      />

      <View style={styles.inputBar}>
        <TextInput style={styles.input} placeholder="Type a message..." value={input} onChangeText={setInput} />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Ionicons name="send" size={18} color="#111827" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  msgBox: { padding: 12, borderRadius: 14, marginBottom: 10, maxWidth: '80%' },
  userMsg: { backgroundColor: '#EAB308', alignSelf: 'flex-end', borderBottomRightRadius: 2 },
  kitchenMsg: { backgroundColor: '#FFFFFF', alignSelf: 'flex-start', borderBottomLeftRadius: 2, borderWidth: 1, borderColor: '#E5E7EB' },
  msgText: { fontSize: 14, color: '#111827', fontWeight: '500' },
  timeTxt: { fontSize: 9, color: '#6B7280', marginTop: 4, textAlign: 'right' },
  inputBar: { flexDirection: 'row', padding: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', gap: 10 },
  input: { flex: 1, backgroundColor: '#FAFAFA', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  sendBtn: { backgroundColor: '#EAB308', padding: 12, borderRadius: 10 }
});