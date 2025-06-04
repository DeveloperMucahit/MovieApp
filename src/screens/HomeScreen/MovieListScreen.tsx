import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import {
  getPopularMovies,
  getImageUrl,
  Movie,
} from '../../Api/Api';
import { HomeStackParamList } from '../../AppNavigator/AppNavigator';
import themeStyles from '../../theme/theme';

type MovieListScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'HomeMain'
>;

const MovieListScreen: React.FC = () => {
  const navigation = useNavigation<MovieListScreenNavigationProp>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);

    const MAX_PAGE = 500;
    const randomPage = Math.floor(Math.random() * MAX_PAGE) + 1;
    try {
      const response = await getPopularMovies(randomPage);
      setMovies(response.results);
    } catch (err) {
      setError('Error fetching movies. Please try again later.');
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
    const MAX_PAGE = 500; 
    const randomPage = Math.floor(Math.random() * MAX_PAGE) + 1;
    try {
      const response = await getPopularMovies(randomPage);
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

  

  if (loading && !refreshing) {
    return (
      <View style={themeStyles.center}>
        <ActivityIndicator size="large" color="#ff8c00" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={themeStyles.center}>
        <Text style={{ color: '#ff4d4d' }}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={themeStyles.container}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#111" translucent /> */}
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={ ({ item }) => (
          <TouchableOpacity
            style={themeStyles.movieListCard}
            onPress={() => handleMoviePress(item.id)}
          >
            <Image
              source={{ uri: getImageUrl(item.poster_path) || undefined }}
              style={themeStyles.movieListPoster}
            />
            <View style={themeStyles.movieListCardContent}>
              <Text style={themeStyles.movieListTitle}>{item.title}</Text>
              <Text style={themeStyles.movieListSubtitle}>
                {new Date(item.release_date).getFullYear()}
              </Text>
            </View>
          </TouchableOpacity>
        )
}
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

export default MovieListScreen;
