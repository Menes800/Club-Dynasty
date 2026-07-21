import { createHash } from 'node:crypto'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import tar from 'tar-stream'
import xzPackage from 'xz-decompress'

const { XzReadableStream } = xzPackage
const root = process.cwd()
const marker = path.join(root, '.club-dynasty-v20-prepared')
const expectedBase64Sha = '0f9fa0420c6eb6a68e1976850e2e95e4dbe3bab871750d4f93e2c9195b968556'
const expectedArchiveSha = '829c41da20f87b8f6e79f741b845b5dfd2945de68f0b6a6bee90c8a75d53e1ba'
const expectedFiles = {
  'CHANGELOG.md': '39e8ffb45186e92be0ed0b4849f58df65f954ac32e2187631cfbe4dd7d078a70',
  'README.md': '1018cd3212c6561d4b5e08a23a8dfd5cd8c828ada245d381893e96636b040e6a',
  'index.html': 'c023927b3d5985a82d1e8e9d872dcd29a83d8f7de3362bc2cad7d070969d4e75',
  'package.json': '430d3d73ce6de96a1965b6a93d2211fb4c94dae0f953520fb499c4435000eee3',
  'tsconfig.json': 'fbbc8bc54ee0cb78fccc47ec084e51735a7ecb47e6b4151e534afb085434e56b',
  'src/App.css': 'bd1d5b51bc642998ee579b70bb30e25f65d20a2d88ab10c0e73f42a5904a48d3',
  'src/App.tsx': '800b223122ba741d140fee9f8b1ce9496a8892b0436ae657cd694aea2568a7a8',
  'src/main.tsx': '6a914060e51e803cc2404bdafa2f386e761bd6dd9bd9ba5943b8f8c953f35c94',
  'src/vite-env.d.ts': '65996936fbb042915f7b74a200fcdde7e410f32a669b1ab9597cfaa4b0faddb5',
}
const sha256 = (data) => createHash('sha256').update(data).digest('hex')

async function restoreOriginalSportsEmpireVersion() {
  const files = ['README.md', 'index.html', 'package.json', 'src/App.tsx']

  for (const relativePath of files) {
    const filePath = path.join(root, relativePath)
    let content

    try {
      content = await readFile(filePath, 'utf8')
    } catch {
      continue
    }

    const restored = content
      .replaceAll('CLUB DYNASTY', 'SPORTS EMPIRE')
      .replaceAll('Club Dynasty', 'Sports Empire')
      .replaceAll('club-dynasty-v20-career-pacing-playoff-update', 'sports-empire-v20-career-pacing-playoff-update')

    if (restored !== content) await writeFile(filePath, restored)
  }
}

async function verifyOriginalZipFiles() {
  for (const [relativePath, expectedSha] of Object.entries(expectedFiles)) {
    const actualSha = sha256(await readFile(path.join(root, relativePath)))
    if (actualSha !== expectedSha) {
      throw new Error(`Sports Empire ZIP verification failed for ${relativePath}. Expected ${expectedSha}, received ${actualSha}.`)
    }
  }
}

try {
  if ((await readFile(marker, 'utf8')).trim() === expectedArchiveSha) {
    await restoreOriginalSportsEmpireVersion()
    await verifyOriginalZipFiles()
    process.exit(0)
  }
} catch (error) {
  if (error?.code !== 'ENOENT') throw error
}

const partsDir = path.join(root, '.v20-parts')
const partNames = (await readdir(partsDir)).filter((name) => name.endsWith('.txt')).sort()
if (!partNames.length) throw new Error('Sports Empire v20 archive parts are missing.')

const encoded = (await Promise.all(partNames.map((name) => readFile(path.join(partsDir, name), 'utf8')))).join('')
if (sha256(encoded) !== expectedBase64Sha) throw new Error('Sports Empire v20 archive text checksum failed.')

const compressed = Buffer.from(encoded, 'base64')
if (sha256(compressed) !== expectedArchiveSha) throw new Error('Sports Empire v20 archive checksum failed.')

const decompressedStream = new XzReadableStream(new Blob([compressed]).stream())
const tarBuffer = Buffer.from(await new Response(decompressedStream).arrayBuffer())
const extract = tar.extract()
const done = new Promise((resolve, reject) => {
  extract.on('entry', async (header, stream, next) => {
    try {
      const normalized = path.posix.normalize(header.name).replace(/^\/+/, '')
      if (!normalized || normalized.startsWith('../')) throw new Error(`Unsafe archive path: ${header.name}`)
      const destination = path.join(root, ...normalized.split('/'))
      if (header.type === 'directory') {
        await mkdir(destination, { recursive: true })
        stream.resume()
      } else if (header.type === 'file') {
        await mkdir(path.dirname(destination), { recursive: true })
        const chunks = []
        for await (const chunk of stream) chunks.push(chunk)
        await writeFile(destination, Buffer.concat(chunks), { mode: header.mode || 0o644 })
      } else {
        stream.resume()
      }
      next()
    } catch (error) {
      reject(error)
    }
  })
  extract.on('finish', resolve)
  extract.on('error', reject)
})

extract.end(tarBuffer)
await done
await restoreOriginalSportsEmpireVersion()
await verifyOriginalZipFiles()
await writeFile(marker, `${expectedArchiveSha}\n`)
console.log('Original Sports Empire v20 ZIP restored and verified successfully.')
