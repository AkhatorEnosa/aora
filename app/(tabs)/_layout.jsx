import { View, Text, Image } from 'react-native'
import { Tabs, Redirect } from 'expo-router'
import { icons } from "../../constants"
import { StatusBar } from 'expo-status-bar'

const TabIcon = ({ icon, color, name }) => {
    return (
        <View className="w-fit h-fit justify-center items-center gap-2">
            <Image 
                source={icon}
                resizeMode='contain'
                tintColor={color}
                className="size-6"
            />

            <Text className={`font-psemibold text-xs w-full`} style={{
                color: color
            }}>
                {name}
            </Text>
        </View>
    )
}

const TabsLayout = () => {
  return (
    <>
        <Tabs 
           screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: "#ffa001",
            tabBarInactiveTintColor: '#cdcde0',
            tabBarStyle: {
                backgroundColor: '#161622',
                borderTopWidth: 1,
                borderTopColor: '#232533',
                height: 84
            }
           }} 
        >
            
            <Tabs.Screen 
                name='home'
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon 
                            icon={icons.home}
                            color={color}
                            name="Home"
                            focused={focused}
                        />
                    )
                }}
            />

            <Tabs.Screen 
                name='bookmark'
                options={{
                    title: 'Bookmark',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon 
                            icon={icons.bookmark}
                            color={color}
                            name="Bookmark"
                            focused={focused}
                        />
                    )
                }}
            />

            <Tabs.Screen 
                name='create'
                options={{
                    title: 'Create',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon 
                            icon={icons.plus}
                            color={color}
                            name="Create"
                            focused={focused}
                        />
                    )
                }}
            />

            <Tabs.Screen 
                name='profile'
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon 
                            icon={icons.profile}
                            color={color}
                            name="Profile"
                            focused={focused}
                        />
                    )
                }}
            />
        </Tabs>

      <StatusBar backgroundColor='#161622' style='light'/>
    </>
  )
}

export default TabsLayout