
// should transform, only use theme and third argument stays as is
const Two = glamorous.div((props, theme, tripple) => ({
  fontSize: theme.main.fontSize,
}))
