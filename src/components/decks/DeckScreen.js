import * as React from 'react';
import { View, SafeAreaView, FlatList, Text } from 'react-native';
import styles from '../../styles/styles';
import deckStyles from '../../styles/deckStyles';
import ListLinkRow from '../common/ListLinkRow';
import FloatingActionButton from '../common/FloatingActionButton';
import StorageService from '../../services/storageService';
import { GameTypesEnum } from '../../utils/enums';

class DeckScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deck: {
        name: '',
        cards: []
      }
    };
  }

  componentDidMount() {
    this.loadDeck();
  }

  componentDidUpdate() {
    const { navigation, route } = this.props;
    if (route.params.reloadDeck) {
      this.loadDeck();
      navigation.setParams({ reloadDeck: false });
    }
  }

  loadDeck = async () => {
    const { deckId } = this.props.route.params;
    const deck = deckId ? await StorageService.getDeck(deckId) : await this.createNewDeck();
    this.setState({ deck });
  };

  createNewDeck = async () => {
    const newDeck = {
      name: 'My New Deck',
      cards: [],
      type: GameTypesEnum.custom
    };
    newDeck.id = await StorageService.saveNewDeck(newDeck);
    return newDeck;
  };

  getNavigationToCardFunction = (cardIndex) => () => this.navigateToCard(cardIndex);

  navigateToCard = (cardIndex) =>
    this.props.navigation.navigate('ConfigureCards', {
      deckId: this.state.deck.id,
      cardIndex,
      cards: this.state.deck.cards
    });

  render() {
    const { deck } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={deckStyles.titleRow}>
          <Text style={deckStyles.title}>{deck.name}</Text>
        </View>
        <View style={styles.list}>
          <FlatList
            data={deck.cards}
            renderItem={({ item, index }) => (
              <ListLinkRow
                onPress={this.getNavigationToCardFunction(index)}
                text={item}
                numberOfLines={2}
                otherStyles={[deckStyles.listRow]}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <FloatingActionButton
          onPress={() => this.navigateToCard()}
          buttonStyles={[styles.floatingActionButton]}
          iconStyles={[styles.floatingActionIcon]}
        />
      </SafeAreaView>
    );
  }
}

export default DeckScreen;
