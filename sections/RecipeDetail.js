import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import Stars from 'react-native-stars';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecipeDetail({ route, navigation }) {
    const { recipe } = route.params;
    const [notes, setNotes] = useState(recipe.notes || '');
    const [rating, setRating] = useState(recipe.rating || 0);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        checkIfFavorite();
    }, []);

    const checkIfFavorite = async () => {
        try {
            const favoriteRecipes = await AsyncStorage.getItem('favoriteRecipes');
            const favorites = favoriteRecipes ? JSON.parse(favoriteRecipes) : [];
            setIsFavorite(favorites.some(r => r.id === recipe.id));
        } catch (e) {
            console.error(e);
        }
    };

    const toggleFavorite = async () => {
        try {
            const favoriteRecipes = await AsyncStorage.getItem('favoriteRecipes');
            let favorites = favoriteRecipes ? JSON.parse(favoriteRecipes) : [];

            if (isFavorite) {
                favorites = favorites.filter(r => r.id !== recipe.id);
            } else {
                favorites.push(recipe);
            }

            await AsyncStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
            setIsFavorite(!isFavorite);
        } catch (e) {
            console.error(e);
        }
    };

    const deleteRecipe = async () => {
        try {
            const storedRecipes = await AsyncStorage.getItem('recipes');
            const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
            const updatedRecipes = recipes.filter(r => r.id !== recipe.id);
            await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));

            const favoriteRecipes = await AsyncStorage.getItem('favoriteRecipes');
            let favorites = favoriteRecipes ? JSON.parse(favoriteRecipes) : [];
            favorites = favorites.filter(r => r.id !== recipe.id);
            await AsyncStorage.setItem('favoriteRecipes', JSON.stringify(favorites));

            navigation.navigate('Recipes');
        } catch (error) {
            console.error('Error deleting recipe:', error);
            Alert.alert('Error', 'Failed to delete the recipe');
        }
    };

    const saveNotes = async () => {
        try {
            const storedRecipes = await AsyncStorage.getItem('recipes');
            const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];

            const updatedRecipes = recipes.map(r => r.id === recipe.id ? { ...r, notes } : r);
            await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));

            Alert.alert('Success', 'Notes saved successfully');
        } catch (error) {
            console.error('Error saving notes:', error);
            Alert.alert('Error', 'Failed to save the notes');
        }
    };

    const handleRatingChange = async (newRating) => {
        try {
            const storedRecipes = await AsyncStorage.getItem('recipes');
            const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];

            const updatedRecipes = recipes.map(r => r.id === recipe.id ? { ...r, rating: newRating } : r);
            await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));

            setRating(newRating);
        } catch (error) {
            console.error('Error updating rating:', error);
            Alert.alert('Error', 'Failed to update the rating');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{recipe.title}</Text>
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
                    <Button title="Edit" onPress={() => navigation.navigate('Add/Edit Recipe', { recipe })} />
                </View>

                {/* Button to delete the current recipe */}
                <View style={styles.button}>
                    <Button title="Delete" onPress={deleteRecipe} />
                </View>
                <View style={styles.button}>
                    <Button title={isFavorite ? "Unfavorite" : "Favorite"} onPress={toggleFavorite} />
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
        minHeight: 10,
        textAlign: 'left',
        verticalAlign: 'top',
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
    favoriteButton: {
        marginTop: 16,
    },
    ratingContainer: {
        marginTop: 16,
        marginBottom: 8,
    },
});
