import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppwrite from "../../lib/useAppwrite";
import { getUserBookmarks, searchPosts } from "../../lib/appwrite.config";
import VideoCard from "../../components/VideoCard";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import { useGlobalContext } from "../../context/GlobalProvider";

const Bookmark = () => {
  const { user, setUser, bookmarks, setIsLoggedIn, isLoading, isLoggedIn } = useGlobalContext()
  const { data: posts } = useAppwrite(() => getUserBookmarks(user.$id));

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
            bookmarks={bookmarks}
            postId={item.$id}
          />
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex my-6 px-4">
              <Text className="text-2xl font-psemibold text-white mt-1">
                Saved Videos
              </Text>

              <View className="mt-6 mb-8">
                <SearchInput  placeholder={"Search your saved videos"} />
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="You have no saved video"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Bookmark;