import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecipeList({ navigation }) {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadRecipes);
    return unsubscribe;
  }, [navigation]);

  const loadRecipes = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('recipes');
      setRecipes(jsonValue != null ? JSON.parse(jsonValue) : []);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View>
      <Button title="Add Recipe" onPress={() => navigation.navigate('Add/Edit Recipe', { recipe: null })} />
      <FlatList contentContainerStyle={styles.container}
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Recipe Details', { recipe: item })}>
            <Text style={styles.text}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 4,
    },
    text: {
      fontSize: 16,
      marginBottom: 8,
    },
  });