import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-d8EKP-K0.js";const p={};function l(r,s){return i(),a("div",null,s[0]||(s[0]=[e(`<h1 id="_11-图案生成-如何生成重复图案、分形图案以及随机效果" tabindex="-1"><a class="header-anchor" href="#_11-图案生成-如何生成重复图案、分形图案以及随机效果"><span>11｜图案生成：如何生成重复图案、分形图案以及随机效果？</span></a></h1><p><audio id="audio" title="11｜图案生成：如何生成重复图案、分形图案以及随机效果？" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/yy/b4/yy9cf73e08749e962f1a96da9a037ab4.mp3"></audio></p><p>你好，我是月影。</p><p>图案生成是可视化中非常重要的基础。有多重要呢？我们知道，可视化中的几何图形是用来表达数据的，那图案就是用来修饰这些几何图形，强化视觉效果的，所以图案一般是指几何图形上的花纹。这些花纹有的简单，有的复杂，有的规律明显，有的看上去比较随机。也正是因为图案可以如此的不同，它们才能更好地增强视觉效果。</p><p>这一节课，我们就来聊一聊图案生成的基本原理和方法论。不过，因为可视化中的图案非常多，所以今天我们主要来讲三种最常用的，分别是重复图案、分形图案和随机图案。</p><p>首先，我们来看重复图案。</p><h2 id="如何绘制大批量重复图案" tabindex="-1"><a class="header-anchor" href="#如何绘制大批量重复图案"><span>如何绘制大批量重复图案</span></a></h2><p>在可视化应用中，我们经常会使用重复图案。比如说，我们在显示图表的时候，经常会给背景加上一层网格，这样可以辅助用户阅读和理解图表数据。</p><img src="https://static001.geekbang.org/resource/image/61/7a/6169388ac17a338ab1bf8b40d93c657a.jpeg" alt="" title="带有网格背景的画布"><p>那像网格这样经典的重复图案，我们应该怎样绘制它呢？这些网格看起来像是由一条一条线段组成的，是不是利用绘制线段的方式，比如我们之前学过的Canvas2D的绘图指令来绘制就可以了？如果你是这么想的，就把问题想得太简单了。</p><p>举个例子，如果我们将网格绘制在Canvas2D画布上，那网格的线条就会很多，这也就意味着我们要用大量的绘图指令来绘制。这个时候，一旦Canvas2D的画面改变了，我们就需要重绘全部的网格，这会大大消耗系统的性能。而且，如果将大量的时间都浪费在绘制这种重复图案上，那我们实现的代码性能可能就会很差。</p><p>那我们该怎么办呢？你可能会想到准备两个Canvas2D画布，一个用来绘制网格，另一个用来绘制其他会变化的图形。能想到这个办法还是不错的，说明你动了脑筋，它确实解决了图案重绘的问题。不过，我们第一次绘图的开销仍然存在。因此，我们的解决思路不能局限在使用Canvas2D的绘图指令上。</p><h3 id="_1-使用background-image来绘制重复图案" tabindex="-1"><a class="header-anchor" href="#_1-使用background-image来绘制重复图案"><span>1. 使用background-image来绘制重复图案</span></a></h3><p>我们有更巧妙的办法来“绘制”这种网格图案，那就是使用CSS的background-image属性。代码如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>canvas {</span></span>
<span class="line"><span>  background-image: linear-gradient(to right, transparent 90%, #ccc 0),</span></span>
<span class="line"><span>    linear-gradient(to bottom, transparent 90%, #ccc 0);</span></span>
<span class="line"><span>  background-size: 8px 8px, 8px 8px;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以防你对CSS的linear-gradient属性还不太熟悉，我这里简单解释一下它。CSS的linear-gradient属性可以定义线性渐变，在这个例子里，to right 表示颜色过渡是从左到右的，其中0%到90%的区域是透明的，90%到100%的区域是#ccc颜色。另外，在linear-gradient中定义颜色过渡的时候，如果后一个过渡颜色的区域值和前面相同，我们可以把它简单写为0。</p><p>因为浏览器将渐变属性视为图片，所以我们可以将渐变设置在任何可以接受图片的CSS属性上。在这里，我们就可以把渐变设置在background-image上，也就是作为背景色来使用。</p><p>如上面的代码所示，我们一共给background-image设置了两个linear-gradient，一个是横向的（to right），一个是纵向的（to bottom）。因为css的background-repeat默认值是repeat，所以我们给背景设置一下background-size。这样，我们利用浏览器自己的background-repeat机制，就可以实现我们想要的网格背景了。</p><img src="https://static001.geekbang.org/resource/image/07/92/077771d23ac719dc2d4dd10552b41192.jpeg" alt="" title="网格图案效果"><p>总结来说，这种利用了CSS属性设置重复网格背景的技巧，在一般情况下能够满足我们的需要，但也会有一些限制。首先，因为它设置的是Canvas元素的背景，所以它和直接绘制在画布上的其他图形就处于不同的层，我们也就没法将它覆盖在这些图形上了。其次，当我们用坐标变换来缩放或移动元素时，作为元素背景的网格是不会随着缩放或移动而改变的。</p><h3 id="_2-使用shader来绘制重复图案" tabindex="-1"><a class="header-anchor" href="#_2-使用shader来绘制重复图案"><span>2. 使用Shader来绘制重复图案</span></a></h3><p>那如果是用WebGL来渲染的话，我们还有更简单的做法，就是利用GPU并行计算的特点，使用着色器来绘制背景网格这样的重复图案。</p><p>这里，我直接给出了顶点着色器和片元着色器中的代码，你可以看看。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>//顶点着色器:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>attribute vec2 a_vertexPosition;</span></span>
<span class="line"><span>attribute vec2 uv;</span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  gl_PointSize = 1.0;</span></span>
<span class="line"><span>  vUv = uv;</span></span>
<span class="line"><span>  gl_Position = vec4(a_vertexPosition, 1, 1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>//片元着色器:</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision mediump float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span>uniform float rows;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  vec2 st = fract(vUv * rows);</span></span>
<span class="line"><span>  float d1 = step(st.x, 0.9);</span></span>
<span class="line"><span>  float d2 = step(0.1, st.y);</span></span>
<span class="line"><span>  gl_FragColor.rgb = mix(vec3(0.8), vec3(1.0), d1 * d2);</span></span>
<span class="line"><span>  gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那这两段Shader代码的具体行为是什么呢？你可以先自己想一想，这里我先卖个关子，一会儿再详细解释，我们先来看看WebGL绘制重复图案的过程。</p><p>我们知道，直接用WebGL来绘图比较繁琐，所以从这一节课开始，我们不采用原生的底层WebGL绘图了，而是采用一个基础库<a href="https://github.com/akira-cn/gl-renderer" target="_blank" rel="noopener noreferrer">gl-renderer</a>。gl-renderer在WebGL底层的基础上进行了一些简单的封装，以便于我们将重点放在提供几何数据、设置变量和编写Shader上，不用因为创建buffer等细节而分心。</p><p>gl-renderer的使用方法十分简单，基本上和第4节课WebGL三角形的过程一致，一共分为五步，唯一的区别是gl-renderer对每一步的代码进行了封装。我把这五步都列出来了，我们一起来看看。</p><p><strong>步骤一和步骤二分别是创建Renderer对象和创建并启用WebGL程序</strong>，过程非常简单，你直接看我给出的代码就可以理解了。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>//第一步:</span></span>
<span class="line"><span>const canvas = document.querySelector(&#39;canvas&#39;);</span></span>
<span class="line"><span>const renderer = new GlRenderer(canvas);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//第二步:</span></span>
<span class="line"><span>const program = renderer.compileSync(fragment, vertex);</span></span>
<span class="line"><span>renderer.useProgram(program);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>步骤三和步骤四是最核心的两个步骤，我来重点说说。</p><p>**步骤三是设置uniform变量。**这里，我们设置了一个rows变量，表示每一行显示多少个网格。然后我们会在片元着色器中使用它。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>renderer.uniforms.rows = 64;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>步骤四是将顶点数据送入缓冲区。</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>renderer.setMeshData([{</span></span>
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
<span class="line"><span>}]);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上面的代码中，我们一共设置了三个数据。首先，我们设置了positions也就是顶点。这里我们一共设置了四个顶点，这四个顶点坐标正好覆盖了整个Canvas画布。接着是uv，也就是<strong>纹理坐标</strong>。它和纹理设置有关，不过你先不用理解什么是纹理设置，只要知道这个坐标系的左下角为0,0，右上角为1,1就可以了。</p><img src="https://static001.geekbang.org/resource/image/75/07/756d265d782a6d9a706db049ayy4f607.jpeg" alt="" title="顶点坐标和uv坐标"><p>第三个是cells，顶点索引。我们知道，WebGL只能渲染经过三角剖分之后的多边形。那利用cells: [(0, 1, 2), (2, 0, 3)]，我们就能将这个矩形画布剖分成两个三角形，这两个三角形的顶点下标分别是(0, 1, 2)和(2, 0, 3)。</p><p>最后，我们将顶点送入缓冲区后，执行renderer.render()渲染，网格就被渲染出来了。</p><p>接下来，我们重点看一下片元着色器中的代码，来理解一下渲染过程。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>void main() {</span></span>
<span class="line"><span>  vec2 st = fract(vUv * rows);</span></span>
<span class="line"><span>  float d1 = step(st.x, 0.9);</span></span>
<span class="line"><span>  float d2 = step(0.1, st.y);</span></span>
<span class="line"><span>  gl_FragColor.rgb = mix(vec3(0.8), vec3(1.0), d1 * d2);</span></span>
<span class="line"><span>  gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>首先，我们要获得重复的rows行rows列的值st。这里我们要用到一个函数fract，它在Shader中非常常用，可以用来获取一个数的小数部分。当一个数从0~1周期性变化的时候， 我们只要将它乘以整数N，然后再用fract取小数，就能得到N个周期的数值。</p><img src="https://static001.geekbang.org/resource/image/55/27/55ff744280b589147b8b7f1f5acdf527.jpeg" alt="" title="y = fract(x) 在整数区间内周期重复示意图"><p>所以，这里我们用vUv也就是由顶点着色器传来的uv属性（纹理坐标）乘上rows值，然后用fract取小数部分，就能得到st了。</p><p>接着，我们处理st的x和y。因为WebGL中的片元着色器线性插值，所以现在它们默认是线性变化的，而我们要的是阶梯变化。那要实现阶梯变化，我们可以使用step函数，step函数是Shader中另一个很常用的函数，它就是一个阶梯函数。它的原理是：当step(a, b)中的b &lt; a时，返回0；当b &gt;= a时，返回1。</p><img src="https://static001.geekbang.org/resource/image/6d/52/6dcd4de27bb6753274814a6b0e8c8852.jpeg" alt="" title="Step函数"><p>因此，d1和d2分别有2种取值情况。</p><img src="https://static001.geekbang.org/resource/image/9b/5e/9baa897a9180ce776b72cb90a8cfd45e.jpg" alt=""><p>最后，我们要根据d1 * d2的值，决定背景网格使用哪个颜色来绘制。要实现这个目的，我们就要使用到第三个函数mix。mix是线性插值函数，mix(a, b, c)表示根据c是0或1，返回a或者b。</p><p>比如在上面的代码中，当st.x小于0.9且st.y大于0.1，也就是d1 * d2等于1的时候，mix(vec3(0.8), vec3(1.0), d1 * d2) 的结果是vec3(1.0)，也就是白色。否则就是vec3(0.8)，也就是灰色。</p><p>最后，因为rows决定网格重复的次数，所以最终的效果和rows的取值有关。为了让你有更直观的感受，我把row分别取1、4、16、32、64时的效果都绘制出来了，你可以看看。</p><img src="https://static001.geekbang.org/resource/image/19/e6/19fd5561b5ac779f1de9d49c4d8bbbe6.gif" alt="" title="rows为1、4、16、32、64的效果"><p>这就是我们用Shader实现重复图案的完整过程。它的优势在于，不管我们给rows取值多少，图案都是一次绘制出来的，并不会因为rows增加而消耗性能。所以，使用Shader绘制重复图案，不管绘制多么细腻，图案重复多少次，绘制消耗的时间几乎是常量，不会遇到性能瓶颈。</p><h2 id="如何绘制分形图案" tabindex="-1"><a class="header-anchor" href="#如何绘制分形图案"><span>如何绘制分形图案</span></a></h2><p>说完了重复图案，我们再来说分形。它不仅是自然界中存在的一种自然现象，也是一种优美的数学模型。通俗点来说，一个分形图案可以划分成无数个部分，而每个部分的形状又都和这个图案整体具有相似性。所以，典型的分形效果具有局部与整体的自相似性以及无限细节（分形可以无限放大），能产生令人震撼的视觉效果。</p><img src="https://static001.geekbang.org/resource/image/34/64/341085ab7bf1076255a3d151e563cc64.jpg" alt="" title="自然界中的分形：罗马花椰菜"><p>实际上，分形在实践中偏向于视觉和UI设计。虽然它在实际的可视化项目中不太常用，但总能够起到画龙点睛的作用。所以，了解分形在视觉呈现中的实现技巧还是很有必要的。下面，我们就来详细讲讲分形是怎么实现的。</p><p>首先，我们来认识一下分形公式，Mandelbrot Set，也叫曼德勃罗特集。它是由美国数学家曼徳勃罗特教授发现的迭代公式构成的分形集合。这个公式中Z<sub>n</sub>和Z<sub>n+1</sub>是复数，C是一个实数常量。</p><img src="https://static001.geekbang.org/resource/image/db/77/db02b5eddd8721e9f5299853ace9d077.jpeg" alt=""><p>这个迭代公式使用起来非常简单，只要我们给定一个初始值，它就能产生许多有趣的图案。接下来，我们就一起来看一个有趣的例子。</p><p>首先我们实现一个片元着色器，代码如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision mediump float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span>uniform vec2 center;</span></span>
<span class="line"><span>uniform float scale;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>vec2 f(vec2 z, vec2 c) {</span></span>
<span class="line"><span>  return mat2(z, -z.y, z.x) * z + c;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>    vec2 uv = vUv;</span></span>
<span class="line"><span>    vec2 c = center + 4.0 * (uv - vec2(0.5)) / scale;</span></span>
<span class="line"><span>    vec2 z = vec2(0.0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    bool escaped = false;</span></span>
<span class="line"><span>    int j;</span></span>
<span class="line"><span>    for (int i = 0; i &amp;lt; 65536; i++) {</span></span>
<span class="line"><span>      if(i &amp;gt; iterations) break;</span></span>
<span class="line"><span>      j = i;</span></span>
<span class="line"><span>      z = f(z, c);</span></span>
<span class="line"><span>      if (length(z) &amp;gt; 2.0) {</span></span>
<span class="line"><span>        escaped = true;</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    gl_FragColor.rgb = escaped ? vec3(float(j)) / float(iterations) : vec3(0.0);</span></span>
<span class="line"><span>    gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们设置了初始的z和c，然后执行迭代。理论上曼德勃罗特集应该是无限迭代的，但是我们肯定不能让它无限循环，所以我们要给一个足够精度的最大迭代次数，比如65536。在迭代过程中，如果z的模大于2，那它就结束计算，否则就继续迭代，直到达到循环次数。</p><p>我们把(0, 0)设置为图案中心点，放大系数初始设为1，即原始大小，然后开始渲染，代码如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>const program = renderer.compileSync(fragment, vertex);</span></span>
<span class="line"><span>renderer.useProgram(program);</span></span>
<span class="line"><span>renderer.uniforms.center = [0, 0];</span></span>
<span class="line"><span>renderer.uniforms.scale = 1;</span></span>
<span class="line"><span>renderer.uniforms.iterations = 256;</span></span>
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
<span class="line"><span>renderer.render();</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><img src="https://static001.geekbang.org/resource/image/0d/5a/0d33586fd494f7ba55cfe17a7e9e105a.jpeg" alt="" title="画布上最终的渲染结果"><p>这个图案本身似乎没有什么特别的效果，我们可以修改一下Shader中的代码，改变渲染颜色的规则，根据迭代次数和迭代深度的比值来渲染不同的颜色，然后将它局部放大，就能得到非常有趣的图案了。</p><img src="https://static001.geekbang.org/resource/image/b6/9e/b61a71e0de654958d1ee033b3b0a939e.gif" alt=""><h2 id="如何给图案增加随机效果" tabindex="-1"><a class="header-anchor" href="#如何给图案增加随机效果"><span>如何给图案增加随机效果</span></a></h2><p>那分形图案为什么这么吸引人呢？如果你多看几个，就会发现，它们的无限细节里同时拥有重复和随机这两个规律。那对于其他非分形的图案，如果也想让它变得吸引人，我们其实可以给它们增加<strong>随机效果</strong>。</p><p>不知道，你还记得我们开篇词中的那个抽奖程序吗？实际上它就是一个随机效果的应用。</p><img src="https://static001.geekbang.org/resource/image/e7/eb/e7025fcba897df3b78205d1d711cb9eb.jpg" alt="" title="产生随机色块的抽奖程序"><p>要想实现类似这样的随机效果，在Shader中，我们可以使用伪随机函数。下面，我以一个常用的伪随机函数为例，来讲讲随机效果是怎么生成的。代码如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>float random (vec2 st) {</span></span>
<span class="line"><span>    return fract(sin(dot(st.xy,</span></span>
<span class="line"><span>                         vec2(12.9898,78.233)))*</span></span>
<span class="line"><span>        43758.5453123);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个伪随机函数的原理是，取正弦函数偏后部的小数部分的值来模拟随机。如果我们传入一个确定的st值，它就会返回一个符合随机分布的确定的float值。</p><p>我们可以测试一下这个伪随机函数，代码如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>float random (vec2 st) {</span></span>
<span class="line"><span>    return fract(sin(dot(st.xy,</span></span>
<span class="line"><span>                        vec2(12.9898,78.233)))*</span></span>
<span class="line"><span>        43758.5453123);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>    gl_FragColor.rgb = vec3(random(vUv));</span></span>
<span class="line"><span>    gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>它的执行结果是一片噪点，效果如下图所示。</p><img src="https://static001.geekbang.org/resource/image/65/22/65539f5eda08e26a22caaf84a66f5822.jpeg" alt=""><p>这些噪点显然不能满足我们想要的随机效果，因为它们只有一个像素，而且太小了。所以下一步，我们可以用floor取整函数，来生成随机的色块。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>  #ifdef GL_ES</span></span>
<span class="line"><span>  precision highp float;</span></span>
<span class="line"><span>  #endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  varying vec2 vUv;</span></span>
<span class="line"><span>  float random (vec2 st) {</span></span>
<span class="line"><span>      return fract(sin(dot(st.xy,</span></span>
<span class="line"><span>                          vec2(12.9898,78.233)))*</span></span>
<span class="line"><span>          43758.5453123);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  void main() {</span></span>
<span class="line"><span>      vec2 st = vUv * 10.0;</span></span>
<span class="line"><span>      gl_FragColor.rgb = vec3(random(floor(st)));</span></span>
<span class="line"><span>      gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>  }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>floor函数和JavaScript的Math.floor一样，都是向下取浮点数的整数部分，不过，glsl的floor可以直接对向量使用。我们通过floor(st)实际上取到了0,0到9,9，一共10行*10列=100个方块。然后我们通过random函数给每一个方块随机一个颜色，最终实现的结果如下：</p><img src="https://static001.geekbang.org/resource/image/ac/c5/ac66f16a9d1fd8baf0ed86442462fbc5.jpeg" alt=""><p>此外，我们还可以结合随机和动态效果。具体的方法就是传入一个代表时间的uTime变量，实际代码和最终效果如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uniform float uTime;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>float random (vec2 st) {</span></span>
<span class="line"><span>    return fract(sin(dot(st.xy,</span></span>
<span class="line"><span>                        vec2(12.9898,78.233)))*</span></span>
<span class="line"><span>        43758.5453123);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>    vec2 st = vUv * vec2(100.0, 50.0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    st.x -= (1.0 + 10.0 * random(vec2(floor(st.y)))) * uTime;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    vec2 ipos = floor(st);  // integer</span></span>
<span class="line"><span>    vec2 fpos = fract(st);  // fraction</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    vec3 color = vec3(step(random(ipos), 0.7));</span></span>
<span class="line"><span>    color *= step(0.2,fpos.y);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    gl_FragColor.rgb = color;</span></span>
<span class="line"><span>    gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><img src="https://static001.geekbang.org/resource/image/8c/9c/8cee3889c8034f0d94211fcc1ec72b9c.gif" alt=""><p>除此之外，我们用Shader来实现网格类的效果也特别方便。比如，下面我们就在Shader中用smoothstep函数生成可以随机旋转方向的线段，从而生成一个迷宫。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision mediump float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define PI 3.14159265358979323846</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span>uniform vec2 u_resolution;</span></span>
<span class="line"><span>uniform int rows;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>float random (in vec2 _st) {</span></span>
<span class="line"><span>    return fract(sin(dot(_st.xy,</span></span>
<span class="line"><span>                        vec2(12.9898,78.233)))*</span></span>
<span class="line"><span>        43758.5453123);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>vec2 truchetPattern(in vec2 _st, in float _index){</span></span>
<span class="line"><span>    _index = fract(((_index-0.5)*2.0));</span></span>
<span class="line"><span>    if (_index &amp;gt; 0.75) {</span></span>
<span class="line"><span>        _st = vec2(1.0) - _st;</span></span>
<span class="line"><span>    } else if (_index &amp;gt; 0.5) {</span></span>
<span class="line"><span>        _st = vec2(1.0-_st.x,_st.y);</span></span>
<span class="line"><span>    } else if (_index &amp;gt; 0.25) {</span></span>
<span class="line"><span>        _st = 1.0-vec2(1.0-_st.x,_st.y);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return _st;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>    vec2 st = vUv * float(rows);</span></span>
<span class="line"><span>    vec2 ipos = floor(st);  // integer</span></span>
<span class="line"><span>    vec2 fpos = fract(st);  // fraction</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    vec2 tile = truchetPattern(fpos, random( ipos ));</span></span>
<span class="line"><span>    float color = 0.0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    color = smoothstep(tile.x-0.3,tile.x,tile.y)-</span></span>
<span class="line"><span>            smoothstep(tile.x,tile.x+0.3,tile.y);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    gl_FragColor = vec4(vec3(color),1.0);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><img src="https://static001.geekbang.org/resource/image/a3/3b/a3ae93b53bb2e3992267a1c996a5583b.jpeg" alt=""><h2 id="要点总结" tabindex="-1"><a class="header-anchor" href="#要点总结"><span>要点总结</span></a></h2><p>今天，我们讲了可视化中三种常用图案的生成原理。</p><p>第一种，批量重复图案。一般来说，在绘制批量重复图案的时候，我们可以采用2种方案。首先是使用CSS的background-image属性，利用backgroud-repeat快速重复绘制。其次，我们可以使用片元着色器，利用GPU的并行渲染的特点来绘制。</p><p>第二种，分形图案。绘制分形图案有一个可以直接的公式，曼德勃罗特集。我们可以使用它来绘制分形图案。</p><p>第三种是在重复图案上增加随机性，我们可以在片元着色器中使用伪随机函数，来给重复图案实现随机效果。</p><p>虽然我们说几何图形是用来承载数据信息，图案是来强化视觉效果的，但实际上，它们也并没有绝对的界限，有时候我们也可以将图案与数据信息一起管理。比如说，在上面那个动态效果的例子中，我们可以调整动态参数，让图形的运动速度或者黑白块的分布和数据量或者信息内容联系起来。这会大大强化可视化的视觉效果，从而加深用户对信息的理解。</p><p>在这一节课，我们讲了大量关于WebGL的片元着色器的知识。这是因为，片元着色器是最适合生成和绘制这些图案的技术，但这也并不意味着用其他图形系统，比如SVG或者Canvas就没法很好地生成并绘制这些图案了。</p><p>实际上，它们的基本原理是相同的，所以用SVG或Canvas同样可以绘制这些图案。只不过，因为SVG和Canvas渲染不能深入控制GPU底层，所以就没法做到像WebGL这样并行高效地渲染这些图案。那如果在选择SVG和Canvas的可视化应用中，需要绘制大量的这些图案，就必然会导致性能瓶颈，这也是为什么我们一定要了解和掌握WebGL技术，只有这样，我们才能真正掌握绘制极有视觉冲击力的复杂图案的能力。</p><p>最后，我还要啰嗦几句，如果你对片元着色器应用还不是很熟悉，对上面的代码还有疑问或者不是很理解，那也没有关系，你可以花一点时间，仔细研究一下<a href="https://github.com/akira-cn/graphics/tree/master/repeat-and-random" target="_blank" rel="noopener noreferrer">GitHub 仓库</a>的源代码。要记住，动手实践永远是我们最好的学习方式，没有之一。</p><p>另外，在接下来的课程里，我们还会大量使用片元着色器创建更多有趣、炫酷的视觉效果。所以，我也建议你去从头看看这份关于片元着色器的学习资料，<a href="https://thebookofshaders.com/?lan=ch" target="_blank" rel="noopener noreferrer">The Book of Shaders</a>，相信你会非常有收获。</p><h2 id="小试牛刀" tabindex="-1"><a class="header-anchor" href="#小试牛刀"><span>小试牛刀</span></a></h2><p>在前面的例子里，我们实现了一个10*10的灰色块方阵，这里我们使用的是灰度颜色，你能够渲染出彩色方块吗？你可以尝试将随机数映射成HSV坐标中的H，然后绘制出不同的彩色方阵。</p><p>在实现抽奖程序的时候，我们在Shader中使用的是伪随机函数random。那如果要实现真正的随机数，我们该怎么做呢？如果我们希望实现的迷宫图案，在我们每次刷新网页的时候都不相同，这个功能你可以实现吗？你可以fork GitHub仓库的代码，然后把伪随机迷宫图案修改成真正随机迷宫图案，然后把你的代码和实际效果分享出来。</p><p>我们知道，使用background-image的弊端是，当我们用坐标变换来缩放或移动图形的时候，作为元素背景的网格是不会随着缩放或移动而改变的。但使用Shader，我们就能够避免这个问题了。</p><p>不过，我们在课程中没有给出缩放和移动图形的例子。你能够扩展我给出的例子，实现图案随着图形的缩放和移动变化的效果吗（这里，我再给你一个小提示，你可以使用顶点着色器和仿射变换矩阵来实现）？</p><p>欢迎在留言区和我讨论，分享你的答案和思考，也欢迎你把这节课分享给你的朋友，我们下节课见！</p><h2 id="源码" tabindex="-1"><a class="header-anchor" href="#源码"><span>源码</span></a></h2><p><a href="https://github.com/akira-cn/graphics/tree/master/repeat-and-random" target="_blank" rel="noopener noreferrer">课程示例代码</a></p><h2 id="推荐阅读" tabindex="-1"><a class="header-anchor" href="#推荐阅读"><span>推荐阅读</span></a></h2><p>[1]基于WebGL底层简单封装的基础库 [gl-renderer]的官方文档(<a href="https://github.com/akira-cn/gl-renderer" target="_blank" rel="noopener noreferrer">https://github.com/akira-cn/gl-renderer</a>) ，它可以大大简化WebGL代码的书写难度<br><br> [2]很棒的学习片元着色器的教程 <a href="https://thebookofshaders.com/?lan=ch" target="_blank" rel="noopener noreferrer">The Book of Shaders</a> .</p>`,108)]))}const t=n(p,[["render",l]]),v=JSON.parse('{"path":"/posts/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/%E8%A7%86%E8%A7%89%E5%9F%BA%E7%A1%80%E7%AF%87/11%EF%BD%9C%E5%9B%BE%E6%A1%88%E7%94%9F%E6%88%90%EF%BC%9A%E5%A6%82%E4%BD%95%E7%94%9F%E6%88%90%E9%87%8D%E5%A4%8D%E5%9B%BE%E6%A1%88%E3%80%81%E5%88%86%E5%BD%A2%E5%9B%BE%E6%A1%88%E4%BB%A5%E5%8F%8A%E9%9A%8F%E6%9C%BA%E6%95%88%E6%9E%9C%EF%BC%9F.html","title":"11｜图案生成：如何生成重复图案、分形图案以及随机效果？","lang":"zh-CN","frontmatter":{"description":"11｜图案生成：如何生成重复图案、分形图案以及随机效果？ 你好，我是月影。 图案生成是可视化中非常重要的基础。有多重要呢？我们知道，可视化中的几何图形是用来表达数据的，那图案就是用来修饰这些几何图形，强化视觉效果的，所以图案一般是指几何图形上的花纹。这些花纹有的简单，有的复杂，有的规律明显，有的看上去比较随机。也正是因为图案可以如此的不同，它们才能更好...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/interview/posts/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/%E8%A7%86%E8%A7%89%E5%9F%BA%E7%A1%80%E7%AF%87/11%EF%BD%9C%E5%9B%BE%E6%A1%88%E7%94%9F%E6%88%90%EF%BC%9A%E5%A6%82%E4%BD%95%E7%94%9F%E6%88%90%E9%87%8D%E5%A4%8D%E5%9B%BE%E6%A1%88%E3%80%81%E5%88%86%E5%BD%A2%E5%9B%BE%E6%A1%88%E4%BB%A5%E5%8F%8A%E9%9A%8F%E6%9C%BA%E6%95%88%E6%9E%9C%EF%BC%9F.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"11｜图案生成：如何生成重复图案、分形图案以及随机效果？"}],["meta",{"property":"og:description","content":"11｜图案生成：如何生成重复图案、分形图案以及随机效果？ 你好，我是月影。 图案生成是可视化中非常重要的基础。有多重要呢？我们知道，可视化中的几何图形是用来表达数据的，那图案就是用来修饰这些几何图形，强化视觉效果的，所以图案一般是指几何图形上的花纹。这些花纹有的简单，有的复杂，有的规律明显，有的看上去比较随机。也正是因为图案可以如此的不同，它们才能更好..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-08-16T11:19:38.000Z"}],["meta",{"property":"article:modified_time","content":"2025-08-16T11:19:38.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"11｜图案生成：如何生成重复图案、分形图案以及随机效果？\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-08-16T11:19:38.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1755343178000,"updatedTime":1755343178000,"contributors":[{"name":"bbhou","username":"bbhou","email":"1557740299@qq.com","commits":1,"url":"https://github.com/bbhou"}]},"readingTime":{"minutes":18.63,"words":5589},"filePathRelative":"posts/跟月影学可视化/视觉基础篇/11｜图案生成：如何生成重复图案、分形图案以及随机效果？.md","localizedDate":"2025年8月16日","excerpt":"\\n<p><audio id=\\"audio\\" title=\\"11｜图案生成：如何生成重复图案、分形图案以及随机效果？\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/yy/b4/yy9cf73e08749e962f1a96da9a037ab4.mp3\\"></audio></p>\\n<p>你好，我是月影。</p>\\n<p>图案生成是可视化中非常重要的基础。有多重要呢？我们知道，可视化中的几何图形是用来表达数据的，那图案就是用来修饰这些几何图形，强化视觉效果的，所以图案一般是指几何图形上的花纹。这些花纹有的简单，有的复杂，有的规律明显，有的看上去比较随机。也正是因为图案可以如此的不同，它们才能更好地增强视觉效果。</p>","autoDesc":true}');export{t as comp,v as data};
