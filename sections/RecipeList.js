import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecipeList({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [sortBy, setSortBy] = useState('title'); // Default sorting by title
  const [sortOrder, setSortOrder] = useState('asc'); // Default ascending order

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadRecipes);
    return unsubscribe;
  }, [navigation]);

  const loadRecipes = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('recipes');
      const storedRecipes = jsonValue != null ? JSON.parse(jsonValue) : [];
      setRecipes(sortRecipes(storedRecipes, sortBy, sortOrder));
    } catch (e) {
      console.error(e);
    }
  };

  const sortRecipes = (recipes, sortBy, sortOrder) => {
    const sortedRecipes = [...recipes];
    sortedRecipes.sort((a, b) => {
      // Handle undefined ratings by assigning a default value
      const ratingA = a[sortBy] || 0;
      const ratingB = b[sortBy] || 0;
      if (sortBy === 'rating') {
        return sortOrder === 'asc' ? ratingA - ratingB : ratingB - ratingA;
      } else {
        if (ratingA < ratingB) return sortOrder === 'asc' ? -1 : 1;
        if (ratingA > ratingB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      }
    });
    return sortedRecipes;
  };

  const handleSortByChange = (value) => {
    setSortBy(value);
    setRecipes(sortRecipes(recipes, value, sortOrder));
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    setRecipes(sortRecipes(recipes, sortBy, newOrder));
  };

  return (
    <View>
      <Button title="Add Recipe" onPress={() => navigation.navigate('Add/Edit Recipe', { recipe: null })} />
      <View style={styles.sortContainer}>
        <Picker
          selectedValue={sortBy}
          style={styles.picker}
          onValueChange={(itemValue) => handleSortByChange(itemValue)}>
          <Picker.Item label="Sort by Title" value="title" />
          <Picker.Item label="Sort by Rating" value="rating" />
          {/* Add other sorting options here */}
        </Picker>
        <Button title={sortOrder === 'asc' ? 'Descending' : 'Ascending'} onPress={toggleSortOrder} />
      </View>
      <FlatList
        contentContainerStyle={styles.container}
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
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  picker: {
    flex: 1,
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
});
