// should transform, merge props (object) and theme (properties)
const Five = glamorous.div((props, {main}) => ({
  fontSize: main.fontSize,
  color: props.important ? 'red' : 'black',
}))
