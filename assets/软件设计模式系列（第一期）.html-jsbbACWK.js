import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-BDqOilFQ.js";const l={};function p(d,s){return i(),a("div",null,s[0]||(s[0]=[e(`<h1 id="软件设计模式系列-第一期" tabindex="-1"><a class="header-anchor" href="#软件设计模式系列-第一期"><span>软件设计模式系列（第一期）</span></a></h1><blockquote><p>作者：老马<br><br>公众号：老马啸西风<br><br> 博客：<a href="https://houbb.github.io/" target="_blank" rel="noopener noreferrer">https://houbb.github.io/</a><br><br> 人生理念：知道的越多，不知道的越多，努力去学</p></blockquote><p>面对复杂的业务场景，千变万化的客户需求，如何以一变应万变，以最小的开发成本快速落地实现，同时保证系统有着较低的复杂度，能够保证系统后续de持续迭代能力，让系统拥有较高的可扩展性。</p><p><code>这些是一个合格的架构师必须修炼的基础内功，但是如何修炼这门神功？？？</code></p><div align="left"><img src="https://houbb.github.io/images/arch/designmodel/14-1.jpeg" width="200px"></div><p>不要着急，慢慢看下去。学了真本事，拿了阿里、头条的offer，女神还会远吗！❤️💖💘</p><p>接下来我们来系统性汇总下，软件架构设计需要知晓的设计模式，主要是提炼精髓、核心设计思路、代码示例、以及应用场景等。</p><blockquote><p>CRUD很多人都会，不懂设计模式也可以开发软件，但是当开发及维护大型软件系统过程中就痛苦不堪，懂了人自然听得懂我在说什么，不懂的人说了你也不会懂。</p></blockquote><p>我将常用的软件设计模式，做了汇总，目录如下：</p><div align="left"><img src="https://houbb.github.io/images/arch/designmodel/14-7.jpeg" width="400px"></div><p><strong>考虑到内容篇幅较大，为了便于大家阅读，将软件设计模式系列（共23个）拆分成四篇文章，每篇文章讲解六个设计模式，采用不同的颜色区分，便于快速消化记忆</strong></p><p>本文是首篇，主要讲解<code>单例模式</code>、<code>建造者模式</code>、<code>抽象工厂</code>、<code>工厂方法</code>、<code>原型模式</code>、<code>适配器模式</code><br> ，共6个设计模式。</p><h2 id="_1、单例模式" tabindex="-1"><a class="header-anchor" href="#_1、单例模式"><span>1、单例模式</span></a></h2><p><strong>定义：</strong></p><blockquote><p>单例模式（Singleton）允许存在一个和仅存在一个给定类的实例。它提供一种机制让任何实体都可以访问该实例。</p></blockquote><div align="left"><img src="https://houbb.github.io/images/arch/designmodel/14-2.jpeg" width="600px"></div><p><strong>核心思路：</strong></p><p>1️⃣ 保证一个类只有一个实例。如果该对象已经被创建， 则返回已有的对象。为什么要这样设计呢？因为某些业务场景要控制共享资源 （例如数据库或文件） 的访问权限。</p><p>2️⃣ 为该实例提供一个全局访问入口， 提供一个<code>static</code>访问方法。</p><p><strong>代码示例：</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * @author 微信公众号：老马啸西风</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class Singleton {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static Singleton instance = new Singleton();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 让构造函数为 private，这样该类就不会被实例化</span></span>
<span class="line"><span>    private Singleton() {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 获取唯一可用的对象</span></span>
<span class="line"><span>    public static Singleton getInstance() {</span></span>
<span class="line"><span>        return instance;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在类中添加一个私有静态成员变量用于保存单例实例，声明一个公有静态构建方法用于获取单例实例。</p><p><strong>注意事项：</strong></p><p>多个业务场景，多个线程访问同一个类实例的全局变量，频发的写操作，可能会引发线程安全问题。另外，为了防止其他对象使用单例类的 <code>new</code> 运算符，编码时需要将默认构造函数设为私有。</p><p>如果想要采用<code>延迟初始化对象</code>，多线程并发初始化时，可能会有并发安全问题。假如：线程A，线程B都阻塞在了获取锁的步骤上，其中线程A获得锁---实例化了对象----释放锁；之后线程B---获得锁---实例化对象，此时违反了我们单例模式的初衷。</p><p><strong>如何解决？</strong></p><p>采用<code>双重判空检查</code>。首先保证了安全，且在多线程情况下能保持高性能，第一个if判断避免了其他无用线程竞争锁造成性能浪费，第二个if判断能拦截除第一个获得对象锁线程以外的线程。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * @author 微信公众号：老马啸西风</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class SingleonLock {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static SingleonLock doubleLock;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private SingleonLock() {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 双重校验锁</span></span>
<span class="line"><span>    public static SingleonLock getInstance() {</span></span>
<span class="line"><span>        if (doubleLock == null) {</span></span>
<span class="line"><span>            synchronized (SingleonLock.class) {</span></span>
<span class="line"><span>                if (doubleLock == null) {</span></span>
<span class="line"><span>                    doubleLock = new SingleonLock();</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return doubleLock;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2、建造者模式" tabindex="-1"><a class="header-anchor" href="#_2、建造者模式"><span>2、建造者模式</span></a></h2><p><strong>定义：</strong></p><p>建造者模式，也称 <code>Builder</code> 模式。</p><blockquote><p>将复杂对象的构造与其表示分离，以便同一构造过程可以创建不同的表示。</p></blockquote><p>简单来说，建造者模式就是如何一步步构建一个包含多个组成部件的对象，相同的构建过程可以创建不同的产品</p><p><strong>核心思路：</strong></p><div align="left"><img src="https://houbb.github.io/images/arch/designmodel/14-3.jpeg" width="600px"></div><table><thead><tr><th>角色</th><th>类别</th><th>说明</th></tr></thead><tbody><tr><td>Builder</td><td>接口或抽象类</td><td>抽象的建造者，<strong>不是必须的</strong></td></tr><tr><td>ConcreteBuilder</td><td>具体的建造者</td><td>可以有多个「因为每个建造风格可能不一样」，<strong>必须要有</strong></td></tr><tr><td>Product</td><td>普通类</td><td>最终构建的对象，<strong>必须要有</strong></td></tr><tr><td>Director</td><td>指挥者</td><td>统一指挥建造者去建造目标，<strong>不是必须的</strong></td></tr></tbody></table><p><strong>代码示例：</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * @author 微信公众号：老马啸西风</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class Person {</span></span>
<span class="line"><span>    private String name;</span></span>
<span class="line"><span>    private int age;</span></span>
<span class="line"><span>    private String address;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static PersonBuilder builder() {</span></span>
<span class="line"><span>        return new PersonBuilder();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private Person(PersonBuilder builder) {</span></span>
<span class="line"><span>        this.name = builder.name;</span></span>
<span class="line"><span>        this.age = builder.age;</span></span>
<span class="line"><span>        this.address = builder.address;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 建造者</span></span>
<span class="line"><span>    static class PersonBuilder {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        private String name;</span></span>
<span class="line"><span>        private int age;</span></span>
<span class="line"><span>        private String address;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        public PersonBuilder() {</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        public PersonBuilder name(String name) {</span></span>
<span class="line"><span>            this.name = name;</span></span>
<span class="line"><span>            return this;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        public PersonBuilder age(int age) {</span></span>
<span class="line"><span>            this.age = age;</span></span>
<span class="line"><span>            return this;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        public PersonBuilder address(String address) {</span></span>
<span class="line"><span>            this.address = address;</span></span>
<span class="line"><span>            return this;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        public Person build() {</span></span>
<span class="line"><span>            return new Person(this);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><code>Person</code> 中创建一个静态内部类 <code>PersonBuilder</code>，然后将 <code>Person</code> 中的参数都复制到 <code>PersonBuilder</code>类中。</li><li><code>Person</code>中创建一个private的构造函数，入参为 <code>PersonBuilder</code>类型</li><li><code>PersonBuilder</code>中创建一个public的构造函数</li><li><code>PersonBuilder</code>中创建设置函数，对<code>Person</code> 中那些可选参数进行赋值，返回值为<code>PersonBuilder</code>类型的实例</li><li><code>PersonBuilder</code>中创建一个build()方法，在其中构建<code>Person</code> 的实例并返回</li></ul><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * @author 微信公众号：老马啸西风</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class PersonBuilderTest {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        Person person = Person.builder()</span></span>
<span class="line"><span>                .name(&quot;老马&quot;)</span></span>
<span class="line"><span>                .age(18)</span></span>
<span class="line"><span>                .address(&quot;杭州&quot;)</span></span>
<span class="line"><span>                .build();</span></span>
<span class="line"><span>        System.out.println(JSON.toJSONString(person));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>客户端使用链式调用，一步一步的把对象构建出来。</p><p><strong>适用场景：</strong></p><ul><li>分阶段、分步骤的方法更适合多次运算结果类创建场景。比如创建一个类实例的参数并不会一次准备好，有些参数可能需要调用多个服务运算后才能拿得到，这时，我们可以根据已知参数，预先对类进行创建，待后续的参数准备好了后，再设置。</li><li>不关心特定类型的建造者的具体算法实现。比如，我们并不关心<code>StringBuilder</code>的具体代码实现，只关心它提供了字符串拼接功能。</li></ul><p>使用建造者模式能更方便地帮助我们按需进行对象的实例化，避免写很多不同参数的构造函数，同时还能解决同一类型参数只能写一个构造函数的弊端。</p><p>最后，实际项目中，为了简化编码，通常可以直接使用<code>lombok</code>的 <code>@Builder</code> 注解实现<code>类自身的建造者模式</code>。</p><h2 id="_3、抽象工厂模式" tabindex="-1"><a class="header-anchor" href="#_3、抽象工厂模式"><span>3、抽象工厂模式</span></a></h2><p><strong>定义：</strong></p><blockquote><p>抽象工厂模式围绕一个超级工厂创建其他工厂，又称为其他工厂的工厂。是一种创建型设计模式，它能创建一系列相关的对象，而无需指定其具体类。</p></blockquote><p><strong>抽象工厂模式的关键点：如何找到正确的抽象。</strong></p><p>对于软件调用者来说，他们更关心软件提供了什么功能。至于内部如何实现的，他们并不关心。另外，考虑到安全问题，一般内部具体的实现细节通常会隐藏掉。</p><p>我们以电视、冰箱、洗衣机等家用电器生产为例，很多厂商像<code>Haier</code>、<code>Sony</code>、<code>小米</code>、<code>Hisense</code>等能生产上述电器，不过在外观、性能、功率、智能化、特色功能等方面会有差异。面对这样的需求，我们如何借助<code>抽象工厂模式</code>来实现编码。</p><div align="left"><img src="https://houbb.github.io/images/arch/designmodel/14-5.jpeg" width="600px"></div><p>抽象工厂模式体现为定义一个抽象工厂类，多个不同的具体工厂继承这个抽象工厂类后，再各自实现相同的抽象功能，从而实现代码上的<code>多态性</code>。</p><p><strong>代码示例：</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * @author 微信公众号：老马啸西风</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public abstract class AbstractFactory {</span></span>
<span class="line"><span>    // 生产电视</span></span>
<span class="line"><span>    abstract Object createTV();</span></span>
<span class="line"><span>    // 生产洗衣机</span></span>
<span class="line"><span>    abstract Object createWasher();</span></span>
<span class="line"><span>    // 生产冰箱</span></span>
<span class="line"><span>    abstract Object createRefrigerator();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class HaierFactory extends AbstractFactory {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    Object createTV() {</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    Object createWasher() {</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    Object createRefrigerator() {</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class XiaomiFactory extends AbstractFactory {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    Object createTV() {</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    Object createWasher() {</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    Object createRefrigerator() {</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>AbstractFactory </code>是抽象工厂类，能够创建电视、洗衣机、冰箱抽象产品；而<code>HaierFactory</code>和<code>XiaomiFactory</code> 是具体的工厂，负责生产具体的产品。当我们要生产具体的产品时，只需要告诉<code>AbstractFactory</code>即可。</p><p><strong>解决问题：</strong></p><ul><li>对于不同产品系列有比较多共性特征时，可以使用抽象工厂模式，有助于提升组件的复用性。</li><li>当需要提升代码的扩展性并降低维护成本时，把对象的创建和使用过程分开，能有效地将代码统一到一个级别上。</li></ul><p><strong>适用场景：</strong></p><ul><li>解决跨平台兼容性的问题。当一个应用程序需要支持Windows、Mac、Linux等多套操作系统。</li><li>电商的商品、订单、物流系统，需要根据区域政策、用户的购买习惯，差异化处理</li><li>不同的数据库产品，JDBC 就是对于数据库增删改查建立的抽象工厂类，无论使用什么类型的数据库，只要具体的数据库组件能够支持 JDBC，就能对数据库进行读写操作。</li></ul><h2 id="_4、工厂方法模式" tabindex="-1"><a class="header-anchor" href="#_4、工厂方法模式"><span>4、工厂方法模式</span></a></h2><p>工厂方法模式与抽象工厂模式类似。工厂方法模式因为只围绕着一类接口来进行对象的创建与使用，使用场景更加单一，项目中更常见些。</p><p><strong>定义：</strong></p><blockquote><p>定义一个创建对象的接口，让其子类自己决定实例化哪一个类，工厂模式使其创建过程延迟到子类进行。</p></blockquote><p><strong>核心点：封装对象创建的过程，提升创建对象方法的可复用性。</strong></p><div align="left"><img src="https://houbb.github.io/images/arch/designmodel/14-6.jpeg" width="600px"></div><p>工厂方法模式包含三个关键角色：抽象产品、具体产品、工厂类。</p><p>定义一个抽象产品接口<code>ITV</code>，<code>HaierTV</code>和<code>XiaomiTV</code>是具体产品类，<code>TVFactory</code>是工厂类，负责生产具体的对象实例。</p><p><strong>代码示例：</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * @author 微信公众号：老马啸西风</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public interface ITV {</span></span>
<span class="line"><span>    // 描述</span></span>
<span class="line"><span>    Object desc();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class HaierTV implements ITV {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Object desc() {</span></span>
<span class="line"><span>        return &quot;海尔电视&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class XiaomiTV implements ITV {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Object desc() {</span></span>
<span class="line"><span>        return &quot;小米电视&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class TVFactory {</span></span>
<span class="line"><span>    public static ITV getTV(String name) {</span></span>
<span class="line"><span>        switch (name) {</span></span>
<span class="line"><span>            case &quot;haier&quot;:</span></span>
<span class="line"><span>                return new HaierTV();</span></span>
<span class="line"><span>            case &quot;xiaomi&quot;:</span></span>
<span class="line"><span>                return new XiaomiTV();</span></span>
<span class="line"><span>            default:</span></span>
<span class="line"><span>                return null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Client {</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        ITV tv = TVFactory.getTV(&quot;xiaomi&quot;);</span></span>
<span class="line"><span>        Object result = tv.desc();</span></span>
<span class="line"><span>        System.out.println(result);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>工厂方法模式是围绕着特定的抽象产品（接口）来封装对象的创建过程，<code>Client</code>只需要通过工厂类来创建具体对象实例，然后就可以使用其功能。</p><p>工厂方法模式将对象的创建和使用过程分开，降低代码耦合性。</p><h2 id="_5、原型模式" tabindex="-1"><a class="header-anchor" href="#_5、原型模式"><span>5、原型模式</span></a></h2><p>原型模式是创建型模式的一种，其特点在于通过“复制”一个已经存在的实例来返回新的实例，而不是新建实例。被复制的实例就是我们所称的“原型”，这个原型是可定制的。</p><p><strong>定义：</strong></p><blockquote><p>使用原型实例指定创建对象的种类，然后通过拷贝这些原型来创建新的对象。</p></blockquote><div align="left"><img src="https://houbb.github.io/images/arch/designmodel/14-8.jpeg" width="600px"></div><p><strong>代码示例：</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * @author 微信公众号：老马啸西风</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public interface Prototype extends Cloneable {</span></span>
<span class="line"><span>    public Prototype clone() throws CloneNotSupportedException;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class APrototype implements Prototype {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Prototype clone() throws CloneNotSupportedException {</span></span>
<span class="line"><span>        System.out.println(&quot;开始克隆《老马啸西风》对象&quot;);</span></span>
<span class="line"><span>        return (APrototype) super.clone();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Client {</span></span>
<span class="line"><span>    @SneakyThrows</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        Prototype a = new APrototype();</span></span>
<span class="line"><span>        Prototype b = a.clone();</span></span>
<span class="line"><span>        System.out.println(&quot;a的对象引用：&quot; + a);</span></span>
<span class="line"><span>        System.out.println(&quot;b的对象引用：&quot; + b);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行结果：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>开始克隆《老马啸西风》对象</span></span>
<span class="line"><span>a的对象引用：course.p14.p5.APrototype@7cc355be</span></span>
<span class="line"><span>b的对象引用：course.p14.p5.APrototype@6e8cf4c6</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>打印出两个对象的地址，发现不相同，在内存中为两个对象。</p><blockquote><p>Cloneable 接口本身是空方法，调用的 clone() 方法其实是 Object.clone() 方法</p></blockquote><p><strong>优点：</strong></p><ul><li>性能优良。不用重新初始化对象，而是动态地获取对象运行时的状态。</li><li>可以摆脱构造函数的约束。</li></ul><p><strong>特别注意：</strong></p><p><code>clone()</code>是<code>浅复制</code>，也就是基本类型数据，会给你重新复制一份新的。但是引用类型（对象中包含对象），他就不会重新复制份新的。引用类型如：bean实例引用、集合等一些引用类型。</p><p><strong>如何解决？</strong></p><p>你需要在执行完<code>super.clone()</code> 获得浅复制对象后，再手动对其中的全局变量重新构造对象并赋值。当然，经过这个过程，得到的对象我们称之为<code>深复制</code>。</p><p><strong>适用场景：</strong></p><ul><li>反序列化，比如 fastjson的JSON.parseObject() ，将字符串转变为对象</li><li>每次创建新对象资源损耗较大</li><li>对象中的属性非常多，通过get和set方法创建对象，复制黏贴非常痛苦</li></ul><p><strong>加餐：</strong></p><p>Spring 框架中提供了一个工具类，<code>BeanUtils.copyProperties</code> 可以方便的完成对象属性的拷贝，其实也是<code>浅复制</code>，只能对<code>基本类型数据</code>、<code>对象引用</code>拷贝。使用时特别要注意，如果全局变量有对象类型，原型对象和克隆的对象会二次修改，要特殊处理，采用深复制，否则会引发安全问题。</p><h2 id="_6、适配器模式" tabindex="-1"><a class="header-anchor" href="#_6、适配器模式"><span>6、适配器模式</span></a></h2><p>我们都知道美国的电压是110V，而中国是220V，如果你去要美国旅行时，一定要记得带电源适配器，将不同国家使用的电源电流标准转化为适合我们自己电器的标准，否则很容易烧坏电子设备。</p><p><strong>定义：</strong></p><blockquote><p>将类的接口转换为客户期望的另一个接口，适配器可以让不兼容的两个类一起协同工作。核心点在于转换！</p></blockquote><p><strong>核心思路：</strong></p><p>在原有的接口或类的外层封装一个新的适配器层，以实现扩展对象结构的效果，并且这种扩展可以无限扩展下去。</p><div align="left"><img src="https://houbb.github.io/images/arch/designmodel/14-10.jpeg" width="600px"></div><ul><li>Adaptee：源接口，需要适配的接口</li><li>Target：目标接口，暴露出去的接口</li><li>Adapter：适配器，将源接口适配成目标接口</li></ul><p><strong>适用场景：</strong></p><ul><li>原有接口无法修改时，又必须快速兼容部分新功能</li><li>需要依赖外部系统时，一般会单独封装<code>防腐层</code>，降低外部系统的突发风险带来的影响</li><li>适配不同数据格式，不同接口协议转换</li><li>旧接口过渡升级</li></ul><p><strong>案例：</strong></p><p>比如查物流信息，由于物流公司的系统都是各自独立，在编程语言和交互方式上有很大差异，需要针对不同的物流公司做单独适配，同时结合不同公司的系统性能，配置不同的响应超时时间</p><div align="left"><img src="https://houbb.github.io/images/arch/designmodel/14-11.jpeg" width="600px"></div><p>适配器模式号称为“最好用打补丁模式”，就是因为只要是一个接口，都可以用它来进行适配。</p><h2 id="写在最后" tabindex="-1"><a class="header-anchor" href="#写在最后"><span>写在最后</span></a></h2><p>设计模式很多人都学习过，但项目实战时总是晕晕乎乎，原因在于没有了解其核心是什么，底层逻辑是什么，《设计模式：可复用面向对象的基础》有讲过，</p><blockquote><p>在设计中思考什么应该变化，并封装会发生变化的概念。</p></blockquote><p><strong>软件架构的精髓：找到变化，封装变化。</strong></p><p>业务千变万化，没有固定的编码答案，千万不要硬套设计模式。无论选择哪一种设计模式，尽量要能满足<code>SOLID</code>原则，自我review是否满足业务的持续扩展性。有句话说的好，“不论白猫黑猫，能抓老鼠就是好猫。”</p><h1 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h1><ul><li><a href="https://kaiwu.lagou.com/course/courseInfo.htm?courseId=710&amp;sid=20-h5Url-0&amp;buyFrom=2&amp;pageId=1pz4#/detail/pc?id=6882" target="_blank" rel="noopener noreferrer">17 | 单例模式：如何有效进行程序初始化？</a></li><li><a href="https://www.liaoxuefeng.com/wiki/1252599548343744/1281319134822433" target="_blank" rel="noopener noreferrer">廖雪峰的官方网站</a>[</li></ul>`,114)]))}const t=n(l,[["render",p]]),o=JSON.parse('{"path":"/posts/arch/designmodel/%E8%BD%AF%E4%BB%B6%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E7%B3%BB%E5%88%97%EF%BC%88%E7%AC%AC%E4%B8%80%E6%9C%9F%EF%BC%89.html","title":"软件设计模式系列（第一期）","lang":"zh-CN","frontmatter":{"title":"软件设计模式系列（第一期）","description":"软件设计模式系列（第一期） 作者：老马 公众号：老马啸西风 博客：https://houbb.github.io/ 人生理念：知道的越多，不知道的越多，努力去学 面对复杂的业务场景，千变万化的客户需求，如何以一变应万变，以最小的开发成本快速落地实现，同时保证系统有着较低的复杂度，能够保证系统后续de持续迭代能力，让系统拥有较高的可扩展性。 这些是一个合...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/interview/posts/arch/designmodel/%E8%BD%AF%E4%BB%B6%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E7%B3%BB%E5%88%97%EF%BC%88%E7%AC%AC%E4%B8%80%E6%9C%9F%EF%BC%89.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"软件设计模式系列（第一期）"}],["meta",{"property":"og:description","content":"软件设计模式系列（第一期） 作者：老马 公众号：老马啸西风 博客：https://houbb.github.io/ 人生理念：知道的越多，不知道的越多，努力去学 面对复杂的业务场景，千变万化的客户需求，如何以一变应万变，以最小的开发成本快速落地实现，同时保证系统有着较低的复杂度，能够保证系统后续de持续迭代能力，让系统拥有较高的可扩展性。 这些是一个合..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-08-16T11:28:53.000Z"}],["meta",{"property":"article:modified_time","content":"2025-08-16T11:28:53.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"软件设计模式系列（第一期）\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-08-16T11:28:53.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1755343733000,"updatedTime":1755343733000,"contributors":[{"name":"bbhou","username":"bbhou","email":"1557740299@qq.com","commits":1,"url":"https://github.com/bbhou"}]},"readingTime":{"minutes":13.66,"words":4098},"filePathRelative":"posts/arch/designmodel/软件设计模式系列（第一期）.md","localizedDate":"2025年8月16日","excerpt":"\\n<blockquote>\\n<p>作者：老马<br>\\n<br>公众号：老马啸西风<br>\\n<br> 博客：<a href=\\"https://houbb.github.io/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://houbb.github.io/</a><br>\\n<br> 人生理念：知道的越多，不知道的越多，努力去学</p>\\n</blockquote>\\n<p>面对复杂的业务场景，千变万化的客户需求，如何以一变应万变，以最小的开发成本快速落地实现，同时保证系统有着较低的复杂度，能够保证系统后续de持续迭代能力，让系统拥有较高的可扩展性。</p>","autoDesc":true}');export{t as comp,o as data};
