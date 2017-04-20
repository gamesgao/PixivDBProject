var testVM = new Vue({
	el:'#test',
	data:{
		message:1,
		cMessage:1
	},
	methods:{
		plusOne: function(){
			this.message += 1 
		}
	},
	computed:{
		computedMessage: function(){
			this.cMessage += 1;
			return this.cMessage + this.message;
		}
	}
});