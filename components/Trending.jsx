import { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import * as Animatable from "react-native-animatable";
import {
  FlatList,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { icons } from "../constants";

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};

const TrendingItem = ({ activeItem, item }) => {
  const [play, setPlay] = useState(false);
  const [error, setError] = useState(false);

  return (
    <Animatable.View
          style={{
            width: 208,
            height: 288,
            borderRadius: 33,
            marginRight: 20,
            backgroundColor: "#000",
          }}
      animation={activeItem === item.$id && zoomIn }
      // animation={ZoomInDown}
      duration={500}
    >
      {play ? (
        <Video
          source={{ 
            uri: item.video
            // uri: "https://www.w3schools.com/tags/mov_bbb.mp4"
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
          onError={(error) => {
            if(error) {
              setPlay(false)
              setError(true)
              
              setTimeout(() => {
                setError(false)
              }, 2000);
            }
          }}
        />
      ) : error ? (
        <View className="relative flex-1 justify-center items-center bg-black">
          <Text className="text-gray-100 font-pmedium text-sm">Cannot play this video.</Text>
        </View>
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
    </Animatable.View>
  );
};

const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0]);

   const viewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      horizontal
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 0 }}
    />
  );
};

export default Trending;