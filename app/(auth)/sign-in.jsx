import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { signIn } from '../../lib/appwrite.config'

const SignIn = () => {
  const [form, setForm] = useState({
    email: '', 
    password: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async () => {
    if(!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all field')
    } else {
      setIsSubmitting(true)

      try {
        const result = await signIn(form.email, form.password);

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

          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Log in to Aora</Text>

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
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            // textStyles, 
            isLoading={isSubmitting}
          />

          <View className="justify-center flex-row pt-5 gap-2">
            <Text className="text-center text-lg text-gray-100 font-psemibold">
              Don't have an account?
            </Text>
            <Link href="/sign-up" className="text-center text-lg font-psemibold text-secondary">Sign Up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn