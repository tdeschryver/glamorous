const fs = require('fs')
const path = require('path')
const babel = require('babel-core')

test('test every sample!', async () => {
  const files = await getFiles('samples')

  expect.assertions(files.length)
  await Promise.all(
    files.map(async filename => {
      const stripped = path.basename(filename, path.extname(filename))
      const actual = await transformFileAsync('samples', stripped)
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
  const opts = Object.assign(
    {
      extends: path.join(__dirname, '../.babelrc'),
    },
    {},
  ) //TODO: options

  return new Promise((resolve, reject) => {
    babel.transformFile(
      path.join(__dirname, `./fixtures/${subfolder}/${filename}.js`),
      opts,
      (err, {code} = {}) => {
        if (err) {
          reject(err)
        }

        resolve(code)
      },
    )
  })
}
