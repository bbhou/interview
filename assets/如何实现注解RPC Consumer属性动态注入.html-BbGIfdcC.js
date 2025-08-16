import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-BDqOilFQ.js";const p={};function l(r,n){return i(),a("div",null,n[0]||(n[0]=[e(`<h1 id="如何实现注解-rpc-consumer属性动态注入" tabindex="-1"><a class="header-anchor" href="#如何实现注解-rpc-consumer属性动态注入"><span>如何实现注解 RPC Consumer属性动态注入</span></a></h1><blockquote><p>作者：老马<br><br>公众号：老马啸西风<br><br> 博客：<a href="https://houbb.github.io/" target="_blank" rel="noopener noreferrer">https://houbb.github.io/</a><br><br> 人生理念：知道的越多，不知道的越多，努力去学</p></blockquote><hr><p>分布式系统架构时代，RPC框架你一定不会陌生。目前主流的RPC框架有 dubbo、thrift、motan、grpc等。</p><p>消费端（RPC Consumer）通常只有服务接口定义，接口的业务逻辑实现部署在生产端（RPC Provider），服务调用一般是采用动态代理方式，通过Proxy创建一个代理类，借助增强方式完成网络的远程调用，获取执行结果。</p><h2 id="两个关键点" tabindex="-1"><a class="header-anchor" href="#两个关键点"><span>两个关键点</span></a></h2><p>1、如何实现一个通用的代理类？</p><p>2、如何在消费端动态注入接口的代理对象？</p><h2 id="如何实现一个通用的代理类" tabindex="-1"><a class="header-anchor" href="#如何实现一个通用的代理类"><span>如何实现一个通用的代理类？</span></a></h2><p>目前动态代理的实现方案有很多种，如JDK 动态代理、Cglib、Javassist、ASM、Byte Buddy等</p><p>JDK 动态代理的代理类是运行时通过字节码生成的，我们通过Proxy.newProxyInstance方法获取的接口实现类就是这个字节码生成的代理类</p><p>定义代理类<code>RpcInvocationHandler</code>，继承<code>InvocationHandler</code>接口，并重写invoke()方法。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class RpcInvocationHandler implements InvocationHandler {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private final String serviceVersion;</span></span>
<span class="line"><span>    private final long timeout;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public RpcInvocationHandler(String serviceVersion, long timeout) {</span></span>
<span class="line"><span>        this.serviceVersion = serviceVersion;</span></span>
<span class="line"><span>        this.timeout = timeout;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Object invoke(Object proxy, Method method, Object[] args) {</span></span>
<span class="line"><span>        // todo</span></span>
<span class="line"><span>        // 1、封装RpcProtocol对象</span></span>
<span class="line"><span>        // 2、对象编码</span></span>
<span class="line"><span>        // 3、发送请求到服务端</span></span>
<span class="line"><span>        // 4、获取返回结果</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 模拟生成一个订单号</span></span>
<span class="line"><span>        Long orderId = Long.valueOf(new Random().nextInt(100));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        String s = String.format(&quot;【RpcInvocationHandler】 调用方法：%s , 参数：%s ,订单id：%d&quot;, method.getName(), JSON.toJSONString(args), orderId);</span></span>
<span class="line"><span>        System.out.println(s);</span></span>
<span class="line"><span>        return orderId;</span></span>
<span class="line"><span>    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="如何在消费端动态注入接口的代理对象" tabindex="-1"><a class="header-anchor" href="#如何在消费端动态注入接口的代理对象"><span>如何在消费端动态注入接口的代理对象？</span></a></h2><p>构造一个自定义Bean，并对该Bean下执行的所有方法拦截，增加额外处理逻辑。</p><div align="left"><img src="https://houbb.github.io/images/spring/spring/1-1.jpg" width="600px"></div><blockquote><p><code>OrderService</code>是一个订单接口类，client端没有该接口的实现类。</p></blockquote><p>定义注解<code>@RpcReference</code>，用于描述代理类的参数信息。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>@Target(ElementType.FIELD)</span></span>
<span class="line"><span>@Autowired</span></span>
<span class="line"><span>public @interface RpcReference {</span></span>
<span class="line"><span>    String serviceVersion() default &quot;1.0&quot;;</span></span>
<span class="line"><span>    long timeout() default 5000;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Spring 的 FactoryBean 接口可以帮助我们实现自定义的 Bean，FactoryBean 是一种特殊的工厂 Bean，通过 getObject() 方法返回对象，而并不是 FactoryBean 本身。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class RpcReferenceBean implements FactoryBean&lt;Object&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private Class&lt;?&gt; interfaceClass;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private String serviceVersion;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private long timeout;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private Object object;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Object getObject() throws Exception {</span></span>
<span class="line"><span>        return object;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Class&lt;?&gt; getObjectType() {</span></span>
<span class="line"><span>        return interfaceClass;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void init() throws Exception {</span></span>
<span class="line"><span>        object = Proxy.newProxyInstance(</span></span>
<span class="line"><span>                interfaceClass.getClassLoader(),</span></span>
<span class="line"><span>                new Class&lt;?&gt;[]{interfaceClass},</span></span>
<span class="line"><span>                new RpcInvocationHandler(serviceVersion, timeout));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是 <code>RpcReferenceBean</code>如何被spring容器识别并加载呢？需要借助Spring的其他扩展点：</p><p>1、<code>BeanFactoryPostProcessor</code>，在Spring 容器加载 Bean 的定义之后以及 Bean 实例化之前执行，方便用户对 Bean 的配置元数据进行二次修改。</p><p>2、<code>ApplicationContextAware</code>，通过它Spring容器会自动把上下文环境对象调用ApplicationContextAware接口中的setApplicationContext方法。通过ApplicationContext可以查找Spring容器中的Bean对象。</p><p>3、<code>BeanClassLoaderAware</code>, 获取 Bean 的类加载器</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class RpcConsumerPostProcessor implements ApplicationContextAware, BeanClassLoaderAware, BeanFactoryPostProcessor {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private ApplicationContext applicationContext;</span></span>
<span class="line"><span>    private ClassLoader classLoader;</span></span>
<span class="line"><span>    private final Map&lt;String, BeanDefinition&gt; rpcBeanDefinitions = new LinkedHashMap&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {</span></span>
<span class="line"><span>        this.applicationContext = applicationContext;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void setBeanClassLoader(ClassLoader classLoader) {</span></span>
<span class="line"><span>        this.classLoader = classLoader;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {</span></span>
<span class="line"><span>        for (String beanDefinitionName : beanFactory.getBeanDefinitionNames()) {</span></span>
<span class="line"><span>            BeanDefinition beanDefinition = beanFactory.getBeanDefinition(beanDefinitionName);</span></span>
<span class="line"><span>            String beanClassName = beanDefinition.getBeanClassName();</span></span>
<span class="line"><span>            if (beanClassName != null) {</span></span>
<span class="line"><span>                Class&lt;?&gt; clazz = ClassUtils.resolveClassName(beanClassName, this.classLoader);</span></span>
<span class="line"><span>                ReflectionUtils.doWithFields(clazz, this::parseRpcReference);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 自定义bean注册到容器中</span></span>
<span class="line"><span>        BeanDefinitionRegistry registry = (BeanDefinitionRegistry) beanFactory;</span></span>
<span class="line"><span>        this.rpcBeanDefinitions.forEach((beanName, beanDefinition) -&gt; {</span></span>
<span class="line"><span>            if (applicationContext.containsBean(beanName)) {</span></span>
<span class="line"><span>                throw new IllegalArgumentException(&quot;spring context already has a bean named &quot; + beanName);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            registry.registerBeanDefinition(beanName, beanDefinition);</span></span>
<span class="line"><span>            System.out.println(String.format(&quot;registered RpcReferenceBean %s success!&quot;, beanName));</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void parseRpcReference(Field field) {</span></span>
<span class="line"><span>        RpcReference annotation = AnnotationUtils.getAnnotation(field, RpcReference.class);</span></span>
<span class="line"><span>        if (annotation != null) {</span></span>
<span class="line"><span>            // 创建RpcReferenceBean类的Bean定义</span></span>
<span class="line"><span>            BeanDefinitionBuilder beanDefinitionBuilder = BeanDefinitionBuilder.genericBeanDefinition(RpcReferenceBean.class);</span></span>
<span class="line"><span>            beanDefinitionBuilder.setInitMethodName(&quot;init&quot;);</span></span>
<span class="line"><span>            beanDefinitionBuilder.addPropertyValue(&quot;interfaceClass&quot;, field.getType());</span></span>
<span class="line"><span>            beanDefinitionBuilder.addPropertyValue(&quot;serviceVersion&quot;, annotation.serviceVersion());</span></span>
<span class="line"><span>            beanDefinitionBuilder.addPropertyValue(&quot;timeout&quot;, annotation.timeout());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            BeanDefinition beanDefinition = beanDefinitionBuilder.getBeanDefinition();</span></span>
<span class="line"><span>            rpcBeanDefinitions.put(field.getName(), beanDefinition);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>RpcConsumerPostProcessor</code> 从 beanFactory 中获取所有 Bean 的定义信息，然后对每个Bean下的field检测，如果field被声明了<code>@RpcReference</code>注解，通过<code>BeanDefinitionBuilder</code>重新构造<br><code>RpcReferenceBean</code>的定义，并为成员变量赋值。</p><p>最后借助<code>BeanDefinitionRegistry</code>将新定义的Bean重新注册到Spring容器中。由容器来实例化Bean对象，并完成IOC依赖注入</p><h2 id="项目源码" tabindex="-1"><a class="header-anchor" href="#项目源码"><span>项目源码</span></a></h2><p><a href="https://github.com/aalansehaiyang/spring-boot-example/tree/master/spring-rpc-reference" target="_blank" rel="noopener noreferrer">https://github.com/aalansehaiyang/spring-boot-example/tree/master/spring-rpc-reference</a></p>`,30)]))}const d=s(p,[["render",l]]),o=JSON.parse('{"path":"/posts/spring/spring/%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0%E6%B3%A8%E8%A7%A3RPC%20Consumer%E5%B1%9E%E6%80%A7%E5%8A%A8%E6%80%81%E6%B3%A8%E5%85%A5.html","title":"如何实现注解 RPC Consumer属性动态注入","lang":"zh-CN","frontmatter":{"title":"如何实现注解 RPC Consumer属性动态注入","description":"如何实现注解 RPC Consumer属性动态注入 作者：老马 公众号：老马啸西风 博客：https://houbb.github.io/ 人生理念：知道的越多，不知道的越多，努力去学 分布式系统架构时代，RPC框架你一定不会陌生。目前主流的RPC框架有 dubbo、thrift、motan、grpc等。 消费端（RPC Consumer）通常只有服务...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/interview/posts/spring/spring/%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0%E6%B3%A8%E8%A7%A3RPC%20Consumer%E5%B1%9E%E6%80%A7%E5%8A%A8%E6%80%81%E6%B3%A8%E5%85%A5.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"如何实现注解 RPC Consumer属性动态注入"}],["meta",{"property":"og:description","content":"如何实现注解 RPC Consumer属性动态注入 作者：老马 公众号：老马啸西风 博客：https://houbb.github.io/ 人生理念：知道的越多，不知道的越多，努力去学 分布式系统架构时代，RPC框架你一定不会陌生。目前主流的RPC框架有 dubbo、thrift、motan、grpc等。 消费端（RPC Consumer）通常只有服务..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-08-16T11:28:53.000Z"}],["meta",{"property":"article:modified_time","content":"2025-08-16T11:28:53.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"如何实现注解 RPC Consumer属性动态注入\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-08-16T11:28:53.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1755343733000,"updatedTime":1755343733000,"contributors":[{"name":"bbhou","username":"bbhou","email":"1557740299@qq.com","commits":1,"url":"https://github.com/bbhou"}]},"readingTime":{"minutes":3.36,"words":1009},"filePathRelative":"posts/spring/spring/如何实现注解RPC Consumer属性动态注入.md","localizedDate":"2025年8月16日","excerpt":"\\n<blockquote>\\n<p>作者：老马<br>\\n<br>公众号：老马啸西风<br>\\n<br> 博客：<a href=\\"https://houbb.github.io/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://houbb.github.io/</a><br>\\n<br> 人生理念：知道的越多，不知道的越多，努力去学</p>\\n</blockquote>\\n<hr>\\n<p>分布式系统架构时代，RPC框架你一定不会陌生。目前主流的RPC框架有 dubbo、thrift、motan、grpc等。</p>\\n<p>消费端（RPC Consumer）通常只有服务接口定义，接口的业务逻辑实现部署在生产端（RPC Provider），服务调用一般是采用动态代理方式，通过Proxy创建一个代理类，借助增强方式完成网络的远程调用，获取执行结果。</p>","autoDesc":true}');export{d as comp,o as data};
