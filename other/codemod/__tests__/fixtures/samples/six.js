const Six = glamorous.div(({important}, {main}) => ({
  fontSize: main.fontSize,
  color: important ? 'red' : 'black',
}))
