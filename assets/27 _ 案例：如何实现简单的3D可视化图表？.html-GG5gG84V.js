import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-d8EKP-K0.js";const p={};function l(r,s){return i(),a("div",null,s[0]||(s[0]=[e(`<h1 id="_27-案例-如何实现简单的3d可视化图表" tabindex="-1"><a class="header-anchor" href="#_27-案例-如何实现简单的3d可视化图表"><span>27 _ 案例：如何实现简单的3D可视化图表？</span></a></h1><p><audio id="audio" title="27 | 案例：如何实现简单的3D可视化图表？" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/74/2d/746f5738218ee0fd28dbc901b128fb2d.mp3"></audio></p><p>你好，我是月影。</p><p>学了这么多图形学的基础知识和WebGL的视觉呈现技术，你一定已经迫不及待地想要开始实战了吧？今天，我带你完成一个小型的可视化项目，带你体会一下可视化开发的全过程。也正好借此机会，复习一下我们前面学过的全部知识。</p><p>这节课，我们要带你完成一个<strong>GitHub贡献图表的可视化作品</strong>。GitHub贡献图表是一个统计表，它统计了我们在GitHub中提交开源项目代码的次数。我们可以在GitHub账号信息的个人详情页中找到它。</p><p>下图中的红框部分就是我的贡献图表。你会看到，GitHub默认的贡献图表可视化展现是二维的，那我们要做的，就是把它改造为简单的动态3D柱状图表。</p><img src="https://static001.geekbang.org/resource/image/4a/0b/4a44441b2431ce98d6139b89ae16f70b.jpg" alt="" title="GitHub默认的贡献图表可视化展现示意图"><h2 id="第一步-准备要展现的数据" tabindex="-1"><a class="header-anchor" href="#第一步-准备要展现的数据"><span>第一步：准备要展现的数据</span></a></h2><p>想要实现可视化图表，第一步就是准备数据。GitHub上有第三方API可以获得指定用户的GitHub贡献数据，具体可以看<a href="https://github.com/sallar/github-contributions-api" target="_blank" rel="noopener noreferrer">这个项目</a>。</p><p>通过API，我们可以事先保存好一份JSON格式的数据，具体的格式和内容大致如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>// github_contributions_akira-cn.json</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &amp;quot;contributions&amp;quot;: [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &amp;quot;date&amp;quot;: &amp;quot;2020-06-12&amp;quot;,</span></span>
<span class="line"><span>      &amp;quot;count&amp;quot;: 1,</span></span>
<span class="line"><span>      &amp;quot;color&amp;quot;:&amp;quot;#c6e48b&amp;quot;,</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>  ],</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从这份JSON文件中，我们可以取出每一天的提交次数count，以及一个颜色数据color。每天提交的次数越多，颜色就越深。有了这份数据内容，我们就可以着手实现具体的展现了。不过，因为数据很多，所以这次我们只想展现最近一年的数据。我们可以写一个函数，根据传入的时间对数据进行过滤。</p><p>这个函数的代码如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>let cache = null;</span></span>
<span class="line"><span>async function getData(toDate = new Date()) {</span></span>
<span class="line"><span>  if(!cache) {</span></span>
<span class="line"><span>    const data = await (await fetch(&#39;../assets/github_contributions_akira-cn.json&#39;)).json();</span></span>
<span class="line"><span>    cache = data.contributions.map((o) =&amp;gt; {</span></span>
<span class="line"><span>      o.date = new Date(o.date.replace(/-/g, &#39;/&#39;));</span></span>
<span class="line"><span>      return o;</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 要拿到 toData 日期之前大约一年的数据（52周）</span></span>
<span class="line"><span>  let start = 0,</span></span>
<span class="line"><span>    end = cache.length;</span></span>
<span class="line"><span>  // 用二分法查找</span></span>
<span class="line"><span>  while(start &amp;lt; end - 1) {</span></span>
<span class="line"><span>    const mid = Math.floor(0.5 * (start + end));</span></span>
<span class="line"><span>    const {date} = cache[mid];</span></span>
<span class="line"><span>    if(date &amp;lt;= toDate) end = mid;</span></span>
<span class="line"><span>    else start = mid;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 获得对应的一年左右的数据</span></span>
<span class="line"><span>  let day;</span></span>
<span class="line"><span>  if(end &amp;gt;= cache.length) {</span></span>
<span class="line"><span>    day = toDate.getDay();</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>    const lastItem = cache[end];</span></span>
<span class="line"><span>    day = lastItem.date.getDay();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 根据当前星期几，再往前拿52周的数据</span></span>
<span class="line"><span>  const len = 7 * 52 + day + 1;</span></span>
<span class="line"><span>  const ret = cache.slice(end, end + len);</span></span>
<span class="line"><span>  if(ret.length &amp;lt; len) {</span></span>
<span class="line"><span>    // 日期超过了数据范围，补齐数据</span></span>
<span class="line"><span>    const pad = new Array(len - ret.length).fill({count: 0, color: &#39;#ebedf0&#39;});</span></span>
<span class="line"><span>    ret.push(...pad);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return ret;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个函数的逻辑是，先从JSON文件中读取数据并缓存起来，然后传入对应的日期对象，获取该日期之前大约一年的数据（准确来说是该日期的前52周数据，再加上该日期当前周直到该日期为止的数据，公式为 7*52 + day + 1）。</p><p>这样，我们就准备好了要用来展现的数据。</p><h2 id="第二步-用spritejs渲染数据、完成绘图" tabindex="-1"><a class="header-anchor" href="#第二步-用spritejs渲染数据、完成绘图"><span>第二步：用SpriteJS渲染数据、完成绘图</span></a></h2><p>有了数据之后，接下来我们就要把数据渲染出来，完成绘图。这里，我们要用到一个新的JavaScript库SpriteJS来绘制。</p><p>既然如此，我们先来熟悉一下SpriteJS库。</p><p><a href="https://spritejs.org/#/" target="_blank" rel="noopener noreferrer">SpriteJS</a>是基于WebGL的图形库，也是我设计和维护的开源可视化图形渲染引擎项目。它是一个支持树状元素结构的渲染库。也就是说，它和我们前端操作DOM类似，通过将元素一一添加到渲染树上，就可以完成最终的渲染。所以在后续的课程中，我们也会更多地用到它。</p><p>我们要用到的是SpriteJS的3D部分，它是基于我们熟悉的OGL库实现的。那我们为什么不直接用OGL库呢？这是因为SpriteJS在OGL的基础上，对几何体元素进行了类似DOM元素的封装。这样我们创建几何体元素就可以像操作DOM一样方便了，直接用d3库的selection子模块来操作就可以了。</p><h3 id="_1-创建scene对象" tabindex="-1"><a class="header-anchor" href="#_1-创建scene对象"><span>1. 创建Scene对象</span></a></h3><p>像DOM有documentElement作为根元素一样，SpriteJS也有根元素。SpriteJS的根元素是一个Scene对象，对应一个DOM元素作为容器。更形象点来说，我们可以把Scene理解为一个“场景”。那SpriteJS中渲染图形，都要在这个“场景”中进行。</p><p>接下来，我们就创建一个Scene对象，代码如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>const container = document.getElementById(&#39;stage&#39;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const scene = new Scene({</span></span>
<span class="line"><span>  container,</span></span>
<span class="line"><span>  displayRatio: 2,</span></span>
<span class="line"><span>});</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建Scene对象，我们需要两个参数。一个参数是container，它是一个HTML元素，在这里是一个id为stage的元素，这个元素会作为SpriteJS的容器元素，之后SpriteJS会在这个元素上创建Canvas子元素。</p><p>第二个参数是displayRatio，这个参数是用来设置显示分辨率的。你应该还记得，在讲Canvas绘图的时候，我们提到过，为了让绘制出来的图形能够适配不同的显示设备，我们要把Canvas的像素宽高和CSS样式宽高设置成不同的值。所以这里，我们把displayRatio设为2，就可以让像素宽高是CSS样式宽高的2倍，对于一些像素密度为2的设备（如iPhone的屏幕），这么设置才不会让画布上绘制的图片、文字变得模糊。</p><h3 id="_2-创建layer对象" tabindex="-1"><a class="header-anchor" href="#_2-创建layer对象"><span>2. 创建Layer对象</span></a></h3><p>有了scene对象，我们再创建一个或多个Layer对象，也可以理解为是一个或者多个“图层”。在SpriteJS中，一个Layer对象就对应于一个Canvas画布。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>const layer = scene.layer3d(&#39;fglayer&#39;, {</span></span>
<span class="line"><span>  camera: {</span></span>
<span class="line"><span>    fov: 35,</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span>layer.camera.attributes.pos = [2, 6, 9];</span></span>
<span class="line"><span>layer.camera.lookAt([0, 0, 0]);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上面代码所示，我们通过调用scene.layer3d方法，就可以在scene对象上创建了一个3D（WebGL）上下文的Canvas画布。而且这里，我们把相机的视角设置为35度，坐标位置为（2, 6, 9），相机朝向坐标原点。</p><h3 id="_3-将数据转换成柱状元素" tabindex="-1"><a class="header-anchor" href="#_3-将数据转换成柱状元素"><span>3. 将数据转换成柱状元素</span></a></h3><p>接着，我们就要把数据转换成画布上的长方体元素。我们可以借助<a href="https://github.com/d3/d3-selection" target="_blank" rel="noopener noreferrer">d3-selection</a>，d3是一个数据驱动文档的模型，d3-selection能够通过数据操作文档树，添加元素节点。当然，在使用d3-selection添加元素前，我们要先创建用来3D展示的WebGL程序。</p><p>因为SpriteJS提供了一些预置的着色器，比如shaders.GEOMETRY着色器，就是默认支持phong反射模型的一组着色器，我们直接调用它就可以了。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>const program = layer.createProgram({</span></span>
<span class="line"><span>  vertex: shaders.GEOMETRY.vertex,</span></span>
<span class="line"><span>  fragment: shaders.GEOMETRY.fragment,</span></span>
<span class="line"><span>});</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建好WebGL程序之后，我们就可以获取数据，用数据来操作文档树了。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>const dataset = await getData();</span></span>
<span class="line"><span>const max = d3.max(dataset, (a) =&amp;gt; {</span></span>
<span class="line"><span>  return a.count;</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* globals d3 */</span></span>
<span class="line"><span>const selection = d3.select(layer);</span></span>
<span class="line"><span>const chart = selection.selectAll(&#39;cube&#39;)</span></span>
<span class="line"><span>  .data(dataset)</span></span>
<span class="line"><span>  .enter()</span></span>
<span class="line"><span>  .append(() =&amp;gt; {</span></span>
<span class="line"><span>    return new Cube(program);</span></span>
<span class="line"><span>  })</span></span>
<span class="line"><span>  .attr(&#39;width&#39;, 0.14)</span></span>
<span class="line"><span>  .attr(&#39;depth&#39;, 0.14)</span></span>
<span class="line"><span>  .attr(&#39;height&#39;, 1)</span></span>
<span class="line"><span>  .attr(&#39;scaleY&#39;, (d) =&amp;gt; {</span></span>
<span class="line"><span>    return d.count / max;</span></span>
<span class="line"><span>  })</span></span>
<span class="line"><span>  .attr(&#39;pos&#39;, (d, i) =&amp;gt; {</span></span>
<span class="line"><span>    const x0 = -3.8 + 0.0717 + 0.0015;</span></span>
<span class="line"><span>    const z0 = -0.5 + 0.05 + 0.0015;</span></span>
<span class="line"><span>    const x = x0 + 0.143 * Math.floor(i / 7);</span></span>
<span class="line"><span>    const z = z0 + 0.143 * (i % 7);</span></span>
<span class="line"><span>    return [x, 0.5 * d.count /max, z];</span></span>
<span class="line"><span>  })</span></span>
<span class="line"><span>  .attr(&#39;colors&#39;, (d, i) =&amp;gt; {</span></span>
<span class="line"><span>    return d.color;</span></span>
<span class="line"><span>  });</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上面代码所示，我们先通过d3.select(layer)对象获得一个selection对象，再通过getData()获得数据，接着通过selection.selectAll(‘cube’).data(dataset).enter().append(…)遍历数据，创建元素节点。</p><p>这里，我们创建了Cube元素，就是长方体在SpriteJS中对应的对象，然后让dataset的每一条记录对应一个Cube元素，接着我们还要设置每个Cube元素的样式，让数据进入cube以后，能体现出不同的形状。</p><p>具体来说，我们要设置长方体Cube的长(width)、宽(depth)、高(height)属性，以及y轴的缩放(scaleY)，还有Cube的位置(pos)坐标和长方体的颜色(colors)。其中与数据有关的参数是scaleY、pos和colors，我就来详细说说它们。</p><p>对于scaleY，我们把它设置为d.count与max的比值。这里的max是指一年的提交记录中，提交代码最多那天的数值。这样，我们就可以保证scaleY的值在0~1之间，既不会太小、也不会太大。这种用相对数值来做可视化展现的做法，是可视化处理数据的一种常用基础技巧，在数据篇我们还会深入去讲。</p><p>而pos是根据数据的索引设置x和z来决定的。由于Cube的坐标基于中心点对齐的，现在我们想让它们变成底部对齐，所以需要把y设置为d.count/max的一半。</p><p>最后，我们再根据数据中的color值设置Cube的颜色。这样，我们通过数据将元素添加之后，画布上渲染出来的结果就是一个3D柱状图了，效果如下：</p><img src="https://static001.geekbang.org/resource/image/0c/a6/0c7a265e05d79336fc5a045dd6b3c0a6.gif" alt=""><h2 id="第三步-补充细节-实现更好的视觉效果" tabindex="-1"><a class="header-anchor" href="#第三步-补充细节-实现更好的视觉效果"><span>第三步：补充细节，实现更好的视觉效果</span></a></h2><p>现在这个3D柱状图，还很粗糙。我们可以在此基础上，增加一些视觉上的细节效果。比如说，我们可以给这个柱状图添加光照。比如，我们可以修改环境光，把颜色设置成(0.5, 0.5, 0.5, 1)，再添加一道白色的平行光，方向是(-3, -3, -1)。这样的话，柱状图就会有光照效果了。具体的代码和效果图如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>const layer = scene.layer3d(&#39;fglayer&#39;, {</span></span>
<span class="line"><span>  ambientColor: [0.5, 0.5, 0.5, 1],</span></span>
<span class="line"><span>  camera: {</span></span>
<span class="line"><span>    fov: 35,</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span>layer.camera.attributes.pos = [2, 6, 9];</span></span>
<span class="line"><span>layer.camera.lookAt([0, 0, 0]);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const light = new Light({</span></span>
<span class="line"><span>  direction: [-3, -3, -1],</span></span>
<span class="line"><span>  color: [1, 1, 1, 1],</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layer.addLight(light);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><img src="https://static001.geekbang.org/resource/image/0e/fb/0e9764123667yy18329ef01a4a6771fb.gif" alt=""><p>除此之外，我们还可以给柱状图增加一个底座，代码和效果图如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>const fragment = \`</span></span>
<span class="line"><span>  precision highp float;</span></span>
<span class="line"><span>  precision highp int;</span></span>
<span class="line"><span>  varying vec4 vColor;</span></span>
<span class="line"><span>  varying vec2 vUv;</span></span>
<span class="line"><span>  void main() {</span></span>
<span class="line"><span>    float x = fract(vUv.x * 53.0);</span></span>
<span class="line"><span>    float y = fract(vUv.y * 7.0);</span></span>
<span class="line"><span>    x = smoothstep(0.0, 0.1, x) - smoothstep(0.9, 1.0, x);</span></span>
<span class="line"><span>    y = smoothstep(0.0, 0.1, y) - smoothstep(0.9, 1.0, y);</span></span>
<span class="line"><span>    gl_FragColor = vColor * (x + y);</span></span>
<span class="line"><span>  }    </span></span>
<span class="line"><span>\`;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const axisProgram = layer.createProgram({</span></span>
<span class="line"><span>  vertex: shaders.TEXTURE.vertex,</span></span>
<span class="line"><span>  fragment,</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const ground = new Cube(axisProgram, {</span></span>
<span class="line"><span>  width: 7.6,</span></span>
<span class="line"><span>  height: 0.1,</span></span>
<span class="line"><span>  y: -0.049, // not 0.05 to avoid z-fighting</span></span>
<span class="line"><span>  depth: 1,</span></span>
<span class="line"><span>  colors: &#39;rgba(0, 0, 0, 0.1)&#39;,</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layer.append(ground);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><img src="https://static001.geekbang.org/resource/image/b1/ce/b1c0dec29b6e6b16c4d86e786f7d12ce.gif" alt=""><p>上面的代码不复杂，我想重点解释其中两处。首先是片元着色器代码，我们使用了根据纹理坐标来实现重复图案的技术。这个方法和我们<a href="https://time.geekbang.org/column/article/262330" target="_blank" rel="noopener noreferrer">第11节课</a>说的思路完全一样，如果你对这个方法感到陌生了，可以回到前面复习一下。</p><p>其次，我们将底座的高度设置为0.1，y的值本来应该是-0.1的一半，也就是-0.05，但是我们设置为了-0.049。少了0.001是为了让上层的柱状图稍微“嵌入”到底座里，从而避免因为底座上部和柱状图底部的z坐标一样，导致渲染的时候由于次序问题出现闪烁，这个问题在图形学术语里面有一个名字叫做z-fighting。</p><img src="https://static001.geekbang.org/resource/image/9d/f8/9da3bdd37c5e269b551b63b8ac7510f8.gif" alt="" title="z-fighting 现象"><p>z-fighting是3D绘图中的一个常见问题，所以我再多解释一下。在WebGL中绘制3D物体，一般我们开启了深度检测之后，引擎会自动计算3D物体的深度，让离观察者很近的物体面，把离观察者比较远和背对着观察者的物体面遮挡住。那具体是怎么遮挡的呢？其实是根据物体在相机空间中的z坐标来判断的。</p><p>但有一种特殊情况，就是两个面的z坐标相同，又有重叠的部分。这时候，引擎就可能一会儿先渲染A面，过一会儿又先去渲染B面，这样渲染出来的内容就出现了“闪烁”现象，这就是z-fighting。</p><img src="https://static001.geekbang.org/resource/image/37/8c/3718a4e779004624f44ce952923c348c.jpg" alt="" title="如果A和B深度（z坐标）相同，那么A、B重叠部分渲染次序可能每次不同，从而产生z-fighting"><p>z-fighting有很多解决方法，比如可以人为指定一下几何体渲染的次序，或者，就是让它们的坐标不要完全相同，在上面的例子里，我们就采用了让坐标不完全相同的处理办法。</p><p>最后，为了让实现出来的图形更有趣，我们再增加一个过渡动画，让柱状图的高度从不显示，到慢慢显示出来。</p><img src="https://static001.geekbang.org/resource/image/88/08/887d3e8b4e356b9139934eee7bb70c08.gif" alt=""><p>要实现这个效果，我们需要稍微修改一下d3.selection的代码。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>  const chart = selection.selectAll(&#39;cube&#39;)</span></span>
<span class="line"><span>    .data(dataset)</span></span>
<span class="line"><span>    .enter()</span></span>
<span class="line"><span>    .append(() =&amp;gt; {</span></span>
<span class="line"><span>      return new Cube(program);</span></span>
<span class="line"><span>    })</span></span>
<span class="line"><span>    .attr(&#39;width&#39;, 0.14)</span></span>
<span class="line"><span>    .attr(&#39;depth&#39;, 0.14)</span></span>
<span class="line"><span>    .attr(&#39;height&#39;, 1)</span></span>
<span class="line"><span>    .attr(&#39;scaleY&#39;, 0.001)</span></span>
<span class="line"><span>    .attr(&#39;pos&#39;, (d, i) =&amp;gt; {</span></span>
<span class="line"><span>      const x0 = -3.8 + 0.0717 + 0.0015;</span></span>
<span class="line"><span>      const z0 = -0.5 + 0.05 + 0.0015;</span></span>
<span class="line"><span>      const x = x0 + 0.143 * Math.floor(i / 7);</span></span>
<span class="line"><span>      const z = z0 + 0.143 * (i % 7);</span></span>
<span class="line"><span>      return [x, 0, z];</span></span>
<span class="line"><span>    })</span></span>
<span class="line"><span>    .attr(&#39;colors&#39;, (d, i) =&amp;gt; {</span></span>
<span class="line"><span>      return d.color;</span></span>
<span class="line"><span>    });</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上面代码所示，我们先把scaleY直接设为0.001，然后我们用d3.scaleLinear来创建一个线性的缩放过程，最后，我们通过chart.trainsition来实现这个线性动画。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>const linear = d3.scaleLinear()</span></span>
<span class="line"><span>  .domain([0, max])</span></span>
<span class="line"><span>  .range([0, 1.0]);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>chart.transition()</span></span>
<span class="line"><span>  .duration(2000)</span></span>
<span class="line"><span>  .attr(&#39;scaleY&#39;, (d, i) =&amp;gt; {</span></span>
<span class="line"><span>    return linear(d.count);</span></span>
<span class="line"><span>  })</span></span>
<span class="line"><span>  .attr(&#39;y&#39;, (d, i) =&amp;gt; {</span></span>
<span class="line"><span>    return 0.5 * linear(d.count);</span></span>
<span class="line"><span>  });</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>到这里呢，我们就实现了我们想要实现的所有效果了。</p><h2 id="要点总结" tabindex="-1"><a class="header-anchor" href="#要点总结"><span>要点总结</span></a></h2><p>这节课，我们一起实现了3D动态的GitHub贡献图表，整个实现过程可以总结为两步。</p><p>第一步是处理数据，我们可以通过API获取JSON数据，然后得到我们想要的数据格式。第二步是渲染数据，今天我们是使用SpriteJS来渲染的，它的API类似于DOM，对d3非常友好。所以我们可以直接使用d3-selection，以数据驱动文档的方式就可以构建几何体元素。</p><p>并且，为了更好地展现数据之间的变换关系，我们根据数据创建了Cube元素，并将它们渲染了出来。而且，我们还给实现的柱状元素设置了光照、实现了过渡动画，算是实现了一个比较完整的可视化效果。</p><p>此外，我们还要注意，在实现过渡动画的过程中，很容易出现z-fighting问题，也就是我们实现的元素由于次序问题，在渲染的时候出现闪烁。这个问题在可视化中非常常见，不过，我们通过设置渲染次序或者避免坐标相同就可以避免。</p><p>到这里，我们视觉进阶篇的内容就全部讲完了。这一篇，我从实现简单的动画，讲到了3D物体的绘制、旋转、移动，以及给它们添加光照效果、法线贴图，让它们能更贴近真实的物体。</p><p>说实话，这一篇的内容单看真的不简单。但你认真看了会发现，所有的知识都是环环相扣的，只要有了前几篇的基础，我们再来学肯定可以学会。为了帮助你梳理这一篇的内容，我总结了一张知识脑图放在了下面，你可以看看。</p><img src="https://static001.geekbang.org/resource/image/fd/65/fd8eb76869dc873a816f92ddbd76c265.jpg" alt=""><h2 id="小试牛刀" tabindex="-1"><a class="header-anchor" href="#小试牛刀"><span>小试牛刀</span></a></h2><p>我们今天讲的这个例子，你学会了吗？你可以用自己的GitHub贡献数据，来实现同样的图表，也可以稍微修改一下它的样式，比如采用不同的颜色、不同的光照效果等等。</p><p>另外，课程中的例子是默认获取最近一年到当天的数据，你也可以扩展一下功能，让这个图表可以设置日期范围，根据日期范围来呈现数据。</p><p>如果你的GitHub贡献数据不是很多，也可以去找相似平台上的数据，来实现类似的图表。</p><p>今天的实战项目有没有让你体会到可视化的魅力呢？那就快把它分享出去吧！我们下节课再见！</p><h2 id="源码" tabindex="-1"><a class="header-anchor" href="#源码"><span>源码</span></a></h2><p><a href="https://github.com/akira-cn/graphics/tree/master/github-contributions" target="_blank" rel="noopener noreferrer">实现3D可视化图表详细代码</a></p><h2 id="推荐阅读" tabindex="-1"><a class="header-anchor" href="#推荐阅读"><span>推荐阅读</span></a></h2><p>[1] <a href="https://spritejs.org" target="_blank" rel="noopener noreferrer">SpriteJS官网</a><br><br> [2] <a href="https://github.com/d3/d3/blob/master/API.md" target="_blank" rel="noopener noreferrer">d3-api</a></p>`,82)]))}const t=n(p,[["render",l]]),v=JSON.parse('{"path":"/posts/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/%E8%A7%86%E8%A7%89%E9%AB%98%E7%BA%A7%E7%AF%87/27%20_%20%E6%A1%88%E4%BE%8B%EF%BC%9A%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0%E7%AE%80%E5%8D%95%E7%9A%843D%E5%8F%AF%E8%A7%86%E5%8C%96%E5%9B%BE%E8%A1%A8%EF%BC%9F.html","title":"27 _ 案例：如何实现简单的3D可视化图表？","lang":"zh-CN","frontmatter":{"description":"27 _ 案例：如何实现简单的3D可视化图表？ 你好，我是月影。 学了这么多图形学的基础知识和WebGL的视觉呈现技术，你一定已经迫不及待地想要开始实战了吧？今天，我带你完成一个小型的可视化项目，带你体会一下可视化开发的全过程。也正好借此机会，复习一下我们前面学过的全部知识。 这节课，我们要带你完成一个GitHub贡献图表的可视化作品。GitHub贡献...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/interview/posts/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/%E8%A7%86%E8%A7%89%E9%AB%98%E7%BA%A7%E7%AF%87/27%20_%20%E6%A1%88%E4%BE%8B%EF%BC%9A%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0%E7%AE%80%E5%8D%95%E7%9A%843D%E5%8F%AF%E8%A7%86%E5%8C%96%E5%9B%BE%E8%A1%A8%EF%BC%9F.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"27 _ 案例：如何实现简单的3D可视化图表？"}],["meta",{"property":"og:description","content":"27 _ 案例：如何实现简单的3D可视化图表？ 你好，我是月影。 学了这么多图形学的基础知识和WebGL的视觉呈现技术，你一定已经迫不及待地想要开始实战了吧？今天，我带你完成一个小型的可视化项目，带你体会一下可视化开发的全过程。也正好借此机会，复习一下我们前面学过的全部知识。 这节课，我们要带你完成一个GitHub贡献图表的可视化作品。GitHub贡献..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-08-16T11:19:38.000Z"}],["meta",{"property":"article:modified_time","content":"2025-08-16T11:19:38.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"27 _ 案例：如何实现简单的3D可视化图表？\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-08-16T11:19:38.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1755343178000,"updatedTime":1755343178000,"contributors":[{"name":"bbhou","username":"bbhou","email":"1557740299@qq.com","commits":1,"url":"https://github.com/bbhou"}]},"readingTime":{"minutes":13.5,"words":4049},"filePathRelative":"posts/跟月影学可视化/视觉高级篇/27 _ 案例：如何实现简单的3D可视化图表？.md","localizedDate":"2025年8月16日","excerpt":"\\n<p><audio id=\\"audio\\" title=\\"27 | 案例：如何实现简单的3D可视化图表？\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/74/2d/746f5738218ee0fd28dbc901b128fb2d.mp3\\"></audio></p>\\n<p>你好，我是月影。</p>\\n<p>学了这么多图形学的基础知识和WebGL的视觉呈现技术，你一定已经迫不及待地想要开始实战了吧？今天，我带你完成一个小型的可视化项目，带你体会一下可视化开发的全过程。也正好借此机会，复习一下我们前面学过的全部知识。</p>","autoDesc":true}');export{t as comp,v as data};
