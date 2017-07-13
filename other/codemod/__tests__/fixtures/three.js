// should transform, merge props (object) and theme (object) -> translate props object to keys
const Three = glamorous.div((props, theme) => ({
  fontSize: theme.main.fontSize,
  color: props.important ? 'red' : 'black',
}))
