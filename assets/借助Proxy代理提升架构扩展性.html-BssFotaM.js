import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-BDqOilFQ.js";const l={};function p(r,s){return i(),a("div",null,s[0]||(s[0]=[e(`<h1 id="如何借助proxy代理-提升架构扩展性" tabindex="-1"><a class="header-anchor" href="#如何借助proxy代理-提升架构扩展性"><span>如何借助Proxy代理，提升架构扩展性</span></a></h1><blockquote><p>作者：老马<br><br>公众号：老马啸西风<br><br> 博客：<a href="https://houbb.github.io/" target="_blank" rel="noopener noreferrer">https://houbb.github.io/</a><br><br> 人生理念：知道的越多，不知道的越多，努力去学</p></blockquote><hr><p>我们都知道<strong>HTTP协议</strong>本身是无状态的，前后两次请求没有直接关联。</p><p>但有些业务功能比较特殊，比如发起一次http请求创建一笔订单，前提要求用户先登录，为了解决这个问题，http协议header中引入了Cookie，存储上下文信息，传递登录状态。</p><p>同理，服务器也有状态之分，取决于服务器是否有存储数据，还是纯计算节点</p><div align="left"><img src="https://houbb.github.io/images/spring/spring/3-1.jpg" width="600px"></div><h2 id="业务场景" tabindex="-1"><a class="header-anchor" href="#业务场景"><span>业务场景</span></a></h2><p>现在有这么一个业务场景，用户发出请求，指令随机打到了一台服务器，比如<code>174.56.102.101</code>，但根据索引条件，数据实际存储在 <code>174.56.102.102</code> 或者 <code>174.56.102.103</code>，此时<code>174.56.102.101 </code> 需要将请求转发给真实的目标服务器，以便获取数据。</p><p>当然也有一定概率，<code>174.56.102.101</code>就是真实的数据存储服务器，此时只需要调用本地方法，直接获取数据即可。</p><p><strong>思考：</strong></p><p>那么问题来了，一个系统会提供很多功能函数，每个函数在执行时，都要先判断数据的真实存储位置，然后再发起远程网络请求，获取数据。这样编写存在大量的代码冗余。</p><p>有没有一种方式，只管调用对应的<code>funcion函数</code>，至于底层真实数据在哪里，<strong>由框架层来处理</strong>。</p><p>我们想到了RPC框架，比如 <code>Dubbo</code>，对于开发者而言，调用一个远程服务跟调用本地方法一样，简单方便。</p><div align="left"><img src="https://houbb.github.io/images/spring/spring/3-3.jpg" width="600px"></div><h2 id="如何来设计这个框架层" tabindex="-1"><a class="header-anchor" href="#如何来设计这个框架层"><span>如何来设计这个框架层</span></a></h2><p>从大的角色划分来看，分为服务提供方和消费方，首先我们来看看消费方如何设计？</p><h3 id="消费方" tabindex="-1"><a class="header-anchor" href="#消费方"><span>消费方</span></a></h3><p>定义注解类 <code>@RPCReference</code>，作为<code>Field</code>字段的属性说明，如果有此标识说明注入的是一个代理类。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@Service</span></span>
<span class="line"><span>@Slf4j</span></span>
<span class="line"><span>public class ComputeService {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @RPCReference</span></span>
<span class="line"><span>    private IResourceService iResourceService;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>省略。。。。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public Object method(param){</span></span>
<span class="line"><span>		 // 正常方法调用</span></span>
<span class="line"><span>		 iResourceService.m1();</span></span>
<span class="line"><span>	}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>特别说明：<br><br> 1、IResourceService 需要定义为接口类型<br><br> 2、根据Spring的 IOC 注入机制，<code>iResourceService</code>指向的是一个代理类实例地址</p></blockquote><h3 id="那么这个代理类如何创建" tabindex="-1"><a class="header-anchor" href="#那么这个代理类如何创建"><span>那么这个代理类如何创建？</span></a></h3><p>首先，定义一个增强类 <code>ConsumerProxyFactory</code>，实现<code>InvocationHandler</code>接口</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@Slf4j</span></span>
<span class="line"><span>public class ConsumerProxyFactory implements InvocationHandler {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 复写InvocationHandler类提供的方法，业务类方法调用会触发执行invoke增强逻辑</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {</span></span>
<span class="line"><span>        Class&lt;?&gt; clazz = proxy.getClass().getInterfaces()[0];</span></span>
<span class="line"><span>        if (method.getName().contains(&quot;toString&quot;)) {</span></span>
<span class="line"><span>            return Boolean.TRUE;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 根据args参数做判断</span></span>
<span class="line"><span>        if (当前节点) {</span></span>
<span class="line"><span>            // 调用本地方法</span></span>
<span class="line"><span>            return invodeMethod(clazz, method, args);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 否则走rpc远程调用</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 构造请求体</span></span>
<span class="line"><span>        RPCRequest req = buildRpcReq(clazz, method, args);</span></span>
<span class="line"><span>        // 构造请求头</span></span>
<span class="line"><span>        Map&lt;String, String&gt; headerMap = buildHeaderMap( requestString);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 访问远程服务器的接口，查询结果</span></span>
<span class="line"><span>        String responseString = HttpClientUtil.postRequest(url, req, headerMap);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 本地ThreadLocal资源清理、释放</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 反序列化，解析出Return对象</span></span>
<span class="line"><span>        return JSONObject.parseObject(responseString, method.getGenericReturnType());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 执行当前节点的本地方法</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private Object invodeMethod(Class&lt;?&gt; clazz, Method method, Object[] args) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            // 根据Class模板查询Bean实例</span></span>
<span class="line"><span>            Object bean =ProviderContext.getProviders(clazz);</span></span>
<span class="line"><span>            if (Void.TYPE.equals(method.getReturnType())) {</span></span>
<span class="line"><span>                method.invoke(bean, args);</span></span>
<span class="line"><span>                return null;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            Object result = method.invoke(bean, args);</span></span>
<span class="line"><span>            return result;</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            return e.getMessage();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 构造请求体</span></span>
<span class="line"><span>    private RPCRequest buildRpcReq(Class&lt;?&gt; clazz, Method method, Object[] args) {</span></span>
<span class="line"><span>        Class&lt;?&gt;[] parameterTypes = method.getParameterTypes();</span></span>
<span class="line"><span>        String[] parameterTypeNames = Arrays.stream(parameterTypes).map(Class::getName).toArray(String[]::new);</span></span>
<span class="line"><span>        Type[] listParameterType = method.getGenericParameterTypes();</span></span>
<span class="line"><span>        String[] listParameterTypeNames = Arrays.stream(listParameterType).map(Type::getTypeName).toArray(String[]::new);</span></span>
<span class="line"><span>        RPCRequest req = new RPCRequest();</span></span>
<span class="line"><span>        req.setClazz(clazz);</span></span>
<span class="line"><span>        req.setMethodName(method.getName());</span></span>
<span class="line"><span>        req.setParameterTypeNames(parameterTypeNames);</span></span>
<span class="line"><span>        req.setListParameterTypeNames(listParameterTypeNames);</span></span>
<span class="line"><span>        req.setArguments(args);</span></span>
<span class="line"><span>        req.setTt(System.currentTimeMillis());</span></span>
<span class="line"><span>        省略一些业务参数。。</span></span>
<span class="line"><span>        return req;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="代理类如何注入" tabindex="-1"><a class="header-anchor" href="#代理类如何注入"><span>代理类如何注入？</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@Component</span></span>
<span class="line"><span>@Slf4j</span></span>
<span class="line"><span>public class RPCReferenceBeanPostProcessor implements BeanPostProcessor, ApplicationContextAware {</span></span>
<span class="line"><span>    private ApplicationContext applicationContext;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {</span></span>
<span class="line"><span>        // spring容器初始化时，拦截每一个Bean创建</span></span>
<span class="line"><span>        Class&lt;?&gt; beanClass = bean.getClass();</span></span>
<span class="line"><span>        do {</span></span>
<span class="line"><span>            // 获取Bean实例下的所有全局变量Field</span></span>
<span class="line"><span>            Field[] fields = beanClass.getDeclaredFields();</span></span>
<span class="line"><span>            for (Field field : fields) {</span></span>
<span class="line"><span>                // 判断是否有@RPCReference注解描述</span></span>
<span class="line"><span>                if (!hasAnnotation(field.getAnnotations(), RPCReference.class.getName())) {</span></span>
<span class="line"><span>                    continue;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                // 通过反射，为field属性填充Proxy代理类实例</span></span>
<span class="line"><span>                setField(bean, field);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } while ((beanClass = beanClass.getSuperclass()) != null);</span></span>
<span class="line"><span>        return bean;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void setField(Object bean, Field field) {</span></span>
<span class="line"><span>        if (!field.isAccessible()) {</span></span>
<span class="line"><span>            field.setAccessible(true);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            // Field是接口类型</span></span>
<span class="line"><span>            if (field.getType().isInterface()) {</span></span>
<span class="line"><span>                Class&lt;?&gt; interfaceClass = field.getType();</span></span>
<span class="line"><span>                // 创建代理类</span></span>
<span class="line"><span>                Object object = Proxy.newProxyInstance(interfaceClass.getClassLoader(), new Class[]{interfaceClass}, new ConsumerProxyFactory());</span></span>
<span class="line"><span>                // 代理类注入</span></span>
<span class="line"><span>                field.set(bean, object);</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                throw new RPCException(&quot;10000&quot;, field.getType().getName() + &quot;-Referenc only suiteable for interface&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private boolean hasAnnotation(Annotation[] annotations, String annotationName) {</span></span>
<span class="line"><span>        for (Annotation annotation : annotations) {</span></span>
<span class="line"><span>            if (annotation.annotationType().getName().equals(annotationName)) {</span></span>
<span class="line"><span>                return true;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此处主要借助Spring提供的扩展类，<code>ApplicationContextAware</code>、<code>BeanPostProcessor</code>。</p><ul><li><p>ApplicationContextAware，通过这个上下文环境可以查看、管理 Spring 容器中的Bean。</p></li><li><p>BeanPostProcessor，如果我们想在Spring容器中完成bean实例化、配置以及其他初始化方法前后要添加一些自己逻辑处理。我们需要定义一个或多个BeanPostProcessor接口实现类，然后注册到Spring IoC容器中。</p></li></ul><h3 id="服务方" tabindex="-1"><a class="header-anchor" href="#服务方"><span>服务方</span></a></h3><p>定义<code>ResourceService</code>继承<code>IResourceService</code>接口，用于处理具体的业务编码。</p><p>重点：类描述用<code>@RPCService</code> 注解标记，后面<code>Spring</code>框架要根据此标识扫描，并做统一管理</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@Slf4j</span></span>
<span class="line"><span>@RPCService</span></span>
<span class="line"><span>@Service</span></span>
<span class="line"><span>public class ResourceService implements IResourceService {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 业务方法</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public ResourceDTO query() {</span></span>
<span class="line"><span>        // 具体业务逻辑省略</span></span>
<span class="line"><span>        return resourceDTO;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>如何扫描<code>@RPCService</code>注解标识的服务实例呢？</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@Slf4j</span></span>
<span class="line"><span>@Configuration</span></span>
<span class="line"><span>public class RpcServiceLoader {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static Map&lt;Class&lt;?&gt;, Object&gt; providers = new ConcurrentHashMap&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static Object getProviders(Class&lt;?&gt; clazz) {</span></span>
<span class="line"><span>        return providers.get(clazz);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    RpcServiceFactory getProviderProxyFactory(ProviderConfig providerConfig, ApplicationContext ct) {</span></span>
<span class="line"><span>        RpcServiceFactory rpcServiceFactory = new RpcServiceFactory();</span></span>
<span class="line"><span>        // 扫描有RPCService注解的bean实例</span></span>
<span class="line"><span>        Map&lt;String, Object&gt; map = ct.getBeansWithAnnotation(RPCService.class);</span></span>
<span class="line"><span>        for (Object bean : map.values()) {</span></span>
<span class="line"><span>            Class&lt;?&gt; interFaceClazz = AopUtils.getTargetClass(bean).getInterfaces()[0];</span></span>
<span class="line"><span>            providers.put(interFaceClazz, bean);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return rpcServiceFactory;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>服务提供方所有的RPC服务实例存储在<code> Map&lt;Class&lt;?&gt;, Object&gt;</code>，统一管理，后续查询服务时会用到</p><h3 id="最后-关键一步-当服务方收到请求-如何完成触发调用" tabindex="-1"><a class="header-anchor" href="#最后-关键一步-当服务方收到请求-如何完成触发调用"><span>最后，关键一步，当服务方收到请求，如何完成触发调用？</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>public class RpcServiceFactory {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /***</span></span>
<span class="line"><span>     * 作为RPC的服务提供方</span></span>
<span class="line"><span>     * 接收消费方的请求信息，参数解析，通过反射机制，完成相关方法调用</span></span>
<span class="line"><span>     * 返回结果给调用者（包含异常）</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public Object handleHttpContent(String reqStr) throws Throwable {</span></span>
<span class="line"><span>        // 将消费方传递的参数反序列化，解析出对象</span></span>
<span class="line"><span>        RPCRequest req = RPCSerializer.INSTANCE.requestParse(reqStr);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 反射</span></span>
<span class="line"><span>        Class&lt;?&gt; clazz = req.getClazz();</span></span>
<span class="line"><span>        String methodName = req.getMethodName();</span></span>
<span class="line"><span>        Object[] args = req.getArguments();</span></span>
<span class="line"><span>        String[] parameterTypeNames = req.getParameterTypeNames();</span></span>
<span class="line"><span>        String[] listParameterTypeNames = req.getListParameterTypeNames();</span></span>
<span class="line"><span>        Class&lt;?&gt;[] parameterTypes = Arrays.stream(parameterTypeNames).map(this::classForName)</span></span>
<span class="line"><span>                .toArray(Class[]::new);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Method method = clazz.getMethod(methodName, parameterTypes);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 根据类模板查服务的Bean实例</span></span>
<span class="line"><span>        Object bean = RpcServiceLoader.getProviders(clazz);</span></span>
<span class="line"><span>        int argsListSize = 0;</span></span>
<span class="line"><span>        if (null != args) {</span></span>
<span class="line"><span>            argsListSize = args.length;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 解析出方法的入参</span></span>
<span class="line"><span>        Object[] argsList = new Object[argsListSize];</span></span>
<span class="line"><span>        for (int i = 0; i &lt; argsListSize; i++) {</span></span>
<span class="line"><span>            Object o;</span></span>
<span class="line"><span>            if (parameterTypeNames[i].contains(&quot;java.util.List&quot;)) {</span></span>
<span class="line"><span>                //参数是list</span></span>
<span class="line"><span>                String clazzName = listParameterTypeNames[i].replace(&quot;java.util.List&lt;&quot;, &quot;&quot;).replace(&quot;&gt;&quot;, &quot;&quot;);</span></span>
<span class="line"><span>                //非list</span></span>
<span class="line"><span>                Class&lt;?&gt; aClass = classForName(clazzName);</span></span>
<span class="line"><span>                o = JSONObject.parseArray(JSONObject.toJSONString(args[i]), aClass);</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                //非list</span></span>
<span class="line"><span>                Class&lt;?&gt; aClass = classForName(parameterTypeNames[i]);</span></span>
<span class="line"><span>                o = JSONObject.parseObject(JSONObject.toJSONString(args[i]), aClass);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            argsList[i] = o;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (Void.TYPE.equals(method.getReturnType())) {</span></span>
<span class="line"><span>            method.invoke(bean, argsList);</span></span>
<span class="line"><span>            return Void.TYPE.getName();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        Object result = method.invoke(bean, argsList);</span></span>
<span class="line"><span>        return result;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Object getBeanByClass(Class&lt;?&gt; clazz) throws RPCException {</span></span>
<span class="line"><span>        if (bean != null) {</span></span>
<span class="line"><span>            return bean;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Class&lt;?&gt; classForName(String className) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            return Class.forName(className);</span></span>
<span class="line"><span>        } catch (ClassNotFoundException e) {</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="redis-cluster集群便是采用这个设计思路" tabindex="-1"><a class="header-anchor" href="#redis-cluster集群便是采用这个设计思路"><span>Redis cluster集群便是采用这个设计思路</span></a></h2><p>Redis cluster有固定的<strong>16384</strong>个hash slot，对每个key计算<strong>CRC16</strong>值，然后对16384取模，可以获取key对应的hash slot。</p><p>集群中每个master都会持有部分slot，比如有3个master，那么可能每个master持有5000多个hash slot</p><blockquote><p>如：100w条数据，5个master，每个master就负责存储20w条数据，分布式数据存储</p></blockquote><p><strong>此时会有同学问，如果集群扩容或缩容怎么办？</strong></p><p>其实很简单，增加一个master，就将其他master的hash slot移动部分过去。减少一个master，就将它的hash slot移动到其他master上去</p><p>接下来要讲的部分跟今天的主题相关，或者说设计思路相似</p><p><strong>Redis cluster 如何对多master写入？</strong></p><p>写入数据的时候，其实是你可以将请求发送到任意一个master上去执行，该master会计算这个key对应的CRC16值，然后对16384个hash slot取模，找到key对应的hash slot，然后找到真实的master节点。</p><p>如果对应的master就在自己本地的话，<code>如：set key1 value1</code>，key1 对应的hash slot 就在自己本地，那么自己处理就可以了。</p><p>但是如果计算出来的hash slot在其他master节点上，则返回moved给客户端，由客户端进行重定向到对应的master上执行</p><p><strong>好奇宝宝又要发问了？</strong></p><p>基于重定向的客户端，大部分情况下，可能都会出现一次请求重定向，才能找到正确的节点，非常消耗网络IO。有什么解决方案吗？</p><div align="left"><img src="https://houbb.github.io/images/spring/spring/3-2.jpg" width="600px"></div><p>可以了解下 <code>JedisCluster</code></p><p><code>JedisCluster</code>是针对<code>Redis Cluster</code>的java客户端，它封装了java访问redis集群的各种操作，包括初始化连接、请求重定向等。</p><p><strong>原理细节</strong></p><ul><li><p>在JedisCluster初始化的时候，随机选择一个node，初始化hash slot -&gt; node映射表，同时为每个节点创建一个JedisPool连接池</p></li><li><p>每次基于JedisCluster执行操作，首先JedisCluster都会在本地计算key的hash slot，然后在本地映射表找到对应的节点</p></li><li><p>如果那个node正好还是持有那个hash slot，那么就ok; 如果说进行了reshard这样的操作，可能hash slot已经不在那个node上了，就会返回moved</p></li><li><p>如果JedisCluter API发现对应的节点返回moved，那么利用该节点的元数据，更新本地的hash slot -&gt; node映射表缓存</p></li><li><p>重复上面几个步骤，直到找到对应的节点，如果重试超过5次，那么就报错，JedisClusterMaxRedirectionException</p></li></ul><blockquote><p>jedis老版本，可能会出现在集群某个节点故障还没完成自动切换恢复时，频繁更新hash slot，频繁ping节点检查活跃，导致大量网络IO开销<br><br> jedis最新版本，对于这些过度的hash slot更新和ping，都进行了优化，避免了类似问题</p></blockquote>`,56)]))}const t=n(l,[["render",p]]),v=JSON.parse('{"path":"/posts/spring/spring/%E5%80%9F%E5%8A%A9Proxy%E4%BB%A3%E7%90%86%E6%8F%90%E5%8D%87%E6%9E%B6%E6%9E%84%E6%89%A9%E5%B1%95%E6%80%A7.html","title":"如何借助Proxy代理，提升架构扩展性","lang":"zh-CN","frontmatter":{"title":"如何借助Proxy代理，提升架构扩展性","description":"如何借助Proxy代理，提升架构扩展性 作者：老马 公众号：老马啸西风 博客：https://houbb.github.io/ 人生理念：知道的越多，不知道的越多，努力去学 我们都知道HTTP协议本身是无状态的，前后两次请求没有直接关联。 但有些业务功能比较特殊，比如发起一次http请求创建一笔订单，前提要求用户先登录，为了解决这个问题，http协议h...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/interview/posts/spring/spring/%E5%80%9F%E5%8A%A9Proxy%E4%BB%A3%E7%90%86%E6%8F%90%E5%8D%87%E6%9E%B6%E6%9E%84%E6%89%A9%E5%B1%95%E6%80%A7.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"如何借助Proxy代理，提升架构扩展性"}],["meta",{"property":"og:description","content":"如何借助Proxy代理，提升架构扩展性 作者：老马 公众号：老马啸西风 博客：https://houbb.github.io/ 人生理念：知道的越多，不知道的越多，努力去学 我们都知道HTTP协议本身是无状态的，前后两次请求没有直接关联。 但有些业务功能比较特殊，比如发起一次http请求创建一笔订单，前提要求用户先登录，为了解决这个问题，http协议h..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-08-16T11:28:53.000Z"}],["meta",{"property":"article:modified_time","content":"2025-08-16T11:28:53.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"如何借助Proxy代理，提升架构扩展性\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-08-16T11:28:53.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1755343733000,"updatedTime":1755343733000,"contributors":[{"name":"bbhou","username":"bbhou","email":"1557740299@qq.com","commits":1,"url":"https://github.com/bbhou"}]},"readingTime":{"minutes":8.21,"words":2462},"filePathRelative":"posts/spring/spring/借助Proxy代理提升架构扩展性.md","localizedDate":"2025年8月16日","excerpt":"\\n<blockquote>\\n<p>作者：老马<br>\\n<br>公众号：老马啸西风<br>\\n<br> 博客：<a href=\\"https://houbb.github.io/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://houbb.github.io/</a><br>\\n<br> 人生理念：知道的越多，不知道的越多，努力去学</p>\\n</blockquote>\\n<hr>\\n<p>我们都知道<strong>HTTP协议</strong>本身是无状态的，前后两次请求没有直接关联。</p>\\n<p>但有些业务功能比较特殊，比如发起一次http请求创建一笔订单，前提要求用户先登录，为了解决这个问题，http协议header中引入了Cookie，存储上下文信息，传递登录状态。</p>","autoDesc":true}');export{t as comp,v as data};
