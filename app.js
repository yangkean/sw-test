// 使用 service worker 的入口文件

// 注册站点的 service worker
if('serviceWorker' in navigator) { // 确保 service worker 受支持
  // 注册函数的第一个参数的 URL 是相对于网站的源 (origin) 的
  navigator.serviceWorker.register('/Github/sw-test/sw.js', {
    scope: '/Github/sw-test/' // 指定想让 service worker 控制的内容的子目录，默认也是这个目录，即 worker 文件所在的目录，而且这也是最大的 scope
  }).then((reg) => {
    // 注册成功
    console.log(`Registration succeeded. Scope is ${reg.scope}`)
  }).catch((error) => {
    // 注册失败
    console.log(`Registration failed with ${error}`)
  })
}

// 用 XHR 动态加载图片
function imgLoad(imgJSON) {
  // 返回一个图片加载的 promise
  return new Promise(function(resolve, reject) {
    const request = new XMLHttpRequest()
    request.open('GET', imgJSON.url)
    request.responseType = 'blob'

    request.onload = () => {
      if(request.status === 200) {
        const arrayResponse = []
        arrayResponse[0] = request.response
        arrayResponse[1] = imgJSON
        resolve(arrayResponse)
      } else {
        reject(Error(`Image didn't load successfully; error code: ${request.statusText}`))
      }
    }

    request.onerror = () => {
      reject(Error('There was a network error'))
    }

    request.send()
  })
}

const imgSection = document.querySelector('section')

window.onload = () => {
  for(let i = 0; i < Gallery.images.length - 1; i++) {
    imgLoad(Gallery.images[i]).then(function(arrayResponse) {
      const myImage = document.createElement('img')
      const myFigure = document.createElement('figure')
      const myCaption = document.createElement('caption')
      const imageURL = window.URL.createObjectURL(arrayResponse[0])

      myImage.src = imageURL
      myImage.setAttribute('alt', arrayResponse[1].alt)
      myCaption.innerHTML = '<strong>' + arrayResponse[1].name + '</strong>'

      imgSection.appendChild(myFigure)
      myFigure.appendChild(myImage)
      myFigure.appendChild(myCaption)
    }, function(err) {
      console.log(err)
    })
  }
}