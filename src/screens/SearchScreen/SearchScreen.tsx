import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getPopularMovies, searchMovies, getImageUrl, Movie, getGenres, getMoviesByGenreAndRating, Genre } from '../../Api/Api';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../../AppNavigator/AppNavigator';
import themeStyles from '../../Theme/theme';

const ratingOptions = [
  { label: '9+', value: 9 },
  { label: '8+', value: 8 },
  { label: '7+', value: 7 },
  { label: '6+', value: 6 },
  { label: '5+', value: 5 },
  { label: '4+', value: 4 },
  { label: '3+', value: 3 },
  { label: '2+', value: 2 },
  { label: '1+', value: 1 },
];

type MovieListScreenNavigationProp = StackNavigationProp<
  HomeStackParamList
>;

const SearchScreen: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchActive, setSearchActive] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();

  const [genreFilterActive, setGenreFilterActive] = useState(false);
  const [ratingFilterActive, setRatingFilterActive] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreResponse = await getGenres();
        setGenres(genreResponse.genres);
      } catch (err) {
        Alert.alert('Movie Type can not loading. Refresh the screen.');
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    if (!filterActive && !searchActive) {
      loadPopularMovies();
    }
  }, [filterActive, searchActive]);

  useEffect(() => {
    if (genreFilterActive || selectedGenre !== null) {
      fetchMovies();
    } else if (genreFilterActive || selectedGenre === null) {
      loadPopularMovies();
    }
  }, [selectedGenre, genreFilterActive]);

  const loadPopularMovies = async () => {
    setLoading(true);
    try {
      const response = await getPopularMovies();
      setMovies(response.results);
      setError(null);
    } catch (err) {
      setError('Popular movies could not be loaded. Please try again later.');
    }
    setLoading(false);
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      let response;
      if (searchQuery.trim()) {
        response = await searchMovies(searchQuery.trim());
      } else {
        response = await getPopularMovies();
      }

      if (selectedGenre || selectedRating) {
        response = await getMoviesByGenreAndRating(selectedGenre, selectedRating || 0);
      }


      setMovies(response.results);
      setError(null);
    } catch (err) {
      setError('Movies could not be loaded. Please try again later.');
    }
    setLoading(false);
  };

  const handleSearchToggle = () => {
    setSearchActive((prev) => !prev);
    if (filterActive) {
      setFilterActive(false);
      setGenreFilterActive(false);
      setRatingFilterActive(false);
      setSelectedGenre(null);
    }
    setSearchQuery('');
  };

  const handleFilterToggle = () => {
    setFilterActive((prev) => !prev);
    if (searchActive) {
      setSearchActive(false);
    }
    
    if (filterActive) {
      setGenreFilterActive(false);
      setRatingFilterActive(false);
      setSelectedGenre(null);
    }
  };

  const toggleGenreFilter = () => {
    if (genreFilterActive) {
      setGenreFilterActive(false);
      setSelectedGenre(null);
      getMoviesByGenreAndRating(selectedGenre, selectedRating || 0);
    } else {
      setGenreFilterActive(true);
    }
  };

  const toggleRatingFilter = () => {
    if (ratingFilterActive) {
      setRatingFilterActive(false);
      setSelectedRating(null);
      getMoviesByGenreAndRating(selectedGenre, selectedRating || 0);
    } else {
      setRatingFilterActive(true);
    }
  };

  const handleSearchSubmit = async () => {
    if (!searchQuery.trim()) {
      loadPopularMovies();
      setSearching(false);
      return;
    }
    setSearching(true);
    setLoading(true);
    try {
      const response = await searchMovies(searchQuery.trim());
      setMovies(response.results);
      setError(null);
    } catch (err) {
      setError('We could not find any movies matching your search.');
    }
    setLoading(false);
    setSearching(false);
  };

  const handleMoviePress = (movieId: number) => {
    console.log(navigation.getState());
    navigation.navigate('Details', { movieId });
  };
  

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity 
      style={themeStyles.searchMoviesGridCard}
      activeOpacity={0.7}
       onPress={() => handleMoviePress(item.id)}
    >
      <Image source={{ uri: getImageUrl(item.poster_path) || undefined }} style={themeStyles.searchMoviesGridPoster} />
      <Text style={themeStyles.searchMoviesGridTitle} numberOfLines={1}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={themeStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <View style={themeStyles.searchMoviesButtonsRow}>
        <TouchableOpacity
          style={[themeStyles.searchMoviesBtn, searchActive && themeStyles.searchMoviesBtnActive]}
          onPress={handleSearchToggle}
        >
          <Text style={[themeStyles.searchMoviesBtnText, searchActive && themeStyles.searchMoviesBtnTextActive]}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[themeStyles.searchMoviesBtn, filterActive && themeStyles.searchMoviesBtnActive]}
          onPress={handleFilterToggle}
        >
          <Text style={[themeStyles.searchMoviesBtnText, filterActive && themeStyles.searchMoviesBtnTextActive]}>Filter</Text>
        </TouchableOpacity>
      </View>

      {searchActive && (
        <View style={themeStyles.searchMoviesSearchContainer}>
          <Ionicons name="search-outline" size={20} color="#888" style={themeStyles.searchMoviesSearchIcon} />
          <TextInput
            style={themeStyles.searchMoviesTextInputWithIcon}
            placeholder="Search movies..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            clearButtonMode="never"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={themeStyles.searchMoviesClearIconContainer}
              onPress={() => {
                setSearchQuery(''); 
                loadPopularMovies();
               }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={22} color="#ff8c00" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {filterActive && (
        <View style={themeStyles.searchMoviesFilterButtonsRow}>
          <TouchableOpacity
            style={[themeStyles.searchMoviesFilterBtn, genreFilterActive && themeStyles.searchMoviesFilterBtnActive]}
            onPress={toggleGenreFilter}
          >
            <Text style={[themeStyles.searchMoviesFilterBtnText, genreFilterActive && themeStyles.searchMoviesFilterBtnTextActive]}>
              Genre
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[themeStyles.searchMoviesFilterBtn, ratingFilterActive && themeStyles.searchMoviesFilterBtnActive]}
            onPress={toggleRatingFilter}
          >
            <Text style={[themeStyles.searchMoviesFilterBtnText, ratingFilterActive && themeStyles.searchMoviesFilterBtnTextActive]}>
              Rating
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {filterActive && ratingFilterActive && (
        <View style={themeStyles.searchMoviesDropdownWrapper}>
          <Dropdown
            style={themeStyles.searchMoviesDropdown}
            data={ratingOptions}
            labelField="label"
            valueField="value"
            placeholder="Select Rating"
            maxHeight={200}
            value={selectedRating}
            onChange={(item) => {
              setSelectedRating(item.value);
              fetchMovies(); 
            }}
            placeholderStyle={themeStyles.searchMoviesPlaceholderStyle}
            selectedTextStyle={themeStyles.searchMoviesSelectedTextStyle}
            iconStyle={themeStyles.searchMoviesIconStyle}
            dropdownPosition="bottom"
            showsVerticalScrollIndicator
            activeColor="#ff8c00"
            containerStyle={themeStyles.searchMoviesDropdownContainerStyle}
            itemTextStyle={{ color: '#fff'}}
          />
        </View>
      )}

      {filterActive && genreFilterActive && (
        <View style={themeStyles.searchMoviesDropdownWrapper}>
          <Dropdown
            style={themeStyles.searchMoviesDropdown}
            data={genres.map((g) => ({ label: g.name, value: g.id }))}
            labelField="label"
            valueField="value"
            placeholder="Select Genre"
            maxHeight={200}
            value={selectedGenre}
            onChange={(item) => {
              setSelectedGenre(item.value);
              fetchMovies(); 
            }}
            placeholderStyle={themeStyles.searchMoviesPlaceholderStyle}
            selectedTextStyle={themeStyles.searchMoviesSelectedTextStyle}
            iconStyle={themeStyles.searchMoviesIconStyle}
            dropdownPosition="auto"
            showsVerticalScrollIndicator
            activeColor="#ff8c00"
            containerStyle={themeStyles.searchMoviesDropdownContainerStyle}
            itemTextStyle={{ color: '#fff'}}
          />
        </View>
      )}

      {loading ? (
        <View style={themeStyles.center}>
          <ActivityIndicator size="large" color="#ff8c00" />
        </View>
      ) : error ? (
        <View style={themeStyles.center}>
          <Text style={{ color: '#ff4d4d' }}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovieItem}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 8 }}
          ListEmptyComponent={
            <View style={themeStyles.center}>
              <Text style={{ color: '#aaa' }}>
                {searching ? 'Search result is not found' : 'Movie is not found. Please try again.'}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;
