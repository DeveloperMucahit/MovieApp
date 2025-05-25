import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { getPopularMovies, searchMovies, getImageUrl, Movie, getGenres, getMoviesByGenre, Genre, getMoviesByRating } from '../../Api/Api';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../../AppNavigator/AppNavigator';


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

const SearchScreen: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchActive, setSearchActive] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);


  const navigation = useNavigation<StackNavigationProp<HomeStackParamList, 'HomeMain'>>();

  // Filter states
  const [genreFilterActive, setGenreFilterActive] = useState(false);
  const [ratingFilterActive, setRatingFilterActive] = useState(false);

  // Genre data and selection
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  // Rating selection
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  useEffect(() => {
    // Load genres on mount
    const fetchGenres = async () => {
      try {
        const genreResponse = await getGenres();
        setGenres(genreResponse.genres);
      } catch (err) {
        console.error('Hata: Türler yüklenemedi.', err);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    // Load popular movies initially and when filters/search inactive
    if (!filterActive && !searchActive) {
      loadPopularMovies();
    }
  }, [filterActive, searchActive]);

  useEffect(() => {
    // When genre changes, load movies by genre
    if (genreFilterActive && selectedGenre !== null) {
      const fetchMoviesByGenre = async () => {
        setLoading(true);
        try {
          const response = await getMoviesByGenre(selectedGenre);
          setMovies(response.results);
          setError(null);
        } catch (err) {
          setError('Filmler yüklenirken hata oluştu.');
        }
        setLoading(false);
      };
      fetchMoviesByGenre();
    } else if (genreFilterActive && selectedGenre === null) {
      loadPopularMovies();
    }
  }, [selectedGenre, genreFilterActive]);

  useEffect(() => {
    if (ratingFilterActive && selectedRating !== null) {
      const fetchMoviesByRating = async () => {
        setLoading(true);
        try {
          const response = await getMoviesByRating(selectedRating);
          setMovies(response.results);
          setError(null);
        } catch (err) {
          setError('Filmler yüklenirken hata oluştu.');
        }
        setLoading(false);
      };
      fetchMoviesByRating();
    } else if (ratingFilterActive && selectedRating === null) {
      loadPopularMovies();
    }
  }, [selectedRating, ratingFilterActive]);

  const loadPopularMovies = async () => {
    setLoading(true);
    try {
      const response = await getPopularMovies();
      setMovies(response.results);
      setError(null);
    } catch (err) {
      setError('Popüler filmler yüklenirken hata oluştu.');
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
    // Reset filter sub-buttons on toggling Filter button
    if (!filterActive) {
      setGenreFilterActive(false);
      setRatingFilterActive(false);
      setSelectedGenre(null);
    }
  };

  const toggleRatingFilter = () => {
    if (ratingFilterActive) {
      setRatingFilterActive(false);
      setSelectedRating(null);
      loadPopularMovies();
    } else {
      setRatingFilterActive(true);
      setGenreFilterActive(false);
      setSelectedGenre(null);
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
      setError('Arama yapılırken hata oluştu.');
    }
    setLoading(false);
    setSearching(false);
  };

  const toggleGenreFilter = () => {
    if (genreFilterActive) {
      setGenreFilterActive(false);
      setSelectedGenre(null);
      loadPopularMovies();
    } else {
      setGenreFilterActive(true);
      setRatingFilterActive(false);
    }
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity 
    style={styles.gridCard}
    activeOpacity={0.7}
    onPress={() => navigation.navigate('Details', { movieId: item.id })}
     >
      <Image source={{ uri: getImageUrl(item.poster_path) || undefined }} style={styles.gridPoster} />
      <Text style={styles.gridTitle} numberOfLines={1}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[styles.btn, searchActive && styles.btnActive]}
          onPress={handleSearchToggle}
        >
          <Text style={[styles.btnText, searchActive && styles.btnTextActive]}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, filterActive && styles.btnActive]}
          onPress={handleFilterToggle}
        >
          <Text style={[styles.btnText, filterActive && styles.btnTextActive]}>Filter</Text>
        </TouchableOpacity>
      </View>

      {searchActive && (
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.textInputWithIcon}
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
              style={styles.clearIconContainer}
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={22} color="#ff8c00" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {filterActive && (
        <View style={styles.filterButtonsRow}>
          <TouchableOpacity
            style={[styles.filterBtn, genreFilterActive && styles.filterBtnActive]}
            onPress={toggleGenreFilter}
          >
            <Text style={[styles.filterBtnText, genreFilterActive && styles.filterBtnTextActive]}>
              Genre
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterBtn, ratingFilterActive && styles.filterBtnActive]}
            onPress={toggleRatingFilter}
          >
            <Text style={[styles.filterBtnText, ratingFilterActive && styles.filterBtnTextActive]}>
              Rating
            </Text>
          </TouchableOpacity>
        </View>
      )}

    {filterActive && ratingFilterActive && (
       <View style={styles.dropdownWrapper}>
      <Dropdown
        style={styles.dropdown}
        data={ratingOptions}
        labelField="label"
        valueField="value"
        placeholder="Select Rating"
        maxHeight={200}
        value={selectedRating}
        onChange={(item) => {
          setSelectedRating(item.value);
        }}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        dropdownPosition="bottom"
        showsVerticalScrollIndicator
        activeColor="#ff8c00"
        containerStyle={styles.dropdownContainerStyle}
        itemTextStyle={{ color: '#fff'}}
      />
    </View>
  )}

      {/* Genre dropdown using react-native-element-dropdown */}
      {filterActive && genreFilterActive && (
        <View style={styles.dropdownWrapper}>
          <Dropdown
            style={styles.dropdown}
            data={genres.map((g) => ({ label: g.name, value: g.id }))}
            labelField="label"
            valueField="value"
            placeholder="Select Genre"
            maxHeight={200}
            value={selectedGenre}
            onChange={(item) => {
              setSelectedGenre(item.value);
            }}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            dropdownPosition="auto"
            showsVerticalScrollIndicator
            activeColor="#ff8c00"
            containerStyle={styles.dropdownContainerStyle}
            itemTextStyle={{ color: '#fff'}}
            
          />
        </View>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#ff8c00" />
        </View>
      ) : error ? (
        <View style={styles.center}>
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
            <View style={styles.center}>
              <Text style={{ color: '#aaa' }}>
                {searching ? 'Arama sonucu bulunamadı.' : 'Film bulunamadı.'}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );

  



};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 15,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ff8c00',
    backgroundColor: 'transparent',
  },
  btnActive: {
    backgroundColor: '#ff8c00',
  },
  btnText: {
    color: '#ff8c00',
    fontWeight: '600',
    fontSize: 16,
  },
  btnTextActive: {
    color: '#121212',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
    zIndex: 10,
  },
  textInputWithIcon: {
    flex: 1,
    height: 40,
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    paddingLeft: 40,
    color: '#fff',
    fontSize: 16,
  },
  clearIconContainer: {
    position: 'absolute',
    right: 15,
    zIndex: 15,
  },
  searchBtn: {
    marginLeft: 10,
    backgroundColor: '#ff8c00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  searchBtnText: {
    color: '#121212',
    fontWeight: 'bold',
  },
  filterButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 45,
    borderRadius: 20,
    borderColor: '#ff8c00',
    borderWidth: 1,
    marginHorizontal: 10,
  },
  filterBtnActive: {
    backgroundColor: '#ff8c00',
  },
  filterBtnText: {
    color: '#ff8c00',
    fontWeight: '600',
    fontSize: 15,
  },
  filterBtnTextActive: {
    color: '#121212',
  },
  dropdownWrapper: {
    marginHorizontal: 10,
    marginBottom: 10,
  },
  dropdown: {
    height: 40,
    borderColor: '#ff8c00',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#1e1e1e',
  },
  placeholderStyle: {
    color: '#888',
    fontSize: 16,
  },
  selectedTextStyle: {
    color: '#fff',
    fontSize: 16,
  },
  iconStyle: {
    tintColor: '#ff8c00',
    width: 20,
    height: 20,
  },
  dropdownContainerStyle: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
  },
  gridCard: {
    flex: 1,
    margin: 8,
    maxWidth: '45%',
    alignItems: 'center',
  },
  gridPoster: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 12,
    backgroundColor: '#333',
  },
  gridTitle: {
    marginTop: 8,
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#2c2c2c', // slightly lighter than dropdown container for contrast
  },
  
  dropdownItemSelected: {
    backgroundColor: '#ff8c00',
    borderRadius: 8,
  },
  
  dropdownItemText: {
    color: '#fff', // white text for normal items
    fontSize: 16,
  },
  
  dropdownItemTextSelected: {
    color: '#121212', // dark text on selected orange background
    fontWeight: '700',
    fontSize: 16,
  },
  
});

export default SearchScreen;

