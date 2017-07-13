// should transform, merge props (properties) and theme (properties)
const Six = glamorous.div(({important}, {main}) => ({
  fontSize: main.fontSize,
  color: important ? 'red' : 'black',
}))
