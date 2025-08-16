import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as p,o as i}from"./app-d8EKP-K0.js";const e={};function l(c,s){return i(),a("div",null,s[0]||(s[0]=[p(`<h1 id="第31讲-数字货币钱包服务" tabindex="-1"><a class="header-anchor" href="#第31讲-数字货币钱包服务"><span>第31讲 _ 数字货币钱包服务</span></a></h1><p><audio id="audio" title="第31讲 | 数字货币钱包服务" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/bb/20/bb2672945b84319fc5c0c05239e3a820.mp3"></audio></p><p>上一篇，我们谈到了“区块链即服务”的概念。实际上，区块链第一个需要解决的服务就是数字货币支付服务。如何将数字货币钱包集成到系统中，我认为这是区块链行业最为迫切的问题。</p><p>今天我们就来了解一下数字货币钱包，它面临了什么样的问题，这样的问题又需要什么技术才能解决，而数字货币平台想要定制自己的数字货币钱包服务，又应当如何集成。</p><h2 id="数字货币钱包的分类" tabindex="-1"><a class="header-anchor" href="#数字货币钱包的分类"><span>数字货币钱包的分类</span></a></h2><p>目前市面上的数字货币钱包有很多种，看起来似乎有些眼花缭乱，不过，我们可以将它们进行分类后，再快速了解。</p><p>下图展示了按照不同属性区分的区块链钱包。</p><img src="https://static001.geekbang.org/resource/image/02/e6/0220a3863fa1c5e3cd8b87cba6a5c5e6.jpg" alt=""><p>左一是按照用户端平台划分的钱包，这种钱包实际是在服务端运行的，用户端的钱包实际上只是一个代理，所以用户不需要关心钱包的细节，使用起来十分方便，典型的例子是各种在线钱包。</p><p>左二是按照货币类型分类的钱包，主要是指这款钱包到底是否支持多币种，这里的多币种可以是基于以太坊ERC20 Token的同一个区块链上的多币种，也可以是集成了比特币和以太坊等不同区块链的多币种。</p><p>右二是按照私钥存储的方式来区分的钱包，实际上这里主要涉及了用户私钥是否被平台托管，如果不托管直接存储在用户端，也就是硬件、终端设备、纸质记录，这些都可以被称为On-chain的钱包；如果用户无法接触到私钥，私钥被托管在平台，那么这种钱包也被称为Off-chain的钱包。</p><p>右一是按照访问方式进行分类的钱包，例如可以多个人共同管理，同时它也是需要多重签名支持的钱包，否则就变成了个人私有的钱包。</p><p>以上的分类并不是绝对的，一个钱包可以兼具以上不同的属性，例如某个Mobile钱包是提供On-chain的，也提供多重签名、提供多币种的钱包，这种钱包通常就是业界比较流行的钱包类型。</p><p>但是，对于平台方来说，上述钱包类型可能不足以支持自己平台的需求，并发挥出最佳的功效。毕竟作为平台来说，对高可用、分叉检测、区块确认的要求是远远高于普通钱包的，这样的问题又是如何解决的呢？这就引入了一项新的技术。</p><h2 id="扫描区块技术-block-scan" tabindex="-1"><a class="header-anchor" href="#扫描区块技术-block-scan"><span>扫描区块技术 Block scan</span></a></h2><p>我们之前在深入区块链技术部分介绍过，构成区块链的四个核心技术是：P2P网络协议、分布式一致性算法、加密签名算法、账户与交易模型。这四个技术对应到数字货币钱包中就是，P2P网络、持久化存储、账户以及私钥管理、共识与交易验证四大模块。</p><p>其中，持久化存储模块是由全节点钱包自带的嵌入式数据库提供的，这里有LevelDB、BerkerlyDB、SQLite3等多种选择。</p><p>但是无论选择哪种嵌入式数据库，都面临了一个严峻问题，精细化的交易查询验证与性能不可兼具。换句话来说，任何全节点的嵌入式数据库都无法和服务器级别的数据库相媲美。</p><p>对于平台开发来说，显然选择服务器级别的数据库是更为合适的选择。那么这里就涉及了一个问题，如何把全节点钱包中的数据转换成为数据库服务器中的数据，这就需要用到一种扫描区块技术，简称扫块。</p><p>扫块，顾名思义，就是指扫描全节点钱包中的所有区块，然后将其解析后存储到数据库服务器的过程，这些数据库可以是MongoDB，也可以是MySQL，取决于你的业务需要。</p><p>我们可以举元界区块链扫块的例子，元界上的区块结构与比特币接近，你可以将其类比成比特币区块链。</p><p>以下是Python代码，展示了基于MySQL的关系型表结构，目的是从元界的嵌入式数据库中扫描区块，然后存储到MySQL中。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>     def init_table(conn):</span></span>
<span class="line"><span>tables = []</span></span>
<span class="line"><span>tb_block = &amp;#39;&amp;#39;&amp;#39;</span></span>
<span class="line"><span>create table if not EXISTS block (</span></span>
<span class="line"><span>  number bigint primary KEY ,</span></span>
<span class="line"><span>  hash char(64) not null,</span></span>
<span class="line"><span>  bits bigint,</span></span>
<span class="line"><span>  transaction_count INTEGER ,</span></span>
<span class="line"><span>  mixhash  VARCHAR (128),</span></span>
<span class="line"><span>  version char(8) ,</span></span>
<span class="line"><span>  merkle_tree_hash char(64),</span></span>
<span class="line"><span>  previous_block_hash CHAR (64),</span></span>
<span class="line"><span>  nonce varchar(128) ,</span></span>
<span class="line"><span>  time_stamp bigint</span></span>
<span class="line"><span>) DEFAULT charset=utf8;</span></span>
<span class="line"><span>&amp;#39;&amp;#39;&amp;#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tb_tx = &amp;#39;&amp;#39;&amp;#39;</span></span>
<span class="line"><span>  create table if not EXISTS tx (</span></span>
<span class="line"><span>    id bigint PRIMARY KEY ,</span></span>
<span class="line"><span>    block_height bigint REFERENCES block(id),</span></span>
<span class="line"><span>    hash char(64) not null</span></span>
<span class="line"><span>  )DEFAULT charset=utf8 ;&amp;#39;&amp;#39;&amp;#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tb_address = &amp;#39;&amp;#39;&amp;#39;</span></span>
<span class="line"><span>    create table if not EXISTS address(</span></span>
<span class="line"><span>        id int PRIMARY KEY ,</span></span>
<span class="line"><span>        address VARCHAR (64) UNIQUE</span></span>
<span class="line"><span>    )DEFAULT charset=utf8;</span></span>
<span class="line"><span>&amp;#39;&amp;#39;&amp;#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tb_output = &amp;#39;&amp;#39;&amp;#39;</span></span>
<span class="line"><span>    create table if not EXISTS tx_output(</span></span>
<span class="line"><span>      id bigint PRIMARY key,</span></span>
<span class="line"><span>      hash char(64) NOT NULL ,</span></span>
<span class="line"><span>      tx_id bigint REFERENCES tx(id),</span></span>
<span class="line"><span>      output_index bigint not null,</span></span>
<span class="line"><span>      output_value bigint,</span></span>
<span class="line"><span>      address_id bigint REFERENCES address(id),</span></span>
<span class="line"><span>      script varchar(1024),</span></span>
<span class="line"><span>      asset varchar(64),</span></span>
<span class="line"><span>      decimal_number varchar(8)</span></span>
<span class="line"><span>    )DEFAULT charset=ascii;</span></span>
<span class="line"><span>&amp;#39;&amp;#39;&amp;#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tb_output_fork = &amp;#39;&amp;#39;&amp;#39;</span></span>
<span class="line"><span>        create table if not EXISTS tx_output_fork(</span></span>
<span class="line"><span>          id bigint PRIMARY key,</span></span>
<span class="line"><span>          hash char(64) NOT NULL ,</span></span>
<span class="line"><span>          tx_id bigint,</span></span>
<span class="line"><span>          output_index bigint not null,</span></span>
<span class="line"><span>          output_value bigint,</span></span>
<span class="line"><span>          address_id bigint,</span></span>
<span class="line"><span>          script varchar(1024),</span></span>
<span class="line"><span>          asset varchar(64),</span></span>
<span class="line"><span>          decimal_number varchar(8)</span></span>
<span class="line"><span>        )DEFAULT charset=ascii;</span></span>
<span class="line"><span>    &amp;#39;&amp;#39;&amp;#39;</span></span>
<span class="line"><span>tb_tx_fork = &amp;#39;&amp;#39;&amp;#39;</span></span>
<span class="line"><span>      create table if not EXISTS tx_fork (</span></span>
<span class="line"><span>        id bigint PRIMARY KEY ,</span></span>
<span class="line"><span>        block_height bigint,</span></span>
<span class="line"><span>        hash char(64) not null</span></span>
<span class="line"><span>      )DEFAULT charset=ascii ;&amp;#39;&amp;#39;&amp;#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tb_input_fork = &amp;#39;&amp;#39;&amp;#39;</span></span>
<span class="line"><span>        create table if not EXISTS tx_input_fork(</span></span>
<span class="line"><span>          id bigint PRIMARY key,</span></span>
<span class="line"><span>          tx_id bigint,</span></span>
<span class="line"><span>          belong_tx_id bigint,</span></span>
<span class="line"><span>          tx_index bigint,</span></span>
<span class="line"><span>          tx_value bigint not null,</span></span>
<span class="line"><span>          script varchar(1024),</span></span>
<span class="line"><span>          address_id bigint,</span></span>
<span class="line"><span>          asset varchar(64),</span></span>
<span class="line"><span>          decimal_number varchar(8)</span></span>
<span class="line"><span>        )DEFAULT charset=ascii;</span></span>
<span class="line"><span>    &amp;#39;&amp;#39;&amp;#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tb_block_fork = &amp;#39;&amp;#39;&amp;#39;</span></span>
<span class="line"><span>    create table if not EXISTS block_fork (</span></span>
<span class="line"><span>      number bigint primary KEY ,</span></span>
<span class="line"><span>      hash char(64) not null,</span></span>
<span class="line"><span>      bits bigint,</span></span>
<span class="line"><span>      transaction_count INTEGER ,</span></span>
<span class="line"><span>      mixhash  VARCHAR (128),</span></span>
<span class="line"><span>      version char(8) ,</span></span>
<span class="line"><span>      merkle_tree_hash char(64),</span></span>
<span class="line"><span>      previous_block_hash CHAR (64),</span></span>
<span class="line"><span>      nonce varchar(128) ,</span></span>
<span class="line"><span>      time_stamp bigint</span></span>
<span class="line"><span>    ) DEFAULT charset=ascii;</span></span>
<span class="line"><span>    &amp;#39;&amp;#39;&amp;#39;</span></span>
<span class="line"><span>tb_output_asset = &amp;#39;&amp;#39;&amp;#39;</span></span>
<span class="line"><span>    create table if not EXISTS tx_output_asset(</span></span>
<span class="line"><span>      id bigint PRIMARY key,</span></span>
<span class="line"><span>      hash char(64) NOT NULL ,</span></span>
<span class="line"><span>      tx_id bigint REFERENCES tx(id),</span></span>
<span class="line"><span>      output_index bigint not null,</span></span>
<span class="line"><span>      output_value bigint,</span></span>
<span class="line"><span>      address_id bigint REFERENCES address(id),</span></span>
<span class="line"><span>      asset_name varchar(64),</span></span>
<span class="line"><span>      issuer varchar(64),</span></span>
<span class="line"><span>      asset_type varchar(8),</span></span>
<span class="line"><span>      description varchar(64)</span></span>
<span class="line"><span>    )DEFAULT charset=utf8;</span></span>
<span class="line"><span>&amp;#39;&amp;#39;&amp;#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tb_input = &amp;#39;&amp;#39;&amp;#39;</span></span>
<span class="line"><span>    create table if not EXISTS tx_input(</span></span>
<span class="line"><span>      id bigint PRIMARY key,</span></span>
<span class="line"><span>      tx_id bigint REFERENCES tx(id),</span></span>
<span class="line"><span>      belong_tx_id bigint REFERENCES tx(id),</span></span>
<span class="line"><span>      tx_index bigint REFERENCES tx_output(output_index),</span></span>
<span class="line"><span>      tx_value bigint not null,</span></span>
<span class="line"><span>      script varchar(1024),</span></span>
<span class="line"><span>      address_id bigint REFERENCES address(id),</span></span>
<span class="line"><span>      asset varchar(64),</span></span>
<span class="line"><span>      decimal_number varchar(8)</span></span>
<span class="line"><span>    )DEFAULT charset=ascii;</span></span>
<span class="line"><span>&amp;#39;&amp;#39;&amp;#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们按照元界区块链的结构，可以把表分为四大类：</p><p>第一类是区块block；<br> 第二类是交易Tx；<br> 第三类是交易输入输出：tb_input，tb_output；<br> 第四类是分叉处理。</p><p>下面我贴一个普通的以JSON格式展示的区块和交易，你可以对比一下和上述表的关系：</p><p>下面是一个区块，里面包含了一笔交易。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> &amp;quot;header&amp;quot; :</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>  &amp;quot;result&amp;quot; :</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>   &amp;quot;bits&amp;quot; : &amp;quot;7097242144892&amp;quot;,</span></span>
<span class="line"><span>   &amp;quot;hash&amp;quot; : &amp;quot;cb36f2a1cbbf6a6300f4bf4915a5f54476ab603f2703a99e5d8d2db7ae2b37ed&amp;quot;,</span></span>
<span class="line"><span>   &amp;quot;merkle_tree_hash&amp;quot; : &amp;quot;3457b988bc6b61a7ad803f0742a68064c622ec618b833d99d153b92cba264d53&amp;quot;,</span></span>
<span class="line"><span>   &amp;quot;mixhash&amp;quot; : &amp;quot;47266114351983928450891657703600980449927404535067001902399906817438963939929&amp;quot;,</span></span>
<span class="line"><span>   &amp;quot;nonce&amp;quot; : &amp;quot;1864926684099479906&amp;quot;,</span></span>
<span class="line"><span>   &amp;quot;number&amp;quot; : 1000000,</span></span>
<span class="line"><span>   &amp;quot;previous_block_hash&amp;quot; : &amp;quot;049257f31f4412bf115ed44a9305012ccea888cf842c2f0b66a528f258016e50&amp;quot;,</span></span>
<span class="line"><span>   &amp;quot;time_stamp&amp;quot; : 1520339120,</span></span>
<span class="line"><span>   &amp;quot;transaction_count&amp;quot; : 1,</span></span>
<span class="line"><span>   &amp;quot;version&amp;quot; : 1</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span> },</span></span>
<span class="line"><span> &amp;quot;txs&amp;quot; :</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>  &amp;quot;transactions&amp;quot; :</span></span>
<span class="line"><span>  [</span></span>
<span class="line"><span>   {</span></span>
<span class="line"><span>    &amp;quot;hash&amp;quot; : &amp;quot;3457b988bc6b61a7ad803f0742a68064c622ec618b833d99d153b92cba264d53&amp;quot;,</span></span>
<span class="line"><span>    &amp;quot;inputs&amp;quot; :</span></span>
<span class="line"><span>    [</span></span>
<span class="line"><span>     {</span></span>
<span class="line"><span>      &amp;quot;previous_output&amp;quot; :</span></span>
<span class="line"><span>      {</span></span>
<span class="line"><span>       &amp;quot;hash&amp;quot; : &amp;quot;0000000000000000000000000000000000000000000000000000000000000000&amp;quot;,</span></span>
<span class="line"><span>       &amp;quot;index&amp;quot; : 4294967295</span></span>
<span class="line"><span>      },</span></span>
<span class="line"><span>      &amp;quot;script&amp;quot; : &amp;quot;[ 0340420f ]&amp;quot;,</span></span>
<span class="line"><span>      &amp;quot;sequence&amp;quot; : 0</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>    ],</span></span>
<span class="line"><span>    &amp;quot;lock_time&amp;quot; : &amp;quot;0&amp;quot;,</span></span>
<span class="line"><span>    &amp;quot;outputs&amp;quot; :</span></span>
<span class="line"><span>    [</span></span>
<span class="line"><span>     {</span></span>
<span class="line"><span>      &amp;quot;address&amp;quot; : &amp;quot;MUiW2CViWLQBg2TQDsRt1Pcj7KyrdqFPj7&amp;quot;,</span></span>
<span class="line"><span>      &amp;quot;attachment&amp;quot; :</span></span>
<span class="line"><span>      {</span></span>
<span class="line"><span>       &amp;quot;type&amp;quot; : &amp;quot;etp&amp;quot;</span></span>
<span class="line"><span>      },</span></span>
<span class="line"><span>      &amp;quot;index&amp;quot; : 0,</span></span>
<span class="line"><span>      &amp;quot;locked_height_range&amp;quot; : 0,</span></span>
<span class="line"><span>      &amp;quot;script&amp;quot; : &amp;quot;dup hash160 [ e45695c2c390625376a7225a7ebea90dbb4147cf ] equalverify checksig&amp;quot;,</span></span>
<span class="line"><span>      &amp;quot;value&amp;quot; : 270750000</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>    ],</span></span>
<span class="line"><span>    &amp;quot;version&amp;quot; : &amp;quot;1&amp;quot;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们可以发现区块头部分的数据被存储到tb_block表中，然后交易哈希被存储的tb_tx表中，接着交易的输入输出被存储到tb_input和tb_output中，这三者是通过区块高度、交易哈希被链接起来的。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span> tb_block &amp;lt;--区块高度--&amp;gt;  tb_tx &amp;lt;--交易哈希--&amp;gt; tb_input/tb_output</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>完整的Python脚本可以通过这个链接查看：</p><p><a href="https://github.com/mvs-org/mvsd-mysql-sync/blob/master/tools/sync.py" target="_blank" rel="noopener noreferrer">https://github.com/mvs-org/mvsd-mysql-sync/blob/master/tools/sync.py</a></p><p>整体的思路是使用getblock的JSON-RPC，从第0个高度的区块一直扫描到最新区块，并且存储到MySQL中。</p><p>这里最难以处理的问题是保持MySQL中的区块数据与全节点数据的一致性，也就是当区块链分叉时，MySQL需要感知到发生了分叉，接着移除被分叉的区块，并且接着同步到正确的区块上。</p><p>这个处理方法有不同的思路，上述脚本使用了移动区块数据的方法，也就是将孤儿块移动到tb_tx_fork下，接着同步正确的区块。实际上也可以通过标记法，即在tb_block中，将此块标记为孤儿块。</p><p>关系型的表结构也可以做成标准化的，区块链本身作为基础设施，历史交易已经不可篡改，如果把这些结构化的区块做成公共基础设施，并提供基于API的开放调用，这便就是我们常见的区块浏览器了。</p><p>上文我们介绍了扫描区块的思路和实践，实际上我们也可以使用Presto技术将钱包中的数据转换成类SQL查询，但这里服务的稳定性和性能需要经过测试才可以被平台使用。</p><p>扫描区块技术解决了所有区块链资产可视化、高并发查询的问题，所以它在一些大规模的数字货币交易所中也有应用。区块浏览器就是基于这种技术产生的一种Web服务，下面我们就来看一看区块浏览器与扫描区块的具体关系。</p><h2 id="区块浏览器" tabindex="-1"><a class="header-anchor" href="#区块浏览器"><span>区块浏览器</span></a></h2><p>我在前面介绍数字货币和交易所时有提到过区块浏览器，它提供了可视化的交易查询和验证服务。</p><p>从技术上看，一个区块浏览器的主要工作就是把区块扫描到数据库服务器中，然后搭建一个Web访问服务，用户只需要输入交易哈希或者区块哈希，即可查询到交易是否已经被打包和确认。</p><p>目前比特币和以太坊的流行区块浏览器比较多，不局限在某一个区块浏览器，因为大家看到的区块数据是一样的，区别就是如何更好地展示，做得更好的话，还可以集成一些咨询和资产托管的功能。</p><p>从产品意义上来说，我认为区块浏览器更适合叫做资产浏览器，因为它为人们提供了资产证明的服务，而不必肉眼识别交易或者自行手动解析交易，一般来说，区块浏览器也提供基本的API查询服务。</p><p>区块浏览器也为人们提供了区块和交易的统计数据，帮助人们直接地了解这个区块链的活跃程度，人们也可以根据统计数据制作区块活跃度等指数帮助投资者了解这个区块链项目。</p><p>区块浏览器降低了普通人查询和验证交易的门槛，其实它也是整个区块链行业的配套基础设施，而对于平台来说，从第三方获取交易验证始终是一件不安全的事情，也面临着中心化的风险，那么平台如果想搭建自己的交易查询和验证服务，需要如何操作？</p><p>这就需要把数字货币钱包服务，集成到自己的系统里。下面我们就来聊一聊具体是如何集成的。</p><h2 id="数字货币钱包服务" tabindex="-1"><a class="header-anchor" href="#数字货币钱包服务"><span>数字货币钱包服务</span></a></h2><p>实际上，大规模的区块链应用都需要搭建一个数字货币钱包服务，数字货币钱包服务为系统中的其他模块提供了可扩展的、统一的、安全的交易查询和验证服务。</p><p>下图是我从交易平台开发归纳出来的数字货币钱包服务。</p><img src="https://static001.geekbang.org/resource/image/d4/4b/d478d2523f22e437d781a0d7b5b21e4b.png" alt=""><p>数字货币钱包服务可以为交易平台其他模块提供接口统一的API，同时将不同的数据结构化到数据库服务中，最后可以通过传统高可用手段完成交易查询和验证。</p><p>当然，这也和交易所的规模有关，如果是一个小型交易所，扫块可能不是必需的，但是统一接口的API却是必须的。</p><p>我认为数字货币钱包服务应当有一套标准的钱包服务框架，支持主流数字货币，从而降低大家的使用和部署门槛，这也和我们上一篇聊到的“区块链即服务”的概念不谋而合。</p><p>可以说区块链的配套设施和技术还很原始，还有很大的发展和提升的余地。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>好了，今天我们先了解了一下数字货币钱包的分类，接着详细讲解扫块技术，然后又谈到了区块浏览器，最后分享了一下数字货币钱包服务的集成思路，希望可以让你对区块服务的实践有一个初步了解，你也可以根据已有的技术知识重新拆解和分析区块链技术。</p><p>那么今天的问题是，数字货币钱包服务可以应用到微服务架构中吗？</p>`,57)]))}const r=n(e,[["render",l]]),m=JSON.parse('{"path":"/posts/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%E5%8C%BA%E5%9D%97%E9%93%BE/%E7%AC%AC%E5%9B%9B%E7%AB%A0%20%E5%8C%BA%E5%9D%97%E9%93%BE%E4%B8%8E%E5%BD%93%E4%B8%8B%E4%BA%92%E8%81%94%E7%BD%91/%E7%AC%AC31%E8%AE%B2%20_%20%E6%95%B0%E5%AD%97%E8%B4%A7%E5%B8%81%E9%92%B1%E5%8C%85%E6%9C%8D%E5%8A%A1.html","title":"第31讲 _ 数字货币钱包服务","lang":"zh-CN","frontmatter":{"description":"第31讲 _ 数字货币钱包服务 上一篇，我们谈到了“区块链即服务”的概念。实际上，区块链第一个需要解决的服务就是数字货币支付服务。如何将数字货币钱包集成到系统中，我认为这是区块链行业最为迫切的问题。 今天我们就来了解一下数字货币钱包，它面临了什么样的问题，这样的问题又需要什么技术才能解决，而数字货币平台想要定制自己的数字货币钱包服务，又应当如何集成。 ...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/interview/posts/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%E5%8C%BA%E5%9D%97%E9%93%BE/%E7%AC%AC%E5%9B%9B%E7%AB%A0%20%E5%8C%BA%E5%9D%97%E9%93%BE%E4%B8%8E%E5%BD%93%E4%B8%8B%E4%BA%92%E8%81%94%E7%BD%91/%E7%AC%AC31%E8%AE%B2%20_%20%E6%95%B0%E5%AD%97%E8%B4%A7%E5%B8%81%E9%92%B1%E5%8C%85%E6%9C%8D%E5%8A%A1.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"第31讲 _ 数字货币钱包服务"}],["meta",{"property":"og:description","content":"第31讲 _ 数字货币钱包服务 上一篇，我们谈到了“区块链即服务”的概念。实际上，区块链第一个需要解决的服务就是数字货币支付服务。如何将数字货币钱包集成到系统中，我认为这是区块链行业最为迫切的问题。 今天我们就来了解一下数字货币钱包，它面临了什么样的问题，这样的问题又需要什么技术才能解决，而数字货币平台想要定制自己的数字货币钱包服务，又应当如何集成。 ..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-08-16T11:19:38.000Z"}],["meta",{"property":"article:modified_time","content":"2025-08-16T11:19:38.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"第31讲 _ 数字货币钱包服务\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-08-16T11:19:38.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1755343178000,"updatedTime":1755343178000,"contributors":[{"name":"bbhou","username":"bbhou","email":"1557740299@qq.com","commits":1,"url":"https://github.com/bbhou"}]},"readingTime":{"minutes":11.3,"words":3390},"filePathRelative":"posts/深入浅出区块链/第四章 区块链与当下互联网/第31讲 _ 数字货币钱包服务.md","localizedDate":"2025年8月16日","excerpt":"\\n<p><audio id=\\"audio\\" title=\\"第31讲 | 数字货币钱包服务\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/bb/20/bb2672945b84319fc5c0c05239e3a820.mp3\\"></audio></p>\\n<p>上一篇，我们谈到了“区块链即服务”的概念。实际上，区块链第一个需要解决的服务就是数字货币支付服务。如何将数字货币钱包集成到系统中，我认为这是区块链行业最为迫切的问题。</p>\\n<p>今天我们就来了解一下数字货币钱包，它面临了什么样的问题，这样的问题又需要什么技术才能解决，而数字货币平台想要定制自己的数字货币钱包服务，又应当如何集成。</p>","autoDesc":true}');export{r as comp,m as data};
