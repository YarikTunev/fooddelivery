export function useMetaTags() {
  const setMetaTags = (meta) => {
    if (meta.title) {
      document.title = meta.title
    }
    
    if (meta.description) {
      let descTag = document.querySelector('meta[name="description"]')
      if (!descTag) {
        descTag = document.createElement('meta')
        descTag.name = 'description'
        document.head.appendChild(descTag)
      }
      descTag.content = meta.description
    }
    
    if (meta.keywords) {
      let keyTag = document.querySelector('meta[name="keywords"]')
      if (!keyTag) {
        keyTag = document.createElement('meta')
        keyTag.name = 'keywords'
        document.head.appendChild(keyTag)
      }
      keyTag.content = meta.keywords
    }
    
    if (meta.noindex) {
      let robotTag = document.querySelector('meta[name="robots"]')
      if (!robotTag) {
        robotTag = document.createElement('meta')
        robotTag.name = 'robots'
        document.head.appendChild(robotTag)
      }
      robotTag.content = 'noindex, nofollow'
    } else {
      let robotTag = document.querySelector('meta[name="robots"]')
      if (robotTag) {
        robotTag.content = 'index, follow'
      }
    }
  }
  
  return { setMetaTags }
}