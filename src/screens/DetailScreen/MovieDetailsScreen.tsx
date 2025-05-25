import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  FlatList
} from 'react-native';
import { getMovieDetails, getMovieCredits, getImageUrl, Movie, CastMember } from '../../Api/Api';
import { useGlobalState, useGlobalDispatch, } from '../../context/GlobalState';
import Ionicons from '@react-native-vector-icons/ionicons';


const MovieDetailsScreen: React.FC<{ route: any }> = ({ route }) => {
  const { movieId } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [credits, setCredits] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  //const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const state = useGlobalState();
  const dispatch = useGlobalDispatch();
  const isFavorited = state.favorites.some((fav) => fav.id === movie?.id);
  
  

  const getFullHeartIcon = () => {
    return <Ionicons name="heart" color="#fff" size={24} />
  }

  const getEmptyHeartIcon = () => {
    return <Ionicons name="heart" color="red" size={24}  />;
  }

  useEffect(() => {
    const loadMovieData = async () => {
      try {
        setLoading(true);
        const movieData = await getMovieDetails(movieId);
        const creditsData = await getMovieCredits(movieId);
        setMovie(movieData);
        setCredits(creditsData.cast);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMovieData();
  }, [movieId]);

  const toggleFavorite = () => {
    if (!movie) return;
    if (isFavorited) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: movie.id });
    } else {
      dispatch({ 
        type: 'ADD_FAVORITE', 
        payload: {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path || '',
          vote_average: movie.vote_average,
          release_date: movie.release_date,
        } 
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff8c00" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#ff4d4d' }}>Film bilgileri yüklenemedi.</Text>
      </View>
    );
  }

  const renderCastMember = ({ item }: { item: CastMember }) => (
    <View style={styles.castMember}>
       <Image
        source={{ uri: getImageUrl(item.profile_path, 'w185') }}
        style={styles.castImage}
      /> 
      <Text style={styles.castName} numberOfLines={1}>
        {item.name}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <Image
        source={{ uri: getImageUrl(movie.poster_path)}}
        style={styles.poster}
      />
      <View style={styles.favoriteContainer}>

      <TouchableOpacity onPress={toggleFavorite}>
        {/* TODO: Favorilere ekleme yapıldığında kullanıcının bilgisi ile firebase/storage tarafına eklenmesi gerekiyor. */}
        {isFavorited ? getEmptyHeartIcon() : getFullHeartIcon()} 
      </TouchableOpacity>
        <TouchableOpacity onPress={toggleFavorite}>
        </TouchableOpacity>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#ffb400" style={{ marginRight: 4 }} />
            <Text style={styles.ratingText}>
              {movie.vote_average} / {new Date(movie.release_date).getFullYear()}
            </Text>
          </View>
      </View>

      <View style={styles.genresContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {movie.genres.map((genre) => (
          <View key={genre.id} style={styles.genreBadge}>
            <Text style={styles.genreText}>{genre.name}</Text>
          </View>
          ))}
         </ScrollView>
      </View>

      <Text style={styles.description}>{movie.overview}</Text>
      <FlatList
        horizontal
        data={credits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCastMember}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.castList}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 15,
  },
  poster: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  favoriteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',  
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',                    
    paddingHorizontal: 5,             
  },
  rating: {
    color: '#fff',
    fontSize: 16,
  }, 
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#fff',
    fontSize: 16,
  }, 
  description: {
    color: '#ccc',
    fontSize: 16,
    marginVertical: 10,
  },
  castHeader: {
    color: '#ff8c00',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  castList: {
    paddingVertical: 10,
  },
  castMember: {
    width: 100,
    marginRight: 15,
    alignItems: 'center',
  },
  castImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  castName: {
    color: '#fff',
    marginTop: 8,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  genresContainer: {
    marginVertical: 10
  },
  genreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genreText: {
    color: '#ff8c00',
    fontWeight: '600',
    fontSize: 14,
  },
  
});

export default MovieDetailsScreen;
