import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useGlobalState, useGlobalDispatch } from '../../Context/GlobalState';
import { Genre, getGenres, getImageUrl } from '../../Api/Api';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '../../AppNavigator/AppNavigator';
import themeStyles from '../../theme/theme';
import { Dropdown } from 'react-native-element-dropdown';

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

const FavoritesScreen: React.FC = () => {
  const { favorites } = useGlobalState();
  const dispatch = useGlobalDispatch();
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList, 'HomeMain'>>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchActive, setSearchActive] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreResponse = await getGenres();
        setGenres(genreResponse.genres);
      } catch (err) {
        console.error('Error: Genres cannot loading.', err);
      }
    };
    fetchGenres();
  }, []);

  const removeFavorite = (movieId: number) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: movieId });
  };

  const renderFavoriteItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={themeStyles.favoriteCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Details', { movieId: item.id })}
    >
      <Image source={{ uri: getImageUrl(item.poster_path) || undefined }} style={themeStyles.favoritePoster} />
      <View style={themeStyles.favoriteOverlay}>
        <TouchableOpacity onPress={() => removeFavorite(item.id)} style={themeStyles.favoriteHeartBtn}>
          <Ionicons name="heart" size={24} color="red" />
        </TouchableOpacity>
      </View>
      <Text style={themeStyles.favoriteTitle} numberOfLines={1}>{item.title}</Text>
    </TouchableOpacity>
  );

  const filteredFavorites = favorites.filter(movie => {
    const genreMatch = selectedGenre ? movie.genres.some((genre: Genre) => genre.id === selectedGenre) : true;
    const ratingMatch = selectedRating ? movie.vote_average >= selectedRating : true;
    const searchMatch = searchQuery ? movie.title.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return genreMatch && ratingMatch && searchMatch;
  });

  if (!filteredFavorites || filteredFavorites.length === 0) {
    return (
      <SafeAreaView style={themeStyles.favoriteCenterContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <Text style={themeStyles.favoriteEmptyText}>No favorites added yet.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={themeStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      {/* Search and Filter Buttons */}
      <View style={themeStyles.searchMoviesButtonsRow}>
        <TouchableOpacity onPress={() => setSearchActive(!searchActive)} style={themeStyles.searchMoviesBtn}>
          <Text style={themeStyles.searchMoviesBtnText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilterActive(!filterActive)} style={themeStyles.searchMoviesBtn}>
          <Text style={themeStyles.searchMoviesBtnText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      {searchActive && (
        <TextInput
          style={themeStyles.searchMoviesSearchContainer}
          placeholder="Search by title..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      )}

      {/* Filter Options */}
      {filterActive && (
        <View style={themeStyles.filterOptionsContainer}>
          {/* Genre Dropdown */}
          <Dropdown
            style={themeStyles.searchMoviesDropdown}
            data={genres}
            labelField="name"
            valueField="id"
            placeholder="Select Genre"
            maxHeight={200}
            value={selectedGenre}
            onChange={(item) => {
              setSelectedGenre(item.id);
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

          {/* Rating Dropdown */}
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

      <FlatList
        data={filteredFavorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        contentContainerStyle={{ padding: 10 }}
      />
    </SafeAreaView>
  );
};

export default FavoritesScreen;
