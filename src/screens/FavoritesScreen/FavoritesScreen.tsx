import React from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useGlobalState, useGlobalDispatch } from '../../context/GlobalState'; // adjust according to your global state setup
import { getImageUrl } from '../../Api/Api';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '../../AppNavigator/AppNavigator';

type FavoritesScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'HomeMain'
>;

const FavoritesScreen: React.FC = () => {
  const { favorites } = useGlobalState(); // assumes you have a favorites array in global state
  const dispatch = useGlobalDispatch();
  const navigation = useNavigation<FavoritesScreenNavigationProp>();

  const removeFavorite = (movieId: number) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: movieId });
  };

  const renderFavoriteItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Details', { movieId: item.id })}
    >
      <Image source={{ uri: getImageUrl(item.poster_path) || undefined }} style={styles.poster} />
      <View style={styles.overlay}>
        <TouchableOpacity onPress={() => removeFavorite(item.id)} style={styles.heartBtn}>
          <Ionicons name="heart" size={24} color="red" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
    </TouchableOpacity>
  );

  if (!favorites || favorites.length === 0) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <Text style={styles.emptyText}>No favorites added yet.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ padding: 10 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 18,
  },
  card: {
    flex: 1,
    margin: 10,
    maxWidth: '45%',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    aspectRatio: 2 / 3,
  },
  title: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    padding: 8,
  },
  overlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  heartBtn: {
    padding: 4,
  },
});

export default FavoritesScreen;
