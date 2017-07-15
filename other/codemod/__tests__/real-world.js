const fs = require('fs')
const path = require('path')
const babel = require('babel-core')
const recast = require('recast')

test('test some real wold examples!', async () => {
  const files = await getFiles('real-world')
  expect.assertions(files.length)
  await Promise.all(
    files.map(async filename => {
      const stripped = path.basename(filename, path.extname(filename))
      const actual = await transformFileAsync('real-world', stripped)
      expect(actual).toMatchSnapshot(filename)
    }),
  )
})

function getFiles(subfolder) {
  return new Promise((resolve, reject) => {
    fs.readdir(
      path.join(__dirname, `./fixtures/${subfolder}`),
      (err, result) => {
        if (err) {
          reject(err)
        }
        resolve(result)
      },
    )
  })
}

function transformFileAsync(subfolder, filename) {
  const options = {
    plugins: ['syntax-jsx', path.join(__dirname, '../plugin.js')],
    parserOpts: {
      parser: recast.parse,
    },
    generatorOpts: {
      generator: recast.print,
    },
    babelrc: false,
  }

  return new Promise((resolve, reject) => {
    babel.transformFile(
      path.join(__dirname, `./fixtures/${subfolder}/${filename}.js`),
      options,
      (err, {code} = {}) => {
        if (err) {
          reject(err)
        }
        resolve(code)
      },
    )
  })
}
