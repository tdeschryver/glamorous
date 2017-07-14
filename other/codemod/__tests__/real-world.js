const fs = require('fs')
const path = require('path')
const babel = require('babel-core')

test('test some real wold examples!', async () => {
  const files = await getFiles('real-world')

  expect.assertions(files.length)
  await Promise.all(
    files.map(async filename => {
      const stripped = path.basename(filename, path.extname(filename))
      const actual = await transformFileAsync('real-world', stripped, {
        presets: [
          [
            'env',
            {
              targets: {
                node: '4.5',
              },
            },
          ],
          'stage-2',
          'react',
        ],
      })
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
