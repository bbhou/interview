import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-BDqOilFQ.js";const l={};function p(t,n){return i(),a("div",null,n[0]||(n[0]=[e(`<h1 id="redis-lua-组合实现分布式限流" tabindex="-1"><a class="header-anchor" href="#redis-lua-组合实现分布式限流"><span>Redis + Lua 组合实现分布式限流</span></a></h1><blockquote><p>作者：老马<br><br>公众号：老马啸西风<br><br> 博客：<a href="https://houbb.github.io/" target="_blank" rel="noopener noreferrer">https://houbb.github.io/</a><br><br> 人生理念：知道的越多，不知道的越多，努力去学</p></blockquote><p>随着互联网公司的高速发展，各种高并发流量业务对系统也产生了巨大冲击</p><p>特别是一些电商公司，经常搞一些大促活动，如：618活动、双十一活动。活动上线前会评估系统承载流量 QPS，并做对应的机器扩容。</p><p>什么事都有个 “但是”，毕竟评估带有主观推测性质。一旦超过了系统最大负载，会把系统冲垮。</p><p>针对这个问题，我们一般的解决策略就是<code>限流</code></p><blockquote><p>限流是保证系统高可用的重要手段！！！</p></blockquote><h2 id="常用的限流算法" tabindex="-1"><a class="header-anchor" href="#常用的限流算法"><span>常用的限流算法</span></a></h2><ol><li><p>计数器限流</p></li><li><p>滑动窗口</p></li><li><p>漏桶限流</p></li><li><p>令牌桶限流</p></li></ol><p>详细介绍，可以看下之前写过一篇文章：<br><a href="https://articles.zsxq.com/id_npaoxri6vgqk.html" target="_blank" rel="noopener noreferrer">https://articles.zsxq.com/id_npaoxri6vgqk.html</a></p><h2 id="单机版限流" tabindex="-1"><a class="header-anchor" href="#单机版限流"><span>单机版限流</span></a></h2><p>单机限流可以借助 <code>Guava</code> 框架提供的令牌桶算法，借助 <code>RateLimiter</code> 类创建一个令牌桶限流器，几行代码就可以快速实现，框架已经帮我们封装好了。</p><p>但是，现在都是分布式架构，单机版限流只能保护单台机器，无法实现一个集群效果，应用场景比较窄。这里就不展开了</p><h2 id="分布式限流" tabindex="-1"><a class="header-anchor" href="#分布式限流"><span>分布式限流</span></a></h2><p>关于分布式限流器，市面也有很多解决方案，今天主要讲解下 <code>Redis</code> 实现方案</p><p>Redis 作为性能加速器，使用场景非常广泛，基于 Redis 实现限流，我们不需要额外引入其他框架，属于轻量方案，适用了中小型公司。</p><div align="left"><img src="https://houbb.github.io/images/arch/case/2-1.png" width="600px"></div><p>其中，一个请求过来后，我们要不要处理，通过一个<code>计数组件 </code>来控制，这个计数器维护在 Redis 中，涉及多次<code>读写</code> 操作，要求具有<code>原子性</code> ，我们希望一次请求的所有命令打包在一起执行，这里引入 Lua 。</p><p>Lua 是一种脚本语言，Redis 脚本使用 Lua 解释器来执行脚本。Redis 2.6 版本内嵌支持 Lua 环境，执行脚本的常用命令为 EVAL</p><p><strong>这里没用使用 Redis 自带事务，相比较而言，Lua 脚本有哪些优点？</strong></p><ul><li>减少网络开销：使用Lua脚本，无需向Redis 发送多次请求，执行一次即可 ，减少网络传输</li><li>原子操作：Redis 将整个Lua脚本作为一个命令执行，原子，无需担心并发</li><li>复用：Lua脚本一旦执行，会永久保存 Redis 中，其他客户端可复用</li></ul><h2 id="代码实现" tabindex="-1"><a class="header-anchor" href="#代码实现"><span>代码实现</span></a></h2><p>1、创建一个 Spring Boot 工程，在 pom.xml 文件中引入 依赖</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;spring-boot-starter&lt;/artifactId&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;spring-boot-starter-web&lt;/artifactId&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;spring-boot-starter-data-redis&lt;/artifactId&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;redis.clients&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;jedis&lt;/artifactId&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;com.google.guava&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;guava&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;21.0&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;spring-boot-starter-aop&lt;/artifactId&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、创建 <code>RedisTemplate</code> 客户端实例</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@Configuration</span></span>
<span class="line"><span>public class RedisConfig {</span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    JedisConnectionFactory jedisConnectionFactory() {</span></span>
<span class="line"><span>        return new JedisConnectionFactory();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    public RedisTemplate&lt;String, Serializable&gt; limitRedisTemplate(RedisConnectionFactory redisConnectionFactory) {</span></span>
<span class="line"><span>        RedisTemplate&lt;String, Serializable&gt; template = new RedisTemplate&lt;&gt;();</span></span>
<span class="line"><span>        template.setKeySerializer(new StringRedisSerializer());</span></span>
<span class="line"><span>        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());</span></span>
<span class="line"><span>        template.setConnectionFactory(redisConnectionFactory);</span></span>
<span class="line"><span>        return template;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3、限流的 Lua 脚本，首先通过 <code>get</code> 命令查询 key 的值，如果超过设定的阈值，返回 0 ，表示限流生效。</p><p>否则，对key 的值计数 +1 ，首次操作需要设置过期时间，表示可以继续业务处理</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>local count</span></span>
<span class="line"><span>count = redis.call(&#39;get&#39;,KEYS[1])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if count and  tonumber(count) &gt;= tonumber(ARGV[1]) then</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>end</span></span>
<span class="line"><span>    count = redis.call(&#39;incr&#39;,KEYS[1])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if tonumber(count) == 1 then</span></span>
<span class="line"><span>    redis.call(&#39;expire&#39;,KEYS[1],ARGV[2])</span></span>
<span class="line"><span>end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>return 1;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>4、 系统初始化时，会加载 Lua 脚本，创建 <code>DefaultRedisScript</code> bean 实例</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@Autowired</span></span>
<span class="line"><span>private RedisTemplate&lt;String, Serializable&gt; limitRedisTemplate;</span></span>
<span class="line"><span>private DefaultRedisScript&lt;Number&gt; redisScript;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@PostConstruct</span></span>
<span class="line"><span>public void init() {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    redisScript = new DefaultRedisScript&lt;&gt;();</span></span>
<span class="line"><span>    redisScript.setResultType(Number.class);</span></span>
<span class="line"><span>    ClassPathResource classPathResource = new ClassPathResource(LIMIT_LUA_PATH);</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        classPathResource.getInputStream();//探测资源是否存在</span></span>
<span class="line"><span>        redisScript.setScriptSource(new ResourceScriptSource(classPathResource));</span></span>
<span class="line"><span>    } catch (IOException e) {</span></span>
<span class="line"><span>        log.error(&quot;未找到文件：{}&quot;, LIMIT_LUA_PATH);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>5、为了开发方便，我们定义了限流注解，哪个方法需要配置限流，只需要在方法上引入这个注解，并配置规则即可</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@Target({ElementType.METHOD, ElementType.TYPE})</span></span>
<span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>@Inherited</span></span>
<span class="line"><span>@Documented</span></span>
<span class="line"><span>public @interface LimiterRule {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String key();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 限流上限阈值</span></span>
<span class="line"><span>    int maxCount();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 过期时间</span></span>
<span class="line"><span>    int limitPeriod();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>6、业务方法被拦截后的增强处理，借助 Spring 的 AOP 切面机制来实现限流</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@Around(&quot;execution(public * *(..)) &amp;&amp; @annotation(com.onyone.limit.annotation.LimiterRule)&quot;)</span></span>
<span class="line"><span>public Object limit(ProceedingJoinPoint pjp) {</span></span>
<span class="line"><span>    MethodSignature signature = (MethodSignature) pjp.getSignature();</span></span>
<span class="line"><span>    Method method = signature.getMethod();</span></span>
<span class="line"><span>    LimiterRule limiterRule = method.getAnnotation(LimiterRule.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String key = limiterRule.key();</span></span>
<span class="line"><span>    int maxCount = limiterRule.maxCount();</span></span>
<span class="line"><span>    int limitPeriod = limiterRule.limitPeriod();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    key = key + System.currentTimeMillis() / 1000;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ImmutableList&lt;String&gt; keys = ImmutableList.of(StringUtils.join(key));</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        Number count = limitRedisTemplate.execute(redisScript, keys, maxCount, limitPeriod);</span></span>
<span class="line"><span>        System.out.println(&quot;limit script result ，count =&quot; + count);</span></span>
<span class="line"><span>        if (count != null &amp;&amp; count.intValue() == 1) {</span></span>
<span class="line"><span>            return pjp.proceed();</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            throw new RuntimeException(&quot;被限流啦........&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } catch (Throwable e) {</span></span>
<span class="line"><span>        if (e instanceof RuntimeException) {</span></span>
<span class="line"><span>            throw new RuntimeException(e.getLocalizedMessage());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        throw new RuntimeException(&quot;服务器出现异常，请稍后再试&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>7、业务模拟方法，每秒只能处理 4个请求，多余的请求会拒绝处理。由于计数 key 维护在 Redis 中，我们为 key 设置了一个过期时间为 20 秒</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 限流规则：5秒内允许通过4个请求</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@LimiterRule(key = &quot;create_order_service_&quot;, maxCount = 4, limitPeriod = 20)</span></span>
<span class="line"><span>@RequestMapping(value = &quot;/create_order&quot;)</span></span>
<span class="line"><span>public String createOrder() {</span></span>
<span class="line"><span>    // 模拟创建订单的业务流程</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return &quot;success&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="压测验证" tabindex="-1"><a class="header-anchor" href="#压测验证"><span>压测验证</span></a></h2><p>关于压测工具，我们使用的是 jmeter 。每秒限制 5 个并发请求，持续 4 轮，总共 20 次请求</p><div align="left"><img src="https://houbb.github.io/images/arch/case/2-8.png" width="600px"></div><p>配置 HTTP 请求接口信息，如：协议、IP、端口、路径、参数等信息</p><div align="left"><img src="https://houbb.github.io/images/arch/case/2-9.png" width="600px"></div><p><strong>压测结果（模拟）</strong></p><p>每次只有 4个 请求能处理成功，后续的请求失败，直到下一个计数器窗口开始，原来的计数清零，又能重新接收并处理请求</p><div align="left"><img src="https://houbb.github.io/images/arch/case/2-10.png" width="600px"></div><p>Spring Boot + AOP + Lua 实现限流是一种简单玩法，也比较实用，当然也可以使用阿里的开源框架 Sentinel，不过要安装一些配置，比这个要复杂些。</p><p>另外，本文演示用的是 <code>计数器限流</code> ，会有边界风险，生产环境建议大家使用 <code>滑动窗口</code> 方式，修改下 Lua 脚本，也不复杂。</p><h2 id="代码地址" tabindex="-1"><a class="header-anchor" href="#代码地址"><span>代码地址</span></a></h2><blockquote><p><a href="https://github.com/aalansehaiyang/redis-limit-demo" target="_blank" rel="noopener noreferrer">https://github.com/aalansehaiyang/redis-limit-demo</a></p></blockquote>`,49)]))}const c=s(l,[["render",p]]),o=JSON.parse('{"path":"/posts/arch/case/Redis%20_%20Lua%20%E7%BB%84%E5%90%88%E5%AE%9E%E7%8E%B0%E5%88%86%E5%B8%83%E5%BC%8F%E9%99%90%E6%B5%81.html","title":"Redis + Lua 组合实现分布式限流","lang":"zh-CN","frontmatter":{"title":"Redis + Lua 组合实现分布式限流","description":"Redis + Lua 组合实现分布式限流 作者：老马 公众号：老马啸西风 博客：https://houbb.github.io/ 人生理念：知道的越多，不知道的越多，努力去学 随着互联网公司的高速发展，各种高并发流量业务对系统也产生了巨大冲击 特别是一些电商公司，经常搞一些大促活动，如：618活动、双十一活动。活动上线前会评估系统承载流量 QPS，并...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/interview/posts/arch/case/Redis%20_%20Lua%20%E7%BB%84%E5%90%88%E5%AE%9E%E7%8E%B0%E5%88%86%E5%B8%83%E5%BC%8F%E9%99%90%E6%B5%81.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"Redis + Lua 组合实现分布式限流"}],["meta",{"property":"og:description","content":"Redis + Lua 组合实现分布式限流 作者：老马 公众号：老马啸西风 博客：https://houbb.github.io/ 人生理念：知道的越多，不知道的越多，努力去学 随着互联网公司的高速发展，各种高并发流量业务对系统也产生了巨大冲击 特别是一些电商公司，经常搞一些大促活动，如：618活动、双十一活动。活动上线前会评估系统承载流量 QPS，并..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-08-16T11:28:53.000Z"}],["meta",{"property":"article:modified_time","content":"2025-08-16T11:28:53.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Redis + Lua 组合实现分布式限流\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-08-16T11:28:53.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1755343733000,"updatedTime":1755343733000,"contributors":[{"name":"bbhou","username":"bbhou","email":"1557740299@qq.com","commits":1,"url":"https://github.com/bbhou"}]},"readingTime":{"minutes":5.17,"words":1551},"filePathRelative":"posts/arch/case/Redis + Lua 组合实现分布式限流.md","localizedDate":"2025年8月16日","excerpt":"\\n<blockquote>\\n<p>作者：老马<br>\\n<br>公众号：老马啸西风<br>\\n<br> 博客：<a href=\\"https://houbb.github.io/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://houbb.github.io/</a><br>\\n<br> 人生理念：知道的越多，不知道的越多，努力去学</p>\\n</blockquote>\\n<p>随着互联网公司的高速发展，各种高并发流量业务对系统也产生了巨大冲击</p>\\n<p>特别是一些电商公司，经常搞一些大促活动，如：618活动、双十一活动。活动上线前会评估系统承载流量 QPS，并做对应的机器扩容。</p>","autoDesc":true}');export{c as comp,o as data};
