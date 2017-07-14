const Three = glamorous.div((props, theme) => ({
  fontSize: theme.main.fontSize,
  color: props.important ? 'red' : 'black',
}))
