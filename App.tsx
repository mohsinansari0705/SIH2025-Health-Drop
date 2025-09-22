// import React, { useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import WaterForm from './src/screens/WaterForm';
// import ClinicForm from './src/screens/ClinicForm';
// import RainfallForm from './src/screens/RainfallForm';
// import { createTables } from './src/services/db';
// import { setupAutoSync } from './src/services/SyncManager';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   useEffect(() => {
//     createTables();
//     setupAutoSync(); // start automatic syncing when online
//   }, []);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="WaterForm">
//         <Stack.Screen name="WaterForm" component={WaterForm} />
//         <Stack.Screen name="ClinicForm" component={ClinicForm} />
//         <Stack.Screen name="RainfallForm" component={RainfallForm} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import WaterForm from './src/screens/WaterForm';
import ClinicForm from './src/screens/ClinicForm';
import RainfallForm from './src/screens/RainfallForm';
import ExportScreen from './src/screens/ExportScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'alert-circle';

            if (route.name === 'Water') iconName : 'water';
            else if (route.name === 'Clinic') iconName : 'medkit';
            else if (route.name === 'Rainfall') iconName : 'cloud-rain';
            else if (route.name === 'Export') iconName : 'download';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Water" component={WaterForm} />
        <Tab.Screen name="Clinic" component={ClinicForm} />
        <Tab.Screen name="Rainfall" component={RainfallForm} />
        <Tab.Screen name="Export" component={ExportScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

