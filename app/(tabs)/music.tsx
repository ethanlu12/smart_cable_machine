import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity, Image, FlatList, Animated } from 'react-native';
import TrackPlayer, {Capability, Event, State, usePlaybackState, useProgress, useTrackPlayerEvents } from 'react-native-track-player';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Slider from '@react-native-community/slider';
import songs from '../../model/data';


const {width, height} = Dimensions.get('window');

const setupPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
      ],
    });
    await TrackPlayer.add(songs);
  } catch (error) {
    console.log(error);
  }
};


const MusicPlayer = () => {
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const [songIndex, setsongIndex] = useState(0);
  const [trackTitle, setTrackTitle] = useState();
  const [trackArtist, setTrackArtist] = useState();
  const [trackArtwork, setTrackArtwork] = useState(songs[0].artwork); // Set the initial artwork
  const scrollX = useRef(new Animated.Value(0)).current;
  const songSlider = useRef(null);


  const togglePlayBack = async () => {
    const currentTrack = await TrackPlayer.getActiveTrackIndex();
  
    if (currentTrack !== null) {
      if ('state' in playbackState && playbackState.state === State.Paused) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    }
  };

  const renderSongs = ({item, index}) => {
    return (
      <Animated.View style={style.mainWrapper}>
        <View style={style.imageWrapper}>
          <Image
            source={trackArtwork}
            style={style.musicImage}
          />
        </View>
      </Animated.View>
    );
  };
    
  useTrackPlayerEvents(['playback-active-track-changed'], async (event) => {
      if (event.type === 'playback-active-track-changed') {
        if (event.track !== undefined) {
          const { title, artwork, artist } = event.track;
          setTrackTitle(title);
          setTrackArtist(artist);
          setTrackArtwork(artwork);
        } 
      }
  });
 

  const skipTo = async trackId => {
    await TrackPlayer.skip(trackId);
  };

  useEffect(() => {
    setupPlayer();

    scrollX.addListener(({value}) => {
      //   console.log(`ScrollX : ${value} | Device Width : ${width} `);

      const index = Math.round(value / width);
      skipTo(index);
      setsongIndex(index);

      //   console.log(`Index : ${index}`);
    });

    return () => {
      scrollX.removeAllListeners();
      TrackPlayer.destroy();
    };
  }, []);

  const skipToNext = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex + 1) * width,
    });
  };

  const skipToPrevious = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    });
  };

  

  function formatTime(seconds) {
    const pad = (num, size) => ('000' + num).slice(size * -1);
    const time = parseFloat(seconds).toFixed(3);
    const hours = Math.floor(time / 60 / 60);
    const minutes = Math.floor(time / 60) % 60;
    const secs = Math.floor(time - minutes * 60);
  
    return pad(minutes, 2) + ':' + pad(secs, 2);
  }  

  return (
    <SafeAreaView style={style.container}>
      <View style={style.mainContainer}>
        {/* Image and Track Information */}
        <Animated.FlatList
          ref={songSlider}
          renderItem={renderSongs}
          data={songs}
          keyExtractor={item => item.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
        />

        {/* Title & Artist Name */}
        <View style={style.trackInfoContainer}>
          <Text style={style.songContent}>{trackTitle}</Text>
          <Text style={style.songContent}>{trackArtist}</Text>
        </View>

        {/* Controls and Progress */}
        <View style={style.controlsContainer}>
          <Slider
            style={style.progressBar}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            thumbTintColor="#FFD369"
            minimumTrackTintColor="#FFD369"
            maximumTrackTintColor="#fff"
            onSlidingComplete={async value => {
              await TrackPlayer.seekTo(value);
            }}
          />

          <View style={style.progressLevelDuration}>
            <Text style={style.progressLabelText}>{formatTime(progress.position)}</Text>
            <Text style={style.progressLabelText}>{formatTime(progress.duration - progress.position)}</Text>
          </View>

          <View style={style.musicControlsContainer}>
            <TouchableOpacity onPress={skipToPrevious}>
              <FontAwesome5 name="backward" size={35} color="#FFD369" />
            </TouchableOpacity>
            <TouchableOpacity onPress={togglePlayBack}>
              <FontAwesome5 name={playbackState === State.Playing ? 'pause-circle' : 'play-circle'} size={75} color="#FFD369" />
            </TouchableOpacity>
            <TouchableOpacity onPress={skipToNext}>
              <FontAwesome5 name="forward" size={35} color="#FFD369" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};




const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainWrapper: {
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  imageWrapper: {
    width: 300,
    height: 340,
    marginBottom: 25,
  },
  musicImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  trackInfoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  controlsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  progressBar: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 15,
  },
  progressLevelDuration: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  musicControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '60%',
  },
  songContent: {
    textAlign: 'center',
    color: '#EEEEEE',
    fontSize: 18,
    fontWeight: '600',
  },
  progressLabelText: {
    color: '#FFF',
  },
});

export default MusicPlayer;