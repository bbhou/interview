import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-BDqOilFQ.js";const p={};function l(t,s){return i(),a("div",null,s[0]||(s[0]=[e(`<h1 id="搞了个线上故障-被老板骂了" tabindex="-1"><a class="header-anchor" href="#搞了个线上故障-被老板骂了"><span>搞了个线上故障，被老板骂了....</span></a></h1><blockquote><p>作者：老马<br><br>公众号：老马啸西风<br><br> 博客：<a href="https://houbb.github.io/" target="_blank" rel="noopener noreferrer">https://houbb.github.io/</a><br><br> 人生理念：知道的越多，不知道的越多，努力去学</p></blockquote><h2 id="背景" tabindex="-1"><a class="header-anchor" href="#背景"><span>背景</span></a></h2><p>大家好，我是老马。</p><p>前几天跟一位小伙伴聊天，心情特别沮丧，刚被老板骂完.....</p><p>差点丢了饭碗，还好老板没说 “滚”。就今年这就业行情，满眼都是泪哇</p><div align="left"><img src="https://houbb.github.io/images/arch/case/6-1.png" width="200px"></div><p>这位小伙伴在一家初创公司，团队规模很小，老板为了节省成本，没有配置什么豪华团队</p><p>他的工作时间并不长，负责交易订单，前几天接到用户投诉，说「我的订单列表」有多条一模一样的订单</p><p>虽没造成什么资损，但严重影响用户体验</p><p><strong>看到这里，有经验的同学可能猜到，应该是接口没做防重控制</strong></p><p>日常开发中，重复提交也是蛮常见问题</p><p>比如：用户提交一个表单，鼠标点的太快，正好前端又是个新兵蛋子，没做任何控制，瞬间就会有多个请求发到后端系统</p><p>如果后端同学也没做兜底方案的话，悲剧就发生了</p><p>常见的解决方案是借助数据库自身的「唯一索引约束」，来保证数据的准确性，这种方案一般在插入场景用的多些；变种方案也可以考虑单独创建一个防重表</p><p>本文的案例有点特殊，订单号是后端系统生成的，前后两次请求无法区分重复状态，所以系统会创建两条不同订单 ID 记录，绕过了「唯一索引约束」这个限制，这.....</p><div align="left"><img src="https://houbb.github.io/images/arch/case/6-2.png" width="200px"></div><p>另外，MySQL 性能也单薄了点，单机 QPS 在「千」维度，如果是面对一个高并发接口，性能也有点吃紧</p><p>接下来，我们就来讲下，借助 Redis 来实现接口防重复提交</p><h2 id="技术方案" tabindex="-1"><a class="header-anchor" href="#技术方案"><span>技术方案</span></a></h2><p>首先，我们来看下整理的流程，如下图所示</p><div align="left"><img src="https://houbb.github.io/images/arch/case/6-3.png" width="550px"></div><p><strong>大致步骤：</strong></p><p>1、客户端发送请求到服务端</p><p>2、服务端接收请求，然后从请求参数中提取唯一标识。这个标识可以没有什么特殊业务含义，client 端随机生成即可</p><p>3、服务端系统将唯一标识先尝试写入 Redis 缓存中，可以认为是加锁操作</p><p>4、加锁失败，说明请求还在处理，此次是重复请求，可以丢弃</p><p>5、加锁成功，继续后面正常业务逻辑处理</p><p>6、业务逻辑处理完成后，删除加锁的标记</p><p>7、最后，将处理成功的结果返回给客户端</p><p><strong>注意：</strong></p><ul><li>重复提交场景一般都是在极短时间内，同时发送了多次请求（比如：页面表单重复提交），我们只认第一次请求为有效请求</li><li>锁用完后，要记得手动删除。为了防止锁没有正常释放，我们可以为锁设置一个极短的过期时间（比如 10 秒）</li></ul><h2 id="代码实战" tabindex="-1"><a class="header-anchor" href="#代码实战"><span>代码实战</span></a></h2><h3 id="_1、引入-redis-组件" tabindex="-1"><a class="header-anchor" href="#_1、引入-redis-组件"><span>1、引入 redis 组件</span></a></h3><p>实战的项目采用 Spring Boot 搭建，这里需要引入 Redis 相关依赖</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;spring-boot-starter-data-redis&lt;/artifactId&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;redis.clients&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;jedis&lt;/artifactId&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2、redis-变量配置" tabindex="-1"><a class="header-anchor" href="#_2、redis-变量配置"><span>2、redis 变量配置</span></a></h3><p>application.properties 配置文件中，添加redis相关服务配置</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>spring.redis.host=127.0.0.1</span></span>
<span class="line"><span>spring.redis.port=6379</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3、防重复注解类" tabindex="-1"><a class="header-anchor" href="#_3、防重复注解类"><span>3、防重复注解类</span></a></h3><p>定义一个注解，配置在需要防重复的接口方法上，提高开发效率，同时降低代码的耦合度</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>@Target({ElementType.METHOD})</span></span>
<span class="line"><span>@Documented</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public @interface IdempotentRule {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 业务自定义前缀</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    String prefix() default &quot;&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 业务重复标识</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    String key() default &quot;&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4、接口拦截器" tabindex="-1"><a class="header-anchor" href="#_4、接口拦截器"><span>4、接口拦截器</span></a></h3><p>上面定义了<code>IdempotentRule</code>注解，需要通过<code>拦截器</code>对正常的业务方法做拦截，增加一些特殊逻辑处理</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>@Aspect</span></span>
<span class="line"><span>@Component</span></span>
<span class="line"><span>@Slf4j</span></span>
<span class="line"><span>public class IdempotentAspect {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    private RedisTemplate&lt;String, Serializable&gt; idempotentRedisTemplate;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Around(&quot;execution(public * *(..)) &amp;&amp; @annotation(com.onyone.idempotent.annotation.IdempotentRule)&quot;)</span></span>
<span class="line"><span>    public Object limit(ProceedingJoinPoint pjp) {</span></span>
<span class="line"><span>        MethodSignature signature = (MethodSignature) pjp.getSignature();</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Object[] params = pjp.getArgs();</span></span>
<span class="line"><span>        String[] paramNames = signature.getParameterNames();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Method method = signature.getMethod();</span></span>
<span class="line"><span>        IdempotentRule idempotentRule = method.getAnnotation(IdempotentRule.class);</span></span>
<span class="line"><span>        String key = idempotentRule.key();</span></span>
<span class="line"><span>        String prefix = idempotentRule.prefix();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        ExpressionParser parser = new SpelExpressionParser();</span></span>
<span class="line"><span>        EvaluationContext context = new StandardEvaluationContext();</span></span>
<span class="line"><span>        context.setVariable(paramNames[0], params[0]);</span></span>
<span class="line"><span>        String repeatKey = (String) parser.parseExpression(key).getValue(context);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            // 先在缓存中做个标记</span></span>
<span class="line"><span>            Boolean lockResult = idempotentRedisTemplate.opsForValue().setIfAbsent(prefix + repeatKey, &quot;正在处理....&quot;, 20, TimeUnit.SECONDS);</span></span>
<span class="line"><span>            if (lockResult) {</span></span>
<span class="line"><span>                // 业务逻辑处理</span></span>
<span class="line"><span>                return pjp.proceed();</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                throw new Exception(&quot;重复提交..................&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } catch (Throwable e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            // 处理完成后，将标记删除</span></span>
<span class="line"><span>            idempotentRedisTemplate.delete(prefix + repeatKey);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里，比较特殊的是提取请求的唯一标识，由于不同的业务请求唯一标识不一样。<br> 所以，这里采用<code> SPEL 表达式</code>，将规则设置能力开放出去，由业务方自己定义，比如：</p><blockquote><p>@IdempotentRule(key = &quot;#userParam.cardNumber&quot;, prefix = &quot;repeat_&quot;)</p></blockquote><p>拦截器根据 SPEL 表达式（ 如 &quot;#userParam.cardNumber&quot;）以及请求参数对象，计算当前请求唯一标识的值，<br> 然后将值写入 Redis 中，并设置过时间。<br> 如果设置成功，说明是第一次请求，继续下面的业务逻辑处理；否则，判定为重复请求，直接丢弃。</p><h3 id="_5、上层业务接口" tabindex="-1"><a class="header-anchor" href="#_5、上层业务接口"><span>5、上层业务接口</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@RestController</span></span>
<span class="line"><span>@RequestMapping(&quot;/user&quot;)</span></span>
<span class="line"><span>public class UserController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 创建一个新的用户</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @RequestMapping(value = &quot;/create_user&quot;)</span></span>
<span class="line"><span>    @IdempotentRule(key = &quot;#userParam.cardNumber&quot;, prefix = &quot;repeat_&quot;)</span></span>
<span class="line"><span>    public String createUser(@RequestBody UserParam userParam) {</span></span>
<span class="line"><span>        // 模拟业务处理</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return &quot;创建用户成功！&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Data</span></span>
<span class="line"><span>public class UserParam {</span></span>
<span class="line"><span>    private String cardNumber;</span></span>
<span class="line"><span>    private String name;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="测试结果" tabindex="-1"><a class="header-anchor" href="#测试结果"><span>测试结果</span></a></h2><p>1、构造客户端请求，第一次处理成功</p><div align="left"><img src="https://houbb.github.io/images/arch/case/6-4.png" width="600px"></div><p>2、 Redis 缓存中，能查到请求设置的锁标记</p><div align="left"><img src="https://houbb.github.io/images/arch/case/6-5.png" width="600px"></div><p>3、模拟重复，连续多次快速提交请求，请求会被拦截，并抛出异常</p><div align="left"><img src="https://houbb.github.io/images/arch/case/6-6.png" width="700px"></div><h2 id="代码地址" tabindex="-1"><a class="header-anchor" href="#代码地址"><span>代码地址</span></a></h2><p><a href="https://github.com/aalansehaiyang/redis-limit-demo" target="_blank" rel="noopener noreferrer">https://github.com/aalansehaiyang/redis-limit-demo</a></p>`,59)]))}const c=n(p,[["render",l]]),o=JSON.parse('{"path":"/posts/arch/case/%E6%90%9E%E4%BA%86%E4%B8%AA%E7%BA%BF%E4%B8%8A%E6%95%85%E9%9A%9C%EF%BC%8C%E8%A2%AB%E8%80%81%E6%9D%BF%E9%AA%82%E4%BA%86.html","title":"搞了个线上故障，被老板骂了....","lang":"zh-CN","frontmatter":{"title":"搞了个线上故障，被老板骂了....","description":"搞了个线上故障，被老板骂了.... 作者：老马 公众号：老马啸西风 博客：https://houbb.github.io/ 人生理念：知道的越多，不知道的越多，努力去学 背景 大家好，我是老马。 前几天跟一位小伙伴聊天，心情特别沮丧，刚被老板骂完..... 差点丢了饭碗，还好老板没说 “滚”。就今年这就业行情，满眼都是泪哇 这位小伙伴在一家初创公司，团...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/interview/posts/arch/case/%E6%90%9E%E4%BA%86%E4%B8%AA%E7%BA%BF%E4%B8%8A%E6%95%85%E9%9A%9C%EF%BC%8C%E8%A2%AB%E8%80%81%E6%9D%BF%E9%AA%82%E4%BA%86.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"搞了个线上故障，被老板骂了...."}],["meta",{"property":"og:description","content":"搞了个线上故障，被老板骂了.... 作者：老马 公众号：老马啸西风 博客：https://houbb.github.io/ 人生理念：知道的越多，不知道的越多，努力去学 背景 大家好，我是老马。 前几天跟一位小伙伴聊天，心情特别沮丧，刚被老板骂完..... 差点丢了饭碗，还好老板没说 “滚”。就今年这就业行情，满眼都是泪哇 这位小伙伴在一家初创公司，团..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-08-16T11:28:53.000Z"}],["meta",{"property":"article:modified_time","content":"2025-08-16T11:28:53.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"搞了个线上故障，被老板骂了....\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-08-16T11:28:53.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1755343733000,"updatedTime":1755343733000,"contributors":[{"name":"bbhou","username":"bbhou","email":"1557740299@qq.com","commits":1,"url":"https://github.com/bbhou"}]},"readingTime":{"minutes":4.9,"words":1471},"filePathRelative":"posts/arch/case/搞了个线上故障，被老板骂了.md","localizedDate":"2025年8月16日","excerpt":"\\n<blockquote>\\n<p>作者：老马<br>\\n<br>公众号：老马啸西风<br>\\n<br> 博客：<a href=\\"https://houbb.github.io/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://houbb.github.io/</a><br>\\n<br> 人生理念：知道的越多，不知道的越多，努力去学</p>\\n</blockquote>\\n<h2>背景</h2>\\n<p>大家好，我是老马。</p>\\n<p>前几天跟一位小伙伴聊天，心情特别沮丧，刚被老板骂完.....</p>\\n<p>差点丢了饭碗，还好老板没说 “滚”。就今年这就业行情，满眼都是泪哇</p>","autoDesc":true}');export{c as comp,o as data};
