import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecipeList({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [sortBy, setSortBy] = useState('title'); // Default sorting by title
  const [sortOrder, setSortOrder] = useState('asc'); // Default ascending order

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadRecipes);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    filterAndSortRecipes();
  }, [searchQuery, recipes, showFavorites]);

  const loadRecipes = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('recipes');
      const loadedRecipes = jsonValue != null ? JSON.parse(jsonValue) : [];
      setRecipes(loadedRecipes);
      setFilteredRecipes(sortRecipes(loadedRecipes, sortBy, sortOrder));
    } catch (e) {
      console.error(e);
    }
  };

  const sortRecipes = (recipes, sortBy, sortOrder) => {
    const sortedRecipes = [...recipes];
    sortedRecipes.sort((a, b) => {
      const valueA = a[sortBy] || '';
      const valueB = b[sortBy] || '';
      if (sortBy === 'rating') {
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      } else {
        if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      }
    });
    return sortedRecipes;
  };

  const filterAndSortRecipes = async () => {
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
    setFilteredRecipes(sortRecipes(filtered, sortBy, sortOrder));
  };

  const handleSortByChange = (value) => {
    setSortBy(value);
    setFilteredRecipes(sortRecipes(filteredRecipes, value, sortOrder));
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    setFilteredRecipes(sortRecipes(filteredRecipes, sortBy, newOrder));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Recipes..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <View style={styles.sortContainer}>
        <Picker
          selectedValue={sortBy}
          style={styles.picker}
          onValueChange={(itemValue) => handleSortByChange(itemValue)}>
          <Picker.Item label="Sort by Title" value="title" />
          <Picker.Item label="Sort by Rating" value="rating" />
          {/* Other sorting options */}
        </Picker>
        <Button title={sortOrder === 'asc' ? 'Ascending' : 'Descending'} onPress={toggleSortOrder} />
      </View>
      
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
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  tags: {
    fontSize: 14,
    color: 'grey',
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
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  picker: {
    flex: 1,
  },
});
