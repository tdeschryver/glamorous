const Five = glamorous.div((props, {main}) => ({
  fontSize: main.fontSize,
  color: props.important ? 'red' : 'black',
}))
