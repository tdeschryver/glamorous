const fs = require('fs')
const path = require('path')
const babel = require('babel-core')

test('test everything in fixtures!', async () => {
  const files = await getFiles()

  expect.assertions(files.length)
  await Promise.all(
    files.map(async filename => {
      const stripped = path.basename(filename, path.extname(filename))
      const actual = await transformFileAsync(stripped)
      expect(actual).toMatchSnapshot(filename)
    }),
  )
})

function getFiles() {
  return new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname, './fixtures'), (err, result) => {
      if (err) {
        reject(err)
      }

      resolve(result)
    })
  })
}

function transformFileAsync(filename) {
  const options = {
    extends: path.join(__dirname, '../.babelrc'),
  }

  return new Promise((resolve, reject) => {
    babel.transformFile(
      path.join(__dirname, `./fixtures/${filename}.js`),
      options,
      (err, {code}) => {
        if (err) {
          reject(err)
        }

        resolve(code)
      },
    )
  })
}

// testing on this will always fail?
// function readFileAsync(filename) {
//   return new Promise((resolve, reject) => {
//     const file = path.join(__dirname,`./fixtures/${filename}-expected.js`)
//     fs.readFile(file, 'utf8', (err, result) => {
//       if (err) {
//         reject(err)
//       }

//       resolve(result)
//     })
//   })
// }
