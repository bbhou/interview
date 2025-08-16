import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as e,a,o as i}from"./app-BDqOilFQ.js";const l={};function p(r,s){return i(),e("div",null,s[0]||(s[0]=[a(`<h1 id="spring-boot-集成-grpc" tabindex="-1"><a class="header-anchor" href="#spring-boot-集成-grpc"><span>Spring Boot 集成 gRPC</span></a></h1><blockquote><p>作者：老马<br><br>公众号：老马啸西风<br><br> 博客：<a href="https://houbb.github.io/" target="_blank" rel="noopener noreferrer">https://houbb.github.io/</a><br><br> 人生理念：知道的越多，不知道的越多，努力去学</p></blockquote><p><code>Spring Boot 作为主流微服务框架，拥有成熟的社区生态。市场应用广泛，为了方便大家，整理了一个基于spring boot的常用中间件快速集成入门系列手册，涉及RPC、缓存、消息队列、分库分表、注册中心、分布式配置等常用开源组件，大概有几十篇文章，陆续会开放出来，感兴趣同学可以关注&amp;收藏</code></p><h2 id="简介" tabindex="-1"><a class="header-anchor" href="#简介"><span>简介</span></a></h2><p>在 gRPC 里，客户端应用可以像调用本地对象一样直接调用另一台不同的机器上服务端应用的方法，使得我们能够更容易地创建分布式应用和服务。</p><p>gRPC 基于 HTTP/2 标准设计，带来诸如双向流、流控、头部压缩、单 TCP 连接上的多复用请求等。这些特性使得其在移动设备上表现更好，更省电和节省空间占用。</p><blockquote><p>目前有非常多优秀的开源项目采用 gRPC 作为通信方式，例如说 Kubernetes、SkyWalking、istio 等等。甚至说，Dubbo 自 2.7.5 版本之后，开始提供对 gRPC 协议的支持</p></blockquote><p><strong>gRPC 主要提供了新增两种 RPC 调用方式：</strong></p><ul><li>普通 RPC 调用方式，即请求 - 响应模式。</li><li>基于 HTTP/2.0 的 streaming 调用方式。</li></ul><p>gRPC 服务调用支持同步和异步方式，同时也支持普通的 RPC 和 streaming 模式，可以最大程度满足业务的需求。</p><p>streaming 模式，可以充分利用 HTTP/2.0 协议的多路复用功能，实现在一条 HTTP 链路上并行双向传输数据，有效的解决了 HTTP/1.X 的数据单向传输问题，在大幅减少 HTTP 连接的情况下，充分利用单条链路的性能，可以媲美传统的 RPC 私有长连接协议：更少的链路、更高的性能。</p><div align="left"><img src="https://houbb.github.io/images/spring/springboot/23-4.jpg" width="800px"></div><p>gRPC 的网络 I/O 通信基于 Netty 构建，服务调用底层统一使用异步方式，同步调用是在异步的基础上做了上层封装。因此，gRPC 的异步化是比较彻底的，对于提升 I/O 密集型业务的吞吐量和可靠性有很大的帮助。</p><p>netty采用多路复用的 Reactor 线程模型：基于 Linux 的 epoll 和 Selector，一个 I/O 线程可以并行处理成百上千条链路，解决了传统同步 I/O 通信线程膨胀的问题。NIO 解决的是通信层面的异步问题，跟服务调用的异步没有必然关系。</p><h2 id="应用场景" tabindex="-1"><a class="header-anchor" href="#应用场景"><span>应用场景</span></a></h2><p>公司早期，为了满足业务快速迭代，技术选型随意，经常遇到多种语言开发，比如：java、python、php、.net 等搭建了不同的业务系统。现在考虑平台化技术升级，一些基础功能需要收拢统一，建设若干微服务中心（如：用户中心、权限中心）。基于此背景，如何做技术选型，我们可以考虑使用gRPC。</p><h2 id="grpc实现步骤" tabindex="-1"><a class="header-anchor" href="#grpc实现步骤"><span>gRPC实现步骤</span></a></h2><ul><li>定义一个服务，指定其能够被远程调用的方法（包含参数、返回类型）</li><li>在服务端实现这个接口，并运行一个 gRPC 服务器来处理客户端请求</li><li>在客户端实现一个存根 Stub ，用于发起远程方法调用</li></ul><div align="left"><img src="https://houbb.github.io/images/spring/springboot/23-2.jpg" width="800px"></div><blockquote><p>gRPC 客户端和服务端可以在多种语言与环境中运行和交互！我们可以很容易地用 Java 创建一个 gRPC 服务端，用 Java、Go、Python、Ruby 来创建 gRPC 客户端来访问它。</p></blockquote><h2 id="代码演示" tabindex="-1"><a class="header-anchor" href="#代码演示"><span>代码演示</span></a></h2><h3 id="外部依赖" tabindex="-1"><a class="header-anchor" href="#外部依赖"><span>外部依赖</span></a></h3><p>在 pom.xml 中添加以下依赖项：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;io.grpc&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;grpc-netty&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;\${grpc.version}&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;io.grpc&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;grpc-protobuf&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;\${grpc.version}&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;io.grpc&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;grpc-stub&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;\${grpc.version}&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>引入 <code>grpc-protobuf</code> 依赖，使用 Protobuf 作为序列化库。</li><li>引入 <code>grpc-stub</code> 依赖，使用 gRPC Stub 作为客户端。</li></ul><p>添加maven依赖</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&lt;build&gt;</span></span>
<span class="line"><span>    &lt;extensions&gt;</span></span>
<span class="line"><span>        &lt;extension&gt;</span></span>
<span class="line"><span>            &lt;groupId&gt;kr.motd.maven&lt;/groupId&gt;</span></span>
<span class="line"><span>            &lt;artifactId&gt;os-maven-plugin&lt;/artifactId&gt;</span></span>
<span class="line"><span>            &lt;version&gt;1.5.0.Final&lt;/version&gt;</span></span>
<span class="line"><span>        &lt;/extension&gt;</span></span>
<span class="line"><span>    &lt;/extensions&gt;</span></span>
<span class="line"><span>    &lt;plugins&gt;</span></span>
<span class="line"><span>        &lt;plugin&gt;</span></span>
<span class="line"><span>            &lt;groupId&gt;org.xolstice.maven.plugins&lt;/groupId&gt;</span></span>
<span class="line"><span>            &lt;artifactId&gt;protobuf-maven-plugin&lt;/artifactId&gt;</span></span>
<span class="line"><span>            &lt;version&gt;0.5.1&lt;/version&gt;</span></span>
<span class="line"><span>            &lt;configuration&gt;</span></span>
<span class="line"><span>                &lt;protocArtifact&gt;com.google.protobuf:protoc:3.5.1-1:exe:\${os.detected.classifier}&lt;/protocArtifact&gt;</span></span>
<span class="line"><span>                &lt;pluginId&gt;grpc-java&lt;/pluginId&gt;</span></span>
<span class="line"><span>                &lt;pluginArtifact&gt;io.grpc:protoc-gen-grpc-java:1.15.0:exe:\${os.detected.classifier}&lt;/pluginArtifact&gt;</span></span>
<span class="line"><span>            &lt;/configuration&gt;</span></span>
<span class="line"><span>            &lt;executions&gt;</span></span>
<span class="line"><span>                &lt;execution&gt;</span></span>
<span class="line"><span>                    &lt;goals&gt;</span></span>
<span class="line"><span>                        &lt;goal&gt;compile&lt;/goal&gt;</span></span>
<span class="line"><span>                        &lt;goal&gt;compile-custom&lt;/goal&gt;</span></span>
<span class="line"><span>                    &lt;/goals&gt;</span></span>
<span class="line"><span>                &lt;/execution&gt;</span></span>
<span class="line"><span>            &lt;/executions&gt;</span></span>
<span class="line"><span>        &lt;/plugin&gt;</span></span>
<span class="line"><span>    &lt;/plugins&gt;</span></span>
<span class="line"><span>&lt;/build&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>引入 <code>os-maven-plugin</code> 插件，从 OS 系统中获取参数。因为需要通过它从 OS 系统中获取 <code>os.detected.classifier</code> 参数。</li><li>引入 <code>protobuf-maven-plugin</code> 插件，实现将<code>proto</code> 目录下的<code>protobuf</code> 文件，生成<code>Service</code> 和 <code>Message</code> 类。</li></ul><h3 id="定义proto接口规范" tabindex="-1"><a class="header-anchor" href="#定义proto接口规范"><span>定义proto接口规范</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>service UserService {</span></span>
<span class="line"><span>    rpc query (UserRequest) returns (UserResponse);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>message UserRequest {</span></span>
<span class="line"><span>    string name = 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>message UserResponse {</span></span>
<span class="line"><span>    string name = 1;</span></span>
<span class="line"><span>    int32 age = 2;</span></span>
<span class="line"><span>    string address = 3;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>点击 IDEA 的「compile」按钮，编译 <code>spring-boot-bulking-grpc-proto</code> 项目，并同时执行 <code>protobuf-maven-plugin</code> 插件进行生成。结果如下图所示：</p><div align="left"><img src="https://houbb.github.io/images/spring/springboot/23-3.jpg" width="800px"></div><h3 id="服务端实现" tabindex="-1"><a class="header-anchor" href="#服务端实现"><span>服务端实现</span></a></h3><p>定义注解类，用于扫描Grpc相关接口服务</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@Target({ElementType.TYPE})</span></span>
<span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>@Documented</span></span>
<span class="line"><span>@Component</span></span>
<span class="line"><span>public @interface GrpcService {</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接口实现类</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@GrpcService</span></span>
<span class="line"><span>public class UserService extends UserServiceGrpc.UserServiceImplBase {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void query(UserRequest request, StreamObserver&lt;UserResponse&gt; responseObserver) {</span></span>
<span class="line"><span>        System.out.println(&quot; UserService 接收到的参数，name：&quot; + request.getName());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        UserResponse response = UserResponse.newBuilder().setName(&quot;老马啸西风&quot;).setAge(30).setAddress(&quot;上海&quot;).build();</span></span>
<span class="line"><span>        responseObserver.onNext(response);</span></span>
<span class="line"><span>        responseObserver.onCompleted();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动grpc server端，监听9091端口，并添加proto定义的接口实现类</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@Component</span></span>
<span class="line"><span>public class ServiceManager {</span></span>
<span class="line"><span>    private Server server;</span></span>
<span class="line"><span>    private int grpcServerPort = 9091;</span></span>
<span class="line"><span>    public void loadService(Map&lt;String, Object&gt; grpcServiceBeanMap) throws IOException, InterruptedException {</span></span>
<span class="line"><span>        ServerBuilder serverBuilder = ServerBuilder.forPort(grpcServerPort);</span></span>
<span class="line"><span>        // 采用注解扫描方式，添加服务</span></span>
<span class="line"><span>        for (Object bean : grpcServiceBeanMap.values()) {</span></span>
<span class="line"><span>            serverBuilder.addService((BindableService) bean);</span></span>
<span class="line"><span>            System.out.println(bean.getClass().getSimpleName() + &quot; is regist in Spring Boot！&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        server = serverBuilder.build().start();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.println(&quot;grpc server is started at &quot; + grpcServerPort);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 增加一个钩子，当JVM进程退出时，Server 关闭</span></span>
<span class="line"><span>        Runtime.getRuntime().addShutdownHook(new Thread() {</span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public void run() {</span></span>
<span class="line"><span>                System.err.println(&quot;*** shutting down gRPC server since JVM is shutting down&quot;);</span></span>
<span class="line"><span>                if (server != null) {</span></span>
<span class="line"><span>                    server.shutdown();</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                System.err.println(&quot;*** server shut down！！！！&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>        server.awaitTermination();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Server 端启动成功</p><div align="left"><img src="https://houbb.github.io/images/spring/springboot/23-1.jpg" width="800px"></div><h3 id="客户端调用" tabindex="-1"><a class="header-anchor" href="#客户端调用"><span>客户端调用</span></a></h3><p>定义接口的Stub实例，用于发起远程服务调用</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@Configuration</span></span>
<span class="line"><span>public class GrpcServiceConfig {</span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    public ManagedChannel getChannel() {</span></span>
<span class="line"><span>        ManagedChannel channel = ManagedChannelBuilder.forAddress(&quot;localhost&quot;, 9091)</span></span>
<span class="line"><span>                .usePlaintext()</span></span>
<span class="line"><span>                .build();</span></span>
<span class="line"><span>        return channel;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    public HelloServiceGrpc.HelloServiceBlockingStub getStub1(ManagedChannel channel) {</span></span>
<span class="line"><span>        return HelloServiceGrpc.newBlockingStub(channel);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    public UserServiceGrpc.UserServiceBlockingStub getStub2(ManagedChannel channel) {</span></span>
<span class="line"><span>        return UserServiceGrpc.newBlockingStub(channel);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Restful接口调用，访问：<code>http://localhost:8098/query</code></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@RequestMapping(&quot;/query&quot;)</span></span>
<span class="line"><span>public String query() {</span></span>
<span class="line"><span>    UserRequest request = UserRequest.newBuilder()</span></span>
<span class="line"><span>            .setName(&quot;老马啸西风&quot;)</span></span>
<span class="line"><span>            .build();</span></span>
<span class="line"><span>    UserResponse userResponse = userServiceBlockingStub.query(request);</span></span>
<span class="line"><span>    String result = String.format(&quot;name:%s  , age:%s , address:%s &quot;, userResponse.getName(), userResponse.getAge(), userResponse.getAddress());</span></span>
<span class="line"><span>    System.out.println(result);</span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="开箱即用-starter-组件" tabindex="-1"><a class="header-anchor" href="#开箱即用-starter-组件"><span>开箱即用 Starter 组件</span></a></h2><p>gRPC 社区暂时没有提供 Spring Boot Starter 库，以简化我们对 gRPC 的配置。不过国内有大神已经开源了一个。</p><blockquote><p>地址：<a href="https://github.com/yidongnan/grpc-spring-boot-starter" target="_blank" rel="noopener noreferrer">https://github.com/yidongnan/grpc-spring-boot-starter</a></p></blockquote><h3 id="特性" tabindex="-1"><a class="header-anchor" href="#特性"><span>特性</span></a></h3><ul><li>在 spring boot 应用中，通过 <code>@GrpcService</code> 自动配置并运行一个嵌入式的 gRPC 服务</li><li>使用 <code>@GrpcClient</code> 自动创建和管理你的 gRPC Channels 和 stubs</li><li>支持 <code>Spring Cloud</code> (向 Consul 或 Eureka 或 Nacos 注册服务并获取gRPC服务信息）</li><li>支持 <code>Spring Sleuth</code> 进行链路跟踪(需要单独引入 brave-instrumentation-grpc)</li><li>支持对 server、client 分别设置全局拦截器或单个的拦截器</li><li>支持 <code>Spring-Security</code></li><li>支持metric (基于 micrometer / actuator )</li><li>也适用于 (non-shaded) grpc-netty</li></ul><h2 id="项目源码" tabindex="-1"><a class="header-anchor" href="#项目源码"><span>项目源码</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>https://github.com/aalansehaiyang/spring-boot-bulking  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>三个模块：</span></span>
<span class="line"><span>spring-boot-bulking-grpc-proto</span></span>
<span class="line"><span>spring-boot-bulking-grpc-client</span></span>
<span class="line"><span>spring-boot-bulking-grpc-server</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,53)]))}const d=n(l,[["render",p]]),o=JSON.parse('{"path":"/posts/spring/springboot/gRPC.html","title":"Spring Boot 集成 gRPC","lang":"zh-CN","frontmatter":{"title":"Spring Boot 集成 gRPC","description":"Spring Boot 集成 gRPC 作者：老马 公众号：老马啸西风 博客：https://houbb.github.io/ 人生理念：知道的越多，不知道的越多，努力去学 Spring Boot 作为主流微服务框架，拥有成熟的社区生态。市场应用广泛，为了方便大家，整理了一个基于spring boot的常用中间件快速集成入门系列手册，涉及RPC、缓存、...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/interview/posts/spring/springboot/gRPC.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"Spring Boot 集成 gRPC"}],["meta",{"property":"og:description","content":"Spring Boot 集成 gRPC 作者：老马 公众号：老马啸西风 博客：https://houbb.github.io/ 人生理念：知道的越多，不知道的越多，努力去学 Spring Boot 作为主流微服务框架，拥有成熟的社区生态。市场应用广泛，为了方便大家，整理了一个基于spring boot的常用中间件快速集成入门系列手册，涉及RPC、缓存、..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-08-16T11:28:53.000Z"}],["meta",{"property":"article:modified_time","content":"2025-08-16T11:28:53.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Spring Boot 集成 gRPC\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-08-16T11:28:53.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1755343733000,"updatedTime":1755343733000,"contributors":[{"name":"bbhou","username":"bbhou","email":"1557740299@qq.com","commits":1,"url":"https://github.com/bbhou"}]},"readingTime":{"minutes":5.91,"words":1774},"filePathRelative":"posts/spring/springboot/gRPC.md","localizedDate":"2025年8月16日","excerpt":"\\n<blockquote>\\n<p>作者：老马<br>\\n<br>公众号：老马啸西风<br>\\n<br> 博客：<a href=\\"https://houbb.github.io/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://houbb.github.io/</a><br>\\n<br> 人生理念：知道的越多，不知道的越多，努力去学</p>\\n</blockquote>\\n<p><code>Spring Boot 作为主流微服务框架，拥有成熟的社区生态。市场应用广泛，为了方便大家，整理了一个基于spring boot的常用中间件快速集成入门系列手册，涉及RPC、缓存、消息队列、分库分表、注册中心、分布式配置等常用开源组件，大概有几十篇文章，陆续会开放出来，感兴趣同学可以关注&amp;收藏</code></p>","autoDesc":true}');export{d as comp,o as data};
