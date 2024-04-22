import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import TrackPlayer, { usePlaybackState, State, Capability } from 'react-native-track-player';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'; // Ensure you have FontAwesome icons
import Slider from '@react-native-community/slider';

// Mockup data for songs
const songs = [
  { id: '1', title: 'Is It A Crime?', artist: 'No Guidance', duration: '2:22', url: 'https://example.com/song1.mp3' },
  { id: '2', title: 'Perfect Night', artist: 'LE SSERAFIM', duration: '2:39', url: 'https://example.com/song2.mp3' },
  { id: '3', title: 'Goodie Bag', artist: 'Still Woozy', duration: '2:26', url: 'https://example.com/song2.mp3' },
  { id: '4', title: 'Stuck On You', artist: 'grentperez', duration: '2:39', url: 'https://example.com/song2.mp3' },
  // Add more songs here
];

// Setup Track Player
const setupTrackPlayer = async () => {
  await TrackPlayer.setupPlayer();
  await TrackPlayer.updateOptions({
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
    ],
  });
  await TrackPlayer.add(songs);
};

export default function MusicScreen() {
  const playbackState = usePlaybackState();
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    setupTrackPlayer();

    return () => TrackPlayer.destroy();
  }, []);

  const togglePlayback = async (songId) => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack !== songId) {
      await TrackPlayer.skip(songId);
      await TrackPlayer.play();
    } else if (playbackState === State.Paused) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => togglePlayback(item.id)}>
      <View style={styles.songInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.artist}>{item.artist}</Text>
      </View>
      <Text style={styles.duration}>{item.duration}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={songs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.controls}>
        <FontAwesome5 name="step-backward" size={20} onPress={() => TrackPlayer.skipToPrevious()} />
        <FontAwesome5 name={playbackState === State.Playing ? 'pause' : 'play'} size={20} onPress={() => TrackPlayer.play()} />
        <FontAwesome5 name="step-forward" size={20} onPress={() => TrackPlayer.skipToNext()} />
      </View>
      <Slider
        style={styles.volumeSlider}
        minimumValue={0}
        maximumValue={1}
        value={volume}
        onValueChange={(value) => {
          setVolume(value);
          TrackPlayer.setVolume(value);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  songInfo: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 16,
  },
  artist: {
    fontSize: 14,
  },
  duration: {
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
  volumeSlider: {
    width: '80%',
    alignSelf: 'center',
  },
});