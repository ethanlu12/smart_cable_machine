// import { StatusBar } from 'expo-status-bar';
// import { Platform, StyleSheet } from 'react-native';

// import EditScreenInfo from '@/components/EditScreenInfo';
// import { Text, View } from '@/components/Themed';

// export default function ModalScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Modal</Text>
//       <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
//       <EditScreenInfo path="modal" />

//       {/* Use a light status bar on iOS to account for the black space above the modal */}
//       <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   separator: {
//     marginVertical: 30,
//     height: 1,
//     width: '80%',
//   },
// });

//////////////////////////////////////////////////////////

// import React from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';

// const SettingsScreen = ({ navigation }) => {
//   // Function to handle checking BLE connection status
//   const checkBLEConnection = () => {
//     // Implement BLE connection check logic here
//     console.log('Checking BLE Connection...');
//   };

//   return (
//     <View style={styles.container}>
//       <Text>Settings Screen</Text>
//       <Button title="Check BLE Connection" onPress={checkBLEConnection} />
//       {/* Additional settings options can be added here */}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default SettingsScreen;

////////////////////////////////////////////////////////

import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import BleManager from 'react-native-ble-manager'; // Import BLE manager

const ModalScreen = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const checkBLEConnection = () => {
    setIsChecking(true);

    // This is a placeholder for the actual BLE check logic
    // You would use BleManager to check if connected to ESP32
    // For demonstration, we simulate checking with a timeout
    setTimeout(() => {
      setIsChecking(false);
      // Simulate a successful connection (you would replace this with actual BLE logic)
      setIsConnected(true);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BLE Connection Status</Text>
      <Button title="Check BLE Connection" onPress={checkBLEConnection} disabled={isChecking} />
      {isChecking ? (
        <Text style={styles.subTitle}>Checking BLE connection...</Text>
      ) : isConnected ? (
        <Text style={styles.subTitle}>Device is connected to ESP32!</Text>
      ) : (
        <Text style={styles.subTitle}>Device is not connected. Press the button to check.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 14,
    // fontWeight: 'bold',
    marginTop: 10,
  },
});

export default ModalScreen;
