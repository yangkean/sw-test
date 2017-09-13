// 监听 install 事件，这个事件会在 service worker 第一次注册后或者你的 service worker 文件更新(浏览器自动识别)之后被触发
// self 指代 service worker 的全局作用域
self.addEventListener('install', function(event) {
  event.waitUntil( // 确保 service worker 在 waitUntil() 里的代码执行完毕后才继续执行安装
    // 用 caches.open() 创建一个叫 v1 的新缓存
    caches.open('v1').then((cache) => {
      // 调用缓存实例上的方法 addAll，参数是一个由一组相对于 origin 的 URL 组成的数组，这些 URL 就是你想缓存的资源的列表
      return cache.addAll([
        '/Github/sw-test/',
        '/Github/sw-test/index.html',
        '/Github/sw-test/style.css',
        '/Github/sw-test/app.js',
        '/Github/sw-test/image-list.js',
        '/Github/sw-test/gallery/',
        '/Github/sw-test/gallery/1.jpg',
        '/Github/sw-test/gallery/2.jpg',
        '/Github/sw-test/gallery/404.jpg'
      ])
    })
  )
})

// 监听 fetch 事件，这个事件会在每次页面发起请求时被触发，触发后
// service worker 能够拦截请求并决定返回什么 —— 缓存数据或真实网络请求的响应
self.addEventListener('fetch', function(event) {
  // respondWith 用于返回请求的响应给浏览器
  event.respondWith(
    caches.match(event.request) // 寻找匹配特定请求的缓存响应，未找到则 promise 会用 undefined 去 resolve
    .then((res) => {
      if(res !== undefined) {
        return res
      } else {
        // 未匹配用 fetch 直接请求网络资源
        return fetch(event.request).then((res) => {
          const responseClone = res.clone() // 响应只能被用一次，遂克隆响应用于缓存

          caches.open('v1').then((cache) => {
            cache.put(event.request, responseClone) // 缓存响应
          })

          return res
        }).catch(() => { // 提供各种失败的默认回退方案
          return caches.match('/sw-test/gallery/404.jpg')
        })
      }
    })
  )
})