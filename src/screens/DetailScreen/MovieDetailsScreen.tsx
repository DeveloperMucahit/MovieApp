import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  FlatList,
  TouchableWithoutFeedback,
  Animated,
  SafeAreaView
} from 'react-native';
import { getMovieDetails, getMovieCredits, getImageUrl, CastMember, MovieDetails } from '../../Api/Api';
import { useGlobalState, useGlobalDispatch } from '../../Context/GlobalState';
import Ionicons from '@react-native-vector-icons/ionicons';
import themeStyles from '../../theme/theme';
import { getFirestore, doc, setDoc, arrayUnion } from 'firebase/firestore';
import { auth } from '../../Firebase/FirebaseConfig'; 

const FAVORITE_ANIM_DURATION = 800;

const MovieDetailsScreen: React.FC<{ route: any }> = ({ route }) => {
  const { movieId } = route.params;
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const state = useGlobalState();
  const dispatch = useGlobalDispatch();
  const isFavorited = state.favorites.some((fav) => fav.id === movie?.id);
  const [lastTap, setLastTap] = useState<number | null>(null);
  const heartAnim = useRef(new Animated.Value(0)).current;
  const [showHeart, setShowHeart] = useState(false);
  const [heartType, setHeartType] = useState<'full' | 'broken'>('full');

  const getFullHeartIcon = () => {
    return <Ionicons name="heart" color="#fff" size={24} />;
  };

  const getEmptyHeartIcon = () => {
    return <Ionicons name="heart" color="red" size={24} />;
  };

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

  const toggleFavorite = async () => {
    const newFavStatus = !isFavorited;
    if (!movie) return;
    setHeartType(newFavStatus ? 'full' : 'broken');
    animateHeart();

    animateHeart();
    const db = getFirestore();
    const userId = auth.currentUser ?.uid; // Get the current user's ID
    if (isFavorited) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: movie.id });
      // Remove from Firestore
      if (userId) {
        await setDoc(doc(db, 'users', userId), {
          favorites: arrayUnion(movie.id) // Remove the movie ID from favorites
        }, { merge: true });
      }
    } else {
      dispatch({
        type: 'ADD_FAVORITE',
        payload: {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path || '',
          vote_average: movie.vote_average,
          release_date: movie.release_date,
        },
      });
      // Add to Firestore
      if (userId) {
        await setDoc(doc(db, 'users', userId), {
          favorites: arrayUnion(movie.id) // Add the movie ID to favorites
        }, { merge: true });
      }
    }
  };


  const animateHeart = () => {
    setShowHeart(true);
    heartAnim.setValue(0);
    Animated.timing(heartAnim, {
      toValue: 1,
      duration: FAVORITE_ANIM_DURATION,
      useNativeDriver: true,
    }).start(() => setShowHeart(false));
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap && (now - lastTap) < 300) {
      // Double tap detected
      toggleFavorite();
    } else {
      setLastTap(now);
    }
  };

  const heartStyle = {
    opacity: heartAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1, 0],
    }),
    transform: [
      {
        scale: heartAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.5, 1.5, 1],
        }),
      },
    ],
  };

  if (loading) {
    return (
      <View style={themeStyles.center}>
        <ActivityIndicator size="large" color="#ff8c00" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={themeStyles.center}>
        <Text style={{ color: '#ff4d4d' }}>Movie Details Information Is Not Loading.</Text>
      </View>
    );
  }

  const renderCastMember = ({ item }: { item: CastMember }) => (
    <View style={themeStyles.movieDetailsCastMember}>
      <Image
        source={{ uri: getImageUrl(item.profile_path, 'w185') || undefined }}
        style={themeStyles.movieDetailsCastImage}
      />
      <Text style={themeStyles.movieDetailsCastName} numberOfLines={1}>
        {item.name}
      </Text>
    </View>
  );

  const renderGenreBadge = ({ item }: { item: { id: number; name: string } }) => (
    <View key={item.id} style={themeStyles.movieDetailsGenreBadge}>
      <Text style={themeStyles.movieDetailsGenreText}>{item.name}</Text>
    </View>
  );

  return (
    <SafeAreaView style={themeStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <ScrollView>
        <View style={themeStyles.movieDetailsPosterContainer}>
          <TouchableWithoutFeedback onPress={handleDoubleTap}>
            <Image
              source={{ uri: getImageUrl(movie.poster_path) || undefined }}
              style={[themeStyles.movieDetailsPoster, { resizeMode: 'contain' }]} // Adjust resizeMode
            />
          </TouchableWithoutFeedback>

          {showHeart && (
            <Animated.View style={[themeStyles.movieDetailsHeartOverlay, heartStyle]}>
              {heartType === 'full' ? (
                <Ionicons name="heart" size={100} color="red" />
              ) : (
                <Ionicons name="heart-dislike" size={100} color="red" />
              )}
            </Animated.View>
          )}
        </View>
        <View style={themeStyles.movieDetailsFavoriteContainer}>
          <TouchableOpacity onPress={toggleFavorite}>
            {isFavorited ? getEmptyHeartIcon() : getFullHeartIcon()}
          </TouchableOpacity>
          <View style={themeStyles.movieDetailsRatingContainer}>
            <Ionicons name="star" size={16} color="#ffb400" style={{ marginRight: 4 }} />
            <Text style={themeStyles.movieDetailsRatingText}>
              {movie.vote_average.toFixed(1)} / {new Date(movie.release_date).getFullYear()}
            </Text>
          </View>
        </View>

        <View style={themeStyles.movieDetailsGenresContainer}>
          <FlatList
            data={movie.genres}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderGenreBadge}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <ScrollView style={themeStyles.movieDetailsDescriptionContainer}>
          <Text style={themeStyles.movieDetailsDescription}>{movie.overview}</Text>
        </ScrollView>

        <FlatList
          horizontal
          data={credits}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCastMember}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={themeStyles.movieDetailsCastList}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MovieDetailsScreen;
