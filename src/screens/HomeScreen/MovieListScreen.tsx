import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import {
  getPopularMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getTopRatedMovies,
  getImageUrl,
  Movie,
} from '../../Api/Api';
import { HomeStackParamList } from '../../AppNavigator/AppNavigator';

type MovieListScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'HomeMain'
>;

const movieFetchers = [
  getPopularMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getTopRatedMovies,
];


// TODOS:
// 1. Refeshing animation ekleyeceğiz.
// 2. Favorite sayfasına search ve Filter ekleyeceğiz.
// 3. Login ve Register sayfalarını yapacağız.

const MovieListScreen: React.FC = () => {
  const navigation = useNavigation<MovieListScreenNavigationProp>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);

    const randomFetcher =
      movieFetchers[Math.floor(Math.random() * movieFetchers.length)];
    try {
      const response = await randomFetcher();
      setMovies(response.results);
    } catch (err) {
      setError('Error fetching movies. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    const randomFetcher =
      movieFetchers[Math.floor(Math.random() * movieFetchers.length)];
    try {
      const response = await randomFetcher();
      setMovies(response.results);
    } catch (err) {
      setError('Error fetching movies. Please try again later.');
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleMoviePress = (movieId: number) => {
    navigation.navigate('Details', { movieId });
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleMoviePress(item.id)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: getImageUrl(item.poster_path) || undefined }}
        style={styles.poster}
      />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>
          {item.release_date ? item.release_date.substring(0, 4) : 'N/A'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff8c00" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#ff4d4d' }}>{error}</Text>
      </View>
    );
  }


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovieItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#ff8c00']}
            progressViewOffset={25} 
          />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff8c00',
    paddingVertical: 15,
    textAlign: 'center',
    letterSpacing: 1.2,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginVertical: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.7,
    shadowRadius: 6,
    shadowOffset: { width: 2, height: 4 },
  },
  poster: {
    width: 90,
    height: 140,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: '#333',
  },
  cardContent: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  }
});

export default MovieListScreen;
