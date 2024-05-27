import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import Stars from 'react-native-stars';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecipeDetail({ route, navigation }) {
    const { recipe } = route.params;
    const [rating, setRating] = useState(recipe.rating || 0);

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

    const handleRatingChange = async (newRating) => {
        try {
            // Retrieve stored recipes from AsyncStorage
            const storedRecipes = await AsyncStorage.getItem('recipes');
            const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];

            // Update the rating of the current recipe
            const updatedRecipes = recipes.map(r => {
                if (r.id === recipe.id) {
                    return { ...r, rating: newRating };
                }
                return r;
            });

            // Save the updated recipes back to AsyncStorage
            await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));

            // Update the local state
            setRating(newRating);
        } catch (error) {
            console.error('Error updating rating:', error);
            Alert.alert('Error', 'Failed to update the rating');
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

            {/* Display the star rating */}
            <View style={styles.ratingContainer}>
                <Text style={styles.subtitle}>Rating:</Text>
                <Stars
                    update={(val) => handleRatingChange(val)} // Update the rating when a star is clicked
                    default={rating || 0} // Default rating
                    count={5}
                    half={true}
                    starSize={30}
                    fullStar={<Ionicons name="star" size={24} color="gold" />}
                    emptyStar={<Ionicons name="star-outline" size={24} color="gold" />}
                    halfStar={<Ionicons name="star-half" size={24} color="gold" />}
                />
            </View>

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
    ratingContainer: {
        marginTop: 16,
        marginBottom: 8,
    },
    controlButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        marginHorizontal: 4,
    },
});