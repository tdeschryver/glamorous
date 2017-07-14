const Four = glamorous.div(({important}, theme) => ({
  fontSize: theme.main.fontSize,
  color: important ? 'red' : 'black',
}))
