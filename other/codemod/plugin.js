// eslint-disable-next-line max-len
// https://astexplorer.net/#/gist/8ca6290fb86a601610f228a6f05d5e37/2f262260740eb0dbb0c562b15c0d855739bdd770
// eslint-disable-next-line func-names
module.exports = function(babel) {
  const {types: t} = babel

  return {
    visitor: {
      CallExpression(path) {
        if (
          !path.node.callee.object ||
          path.node.callee.object.name !== 'glamorous'
        ) {
          return
        }

        path.node.arguments
          .filter(arg => arg.params.length > 1) // we good, we good
          .forEach(arg => {
            const [head, shoulders, ...rest] = arg.params
            const themeProperties = t.isObjectPattern(shoulders) ?
              shoulders.properties :
              [propertyFactory(shoulders.name)]

            if (t.isObjectPattern(head)) {
              // we can just merge both properties
              head.properties = [...head.properties, ...themeProperties]
              arg.params = [head, ...rest]
            } else {
              // get every property that is being
              // accessed by the first property name
              const headProperties = arg.body.properties.filter(
                p =>
                  p.value.test &&
                  p.value.test.object &&
                  p.value.test.object.name === head.name,
              )

              // create new properties
              // and remove accessor (prop.foo becomes foo)
              const propProperties = []
              headProperties.forEach(prop => {
                propProperties.push(
                  propertyFactory(prop.value.test.property.name),
                )
                prop.value.test = t.identifier(prop.value.test.property.name)
              })

              // merge
              const properties = t.objectPattern([
                ...propProperties,
                ...themeProperties,
              ])
              arg.params = [properties, ...rest]
            }
          })
      },
    },
  }

  function propertyFactory(name) {
    const key = t.identifier(name)
    const prop = t.objectProperty(key, key)
    prop.shorthand = true
    return prop
  }
}
