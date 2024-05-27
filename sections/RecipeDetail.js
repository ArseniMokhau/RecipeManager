import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecipeDetail({ route, navigation }) {
    const { recipe } = route.params;
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
            <Text style={styles.subtitle}>Instructions:</Text>
            <Text style={styles.text}>{recipe.instructions}</Text>
            <View style={styles.controlButtons}>
                <View style={styles.button}>
                    <Button title="Edit Recipe" onPress={() => navigation.navigate('Add/Edit Recipe', { recipe })} />
                </View>
                <View style={styles.button}>
                    <Button title="Delete Recipe" onPress={deleteRecipe} />
                </View>
            </View>
            <View style={styles.favoriteButton}>
                <Button title={isFavorite ? "Unfavorite" : "Favorite"} onPress={toggleFavorite} />
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
});
