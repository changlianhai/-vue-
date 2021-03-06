/*
 * 定义vue的filter
 */ 
function vueFilterInit(){
	/**
	 * 将时间戳转为目标时间格式
	 */
	Vue.filter("showDate",function(d,f){
		if(!d){
			return;
		}
		if(!f){
			f='yyyy-MM-dd HH:mm:ss';
		}
		var sd=new Date(d).pattern(f);
		return sd;
	});
	/**
	 * 设置字段截取，默认截取长度30
	 */
	Vue.filter('substr',function(v,s){
		s=s||30;
		return v.substring(0,s);
	});
	/**
	 * 设置字段默认值
	 */ 
	Vue.filter('def',function(v,s){
		return v?v:s;
	});
}