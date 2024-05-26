import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { MeasurementTypesShort } from '../enums/MeasurementTypes'; // Import short measurement types

export default function RecipeForm({ route, navigation }) {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState('');
  const { recipe } = route.params;

  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title);
      setIngredients(recipe.ingredients || []);
      setInstructions(recipe.instructions);
    }
  }, [recipe]);

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', measurement: Object.keys(MeasurementTypesShort.EU)[0] }]);
  };

  const removeIngredient = (index) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients.splice(index, 1);
    setIngredients(updatedIngredients);
  };

  const saveRecipe = async () => {
    if (title.trim() === '') { // Check if title is empty or whitespace
      Alert.alert('Error', 'Recipe title cannot be empty');
      return;
    }

    const filteredIngredients = ingredients.filter(ingredient => ingredient.name.trim() !== '' && ingredient.quantity.trim() !== '');
    /*
    // Check if any ingredient is empty or null
    if (filteredIngredients.length !== ingredients.length) {
      Alert.alert('Error', 'Ingredient fields cannot be empty');
      return;
    }
    */
    try {
      const storedRecipes = await AsyncStorage.getItem('recipes');
      const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];

      if (recipe) {
        const updatedRecipes = recipes.map(r => r.id === recipe.id ? { ...r, title, ingredients: filteredIngredients, instructions } : r);
        await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));
      } else {
        const newRecipe = { id: Date.now(), title, ingredients: filteredIngredients, instructions };
        recipes.push(newRecipe);
        await AsyncStorage.setItem('recipes', JSON.stringify(recipes));
      }

      navigation.navigate('Recipes');
    } catch (e) {
      Alert.alert('Error', 'Failed to save the recipe');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={[styles.input, styles.titleInput]} />
      <View style={styles.ingredientContainer}>
        {ingredients && ingredients.length > 0 && ingredients.map((ingredient, index) => (
          <View key={index} style={styles.ingredientRow}>
            <TouchableOpacity onPress={() => removeIngredient(index)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
            <TextInput
              placeholder="Name"
              value={ingredient.name}
              onChangeText={text => handleIngredientChange(index, 'name', text)}
              style={[styles.input, styles.nameInput]}
            />
            <TextInput
              placeholder="Quantity"
              value={ingredient.quantity}
              onChangeText={text => handleIngredientChange(index, 'quantity', text)}
              style={[styles.input, styles.quantityInput]}
            />
            <Picker
              selectedValue={ingredient.measurement}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              onValueChange={(itemValue) => handleIngredientChange(index, 'measurement', itemValue)}
            >
              {Object.values(MeasurementTypesShort.EU).map((type, i) => ( // Use short measurement types
                <Picker.Item key={i} label={type} value={Object.keys(MeasurementTypesShort.EU)[i]} />
              ))}
            </Picker>
          </View>
        ))}
        <Button title="Add Ingredient" onPress={addIngredient} />
      </View>
      <TextInput
        placeholder="Instructions"
        value={instructions}
        onChangeText={setInstructions}
        style={[styles.input, styles.instructions]}
        multiline
      />
      <Button title="Save Recipe" onPress={saveRecipe} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
    flex: 1,
    textAlign: 'left', // Align text to the left
  },
  titleInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
    width: '100%',
    textAlign: 'left',
    verticalAlign: 'top',
  },
  ingredientContainer: {
    marginBottom: 16,
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nameInput: {
    width: '30%', // Adjust width for the name input field
  },
  quantityInput: {
    width: '30%', // Adjust width for the quantity input field
  },
  picker: {
    borderColor: 'gray',
    borderWidth: 1,
    width: '30%', // Adjust width for the picker
    textAlign: 'left', // Align text to the left
  },
  pickerItem: {
    textAlign: 'left', // Align text to the left
  },
  instructions: {
    height: 500,
    textAlign: 'left',
    flexWrap: 'wrap',
    verticalAlign: 'top',
  },
  removeButton: {
    padding: 5,
    width: 30,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
