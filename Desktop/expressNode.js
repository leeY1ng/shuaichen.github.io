app.use(function(req,res,next){
	console.log("processing request for "+req.url+"!");
	next();
})
app.use(function(req,res,next){
	console.log("terminating for playing...");
	res.send("thank for playing!");
})
app.use(function(req,res,next){
	console.log("whoops, i'll never get called!");
})



var app = require("express")();

app.use(function(req,res,next){
	console.log("\n\nALLWAYS");
	next();
})

app.get("/a",function(req,res){
	console.log("/a:路由终止");
	res.send("a");
})
app.get("/a",function(req,res){
	console.log("/a 永远不会调用");
})

app.get("/b",function(req,res,next){
	console.log("/b 路由未终止");
	next();
})

app.use(function(req,res,next){
	console.log("sometimes");
	next();
})

app.get("/b",function(req,res,next){
	console.log("/b (part2): push the mistake");
	throw new Error("b fail");
})
app.use("/b",function(err,req,res,next){
	console.log("/b test the mistake and pass it ");
	next(err);
})

app.get("/c",function(err,req){
	console.log("/c push the mistake");
	throw new Error("c fail");
})

app.use("/c",function(err,req,res,next){
	console.log("test the mistake and not pass it");
	next();
})

app.use(function(err,req,res,next){
	console.log("test the mistable havent been done"+err.message);
	res.send("500 - server error");
})

app.use(function(req,res){
	console.log("未处理的路由");
	res.send("404 - not found");
})

app.listen(3000,function(){
	console.log("listening the port 3000");
})

中间件必须是一个函数
app.use(express.static);/不会期望中的工作 错误写法
console.log(express.static()); /output "function" 会返回函数的函数

模块也可以输出一个函数 这个函数可以直接用作中间件
module.exports = function(req,res,next){
	var cart = req.session.cart;
	if(!cart){
		return next();
	}
	if(cart.some(function(item){
		return item.product.requiresWaiver;
	})){
		if(!cart.warnings){
			cart.warnings=[];
		}
		cart.warnings.push("onr or more of your" + 
			"selected tours");
	}
	next();
}

更常见的做法是输出一个以中间件为属性的对象
将所有购物车验证代码放到

module.exports = {
	checkWaivers:function(req,res,next){
		var cart = req.session.cart;
		if(!cart){
			return next();
		}
		if(cart.some(function(i){
			return i.product.requiresWaiver;
		})){
			if(!cart.warnings){
				cart.warnings = [];
			}
			cart.warnings.push("noe or more of your"+
				"selected tours requires a waiver");
		}
		next();
	},
	checkGuextCounts:function(req,res,next){
		var cart = req.session.cart;
		if(!cart){
			return next();
		}
		if(cart.some(function(item){
			return item.guests > item.product.maximumGuests;
		})){
			if(!cart.errors){
				cart.error = [];
			}
			cart.errors.push("one or more of your"+
				"cant accmomodate the number of guests you");
		}
		next();
	}
}

然后引入中间件：
var cartValidation = require("./lib/cartValidation.js");
app.use(cartValidation.checkWaivers);
app.use(cartValidation.checkGuextCounts);

语句 return next()提前终止中间件
expess not hope the middle-ware return any value and 
not use the return value do any thing
so this is just the "next()" for short  "next();return;";

常用中间件
其他中间件从connect中分离出 只保留了static

剥离中间件让express不再维护那么多依赖 并且这些独立的项目
可以独立于express并发展成熟

建议一起安装connect

basicAuth(app.use(connect.basicAuth)());
provide the basic secure;
and u just use the basic-auth by the https
(otherwise account and password 通过明文传输)
需要快又容易的东西且在使用https时，用basic-auth

body-parser
只连入json和urlencoded的中间件，除非单独使用json或
urlencoded 使用这个包

json
json编码的请求体 
application/x-www-form-urlencoded 可以被urlencoded解析

urlencoded
解析媒体类型application/x-www-form-urlencoded的请求体
处理表单和ajax常用的方式

multipart废弃
使用busboy或formidable代替它

cookie.parser
提供对cookie的支持

cookie-session
提供cookie存储的会话支持 （不推荐）

express-session提供会话id
默认在内存里，不适用于生产环境并且可以配置为使用数据库存储


csurf 
防范跨域请求伪造csrf攻击
要使用会话必须放在express-session中间件的后面
目前等于 connect.csrf 但简单连入并不能防范 18章

directory
提供静态文件的目录清单支持，如果不需要目录清单，
不需要这个中间件

errorhandler
为客户端提供栈追踪和错误消息
建议不在生产环境中连入 会暴露细节 安全和隐私问题

static-favicon
提供favicon出现在浏览器上的图标 不是必须
在static目录放入favicon。ico图标 这个中间件可以
提升性能 尽可能放在中间件栈的上面

morgan
提供自动日志记录文件，所有请求都会记录，详情20章

method-override
提供对x-http-method-override的支持
允许浏览器假装使用除get和post以外的http方法 对调试有帮助

query
解析查询字符串并将其变为请求对象上的query属性
express隐含连入不需要手动

response-time 向响应中添加X-Response-Time头
提供以毫秒为单位的响应时间，一般在做性能调优时才会
需要这个中间件


static
提供对静态(public)文件的支持 可以连入多次并指定不同的目录
16章

vhost
虚拟主机 使子域名在express中更容易管理 14章

第三方中间件
目前没有第三方中间件的索引目录 
npm搜索express connect middleware 可以得到


11、发送邮件
Nodemailer第三方模块

smtp简单邮件传输协议

msa邮件提交代理
mta邮件传输代理

接收邮件
simpleSMTP haraka

邮件头
邮件消息分为头部和主体

头部包含基本信息 发送人 收信人 接收日期 主题
发送邮件必须有from地址

邮件格式
可是普通文本 也可以是html

html邮件

how-to-code-html-emails
html email boilerplate

测试litmus
安全：头、粗体、斜体文本、水平分割线、图片链接

Nodemailer第三方模块

提供了大多数邮件服务的快捷方式

gmail,...

如果mas没有出现在列表上，需要直接连接smtp服务器

var mailTransport = nodemailer.createTransport("SMTP",
{
	host:"smtp.meadowlarkTravle.com",
	secureConnection:true,
	auth:{
		user:credentials.meadowlarkSmtp.user,
		pass:credentials.meadowlarkSmtp.password
	}
})

发送邮件

mailTransport.sendMail({
	from:'"Meadowlark Travel"<info@meadowlarkTravle.com>',
	to:"joecustomer@gmail.com",
	subject:"your meadowlark travel tour",
	text:"thank you for booking your trip with meadowlark"

},function(err){
	if(err){
		console.error("unable to send mail"+error);
	}
})


没有错误也不一定邮件成功发给了接收者
只有跟msa通信出现问题才会设置回调函数的err参数
（网路错误或者授权错误）
如果msa不能投递邮件 会收到投递给msa账号的失败邮件

需要系统自动判断是否投递成功
1\ 使用支持错误报告的msa
2\ 使用直接投递 跳过msa 不推荐 复杂方案

将邮件发送给多个接收者
使用逗号隔开

mailTransport.sendMail({
	from:'"Meadowlark Travel"<info@meadowlarkTravle.com>',
	to:'joecustomer@gmail.com,joe@gmail.com,haha<haha@qq.com>',
	subject:"your meadowlark travel tour",
	text:"thank you for booking your trip with meadowlark"

},function(err){
	if(err){
		console.error("unable to send mail"+error);
	}
})
观察msa的多发限制

多条消息 多个接收者

var recipientLimit = 100;
for(var i =0;i<argeRecipientList.length/recipientLimit;i++){
	mailTransport.sendMail({
	from:'"Meadowlark Travel"<info@meadowlarkTravle.com>',
	to:largeRecipientList.slice(i*recipientLimit,i*(recipientLimit+1).join(",")),
	subject:"your meadowlark travel tour",
	text:"thank you for booking your trip with meadowlark"

},function(err){
	if(err){
		console.error("unable to send mail"+error);
	}
})
}


发送批量邮件的最佳选择
mailChimp  
Campaign Monitor

发送html邮件
mailTransport.sendMail({
	from:'"Meadowlark Travel"<info@meadowlarkTravle.com>',
	to:largeRecipientList.slice(i*recipientLimit,i*(recipientLimit+1).join(",")),
	subject:"your meadowlark travel tour",
	html:"<h1>Meadowlark Travel </h1>",
	text:"thank you for booking your trip with meadowlark"

},function(err){
	if(err){
		console.error("unable to send mail"+error);
	}
})
工作量很大，不推荐
nodemailer可以将html翻译成普通文本

mailTransport.sendMail({
	from:'"Meadowlark Travel"<info@meadowlarkTravle.com>',
	to:largeRecipientList.slice(i*recipientLimit,i*(recipientLimit+1).join(",")),
	subject:"your meadowlark travel tour",
	html:"<h1>Meadowlark Travel </h1>",
	generateTextFromHtml:true

},function(err){
	if(err){
		console.error("unable to send mail"+error);
	}
})

html邮件中的图片
最好不要直接放图片
最好在静态资源中文件夹中给邮件图片一个专门位置
将同时用在网站和邮件中的资源分开
16章介绍一些平滑地从开发转向生成环境的技术

用视图发送html邮件
避免将html字符串放到js中

.
.
.
12、与生产相关的问题

express对不同执行环境的支持，扩展网站的方法，监控网站的健康
如何模拟生成环境来进行测试和开发 如何执行压力测试

执行环境
在生成、开发或测试模式中运行应用程序的方法
可以按照自己的想法创建很多种不同的环境
开发 生成和测试是标准环境

尽管app.set("env","production")可以指定执行环境
但最好不要这么做 不管什么情况，程序会一直运行在这个环境
可能在一个环境中执行然后切换到另一个环境


用环境变量NODE_ENV指定执行环境更好
调用app，get("env")
报告在哪种环境下运行

http.createServer(app).listen(app.get("port"),function(){
	console.log("express started in "+app.get("env") +
		"mode on http://localhost"+app.get("port")+
		"press strc+c to terminate");
});


没有指定
开发模式就是默认模式
将其放到生成环境下
export NODE_ENV=production

cygwin：
NODE_ENV=production node meadowlark.js
当服务器终止，环境变量NODE_ENV还是原来的值

生成模式下启动express 有些组件不适合生存模式下使用的警告信息，
connect.seesion 使用了内存存储，不适合生生产环境，第13章会切换到数据库存储
警告就会消失


环境特定配置
在生产环境下，视图缓存会默认启用 7章


环境特定配置
尽量缩小开发，测试和生产环境之间的差异应该保守的使用这个
功能
如果程序是高度数据库驱动，不想干扰生成数据库，并且
这个环境特定配置的良好候选用途
更加详细的日志，想在开发时记录很多东西都没必要在
生产环境中记录

给程序添加日志
morgan输出彩色文本
express-logger 支持日志循环

switch(app.get("env"){
	case "development":
		app.use(require("morgan")("dev"));
		break;
	case "production":
		app.use(require("express-logger")({
			path:_dirname+"/log/request.log"
		}));
		break;
})

想测试日志，可以在生产模式下运行程序
(NODE_ENV=production node meadowlark.js)
想实际看看日志的循环功能
可以编辑成node_modules/express-logger/logger.js
修改变量defaultIterval 从24h改成10s

_dirname把请求日志存在项目自身的子目录下，
应该将日志文件添加到.gitignore文件中
或将日志文件放到/var/log一个子目录下，
13章更加健壮的环境特定配置范例

扩展你的网站
向上\外扩展：
上：服务比变得更强、更快cpu更多内核 更多内存
外：更多服务器（收益率更高）

设计向外扩展的网站重要的是持久化

大部分持久化通过写入普通文件来实现
服务器做了负载均衡，一般请求由一台服务器处理，另一半由
另一台服务器处理
除非所有服务器都能访问到那个文件系统，否则不应该用本地文件
系统做持久化（例外：只读数据：日志和备份）
将表单提交的数据备份到本地普通文件中，以防数据库连接失效
一旦数据库中断，要到每个服务器上收集文件，但不会破坏文件


应用集群扩展
简单的 单服务器形式向外扩展

也可以为系统上的每一个内核创建一个独立的服务器
优点：
1、实现给定服务器性能的最大化（硬件或虚拟机）
2、在并行条件下测试程序的低开销方式

meadowlark.js

function startServer(){
	http.createServer(app).listen(app.get("port"),function(){
		console.log("express started in "+app.get("env")+
			"mode on http://localhost"+app.get("port")+
			"press control+c to terminate");
	});
}

if(require.main === module){
	startServer();
} else {
	module.exports = startServer;
}


直接运行脚本时
require.main === module 是true
如果是false
表明脚本是require加载进来


meadowlark_cluster.js

在这个js执行时，
或者在主线程的上下文中（node meadowlark_cluster.js执行）
或在工作线程的上下文中（node集群系统中执行）
属性 cluster.isMaster 和 cluster.isWorker 决定了你运行在哪个
上下文中，
运行这个脚本时，是在主线程模式下运行的，
并且用 cluster.fork 为每个系统中每个cpu启动了一个工作线程，
监听了工作线程的exit的事件，重新繁衍死掉的工作线程

最后在else句中处理工作线程的情况，
将 meadowlark.js配置为模块使用，只需要引入并立即调用它
（将它作为一个函数输出并启动服务器）

现在启动新的集群化服务器
node meadowlark_cluster.js


如果是虚拟机，将vm配置为多个cpu

在多核系统上，可以看到一些工作线程启动，
不同工作线程处理不同请求的证据
在路由前 添加以下中间件：
app.use(function(req,res,next){
	var cluster = require("cluster");
	if(cluster.isWorker){
		console.log("Worker %d received request",cluster.worker.id;);
	}
})

处理未捕获异常

在node异步世界里
未捕获异常需要关注的问题

app.get("/fail",function(req,res){
	throw new Error("nope");
})

在express执行路由处理器时，将它们封装在一个try/ catch
不是一个真正的未捕获异常，不会引起太多问题
express会在服务端记录异常，并且访问者会得到一个丑陋的栈输出
服务器是稳定的，其他请求正确处理

提供一个好的错误页面，可以创建文件 500.handlebars
在所有路由后面添加错误处理器：
app.use(function(err,req,res,next){
	console.error(err.stack);
	app.status(500).render("500");
})

提供定制的错误页面总归是好的方法
当错误出现时 不仅在用户面前显得更专业，可以让你采取行动

例如在错误处理器中发送一封邮件给开发团队，知道网站出错
这只能用在express可以捕获的异常上


更糟：

app.use("/epic-fail",function(req,res){
	process.nextTick(function(){
		throw new Error("Kaboom!");
	});
})

将整个服务器搞垮，
不仅没有显示错误信息，将服务器宕机 不能继续处理请求

settimeout是异步执行的 抛出异常的函数推迟到node空闲时才会执行

当node空闲时，可以执行这个函数，已经没有其所服务的请求上下文了
已经没有资源 ，直接关掉服务器 处于不确定状态

process.nextTick 跟调用没有参数的setTimeOut非常像，
效率更高 一般不会在服务端代码中使用
多异步执行的任务，数据库访问，文件系统访问 网络访问

如果出现了未捕获的异常 关闭服务器
或者 故障转移机制：使用集群 
如果是运行在集群模式下，一个线程死掉了 主线程会繁衍
另外一个线程取代他
（不需要多个工作的线程，有一个工作线程的集群就可以）

关闭服务器：
1、uncaughtException事件

2、域（推荐、较新的方式）
一个域就是一个执行上下文，会捕获在其中发生的错误，
有域，可以在错误处理上更灵活，不在是只有一个全局的未捕获异常处理器，
可以有很多域，可以在处理易出错的代码时创建新域

每一个请求在域中处理是好的做法，
这样就可以追踪那个请求中所有的未捕获错误并做出相应的响应
（正常关闭服务器）
添加一个中间件可以轻松的满足这个要求

app.use(function(req,res,next){
	//为请求创建一个域
	var domain = require("domain").create();

	//处理这个域中的错误
	domain.on("error",function(err){
		console.error("domain error caught\n",err.stack);
	
	try {
		//在5秒内进行故障保护，关机
		setTimeOut(function(){
			console.error("failasfe shutdown");
			process.exit(i);
		},5000);
		//从集群中断开
		var worker = require("cluster").worker;
		if(worker){
			worker.disconnect();
		}

		//停止接收新请求
		server.close();

		try{
			//尝试使用express错误路由
			next(err);
		}catch(err){
			//如果express错误路由失效，尝试返回普通文本响应
			console.error("express error mechanism failed"+
				"\n,",err.stack);
			res.statusCode = 500;
			res.setHeader("content-type","text/plain");
			res.end("server error");
		}
	}catch(err){
		console.error("unable to send 500 response.\n",err.stack);
	};
});
//向域中添加请求和响应对象
domain.add(req);
domain.add(res);

//执行该域中剩余的请求链
domain.run(next);

});

//其它中间件和路由放在这里

var server =http.createServer(app).listen(app.get("port"),function(){
	console.log("listening opn port %d",app.get("port"));
})

先创建一个域，附着一个错误处理器
只要域中出现未捕获错误就调用这个函数

然后试图给任何处理中的请求以恰当的响应，然后关闭服务器
根据错误的性质，可能无法响应处理中的请求
首先要先确立关闭服务器的截至时间
例子中：

允许服务器在5秒内响应处理中的请求，数值取决于程序，
如果程序有长请求，应该给予更多的时间
一旦确立的截至时间就会从集群中断开，（如果在集群中）
以防止集群给我们分配更多的请求，然后明确告诉服务器
不在接收新的连接

最后试图 传到错误处理路由 (next(err))来响应产生错误的请求

如果那会抛出错误，退回去用普通的node api响应，
如果其他的全部失败了，将会记录错误（客户端无法响应，超时）

一旦设置好未处理异常处理器
就把请求和响应对象添加到域中（允许对象上发生的错误在域中处理）
最后，在域的上下文中  运行  管道中的下一个中间件；

有效的运行域中管道里的所有中间件，next()调用是链起来的



如果只有一个工作线程，想立即关闭以正在进行中的所有会话为代价
如果有多个工作线程，在关闭前有回旋余地，让垂死的工作线程服务剩余的请求

“the 4 keys to 100% uptime with node.js”
在node上运行fluencia spanishDict 用域是保持node正常运行的根本



用多台服务器扩展

用集群向外扩展可以实现单台服务器