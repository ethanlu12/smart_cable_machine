import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, View, Text, ScrollView, TouchableOpacity} from 'react-native';
// import EditScreenInfo from '@/components/EditScreenInfo';
// import { Text, View } from '@/components/Themed';

export default function TabOneScreen() {
  // Use an object to store the preset weights for each workout type
  const [presets, setPresets] = useState({
    bicepCurl: 10,
    squats: 20,
    lateralRaises: 5,
    shoulderShrugs: 15,
  });

  const [weight, setWeight] = useState('0');
  const [displayWeight, setDisplayWeight] = useState('0');
  const [isValidWeight, setIsValidWeight] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState('');

  const handleWeightChange = (change: number) => {
    let newWeight = parseFloat(weight) + change;
    newWeight = Math.max(0, Math.min(newWeight, 35));
    setWeight(newWeight.toString());
    setDisplayWeight(newWeight.toString());
    validateAndSetWeight(newWeight);
  };

  const handleWeightInput = (input: string) => {
    setWeight(input);
    if (input === '') {
      setIsValidWeight(true);
    } else {
      validateAndSetWeight(parseFloat(input));
    }
  };
  
  const validateAndSetWeight = (inputWeight: number) => {
    if (inputWeight % 2.5 === 0 && inputWeight >= 0 && inputWeight <= 35) {
      setWeight(inputWeight.toString());
      setDisplayWeight(inputWeight.toString());
      setIsValidWeight(true);
      if (selectedWorkout) {
        // Update the preset weight for the selected workout
        setPresets({ ...presets, [selectedWorkout]: inputWeight });
      }
    } else {
      setIsValidWeight(false);
    }
  };

  const submitWeight = () => {
    // Convert the current input to a number for validation
    const finalWeight = parseFloat(weight);
    // Validate the final weight before submitting
    if (!isNaN(finalWeight) && finalWeight % 2.5 === 0 && finalWeight >= 0 && finalWeight <= 35) {
      console.log(`Submitting weight: ${finalWeight} pounds`);
      setIsValidWeight(true);
      // Implement the BLE connection and data transmission logic here
    } else {
      console.log("Invalid weight, cannot submit.");
      setIsValidWeight(false); // Ensure the UI reflects the invalid state if necessary
    }
  };  

  // Function to set weight based on the selected workout preset
  const selectWorkout = (workout: string) => {
    const presetWeight = presets[workout];
    setWeight(presetWeight.toString());
    setDisplayWeight(presetWeight.toString());
    setIsValidWeight(true);
    setSelectedWorkout(workout); // Keep track of the selected workout for potential preset updates
  };

  // Function to convert workout key to a display-friendly format
  const formatWorkoutName = (workoutKey: string) => {
    // Convert camelCase to regular words and capitalize first letter
    const formattedName = workoutKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    return formattedName;
  };

  const deselectWorkout = () => {
    setSelectedWorkout(''); // Deselect the current workout
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Show current workout if exercise is selected */}
      {selectedWorkout && (
        <Text style={styles.currentWorkout}>
          Current Exercise: {formatWorkoutName(selectedWorkout)}
        </Text>
      )}
      {/* Select Weight Title */}
      <Text style={styles.title}>Select Weight</Text>
      {/* Buttons to add or subtract 2.5 lbs */}
      <View style={styles.weightSelector}>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => handleWeightChange(-2.5)}>
          <Text style={styles.buttonText}>- 2.5 lbs</Text>
        </TouchableOpacity>
        <Text style={styles.weightDisplay}>{`${parseFloat(displayWeight).toFixed(1)} lbs`}</Text>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => handleWeightChange(2.5)}>
          <Text style={styles.buttonText}>+ 2.5 lbs</Text>
        </TouchableOpacity>
      </View>
      {/* User input for weight */}
      <TextInput
        style={styles.input}
        onChangeText={handleWeightInput}
        onBlur={() => validateAndSetWeight(parseFloat(weight))}
        value={weight}
        keyboardType="numeric"
        placeholder="Enter weight (0-35 lbs)"
        maxLength={5}
      />
      {/* Check if valid weight text */}
      {!isValidWeight && <Text style={styles.errorText}>Invalid Weight</Text>}
      {/* Button to submit weight */}
      <TouchableOpacity style={styles.submitButton} onPress={submitWeight}>
        <Text style={styles.buttonText}>Submit Weight</Text>
      </TouchableOpacity>
      {/* New button to cancel the selected workout */}
      {selectedWorkout && (
          <TouchableOpacity style={styles.cancelButton} onPress={deselectWorkout}>
            <Text style={styles.buttonText}>Exit Workout</Text>
          </TouchableOpacity>
      )}
      {/* Add a divider */}
      <View style={styles.divider} />
      {/* Exercises Text */}
      <Text style={styles.exercisesTitle}>Exercises</Text>
      {/* Grid of workout buttons */}
      <View style={styles.buttonGrid}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => selectWorkout('bicepCurl')}>
            <Text style={styles.buttonText}>Bicep Curl</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => selectWorkout('squats')}>
            <Text style={styles.buttonText}>Squats</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => selectWorkout('lateralRaises')}>
            <Text style={styles.buttonText}>Lateral Raises</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => selectWorkout('shoulderShrugs')}>
            <Text style={styles.buttonText}>Shoulder Shrugs</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentWorkout: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weightSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  weightDisplay: {
    minWidth: 100,
    textAlign: 'center',
    fontSize: 24,
    marginHorizontal: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%', // Ensure full width to center buttons correctly
  },
  buttonStyle: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  cancelButton: {
    backgroundColor: '#dc3545', // A red color for the cancel button
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  divider: {
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    width: '80%', // Adjust based on layout
    marginTop: 20,
    marginBottom: 10,
  },
  exercisesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});