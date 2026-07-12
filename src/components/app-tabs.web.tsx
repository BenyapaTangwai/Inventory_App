import {
  TabList,
  Tabs,
  TabSlot,
  TabTrigger
} from 'expo-router/ui';
import { View } from 'react-native';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <View style={{ display: 'none' }}>
          <TabTrigger name="index" href="/" />
          <TabTrigger name="explore" href="/explore" />
        </View>
      </TabList>
    </Tabs>
  );
}
