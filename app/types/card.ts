export type Suit = 'heart' | 'diamond' | 'club' | 'spade';

export const SUIT_ICON = {
  heart: 'mdi:cards-heart',
  diamond: 'mdi:cards-diamond',
  club: 'mdi:cards-club',
  spade: 'mdi:cards-spade',
}

export const SUIT_COLOR: Record<'white' | 'black', Record<Suit, string>> = {
  white: {
    heart: '#FB0D06',
    diamond: '#FB0D06',
    club: '#000000',
    spade: '#000000',
  },
  black: {
    heart: '#FF0000',
    diamond: '#FF0000',
    club: '#FFFFFF',
    spade: '#FFFFFF',
  }
}

export type Value =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";

export interface Card {
  suit: Suit;
  value: Value;
}

export type Pattern = 'diagonal' | 'grid' | 'circles' | 'waves';

export type Preset = 'classic' | 'white' | 'black';

export type CardStyles = {
  front: {
    color?: {
      heart: string;
      diamond: string;
      club: string;
      spade: string;
    };
    background: string;
  }
  back: {
    icon: {
      name: string;
      color: string;
    };
    background: string;
    pattern: Pattern;
  }
  border: {
    color: string;
    size?: string;
  };
}

export const CLASSIC_PRESET: CardStyles = {
  front: {
    background: '#FFFFFF',
    color: {
      heart: '#FF0000',
      diamond: '#FF0000',
      club: '#000000',
      spade: '#000000'
    },

  },
  back: {
    icon: {
      name: 'mdi:crown', color: '#D4AF37'
    },
    background: '#e8e8e8',
    pattern: 'diagonal'
  },
  border: {
    color: '#D4AF37',
    size: '3px'
  }
};

export const WHITE_PRESET: CardStyles = {
  front: {
    background: '#FFFFFF',
    color: {
      heart: '#FF0000',
      diamond: '#FF0000',
      club: '#000000',
      spade: '#000000',
    },
  },
  back: {
    icon: {
      name: 'game-icons:suits',
      color: '#FFFFFF'
    },
    background: '#5F5F5F',
    pattern: 'diagonal'
  },
  border: {
    color: '#5F5F5F',
    size: '3px'
  },
};

export const BLACK_PRESET: CardStyles = {
  front: {
    background: '#1E1E1E',
    color: {
      heart: '#FF5151',
      diamond: '#FF5151',
      club: '#F5F5F5',
      spade: '#F5F5F5',
    },
  },
  back: {
    icon: {
      name: 'game-icons:suits', color: '#FFFFFF'
    },
    background: '#000000',
    pattern: 'diagonal'
  },
  border: {
    color: '#1a1a1a',
    size: '3px'
  },
};

export const STYLE: Record<Preset, CardStyles> = {
  classic: CLASSIC_PRESET,
  white: WHITE_PRESET,
  black: BLACK_PRESET,
}
