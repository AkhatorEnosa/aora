import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 bg-red-300 justify-center items-center">
      <Text>Alright! Let's get good at this.</Text>
      <Link href={'profile'}>Go to Profile</Link>
      <StatusBar style="auto" />
    </View>
  );
}