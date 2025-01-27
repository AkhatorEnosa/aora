import { useEffect, useRef, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image } from "react-native";

import { icons } from "../constants";
import { deletePost, getAllPosts, toggleBookmark } from "../lib/appwrite.config";
import useAppwrite from "../lib/useAppwrite";

const VideoCard = ({ title, creator, avatar, thumbnail, video, bookmarks, postId, userId, postUid }) => {
  const { refetch } = useAppwrite(getAllPosts)
  const [play, setPlay] = useState(false);
  const videoPlayer = useRef(null)

  const findBookmark = bookmarks.find((bookmark) => bookmark.$id === postId)

  const handleAddBookmark = async() => {
      try {
        await toggleBookmark(postId, userId)
      } catch (error) {
        Alert.alert("Error", error.message);
      }
  }
  

  const handleDeletePost = async() => {
      try {
        await deletePost(postId)
        refetch();
      } catch (error) {
        Alert.alert("Error", error.message);
      }
  }
  

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {creator}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-center items-center gap-3">
          <TouchableOpacity className="p-5 rounded-full bg-black/20" onPress={() => handleAddBookmark()}>
            <Image source={findBookmark ? icons.bookmarked : icons.bookmark} className="w-5 h-5" resizeMode="contain" />
          </TouchableOpacity>

          {userId === postUid && 
            <TouchableOpacity className="p-5 rounded-lg bg-red-600/50" onPress={() => handleDeletePost()}>
              <Text  className="font-psemibold text-sm text-white">Delete</Text>
            </TouchableOpacity>
          }
        </View>

      </View>

      {play ? (
        <Video
          ref={videoPlayer}
          source={{ 
            uri: "https://www.w3schools.com/tags/mov_bbb.mp4"
          }}
          style={{
            width: '100%',
            height: 240,
            borderRadius: 12,
            marginTop: 12
          }}
          resizeMode={ResizeMode.COVER}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
              // videoPlayer.current?.dismissFullscreenPlayer();
            } 
            // else {
            //   videoPlayer.current?.presentFullscreenPlayer();
            // }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
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

export default VideoCard;