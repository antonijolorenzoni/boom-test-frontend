export const variant = {
  title1: {
    component: 'h1',
    style: {
      fontSize: 25,
      fontWeight: '500',
      lineHeight: '35px',
      color: '#000000',
    },
  },
  title2: {
    component: 'h2',
    style: {
      fontSize: 17,
      fontWeight: '500',
      lineHeight: '24px',
      color: '#000000',
    },
  },
  title3: {
    component: 'h3',
    style: {
      fontSize: 13,
      fontWeight: '500',
      lineHeight: '18px',
      color: '#80888D',
    },
  },
  body3: {
    component: 'h4',
    style: {
      fontSize: 11,
      fontWeight: '400',
      lineHeight: '15px',
      color: '#000000',
    },
  },
  caption2: {
    component: 'h5',
    style: {
      fontSize: 10,
      fontWeight: '400',
      lineHeight: '14px',
      color: '#80888D',
    },
  },
  body1: {
    component: 'p',
    style: {
      fontSize: 13,
      fontWeight: '500',
      lineHeight: '18px',
      color: '#000000',
    },
  },
  body2: {
    component: 'p',
    style: {
      fontSize: 13,
      lineHeight: '18px',
      color: '#000000',
    },
  },
  caption: {
    component: 'p',
    style: {
      fontSize: 12,
      fontWeight: '300',
      lineHeight: '17px',
      color: '#A3ABB1',
    },
  },
  overline: {
    component: 'p',
    style: {
      fontSize: 12,
      fontWeight: '600',
      lineHeight: '17px',
      color: '#A3ABB1',
    },
  },
  kpi1: {
    component: 'p',
    style: {
      fontSize: 17,
      fontWeight: '500',
      lineHeight: '24px',
      color: '#000000',
    },
  },
  kpi: {
    component: 'p',
    style: {
      fontSize: 31,
      fontWeight: '300',
      lineHeight: '44px',
      color: '#000000',
    },
  },
  textButton: {
    component: 'p',
    style: {
      fontSize: 11,
      fontWeight: '700',
      lineHeight: '15px',
      color: '#5AC0B1',
      cursor: 'pointer',
    },
  },
  error: {
    component: 'p',
    style: {
      fontSize: 10,
      lineHeight: '15px',
      color: '#FF2727',
    },
  },
  tag: {
    component: 'p',
    style: {
      fontSize: 11,
      lineHeight: '15px',
      color: '#80888D',
      fontWeight: 600,
    },
  },
  default: {
    component: 'p',
    style: {
      fontSize: 13,
      lineHeight: '18px',
      color: '#000000',
    },
  },
};

export type VariantName = keyof typeof variant;
