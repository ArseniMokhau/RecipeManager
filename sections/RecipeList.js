import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecipeList({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadRecipes);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    filterRecipes();
  }, [searchQuery, recipes, showFavorites]);

  const loadRecipes = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('recipes');
      const loadedRecipes = jsonValue != null ? JSON.parse(jsonValue) : [];
      setRecipes(loadedRecipes);
      setFilteredRecipes(loadedRecipes);
    } catch (e) {
      console.error(e);
    }
  };

  const filterRecipes = async () => {
    let filtered = recipes;
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (showFavorites) {
      const favoriteRecipes = await AsyncStorage.getItem('favoriteRecipes');
      const favorites = favoriteRecipes ? JSON.parse(favoriteRecipes) : [];
      filtered = filtered.filter(recipe => favorites.some(f => f.id === recipe.id));
    }
    setFilteredRecipes(filtered);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Recipes..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <View style={styles.controlButtons}>
        <View style={styles.button}>
          <Button title="Add Recipe" onPress={() => navigation.navigate('Add/Edit Recipe', { recipe: null })} />
        </View>
        <View style={styles.button}>
          <Button title={showFavorites ? "Show All" : "Show Favorites"} onPress={() => setShowFavorites(!showFavorites)} />
        </View>
      </View>
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={filteredRecipes}
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
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  listContainer: {
    flexGrow: 1,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
});
