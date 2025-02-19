import { View, Text, FlatList, Image, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { getAllPosts, getLatestPosts } from '../../lib/appwrite.config'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'

const Home = () => {
  const { data: posts, refetch } = useAppwrite(getAllPosts)
  const { data: latestPosts, refetch: fetch } = useAppwrite(getLatestPosts)
  const { user, deleting, uploading, refreshBookmarks } = useGlobalContext()

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    await fetch();
    setRefreshing(false);
  };

  useEffect(() => {
    refetch();
    fetch();
    refreshBookmarks();
  }, [deleting, uploading])

  // useEffect(() => {
  //   if(user === null && !isLoading && !isLoggedIn) router.replace('/sign-in')
  // })

  return (
    <SafeAreaView className="bg-primary h-full max-w-[1240px] md:px-20">
      <FlatList 
        data={posts}
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
            postFilesIds={item.fileIds}
            userId={user?.$id}
            postUid={item.creator.$id}
          />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">Welcome Back, </Text>
                <Text className="text-2xl font-psemibod text-white">{user?.username}</Text>
              </View>

              <View className="mt-1.5">
                <Image 
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode='contain'
                />
              </View>
            </View>

            <SearchInput 
              placeholder={"Search for a video topic"}
            />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 teext-lg font-pregular mb-3">Latest Videos</Text>

              <Trending 
                posts={latestPosts ?? []}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
         <EmptyState 
          title="No Videos Found"
          subtitle="No videos created yet"
         />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  )
}

export default Home