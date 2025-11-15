import type { Card, Suit, Value } from '~/types/card'

const SUITS: Suit[] = ['heart', 'diamond', 'club', 'spade']
const VALUES: Value[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

const DECK_STATE_KEY = 'deck'
const HANDS_STATE_KEY = 'hands'

type ResetOptions = {
  shuffle?: boolean
}

function createBaseDeck(): Card[] {
  return SUITS.flatMap(suit => VALUES.map(value => ({ suit, value })))
}

function shuffle(cards: Card[]): Card[] {
  const copy = [...cards]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const current = copy[i]!
    copy[i] = copy[j]!
    copy[j] = current
  }
  return copy
}

export function useDeck() {
  const deck = useState<Card[]>(DECK_STATE_KEY, () => shuffle(createBaseDeck()))
  const hands = useState<Card[][]>(HANDS_STATE_KEY, () => [])

  function resetDeck(options: ResetOptions = {}) {
    const nextDeck = options.shuffle === false ? createBaseDeck() : shuffle(createBaseDeck())
    deck.value = nextDeck
    hands.value = []
  }

  function shuffleDeck() {
    deck.value = shuffle(deck.value)
  }

  function drawCard() {
    const card = deck.value.shift()
    if (!card) {
      throw new Error('Não há cartas restantes no baralho.')
    }

    return card
  }

  function dealHands(playerCount: number, cardsPerPlayer?: number) {
    if (!Number.isInteger(playerCount) || playerCount <= 0) {
      throw new Error('playerCount precisa ser um inteiro positivo.')
    }

    const availableCards = deck.value.length
    const perPlayer = cardsPerPlayer ?? Math.floor(availableCards / playerCount)

    if (perPlayer <= 0) {
      throw new Error('Não há cartas suficientes para distribuir.')
    }

    const totalNeeded = perPlayer * playerCount
    if (totalNeeded > availableCards) {
      throw new Error('Quantidade de cartas insuficiente no baralho.')
    }

    const deckCopy = [...deck.value]
    const nextHands: Card[][] = []

    for (let playerIndex = 0; playerIndex < playerCount; playerIndex++) {
      const hand: Card[] = []
      for (let cardIndex = 0; cardIndex < perPlayer; cardIndex++) {
        const card = deckCopy.shift()
        if (!card) {
          break
        }
        hand.push(card)
      }
      nextHands.push(hand)
    }

    deck.value = deckCopy
    hands.value = nextHands
    return nextHands
  }

  return {
    deck,
    hands,
    resetDeck,
    shuffleDeck,
    drawCard,
    dealHands
  }
}
