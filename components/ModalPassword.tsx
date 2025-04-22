// import { TextInput, Modal, View, Text, TouchableOpacity, Platform, BackHandler, Alert, StyleSheet } from "react-native"
// import React, { useState } from 'react';

// export default function ModalPassword({showPasswordModal, setShowPasswordModal}: any){
//   const [password, setPassword] = useState('');
//   const [focusedButton, setFocusedButton] = useState('password');

//   const correctPassword = '1234';
//     const handleValidatePassword = () => {
//         if (password === correctPassword) {
//         if (Platform.OS === 'android') {
//             BackHandler.exitApp();
//         } else {
//             Alert.alert('Ação não suportada', 'Fechar o aplicativo programaticamente não é permitido no iOS.');
//         }
//         } else {
//             Alert.alert('Senha incorreta', 'Por favor, insira a senha correta.');
//         }
//         setPassword('');
//         setShowPasswordModal(false)
//     };
//     const handleClosePasswordModal = () => {
//         setShowPasswordModal(false)
//     }

    
//     return (
//         <Modal visible={showPasswordModal} transparent animationType="slide">
//             <View style={styles.modalContainer}>
//                 <View style={styles.modalContent}>
//                 <Text style={styles.modalTitle}>Digite a senha para sair</Text>
//                 <TextInput
//                   nativeID="1"
//                   nextFocusDown={2}
//                   nextFocusLeft={2}
//                   nextFocusRight={3}
//                   nextFocusUp={2}
//                     style={styles.input}
//                     placeholder="Senha"
//                     secureTextEntry
//                     value={password}
//                     onChangeText={setPassword}
//                     onFocus={setFocusedButton('password')}
//                 />
//                 <View style={styles.modalButtons}>
//                     <TouchableOpacity 
//                       style={styles.modalButton} 
//                       onPress={handleValidatePassword} 
//                       nativeID='2'
//                       nextFocusDown={1}
//                       nextFocusLeft={3}
//                       nextFocusRight={3}
//                       nextFocusUp={1}
//                     >
//                       <Text style={styles.modalButtonText}>Confirmar</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity 
//                       nativeID='3' 
//                       style={[styles.modalButton, styles.cancelButton]} 
//                       onPress={handleClosePasswordModal}
//                       nextFocusDown={1}
//                       nextFocusLeft={2}
//                       nextFocusRight={2}
//                       nextFocusUp={1}
//                     >
//                       <Text style={styles.modalButtonText}>Cancelar</Text>
//                     </TouchableOpacity>
//                 </View>
//                 </View>
//             </View>
//         </Modal>
//     )
// }
// const styles = StyleSheet.create({
//     modalContainer: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     },
//     modalContent: {
//       backgroundColor: 'rgba(215, 210, 196, 1)',
//       padding: 40,
//       borderRadius: 10,
//       width: '80%',
//       maxWidth: 400,
//       alignItems: 'center',
//     },
//     modalTitle: {
//       color: '#384c29',
//       fontSize: 24,
//       fontWeight: 'bold',
//       marginBottom: 20,
//     },
//     input: {
//       width: '100%',
//       height: 55,
//       padding: 10,
//       borderWidth: 1,
//       borderColor: '#ccc',
//       borderRadius: 8,
//       marginBottom: 20,
//       backgroundColor: '#f0f0f0'
//     },
//     modalButtons: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       width: '100%',
//     },
//     modalButton: {
//       backgroundColor: '#384c29',
//       paddingVertical: 10,
//       paddingHorizontal: 20,
//       borderRadius: 5,
//       marginHorizontal: 5,
//       height: 55,
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center'
//     },
//     cancelButton: {
//       backgroundColor: '#836977',
//     },
//     modalButtonText: {
//       color: '#fff',
//       fontWeight: 'bold',
//     },
// })