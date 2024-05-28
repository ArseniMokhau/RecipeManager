import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecipeDetail({ route, navigation }) {
    const { recipe } = route.params;
    const [notes, setNotes] = useState(recipe.notes || '');

    const deleteRecipe = async () => {
        try {
            // Retrieve stored recipes from AsyncStorage
            const storedRecipes = await AsyncStorage.getItem('recipes');
            const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];

            // Filter out the recipe to be deleted
            const updatedRecipes = recipes.filter(r => r.id !== recipe.id);

            // Save the updated recipes back to AsyncStorage
            await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));

            // Navigate back to the Recipes screen
            navigation.navigate('Recipes');
        } catch (error) {
            console.error('Error deleting recipe:', error);
            Alert.alert('Error', 'Failed to delete the recipe');
        }
    };

    const saveNotes = async () => {
        try {
            // Retrieve stored recipes from AsyncStorage
            const storedRecipes = await AsyncStorage.getItem('recipes');
            const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];

            // Find the current recipe and update its notes
            const updatedRecipes = recipes.map(r => r.id === recipe.id ? { ...r, notes } : r);

            // Save the updated recipes back to AsyncStorage
            await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));

            Alert.alert('Success', 'Notes saved successfully');
        } catch (error) {
            console.error('Error saving notes:', error);
            Alert.alert('Error', 'Failed to save the notes');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Display the recipe title */}
            <Text style={styles.title}>{recipe.title}</Text>

            {/* Display the list of ingredients */}
            <Text style={styles.subtitle}>Ingredients:</Text>
            {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                ingredient && (
                    <Text key={index} style={styles.text}>
                        {ingredient.name} - {ingredient.quantity} {ingredient.measurement}
                    </Text>
                )
            ))}

            {/* Display the instructions */}
            <Text style={styles.subtitle}>Instructions:</Text>
            <Text style={styles.text}>{recipe.instructions}</Text>

            {/* Display the tags */}
            {recipe.tags && (
                <>
                    <Text style={styles.subtitle}>Tags:</Text>
                    <Text style={styles.text}>{recipe.tags}</Text>
                </>
            )}

            {/* Notes input field */}
            <Text style={styles.subtitle}>Notes:</Text>
            <TextInput
                placeholder="Add notes..."
                value={notes}
                onChangeText={setNotes}
                multiline={true}
                style={styles.notesInput}
            />

            <Button title="Save Notes" onPress={saveNotes} />

            <View style={styles.controlButtons}>
                {/* Button to navigate to the Add/Edit Recipe screen with the current recipe */}
                <View style={styles.button}>
                    <Button title="Edit Recipe" onPress={() => navigation.navigate('Add/Edit Recipe', { recipe })} />
                </View>

                {/* Button to delete the current recipe */}
                <View style={styles.button}>
                    <Button title="Delete Recipe" onPress={deleteRecipe} />
                </View>
            </View>
        </ScrollView>
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
    notesInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginVertical: 8,
        minHeight: 100, // Set a minimum height for the input field
    },
    controlButtons: {
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        marginHorizontal: 4,
    },
});
