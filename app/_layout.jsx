import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import "../global.css";

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='index' options={{
        title: "Home",
        headerShown: false
      }}/>
    </Stack>
  )
}

export default RootLayout