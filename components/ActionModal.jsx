import { View, Text, Modal, Alert, TouchableOpacity } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const ActionModal = ({ modalVisible, handleVisible, handleDelete, deleting }) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 justify-center items-center">
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              handleVisible()
            }}
        >
            <View className="flex-1 justify-center items-center bg-primary/60">
              <View className="w-[80%] m-5 bg-white rounded-3xl px-10 py-12 items-center">
                  <Text className="font-psemibold text-3xl text-left w-full">Delete this post?</Text>
                  {
                    deleting ? 
                      <Text className="animate-pulse">Deleting</Text> : 
                      <>
                        <Text className="font-psemibold text-left w-full">Do you wish to permanently delete this post?</Text>
                        <View className="flex-row gap-5">
                          <TouchableOpacity
                            className="px-5 mt-5 bg-black-200 rounded-xl min-h-[62px] justify-center items-center"
                            onPress={() => handleVisible()}>
                            <Text className="text-gray-100 font-psemibold">Cancel</Text> 
                          </TouchableOpacity>
                          <TouchableOpacity
                            className="px-5 mt-5 bg-red-500 rounded-xl min-h-[62px] justify-center items-center"
                            onPress={() => handleDelete() & handleVisible()}>
                            <Text className="font-psemibold">Delete</Text> 
                          </TouchableOpacity>
                        </View>
                      </>
                  }
              </View>
            </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default ActionModal