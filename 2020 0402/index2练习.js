// /基于单例模式实现业务板块的开发
let shopModule = (function () {
	let navList = document.querySelectorAll('.navbar-nav .nav-item'),
		productBox = document.querySelector('.productBox'),
		cardList = null,
		data = null;
	// data=null;
	//从服务器获取数据(AJAX)
	//从服务器获取到的结果是json格式的字符串（我们需要把其处理为对象在操作）
	//vscode预览的时候，我们基于 open with live server 来预览，让页面地址是：http://127这种网络格式，而不是file:// 
	//文件协议格式，因为文件协议不能发送ajax请求。
	//queryData:从服务器获取数据


	let queryData = function queryData() {
		let xhr = new XMLHttpRequest;
		//HTTP 请求的状态.当一个 XMLHttpRequest 初次创建时，这个属性的值从 0 开始，直到接收到完整的 HTTP 响应，这个值增加到 4。
		xhr.open('GET', './json/product.json', false);
		//第一个参数提交方式：GET、POST最为常见。
		//第二个参数： 提交的路径，如果是GET传参send(null); 可以写为这样。
		//第三个参数：是以异步的方式还是同步的方式提交
		//发送一个请求后，客户端无法确定什么时候会完成这个请求，所以需要用事件机制来捕获请求的状态，
		//XMLHttpRequest对象提供了onreadyStateChange事件实现这一功能。这类似于回调函数的做法。
		xhr.onreadystatechange = () => {
			//0-UNINITIALIZED：XML 对象被产生，但没有任何文件被加载。
			//1-LOADING：加载程序进行中，但文件尚未开始解析。
			//2-LOADED：部分的文件已经加载且进行解析，但对象模型尚未生效。
			//3-INTERACTIVE：仅对已加载的部分文件有效，在此情况下，对象模型是有效但只读的。
			//4-COMPLETED：文件已完全加载，代表加载成功
			if (xhr.readyState === 4 && xhr.status === 200) {
				//response.setStatus(200) 设置服务器响应的状态码为200常见的：200表示成功   404表示请求路径错误 500一般是代码错误还有 302 304 307 什么的 转发和重定向的
				data = JSON.parse(xhr.responseText);
				//JSON.parse是从一个字符串中解析出json(键值对)。 
			};
		};
		xhr.send(null);
		//向服务器发送请求,但是不带有数据发送过去,一般在get方式发送时候多使用这个方式
	};


	//bindHTML:完成数据绑定
	let bindHTML = function bindHTML() {
		//我们从服务器获取的数据是一个数组，数组中有多少项，证明有多少个产品，此时我呢创建多少个caed盒子展示不同的产品信息，
		//最好把所有创建好的card放到容器中即可
		let str = ``;
		data.forEach(item => {
			//item是获取的每一个产品对象
			let {
				title,
				price,
				time,
				hot,
				img
			} = item;
			//${}是在es6中模板字符串中拼接一个js表达式 执行有结果的js语句 的结果。
			str += `<div class="card" data-price="${price}" data-time="${time}"
			data-hot="${hot}">
			<img src="${img}" class="card-img-top" alt="">
			<div class="card-body">
				<h5 class="card-title">${title}</h5>
				<p class="card-text">价格：￥${price.toFixed(2)}</p>
				<p class="card-text">销量：${hot}</p>
				<p class="card-text">时间：${time}</p>
			</div>
		</div>`;
		});
		productBox.innerHTML = str;
		cardList = productBox.querySelectorAll('.card');
	};

	//clear:控制除当前点击li以外的，升降序标识都回归1
	let clear = function clear() {
		//this:当前点击的这个li
		[].forEach.call(navList, item => {
			if (item !== this) {
				item.flag = -1;
			}
		});
	};



	//sortcard:排序
	let sortCard = function sortCard(i) {
		//this:当前点击的这个li
		let arr = Array.from(cardList);
		let char = 'data-price';
		i === 1 ? char = 'data-time' : null;
		i === 2 ? char = 'data-hot' : null;
		arr.sort((a, b) => {
			//获取char的值通过名字就可以分析出：get 就是得到,set就是设置.
			// Attribute就是属性的意思！
			// 所以你要的答案就是： getAttribute获得属性！
			// setAttribute就是设置属性！
			// 举个例子：
			// 对于session对象来说, 我先设置其属性：
			// session.setAttribute("hello");
			// 然后我可以在其它的页面当中通过, session.getAttribute(参数);
			// 得到我设置过的属性！
			a = a.getAttribute(char);
			b = b.getAttribute(char);
			if (char === 'data-time') {
				//replace 是字符串的方法，接受两个参数，第一个为要搜索的表达式，第二个为要替换的内容。这里第二个参数是空字符串，即将搜索到的表达式替换为空。
				a = a.replace(/-/g, '');
				b = b.replace(/-/g, '');
			}
			return (a - b) * this.flag;
		});
		for (let j = 0; j < arr.length; j++) {
			productBox.appendChild(arr[j]);
		};
	};


	//handlenav:按钮的循环事件绑定
	let handleNav = function handleNav() {
		[].forEach.call(navList, (item, index) => {
			item.flag = -1;
			item.onclick = function () {
				//this:当前点击的这个li
				clear.call(this);
				this.flag *= -1;
				sortCard.call(this, index);
			};
		});
	};

	return {
		init() {
			//大脑中枢：控制所有的方法按照逻辑依次执行
			queryData();
			bindHTML();
			handleNav();
		}
	};
})();
shopModule.init();