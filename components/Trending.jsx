import { useEffect, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
} from "react-native";

import { icons } from "../constants";
import { getLatestPosts } from "../lib/appwrite.config";
import useAppwrite from "../lib/useAppwrite";

// const zoomIn = {
//   0: {
//     scale: 0.9,
//   },
//   1: {
//     scale: 1,
//   },
// };

// const zoomOut = {
//   0: {
//     scale: 1,
//   },
//   1: {
//     scale: 0.9,
//   },
// };

const TrendingItem = ({ activeItem, item }) => {
  const [play, setPlay] = useState(false);
  // const { refetch } = useAppwrite(getLatestPosts)

  // useEffect(() => {
  //   refetch()
  // }, [])

  return (
    <View
          style={{
            width: 208,
            height: 288,
            borderRadius: 33,
            marginRight: 20,
            backgroundColor: "#000",
          }}
      // animation={activeItem === item.$id ? zoomIn : zoomOut}
      // animation={ZoomInDown}
      // duration={500}
    >
      {play ? (
        <Video
          source={{ 
            uri: "https://www.w3schools.com/tags/mov_bbb.mp4"
            // uri: item.video
          }}
          style={{
            width: 208,
            height: 288,
            borderRadius: 33,
            marginRight: 20,
          }}
          resizeMode={ResizeMode.COVER}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {

            // if (status.isPlaying) {
            //   // setPlay(false);
            //   videoPlayer.current?.presentFullscreenPlayer();
            // } 
            
            // if(!status.isPlaying){
            //   videoPlayer.current?.dismissFullscreenPlayer();
            // }

            if(status.didJustFinish) setPlay(false)
          }}
          onError={(error) => Alert.alert('Error', error)}
        />
      ) : (
        <TouchableOpacity
          className="relative flex-1 justify-center items-center "
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{
              uri: item.thumbnail,
            }}
              style={{
                width: 208,
                height: 288,
                borderRadius: 33,
                marginVertical: 20,
                backgroundColor: "#000",
                overflow: "hidden",
              }}
              // className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black-100"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0]);

  return (
    <FlatList
      data={posts}
      horizontal
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
    />
  );
};

export default Trending;