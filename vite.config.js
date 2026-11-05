import react from '@vitejs/plugin-react'
import { readFile, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

const carouselItemsId = 'virtual:carousel-items'
const resolvedCarouselItemsId = `\0${carouselItemsId}`
const clientItemsId = 'virtual:client-items'
const resolvedClientItemsId = `\0${clientItemsId}`
const photoExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'])

function photoItemsPlugin() {
  let carouselDirectory
  let clientDirectory

  const invalidateItems = (server, moduleId) => {
    const module = server.moduleGraph.getModuleById(moduleId)
    if (module) {
      server.moduleGraph.invalidateModule(module)
      server.ws.send({ type: 'full-reload' })
    }
  }

  return {
    name: 'carousel-items',
    configResolved(config) {
      carouselDirectory = resolve(config.root, 'public/photos/carousel')
      clientDirectory = resolve(config.root, 'public/photos/clients')
    },
    resolveId(id) {
      if (id === carouselItemsId) return resolvedCarouselItemsId
      if (id === clientItemsId) return resolvedClientItemsId
      return null
    },
    async load(id) {
      if (id === resolvedClientItemsId) {
        const [filenames, metadataText] = await Promise.all([
          readdir(clientDirectory).catch(() => []),
          readFile(resolve(clientDirectory, 'clients.json'), 'utf8').catch(() => '{}')
        ])
        let metadata = {}
        try {
          metadata = JSON.parse(metadataText)
        } catch {
          metadata = {}
        }

        const items = filenames
          .filter((filename) => photoExtensions.has(filename.slice(filename.lastIndexOf('.')).toLowerCase()))
          .sort((a, b) => a.localeCompare(b))
          .map((filename) => {
            const title = filename
              .slice(0, filename.lastIndexOf('.'))
              .replace(/[-_]+/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
              .replace(/\b\w/g, (letter) => letter.toUpperCase())
            const details = metadata[filename] || {}

            return {
              src: `/photos/clients/${encodeURIComponent(filename)}`,
              alt: details.alt || `Client photo: ${title || filename}`,
              title: details.name || title || 'Client',
              subtitle: details.subtitle || '',
              info: details.info || ''
            }
          })

        return `export default ${JSON.stringify(items)};`
      }

      if (id !== resolvedCarouselItemsId) return null

      const filenames = await readdir(carouselDirectory).catch(() => [])
      const items = filenames
        .filter((filename) => photoExtensions.has(filename.slice(filename.lastIndexOf('.')).toLowerCase()))
        .sort((a, b) => a.localeCompare(b))
        .map((filename) => {
          const title = filename
            .slice(0, filename.lastIndexOf('.'))
            .replace(/[-_]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/\b\w/g, (letter) => letter.toUpperCase())

          return {
            src: `/photos/carousel/${encodeURIComponent(filename)}`,
            alt: title ? `Fitness photo: ${title}` : 'Fitness photo',
            title: title || 'Fitness',
            subtitle: 'Training'
          }
        })

      return `export default ${JSON.stringify(items)};`
    },
    configureServer(server) {
      server.watcher.add([carouselDirectory, clientDirectory])
      server.watcher.on('add', (file) => {
        const absolutePath = resolve(file)
        if (absolutePath.startsWith(carouselDirectory)) invalidateItems(server, resolvedCarouselItemsId)
        if (absolutePath.startsWith(clientDirectory)) invalidateItems(server, resolvedClientItemsId)
      })
      server.watcher.on('unlink', (file) => {
        const absolutePath = resolve(file)
        if (absolutePath.startsWith(carouselDirectory)) invalidateItems(server, resolvedCarouselItemsId)
        if (absolutePath.startsWith(clientDirectory)) invalidateItems(server, resolvedClientItemsId)
      })
      server.watcher.on('change', (file) => {
        if (resolve(file) === resolve(clientDirectory, 'clients.json')) invalidateItems(server, resolvedClientItemsId)
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), photoItemsPlugin()],
})
