import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as i,o as e}from"./app-d8EKP-K0.js";const p={};function l(t,s){return e(),a("div",null,s[0]||(s[0]=[i(`<h1 id="_18-如何生成简单动画让图形动起来" tabindex="-1"><a class="header-anchor" href="#_18-如何生成简单动画让图形动起来"><span>18 _ 如何生成简单动画让图形动起来？</span></a></h1><p><audio id="audio" title="18 | 如何生成简单动画让图形动起来？" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/e5/f0/e5afca9389433f61e5d12709ebfe23f0.mp3"></audio></p><p>你好，我是月影。</p><p>前面，我们用了3个模块的时间，学习了大量的图形学和数学知识，是不是让你的脑袋有一点昏沉？没关系，你只是需要一点时间来消化这些知识而已。我能给你的建议就是多思考、多练习，有了时间的积累，你一定可以掌握这些基础知识和思维方法。</p><p>从这一节课开始，我们要学习一个非常有意思的新模块，那就是动画和3D绘图。对于可视化展现来说，动画和3D都是用来强化数据表达，吸引用户的重要技术手段。它们往往比二维平面图形能够表达更复杂的数据，实现更吸引人的视觉效果。</p><p>那今天，我们先来聊聊动画的实现。实际上，我们之前也实现了不少动态效果，但你可能还是不知道怎么去实现动画。接下来，我们就来系统地梳理一下动画实现的标准方法。</p><h2 id="动画的三种形式" tabindex="-1"><a class="header-anchor" href="#动画的三种形式"><span>动画的三种形式</span></a></h2><p>什么是动画呢？简单来说，动画就是将许多帧静止的画面以固定的速率连续播放出来。一般来说，动画有三种形式，分别是固定帧动画、增量动画和时序动画。</p><p>第一种形式是我们预先准备好要播放的静态图像，然后将这些图依次播放，所以它叫做<strong>固定帧动画</strong>。<strong>增量动画</strong>是在动态绘制图像的过程中，我们修改每一帧中某个或某几个属性的值，给它们一定的增量。第三种形式是在动态绘制图像的过程中，我们根据时间和动画函数计算每一帧中的关键属性值，然后更新这些属性，所以它叫做<strong>时序动画</strong>。</p><p>这么说还是比较抽象，下面，我就以HTML/CSS为例，来带你熟悉这三种动画的基本形式。为什么选HTML/CSS呢？因为一般来说，HTML/CSS、SVG和Canvas2D实现动画的方式大同小异，所以我就直接选择你最熟悉的HTML/CSS了。而WebGL实现动画的方式和其他三种图形系统都有差别，所以我会在下一节课单独来说。</p><h3 id="_1-实现固定帧动画" tabindex="-1"><a class="header-anchor" href="#_1-实现固定帧动画"><span>1. 实现固定帧动画</span></a></h3><p>首先，我们来说说如何实现固定帧动画。</p><p>结合固定帧动画的定义，我们实现它的第一步，就是为每一帧准备一张静态图像。比如说，我们要实现一个循环播放3帧的动画，就要准备3个如下的图像。</p><img src="https://static001.geekbang.org/resource/image/80/0e/80532862be3yy41356172c40b547f30e.jpeg" alt="" title="3个静态图像"><p>第二步，我们要依次播放这些图像。在CSS里实现的时候，我们使用图片作为背景，就可以让它们逐帧切换了。代码如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>.bird {</span></span>
<span class="line"><span>  position: absolute;</span></span>
<span class="line"><span>  left: 100px;</span></span>
<span class="line"><span>  top: 100px;</span></span>
<span class="line"><span>  width:86px;</span></span>
<span class="line"><span>  height:60px;</span></span>
<span class="line"><span>  zoom: 0.5;</span></span>
<span class="line"><span>  background-repeat: no-repeat;</span></span>
<span class="line"><span>  background-image: url(https://p.ssl.qhimg.com/t01f265b6b6479fffc4.png);</span></span>
<span class="line"><span>  background-position: -178px -2px;</span></span>
<span class="line"><span>  animation: flappy .5s step-end infinite;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@keyframes flappy {</span></span>
<span class="line"><span>  0% {background-position: -178px -2px;}</span></span>
<span class="line"><span>  33% {background-position: -90px -2px;}</span></span>
<span class="line"><span>  66% {background-position: -2px -2px;}</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><img src="https://static001.geekbang.org/resource/image/e5/8a/e5cfe9afc454013c3913bfbb03b9548a.gif" alt="" title="动态的小鸟"><p>虽然固定帧动画实现起来非常简单，但它不适合生成需要动态绘制的图像，更适合在游戏等应用场景中，生成由美术提供现成图片的动画帧图像。而对于动态绘制的图像，也就是非固定帧动画，我们通常会使用另外两种方式。</p><h3 id="_2-实现增量动画" tabindex="-1"><a class="header-anchor" href="#_2-实现增量动画"><span>2. 实现增量动画</span></a></h3><p>我们先来说比较简单的增量动画，即每帧给属性一个增量。怎么理解呢？我举个简单的例子，我们可以创建一个蓝色的方块，然后给这个方块的每一帧增加一个rotate角度。这样就能实现蓝色方块旋转的动画。具体的代码和效果如下所示。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&amp;lt;!DOCTYPE html&amp;gt;</span></span>
<span class="line"><span>&amp;lt;html lang=&amp;quot;en&amp;quot;&amp;gt;</span></span>
<span class="line"><span>&amp;lt;head&amp;gt;</span></span>
<span class="line"><span>   &amp;lt;meta charset=&amp;quot;UTF-8&amp;quot;&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;meta name=&amp;quot;viewport&amp;quot; content=&amp;quot;width=device-width, initial-scale=1.0&amp;quot;&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;title&amp;gt;Document&amp;lt;/title&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;style&amp;gt;</span></span>
<span class="line"><span>    .block {</span></span>
<span class="line"><span>      width: 100px;</span></span>
<span class="line"><span>      height: 100px;</span></span>
<span class="line"><span>      top: 100px;</span></span>
<span class="line"><span>      left: 100px;</span></span>
<span class="line"><span>      transform-origin: 50% 50%;</span></span>
<span class="line"><span>      position: absolute;</span></span>
<span class="line"><span>      background: blue;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  &amp;lt;/style&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/head&amp;gt;</span></span>
<span class="line"><span>&amp;lt;body&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;div class=&amp;quot;block&amp;quot;&amp;gt;&amp;lt;/div&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;script&amp;gt;</span></span>
<span class="line"><span>  const block = document.querySelector(&#39;.block&#39;);</span></span>
<span class="line"><span>  let rotation = 0;</span></span>
<span class="line"><span>  requestAnimationFrame(function update() {</span></span>
<span class="line"><span>    block.style.transform = \`rotate(\${rotation++}deg)\`;</span></span>
<span class="line"><span>    requestAnimationFrame(update);</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>  &amp;lt;/script&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/body&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/html&amp;gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><img src="https://static001.geekbang.org/resource/image/fe/41/fe5fd08150d43ff6305042b6ea2ba041.gif" alt="" title="旋转的蓝色方块"><p>在上面的例子中，我们重点关注第22到26这5行JavaScript代码就行了，关键逻辑在于我们修改rotatation值，每次绘制的时候将它加1。这样我们就实现增量动画，是不是也很简单？</p><p>确实，增量动画的优点就是实现简单。但它也有2个缺点。首先，因为它使用增量来控制动画，从数学角度来说，也就是我们直接使用了一阶导数来定义的动画。这样的绘图方式不太好控制动画的细节，比如动画周期、变化率、轨迹等等，所以这种方法只能用来实现简单动画。</p><p>其次，增量动画定义的是状态变化。如果我们要在shader中使用动画，就只能采用后期处理通道来实现。但是后期处理通道要进行多次渲染，实现起来比较繁琐，而且性能开销也比较大。所以，更加复杂的轨迹动画，我们一般采用第三种方式，也就是通过定义时间和动画函数来实现。</p><h3 id="_3-实现时序动画" tabindex="-1"><a class="header-anchor" href="#_3-实现时序动画"><span>3. 实现时序动画</span></a></h3><p>还是以旋转的蓝色方块为例，我们改写一下它的JavaScript代码。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>const block = document.querySelector(&#39;.block&#39;);</span></span>
<span class="line"><span>const startAngle = 0;</span></span>
<span class="line"><span>const T = 2000;</span></span>
<span class="line"><span>let startTime = null;</span></span>
<span class="line"><span>function update() {</span></span>
<span class="line"><span>  startTime = startTime == null ? Date.now() : startTime;</span></span>
<span class="line"><span>  const p = (Date.now() - startTime) / T;</span></span>
<span class="line"><span>  const angle = startAngle + p * 360;</span></span>
<span class="line"><span>  block.style.transform = \`rotate(\${angle}deg)\`;</span></span>
<span class="line"><span>  requestAnimationFrame(update);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>update();</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>首先，我们定义2个变量，startAnglehe和T。其中，startAnglehe是起始旋转角度，T是旋转周期。在第一次调用update的时候，我们设置初始旋转的时间为startTime，那么在每次调用update的时候，当前经过的时间就是 Date.now() - startTime。</p><p>接着，我们将它除以周期T，就能得到旋转进度p，那么当前角度就等于 startAngle + p * 360。然后我们将当前角度设置为元素的rotate值，就实现了同样的旋转动画。</p><p>总的来说，时序动画的实现可以总结为三步：首先定义初始时间和周期，然后在update中计算当前经过时间和进度p，最后通过p来更新动画元素的属性。虽然时序动画实现起来比增量动画写法更复杂，但我们可以更直观、精确地控制旋转动画的周期（速度）、起始角度等参数。</p><p>也正因为如此，这种方式在动画实现中最为常用。那为了更方便使用和拓展，我们可以把实现时序动画的三个步骤抽象成标准的动画模型。具体怎么做呢？我们接着往下看。</p><h2 id="定义标准动画模型" tabindex="-1"><a class="header-anchor" href="#定义标准动画模型"><span>定义标准动画模型</span></a></h2><p>首先，我们定义一个类 Timing用来处理时间，具体代码如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>export class Timing {</span></span>
<span class="line"><span>  constructor({duration, iterations = 1} = {}) {</span></span>
<span class="line"><span>    this.startTime = Date.now();</span></span>
<span class="line"><span>    this.duration = duration;</span></span>
<span class="line"><span>    this.iterations = iterations;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  get time() {</span></span>
<span class="line"><span>    return Date.now() - this.startTime;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  get p() {</span></span>
<span class="line"><span>    const progress = Math.min(this.time / this.duration, this.iterations);</span></span>
<span class="line"><span>    return this.isFinished ? 1 : progress % 1;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  get isFinished() {</span></span>
<span class="line"><span>    return this.time / this.duration &amp;gt;= this.iterations;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后，我们实现一个Animator类，用来真正控制动画过程。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>import {Timing} from &#39;./timing.js&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export class Animator {</span></span>
<span class="line"><span>  constructor({duration, iterations}) {</span></span>
<span class="line"><span>    this.timing = {duration, iterations};</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  animate(target, update) {</span></span>
<span class="line"><span>    let frameIndex = 0;</span></span>
<span class="line"><span>    const timing = new Timing(this.timing);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return new Promise((resolve) =&amp;gt; {</span></span>
<span class="line"><span>      function next() {</span></span>
<span class="line"><span>        if(update({target, frameIndex, timing}) !== false &amp;amp;&amp;amp; !timing.isFinished) {</span></span>
<span class="line"><span>          requestAnimationFrame(next);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>          resolve(timing);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        frameIndex++;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      next();</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Animator构造器接受{duration, iterations}作为参数，它有一个animate方法，会在执行时创建一个timing对象，然后通过执行update({target, frameIndex, timing})更新动画，并且会返回一个promise对象。这样，在动画结束时，resolve这个promise，我们就能够很方便地实现连续动画了。</p><p>接下来，你可以想一个动画效果，来试验一下这个模型的效果。比如说，我们可以用Animator实现四个方块的轮换转动，让每个方块转动的周期是1秒，一共旋转1.5个周期（即540度）。代码和效果如下所示。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&amp;lt;!DOCTYPE html&amp;gt;</span></span>
<span class="line"><span>&amp;lt;html lang=&amp;quot;en&amp;quot;&amp;gt;</span></span>
<span class="line"><span>&amp;lt;head&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;meta charset=&amp;quot;UTF-8&amp;quot;&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;meta name=&amp;quot;viewport&amp;quot; content=&amp;quot;width=device-width, initial-scale=1.0&amp;quot;&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;title&amp;gt;Document&amp;lt;/title&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;style&amp;gt;</span></span>
<span class="line"><span>    .container {</span></span>
<span class="line"><span>      display: flex;</span></span>
<span class="line"><span>      flex-wrap: wrap;</span></span>
<span class="line"><span>      justify-content: space-between;</span></span>
<span class="line"><span>      width: 300px;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    .block {</span></span>
<span class="line"><span>      width: 100px;</span></span>
<span class="line"><span>      height: 100px;</span></span>
<span class="line"><span>      margin: 20px;</span></span>
<span class="line"><span>      flex-shrink: 0;</span></span>
<span class="line"><span>      transform-origin: 50% 50%;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    .block:nth-child(1) {background: red;}</span></span>
<span class="line"><span>    .block:nth-child(2) {background: blue;}</span></span>
<span class="line"><span>    .block:nth-child(3) {background: green;}</span></span>
<span class="line"><span>    .block:nth-child(4) {background: orange;}</span></span>
<span class="line"><span>  &amp;lt;/style&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/head&amp;gt;</span></span>
<span class="line"><span>&amp;lt;body&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;div class=&amp;quot;container&amp;quot;&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;div class=&amp;quot;block&amp;quot;&amp;gt;&amp;lt;/div&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;div class=&amp;quot;block&amp;quot;&amp;gt;&amp;lt;/div&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;div class=&amp;quot;block&amp;quot;&amp;gt;&amp;lt;/div&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;div class=&amp;quot;block&amp;quot;&amp;gt;&amp;lt;/div&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;/div&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;script type=&amp;quot;module&amp;quot;&amp;gt;</span></span>
<span class="line"><span>    import {Animator} from &#39;../common/lib/animator/index.js&#39;;</span></span>
<span class="line"><span>    const blocks = document.querySelectorAll(&#39;.block&#39;);</span></span>
<span class="line"><span>    const animator = new Animator({duration: 1000, iterations: 1.5});</span></span>
<span class="line"><span>    (async function () {</span></span>
<span class="line"><span>      let i = 0;</span></span>
<span class="line"><span>      while(true) { // eslint-disable-next-line no-await-in-loop</span></span>
<span class="line"><span>        await animator.animate(blocks[i++ % 4], ({target, timing}) =&amp;gt; {</span></span>
<span class="line"><span>          target.style.transform = \`rotate(\${timing.p * 360}deg)\`;</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }());</span></span>
<span class="line"><span>  &amp;lt;/script&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/body&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/html&amp;gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><img src="https://static001.geekbang.org/resource/image/d2/81/d28f5b8c8cdf8f20dc20566ab45f7181.gif" alt="" title="顺序旋转的四个方块"><h2 id="插值与缓动函数" tabindex="-1"><a class="header-anchor" href="#插值与缓动函数"><span>插值与缓动函数</span></a></h2><p>我们前面说过，时序动画的好处就在于，它能更容易地控制动画的细节。那针对我们总结出的这个标准的动画模型，它又如何控制动画细节呢？</p><p>假设，我们已知元素的起始状态、结束状态和运动周期。如果想要让它进行不规则运动，我们可以使用插值的方式来控制每一帧的展现。比如说，我们可以先实现一个匀速运动的方块，再通过插值与缓动函数来实现变速运动。</p><p>首先，我们用Animator实现一个方块，让它从100px处<strong>匀速运动</strong>到400px处。注意，在代码实现的时候，我们使用了一个线性插值方法：left = start * (1 - p) + end * p。线性插值可以很方便地实现属性的均匀变化，所以用它来让方块做匀速运动是非常简单的。但如果是让方块非匀速运动，比如匀加速运动，我们要怎么办呢？</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>import {Animator} from &#39;../common/lib/animator/index.js&#39;;</span></span>
<span class="line"><span>const block = document.querySelector(&#39;.block&#39;);</span></span>
<span class="line"><span>const animator = new Animator({duration: 3000});</span></span>
<span class="line"><span>document.addEventListener(&#39;click&#39;, () =&amp;gt; {</span></span>
<span class="line"><span>  animator.animate({el: block, start: 100, end: 400}, ({target: {el, start, end}, timing: {p} }) =&amp;gt; {</span></span>
<span class="line"><span>    const left = start * (1 - p) + end * p;</span></span>
<span class="line"><span>    el.style.left = \`\${left}px\`;</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>});</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实现技巧也很简单，我们仍然可以使用线性插值，只不过要对插值参数p做一个函数映射。比如说，如果要让方块做初速度为0的匀加速运动，我们可以将p映射为p^2。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>p = p ** 2;</span></span>
<span class="line"><span>const left = start * (1 - p) + end * p;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>再比如说，如果要让它做末速度为0的匀减速运动，我们可以将p映射为p * (2 - p)。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>p = p * (2 - p);</span></span>
<span class="line"><span>const left = start * (1 - p) + end * p;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>那为什么匀加速、匀减速的时候，p要这样映射呢？要理解这一点，我们就得先来回忆一下，匀加速和匀减速运动的物理计算公式。</p><p>假设，某个物体在做初速度为0的匀加速运动，运动的总时间为T，总位移为S。那么，它在t时刻的位移和加速度的计算公式如下：</p><img src="https://static001.geekbang.org/resource/image/fb/f3/fb1502fd6d2bca1db9921a5847409cf3.jpeg" alt="" title="匀加速运动的计算公式"><p>所以我们把p映射为p的平方。</p><p>还是同样的情况下，如果物体在做匀减速运动，那么，它在t时刻的位移和加速度的计算公式如下：</p><img src="https://static001.geekbang.org/resource/image/5f/d2/5f9726b346e444775080ac98b8e93dd2.jpeg" alt="" title="匀变速运动的计算公式"><p>所以我们把p映射为p(2-p)。</p><p>除此以外，我们还可以将p映射为三次曲线 p * p * (3.0 - 2.0 * p) ，来实现smoothstep的插值效果等等。那为了方便使用以及实现更多的效果，我们可以抽象出一个映射函数专门处理p的映射，这个函数叫做<strong>缓动函数</strong>（Easing Function）。</p><p>我们可以在前面实现过的Timing类中，直接增加一个缓动函数easing。这样在获取p值的时候，我们直接用 this.easing(progress) 取代之前的 progress，就可以让动画变速运动了。修改后的代码如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>export class Timing {</span></span>
<span class="line"><span>  constructor({duration, iterations = 1, easing = p =&amp;gt; p} = {}) {</span></span>
<span class="line"><span>    this.startTime = Date.now();</span></span>
<span class="line"><span>    this.duration = duration;</span></span>
<span class="line"><span>    this.iterations = iterations;</span></span>
<span class="line"><span>    this.easing = easing;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  get time() {</span></span>
<span class="line"><span>    return Date.now() - this.startTime;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  get p() {</span></span>
<span class="line"><span>    const progress = Math.min(this.time / this.duration, this.iterations);</span></span>
<span class="line"><span>    return this.isFinished ? 1 : this.easing(progress % 1);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  get isFinished() {</span></span>
<span class="line"><span>    return this.time / this.duration &amp;gt;= this.iterations;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那带入到具体的例子中，我们只要多给animator传一个easing参数，就可以让一开始匀速运动的小方块变成匀加速运动了。下面就是我们使用这个缓动函数的具体代码：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>import {Animator} from &#39;../common/lib/animator/index.js&#39;;</span></span>
<span class="line"><span>const block = document.querySelector(&#39;.block&#39;);</span></span>
<span class="line"><span>const animator = new Animator({duration: 3000, easing: p =&amp;gt; p ** 2});</span></span>
<span class="line"><span>document.addEventListener(&#39;click&#39;, () =&amp;gt; {</span></span>
<span class="line"><span>  animator.animate({el: block, start: 100, end: 400}, ({target: {el, start, end}, timing: {p} }) =&amp;gt; {</span></span>
<span class="line"><span>    const left = start * (1 - p) + end * p;</span></span>
<span class="line"><span>    el.style.left = \`\${left}px\`;</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>});</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="贝塞尔曲线缓动" tabindex="-1"><a class="header-anchor" href="#贝塞尔曲线缓动"><span>贝塞尔曲线缓动</span></a></h2><p>现在，我们已经缓动函数的应用了。缓动函数有很多种，其中比较常用的是贝塞尔曲线缓动（Bezier-easing），准确地说，是三次贝塞尔曲线缓动函数。接下来，我们就来一起来实现一个简单的贝塞尔曲线缓动。</p><p>我们先来复习一下三次贝塞尔曲线的参数方程：</p><img src="https://static001.geekbang.org/resource/image/50/6e/50dea3d53d0d81a49b6a3cb982629e6e.jpg" alt=""><p>对于贝塞尔曲线图形来说，t是参数，P是坐标。而贝塞尔曲线缓动函数，则是把Px作为时间参数p，把Py作为p的映射。这样，我们就知道了参数方程和缓动函数之间映射关系了。</p><p><a href="https://react.rocks/example/bezier-easing-editor" target="_blank" rel="noopener noreferrer"><img src="https://static001.geekbang.org/resource/image/f7/0b/f764285ab9554604937917e38f7c440b.jpg" alt="" title="贝塞尔缓动函数，图盘来源：React.js"></a></p><p>那要想把三次贝塞尔曲线参数方程变换成贝塞尔曲线缓动函数，我们可以使用一种数学方法，叫做<a href="https://baike.baidu.com/item/%E7%89%9B%E9%A1%BF%E8%BF%AD%E4%BB%A3%E6%B3%95/10887580?fr=aladdin" target="_blank" rel="noopener noreferrer"><strong>牛顿迭代法</strong></a>（Newton’s method）。因为这个方法比较复杂，所以我就不展开细说了。</p><p>我们可以使用现成的JavaScript库<a href="https://github.com/gre/bezier-easing" target="_blank" rel="noopener noreferrer">bezier-easing</a>来生成贝塞尔缓动函数，例如：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>import {Animator} from &#39;../common/lib/animator/index.js&#39;;</span></span>
<span class="line"><span>const block = document.querySelector(&#39;.block&#39;);</span></span>
<span class="line"><span>const animator = new Animator({duration: 3000, easing: BezierEasing(0.5, -1.5, 0.5, 2.5)});</span></span>
<span class="line"><span>document.addEventListener(&#39;click&#39;, () =&amp;gt; {</span></span>
<span class="line"><span>  animator.animate({el: block, start: 100, end: 400}, ({target: {el, start, end}, timing: {p} }) =&amp;gt; {</span></span>
<span class="line"><span>    const left = start * (1 - p) + end * p;</span></span>
<span class="line"><span>    el.style.left = \`\${left}px\`;</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>});</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样，我们能得到如下的效果：</p><img src="https://static001.geekbang.org/resource/image/a8/18/a81289f987f354f7bdd1e983c9472418.gif" alt=""><p>实际上，CSS3动画原生支持bezier-easing。所以上面的效果，我们也可以使用CSS3动画来实现。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>.container {</span></span>
<span class="line"><span>  display: flex;</span></span>
<span class="line"><span>  flex-wrap: wrap;</span></span>
<span class="line"><span>  justify-content: space-between;</span></span>
<span class="line"><span>  width: 300px;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>.block {</span></span>
<span class="line"><span>  width: 100px;</span></span>
<span class="line"><span>  height: 100px;</span></span>
<span class="line"><span>  position: absolute;</span></span>
<span class="line"><span>  top: 100px;</span></span>
<span class="line"><span>  left: 100px;</span></span>
<span class="line"><span>  background: blue;</span></span>
<span class="line"><span>  flex-shrink: 0;</span></span>
<span class="line"><span>  transform-origin: 50% 50%;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>.animate {</span></span>
<span class="line"><span>  animation: mymove 3s cubic-bezier(0.5, -1.5, 0.5, 2.5) forwards;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>@keyframes mymove {</span></span>
<span class="line"><span>  from {left: 100px}</span></span>
<span class="line"><span>  to {left: 400px}</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实贝塞尔缓动函数还有很多种，你可以去<a href="https://easings.net/" target="_blank" rel="noopener noreferrer">easing.net</a>这个网站里看一看，然后尝试利用里面提供的缓动函数，来修改我们例子代码中的效果，看看动画过程有什么不同。</p><h2 id="要点总结" tabindex="-1"><a class="header-anchor" href="#要点总结"><span>要点总结</span></a></h2><p>这节课，我们讲了动画的三种形式和实现它们的基本方法，并且我们重点讨论了由时序动画衍生的标准动画模型，以及在此基础上，利用线性插值和缓动函数来控制更多动画细节。</p><p>首先，我们来回顾一下这三种形式的实现方法和各自的特点：</p><ul><li>第一种，固定帧动画。它实现起来最简单，只需要我们为每一帧准备一张图片，然后循环播放就可以了。</li><li>第二种，增量动画。虽然在实现的时候，我们需要在每帧给元素的相关属性增加一定的量，但也很好操作，就是不好精确控制动画细节。</li><li>第三种是使用时间和动画函数来描述的动画，也叫做时序动画。这种方法能够非常精确地控制动画的细节，所以它能实现的动画效果更丰富，应用最广泛。</li></ul><p>然后，为了更方便使用，我们根据时序动画定义了标准动画模型，实现了Animator类。基于此，我们就可以使用线性插值来实现动画的匀速运动，通过缓动函数来改变动画的运动速度。</p><p>在动画的实现中，比较常用贝塞尔曲线缓动函数。它是通过对贝塞尔曲线方程进行牛顿迭代求出，我们可以使用bezier-easing库来创建贝塞尔缓动函数。CSS3动画原生支持bezier-easing，所以如果使用HTML/CSS方式绘制元素，我们可以尽量使用CSS3动画。</p><h2 id="小试牛刀" tabindex="-1"><a class="header-anchor" href="#小试牛刀"><span>小试牛刀</span></a></h2><p>最后，我希望你能利用我们今天学到的时序动画，来实现一个简单的动画效果。就是我们假设，有一个半径为10px的弹性小球，我们让它以自由落体的方式下落200px高度。在这个过程中，小球每次落地后弹起的高度会是之前的一半，然后它会不断重复自由下落的过程，直到静止在地面上。</p><p>你能试着用标准动画模型封装好的Animator模块，来实现这个效果吗？Animator模块的代码你可以在Github仓库中找到，也可以直接按照我们前面讲解内容自己实现一下。</p><h2 id="源码" tabindex="-1"><a class="header-anchor" href="#源码"><span>源码</span></a></h2><p>本节课的完整示例代码见<a href="https://github.com/akira-cn/graphics/tree/master/animate" target="_blank" rel="noopener noreferrer">GitHub仓库</a></p><h2 id="推荐阅读" tabindex="-1"><a class="header-anchor" href="#推荐阅读"><span>推荐阅读</span></a></h2><p>[1] <a href="https://zh.wikipedia.org/wiki/%E7%89%9B%E9%A1%BF%E6%B3%95" target="_blank" rel="noopener noreferrer">牛顿迭代法</a><br><br> [2] <a href="https://github.com/gre/bezier-easing" target="_blank" rel="noopener noreferrer">Bezier-easing</a><br><br> [3] <a href="https://easings.net/" target="_blank" rel="noopener noreferrer">Easing.net</a></p>`,89)]))}const c=n(p,[["render",l]]),m=JSON.parse('{"path":"/posts/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/%E8%A7%86%E8%A7%89%E9%AB%98%E7%BA%A7%E7%AF%87/18%20_%20%E5%A6%82%E4%BD%95%E7%94%9F%E6%88%90%E7%AE%80%E5%8D%95%E5%8A%A8%E7%94%BB%E8%AE%A9%E5%9B%BE%E5%BD%A2%E5%8A%A8%E8%B5%B7%E6%9D%A5%EF%BC%9F.html","title":"18 _ 如何生成简单动画让图形动起来？","lang":"zh-CN","frontmatter":{"description":"18 _ 如何生成简单动画让图形动起来？ 你好，我是月影。 前面，我们用了3个模块的时间，学习了大量的图形学和数学知识，是不是让你的脑袋有一点昏沉？没关系，你只是需要一点时间来消化这些知识而已。我能给你的建议就是多思考、多练习，有了时间的积累，你一定可以掌握这些基础知识和思维方法。 从这一节课开始，我们要学习一个非常有意思的新模块，那就是动画和3D绘图...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/interview/posts/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/%E8%A7%86%E8%A7%89%E9%AB%98%E7%BA%A7%E7%AF%87/18%20_%20%E5%A6%82%E4%BD%95%E7%94%9F%E6%88%90%E7%AE%80%E5%8D%95%E5%8A%A8%E7%94%BB%E8%AE%A9%E5%9B%BE%E5%BD%A2%E5%8A%A8%E8%B5%B7%E6%9D%A5%EF%BC%9F.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"18 _ 如何生成简单动画让图形动起来？"}],["meta",{"property":"og:description","content":"18 _ 如何生成简单动画让图形动起来？ 你好，我是月影。 前面，我们用了3个模块的时间，学习了大量的图形学和数学知识，是不是让你的脑袋有一点昏沉？没关系，你只是需要一点时间来消化这些知识而已。我能给你的建议就是多思考、多练习，有了时间的积累，你一定可以掌握这些基础知识和思维方法。 从这一节课开始，我们要学习一个非常有意思的新模块，那就是动画和3D绘图..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-08-16T11:19:38.000Z"}],["meta",{"property":"article:modified_time","content":"2025-08-16T11:19:38.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"18 _ 如何生成简单动画让图形动起来？\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-08-16T11:19:38.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1755343178000,"updatedTime":1755343178000,"contributors":[{"name":"bbhou","username":"bbhou","email":"1557740299@qq.com","commits":1,"url":"https://github.com/bbhou"}]},"readingTime":{"minutes":15.03,"words":4509},"filePathRelative":"posts/跟月影学可视化/视觉高级篇/18 _ 如何生成简单动画让图形动起来？.md","localizedDate":"2025年8月16日","excerpt":"\\n<p><audio id=\\"audio\\" title=\\"18 | 如何生成简单动画让图形动起来？\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/e5/f0/e5afca9389433f61e5d12709ebfe23f0.mp3\\"></audio></p>\\n<p>你好，我是月影。</p>\\n<p>前面，我们用了3个模块的时间，学习了大量的图形学和数学知识，是不是让你的脑袋有一点昏沉？没关系，你只是需要一点时间来消化这些知识而已。我能给你的建议就是多思考、多练习，有了时间的积累，你一定可以掌握这些基础知识和思维方法。</p>","autoDesc":true}');export{c as comp,m as data};
