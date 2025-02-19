import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { images } from '../../constants'
import { Link, router } from 'expo-router'
import { createUser } from '../../lib/appwrite.config'
import { useGlobalContext } from '../../context/GlobalProvider'

const SignUp = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext()
  const [form, setForm] = useState({
    username: '',
    email: '', 
    password: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async () => {
    if(!form.email || !form.username || !form.password) {
      Alert.alert('Error', 'Please fill in all field')
    } else {
      setIsSubmitting(true)

      try {
        const result = await createUser(form.email, form.password, form.username);
 
        setUser(result)
        setIsLoggedIn(true)

        router.replace('/home')
      } catch (error) {
        Alert.alert("Error", error)
      } finally {
        setIsSubmitting(false)
      }
    }


    setForm({
      password: ''
    })
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center h-screen md:h-[70vh] px-4 my-6">
          <Image 
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />

          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Sign Up to Aora</Text>

          <FormField 
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e})}
            otherStyles="mt-10"
          />

          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e})}
            otherStyles="mt-7"
          />

          <CustomButton 
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            // textStyles, 
            isLoading={isSubmitting}
          />

          <View className="justify-center flex-row pt-5 gap-2">
            <Text className="text-center text-lg text-gray-100 font-psemibold">
              Already have an account?
            </Text>
            <Link href="/sign-in" className="text-center text-lg font-psemibold text-secondary">Sign In</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp