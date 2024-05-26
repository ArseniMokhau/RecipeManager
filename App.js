import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RecipeList from './sections/RecipeList';
import RecipeDetail from './sections/RecipeDetail';
import RecipeForm from './sections/RecipeForm';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Recipes">
        <Stack.Screen name="Recipes" component={RecipeList} />
        <Stack.Screen name="Recipe Details" component={RecipeDetail} />
        <Stack.Screen name="Add/Edit Recipe" component={RecipeForm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
