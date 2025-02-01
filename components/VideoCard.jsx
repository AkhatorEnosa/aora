import { useRef, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";

import { icons } from "../constants";
import { deletePost, toggleBookmark } from "../lib/appwrite.config";
import { useGlobalContext } from "../context/GlobalProvider";
import ActionModal from "./ActionModal";

const VideoCard = ({ title, creator, avatar, thumbnail, video, postId, postFilesIds, userId, postUid }) => {
  const [play, setPlay] = useState(false);
  const [error, setError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false)
  const videoPlayer = useRef(null)

  const { bookmarks, refreshBookmarks, deleting, setDeleting } = useGlobalContext()

  const findBookmark = bookmarks.find((bookmark) => bookmark.$id === postId)

  const handleAddBookmark = async() => {
      try {
        await toggleBookmark(postId, userId)
        await refreshBookmarks()
      } catch (error) {
        Alert.alert("Error", error.message);
      }
  }

  const handleDeletePost = async() => {
    setDeleting(true)
      try {
        await deletePost(postId, postFilesIds)
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setDeleting(false)
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
            <TouchableOpacity className="p-5 rounded-full bg-red-600/20" onPress={() => setModalVisible(!modalVisible)}>
              {/* <Text  className="font-psemibold text-sm text-white">Delete</Text> */}
              <Image source={icons.cancel} className="w-5 h-5" resizeMode="contain" />
            </TouchableOpacity>
          }
        </View>

      </View>

      {/* Modal  */}

      {
        modalVisible && 
          <ActionModal 
            modalVisible={modalVisible} 
            handleVisible={() => !deleting && setModalVisible(!modalVisible)} 
            handleDelete={() => handleDeletePost()}
            deleting={deleting}
          />
      }

      {play ? (
        <Video
          ref={videoPlayer}
          source={{ 
            uri: video
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
        <View className="w-full h-60 md:h-96 rounded-xl mt-3 relative flex justify-center items-center bg-black">
          <Text className="text-gray-100 font-psemibold">Cannot play this video.</Text>
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 md:h-96 rounded-xl mt-3 relative flex justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />

          {deleting ? 
            <View className="w-full h-60 md:h-96 rounded-xl mt-3 flex justify-center items-center bg-primary/50 absolute">
              <Text className="text-gray-100 text-xl font-psemibold">Deleting...</Text>
            </View> :
            <Image
              source={icons.play}
              className="w-12 h-12 absolute"
              resizeMode="contain"
            />
          }
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;