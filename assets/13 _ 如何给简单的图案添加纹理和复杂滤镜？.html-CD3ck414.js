import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-d8EKP-K0.js";const l={};function p(r,s){return i(),a("div",null,s[0]||(s[0]=[e(`<h1 id="_13-如何给简单的图案添加纹理和复杂滤镜" tabindex="-1"><a class="header-anchor" href="#_13-如何给简单的图案添加纹理和复杂滤镜"><span>13 _ 如何给简单的图案添加纹理和复杂滤镜？</span></a></h1><p><audio id="audio" title="13 | 如何给简单的图案添加纹理和复杂滤镜？" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/7e/a7/7ea0b6c1c2c2624016125fd6522f9ea7.mp3"></audio></p><p>你好，我是月影。</p><p>上一课我们讲了两类处理像素的滤镜，分别是颜色滤镜和高斯滤镜。其中，<strong>颜色滤镜是基本的简单滤镜</strong>。因为简单滤镜里的每个像素都是独立的，所以它的处理结果<strong>不依赖于其他像素点的信息</strong>，因此应用起来也比较简单。<strong>而高斯滤镜也就是平滑效果滤镜</strong>，它是最基本的<strong>复杂滤镜</strong>。复杂滤镜的处理结果不仅与当前像素有关，还与其周围的像素点有关，所以应用起来很复杂。</p><p>当然了，颜色滤镜和高斯滤镜能够实现的视觉效果有限。如果想要实现更复杂的视觉效果，我们还需要使用更多其他的滤镜。所以这一节课，我们就来说说，怎么结合不同滤镜实现更复杂的视觉效果。</p><h2 id="其他简单滤镜在canvas中的应用" tabindex="-1"><a class="header-anchor" href="#其他简单滤镜在canvas中的应用"><span>其他简单滤镜在Canvas中的应用</span></a></h2><p>我们知道，简单滤镜的处理效果和像素点的颜色有关。其实，还有一些简单滤镜的处理效果和像素点的坐标、外部环境（比如鼠标位置、时间）有关。这些滤镜虽然也是简单滤镜，但能实现的效果可不简单。让我们来看几个有趣的例子。</p><p><strong>第一个例子，实现图片边缘模糊的效果。</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>import {loadImage, getImageData, traverse} from &#39;./lib/util.js&#39;;</span></span>
<span class="line"><span>const canvas = document.getElementById(&#39;paper&#39;);</span></span>
<span class="line"><span>const context = canvas.getContext(&#39;2d&#39;);</span></span>
<span class="line"><span>(async function () {</span></span>
<span class="line"><span>  const img = await loadImage(&#39;assets/girl1.jpg&#39;);</span></span>
<span class="line"><span>  const imageData = getImageData(img);</span></span>
<span class="line"><span>  traverse(imageData, ({r, g, b, a, x, y}) =&amp;gt; {</span></span>
<span class="line"><span>    const d = Math.hypot((x - 0.5), (y - 0.5));</span></span>
<span class="line"><span>    a *= 1.0 - 2 * d;</span></span>
<span class="line"><span>    return [r, g, b, a];</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>  canvas.width = imageData.width;</span></span>
<span class="line"><span>  canvas.height = imageData.height;</span></span>
<span class="line"><span>  context.putImageData(imageData, 0, 0);</span></span>
<span class="line"><span>}());</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上面代码所示，我们可以在遍历像素点的时候计算当前像素点到图片中心点的距离，然后根据距离设置透明度，这样我们就可以实现下面这样的边缘模糊效果了。</p><img src="https://static001.geekbang.org/resource/image/33/c0/33450156f67efc94d33e6f93ea8b93c0.jpg" alt="" title="边缘模糊效果示意图"><p><strong>第二个，我们可以利用像素处理实现图片融合</strong>。比如说，我们可以给一张照片加上阳光照耀的效果。具体操作就是，把下面这张透明的PNG图片叠加到一张照片上。</p><img src="https://static001.geekbang.org/resource/image/fe/1e/fe66ffff1ff6bd738bbb3ca4e037671e.jpg" alt="" title="纹理"><p>这种能叠加到其他照片上的图片，通常被称为<strong>纹理</strong>（Texture），叠加后的效果也叫做纹理效果。纹理与图片叠加的代码和效果如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>import {loadImage, getImageData, traverse, getPixel} from &#39;./lib/util.js&#39;;</span></span>
<span class="line"><span>import {transformColor, brightness, saturate} from &#39;./lib/color-matrix.js&#39;;</span></span>
<span class="line"><span>const canvas = document.getElementById(&#39;paper&#39;);</span></span>
<span class="line"><span>const context = canvas.getContext(&#39;2d&#39;);</span></span>
<span class="line"><span>(async function () {</span></span>
<span class="line"><span>  const img = await loadImage(&#39;assets/girl1.jpg&#39;);</span></span>
<span class="line"><span>  const sunlight = await loadImage(&#39;assets/sunlight.png&#39;);</span></span>
<span class="line"><span>  const imageData = getImageData(img);</span></span>
<span class="line"><span>  const texture = getImageData(sunlight);</span></span>
<span class="line"><span>  traverse(imageData, ({r, g, b, a, index}) =&amp;gt; {</span></span>
<span class="line"><span>    const texColor = getPixel(texture, index);</span></span>
<span class="line"><span>    return transformColor([r, g, b, a], brightness(1 + 0.7 * texColor[3]), saturate(2 - texColor[3]));</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>  canvas.width = imageData.width;</span></span>
<span class="line"><span>  canvas.height = imageData.height;</span></span>
<span class="line"><span>  context.putImageData(imageData, 0, 0);</span></span>
<span class="line"><span>}());</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><img src="https://static001.geekbang.org/resource/image/5c/71/5cbf83d6217e5a1062e4c8380af85271.jpg" alt="" title="阳光照耀效果图"><p>另外，我们还可以选择不同的图片，来实现不同的纹理叠加效果，比如爆炸效果、水波效果等等。</p><img src="https://static001.geekbang.org/resource/image/2c/7f/2c74538c71c23577a8d87b572335c57f.jpg" alt="" title="爆炸效果图"><p>纹理叠加能实现的效果非常多，所以它也是像素处理中的基础操作。不过，不管我们是用Canvas的ImageData API处理像素、应用滤镜还是纹理合成都有一个弊端，那就是我们必须循环遍历图片上的每个像素点。如果这个图片很大，比如它是2000px宽、2000px高，我们就需要遍历400万像素！这个计算量是相当大的。</p><p>因为在前面的例子中，我们生成的都只是静态的图片效果，所以这个计算量的问题还不明显。一旦我们想要利用像素处理，制作出更酷炫的动态效果，这样的计算量注定会成为性能瓶颈。这该怎么办呢？</p><p>好在，我们还有WebGL这个神器。WebGL通过运行着色器代码来完成图形的绘制和输出。其中，片元着色器负责处理像素点的颜色。那接下来，我们来说说如何用片元着色器处理像素。</p><h2 id="片元着色器是怎么处理像素的" tabindex="-1"><a class="header-anchor" href="#片元着色器是怎么处理像素的"><span>片元着色器是怎么处理像素的？</span></a></h2><p>如果想要在片元着色器中处理像素，我们需要先将图片的数据信息读取出来，交给WebGL程序来处理，这样我们就可以在着色器中处理了。</p><p>那么如何将图片数据信息读取出来呢？在WebGL中，我们会使用特殊的一种对象，叫做<strong>纹理对象</strong>（Texture）。我们将纹理对象作为一种特殊格式的变量，通过uniform传递给着色器，这样就可以在着色器中处理了。</p><p>纹理对象包括了整张图片的所有像素点的颜色信息，在着色器中，我们可以通过纹理坐标来读取对应的具体坐标处像素的颜色信息。纹理坐标是一个变量，类型是二维向量，x、y的值从0到1。在我们前面的课程里已经见过这个变量，就是我们传给顶点着色器的uv属性，对应片元着色器中的vUv变量。</p><p>因此，着色器中是可以加载纹理对象的。具体来说就是，我们先通过图片或者Canvas对象来创建纹理对象，然后通过uniform变量把它传入着色器。这样，我们再通过纹理坐标vUv就可以从加载的纹理对象上获取颜色信息。</p><h3 id="_1-加载纹理" tabindex="-1"><a class="header-anchor" href="#_1-加载纹理"><span>1. 加载纹理</span></a></h3><p>下面，我就详细说说每一步的具体操作。</p><p><strong>首先是创建纹理对象</strong>。这个步骤比较复杂，因为设置不同的参数可以改变我们在Shader中对纹理取色的行为，所以其中最复杂的是参数部分。但在这里我们不需要知道太多，你先记住我在代码里给出的这几个就够了。其他的，如果之后需要用到，你再去参考<a href="https://zhuanlan.zhihu.com/p/68894334" target="_blank" rel="noopener noreferrer">相关的资料</a>就可以了。代码如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>function createTexture(gl, img) {</span></span>
<span class="line"><span>  // 创建纹理对象</span></span>
<span class="line"><span>  const texture = gl.createTexture();</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  // 设置预处理函数，由于图片坐标系和WebGL坐标的Y轴是反的，这个设置可以将图片Y坐标翻转一下</span></span>
<span class="line"><span>  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  // 激活指定纹理单元，WebGL有多个纹理单元，因此在Shader中可以使用多个纹理</span></span>
<span class="line"><span>  gl.activeTexture(gl.TEXTURE0);</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  // 将纹理绑定到当前上下文</span></span>
<span class="line"><span>  gl.bindTexture(gl.TEXTURE_2D, texture);</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  // 指定纹理图像</span></span>
<span class="line"><span>  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  // 设置纹理的一些参数</span></span>
<span class="line"><span>  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);</span></span>
<span class="line"><span>  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);</span></span>
<span class="line"><span>  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>  // 解除纹理绑定</span></span>
<span class="line"><span>  gl.bindTexture(gl.TEXTURE_2D, null);</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  return texture;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>纹理创建完成之后，我们还要<strong>设置纹理</strong>。具体来说就是，通过gl.activeTexture将对象绑定到纹理单元，再把纹理单元编号通过uniform写入shader变量中。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>function setTexture(gl, idx) {</span></span>
<span class="line"><span>  // 激活纹理单元</span></span>
<span class="line"><span>  gl.activeTexture(gl.TEXTURE0 + idx);</span></span>
<span class="line"><span>  // 绑定纹理</span></span>
<span class="line"><span>  gl.bindTexture(gl.TEXTURE_2D, texture);</span></span>
<span class="line"><span>  // 获取shader中纹理变量</span></span>
<span class="line"><span>  const loc = gl.getUniformLocation(program, &#39;tMap&#39;);</span></span>
<span class="line"><span>  // 将对应的纹理单元写入shader变量</span></span>
<span class="line"><span>  gl.uniform1i(loc, idx);</span></span>
<span class="line"><span>  // 解除纹理绑定</span></span>
<span class="line"><span>  gl.bindTexture(gl.TEXTURE_2D, null);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样设置完成之后，我们就可以在Shader中使用纹理对象了。使用的代码如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>uniform sampler2D tMap;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>vec3 color = texture2D(tMap, vUv); // 从纹理中提取颜色，vUv是纹理坐标</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>总的来说，在WebGL中，从创建纹理、设置纹理到使用纹理的步骤非常多，使用上可以说是非常繁琐了。方便起见，这里我们可以直接使用上一节课用过的gl-renderer库。经过gl-renderer库的封装之后，我们通过renderer.loadTexture就可以创建并加载纹理，然后直接将纹理对象本身作为renderer的uniforms属性值即可，就不用去关注其他细节了。具体的操作代码如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>const texture = await renderer.loadTexture(imgURL);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>renderer.uniforms.tMap = texture;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>知道了原理，接下来，我们就一起来动手把图片创建为纹理，然后加载到Shader中去使用吧。</p><p>首先，我们读取图片纹理并加载，代码如下所示。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>const texture = await renderer.loadTexture(&#39;https://p1.ssl.qhimg.com/t01cca5849c98837396.jpg&#39;);</span></span>
<span class="line"><span>renderer.uniforms.tMap = texture;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>renderer.setMeshData([{</span></span>
<span class="line"><span>  positions: [</span></span>
<span class="line"><span>    [-1, -1],</span></span>
<span class="line"><span>    [-1, 1],</span></span>
<span class="line"><span>    [1, 1],</span></span>
<span class="line"><span>    [1, -1],</span></span>
<span class="line"><span>  ],</span></span>
<span class="line"><span>  attributes: {</span></span>
<span class="line"><span>    uv: [</span></span>
<span class="line"><span>      [0, 0],</span></span>
<span class="line"><span>      [0, 1],</span></span>
<span class="line"><span>      [1, 1],</span></span>
<span class="line"><span>      [1, 0],</span></span>
<span class="line"><span>    ],</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>  cells: [[0, 1, 2], [2, 0, 3]],</span></span>
<span class="line"><span>}]);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>renderer.render();</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后，我们直接对纹理对象取色。对应的片元着色器代码如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uniform sampler2D tMap;</span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>    gl_FragColor = texture2D(tMap, vUv);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在片元着色器中，我们使用texture2D函数来获取纹理的颜色。这个函数支持两个参数，一个是纹理单元的uniform变量，另一个是要获取像素的坐标，这个坐标就是我们之前用过的uv纹理坐标。在这个片元着色器代码里，我们只是根据vUv坐标将纹理图片上对应的颜色取出来，其他什么也没做，所以画布上最终呈现出来的还是原始图片。</p><img src="https://static001.geekbang.org/resource/image/d2/36/d22c3ff49fd473b4cb6b52f036542a36.jpg" alt=""><h3 id="_2-实现滤镜" tabindex="-1"><a class="header-anchor" href="#_2-实现滤镜"><span>2. 实现滤镜</span></a></h3><p>加载完纹理之后，我们就可以在它的基础上实现滤镜了。用Shader实现滤镜的方法也很简单，为了方便你理解，这次我们就只实现图片灰度化。我们可以在前面加载纹理的基础上，引入颜色矩阵，修改后的片元着色器代码如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uniform sampler2D tMap;</span></span>
<span class="line"><span>uniform mat4 colorMatrix;</span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>    vec4 color = texture2D(tMap, vUv);</span></span>
<span class="line"><span>    gl_FragColor = colorMatrix * vec4(color.rgb, 1.0);</span></span>
<span class="line"><span>    gl_FragColor.a = color.a;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后，你可以把这段代码和我们刚才加载纹理的代码做个比较。你会发现，刚才我们只是简单地把color从纹理坐标中取出，直接把它设置给gl_FragColor。而现在，我们在设置gl_FragColor的时候，是先把颜色和colorMatrix相乘。这样其实就相当于是对颜色向量做了一个仿射变换。</p><p>对应地，我们修改一下前面的JavaScript代码。其中最主要的修改操作，就是通过uniform引入了一个colorMatrix。修改后的代码如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>const texture = await renderer.loadTexture(&#39;https://p1.ssl.qhimg.com/t01cca5849c98837396.jpg&#39;);</span></span>
<span class="line"><span>renderer.uniforms.tMap = texture;</span></span>
<span class="line"><span>const r = 0.2126,</span></span>
<span class="line"><span>  g = 0.7152,</span></span>
<span class="line"><span>  b = 0.0722;</span></span>
<span class="line"><span>renderer.uniforms.colorMatrix = [</span></span>
<span class="line"><span>  r, r, r, 0,</span></span>
<span class="line"><span>  g, g, g, 0,</span></span>
<span class="line"><span>  b, b, b, 0,</span></span>
<span class="line"><span>  0, 0, 0, 1,</span></span>
<span class="line"><span>];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>renderer.setMeshData([{</span></span>
<span class="line"><span>  positions: [</span></span>
<span class="line"><span>    [-1, -1],</span></span>
<span class="line"><span>    [-1, 1],</span></span>
<span class="line"><span>    [1, 1],</span></span>
<span class="line"><span>    [1, -1],</span></span>
<span class="line"><span>  ],</span></span>
<span class="line"><span>  attributes: {</span></span>
<span class="line"><span>    uv: [</span></span>
<span class="line"><span>      [0, 0],</span></span>
<span class="line"><span>      [0, 1],</span></span>
<span class="line"><span>      [1, 1],</span></span>
<span class="line"><span>      [1, 0],</span></span>
<span class="line"><span>    ],</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>  cells: [[0, 1, 2], [2, 0, 3]],</span></span>
<span class="line"><span>}]);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>renderer.render();</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>还记得吗？上一节课我们也实现了一个颜色矩阵，那它们有什么区别呢？区别主要有两个。</p><p>首先，上一节课的颜色矩阵是一个4<strong>5的矩阵，但是因为GLSL语法在数据类型上不能直接支持mat4（4</strong>4）以上的矩阵，所以我们要计算4*5矩阵很不方便。而且在通常情况下，我们不经常处理颜色的alpha值，所以这里我就把alpha通道忽略了，只对RGB做矩阵变换，这样我们用mat4的齐次矩阵就够了。</p><p>其次，根据标准的矩阵与向量乘法的法则，应该是向量与矩阵的列相乘，所以我把这次传入的矩阵转置了一下，把按行排列的rgba换成按列排列，就得到了下面这个矩阵。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>renderer.uniforms.colorMatrix = [</span></span>
<span class="line"><span>  r, r, r, 0,</span></span>
<span class="line"><span>  g, g, g, 0,</span></span>
<span class="line"><span>  b, b, b, 0,</span></span>
<span class="line"><span>  0, 0, 0, 1,</span></span>
<span class="line"><span>];</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样，我们就实现了与上一节课一样的图片灰度化的功能，它是使用片元着色器实现的，在性能上要远远高于Canvas2D。</p><h3 id="_3-实现图片的粒子化" tabindex="-1"><a class="header-anchor" href="#_3-实现图片的粒子化"><span>3. 实现图片的粒子化</span></a></h3><p>不过，用Shader只处理颜色滤镜就有些大材小用了，利用Shader的高性能我们可以实现一些更加复杂的效果，比如，给图片实现一个粒子化的渐显效果。如下图所示：</p><img src="https://static001.geekbang.org/resource/image/02/ea/02df04608e76c0920ac9ef1525c42aea.gif" alt=""><p>这个视觉效果如果在Canvas2D中实现，需要大量的运算，非常耗费性能，几乎不太可能流畅地运行起来，但是在WebGL的Shader中就可以轻松做到。究竟是怎么做到的呢？</p><p>我们重点来看一下Fragment Shader的代码。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uniform sampler2D tMap;</span></span>
<span class="line"><span>uniform float uTime;</span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>float random (vec2 st) {</span></span>
<span class="line"><span>    return fract(sin(dot(st.xy,</span></span>
<span class="line"><span>                        vec2(12.9898,78.233)))*</span></span>
<span class="line"><span>        43758.5453123);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>    vec2 st = vUv * vec2(100, 55.4);</span></span>
<span class="line"><span>    vec2 uv = vUv + 1.0 - 2.0 * random(floor(st));</span></span>
<span class="line"><span>    vec4 color = texture2D(tMap, mix(uv, vUv, min(uTime, 1.0)));</span></span>
<span class="line"><span>    gl_FragColor.rgb = color.rgb;</span></span>
<span class="line"><span>    gl_FragColor.a = color.a * uTime;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这段代码虽然不长，但如果你还不太熟悉Shader，可能一眼看去，很难直接了解具体的作用，不要紧，我们一步一步来看。</p><p>首先，我们使用第11节课学过的重复网格技巧，将图形网格化。因为原始图像的图片像素宽高是1000px和554px，所以我们用 vec2 st = vUv * vec2(100, 55.4) 就可以得到10px X 10px大小的网格。</p><p>然后，我们再用伪随机函数random 根据网格随机一个偏移量，因为这个偏移量是0<sub>1之间的值，我们将它乘以2再用1减去它，就能得到一个范围在-1</sub>1之间的随机偏移。这样我们从纹理取色的时候，不是直接从对应的纹理坐标vUv处取色，而是从这个随机偏移的位置取色，就能保证取出来的颜色就是一个乱序的色值。这时候，图片显示的效果是一片随机的画面：</p><img src="https://static001.geekbang.org/resource/image/20/3d/20dc4c07e075da18a44975142e79913d.jpg" alt=""><p>接着，我们引入uTime变量，用mix函数对偏移后的uv和原始的vUv相对于时间变化进行插值。当初始时间为0的时候，取色从uv取；当时间超过一个周期的时候，取色从vUv取；当时间在中间时，取值介于uv和vUv之间。</p><p>最后，我们再把uTime也和透明度关联起来。这样就实现了你上面看到的粒子化的渐显效果。</p><p>当然，这个效果做得其实还比较粗糙，因为我们引入的变量比较少，在后续的课程中，我们会一步一步深入，继续实现更加惊艳的效果。在课后，你也可以试着实现其他的效果，然后把你的成果分享出来。</p><h3 id="_4-实现图像合成" tabindex="-1"><a class="header-anchor" href="#_4-实现图像合成"><span>4. 实现图像合成</span></a></h3><p>除此之外，Fragment Shader还可以引入多纹理，让我们可以很方便地实现图像合成。比如说，对于在电影场景合成中比较常用的绿幕图片，我们就可以使用shader技术把它实时地合成到其他的图像上。</p><p>举个例子，假设我们有一只猫的绿幕图片：</p><p>举个例子，现在我们有一张带有猫的绿幕图片。</p><img src="https://static001.geekbang.org/resource/image/20/cc/20febddf9e1edbb9e7bd349e544f24cc.jpg" alt="" title="带有猫的绿幕图片"><p>我们要通过Fragment Shader将它合成到“高尔夫”那张照片上，具体的shader代码如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uniform sampler2D tMap;</span></span>
<span class="line"><span>uniform sampler2D tCat;</span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>    vec4 color = texture2D(tMap, vUv);</span></span>
<span class="line"><span>    vec2 st = vUv * 3.0 - vec2(1.2, 0.5);</span></span>
<span class="line"><span>    vec4 cat = texture2D(tCat, st);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    gl_FragColor.rgb = cat.rgb;</span></span>
<span class="line"><span>    if(cat.r &amp;lt; 0.5 &amp;amp;&amp;amp; cat.g &amp;gt; 0.6) {</span></span>
<span class="line"><span>      gl_FragColor.rgb = color.rgb;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    gl_FragColor.a = color.a;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上面的代码所示，我们可以先通过tCat纹理获取绿幕图片。如果RGB通道中的G通道超过阈值，且R通道低于阈值，我们就可以接着把猫的图像从纹理中定位出来。然后经过缩放和平移变换等操作，我们就能把它放置到画面中适当的位置。</p><img src="https://static001.geekbang.org/resource/image/d2/dc/d2d1aacc6cc7c7c6a19c24ea821564dc.jpg" alt=""><h2 id="要点总结" tabindex="-1"><a class="header-anchor" href="#要点总结"><span>要点总结</span></a></h2><p>今天，我们讨论了边缘模糊和纹理叠加这两种滤镜，并且重点学习了用Shader加载纹理和实现滤镜的方法。</p><p>首先，我们知道了什么是边缘模糊，边缘模糊很容易实现，只要我们在遍历像素点的时候，同时计算当前像素点到图片中心点的距离，然后根据距离设置透明度，就可以实现边缘模糊的效果。</p><p>然后， 我们重点讲了Shader中的纹理叠加滤镜。</p><p>要实现这个滤镜，我们要先加载纹理，获取纹理的颜色。用Shader加载纹理的过程比较复杂，但我们可以使用一些封装好的库，如gl-renderer来简化纹理的加载。那在获取纹理的颜色的时候，我们可以通过texture2D函数读取纹理单元对应的uv坐标处的像素颜色。</p><p>加载了纹理之后呢，我们就可以通过纹理结合滤镜函数来处理像素，这就是纹理滤镜的应用场景了。通过纹理滤镜，我们不仅可以实现灰度化图片，还可以图片的粒子化渐显等等更加复杂的效果</p><p>除此之外，我们还可以使用shader加载多个纹理图片，把它们的颜色按照不同的方式进行叠加，从而实现图像合成。图像合成虽然在可视化中使用得比较少，但它非常适合用来实现一些特殊的视觉效果。</p><h2 id="小试牛刀" tabindex="-1"><a class="header-anchor" href="#小试牛刀"><span>小试牛刀</span></a></h2><p>你可以完善一下片元着色器中的颜色滤镜函数，实现灰度效果以外的效果吗？</p><p>上节课，我们用Canvas2D实现了平滑效果滤镜，其实我们也可以用Fragment Shader结合纹理的形式把它实现出来，你能做到吗？</p><p>如果我们想让一个图片的某个局部呈现“马赛克”效果，该用什么滤镜？你能把它实现出来吗？</p><h2 id="欢迎在留言区和我讨论-分享你的答案和思考-也欢迎你把这节课分享给你的朋友-我们下节课见" tabindex="-1"><a class="header-anchor" href="#欢迎在留言区和我讨论-分享你的答案和思考-也欢迎你把这节课分享给你的朋友-我们下节课见"><span>欢迎在留言区和我讨论，分享你的答案和思考，也欢迎你把这节课分享给你的朋友，我们下节课见！</span></a></h2><h2 id="源码" tabindex="-1"><a class="header-anchor" href="#源码"><span>源码</span></a></h2><p><a href="https://github.com/akira-cn/graphics/tree/master/pixels-shader" target="_blank" rel="noopener noreferrer">课程示例代码</a></p><h2 id="推荐阅读" tabindex="-1"><a class="header-anchor" href="#推荐阅读"><span>推荐阅读</span></a></h2><p><a href="https://zhuanlan.zhihu.com/p/68894334" target="_blank" rel="noopener noreferrer">Texture的参数设置参考文档</a></p>`,92)]))}const t=n(l,[["render",p]]),v=JSON.parse('{"path":"/posts/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/%E8%A7%86%E8%A7%89%E5%9F%BA%E7%A1%80%E7%AF%87/13%20_%20%E5%A6%82%E4%BD%95%E7%BB%99%E7%AE%80%E5%8D%95%E7%9A%84%E5%9B%BE%E6%A1%88%E6%B7%BB%E5%8A%A0%E7%BA%B9%E7%90%86%E5%92%8C%E5%A4%8D%E6%9D%82%E6%BB%A4%E9%95%9C%EF%BC%9F.html","title":"13 _ 如何给简单的图案添加纹理和复杂滤镜？","lang":"zh-CN","frontmatter":{"description":"13 _ 如何给简单的图案添加纹理和复杂滤镜？ 你好，我是月影。 上一课我们讲了两类处理像素的滤镜，分别是颜色滤镜和高斯滤镜。其中，颜色滤镜是基本的简单滤镜。因为简单滤镜里的每个像素都是独立的，所以它的处理结果不依赖于其他像素点的信息，因此应用起来也比较简单。而高斯滤镜也就是平滑效果滤镜，它是最基本的复杂滤镜。复杂滤镜的处理结果不仅与当前像素有关，还与...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/interview/posts/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/%E8%A7%86%E8%A7%89%E5%9F%BA%E7%A1%80%E7%AF%87/13%20_%20%E5%A6%82%E4%BD%95%E7%BB%99%E7%AE%80%E5%8D%95%E7%9A%84%E5%9B%BE%E6%A1%88%E6%B7%BB%E5%8A%A0%E7%BA%B9%E7%90%86%E5%92%8C%E5%A4%8D%E6%9D%82%E6%BB%A4%E9%95%9C%EF%BC%9F.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"13 _ 如何给简单的图案添加纹理和复杂滤镜？"}],["meta",{"property":"og:description","content":"13 _ 如何给简单的图案添加纹理和复杂滤镜？ 你好，我是月影。 上一课我们讲了两类处理像素的滤镜，分别是颜色滤镜和高斯滤镜。其中，颜色滤镜是基本的简单滤镜。因为简单滤镜里的每个像素都是独立的，所以它的处理结果不依赖于其他像素点的信息，因此应用起来也比较简单。而高斯滤镜也就是平滑效果滤镜，它是最基本的复杂滤镜。复杂滤镜的处理结果不仅与当前像素有关，还与..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-08-16T11:19:38.000Z"}],["meta",{"property":"article:modified_time","content":"2025-08-16T11:19:38.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"13 _ 如何给简单的图案添加纹理和复杂滤镜？\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-08-16T11:19:38.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1755343178000,"updatedTime":1755343178000,"contributors":[{"name":"bbhou","username":"bbhou","email":"1557740299@qq.com","commits":1,"url":"https://github.com/bbhou"}]},"readingTime":{"minutes":14.97,"words":4491},"filePathRelative":"posts/跟月影学可视化/视觉基础篇/13 _ 如何给简单的图案添加纹理和复杂滤镜？.md","localizedDate":"2025年8月16日","excerpt":"\\n<p><audio id=\\"audio\\" title=\\"13 | 如何给简单的图案添加纹理和复杂滤镜？\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/7e/a7/7ea0b6c1c2c2624016125fd6522f9ea7.mp3\\"></audio></p>\\n<p>你好，我是月影。</p>\\n<p>上一课我们讲了两类处理像素的滤镜，分别是颜色滤镜和高斯滤镜。其中，<strong>颜色滤镜是基本的简单滤镜</strong>。因为简单滤镜里的每个像素都是独立的，所以它的处理结果<strong>不依赖于其他像素点的信息</strong>，因此应用起来也比较简单。<strong>而高斯滤镜也就是平滑效果滤镜</strong>，它是最基本的<strong>复杂滤镜</strong>。复杂滤镜的处理结果不仅与当前像素有关，还与其周围的像素点有关，所以应用起来很复杂。</p>","autoDesc":true}');export{t as comp,v as data};
