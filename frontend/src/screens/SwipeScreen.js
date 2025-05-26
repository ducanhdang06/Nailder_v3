import React from 'react';
import { View, StyleSheet } from 'react-native';
import TinderSwipeCards from '../components/TinderSwipeCards';

const mockDesigns = [
  {
    id: '1',
    title: 'Floral Pink',
    description: 'Soft pink base with hand-painted floral accents.',
    imageUrl: 'https://images.pexels.com/photos/4623060/pexels-photo-4623060.jpeg?cs=srgb&dl=pexels-karolina-grabowska-4623060.jpg&fm=jpg',
    tags: ['pink', 'floral', 'spring'],
  },
  {
    id: '2',
    title: 'Bold Red Tips',
    description: 'Classic red French tips with a glossy finish.',
    imageUrl: 'https://via.placeholder.com/300x400.png?text=Nail+Design+2',
    tags: ['red', 'glossy', 'classic'],
  },
  {
    id: '3',
    title: 'Galaxy Art',
    description: 'Nebula and stars hand-drawn with shimmer overlays.',
    imageUrl: 'https://via.placeholder.com/300x400.png?text=Nail+Design+3',
    tags: ['galaxy', 'shimmer', 'creative'],
  },
];

const SwipeScreen = () => {
  const handleSwipeLeft = (design) => {
    console.log('Swiped left on:', design.title);
  };

  const handleSwipeRight = (design) => {
    console.log('Swiped right on:', design.title);
  };

  const handleSwipeUp = (design) => {
    console.log('Super liked:', design.title);
  };

  return (
    <View style={styles.container}>
      <TinderSwipeCards 
        designs={mockDesigns}
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        onSwipeUp={handleSwipeUp}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SwipeScreen;
