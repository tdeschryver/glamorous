/* eslint-disable */

// should transform
const MyDiv = glamorous.div((props, theme) => ({
  fontSize: theme.main.fontSize,
}));

const StyledLiveError = glamorous(LiveError)((props, { colors, fonts }) => ({
  color: colors.code,
  fontFamily: fonts.monospace,
  backgroundColor: colors.white,
  width: '100%',
  padding: '1rem',
  whiteSpace: 'pre',
}));

// should not transform
const MySecondDiv = glamorous.div(({ theme }) => ({
  fontSize: theme.main.fontSize,
}));

const Img = glamorous.img({
  height: 45,
  width: 45,
  borderRadius: '100%',
  margin: '0 5px',
  transition: 'transform .3s',
  '&:focus, &:hover, &:active': {
    transform: 'scale(1.2)',
  },
});

const RightHandSide = glamorous.div(
  {
    flex: 1,
    overflow: 'auto',
  },
  ({ theme: { mediaQueries } }) => ({
    [mediaQueries.mediumUp]: {
      maxWidth: '50%',
    },
  }),
);
