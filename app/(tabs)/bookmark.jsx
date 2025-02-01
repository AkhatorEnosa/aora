import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import VideoCard from "../../components/VideoCard";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import { useGlobalContext } from "../../context/GlobalProvider";

const Bookmark = () => {
  const { user, bookmarks } = useGlobalContext()

  return (
    <SafeAreaView className="bg-primary h-full max-w-[1240px] md:px-20">
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.$id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
            postId={item.$id}
            userId={user?.$id}
            postUid={item.creator.$id}
          />
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex my-6 px-4">
              <Text className="text-2xl font-psemibold text-white mt-1">
                Saved Videos
              </Text>

              <View className="mt-6 mb-8">
                <SearchInput  placeholder={"Search videos"} />
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