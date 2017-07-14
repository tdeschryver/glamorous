const Nine = glamorous.div((props, {main: {fontSize: theFontSize, fontWeight: theFontWeight}}) => ({
  fontSize: theFontSize,
  fontWeight: theFontWeight,
  color: props.important ? 'red' : 'black',
}))
