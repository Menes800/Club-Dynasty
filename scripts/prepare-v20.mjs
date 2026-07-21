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

try {
  if ((await readFile(marker, 'utf8')).trim() === expectedArchiveSha) {
    await restoreOriginalSportsEmpireVersion()
    process.exit(0)
  }
} catch {}

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
await writeFile(marker, `${expectedArchiveSha}\n`)
console.log('Original Sports Empire v20 source prepared successfully.')
