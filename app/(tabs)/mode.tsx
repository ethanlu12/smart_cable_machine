import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Vibration, TextInput, TouchableOpacity} from 'react-native';
import * as Haptics from 'expo-haptics';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const ModeScreen = () => {
  const [mainSecondsRemaining, setMainSecondsRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0); // To track the total duration for the halfway mark
  const [prepSecondsRemaining, setPrepSecondsRemaining] = useState(0); // 5-second preparation countdown
  const [timerActive, setTimerActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTime, setCustomTime] = useState(''); // For custom time settings
  const [message, setMessage] = useState(''); // State to manage dynamic messages

  useEffect(() => {
    let prepInterval, mainInterval;
    if (timerActive && !isPaused) {
      if (prepSecondsRemaining > 0) {
        setMessage('Get Ready');
        prepInterval = setInterval(() => {
          setPrepSecondsRemaining((seconds) => seconds - 1);
        }, 1000);
      } else if (mainSecondsRemaining > 0) {
        if (prepSecondsRemaining === 0 && mainSecondsRemaining === totalDuration) {
          setMessage('Start Workout!!!');
          setTimeout(() => setMessage(''), 5000); // Clear "Start Workout!!!" message after 5 seconds
        }
        if (mainSecondsRemaining === Math.round(totalDuration / 2)) {
          setMessage('Halfway there!!');
        } else if (mainSecondsRemaining < Math.round(totalDuration / 2)) {
          setMessage(''); // Clear "Halfway there!!" message once past halfway
        }
        mainInterval = setInterval(() => {
          setMainSecondsRemaining((seconds) => seconds - 1);
        }, 1000);
      }
    }
    if (mainSecondsRemaining === 0 && timerActive) {
      clearInterval(mainInterval);
      setTimerActive(false);
      setMessage('Great Job!');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    return () => {
      clearInterval(prepInterval);
      clearInterval(mainInterval);
    };
  }, [prepSecondsRemaining, mainSecondsRemaining, timerActive, isPaused, totalDuration]);

  // Start the timer
  const startTimer = (duration) => {
    setTimerActive(true);
    setIsPaused(false);
    setPrepSecondsRemaining(5); // Reset prep countdown (can change prep time duration)
    setMainSecondsRemaining(duration);
    setTotalDuration(duration);
    setShowCustomInput(false); // Hide custom time input
  };

  // Cancel the timer
  const cancelTimer = () => {
    setTimerActive(false);
    setIsPaused(false);
    setPrepSecondsRemaining(0);
    setMainSecondsRemaining(0);
    setShowCustomInput(false);
    setMessage('');
  };

  // Pause or resume the timer
  const pauseOrResumeTimer = () => {
    setIsPaused(!isPaused);
    // If paused, maintain the current message, otherwise clear it to avoid stuck messages
    if (!isPaused) setMessage('');
  };

  // Exit custom time input screen
  const exitCustomTimeInput = () => {
    setShowCustomInput(false); // Hide custom time input
    setCustomTime(''); // Optionally reset the custom time input
  };

  // For displaying the timer in MM:SS format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.messageText}>{message}</Text>
      <Text style={styles.timerText}>
        {formatTime(prepSecondsRemaining > 0 ? prepSecondsRemaining : mainSecondsRemaining)}
      </Text>
      {timerActive && (
        <View style={styles.controls}>
          <FontAwesome5 name="stop" size={30} onPress={cancelTimer} />
          <FontAwesome5 name={isPaused ? 'play' : 'pause'} size={30} onPress={pauseOrResumeTimer} />
        </View>
      )}
      {showCustomInput && (
        <View>
          <TextInput
            style={styles.input}
            onChangeText={setCustomTime}
            value={customTime}
            keyboardType="numeric"
            placeholder="Enter time in seconds"
          />
          <View style={styles.buttonRow}>
            <View style={styles.buttonWrapper}>
              <Button title="Set" onPress={() => startTimer(parseInt(customTime) || 0)} />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Exit" onPress={exitCustomTimeInput} />
            </View>
          </View>
        </View>
      )}
      {!showCustomInput && (
        // Horizontal Buttons
        // <View style={styles.buttonContainer}>
        //   <Button title="Start 5 Min" onPress={() => startTimer(300)} />
        //   <Button title="Start 10 Min" onPress={() => startTimer(600)} />
        //   <Button title="Start Custom Time" onPress={() => setShowCustomInput(true)} />
        // </View>

        // Vertical Buttons
        <View style={styles.buttonRow}>
          <View style={styles.buttonWrapper}>
            <Button title="Start 5 Min" onPress={() => startTimer(300)} />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="Start 10 Min" onPress={() => startTimer(600)} />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="Start Custom Time" onPress={() => setShowCustomInput(true)} />
          </View>
        </View>
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
  timerText: {
    fontSize: 48,
    marginBottom: 20,
  },
  messageText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 20,
  },
  buttonRow: {
    flexDirection: 'column', // This is default, but included for clarity
    alignItems: 'center',
  },
  buttonWrapper: {
    marginTop: 10, // Adjust this value as needed for spacing
    width: '80%', // Adjust width as needed, or remove if you want the default button width
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
    marginBottom: 20,
  },
  startWorkoutText: {
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute',
    top: 50, // Adjust this value as needed
  },
});

export default ModeScreen;
