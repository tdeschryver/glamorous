// eslint-disable-next-line max-len
// https://astexplorer.net/#/gist/8ca6290fb86a601610f228a6f05d5e37/2f262260740eb0dbb0c562b15c0d855739bdd770
// eslint-disable-next-line func-names
module.exports = function(babel) {
  const {types: t} = babel

  return {
    visitor: {
      CallExpression(path) {
        if (
          !path.node.callee ||
          !path.node.callee.object ||
          path.node.callee.object.name !== 'glamorous' ||
          !path.node.arguments
        ) {
          return
        }

        path.node.arguments
          .filter(arg => arg.params && arg.params.length > 1)
          .forEach(arg => {
            const [head, shoulders, ...rest] = arg.params

            if (t.isObjectPattern(head)) {
              if (t.isObjectPattern(shoulders)) {
                const shoulderProperties = t.objectProperty(
                  t.identifier('theme'),
                  t.objectExpression(shoulders.properties),
                )
                head.properties = [...head.properties, shoulderProperties]
                arg.params = [head, ...rest]
              } else {
                head.properties = [
                  ...head.properties,
                  propertyFactory(shoulders.name),
                ]
                arg.params = [head, ...rest]
              }
            } else if (t.isObjectPattern(shoulders)) {
              // eslint-disable-next-line func-style
              const addProperty = (builder, property) => {
                builder.forEach(item => {
                  item.push(property)
                })

                builder.push([property])
              }
              // eslint-disable-next-line func-style
              const loopProperties = (builder, {key, value}) => {
                addProperty(builder, key.name)
                if (value.properties) {
                  return value.properties
                    .map(p =>
                      loopProperties(JSON.parse(JSON.stringify(builder)), p),
                    )
                    .reduce((flat, item) => {
                      return flat.concat(item)
                    }, [])
                } else {
                  addProperty([...builder], value.name)
                  return builder
                }
              }

              const builder = loopProperties([], shoulders.properties[0])

              arg.body.properties.filter(p => p.value).forEach(prop => {
                const props = builder
                  .filter(b => b[b.length - 1] === prop.value.name)
                  .sort(b => -b.length)[0]

                if (props) {
                  prop.value = props.reduce((acc, p, i) => {
                    if (i + 1 === props.length) {
                      return acc
                    }
                    acc.property = t.memberExpression(
                      acc.property,
                      t.identifier(p),
                    )
                    return acc
                  }, t.memberExpression(t.identifier(head.name), t.identifier('theme'))) // eslint-disable-line max-len
                } else {
                  const themeProperties = shoulders.properties.map(
                    p => p.key.name,
                  )
                  arg.body.properties
                    .filter(
                      p =>
                        p.value &&
                        p.value.object &&
                        themeProperties.includes(p.value.object.name),
                    )
                    .forEach(p => {
                      // recreate properties
                      const prefix = t.memberExpression(
                        t.identifier(''),
                        t.identifier(p.value.object.name),
                      )
                      prefix.object = t.memberExpression(
                        t.identifier(head.name),
                        t.identifier('theme'),
                      )
                      p.value.object = prefix
                    })

                  arg.params = [head, ...rest]
                }
              })
            } else {
              const themeProperties = [propertyFactory(shoulders.name)]

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
