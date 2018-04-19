/*
javascript:
script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://dl.dropboxusercontent.com/s/v8uly3sqfyej1em/tradeTracker.js';
document.getElementsByTagName("head")[0].appendChild(script);
void( 0 );
*/

var tradeTracker = {
	data: {
		lName: 'Depot Tracker',
		version: '1.0',
		site:'https://akkela.net',
		forum: 'https://forum.voyna-plemyon.ru/index.php?threads/34691',
		akkRight: -140,
		url: 'mode=exchange',
		trackSell:false,
		trackBuy:false,
		lWrongPlace: 'Wrong place of execution. Please, use this script only on premium-depot page.',
		lFoundAlert: 'Searched offer founded',
		lSellPrice: 'track sell price',
		lBuyPrice: 'track buy price',
		lFoundAlert: 'Searched offer founded',
		lTracking: 'stop tracking',
		checkLang: function(){
			switch(game_data.market) {
				case "de":
					this.lName='Depot Tracker';
					this.lWrongPlace='Falsche Seite. Script funktioniert nur auf der Seite des Premiun-Depots';
					this.lFoundAlert='Erwünschtes Angebot vorhanden';
					this.lTracking='Suche abbrechen';
					this.lBuyPrice='Warte auf Kaufpreis';
					this.lSellPrice='Warte auf Verkaufpreis';
					break;
				case "ru":
					this.lName='Трекер биржы';
					this.lWrongPlace='Скрипт работает только на странице \"Премиум Биржа\" в обзоре рынка';
					this.lFoundAlert='Биржа может принять ваше предложение';
					this.lTracking='Остановить поиск';
					this.lBuyPrice='Ждать цену покупки';
					this.lSellPrice='Ждать цену продажи';
					break;
			}
		}
	},
	
	insertRows: {
		rows: '',
		setRow: function(art){
			operator=(art=="sellprice")?"<":">";
			btnName=(art=="sellprice")?tradeTracker.data.lSellPrice:tradeTracker.data.lBuyPrice;
			this.rows+="<tr><th><a onclick='tradeTracker.startTracking(this,\""+art+"\")' style='cursor: pointer;'>"+btnName+"</a></th><td class=\"center\"><div>"+operator+" <input type=\"text\" value=\"0\" id=\""+art+"wood\"></div></td><td class=\"center\"><div>"+operator+" <input type=\"text\" value=\"0\" id=\""+art+"stone\" ></div></td><td class=\"center\"><div>"+operator+" <input type=\"text\" value=\"0\" id=\""+art+"iron\" ></div></td></tr>";
		},
		
		init: function(){
			this.setRow("buyprice");
			this.setRow("sellprice");			
			//$("table.vis.premium-exchange").append(this.rows);
			$('tr td#premium_exchange_rate_wood').parent().after(this.rows);
			tradeTracker.lStorage.load();
		},
	},
	
	startTracking:function(obj,art){
		console.log("start");
		obj.innerHTML='<img id="loadGif" src="https://dl.dropboxusercontent.com/u/91723045/img/loading.gif" height="20" width="20">' + tradeTracker.data.lTracking;
		if(art=='sellprice'){
			tradeTracker.trackSell=true;			
		} else {
			tradeTracker.trackBuy=true;	
		}
		tradeTracker.lStorage.save();
		obj.setAttribute( "onClick", "tradeTracker.stopTracking('"+art+"',this)" );
		tradeTracker.tracking(art,obj);
	},
	stopTracking:function(art,obj){
		console.log("stop");
		obj.innerHTML=(art=="sellprice")?tradeTracker.data.lSellPrice:tradeTracker.data.lBuyPrice;
		if(art=='sellprice'){
			tradeTracker.trackSell=false;			
		} else {
			tradeTracker.trackBuy=false;	
		}
		obj.setAttribute( "onClick", "tradeTracker.startTracking(this,'"+art+"')" );
	},
	
	lStorage:{
		save: function(){
			val="";
			val+=$("#sellpricewood").val()+";";
			val+=$("#sellpricestone").val()+";";
			val+=$("#sellpriceiron").val()+";";
			val+=$("#buypricewood").val()+";";
			val+=$("#buypricestone").val()+";";
			val+=$("#buypriceiron").val();		
			localStorage.setItem("tradeTracker", val);
		},
		load: function(){
			val=(localStorage.getItem("tradeTracker"))?localStorage.getItem("tradeTracker").split(";"):new Array(1,1,1,1,1,1);
			$("#sellpricewood").val(val[0]);
			$("#sellpricestone").val(val[1]);
			$("#sellpriceiron").val(val[2]);
			$("#buypricewood").val(val[3]);
			$("#buypricestone").val(val[4]);
			$("#buypriceiron").val(val[5]);
		},
	},
	
	tracking: function(art,obj){
		console.log("tracking...");
		wood=parseInt($('#premium_exchange_rate_wood .premium-exchange-sep')[0].innerHTML.split("> ")[1]);
		stone=parseInt($('#premium_exchange_rate_stone .premium-exchange-sep')[0].innerHTML.split("> ")[1]);
		iron=parseInt($('#premium_exchange_rate_iron .premium-exchange-sep')[0].innerHTML.split("> ")[1]);
		swood=parseInt($("#"+art+"wood").val());
		sstone=parseInt($("#"+art+"stone").val());
		siron=parseInt($("#"+art+"iron").val());
		if(art=="sellprice"){
			tester=wood<swood||iron<siron||stone<sstone;
			reran=tradeTracker.trackSell;
		} else {
			tester=wood>swood||iron>siron||stone>sstone;
			reran=tradeTracker.trackBuy;
		}
		if(tester){
			tradeTracker.stopTracking(art,obj);
			var notify = new Notification("Thanks for letting notify you");
			var notification = new Notification("Hi there!");
			UI.Notification.show(Format.image_src("notification/report_world_end.png"),_("3b91a73f7c6c25e359dc129944e1515a"),_("21cd77f1b7feddd587727b82b30a7a82"));
			alert(tradeTracker.data.lFoundAlert);
		} else {
			if(reran){
				setTimeout(function(){tradeTracker.tracking(art,obj);},10000);
			}
		}
	},
	
    initFeedBackForm: function(data) {
		if(!document.getElementById("akk_msg")){
			var htmldata="";
			var divNode = document.createElement('div');
			divNode.id='akk_msg';
			htmldata='<img style = "border-radius: 15px 0px 0px 15px;float:left; margin-right:5px" src="https://dl.dropboxusercontent.com/s/de0p634sfrsf8u9/logo100.JPG" height="80" width="75"></div width="'+(-data.akkRight)+'">'+data.lName+'<br />Версия: '+data.version+'<br /><a target="_blank" href="'+data.site+'">Страница скрипта</a><br /><a target="_blank" href="'+data.forum+'">Форум игры</a></div>';
			divNode.innerHTML = htmldata;
			divNode.style.zIndex="999999"
			divNode.style.position="fixed";
			divNode.style.display="block";
			divNode.style.top="0px";
			divNode.style.right=data.akkRight+"px";
			divNode.style.backgroundColor="orange";
			divNode.style.borderRadius="15px 0px 0px 15px";
			divNode.style.minWidth=(70-data.akkRight)+'px';
			divNode.onmouseover=function(){this.style.right="0"};
			divNode.onmouseout=function(){this.style.right=data.akkRight+"px"};
			document.body.appendChild(divNode);
		}
    },

    init: function() {
		this.data.checkLang();
        if(document.URL.search(this.data.url) != -1) {
			if(game_data.market=='ru'){
				this.initFeedBackForm(this.data);
			}           
			this.insertRows.init();
        } else {
            UI.ErrorMessage(this.data.lWrongPlace,10000);
        }
    },
};

tradeTracker.init();
