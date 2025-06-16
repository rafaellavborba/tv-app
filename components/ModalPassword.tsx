import React, { useState, useEffect, useRef } from "react";
import { TextInput, Modal, View, Text, Alert, StyleSheet, Pressable, Platform, BackHandler } from "react-native";
import { useKeyNavigation } from "@/utils/useKeyNavigation";
export default function ModalPassword({ showPasswordModal, setShowPasswordModal }: any) {
  const [password, setPassword] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);
  
    const passwordRef = useRef(null);
    const confirmButtonRef = useRef(null);
    const cancelButtonRef = useRef(null);

  const focusRef = useRef(focusedIndex);
  focusRef.current = focusedIndex;

  useKeyNavigation({
    getFocus: () => focusRef.current,
    setFocus: setFocusedIndex
  });
  const correctPassword = '1234';
  
  const handleValidatePassword = () => {
    if (password === correctPassword) {
      if (Platform.OS === 'android') {
        BackHandler.exitApp();
      } else {
        Alert.alert('Ação não suportada', 'Fechar o aplicativo programaticamente não é permitido no iOS.');
      }
    } else {
      Alert.alert('Senha incorreta', 'Por favor, insira a senha correta.');
    }
    setPassword('');
    setShowPasswordModal(false);
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
  };

  const handlePressEnter = () => {
    switch (focusedIndex) {
        case 0:
            handleValidatePassword()
            break;
        
        case 1:
            handleClosePasswordModal()
            break;
        
        case 2:
            console.log('input')
            break
        default:
            break;
    }
  }
  return (
    <View visible={showPasswordModal} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Digite a senha para sair</Text>
          <TextInput
            ref={passwordRef}
            style={[styles.input, focusedIndex === 2 && styles.inputActive]}
            placeholder="Senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <View style={styles.modalButtons} focusable={true}>
            <Pressable
                ref={confirmButtonRef}
              style={[styles.modalButton, focusedIndex === 0 && styles.buttonActive]}
                onPress={handlePressEnter}

            >
              <Text style={styles.modalButtonText}>Confirmar</Text>
            </Pressable>
            <Pressable
            ref={cancelButtonRef}
              style={[styles.modalButton, styles.cancelButton, focusedIndex === 1 && styles.buttonActive]}
              onPress={handlePressEnter}

            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: {
    backgroundColor: "rgba(215,210,196,1)",
    padding: 40,
    borderRadius: 10,
    width: "80%",
    maxWidth: 400,
    alignItems: "center",
  },
  modalTitle: { color: "#384c29", fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "100%",
    height: 55,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  modalButton: {
    backgroundColor: "#384c29",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
    height: 55,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.5,
  },
  cancelButton: { backgroundColor: "#836977" },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
  buttonActive: { elevation: 5, opacity: 1 },
  inputActive: { borderColor: "#384c29" },
});
